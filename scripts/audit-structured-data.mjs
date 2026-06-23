import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sitemapPath = path.join(root, 'sitemap.xml');
const siteOrigin = 'https://digitool-lab.com';

const meaningfulTypes = new Set([
  'Article',
  'BlogPosting',
  'BreadcrumbList',
  'CollectionPage',
  'FAQPage',
  'ItemList',
  'LocalBusiness',
  'Organization',
  'Person',
  'Service',
  'WebPage',
]);

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
    relativePath = decodeURIComponent(pathname.replace(/^\/+/, '').replace(/\/$/, ''));
  } catch {
    relativePath = pathname.replace(/^\/+/, '').replace(/\/$/, '');
  }

  return [
    path.join(relativePath, 'index.html'),
    `${relativePath}.html`,
    relativePath,
  ].find(isFile) || null;
}

function structuredDataBlocks(html) {
  return [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => match[1].trim());
}

function nodesFromStructuredData(parsed) {
  const roots = Array.isArray(parsed) ? parsed : [parsed];
  const nodes = [];

  for (const rootNode of roots) {
    if (rootNode && Array.isArray(rootNode['@graph'])) {
      nodes.push(...rootNode['@graph']);
    } else {
      nodes.push(rootNode);
    }
  }

  return nodes.filter((node) => node && typeof node === 'object');
}

function typeValues(node) {
  const type = node['@type'];
  if (Array.isArray(type)) return type;
  return type ? [type] : [];
}

function validateNode(node, context) {
  const findings = [];
  const types = typeValues(node);

  if (!types.length) {
    findings.push(`${context}: structured data node is missing @type.`);
    return findings;
  }

  if (types.includes('BreadcrumbList')) {
    const items = node.itemListElement;
    if (!Array.isArray(items) || items.length < 2) {
      findings.push(`${context}: BreadcrumbList must include at least 2 itemListElement entries.`);
    }
  }

  if (types.includes('FAQPage')) {
    const questions = node.mainEntity;
    if (!Array.isArray(questions) || !questions.length) {
      findings.push(`${context}: FAQPage must include mainEntity questions.`);
    } else {
      for (const [index, question] of questions.entries()) {
        if (!question?.name || !question?.acceptedAnswer?.text) {
          findings.push(`${context}: FAQPage question ${index + 1} is missing name or acceptedAnswer.text.`);
        }
      }
    }
  }

  if (types.some((type) => ['Article', 'BlogPosting'].includes(type))) {
    if (!node.headline || !node.description || !node.mainEntityOfPage) {
      findings.push(`${context}: Article/BlogPosting must include headline, description, and mainEntityOfPage.`);
    }
  }

  if (types.includes('Service') && !node.name) {
    findings.push(`${context}: Service must include name.`);
  }

  if (types.includes('Organization') && !node.name) {
    findings.push(`${context}: Organization must include name.`);
  }

  return findings;
}

if (!fs.existsSync(sitemapPath)) {
  fail('Structured data audit failed: sitemap.xml is missing.');
}

const sitemap = fs.readFileSync(sitemapPath, 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());
const findings = [];
let checkedPages = 0;
let checkedBlocks = 0;

for (const loc of locs) {
  let url;
  try {
    url = new URL(loc);
  } catch {
    continue;
  }

  if (url.origin !== siteOrigin) continue;

  const relativeFile = fileForUrl(loc);
  if (!relativeFile) continue;

  checkedPages += 1;
  const html = fs.readFileSync(path.join(root, relativeFile), 'utf8');
  const blocks = structuredDataBlocks(html);

  if (!blocks.length) {
    findings.push(`${loc} -> ${relativeFile}: sitemap page is missing JSON-LD structured data.`);
    continue;
  }

  const pageTypes = new Set();

  for (const [blockIndex, block] of blocks.entries()) {
    checkedBlocks += 1;

    let parsed;
    try {
      parsed = JSON.parse(block);
    } catch (error) {
      findings.push(`${loc} -> ${relativeFile}: JSON-LD block ${blockIndex + 1} is invalid (${error.message}).`);
      continue;
    }

    const nodes = nodesFromStructuredData(parsed);
    for (const [nodeIndex, node] of nodes.entries()) {
      const types = typeValues(node);
      for (const type of types) pageTypes.add(type);
      findings.push(...validateNode(node, `${loc} -> ${relativeFile} block ${blockIndex + 1} node ${nodeIndex + 1}`));
    }
  }

  if (![...pageTypes].some((type) => meaningfulTypes.has(type))) {
    findings.push(`${loc} -> ${relativeFile}: structured data has no recognized SEO/AIO type.`);
  }
}

if (findings.length) {
  fail('Structured data audit failed.', findings);
}

console.log(`Structured data audit passed: ${checkedPages} sitemap pages and ${checkedBlocks} JSON-LD blocks checked.`);
