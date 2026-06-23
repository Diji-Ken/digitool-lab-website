import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const priorityClusters = [
  { name: 'さいたま市・地域', patterns: [/さいたま|埼玉|上尾|行田|桶川|伊奈|北区|別所町/i] },
  { name: 'DX支援', patterns: [/dx|デジタル化|業務効率|業務改善|伴走/i] },
  { name: '業務システム', patterns: [/業務システム|基幹|システム開発|受発注|在庫|帳票|レポート/i] },
  { name: '社内ポータル', patterns: [/社内ポータル|ポータル|ナレッジ|faq|情報共有/i] },
  { name: 'AI活用・AI研修', patterns: [/ai|生成ai|chatgpt|gemini|研修|講座/i] },
  { name: 'MEO・サイテーション', patterns: [/meo|サイテーション|googleビジネス|map|マップ|口コミ/i] },
  { name: '補助金', patterns: [/補助金|助成金|省力化|it導入/i] },
  { name: '費用・相場', patterns: [/費用|相場|料金|価格|いくら|見積/i] },
  { name: '事例', patterns: [/事例|導入|活用|ケース/i] },
];

const columnAliases = {
  dimension: [
    'query',
    'queries',
    'top queries',
    'page',
    'pages',
    'top pages',
    'クエリ',
    '検索キーワード',
    '上位のクエリ',
    'ページ',
    '上位のページ',
  ],
  query: ['query', 'queries', 'top queries', 'クエリ', '検索キーワード', '上位のクエリ'],
  page: ['page', 'pages', 'top pages', 'ページ', '上位のページ'],
  clicks: ['clicks', 'クリック数', 'クリック'],
  impressions: ['impressions', '表示回数', '表示'],
  ctr: ['ctr', 'クリック率'],
  position: ['position', 'average position', '掲載順位', '平均掲載順位', '平均順位'],
};

function usage() {
  console.error(`Usage:
  node scripts/analyze-gsc-performance.mjs <gsc-export.csv> [--out report.md]

Expected CSV columns can be either English or Japanese Search Console exports:
  Query/Page, Clicks, Impressions, CTR, Position
  クエリ/ページ, クリック数, 表示回数, CTR, 掲載順位`);
  process.exit(1);
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const csvPath = args.find((arg) => !arg.startsWith('--'));
  const outIndex = args.indexOf('--out');
  const outPath = outIndex >= 0 ? args[outIndex + 1] : null;
  if (!csvPath) usage();
  if (outIndex >= 0 && !outPath) usage();
  return { csvPath, outPath };
}

function parseCsv(text) {
  const rows = [];
  let field = '';
  let row = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        field += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      row.push(field);
      field = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') i += 1;
      row.push(field);
      if (row.some((value) => value.trim() !== '')) rows.push(row);
      row = [];
      field = '';
      continue;
    }

    field += char;
  }

  row.push(field);
  if (row.some((value) => value.trim() !== '')) rows.push(row);
  return rows;
}

function normalizeHeader(value) {
  return value
    .replace(/^\uFEFF/, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

function findColumn(headers, aliases) {
  const normalizedAliases = aliases.map(normalizeHeader);
  for (const alias of normalizedAliases) {
    const index = headers.findIndex((header) => header === alias);
    if (index >= 0) return index;
  }
  for (const alias of normalizedAliases) {
    const index = headers.findIndex((header) => header.includes(alias) || alias.includes(header));
    if (index >= 0) return index;
  }
  return -1;
}

function parseNumber(value) {
  if (value == null) return 0;
  const normalized = String(value).replace(/[,%]/g, '').trim();
  if (!normalized) return 0;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseCtr(value) {
  if (value == null) return 0;
  const text = String(value).trim();
  const number = parseNumber(text);
  return text.includes('%') ? number / 100 : number > 1 ? number / 100 : number;
}

function getHost(value) {
  try {
    return new URL(value).host;
  } catch {
    return '';
  }
}

function formatPct(value) {
  return `${(value * 100).toFixed(2).replace(/\.00$/, '')}%`;
}

function formatNumber(value) {
  return Math.round(value).toLocaleString('ja-JP');
}

function classify(text) {
  return priorityClusters
    .filter((cluster) => cluster.patterns.some((pattern) => pattern.test(text)))
    .map((cluster) => cluster.name);
}

function markdownTable(headers, rows) {
  if (!rows.length) return '_対象なし_';
  const head = `| ${headers.join(' | ')} |`;
  const sep = `| ${headers.map(() => '---').join(' | ')} |`;
  const body = rows.map((row) => `| ${row.map((value) => String(value).replace(/\n/g, '<br>')).join(' | ')} |`);
  return [head, sep, ...body].join('\n');
}

function actionFor(row) {
  const text = row.dimension;
  const clusters = classify(text);

  if (clusters.includes('費用・相場')) return '費用レンジ、見積前チェック、FAQ、比較表を冒頭近くに追加する';
  if (clusters.includes('事例')) return 'title/H1を具体化し、関連LPと資料DLへの内部リンクを追加する';
  if (clusters.includes('MEO・サイテーション')) return 'NAP変更後の手順、禁止事項、GBP/サイテーション導線を明確化する';
  if (clusters.includes('AI活用・AI研修')) return 'AI活用の用途、社内ルール、費用、対象部署のFAQを追加する';
  if (clusters.includes('社内ポータル')) return '要件整理、権限、運用定着、費用ページへの導線を追加する';
  if (clusters.includes('業務システム')) return 'Excel/紙業務からの移行判断、費用、開発事例への導線を追加する';
  if (clusters.includes('補助金')) return '補助金を使う前の要件整理、showroom補助金カテゴリへの導線を追加する';
  if (clusters.includes('さいたま市・地域')) return 'さいたま市/埼玉の対応範囲、会社情報、地域LPへの内部リンクを追加する';
  return 'title、description、冒頭回答、FAQ、内部リンクを検索意図に合わせて見直す';
}

function toRecord(headers, row) {
  const queryIndex = findColumn(headers, columnAliases.query);
  const pageIndex = findColumn(headers, columnAliases.page);
  const dimensionIndex = queryIndex >= 0 ? queryIndex : pageIndex >= 0 ? pageIndex : findColumn(headers, columnAliases.dimension);
  const clicksIndex = findColumn(headers, columnAliases.clicks);
  const impressionsIndex = findColumn(headers, columnAliases.impressions);
  const ctrIndex = findColumn(headers, columnAliases.ctr);
  const positionIndex = findColumn(headers, columnAliases.position);

  if (dimensionIndex < 0 || clicksIndex < 0 || impressionsIndex < 0 || positionIndex < 0) {
    throw new Error(`Missing required columns. Headers: ${headers.join(', ')}`);
  }

  const dimension = (row[dimensionIndex] || '').trim();
  const clicks = parseNumber(row[clicksIndex]);
  const impressions = parseNumber(row[impressionsIndex]);
  const ctr = ctrIndex >= 0 ? parseCtr(row[ctrIndex]) : impressions ? clicks / impressions : 0;
  const position = parseNumber(row[positionIndex]);
  const host = getHost(dimension);
  const type = queryIndex >= 0 ? 'query' : pageIndex >= 0 ? 'page' : host ? 'page' : 'query';

  return {
    dimension,
    type,
    host,
    clicks,
    impressions,
    ctr,
    position,
    clusters: classify(dimension),
  };
}

function buildReport(records, sourcePath) {
  const totalClicks = records.reduce((sum, row) => sum + row.clicks, 0);
  const totalImpressions = records.reduce((sum, row) => sum + row.impressions, 0);
  const weightedPosition = records.reduce((sum, row) => sum + row.position * Math.max(row.impressions, 1), 0);
  const weight = records.reduce((sum, row) => sum + Math.max(row.impressions, 1), 0);
  const overallCtr = totalImpressions ? totalClicks / totalImpressions : 0;

  const lowCtr = records
    .filter((row) => row.impressions >= 20 && row.ctr < 0.01 && row.position <= 25)
    .sort((a, b) => b.impressions - a.impressions || a.position - b.position)
    .slice(0, 20);

  const nearTop = records
    .filter((row) => row.impressions >= 10 && row.position >= 8 && row.position <= 20)
    .sort((a, b) => a.position - b.position || b.impressions - a.impressions)
    .slice(0, 20);

  const clusterRows = priorityClusters.map((cluster) => {
    const matched = records.filter((row) => row.clusters.includes(cluster.name));
    const clicks = matched.reduce((sum, row) => sum + row.clicks, 0);
    const impressions = matched.reduce((sum, row) => sum + row.impressions, 0);
    const avgPosition = matched.length
      ? matched.reduce((sum, row) => sum + row.position * Math.max(row.impressions, 1), 0) /
        matched.reduce((sum, row) => sum + Math.max(row.impressions, 1), 0)
      : 0;
    return { name: cluster.name, count: matched.length, clicks, impressions, ctr: impressions ? clicks / impressions : 0, position: avgPosition };
  }).filter((row) => row.count > 0).sort((a, b) => b.impressions - a.impressions);

  const hostMap = new Map();
  for (const row of records.filter((item) => item.host)) {
    const current = hostMap.get(row.host) || { host: row.host, count: 0, clicks: 0, impressions: 0, weightedPosition: 0, weight: 0 };
    current.count += 1;
    current.clicks += row.clicks;
    current.impressions += row.impressions;
    current.weightedPosition += row.position * Math.max(row.impressions, 1);
    current.weight += Math.max(row.impressions, 1);
    hostMap.set(row.host, current);
  }

  const hostRows = [...hostMap.values()]
    .map((row) => ({ ...row, ctr: row.impressions ? row.clicks / row.impressions : 0, position: row.weight ? row.weightedPosition / row.weight : 0 }))
    .sort((a, b) => b.impressions - a.impressions);

  const report = [];
  report.push('# GSC検索パフォーマンス自動分析');
  report.push('');
  report.push(`作成日: ${new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Tokyo' }).format(new Date())}`);
  report.push(`入力CSV: \`${sourcePath}\``);
  report.push('');
  report.push('## 全体');
  report.push('');
  report.push(markdownTable(
    ['項目', '値'],
    [
      ['行数', formatNumber(records.length)],
      ['クリック', formatNumber(totalClicks)],
      ['表示回数', formatNumber(totalImpressions)],
      ['CTR', formatPct(overallCtr)],
      ['平均掲載順位', (weightedPosition / Math.max(weight, 1)).toFixed(2)],
    ],
  ));
  report.push('');
  report.push('## ホスト別露出');
  report.push('');
  report.push(hostRows.length ? markdownTable(
    ['ホスト', 'URL数', 'クリック', '表示', 'CTR', '平均順位'],
    hostRows.map((row) => [
      row.host,
      row.count,
      formatNumber(row.clicks),
      formatNumber(row.impressions),
      formatPct(row.ctr),
      row.position.toFixed(2),
    ]),
  ) : '_ページURL CSVではないため、ホスト別集計はありません。_');
  report.push('');
  report.push('## 低CTR改善候補');
  report.push('');
  report.push(markdownTable(
    ['対象', '種類', '表示', 'クリック', 'CTR', '順位', 'クラスタ', '改善案'],
    lowCtr.map((row) => [
      row.dimension,
      row.type,
      formatNumber(row.impressions),
      formatNumber(row.clicks),
      formatPct(row.ctr),
      row.position.toFixed(2),
      row.clusters.join(', ') || '-',
      actionFor(row),
    ]),
  ));
  report.push('');
  report.push('## 8〜20位の上位化候補');
  report.push('');
  report.push(markdownTable(
    ['対象', '種類', '表示', 'クリック', 'CTR', '順位', 'クラスタ', '改善案'],
    nearTop.map((row) => [
      row.dimension,
      row.type,
      formatNumber(row.impressions),
      formatNumber(row.clicks),
      formatPct(row.ctr),
      row.position.toFixed(2),
      row.clusters.join(', ') || '-',
      actionFor(row),
    ]),
  ));
  report.push('');
  report.push('## 重点クラスタ');
  report.push('');
  report.push(markdownTable(
    ['クラスタ', '件数', 'クリック', '表示', 'CTR', '平均順位'],
    clusterRows.map((row) => [
      row.name,
      row.count,
      formatNumber(row.clicks),
      formatNumber(row.impressions),
      formatPct(row.ctr),
      row.position.toFixed(2),
    ]),
  ));
  report.push('');
  report.push('## 次アクション');
  report.push('');
  report.push('- 低CTR改善候補から、問い合わせに近いページ/クエリを3〜5件だけ選んでtitle、description、H1、冒頭回答、FAQを修正する。');
  report.push('- 8〜20位候補は、新規記事を作る前に既存ページへの内部リンクとFAQ追加を優先する。');
  report.push('- ホスト別露出で `plat`、`shop`、低優先showroom URLが増えている場合は、index対象/対象外ルールを見直す。');
  report.push('- 外部発信やサイテーションを実施した月は、GSCリンクレポートと外部公開ログを照合する。');

  return report.join('\n');
}

const { csvPath, outPath } = parseArgs(process.argv);
const absoluteCsvPath = path.resolve(csvPath);

if (!fs.existsSync(absoluteCsvPath)) {
  throw new Error(`CSV file not found: ${absoluteCsvPath}`);
}

const rows = parseCsv(fs.readFileSync(absoluteCsvPath, 'utf8'));
if (rows.length < 2) throw new Error(`CSV has no data rows: ${absoluteCsvPath}`);

const headers = rows[0].map(normalizeHeader);
const records = rows
  .slice(1)
  .map((row) => toRecord(headers, row))
  .filter((row) => row.dimension && row.impressions > 0);

const report = buildReport(records, csvPath);

if (outPath) {
  fs.mkdirSync(path.dirname(path.resolve(outPath)), { recursive: true });
  fs.writeFileSync(outPath, report, 'utf8');
  console.log(`GSC performance report written: ${outPath}`);
} else {
  console.log(report);
}
