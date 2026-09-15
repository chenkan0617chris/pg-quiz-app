import { paymentsEnabled } from '@/lib/payments';
import { NOINDEX } from '@/lib/seo';
import Purchase from './purchase';

export const metadata = { title: '试用与购买 Trial & pricing', ...NOINDEX };

export default function BillingPage(){return <Purchase enabled={paymentsEnabled()}/>;}
export const dynamic='force-dynamic';
