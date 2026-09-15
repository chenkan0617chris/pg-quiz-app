export type Language = 'zh' | 'en';

export function isLanguage(value: string | null | undefined): value is Language {
  return value === 'zh' || value === 'en';
}

/** Honour an explicit choice, otherwise use the browser's primary language. */
export function preferredLanguage(saved: string | null, languages: readonly string[]): Language {
  if (isLanguage(saved)) return saved;
  return /^zh(?:-|$)/i.test(languages[0] ?? '') ? 'zh' : 'en';
}

/** The locale a URL already declares, or null when the path carries no prefix. */
export function languageFromPath(pathname: string): Language | null {
  const first = pathname.split('/')[1];
  return isLanguage(first) ? first : null;
}

/**
 * Swap the locale prefix on a path, keeping the rest of the URL intact.
 * Used by the language switcher so toggling language changes the URL rather
 * than serving different content at the same address.
 */
export function withLanguage(pathname: string, lang: Language): string {
  const segments = pathname.split('/');
  if (isLanguage(segments[1])) {
    segments[1] = lang;
    return segments.join('/');
  }
  return `/${lang}${pathname === '/' ? '' : pathname}`;
}
