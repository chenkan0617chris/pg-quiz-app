import Link from 'next/link';
import { headers, cookies } from 'next/headers';
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { languageFromPath, preferredLanguage } from '@/lib/language';
import { HREFLANG, SITE_URL, localePath } from '@/lib/seo';
import './globals.css';
import { I18nProvider } from '@/lib/i18n';
import Sidebar from '@/components/Sidebar';
import AuthProvider from '@/components/AuthProvider';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: '宝洁笔试题库 P&G Test Prep | 宝洁笔试与在线测评练习',
  description: '宝洁笔试与在线测评练习：管道推理、图形推理、数字推理、图表数据分析。P&G online assessment practice.',
  applicationName: 'CK Quiz',
  formatDetection: { telephone: false },
  // Set these in the hosting environment once each webmaster console issues a
  // code; no redeploy of this file is needed to add or rotate one.
  verification: {
    ...(process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : {}),
    ...(process.env.YANDEX_SITE_VERIFICATION ? { yandex: process.env.YANDEX_SITE_VERIFICATION } : {}),
    other: {
      ...(process.env.BING_SITE_VERIFICATION ? { 'msvalidate.01': process.env.BING_SITE_VERIFICATION } : {}),
      ...(process.env.BAIDU_SITE_VERIFICATION ? { 'baidu-site-verification': process.env.BAIDU_SITE_VERIFICATION } : {}),
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [requestHeaders, cookieStore] = await Promise.all([headers(), cookies()]);
  // Locale-prefixed URLs are authoritative. Only the few routes outside the
  // prefix (billing, auth) fall back to the stored or negotiated preference.
  const lang =
    languageFromPath(requestHeaders.get('x-pathname') ?? '') ??
    preferredLanguage(cookieStore.get('lang')?.value ?? null, [
      (requestHeaders.get('accept-language') ?? 'en').split(',')[0].split(';')[0].trim(),
    ]);

  return (
    <html lang={HREFLANG[lang]} className="h-full">
      <body className="min-h-full bg-white text-slate-900">
        <I18nProvider lang={lang}>
          <AuthProvider>
            <div className="flex min-h-screen">
              <Sidebar />
              <main className="min-w-0 flex-1 px-5 pb-8 pt-24 sm:px-8 md:pt-10 lg:px-10">
                <div className="mx-auto w-full max-w-5xl">{children}
                  <footer className="mt-12 flex flex-wrap gap-x-6 gap-y-3 border-t border-slate-200 pt-6 text-sm text-slate-600">
                    <Link href={localePath(lang, '/guides')}>{lang === 'zh' ? '解题攻略' : 'Solving guides'}</Link>
                    <Link href={localePath(lang, '/pricing')}>{lang === 'zh' ? '会员价格与免费体验' : 'Pricing and free access'}</Link>
                    <Link href={localePath(lang, '/about')}>{lang === 'zh' ? '关于本站与题目来源' : 'About and methodology'}</Link>
                  </footer>
                </div>
              </main>
            </div>
          </AuthProvider>
        </I18nProvider>
        <Analytics />
      </body>
    </html>
  );
}
