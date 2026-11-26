import { isCurrentPrice,priceFor } from '@/lib/payment-product';
import { isLanguage } from '@/lib/language';
import { auth } from '@clerk/nextjs/server';
import { randomUUID } from 'node:crypto';
import { getAccess } from '@/lib/access';
import { allowRequest,database } from '@/lib/db';
import { recordConversion } from '@/lib/conversion-store';
import { paymentsEnabled,stripeClient } from '@/lib/payments';
import { recordCheckoutClick } from '@/lib/checkout-clicks';
import { checkoutSource,type CheckoutOutcome } from '@/lib/checkout-click-policy';
async function checkoutResponse(userId:string,url:string) {
 try {await recordConversion(userId,'checkout_started');}catch { /* Checkout remains available if analytics is temporarily unavailable. */ }
 return Response.json({url},{headers:{'Cache-Control':'no-store'}});
}
export async function POST(request:Request){
 const {userId}=await auth();
 if(!userId)return Response.json({error:'Unauthorized'},{status:401});
 if(!paymentsEnabled())return Response.json({error:'Payments are not open yet'},{status:503});
 const origin=process.env.VERCEL_ENV==='production'?'https://quiz.ckautoflow.com':new URL(request.url).origin;
 if(request.headers.get('origin')!==origin)return Response.json({error:'Invalid origin'},{status:403});
 const body=await request.json().catch(()=>null) as {lang?:string;source?:unknown}|null;
 const lang=isLanguage(body?.lang)?body.lang:'zh';
 const plan=priceFor(lang);
 // One row per click; a logging failure never changes what the buyer sees.
 const click=async(outcome:CheckoutOutcome,orderId?:string)=>{
  try{await recordCheckoutClick({userId,source:checkoutSource(body?.source),lang,amount:plan.amount,currency:plan.currency,outcome,orderId});}catch{/* ignore */}
 };
 try{
  if(!await allowRequest(userId,'checkout',5)){await click('rate_limited');return Response.json({error:'Too many requests'},{status:429});}
  const access=await getAccess(userId);
  if(access.status==='paid'){await click('already_paid');return Response.json({error:'Your paid access is still active'},{status:409});}
  const stripe=stripeClient();
  const live=/^(sk|rk)_live_/.test(process.env.STRIPE_SECRET_KEY!);
  const sql=database();
  let order;
  for(let attempt=0;attempt<3;attempt++){
   [order]=await sql`INSERT INTO payment_orders(id,user_id,livemode,amount,currency) VALUES (${randomUUID()},${userId},${live},${plan.amount},${plan.currency})
    ON CONFLICT (user_id,livemode) WHERE status='pending' DO UPDATE SET user_id=excluded.user_id RETURNING id,session_id,amount,currency`;
   const current=isCurrentPrice(order as {amount:number;currency:string},plan);
   if(order.session_id){
    const existing=await stripe.checkout.sessions.retrieve(order.session_id);
    if(existing.status==='open'&&current&&existing.url){await click('redirected',order.id);return checkoutResponse(userId,existing.url);}
    if(existing.status==='complete'){await click('processing',order.id);return Response.json({error:'Payment is processing. Please refresh shortly.'},{status:409});}
    if(existing.status==='open')await stripe.checkout.sessions.expire(existing.id);
   }else if(current){break;}
   await sql`UPDATE payment_orders SET status='expired' WHERE id=${order.id} AND status='pending'`;
   order=undefined;
  }
  if(!order){await click('error');return Response.json({error:'Please retry checkout'},{status:409});}
  const session=await stripe.checkout.sessions.create({
   mode:'payment',adaptive_pricing:{enabled:false},locale:'auto',integration_identifier:'quiz_checkout_qztrialx',
   line_items:[{price_data:{currency:plan.currency,unit_amount:plan.amount,product_data:{name:'Quiz 7-day access / 7 天会员',description:'All features, one-time payment / 全部功能，一次付款使用 7 天'}},quantity:1}],
   client_reference_id:userId,metadata:{order_id:order.id},payment_intent_data:{metadata:{order_id:order.id}},
   success_url:origin+'/billing?result=processing',cancel_url:origin+'/billing?result=cancelled',
  },{idempotencyKey:'quiz-order-'+order.id});
  await sql`UPDATE payment_orders SET session_id=${session.id} WHERE id=${order.id}`;
  if(!session.url)throw new Error('Checkout URL unavailable');
  await click('redirected',order.id);
  return checkoutResponse(userId,session.url);
 }catch{await click('error');return Response.json({error:'Unable to start checkout'},{status:503});}
}
