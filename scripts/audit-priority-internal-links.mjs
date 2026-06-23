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

const priorityPages = [
  { pathname: '/case-studies', minReferringPages: 50, label: 'case studies hub' },
  { pathname: '/dx-support-saitama/', minReferringPages: 20, label: 'DX support LP' },
  { pathname: '/internal-portal-development/', minReferringPages: 20, label: 'internal portal LP' },
  { pathname: '/it-tantou-outsourcing/', minReferringPages: 15, label: 'outsourced IT LP' },
  { pathname: '/business-system-development/', minReferringPages: 12, label: 'business system LP' },
  { pathname: '/downloads/', minReferringPages: 12, label: 'downloads hub' },
  { pathname: '/ai-training-saitama/', minReferringPages: 8, label: 'AI training LP' },
  { pathname: '/ai-search-meo-support/', minReferringPages: 8, label: 'AI search/MEO LP' },
  { pathname: '/excel-paper-dx/', minReferringPages: 6, label: 'Excel/paper DX LP' },
  { pathname: '/subsidy-dx-ai-system/', minReferringPages: 5, label: 'subsidy DX LP' },
  { pathname: '/case-themes/', minReferringPages: 3, label: 'case themes hub' },
  { pathname: '/blog/dx-support-cost', minReferringPages: 4, label: 'DX cost article' },
  { pathname: '/blog/business-system-development-cost', minReferringPages: 4, label: 'business system cost article' },
  { pathname: '/blog/internal-portal-development-cost', minReferringPages: 4, label: 'internal portal cost article' },
  { pathname: '/blog/ai-training-cost', minReferringPages: 4, label: 'AI training cost article' },
  { pathname: '/blog/dx-consulting-monthly-support', minReferringPages: 4, label: 'monthly DX support article' },
  { pathname: '/blog/ai-search-meo-citation-checklist', minReferringPages: 4, label: 'AI search/MEO checklist article' },
  { pathname: '/blog/ai-search-company-information-checklist', minReferringPages: 4, label: 'AI company info checklist article' },
  { pathname: '/blog/meo-citation-nap-checklist', minReferringPages: 4, label: 'MEO NAP checklist article' },
];

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

function pagePathForFile(filePath) {
  const relativePath = path.relative(root, filePath).replaceAll(path.sep, '/');

  if (relativePath === 'index.html') return '/';
  if (relativePath.endsWith('/index.html')) {
    return `/${relativePath.slice(0, -'index.html'.length)}`;
  }

  return `/${relativePath.replace(/\.html$/, '')}`;
}

function basePathForPage(pagePath) {
  if (pagePath.endsWith('/')) return pagePath;
  return pagePath.slice(0, pagePath.lastIndexOf('/') + 1);
}

function normalizeInternalPath(reference, basePath) {
  if (
    !reference ||
    reference.startsWith('#') ||
    /^(mailto:|tel:|javascript:|data:)/i.test(reference)
  ) {
    return null;
  }

  let url;
  try {
    url = /^https?:\/\//i.test(reference)
      ? new URL(reference)
      : new URL(reference, `https://digitool-lab.com${basePath}`);
  } catch {
    return null;
  }

  if (url.hostname !== 'digitool-lab.com') return null;

  let pathname = url.pathname;
  if (pathname !== '/' && pathname.endsWith('/index.html')) {
    pathname = pathname.slice(0, -'index.html'.length);
  }
  if (pathname.endsWith('.html')) {
    pathname = pathname.slice(0, -'.html'.length);
  }

  return pathname;
}

walk(root);

const referringPages = new Map(
  priorityPages.map((page) => [page.pathname, new Set()]),
);

for (const filePath of htmlFiles) {
  const sourcePath = pagePathForFile(filePath);
  const basePath = basePathForPage(sourcePath);
  const html = fs.readFileSync(filePath, 'utf8');

  for (const match of html.matchAll(/href=(['"])([^'"]+)\1/g)) {
    const linkedPath = normalizeInternalPath(match[2], basePath);
    if (!linkedPath) continue;

    for (const page of priorityPages) {
      if (linkedPath === page.pathname && sourcePath !== page.pathname) {
        referringPages.get(page.pathname).add(sourcePath);
      }
    }
  }
}

const findings = [];

for (const page of priorityPages) {
  const count = referringPages.get(page.pathname).size;
  if (count < page.minReferringPages) {
    findings.push(
      `${page.pathname} (${page.label}) has ${count} referring pages; expected at least ${page.minReferringPages}.`,
    );
  }
}

if (findings.length) {
  console.error('Priority internal link audit failed.');
  console.error(findings.join('\n'));
  process.exit(1);
}

console.log(
  `Priority internal link audit passed: ${priorityPages.length} priority pages checked across ${htmlFiles.length} HTML files.`,
);
