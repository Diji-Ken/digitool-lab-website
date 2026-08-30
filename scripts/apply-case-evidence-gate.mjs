import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const gatePath = path.join(root, 'data/case-evidence-status.json');
const caseDataPath = path.join(root, 'data/case-studies.json');
const sitemapPath = path.join(root, 'sitemap.xml');

const gate = JSON.parse(fs.readFileSync(gatePath, 'utf8'));
const entries = gate.entries.filter((entry) => entry.status === 'unverified');
const notice = `
<aside data-evidence-status="unverified" role="note" aria-label="このページの位置づけ" style="width:calc(100% - 2rem);max-width:800px;box-sizing:border-box;margin:2rem auto;padding:1.25rem 1.5rem;border:1px solid #f59e0b;border-left:5px solid #f59e0b;border-radius:10px;background:#fffbeb;color:#78350f;line-height:1.75;">
<strong style="display:block;margin-bottom:0.35rem;">内容確認中</strong>
<p style="margin:0;">本ページの出典と数値条件は確認中です。確認が完了するまで、特定企業への支援実績や成果保証を示す事例として扱いません。業務改善の検討材料としてご覧ください。</p>
</aside>`;

function robotsNoindex(html) {
  const robotsPattern = /<meta\b(?=[^>]*\bname=["']robots["'])[^>]*>/i;
  const robotsTag = '<meta name="robots" content="noindex, follow">';
  if (robotsPattern.test(html)) return html.replace(robotsPattern, robotsTag);
  if (!html.includes('</head>')) throw new Error('HTML head closing tag not found');
  return html.replace('</head>', `${robotsTag}\n</head>`);
}

function evidenceNotice(html) {
  const withoutOldNotice = html.replace(
    /\s*<aside\b[^>]*data-evidence-status=["']unverified["'][\s\S]*?<\/aside>/i,
    '',
  );
  if (/<main\b[^>]*>/i.test(html)) {
    return withoutOldNotice.replace(/(<main\b[^>]*>)/i, `$1${notice}`);
  }
  throw new Error('HTML article/main element not found');
}

for (const entry of entries) {
  const filePath = path.join(root, `${entry.url}.html`);
  if (!fs.existsSync(filePath)) throw new Error(`${entry.url}: HTML file not found`);
  const before = fs.readFileSync(filePath, 'utf8');
  const after = evidenceNotice(robotsNoindex(before));
  if (after !== before) fs.writeFileSync(filePath, after, 'utf8');
}

const cases = JSON.parse(fs.readFileSync(caseDataPath, 'utf8'));
const statusByUrl = new Map(entries.map((entry) => [entry.url, entry]));
for (const item of cases) {
  const entry = statusByUrl.get(item.url);
  if (!entry) continue;
  item.evidenceStatus = entry.status;
  item.evidenceReviewedAt = gate.reviewedAt;
}
fs.writeFileSync(caseDataPath, `${JSON.stringify(cases, null, 2)}\n`, 'utf8');

const targetLocs = new Set(entries.map((entry) => `https://digitool-lab.com/${entry.url}`));
let sitemap = fs.readFileSync(sitemapPath, 'utf8');
sitemap = sitemap.replace(/\s*<url>[\s\S]*?<\/url>/g, (block) => {
  const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1]?.trim();
  return targetLocs.has(loc) ? '' : block;
});
sitemap = sitemap.replace(/\s*<\/urlset>\s*$/, '\n</urlset>\n');
fs.writeFileSync(sitemapPath, sitemap, 'utf8');

console.log(`Evidence gate applied: ${entries.length} legacy case pages are noindex and removed from sitemap/listing.`);
