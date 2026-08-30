import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const expectedHours = 'Mo-Fr 10:00-18:00';
const mapsUrl = 'https://www.google.com/maps?cid=8108471246907015775';
const yahooMapUrl = 'https://map.yahoo.co.jp/v3/place/q67CJbOIEcc';
const gbizUrl = 'https://info.gbiz.go.jp/hojin/ichiran?hojinBango=9030001161292';
const corporateNumber = '9030001161292';
const currentPostalCode = '331-0821';
const currentAddress = '埼玉県さいたま市北区別所町738-3';
const staleNapFragments = [
  '110-0004',
  '東京都台東区',
  '台東区下谷',
  '下谷2丁目23',
  'リベール上野',
  '埼玉県比企郡川島町',
];
const excludedDirectories = new Set([
  '.git',
  'node_modules',
  'backup_20250703_112022',
  'backup_images_20250727_213226',
  'backup_images_20250727_213230',
  'article-workspace',
  'posts-management',
]);

function htmlFiles(directory) {
  const results = [];

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && excludedDirectories.has(entry.name)) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) results.push(...htmlFiles(fullPath));
    if (entry.isFile() && entry.name.endsWith('.html')) results.push(fullPath);
  }

  return results;
}

function requireText(file, values, findings) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  for (const value of values) {
    if (!source.includes(value)) findings.push(`${file}: missing ${value}`);
  }
}

const findings = [];

requireText('index.html', [expectedHours, mapsUrl, yahooMapUrl, gbizUrl, corporateNumber, '"dateModified":'], findings);
requireText('about.html', [expectedHours, mapsUrl, yahooMapUrl, gbizUrl, corporateNumber, '"dateModified":'], findings);
requireText('llms.txt', [mapsUrl, yahooMapUrl, gbizUrl, corporateNumber], findings);
requireText('llms_full.txt', [mapsUrl, yahooMapUrl, gbizUrl, corporateNumber], findings);
requireText('data-deletion.html', ['営業時間: 平日 10:00-18:00'], findings);
requireText('facebook-data-deletion.html', ['営業時間: 平日 10:00-18:00'], findings);
requireText('privacy-policy.html', [currentPostalCode, currentAddress], findings);

for (const filePath of htmlFiles(root)) {
  const source = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(root, filePath);
  if (source.includes('"openingHours": "Mo-Fr 09:00-18:00"')) {
    findings.push(`${relativePath}: stale structured business hours`);
  }
  if (source.includes('<p>営業時間: 平日 9:00-18:00</p>')) {
    findings.push(`${relativePath}: stale contact business hours`);
  }
  if (source.includes('<p>平日 9:00-18:00</p>')) {
    findings.push(`${relativePath}: stale footer business hours`);
  }
  for (const fragment of staleNapFragments) {
    if (source.includes(fragment)) {
      findings.push(`${relativePath}: stale NAP fragment: ${fragment}`);
    }
  }
}

if (findings.length) {
  console.error('Local business consistency audit failed.');
  for (const finding of findings) console.error(`- ${finding}`);
  process.exit(1);
}

console.log(`Local business consistency audit passed: hours, entity references, and ${staleNapFragments.length} stale NAP fragments checked.`);
