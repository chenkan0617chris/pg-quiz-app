import { SignUp } from '@clerk/nextjs';
import { NOINDEX } from '@/lib/seo';

export const metadata = { title: 'Sign up', ...NOINDEX };

export default function SignUpPage() { return <div className="flex justify-center py-8"><SignUp /></div>; }
