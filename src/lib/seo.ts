import type { Metadata } from 'next';
import type { Language } from './language';

/** Canonical origin. Every absolute URL in metadata, sitemap and JSON-LD derives from this. */
export const SITE_URL = 'https://quiz.ckautoflow.com';

export const LOCALES = ['zh', 'en'] as const;

/** BCP 47 tags used for `hreflang` and the `<html lang>` attribute. */
export const HREFLANG: Record<Language, string> = { zh: 'zh-CN', en: 'en' };

/** Open Graph locale identifiers. */
const OG_LOCALE: Record<Language, string> = { zh: 'zh_CN', en: 'en_US' };

export const SITE_NAME: Record<Language, string> = {
  zh: '宝洁笔试题库',
  en: 'P&G Test Prep',
};

/** Prefix a locale-relative path (`/pipeline`, or `''` for the home page). */
export function localePath(lang: Language, path = ''): string {
  return `/${lang}${path}`;
}

export function absolute(path: string): string {
  return `${SITE_URL}${path}`;
}

/**
 * Canonical + reciprocal hreflang set for one page.
 *
 * Every locale variant lists itself as well as its siblings, and `x-default`
 * points at the negotiating root so Google has an explicit fallback.
 */
export function alternates(lang: Language, path = ''): NonNullable<Metadata['alternates']> {
  return {
    canonical: localePath(lang, path),
    languages: {
      'zh-CN': localePath('zh', path),
      en: localePath('en', path),
      'x-default': path === '' ? '/' : localePath('en', path),
    },
  };
}

/** Build page metadata with canonical, hreflang, Open Graph and Twitter cards in one place. */
export function pageMetadata({
  lang,
  path = '',
  title,
  description,
  keywords,
  type = 'website',
  publishedTime,
}: {
  lang: Language;
  path?: string;
  title: string;
  description: string;
  keywords?: string[];
  type?: 'website' | 'article';
  publishedTime?: string;
}): Metadata {
  const url = localePath(lang, path);
  return {
    title,
    description,
    keywords,
    alternates: alternates(lang, path),
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: SITE_NAME[lang],
      locale: OG_LOCALE[lang],
      alternateLocale: OG_LOCALE[lang === 'zh' ? 'en' : 'zh'],
      images: [{ ...OG_IMAGE, alt: title }],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [OG_IMAGE.url],
    },
  };
}

/**
 * The root `opengraph-image` route. A page that sets `openGraph` replaces the
 * parent's object wholesale, so the image has to be restated rather than
 * inherited from the file convention.
 */
const OG_IMAGE = { url: '/opengraph-image', width: 1200, height: 630 };

/** Pages that exist for signed-in users only and must never enter the index. */
export const NOINDEX: Metadata = {
  robots: { index: false, follow: true },
};
