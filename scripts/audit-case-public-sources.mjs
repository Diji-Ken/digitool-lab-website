import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ledger = JSON.parse(fs.readFileSync(path.join(root, 'data/case-public-sources.json'), 'utf8'));
const cases = JSON.parse(fs.readFileSync(path.join(root, 'data/case-studies.json'), 'utf8'));
const evidenceGate = JSON.parse(fs.readFileSync(path.join(root, 'data/case-evidence-status.json'), 'utf8'));
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const findings = [];
const seenCases = new Set();
const seenSources = new Set();
const unverified = new Set((evidenceGate.entries ?? []).map((entry) => entry.url));

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function isPublicHttpsUrl(value) {
  try {
    const parsed = new URL(value);
    const host = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, '');
    if (parsed.protocol !== 'https:' || parsed.username || parsed.password) return false;
    if (host === 'localhost' || host.endsWith('.local') || host === '::1') return false;
    if (/^127\./.test(host) || /^10\./.test(host) || /^192\.168\./.test(host)) return false;
    const private172 = host.match(/^172\.(\d{1,3})\./);
    if (private172 && Number(private172[1]) >= 16 && Number(private172[1]) <= 31) return false;
    if (/^169\.254\./.test(host) || /^fc/i.test(host) || /^fd/i.test(host) || /^fe[89ab]/i.test(host)) return false;
    return Boolean(host);
  } catch {
    return false;
  }
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
      findings.push(`${page}: invalid JSON-LD.`);
    }
  }
  return articles;
}

function includesEditorialTag(value) {
  const keywords = Array.isArray(value)
    ? value
    : typeof value === 'string'
      ? value.split(',')
      : [];
  return keywords.some((keyword) => /^(?:freshness|source-count):/i.test(String(keyword).trim()));
}

if (!/^\d{4}-\d{2}-\d{2}$/.test(ledger.reviewedAt ?? '')) {
  findings.push('data/case-public-sources.json: reviewedAt must be YYYY-MM-DD.');
}
if (!String(ledger.policy ?? '').trim()) {
  findings.push('data/case-public-sources.json: policy is required.');
}

for (const entry of ledger.entries ?? []) {
  if (seenCases.has(entry.url)) findings.push(`${entry.url}: duplicate source-ledger entry.`);
  seenCases.add(entry.url);
  if (unverified.has(entry.url)) findings.push(`${entry.url}: page cannot be verified and unverified at the same time.`);
  if (!Array.isArray(entry.sources) || entry.sources.length === 0) {
    findings.push(`${entry.url}: at least one source is required.`);
    continue;
  }

  const sourceUrls = [];
  for (const source of entry.sources) {
    const title = String(source?.title ?? '').trim();
    const url = String(source?.url ?? '').trim();
    if (!title) findings.push(`${entry.url}: source title is missing.`);
    if (!isPublicHttpsUrl(url)) findings.push(`${entry.url}: unsafe source URL ${url || '(empty)'}.`);
    const scopedKey = `${entry.url}\n${url}`;
    if (seenSources.has(scopedKey)) findings.push(`${entry.url}: duplicate source URL ${url}.`);
    seenSources.add(scopedKey);
    sourceUrls.push(url);
  }

  const filePath = path.join(root, `${entry.url}.html`);
  if (!fs.existsSync(filePath)) {
    findings.push(`${entry.url}: HTML file is missing.`);
    continue;
  }
  const html = fs.readFileSync(filePath, 'utf8');
  const sourceBlockCount = (html.match(/class=["'][^"']*\barticle-sources\b[^"']*["']/gi) ?? []).length;
  if (sourceBlockCount !== 1) findings.push(`${entry.url}: expected one visible source block, found ${sourceBlockCount}.`);
  if (!html.includes('data-evidence-status="public-source"')) findings.push(`${entry.url}: public-source evidence marker is missing.`);
  if (!html.includes('>出典・参考資料</h2>')) findings.push(`${entry.url}: visible source heading is missing.`);
  if (!html.includes('リンク先の事実と、当社による整理・解説を区別')) findings.push(`${entry.url}: source explanation is missing.`);
  if (/<a\b(?=[^>]*\bclass=["'][^"']*\barticle-tag\b[^"']*["'])[^>]*>(?:freshness|source-count):/i.test(html)) findings.push(`${entry.url}: visible tags expose editorial metadata.`);
  if (html.indexOf('class="article-sources"') > html.lastIndexOf('</article>')) findings.push(`${entry.url}: source block is outside the article.`);
  for (const source of entry.sources) {
    const expectedLink = `<a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer"`;
    if (!html.includes(expectedLink)) findings.push(`${entry.url}: safe visible link missing for ${source.url}.`);
    if (!html.includes(`>${escapeHtml(source.title)}</a>`)) findings.push(`${entry.url}: visible source title missing for ${source.url}.`);
  }

  const articles = articlesFromHtml(html, entry.url);
  if (articles.length !== 1) {
    findings.push(`${entry.url}: expected one Article JSON-LD node, found ${articles.length}.`);
  } else {
    const citations = Array.isArray(articles[0].citation) ? articles[0].citation : [];
    if (JSON.stringify(citations) !== JSON.stringify(sourceUrls)) findings.push(`${entry.url}: Article citation is stale.`);
    if (articles[0].dateModified !== ledger.reviewedAt) findings.push(`${entry.url}: Article dateModified is stale.`);
    if (includesEditorialTag(articles[0].keywords)) findings.push(`${entry.url}: Article keywords expose editorial metadata.`);
  }

  const canonical = `https://digitool-lab.com/${entry.url}`;
  if (!sitemap.includes(`<loc>${canonical}</loc>`)) findings.push(`${entry.url}: verified page is missing from sitemap.xml.`);
  const robots = html.match(/<meta\b(?=[^>]*\bname=["']robots["'])[^>]*>/i)?.[0] ?? '';
  if (/noindex/i.test(robots)) findings.push(`${entry.url}: verified page still has robots noindex.`);

  const item = cases.find((candidate) => candidate.url === entry.url);
  if (!item) {
    findings.push(`${entry.url}: case-studies.json entry is missing.`);
  } else {
    if (item.evidenceStatus !== 'verified') findings.push(`${entry.url}: evidenceStatus must be verified.`);
    if (item.evidenceReviewedAt !== ledger.reviewedAt) findings.push(`${entry.url}: evidenceReviewedAt is stale.`);
    if (item.publicSourceCount !== entry.sources.length) findings.push(`${entry.url}: publicSourceCount is stale.`);
    if (includesEditorialTag(item.tags)) findings.push(`${entry.url}: public tags expose editorial metadata.`);
  }
}

function decodeHtmlAttribute(value) {
  return String(value)
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');
}

for (const file of fs.readdirSync(path.join(root, 'blog')).filter((name) => name.endsWith('.html'))) {
  const html = fs.readFileSync(path.join(root, 'blog', file), 'utf8');
  if (!/class=["'][^"']*\barticle-sources\b[^"']*["']/i.test(html)) continue;
  const url = `blog/${file.replace(/\.html$/, '')}`;
  if (seenCases.has(url)) continue;

  const blocks = [...html.matchAll(/<section\b[^>]*class=["'][^"']*\barticle-sources\b[^"']*["'][^>]*>([\s\S]*?)<\/section>/gi)];
  if (blocks.length !== 1) {
    findings.push(`${url}: expected one generated source block, found ${blocks.length}.`);
    continue;
  }
  const anchors = [...blocks[0][1].matchAll(/<a\b([^>]*)\bhref=["']([^"']+)["']([^>]*)>/gi)];
  const visibleUrls = anchors.map((match) => decodeHtmlAttribute(match[2]));
  if (!visibleUrls.length) findings.push(`${url}: generated source block has no visible links.`);
  for (const [index, sourceUrl] of visibleUrls.entries()) {
    if (!isPublicHttpsUrl(sourceUrl)) findings.push(`${url}: unsafe generated source URL ${sourceUrl}.`);
    const attributes = `${anchors[index][1]} ${anchors[index][3]}`;
    if (!/\btarget=["']_blank["']/i.test(attributes) || !/\brel=["'][^"']*\bnoopener\b[^"']*\bnoreferrer\b[^"']*["']/i.test(attributes)) {
      findings.push(`${url}: generated source link must use target blank with noopener noreferrer.`);
    }
  }

  const item = cases.find((candidate) => candidate.url === url);
  if (!item) {
    findings.push(`${url}: generated source page is missing from case-studies.json.`);
  } else {
    if (item.evidenceStatus !== 'verified') findings.push(`${url}: generated source page must be verified.`);
    if (item.publicSourceCount !== visibleUrls.length) findings.push(`${url}: generated publicSourceCount is stale.`);
  }
  const articles = articlesFromHtml(html, url);
  if (articles.length !== 1) {
    findings.push(`${url}: expected one Article JSON-LD node, found ${articles.length}.`);
  } else {
    const citations = Array.isArray(articles[0].citation) ? articles[0].citation : [];
    if (JSON.stringify(citations) !== JSON.stringify(visibleUrls)) findings.push(`${url}: generated Article citation does not match visible source links.`);
  }
}

if (findings.length) {
  console.error('Case public source audit failed.');
  console.error(findings.slice(0, 100).join('\n'));
  if (findings.length > 100) console.error(`...and ${findings.length - 100} more`);
  process.exit(1);
}

console.log(`Case public source audit passed: ${seenCases.size} verified cases, ${seenSources.size} public links.`);
