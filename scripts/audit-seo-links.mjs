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

const allowedExternalHosts = new Set(['digitool-lab.com']);
const ignoredSchemes = /^(mailto:|tel:|javascript:|data:)/i;
const htmlFiles = [];

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

function existsForPathname(pathname) {
  if (!pathname || pathname === '/') return true;

  let decodedPath;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    decodedPath = pathname;
  }

  const relativePath = decodedPath.replace(/^\/+/, '');
  const absolutePath = path.join(root, relativePath);

  return [
    absolutePath,
    `${absolutePath}.html`,
    path.join(absolutePath, 'index.html'),
  ].some((candidate) => fs.existsSync(candidate));
}

function shouldCheckReference(reference) {
  if (!reference || reference.startsWith('#') || ignoredSchemes.test(reference)) {
    return false;
  }

  if (/^https?:\/\//i.test(reference)) {
    try {
      return allowedExternalHosts.has(new URL(reference).hostname);
    } catch {
      return false;
    }
  }

  return true;
}

function toPathname(reference, basePath) {
  try {
    if (/^https?:\/\//i.test(reference)) {
      return new URL(reference).pathname;
    }
    return new URL(reference, `https://digitool-lab.com${basePath}`).pathname;
  } catch {
    return null;
  }
}

walk(root);

const htmlHrefFindings = [];
const missingReferenceFindings = [];

for (const filePath of htmlFiles) {
  const relativeFile = path.relative(root, filePath);
  const directoryName = path.dirname(relativeFile);
  const basePath = `/${directoryName === '.' ? '' : `${directoryName}/`}`;
  const html = fs.readFileSync(filePath, 'utf8');

  for (const match of html.matchAll(/href=(['"])([^'"]+\.html(?:[?#][^'"]*)?)\1/g)) {
    const reference = match[2];
    if (!shouldCheckReference(reference)) continue;
    htmlHrefFindings.push(`${relativeFile}: href="${reference}"`);
  }

  for (const attribute of ['href', 'src']) {
    const attributePattern = new RegExp(`${attribute}=(['"])([^'"]+)\\1`, 'g');
    for (const match of html.matchAll(attributePattern)) {
      const reference = match[2];
      if (!shouldCheckReference(reference)) continue;

      const pathname = toPathname(reference, basePath);
      if (!pathname || existsForPathname(pathname)) continue;

      missingReferenceFindings.push(`${relativeFile}: ${attribute}="${reference}" -> ${pathname}`);
    }
  }
}

if (htmlHrefFindings.length || missingReferenceFindings.length) {
  console.error('SEO link audit failed.');

  if (htmlHrefFindings.length) {
    console.error('\nInternal href values still contain .html:');
    console.error(htmlHrefFindings.slice(0, 100).join('\n'));
    if (htmlHrefFindings.length > 100) {
      console.error(`...and ${htmlHrefFindings.length - 100} more`);
    }
  }

  if (missingReferenceFindings.length) {
    console.error('\nMissing internal href/src references:');
    console.error(missingReferenceFindings.slice(0, 100).join('\n'));
    if (missingReferenceFindings.length > 100) {
      console.error(`...and ${missingReferenceFindings.length - 100} more`);
    }
  }

  process.exit(1);
}

console.log(`SEO link audit passed: ${htmlFiles.length} HTML files checked.`);
