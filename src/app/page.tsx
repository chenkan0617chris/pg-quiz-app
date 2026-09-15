import { headers, cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { preferredLanguage } from '@/lib/language';

/**
 * The proxy normally negotiates the locale before a request reaches here.
 * This fallback keeps the bare domain working if it ever does not.
 */
export default async function Home() {
  const [requestHeaders, cookieStore] = await Promise.all([headers(), cookies()]);
  const lang = preferredLanguage(cookieStore.get('lang')?.value ?? null, [
    (requestHeaders.get('accept-language') ?? 'en').split(',')[0].split(';')[0].trim(),
  ]);
  redirect(`/${lang}`);
}
