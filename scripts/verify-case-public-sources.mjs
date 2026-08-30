import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ledger = JSON.parse(fs.readFileSync(path.join(root, 'data/case-public-sources.json'), 'utf8'));
const baseUrl = 'https://digitool-lab.com/';
const findings = [];
const stamp = Date.now().toString();

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function articleNodes(value, found = []) {
  if (!value || typeof value !== 'object') return found;
  if (Array.isArray(value)) {
    for (const item of value) articleNodes(item, found);
    return found;
  }
  const types = Array.isArray(value['@type']) ? value['@type'] : [value['@type']];
  if (types.includes('Article')) found.push(value);
  if (Array.isArray(value['@graph'])) articleNodes(value['@graph'], found);
  return found;
}

function articlesFromHtml(html, page) {
  const articles = [];
  for (const match of html.matchAll(/<script\b[^>]*\btype=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      articleNodes(JSON.parse(match[1].trim()), articles);
    } catch {
      findings.push(`${page}: production JSON-LD is invalid.`);
    }
  }
  return articles;
}

async function get(pathname) {
  const url = new URL(pathname, baseUrl);
  url.searchParams.set('case_source_check', stamp);
  return fetch(url, {
    redirect: 'follow',
    headers: {
      accept: 'text/html,application/json,application/xml;q=0.9,*/*;q=0.8',
      'cache-control': 'no-cache',
      'user-agent': 'DigitalToolLabCaseSourceVerifier/1.0',
    },
    signal: AbortSignal.timeout(15_000),
  });
}

let caseData = [];
let sitemap = '';
try {
  const [caseResponse, sitemapResponse] = await Promise.all([
    get('data/case-studies.json'),
    get('sitemap.xml'),
  ]);
  if (caseResponse.status !== 200) findings.push(`data/case-studies.json: expected 200, received ${caseResponse.status}.`);
  if (sitemapResponse.status !== 200) findings.push(`sitemap.xml: expected 200, received ${sitemapResponse.status}.`);
  if (caseResponse.status === 200) caseData = await caseResponse.json();
  if (sitemapResponse.status === 200) sitemap = await sitemapResponse.text();
} catch (error) {
  findings.push(`production discovery fetch failed: ${error.message}`);
}

let sourceCount = 0;
for (const entry of ledger.entries ?? []) {
  sourceCount += entry.sources.length;
  try {
    const response = await get(entry.url);
    const html = await response.text();
    if (response.status !== 200) {
      findings.push(`${entry.url}: expected 200, received ${response.status}.`);
      continue;
    }

    const blockCount = (html.match(/class=["'][^"']*\barticle-sources\b[^"']*["']/gi) ?? []).length;
    if (blockCount !== 1) findings.push(`${entry.url}: expected one production source block, found ${blockCount}.`);
    if (!html.includes('>出典・参考資料</h2>')) findings.push(`${entry.url}: production source heading is missing.`);
    if (!html.includes('リンク先の事実と、当社による整理・解説を区別')) findings.push(`${entry.url}: production source explanation is missing.`);
    const robots = html.match(/<meta\b(?=[^>]*\bname=["']robots["'])[^>]*>/i)?.[0] ?? '';
    if (/noindex/i.test(robots)) findings.push(`${entry.url}: verified production page has robots noindex.`);

    for (const source of entry.sources) {
      const expectedLink = `<a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer"`;
      if (!html.includes(expectedLink)) findings.push(`${entry.url}: production source link is missing for ${source.url}.`);
      if (!html.includes(`>${escapeHtml(source.title)}</a>`)) findings.push(`${entry.url}: production source title is missing for ${source.url}.`);
    }

    const articles = articlesFromHtml(html, entry.url);
    if (articles.length !== 1) {
      findings.push(`${entry.url}: expected one production Article node, found ${articles.length}.`);
    } else {
      const expectedCitations = entry.sources.map((source) => source.url);
      const citations = Array.isArray(articles[0].citation) ? articles[0].citation : [];
      if (JSON.stringify(citations) !== JSON.stringify(expectedCitations)) findings.push(`${entry.url}: production Article citation is stale.`);
      if (articles[0].dateModified !== ledger.reviewedAt) findings.push(`${entry.url}: production Article dateModified is stale.`);
    }
  } catch (error) {
    findings.push(`${entry.url}: production fetch failed: ${error.message}`);
  }

  const item = caseData.find?.((candidate) => candidate.url === entry.url);
  if (!item) {
    findings.push(`${entry.url}: production case-studies entry is missing.`);
  } else {
    if (item.evidenceStatus !== 'verified') findings.push(`${entry.url}: production evidenceStatus is stale.`);
    if (item.evidenceReviewedAt !== ledger.reviewedAt) findings.push(`${entry.url}: production evidenceReviewedAt is stale.`);
    if (item.publicSourceCount !== entry.sources.length) findings.push(`${entry.url}: production publicSourceCount is stale.`);
  }
  if (!sitemap.includes(`<loc>${new URL(entry.url, baseUrl).href}</loc>`)) {
    findings.push(`${entry.url}: verified production page is missing from sitemap.xml.`);
  }
}

if (findings.length > 0) {
  console.error('Production case public source verification failed.');
  console.error(findings.join('\n'));
  process.exit(1);
}

console.log(`Production case public source verification passed: ${ledger.entries.length} verified cases, ${sourceCount} visible source links.`);
