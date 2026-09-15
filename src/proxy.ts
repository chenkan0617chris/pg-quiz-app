import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse, type NextRequest } from 'next/server';
import { preferredLanguage, type Language } from '@/lib/language';

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
  return NextResponse.next({ request: { headers } });
}, {
  ...(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith('pk_live_')
    ? { authorizedParties: ['https://quiz.ckautoflow.com'] }
    : {}),
});

export const config = {
  matcher: ['/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)', '/(api|trpc)(.*)'],
};
