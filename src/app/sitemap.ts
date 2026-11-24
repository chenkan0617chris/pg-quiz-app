import type { MetadataRoute } from 'next';
import { GUIDE_SLUGS, getGuide, isGuideSlug } from '@/content/guides';
import { EDITORIAL_UPDATED } from '@/content/product-info';
import { absolute, alternates, localePath } from '@/lib/seo';

/**
 * Locale-relative paths, listed once and emitted for every language.
 *
 * `updated` is the day the page's own content last changed in substance. Bump it
 * by hand with the edit; stamping every deploy teaches crawlers to ignore it.
 */
const PATHS: { path: string; updated?: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '', updated: '2026-11-22', priority: 1, changeFrequency: 'weekly' },
  { path: '/exams', updated: '2026-11-22', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/grid', updated: '2026-11-22', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/peak', updated: '2026-11-22', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/verbal', updated: '2026-11-22', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/practice', updated: '2026-11-22', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/pricing', updated: '2026-11-22', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/about', updated: EDITORIAL_UPDATED, priority: 0.5, changeFrequency: 'monthly' },
  { path: '/guides', updated: '2026-11-22', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/pipeline', updated: '2026-11-22', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/series', updated: '2026-11-22', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/memory', updated: '2026-11-22', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/numerical', updated: '2026-11-22', priority: 0.8, changeFrequency: 'monthly' },
  ...GUIDE_SLUGS.map((slug) => ({
    path: `/guides/${slug}`,
    priority: 0.7,
    changeFrequency: 'monthly' as const,
  })),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.flatMap(({ path, updated, priority, changeFrequency }) =>
    (['zh', 'en'] as const).map((lang) => {
      const slug = path.split('/')[2] ?? '';
      return {
        url: absolute(localePath(lang, path)),
        lastModified: isGuideSlug(slug) ? getGuide(lang, slug).updated : updated,
        changeFrequency,
        priority,
        alternates: {
          // Same set as the page head, so the two can never disagree.
          languages: Object.fromEntries(
            Object.entries(alternates(lang, path).languages ?? {}).map(([tag, url]) => [tag, absolute(String(url))]),
          ),
        },
      };
    }),
  );
}
