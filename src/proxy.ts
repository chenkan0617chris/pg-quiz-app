import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse, type NextRequest } from 'next/server';
import { languageFromPath, preferredLanguage, type Language } from '@/lib/language';

/**
 * Pre-i18n URLs kept working after every public page moved under a locale
 * prefix. The destination is negotiated per request, so these stay temporary
 * redirects — a cached 308 would pin one language onto every visitor.
 */
const LEGACY_PATHS: Record<string, string> = {
  '/': '',
  '/pipeline': '/pipeline',
  '/series': '/series',
  '/numerical': '/numerical',
  '/practice': '/practice',
  '/exams': '/exams',
  '/grid': '/grid',
  '/peak': '/peak',
  '/data-interpretation': '/practice',
};

/** Search crawlers send no `Accept-Language`, so they land on the English tree. */
function negotiate(request: NextRequest): Language {
  const accepted = (request.headers.get('accept-language') ?? '').split(',')[0].split(';')[0].trim();
  return preferredLanguage(request.cookies.get('lang')?.value ?? null, [accepted]);
}

export default clerkMiddleware((auth, request) => {
  const { pathname } = request.nextUrl;

  const legacy = LEGACY_PATHS[pathname];
  if (legacy !== undefined) {
    const url = request.nextUrl.clone();
    url.pathname = `/${negotiate(request)}${legacy}`;
    return NextResponse.redirect(url);
  }

  // The root layout renders <html lang> server-side and needs the URL to do it.
  const headers = new Headers(request.headers);
  headers.set('x-pathname', pathname);
  const response = NextResponse.next({ request: { headers } });
  // Remember the language last read, so unprefixed pages such as /billing
  // (and the price it charges) match the page the visitor came from.
  const pageLanguage = languageFromPath(pathname);
  if (pageLanguage && request.cookies.get('lang')?.value !== pageLanguage) {
    response.cookies.set('lang', pageLanguage, { path: '/', maxAge: 31536000, sameSite: 'lax' });
  }
  return response;
}, {
  ...(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith('pk_live_')
    ? { authorizedParties: ['https://quiz.ckautoflow.com'] }
    : {}),
});

export const config = {
  matcher: ['/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)', '/(api|trpc)(.*)'],
};
