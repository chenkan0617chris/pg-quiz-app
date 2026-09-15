import { matchesOrderPayment } from '@/lib/payment-product';
import { database } from '@/lib/db';
import { stripeClient } from '@/lib/payments';
export async function POST(request:Request){
 const secret=process.env.STRIPE_WEBHOOK_SECRET;
 if(!secret)return new Response('Unavailable',{status:503});
 let event;
 const stripe=stripeClient();
 try{
  const body=await request.text();
  if(body.length>262144)return new Response('Too large',{status:413});
  event=stripe.webhooks.constructEvent(body,request.headers.get('stripe-signature')??'',secret);
 }catch{return new Response('Invalid signature',{status:400});}
 try{
  const sql=database();
  if(event.type==='checkout.session.completed'||event.type==='checkout.session.async_payment_succeeded'){
   const session=await stripe.checkout.sessions.retrieve(event.data.object.id);
   if(session.payment_status!=='paid')return new Response('Pending');
   const orderId=session.metadata?.order_id;
   if(!orderId)return new Response('Unrelated');
   const [order]=await sql`SELECT * FROM payment_orders WHERE id=${orderId}`;
   if(!order||!matchesOrderPayment(order as Parameters<typeof matchesOrderPayment>[0],session))return new Response('Order mismatch',{status:400});
   const intent=typeof session.payment_intent==='string'?session.payment_intent:session.payment_intent?.id;
   if(!intent)return new Response('Missing payment',{status:400});
   // Retrieve the charge so a refund delivered before completion cannot reopen access.
   await sql`SELECT fulfill_quiz_payment(${orderId}::uuid,${session.id},${intent},${session.livemode})`;
   const payment=await stripe.paymentIntents.retrieve(intent,{expand:['latest_charge']});
   if(payment.latest_charge&&typeof payment.latest_charge!=='string'&&payment.latest_charge.refunded)
    await sql`SELECT refund_quiz_payment(${intent},${session.livemode})`;
  }else if(event.type==='charge.refunded'){
   const charge=await stripe.charges.retrieve(event.data.object.id);
   if(charge.refunded&&typeof charge.payment_intent==='string')await sql`SELECT refund_quiz_payment(${charge.payment_intent},${charge.livemode})`;
  }
  return new Response('OK');
 }catch{return new Response('Processing failed',{status:500});}
}
