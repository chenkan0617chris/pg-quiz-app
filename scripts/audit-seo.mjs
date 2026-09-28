#!/usr/bin/env node
// Audit the rendered HTML that search crawlers receive. Does not claim indexation.
import assert from 'node:assert/strict';
const base=process.env.SEO_BASE_URL||'https://quiz.ckautoflow.com';
const canonicalOrigin='https://quiz.ckautoflow.com';
const agent=process.env.SEO_USER_AGENT||'Googlebot';
const decode=s=>s.replace(/&amp;/g,'&').replace(/&#x27;/g,"'").replace(/&quot;/g,'"');
function attrs(tag){return Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([,k,v])=>[k,decode(v)]));}
async function get(path){const r=await fetch(new URL(path,base),{headers:{'User-Agent':agent},redirect:'manual',signal:AbortSignal.timeout(30000)});assert.equal(r.status,200,`${path}: HTTP ${r.status}`);assert.ok(!/noindex/i.test(r.headers.get('x-robots-tag')||''),`${path}: X-Robots-Tag`);return r.text();}
const xml=await get('/sitemap.xml');
const urls=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>decode(m[1]));
assert.ok(urls.length>0,'Empty sitemap');assert.equal(new Set(urls).size,urls.length,'Duplicate sitemap URLs');
const titles=new Set();let schemas=0;
for(const url of urls){
 const path=new URL(url).pathname;const lang=path.split('/')[1];
 const html=await get(path);const title=html.match(/<title>(.*?)<\/title>/s)?.[1];
 assert.ok(title,`${path}: missing title`);assert.ok(!titles.has(title),`${path}: duplicate title`);titles.add(title);
 assert.equal([...html.matchAll(/<h1(?:\s|>)/g)].length,1,`${path}: expected one h1`);
 assert.ok(html.includes(`lang="${lang==='zh'?'zh-CN':'en'}"`),`${path}: wrong language`);
 const links=[...html.matchAll(/<link\s[^>]+>/g)].map(m=>attrs(m[0]));
 assert.equal(links.find(l=>l.rel==='canonical')?.href,url,`${path}: canonical`);
 for(const code of ['zh-CN','en','x-default'])assert.ok(links.some(l=>l.rel==='alternate'&&l.hrefLang===code),`${path}: missing ${code}`);
 const metas=[...html.matchAll(/<meta\s[^>]+>/g)].map(m=>attrs(m[0]));
 assert.ok(metas.some(m=>m.name==='description'&&m.content),`${path}: missing description`);
 assert.ok(!metas.some(m=>['robots','googlebot'].includes(m.name)&&/noindex/.test(m.content)),`${path}: noindex`);
 const data=[...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(m=>JSON.parse(m[1]));schemas+=data.length;
 assert.ok(data.length,`${path}: no server-rendered JSON-LD`);
 if(path.endsWith('/pricing')){
  const offer=data.find(d=>d['@type']==='SoftwareApplication')?.offers;
  assert.ok(offer,`${path}: no Offer`);
  const shown=`A$${offer.price} ${offer.priceCurrency}`;
  assert.ok(html.includes(shown),`${path}: visible price differs from Offer`);
 }
 if(path.includes('/guides/')){
  const article=data.find(d=>d['@type']==='Article');
  assert.ok(article?.author?.url?.endsWith(`/${lang}/about`),`${path}: author link`);
  assert.ok(article.datePublished<=article.dateModified,`${path}: date order`);
 }
 console.log(`OK ${path}`);
}
for(const path of ['/billing','/sign-in','/sign-up']){
 const html=await get(path);assert.match(html,/<meta name="robots" content="[^"]*noindex/,`${path}: missing noindex`);
}
assert.ok(urls.every(url=>new URL(url).origin===canonicalOrigin),'Off-domain sitemap URL');
console.log(`PASS: ${urls.length} indexable pages, ${schemas} JSON-LD blocks, 3 noindex pages; crawler=${agent}`);
