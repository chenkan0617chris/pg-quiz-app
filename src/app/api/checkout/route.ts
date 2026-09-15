import { PRICE_AMOUNT,PRICE_CURRENCY,isCurrentPrice } from '@/lib/payment-product';
import { auth } from '@clerk/nextjs/server';
import { randomUUID } from 'node:crypto';
import { getAccess } from '@/lib/access';
import { allowRequest,database } from '@/lib/db';
import { paymentsEnabled,stripeClient } from '@/lib/payments';
export async function POST(request:Request){
 const {userId}=await auth();
 if(!userId)return Response.json({error:'Unauthorized'},{status:401});
 if(!paymentsEnabled())return Response.json({error:'Payments are not open yet'},{status:503});
 const origin=process.env.VERCEL_ENV==='production'?'https://quiz.ckautoflow.com':new URL(request.url).origin;
 if(request.headers.get('origin')!==origin)return Response.json({error:'Invalid origin'},{status:403});
 try{
  if(!await allowRequest(userId,'checkout',5))return Response.json({error:'Too many requests'},{status:429});
  const access=await getAccess(userId);
  if(access.status==='paid')return Response.json({error:'Your paid access is still active'},{status:409});
  const stripe=stripeClient();
  const live=/^(sk|rk)_live_/.test(process.env.STRIPE_SECRET_KEY!);
  const sql=database();
  let order;
  for(let attempt=0;attempt<3;attempt++){
   [order]=await sql`INSERT INTO payment_orders(id,user_id,livemode,amount,currency) VALUES (${randomUUID()},${userId},${live},${PRICE_AMOUNT},${PRICE_CURRENCY})
    ON CONFLICT (user_id,livemode) WHERE status='pending' DO UPDATE SET user_id=excluded.user_id RETURNING id,session_id,amount,currency`;
   const current=isCurrentPrice(order as {amount:number;currency:string});
   if(order.session_id){
    const existing=await stripe.checkout.sessions.retrieve(order.session_id);
    if(existing.status==='open'&&current&&existing.url)return Response.json({url:existing.url},{headers:{'Cache-Control':'no-store'}});
    if(existing.status==='complete')return Response.json({error:'Payment is processing. Please refresh shortly.'},{status:409});
    if(existing.status==='open')await stripe.checkout.sessions.expire(existing.id);
   }else if(current){break;}
   await sql`UPDATE payment_orders SET status='expired' WHERE id=${order.id} AND status='pending'`;
   order=undefined;
  }
  if(!order)return Response.json({error:'Please retry checkout'},{status:409});
  const session=await stripe.checkout.sessions.create({
   mode:'payment',adaptive_pricing:{enabled:false},locale:'auto',integration_identifier:'quiz_checkout_qztrialx',
   line_items:[{price_data:{currency:PRICE_CURRENCY,unit_amount:PRICE_AMOUNT,product_data:{name:'Quiz 30-day access / 30 天使用权',description:'One-time purchase, no automatic renewal / 一次购买，不自动续费'}},quantity:1}],
   client_reference_id:userId,metadata:{order_id:order.id},payment_intent_data:{metadata:{order_id:order.id}},
   success_url:origin+'/billing?result=processing',cancel_url:origin+'/billing?result=cancelled',
  },{idempotencyKey:'quiz-order-'+order.id});
  await sql`UPDATE payment_orders SET session_id=${session.id} WHERE id=${order.id}`;
  return Response.json({url:session.url},{headers:{'Cache-Control':'no-store'}});
 }catch{return Response.json({error:'Unable to start checkout'},{status:503});}
}
