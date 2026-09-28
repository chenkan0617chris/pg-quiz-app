import type { MetadataRoute } from 'next';
import { GUIDE_SLUGS, getGuide, isGuideSlug } from '@/content/guides';
import { EDITORIAL_UPDATED } from '@/content/product-info';
import { absolute, localePath, SITE_URL } from '@/lib/seo';

/** Locale-relative paths, listed once and emitted for every language. */
const PATHS: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '', priority: 1, changeFrequency: 'weekly' },
  { path: '/practice', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/pricing', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/guides', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/pipeline', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/series', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/memory', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/numerical', priority: 0.8, changeFrequency: 'monthly' },
  ...GUIDE_SLUGS.map((slug) => ({
    path: `/guides/${slug}`,
    priority: 0.7,
    changeFrequency: 'monthly' as const,
  })),
];

export default function sitemap(): MetadataRoute.Sitemap {

  return PATHS.flatMap(({ path, priority, changeFrequency }) =>
    (['zh', 'en'] as const).map((lang) => ({
      url: absolute(localePath(lang, path)),
      // Do not pretend every rebuild is an editorial update. Omit unknown dates.
      ...(['', '/pricing', '/about'].includes(path) ? { lastModified: EDITORIAL_UPDATED } : {}),
      ...(isGuideSlug(path.split('/')[2] ?? '') ? { lastModified: getGuide(lang, path.split('/')[2] as Parameters<typeof getGuide>[1]).updated } : {}),
      changeFrequency,
      priority,
      alternates: {
        // Next.js does not add a self-referencing alternate, so both locales are
        // listed explicitly to keep every hreflang cluster reciprocal.
        languages: {
          'zh-CN': absolute(localePath('zh', path)),
          en: absolute(localePath('en', path)),
          'x-default': path === '' ? SITE_URL : absolute(localePath('en', path)),
        },
      },
    })),
  );
}
