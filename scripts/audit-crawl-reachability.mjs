#!/usr/bin/env node

import fs from 'node:fs';
import { archiveFile, archiveUrl, attributes, gatedUrls, localFileForUrl, renderArticleIndex,
  robotsValue, siteOrigin, sitemapLocations } from './generate-article-index.mjs';

// Model discovery from real HTML anchors, without JavaScript, button clicks,
// sitemap-only edges, JSON-LD URLs, or links from excluded pages.
const findings = [];
const urls = new Set([...sitemapLocations(), archiveUrl]);
const gated = gatedUrls();
const graph = new Map();

for (const url of urls) {
  const html = fs.readFileSync(localFileForUrl(url), 'utf8');
  if (/\bnoindex\b/i.test(robotsValue(html)) || gated.has(url)) {
    findings.push(`${url}: excluded page must not appear in the crawlable sitemap/archive.`);
    continue;
  }
  const outgoing = new Set();
  // Comments and scripts cannot provide visible navigation links.
  const visibleHtml = html.replace(/<!--[\s\S]*?-->/g, '').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  for (const match of visibleHtml.matchAll(/<a\b[^>]*>/gi)) {
    const tag = attributes(match[0]);
    if (!tag.href || tag.rel?.split(/\s+/).includes('nofollow')) continue;
    try {
      const destination = new URL(tag.href, url);
      if (destination.origin !== siteOrigin) continue;
      // Parameter-driven lists are not used as a shortcut to their canonical
      // page: a real link to the canonical page must also exist.
      if (destination.search) continue;
      destination.hash = '';
      if (urls.has(destination.href)) outgoing.add(destination.href);
      if (url === archiveUrl && gated.has(destination.href)) {
        findings.push(`${url}: archive links to an evidence-gated page: ${destination.href}`);
      }
    } catch {
      findings.push(`${url}: invalid anchor href ${tag.href}`);
    }
  }
  graph.set(url, outgoing);
}

const depths = new Map([[`${siteOrigin}/`, 0]]);
const queue = [`${siteOrigin}/`];
for (let index = 0; index < queue.length; index += 1) {
  const source = queue[index];
  for (const target of graph.get(source) ?? []) {
    if (depths.has(target)) continue;
    depths.set(target, depths.get(source) + 1);
    queue.push(target);
  }
}
for (const url of urls) {
  if (!depths.has(url)) findings.push(`${url}: no static anchor path from the homepage.`);
}
for (const url of gated) {
  const html = fs.readFileSync(localFileForUrl(url), 'utf8');
  if (!/\bnoindex\b/i.test(robotsValue(html))) findings.push(`${url}: evidence gate lost its noindex directive.`);
}

if (fs.readFileSync(archiveFile, 'utf8') !== renderArticleIndex()) {
  findings.push('articles/index.html is not synchronized with the public sitemap and page headings.');
}

if (findings.length) {
  console.error(`Static crawl reachability audit failed: ${findings.length} finding(s).`);
  console.error(findings.slice(0, 100).join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Static crawl reachability audit passed: ${urls.size} pages reachable, maximum ${Math.max(...depths.values())} links from home; ${gated.size} evidence-gated pages remain excluded.`);
}
