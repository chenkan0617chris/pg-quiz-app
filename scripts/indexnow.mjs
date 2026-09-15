#!/usr/bin/env node
/**
 * Notify IndexNow-participating search engines that our URLs changed.
 *
 * One endpoint fans out to Bing, Yandex, Naver and Seznam, and needs no
 * account — ownership is proven by serving the key at `keyLocation`.
 * Google does not participate in IndexNow; it has to be submitted through
 * Search Console instead.
 *
 * Usage: node scripts/indexnow.mjs [--dry-run]
 */

const HOST = 'quiz.ckautoflow.com';
const ORIGIN = `https://${HOST}`;
const KEY = process.env.INDEXNOW_KEY;

if (!KEY) {
  console.error('INDEXNOW_KEY is not set. It must match the key served at /<key>.txt.');
  process.exit(1);
}

async function urlsFromSitemap() {
  const response = await fetch(`${ORIGIN}/sitemap.xml`);
  if (!response.ok) throw new Error(`sitemap.xml returned ${response.status}`);
  const xml = await response.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

const dryRun = process.argv.includes('--dry-run');
const urlList = await urlsFromSitemap();
console.log(`${urlList.length} URLs from sitemap.xml`);

// The key file has to be reachable or the whole submission is rejected.
const keyCheck = await fetch(`${ORIGIN}/${KEY}.txt`);
const keyBody = (await keyCheck.text()).trim();
if (!keyCheck.ok || keyBody !== KEY) {
  console.error(`Key file check failed: ${ORIGIN}/${KEY}.txt returned ${keyCheck.status} "${keyBody.slice(0, 40)}"`);
  process.exit(1);
}
console.log('Key file verified.');

if (dryRun) {
  console.log(urlList.join('\n'));
  process.exit(0);
}

const response = await fetch('https://api.indexnow.org/IndexNow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${ORIGIN}/${KEY}.txt`, urlList }),
});

// 200 accepted, 202 accepted but key still being validated.
const text = await response.text();
console.log(`IndexNow responded ${response.status} ${response.statusText}${text ? ` ${text}` : ''}`);
process.exit(response.status === 200 || response.status === 202 ? 0 : 1);
