import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Account-only and machine endpoints carry no search value and would
        // otherwise burn crawl budget on pages that redirect or require auth.
        disallow: ['/api/', '/sign-in', '/sign-up', '/billing'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
