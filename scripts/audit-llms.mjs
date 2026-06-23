import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const llmsFiles = ['llms.txt', 'llms_full.txt'];

const requiredTerms = [
  '株式会社デジタルツール研究所',
  'Digital Tool Laboratory Inc.',
  '松岡 哲平',
  '〒331-0821 埼玉県さいたま市北区別所町738-3',
  '048-700-7030',
  'contact@digitool-lab.com',
  'DX伴走支援',
  '社内ポータル開発',
  '業務システム開発',
  'AI研修',
  'MEO',
  'AIO',
  'LLMO',
];

const forbiddenTerms = [
  '東京都台東区',
  '台東区',
  '川島町',
  '大阪府',
  '048-606-4504',
  '0486064504',
];

const requiredUrls = [
  'https://digitool-lab.com/',
  'https://digitool-lab.com/about',
  'https://digitool-lab.com/service',
  'https://digitool-lab.com/dx-support-saitama/',
  'https://digitool-lab.com/area/saitama-city-dx/',
  'https://digitool-lab.com/it-tantou-outsourcing/',
  'https://digitool-lab.com/internal-portal-development/',
  'https://digitool-lab.com/business-system-development/',
  'https://digitool-lab.com/ai-training-saitama/',
  'https://digitool-lab.com/excel-paper-dx/',
  'https://digitool-lab.com/subsidy-dx-ai-system/',
  'https://digitool-lab.com/downloads/',
  'https://digitool-lab.com/case-themes/',
  'https://digitool-lab.com/industries/',
  'https://digitool-lab.com/ai-search-meo-support/',
  'https://digitool-lab.com/case-studies',
  'https://digitool-lab.com/contact',
  'https://digitool-lab.com/blog/dx-support-cost',
  'https://digitool-lab.com/blog/business-system-development-cost',
  'https://digitool-lab.com/blog/internal-portal-development-cost',
  'https://digitool-lab.com/blog/ai-training-cost',
  'https://digitool-lab.com/blog/dx-consulting-monthly-support',
  'https://digitool-lab.com/blog/ai-search-meo-citation-checklist',
  'https://digitool-lab.com/blog/ai-search-company-information-checklist',
  'https://digitool-lab.com/blog/meo-citation-nap-checklist',
  'https://showroom.digitool-lab.com/',
  'https://showroom.digitool-lab.com/subsidies',
];

function extractUrls(text) {
  return [...text.matchAll(/https?:\/\/[^\s)\]>]+/g)].map((match) =>
    match[0].replace(/[、。,.]+$/g, ''),
  );
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

const findings = [];

for (const file of llmsFiles) {
  const filePath = path.join(root, file);
  if (!fs.existsSync(filePath)) {
    findings.push(`${file}: file is missing.`);
    continue;
  }

  const text = fs.readFileSync(filePath, 'utf8');
  const urls = extractUrls(text);

  for (const term of requiredTerms) {
    if (!text.includes(term)) {
      findings.push(`${file}: required term is missing: ${term}`);
    }
  }

  for (const term of forbiddenTerms) {
    if (text.includes(term)) {
      findings.push(`${file}: forbidden old company/contact term is present: ${term}`);
    }
  }

  for (const requiredUrl of requiredUrls) {
    if (!urls.includes(requiredUrl)) {
      findings.push(`${file}: required URL is missing: ${requiredUrl}`);
    }
  }

  for (const rawUrl of urls) {
    let url;
    try {
      url = new URL(rawUrl);
    } catch {
      findings.push(`${file}: invalid URL: ${rawUrl}`);
      continue;
    }

    if (url.protocol !== 'https:') {
      findings.push(`${file}: URL must use https: ${rawUrl}`);
    }

    if (url.hostname === 'www.digitool-lab.com') {
      findings.push(`${file}: URL must use the canonical host without www: ${rawUrl}`);
    }

    if (url.hostname === 'digitool-lab.com') {
      if (url.pathname.endsWith('.html')) {
        findings.push(`${file}: internal URL must be canonical without .html: ${rawUrl}`);
      }

      if (/\/index(?:\.html)?\/?$/i.test(url.pathname)) {
        findings.push(`${file}: internal URL must not point at index.html: ${rawUrl}`);
      }

      if (url.search) {
        findings.push(`${file}: internal URL must not include query parameters: ${rawUrl}`);
      }

      if (!existsForPathname(url.pathname)) {
        findings.push(`${file}: internal URL does not resolve to a local page: ${rawUrl}`);
      }
    }
  }
}

if (findings.length) {
  console.error('LLMS audit failed.');
  console.error(findings.join('\n'));
  process.exit(1);
}

console.log(`LLMS audit passed: ${llmsFiles.join(', ')} checked.`);
