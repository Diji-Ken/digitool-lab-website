import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sitemapPath = path.join(root, 'sitemap.xml');
const siteOrigin = 'https://digitool-lab.com';

function fail(message, findings = []) {
  console.error(message);
  if (findings.length) {
    console.error(findings.slice(0, 100).join('\n'));
    if (findings.length > 100) {
      console.error(`...and ${findings.length - 100} more`);
    }
  }
  process.exit(1);
}

function isFile(relativePath) {
  try {
    return fs.statSync(path.join(root, relativePath)).isFile();
  } catch {
    return false;
  }
}

function fileForUrl(url) {
  const pathname = new URL(url).pathname;
  if (pathname === '/') return 'index.html';

  let relativePath;
  try {
    relativePath = decodeURIComponent(pathname.replace(/^\/+/, ''));
  } catch {
    relativePath = pathname.replace(/^\/+/, '');
  }

  return [
    path.join(relativePath, 'index.html'),
    `${relativePath}.html`,
    relativePath,
  ].find(isFile) || null;
}

function attributesFor(tag) {
  const attributes = {};
  for (const match of tag.matchAll(/([\w:-]+)\s*=\s*(['"])(.*?)\2/g)) {
    attributes[match[1].toLowerCase()] = match[3];
  }
  return attributes;
}

function tags(html, tagName) {
  return [...html.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, 'gi'))].map((match) => match[0]);
}

function metaContent(html, name) {
  return tags(html, 'meta')
    .map(attributesFor)
    .find((attributes) => attributes.name?.toLowerCase() === name.toLowerCase())
    ?.content
    ?.trim();
}

function canonicalHref(html) {
  return tags(html, 'link')
    .map(attributesFor)
    .find((attributes) => attributes.rel?.toLowerCase() === 'canonical')
    ?.href
    ?.trim();
}

if (!fs.existsSync(sitemapPath)) {
  fail('SEO indexability audit failed: sitemap.xml is missing.');
}

const sitemap = fs.readFileSync(sitemapPath, 'utf8');
const urlBlocks = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((match) => match[1]);

if (!urlBlocks.length) {
  fail('SEO indexability audit failed: sitemap.xml does not contain any <url> entries.');
}

const duplicateUrls = [];
const seenUrls = new Set();
const sitemapFindings = [];
const pageFindings = [];

for (const block of urlBlocks) {
  const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1]?.trim();
  const lastmod = block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1]?.trim();

  if (!loc) {
    sitemapFindings.push('sitemap.xml: <url> entry is missing <loc>.');
    continue;
  }

  if (seenUrls.has(loc)) duplicateUrls.push(loc);
  seenUrls.add(loc);

  let url;
  try {
    url = new URL(loc);
  } catch {
    sitemapFindings.push(`sitemap.xml: invalid URL: ${loc}`);
    continue;
  }

  if (url.origin !== siteOrigin) {
    sitemapFindings.push(`sitemap.xml: loc must use ${siteOrigin}: ${loc}`);
  }

  if (url.search || url.hash) {
    sitemapFindings.push(`sitemap.xml: loc must not include query/hash: ${loc}`);
  }

  if (url.pathname.endsWith('.html')) {
    sitemapFindings.push(`sitemap.xml: loc must use canonical extensionless URL: ${loc}`);
  }

  if (!lastmod || !/^\d{4}-\d{2}-\d{2}$/.test(lastmod)) {
    sitemapFindings.push(`sitemap.xml: ${loc} has invalid or missing lastmod: ${lastmod || '(missing)'}`);
  }

  const filePath = fileForUrl(loc);
  if (!filePath) {
    pageFindings.push(`${loc}: local HTML file not found.`);
    continue;
  }

  const html = fs.readFileSync(path.join(root, filePath), 'utf8');
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.replace(/\s+/g, ' ').trim();
  const description = metaContent(html, 'description');
  const robots = metaContent(html, 'robots') || '';
  const canonical = canonicalHref(html);
  const h1Count = [...html.matchAll(/<h1\b[^>]*>/gi)].length;

  if (!title) {
    pageFindings.push(`${loc} -> ${filePath}: missing <title>.`);
  }

  if (!description || description.length < 20) {
    pageFindings.push(`${loc} -> ${filePath}: missing or too short meta description.`);
  }

  if (/noindex/i.test(robots)) {
    pageFindings.push(`${loc} -> ${filePath}: sitemap URL has robots noindex (${robots}).`);
  }

  if (canonical !== loc) {
    pageFindings.push(`${loc} -> ${filePath}: canonical mismatch (${canonical || 'missing'}).`);
  }

  if (h1Count !== 1) {
    pageFindings.push(`${loc} -> ${filePath}: expected exactly one h1, found ${h1Count}.`);
  }
}

if (duplicateUrls.length) {
  sitemapFindings.push(...duplicateUrls.map((url) => `sitemap.xml: duplicate loc: ${url}`));
}

if (sitemapFindings.length || pageFindings.length) {
  fail('SEO indexability audit failed.', [...sitemapFindings, ...pageFindings]);
}

console.log(`SEO indexability audit passed: ${urlBlocks.length} sitemap URLs checked.`);
