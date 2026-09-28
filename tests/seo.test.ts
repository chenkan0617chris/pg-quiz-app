import test from 'node:test';
import assert from 'node:assert/strict';

import { languageFromPath, withLanguage } from '../src/lib/language';
import { alternates, localePath } from '../src/lib/seo';

test('locale prefixes are read from and written to the path', () => {
  assert.equal(languageFromPath('/zh'), 'zh');
  assert.equal(languageFromPath('/en/guides/pipeline'), 'en');
  assert.equal(languageFromPath('/billing'), null);
  assert.equal(languageFromPath('/'), null);
  // "engine" must not be mistaken for the "en" locale.
  assert.equal(languageFromPath('/engine'), null);

  assert.equal(withLanguage('/zh/guides/pipeline', 'en'), '/en/guides/pipeline');
  assert.equal(withLanguage('/en', 'zh'), '/zh');
  assert.equal(withLanguage('/billing', 'zh'), '/zh/billing');
  assert.equal(withLanguage('/', 'en'), '/en');
});

test('every hreflang cluster is reciprocal and self-referencing', () => {
  for (const path of ['', '/practice', '/guides/pipeline']) {
    for (const lang of ['zh', 'en'] as const) {
      const { canonical, languages } = alternates(lang, path);
      // Google drops a cluster whose canonical is absent from its own hreflang set.
      assert.equal(canonical, localePath(lang, path));
      assert.equal(languages?.[lang === 'zh' ? 'zh-CN' : 'en'], canonical);
      assert.equal(languages?.['zh-CN'], localePath('zh', path));
      assert.equal(languages?.en, localePath('en', path));
      assert.ok(languages?.['x-default']);
    }
  }
});

test('the site root is the x-default only for the home page', () => {
  assert.equal(alternates('zh').languages?.['x-default'], '/');
  assert.equal(alternates('zh', '/practice').languages?.['x-default'], '/en/practice');
});

import sitemap from '../src/app/sitemap';
import robots from '../src/app/robots';
import { getGuide, GUIDE_SLUGS } from '../src/content/guides';

test('sitemap exposes public product information in both languages and uses editorial dates', () => {
 const entries=sitemap();
 for(const lang of ['zh','en'] as const){
  for(const path of ['/pricing','/about'])assert.ok(entries.some(e=>e.url===`https://quiz.ckautoflow.com/${lang}${path}`));
  for(const slug of GUIDE_SLUGS){
   const entry=entries.find(e=>e.url===`https://quiz.ckautoflow.com/${lang}/guides/${slug}`);
   assert.equal(entry?.lastModified,getGuide(lang,slug).updated);
  }
 }
 assert.equal(new Set(entries.map(e=>e.url)).size,entries.length);
 assert.ok(entries.every(e=>!e.url.includes('/billing')));
});

test('noindex account pages remain crawlable so crawlers can read the directive', () => {
 const rules=robots().rules;
 const groups=Array.isArray(rules)?rules:[rules];
 const blocked=groups.flatMap(g=>g.disallow??[]);
 for(const path of ['/billing','/sign-in','/sign-up'])assert.ok(!blocked.includes(path));
 assert.ok(blocked.includes('/api/'));
});
