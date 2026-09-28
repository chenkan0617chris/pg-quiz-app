import { NOINDEX } from '@/lib/seo';
import AccountPage from '@/components/AccountPage';
export const metadata={title:'我的账号 · My account',...NOINDEX};
export default function Page(){return <AccountPage/>;}
