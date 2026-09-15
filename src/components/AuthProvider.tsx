'use client';
import { ClerkProvider } from '@clerk/nextjs';
import { zhCN, enUS } from '@clerk/localizations';
import { useI18n } from '@/lib/i18n';

export default function AuthProvider({children}:{children:React.ReactNode}) {
  const {lang} = useI18n();
  return <ClerkProvider localization={lang === 'zh' ? zhCN : enUS} signInUrl="/sign-in" signUpUrl="/sign-up" signInFallbackRedirectUrl="/pipeline" signUpFallbackRedirectUrl="/pipeline">{children}</ClerkProvider>;
}
