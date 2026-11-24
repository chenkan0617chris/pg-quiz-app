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

test('x-default never points at the redirecting root', () => {
  // "/" answers 307, so naming it as an alternate tells Google to prefer it
  // over /en, which then gets filed as a duplicate.
  assert.equal(alternates('zh').languages?.['x-default'], '/en');
  assert.equal(alternates('en').languages?.['x-default'], alternates('en').canonical);
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

test('sitemap alternates repeat the hreflang set in the page head', () => {
 for(const entry of sitemap()){
  const [,lang,path]=/^https:\/\/quiz\.ckautoflow\.com\/(zh|en)(.*)$/.exec(entry.url)!;
  const head=alternates(lang as 'zh'|'en',path).languages!;
  assert.deepEqual(entry.alternates?.languages,Object.fromEntries(Object.entries(head).map(([tag,url])=>[tag,`https://quiz.ckautoflow.com${url}`])));
 }
});

test('every sitemap page carries a real, non-future edit date', () => {
 const tomorrow=new Date(Date.now()+864e5).toISOString().slice(0,10);
 for(const entry of sitemap()){
  assert.match(String(entry.lastModified),/^\d{4}-\d{2}-\d{2}$/,entry.url);
  assert.ok(String(entry.lastModified)<=tomorrow,entry.url);
 }
});

test('pages rewritten on 22 November say so in the sitemap', () => {
 const entries=sitemap();
 for(const lang of ['zh','en'])for(const path of ['','/exams','/grid','/peak','/verbal','/practice','/pricing','/guides','/pipeline','/series','/memory','/numerical']){
  const entry=entries.find(e=>e.url===`https://quiz.ckautoflow.com/${lang}${path}`);
  assert.ok(String(entry?.lastModified)>='2026-11-22',`${lang}${path} ${entry?.lastModified}`);
 }
});

test('revised preparation guides show their real revision date', () => {
 for(const lang of ['zh','en'] as const){
  assert.equal(getGuide(lang,'assessment').updated,'2026-11-22');
  assert.equal(getGuide(lang,'memory').updated,'2026-11-10');
 }
});

test('guide links to practice describe the destination', () => {
 assert.equal(getGuide('en','aon-assessment').toolLabel,'Aon Switch Challenge practice');
 // Practice questions are random; the five fixed samples no longer exist.
 assert.doesNotMatch(getGuide('en','assessment').toolLabel,/fixed/i);
});
