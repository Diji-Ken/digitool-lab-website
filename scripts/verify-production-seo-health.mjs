#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const baseUrl = new URL(process.env.SEO_HEALTH_BASE_URL || 'https://digitool-lab.com/');
const stamp = Date.now().toString();
const findings = [];
const concurrency = 4;

const priorityPages = [
  { url: 'dx-support-saitama/', file: 'dx-support-saitama/index.html' },
  { url: 'blog/dx-support-cost', file: 'blog/dx-support-cost.html' },
  { url: 'ai-training-saitama/', file: 'ai-training-saitama/index.html' },
  { url: 'blog/ai-training-cost', file: 'blog/ai-training-cost.html' },
  { url: 'blog/internal-portal-development-cost', file: 'blog/internal-portal-development-cost.html' },
  { url: 'blog/meo-citation-nap-checklist', file: 'blog/meo-citation-nap-checklist.html' },
  { url: 'business-system-development/', file: 'business-system-development/index.html' },
  { url: 'blog/business-system-development-cost', file: 'blog/business-system-development-cost.html' },
  { url: 'ai-search-meo-support/', file: 'ai-search-meo-support/index.html' },
  { url: 'service', file: 'service.html' },
  { url: 'blog/how-to-choose-dx-support-company', file: 'blog/how-to-choose-dx-support-company.html' },
  { url: 'blog/ai-search-company-information-checklist', file: 'blog/ai-search-company-information-checklist.html' },
];

const discoveryFiles = ['robots.txt', 'llms.txt', 'llms_full.txt'];
const evidenceGate = JSON.parse(fs.readFileSync(path.join(root, 'data/case-evidence-status.json'), 'utf8'));

function normalizeDocument(value) {
  return String(value).replaceAll('\r\n', '\n').replaceAll('\r', '\n').trimEnd();
}

function decodeHtml(value) {
  return String(value)
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replace(/&#(\d+);/g, (_, number) => String.fromCodePoint(Number(number)))
    .replace(/&#x([0-9a-f]+);/gi, (_, number) => String.fromCodePoint(Number.parseInt(number, 16)));
}

function normalizeText(value) {
  return decodeHtml(String(value).replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

function attributesFromTag(tag) {
  const attributes = {};
  const pattern = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let match;
  while ((match = pattern.exec(tag))) {
    const key = match[1].toLowerCase();
    if (key.startsWith('<')) continue;
    attributes[key] = match[2] ?? match[3] ?? match[4] ?? '';
  }
  return attributes;
}

function matchingTags(html, name, predicate = () => true) {
  const matches = html.match(new RegExp(`<${name}\\b[^>]*>`, 'gi')) ?? [];
  return matches
    .map((tag) => ({ tag, attributes: attributesFromTag(tag) }))
    .filter(({ attributes }) => predicate(attributes));
}

function pageSignals(html) {
  const titleMatches = [...html.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)];
  const h1Matches = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
  const descriptions = matchingTags(html, 'meta', (attributes) => attributes.name?.toLowerCase() === 'description');
  const canonicals = matchingTags(html, 'link', (attributes) => {
    const rel = attributes.rel?.toLowerCase().split(/\s+/) ?? [];
    return rel.includes('canonical');
  });
  const robots = matchingTags(html, 'meta', (attributes) => attributes.name?.toLowerCase() === 'robots');

  return {
    titleCount: titleMatches.length,
    title: normalizeText(titleMatches[0]?.[1] ?? ''),
    descriptionCount: descriptions.length,
    description: normalizeText(descriptions[0]?.attributes.content ?? ''),
    canonicalCount: canonicals.length,
    canonical: canonicals[0]?.attributes.href ?? '',
    h1Count: h1Matches.length,
    h1: normalizeText(h1Matches[0]?.[1] ?? ''),
    robotsCount: robots.length,
    robots: robots[0]?.attributes.content ?? '',
  };
}

function sitemapUrls(xml) {
  return new Set([...xml.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)].map((match) => decodeHtml(match[1].trim())));
}

async function fetchProduction(pathname, accept = 'text/html,*/*;q=0.8') {
  const url = new URL(pathname, baseUrl);
  url.searchParams.set('seo_health_check', stamp);
  return fetch(url, {
    redirect: 'follow',
    headers: {
      accept,
      'cache-control': 'no-cache',
      'user-agent': 'DigitalToolLabSeoHealthMonitor/1.0',
    },
    signal: AbortSignal.timeout(15_000),
  });
}

async function mapWithConcurrency(items, worker) {
  let nextIndex = 0;
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      await worker(items[index], index);
    }
  });
  await Promise.all(workers);
}

let productionSitemap = '';
let productionCases = [];
let productionListingScript = '';

try {
  const [sitemapResponse, casesResponse, listingResponse] = await Promise.all([
    fetchProduction('sitemap.xml', 'application/xml,text/xml,*/*;q=0.8'),
    fetchProduction('data/case-studies.json', 'application/json,*/*;q=0.8'),
    fetchProduction('js/case-studies.js', 'text/javascript,*/*;q=0.8'),
  ]);

  if (sitemapResponse.status !== 200) findings.push(`sitemap.xml: expected 200, received ${sitemapResponse.status}.`);
  if (casesResponse.status !== 200) findings.push(`data/case-studies.json: expected 200, received ${casesResponse.status}.`);
  if (listingResponse.status !== 200) findings.push(`js/case-studies.js: expected 200, received ${listingResponse.status}.`);

  if (sitemapResponse.status === 200) productionSitemap = await sitemapResponse.text();
  if (casesResponse.status === 200) productionCases = await casesResponse.json();
  if (listingResponse.status === 200) productionListingScript = await listingResponse.text();
} catch (error) {
  findings.push(`production discovery fetch failed: ${error.message}`);
}

if (productionSitemap) {
  const localUrls = sitemapUrls(fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8'));
  const productionUrls = sitemapUrls(productionSitemap);
  const missing = [...localUrls].filter((url) => !productionUrls.has(url));
  const extra = [...productionUrls].filter((url) => !localUrls.has(url));
  if (missing.length > 0) findings.push(`sitemap.xml: ${missing.length} production URL(s) missing: ${missing.slice(0, 5).join(', ')}`);
  if (extra.length > 0) findings.push(`sitemap.xml: ${extra.length} unexpected production URL(s): ${extra.slice(0, 5).join(', ')}`);
}

await mapWithConcurrency(priorityPages, async (page) => {
  const localHtml = fs.readFileSync(path.join(root, page.file), 'utf8');
  const local = pageSignals(localHtml);
  const label = page.url;

  try {
    const response = await fetchProduction(page.url);
    const productionHtml = await response.text();
    if (response.status !== 200) {
      findings.push(`${label}: expected 200, received ${response.status}.`);
      return;
    }

    const production = pageSignals(productionHtml);
    for (const signal of ['title', 'description', 'canonical', 'h1']) {
      const countKey = `${signal}Count`;
      if (production[countKey] !== 1) findings.push(`${label}: expected one ${signal}, found ${production[countKey]}.`);
      if (production[signal] !== local[signal]) findings.push(`${label}: production ${signal} differs from the audited local version.`);
    }
    if (/\bnoindex\b/i.test(production.robots)) findings.push(`${label}: priority production page has robots noindex.`);
    if (production.canonical !== new URL(page.url, baseUrl).href) findings.push(`${label}: canonical does not match its public URL.`);
  } catch (error) {
    findings.push(`${label}: production fetch failed: ${error.message}`);
  }
});

if (productionListingScript && !productionListingScript.includes("item.evidenceStatus !== 'unverified'")) {
  findings.push('js/case-studies.js: production listing no longer excludes unverified cases.');
}

await mapWithConcurrency(evidenceGate.entries ?? [], async (entry) => {
  try {
    const response = await fetchProduction(entry.url);
    const html = await response.text();
    if (response.status !== 200) {
      findings.push(`${entry.url}: expected 200, received ${response.status}.`);
      return;
    }

    const signals = pageSignals(html);
    if (signals.robotsCount !== 1) {
      findings.push(`${entry.url}: expected one robots meta, found ${signals.robotsCount}.`);
    }
    if (!/\bnoindex\b/i.test(signals.robots) || !/\bfollow\b/i.test(signals.robots)) {
      findings.push(`${entry.url}: unverified production page must remain noindex, follow.`);
    }
    if (!html.includes('data-evidence-status="unverified"') || !html.includes('内容確認中')) {
      findings.push(`${entry.url}: visible production evidence notice is missing.`);
    }

    const canonical = new URL(entry.url, baseUrl).href;
    if (productionSitemap && sitemapUrls(productionSitemap).has(canonical)) {
      findings.push(`${entry.url}: unverified production page appears in sitemap.xml.`);
    }

    const item = productionCases.find?.((candidate) => candidate.url === entry.url);
    if (item && item.evidenceStatus !== 'unverified') {
      findings.push(`${entry.url}: production case data no longer marks the entry unverified.`);
    }
    if (item && item.evidenceReviewedAt !== evidenceGate.reviewedAt) {
      findings.push(`${entry.url}: production evidenceReviewedAt is stale.`);
    }
  } catch (error) {
    findings.push(`${entry.url}: production fetch failed: ${error.message}`);
  }
});

await mapWithConcurrency(discoveryFiles, async (file) => {
  try {
    const response = await fetchProduction(file, 'text/plain,*/*;q=0.8');
    const production = await response.text();
    if (response.status !== 200) {
      findings.push(`${file}: expected 200, received ${response.status}.`);
      return;
    }
    const local = fs.readFileSync(path.join(root, file), 'utf8');
    if (normalizeDocument(production) !== normalizeDocument(local)) {
      findings.push(`${file}: production discovery content differs from the audited local version.`);
    }
  } catch (error) {
    findings.push(`${file}: production fetch failed: ${error.message}`);
  }
});

if (findings.length > 0) {
  console.error(`Production SEO health verification failed: ${findings.length} finding(s).`);
  for (const finding of findings.slice(0, 100)) console.error(`  ${finding}`);
  if (findings.length > 100) console.error(`  ...and ${findings.length - 100} more`);
  process.exit(1);
}

console.log(
  `Production SEO health verification passed: ${priorityPages.length} priority pages, `
  + `${sitemapUrls(productionSitemap).size} sitemap URLs, ${evidenceGate.entries.length} contained legacy cases, `
  + `${discoveryFiles.length} AI/search discovery files.`,
);
