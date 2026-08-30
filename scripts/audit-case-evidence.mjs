import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const gate = JSON.parse(fs.readFileSync(path.join(root, 'data/case-evidence-status.json'), 'utf8'));
const cases = JSON.parse(fs.readFileSync(path.join(root, 'data/case-studies.json'), 'utf8'));
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const listingScript = fs.readFileSync(path.join(root, 'js/case-studies.js'), 'utf8');
const findings = [];
const seen = new Set();

if (!/^\d{4}-\d{2}-\d{2}$/.test(gate.reviewedAt || '')) {
  findings.push('data/case-evidence-status.json: reviewedAt must be YYYY-MM-DD.');
}

for (const entry of gate.entries ?? []) {
  if (seen.has(entry.url)) findings.push(`${entry.url}: duplicate evidence entry.`);
  seen.add(entry.url);
  if (entry.status !== 'unverified') {
    findings.push(`${entry.url}: unsupported status ${entry.status}.`);
    continue;
  }

  const filePath = path.join(root, `${entry.url}.html`);
  if (!fs.existsSync(filePath)) {
    findings.push(`${entry.url}: HTML file is missing.`);
    continue;
  }

  const html = fs.readFileSync(filePath, 'utf8');
  const robotsMatches = [...html.matchAll(/<meta\b(?=[^>]*\bname=["']robots["'])[^>]*>/gi)];
  const robots = robotsMatches[0]?.[0].match(/\bcontent=["']([^"']*)["']/i)?.[1] || '';
  if (robotsMatches.length !== 1) findings.push(`${entry.url}: expected one robots meta, found ${robotsMatches.length}.`);
  if (!/noindex/i.test(robots)) findings.push(`${entry.url}: robots noindex is missing.`);
  const noticeCount = (html.match(/data-evidence-status=["']unverified["']/g) ?? []).length;
  if (noticeCount !== 1) {
    findings.push(`${entry.url}: expected one evidence notice, found ${noticeCount}.`);
  } else if (!html.includes('data-evidence-status="unverified"')) {
    findings.push(`${entry.url}: visible evidence notice is missing.`);
  } else if (html.indexOf('data-evidence-status="unverified"') > html.search(/<h1\b/i)) {
    findings.push(`${entry.url}: evidence notice must appear before the page h1.`);
  }

  const canonical = `https://digitool-lab.com/${entry.url}`;
  if (sitemap.includes(`<loc>${canonical}</loc>`)) {
    findings.push(`${entry.url}: unverified page remains in sitemap.xml.`);
  }

  const item = cases.find((candidate) => candidate.url === entry.url);
  if (!item) {
    findings.push(`${entry.url}: case-studies.json entry is missing.`);
  } else {
    if (item.evidenceStatus !== 'unverified') {
      findings.push(`${entry.url}: case-studies.json evidenceStatus must be unverified.`);
    }
    if (item.evidenceReviewedAt !== gate.reviewedAt) {
      findings.push(`${entry.url}: case-studies.json evidenceReviewedAt is stale.`);
    }
  }
}

if (!listingScript.includes("item.evidenceStatus !== 'unverified'")) {
  findings.push('js/case-studies.js: unverified entries are not filtered from the public listing.');
}

if (findings.length) {
  console.error('Case evidence audit failed.');
  console.error(findings.slice(0, 100).join('\n'));
  if (findings.length > 100) console.error(`...and ${findings.length - 100} more`);
  process.exit(1);
}

console.log(`Case evidence audit passed: ${seen.size} unverified legacy case pages contained.`);
