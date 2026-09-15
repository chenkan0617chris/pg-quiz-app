import { headers, cookies } from 'next/headers';
import type { Metadata } from 'next';
import { languageFromPath, preferredLanguage } from '@/lib/language';
import { HREFLANG, SITE_URL } from '@/lib/seo';
import './globals.css';
import { I18nProvider } from '@/lib/i18n';
import Sidebar from '@/components/Sidebar';
import AuthProvider from '@/components/AuthProvider';
import AccountControls from '@/components/AccountControls';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: '宝洁笔试题库 P&G Test Prep | 宝洁笔试与在线测评练习',
  description: '宝洁笔试与在线测评练习：管道推理、图形推理、数字推理、图表数据分析。P&G online assessment practice.',
  applicationName: 'P&G Test Prep',
  formatDetection: { telephone: false },
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
              <main className="flex-1 px-4 py-8 sm:px-8">
                <div className="mx-auto w-full max-w-5xl"><AccountControls />{children}</div>
              </main>
            </div>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
