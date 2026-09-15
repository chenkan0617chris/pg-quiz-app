import { SignIn } from '@clerk/nextjs';
import { NOINDEX } from '@/lib/seo';

export const metadata = { title: 'Sign in', ...NOINDEX };

export default function SignInPage() { return <div className="flex justify-center py-8"><SignIn /></div>; }
