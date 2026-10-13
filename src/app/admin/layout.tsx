import type { Metadata } from 'next';
export const metadata:Metadata={title:'用户使用后台 | CK Quiz',robots:{index:false,follow:false,googleBot:{index:false,follow:false}}};
export const dynamic='force-dynamic';
export default function AdminLayout({children}:{children:React.ReactNode}) {return <div lang="zh-CN">{children}</div>;}
