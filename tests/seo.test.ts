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
