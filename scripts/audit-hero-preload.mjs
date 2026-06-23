import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const skippedDirectories = new Set([
  '.git',
  'node_modules',
  'backup_20250703_112022',
  'backup_images_20250727_213226',
  'backup_images_20250727_213230',
  'article-workspace',
  'posts-management',
]);

const htmlFiles = [];
const findings = [];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (skippedDirectories.has(entry.name)) continue;

    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (entry.isFile() && fullPath.endsWith('.html')) {
      htmlFiles.push(fullPath);
    }
  }
}

function fileExistsForReference(reference, relativeFile) {
  if (!reference || /^https?:\/\//i.test(reference)) return true;
  const directory = path.dirname(path.join(root, relativeFile));
  return fs.existsSync(path.resolve(directory, reference));
}

walk(root);

for (const filePath of htmlFiles) {
  const relativeFile = path.relative(root, filePath);
  const html = fs.readFileSync(filePath, 'utf8');
  const usesSeoHero = /<section\b[^>]*class=(["'])[^"']*\bseo-hero\b[^"']*\1/i.test(html);
  const isHomepage = relativeFile === 'index.html';

  if (!usesSeoHero && !isHomepage) continue;

  const preloadMatch = html.match(/<link\b(?=[^>]*rel=(["'])preload\1)(?=[^>]*as=(["'])image\2)(?=[^>]*href=(["'])([^"']*hero-dx-support\.webp)\3)[^>]*>/i);
  if (!preloadMatch) {
    findings.push(`${relativeFile}: hero-dx-support.webp preload is missing.`);
    continue;
  }

  const tag = preloadMatch[0];
  const href = preloadMatch[4];

  if (!/fetchpriority=(["'])high\1/i.test(tag)) {
    findings.push(`${relativeFile}: hero preload should include fetchpriority="high".`);
  }

  if (!fileExistsForReference(href, relativeFile)) {
    findings.push(`${relativeFile}: hero preload href does not resolve locally (${href}).`);
  }
}

if (findings.length) {
  console.error('Hero preload audit failed.');
  console.error(findings.slice(0, 100).join('\n'));
  if (findings.length > 100) {
    console.error(`...and ${findings.length - 100} more`);
  }
  process.exit(1);
}

console.log(`Hero preload audit passed: ${htmlFiles.length} HTML files checked.`);
