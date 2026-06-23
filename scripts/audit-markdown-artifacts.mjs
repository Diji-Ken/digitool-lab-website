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

function stripNonVisibleBlocks(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '')
    .replace(/<pre\b[\s\S]*?<\/pre>/gi, '')
    .replace(/<code\b[\s\S]*?<\/code>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');
}

function visibleTextFromParagraph(match) {
  return match[1]
    .replace(/<[^>]+>/g, '')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .trim();
}

function findingsForHtml(html, context) {
  const findings = [];
  const visibleHtml = stripNonVisibleBlocks(html);

  if (/IMAGE_PLANS:/i.test(visibleHtml)) {
    findings.push(`${context}: visible IMAGE_PLANS comment marker remains.`);
  }

  for (const match of visibleHtml.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)) {
    const text = visibleTextFromParagraph(match);
    if (!text) continue;

    if (/^#{1,6}\s+\S/.test(text)) {
      findings.push(`${context}: markdown heading remains in paragraph: ${text.slice(0, 80)}`);
    }

    if (/^>\s+\S/.test(text)) {
      findings.push(`${context}: markdown blockquote remains in paragraph: ${text.slice(0, 80)}`);
    }

    if (/^\|.*\|$/.test(text)) {
      findings.push(`${context}: markdown table row remains in paragraph: ${text.slice(0, 80)}`);
    }

    if (/^\|?\s*-{3,}\s*(\|\s*-{3,}\s*)+\|?$/.test(text)) {
      findings.push(`${context}: markdown table separator remains in paragraph.`);
    }

    if (text === '---') {
      findings.push(`${context}: markdown horizontal rule remains in paragraph.`);
    }
  }

  return findings;
}

if (!fs.existsSync(sitemapPath)) {
  fail('Markdown artifact audit failed: sitemap.xml is missing.');
}

const sitemap = fs.readFileSync(sitemapPath, 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());
const findings = [];
let checkedPages = 0;

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
  findings.push(...findingsForHtml(html, `${loc} -> ${relativeFile}`));
}

if (findings.length) {
  fail('Markdown artifact audit failed.', findings);
}

console.log(`Markdown artifact audit passed: ${checkedPages} sitemap pages checked.`);
