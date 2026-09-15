import type { Language } from '@/lib/language';

/** A minimal prose vocabulary shared by every editorial page. */
export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string; id?: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'note'; text: string }
  | { type: 'example'; title: string; lines: string[] };

export type Faq = { q: string; a: string };

export type Localised<T> = Record<Language, T>;
