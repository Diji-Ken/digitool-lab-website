import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const allowedNoindexFiles = new Set([
  'analytics-template.html',
  'apps/index.html',
  'apps/privacy.html',
  'apps/terms.html',
  'case-template.html',
  'case.html',
  'contact_secure.html',
  'contact_success.html',
  'data-deletion.html',
  'debug-mobile.html',
  'download_thanks.html',
  'facebook-data-deletion.html',
  'google-analytics-setup.html',
  'service-otomo.html',
  'subsidy-template.html',
  'test-cards.html',
]);

const skippedDirs = new Set([
  '.git',
  'node_modules',
  'tools',
  'backup_20250703_112022',
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

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!skippedDirs.has(entry.name)) {
        walk(path.join(dir, entry.name), files);
      }
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(path.join(dir, entry.name));
    }
  }

  return files;
}

function normalize(filePath) {
  return path.relative(root, filePath).split(path.sep).join('/');
}

const findings = [];
const observedNoindex = new Set();

for (const filePath of walk(root)) {
  const relativePath = normalize(filePath);
  const html = fs.readFileSync(filePath, 'utf8');
  if (!/<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html)) {
    continue;
  }

  observedNoindex.add(relativePath);
  if (!allowedNoindexFiles.has(relativePath)) {
    findings.push(`${relativePath}: noindex is not in the approved intentional noindex list.`);
  }
}

for (const allowedPath of allowedNoindexFiles) {
  if (!fs.existsSync(path.join(root, allowedPath))) {
    findings.push(`${allowedPath}: approved noindex file is missing.`);
  } else if (!observedNoindex.has(allowedPath)) {
    findings.push(`${allowedPath}: approved file no longer contains noindex; update the intent list if this was deliberate.`);
  }
}

if (findings.length) {
  fail('Noindex intent audit failed.', findings);
}

console.log(`Noindex intent audit passed: ${observedNoindex.size} intentional noindex pages checked.`);
