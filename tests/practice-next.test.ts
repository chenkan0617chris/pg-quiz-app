import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import PracticeNext from '../src/components/PracticeNext';

test('solver follow-up links to the matching practice type in the page language', () => {
  for (const [kind, lang] of [['pipeline', 'en'], ['numerical', 'zh'], ['figure', 'en']] as const) {
    const html = renderToStaticMarkup(createElement(PracticeNext, { kind, lang }));
    assert.match(html, new RegExp(`href="/${lang}/practice\\?kind=${kind}"`));
  }
  assert.match(renderToStaticMarkup(createElement(PracticeNext, { kind: 'pipeline', lang: 'zh' })), /练 5 道同类管道题/);
});
