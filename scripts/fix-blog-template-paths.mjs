#!/usr/bin/env node
// blog配下の記事のうち、case-template.html をルート用のままコピーして作られた12件を直す。
//
// 背景（2026-08-01）:
//   case-template.html は「ルート直下に置く・noindex」前提のひな型。
//   これを blog/ 配下の記事として使ったため、パスが1階層ずれ、robots も noindex のままになった。
//   結果、CIの SEO link audit が 2026-07-23 から9日間失敗し、記事が本番404のままだった。
//
// 直すもの:
//   1. パス（405箇所）… 相対パスを ../ 起点に直し、内部リンクの .html を落とす
//   2. noindex     … robots メタを削除して検索対象にする
//
// 置換の順序は入れ替えないこと。
//   case-studies.html?tag= を先に処理しないと ../case-studies.html?tag= になり、
//   「内部hrefに .html を含めない」というCIの別ルールで落ちる。
//
// 対象を12件に限定するのも必須。
//   blog配下45ファイルが href="./" を使うが、うち33件は兄弟記事への正しいリンクで、
//   一括置換すると 12失敗 → 33失敗 に悪化する。

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const APPLY = process.argv.includes("--apply");

const TARGETS = [
  "construction-payroll-5-days-to-1-day.html",
  "disability-support-records-2h-to-60min.html",
  "financial-planner-proposal-4-hours-to-1-hour.html",
  "healthfood-sales-slip-integration-20260801.html",
  "home-care-support-records-8.html",
  "machine-technical-translation-20260719.html",
  "manufacturing-daily-report-5-minutes.html",
  "metal-factory-payroll-ai-25-to-7-hours.html",
  "metal-manufacturing-delivery-answer-app.html",
  "nail-salon-reservation-workflow-case.html",
  "printing-sales-proposal-20260719.html",
  "senior-housing-information-sharing-30.html",
];

const ROOT_ASSETS =
  "favicon\\.ico|favicon-16x16\\.png|favicon-32x32\\.png|apple-touch-icon\\.png|android-chrome-192x192\\.png|android-chrome-512x512\\.png|site\\.webmanifest";

// 順序が意味を持つ。上から順に適用する。
const RULES = [
  {
    name: "case-studies.html?tag= を ../case-studies?tag= へ（.html も落とす）",
    from: /href="case-studies\.html\?tag=/g,
    to: 'href="../case-studies?tag=',
  },
  {
    name: "絶対URLの contact.html から .html を落とす",
    from: /href="https:\/\/digitool-lab\.com\/contact\.html"/g,
    to: 'href="https://digitool-lab.com/contact"',
  },
  {
    name: "ルート直下のアイコン・マニフェストに ../ を付ける",
    from: new RegExp(`href="(${ROOT_ASSETS})"`, "g"),
    to: 'href="../$1"',
  },
  { name: "css/ に ../ を付ける", from: /href="css\//g, to: 'href="../css/' },
  { name: "images/ に ../ を付ける", from: /src="images\//g, to: 'src="../images/' },
  { name: "js/ に ../ を付ける", from: /src="js\//g, to: 'src="../js/' },
  {
    name: "コメント内の case-studies?tag= にも ../ を付ける",
    from: /href="case-studies\?tag=/g,
    to: 'href="../case-studies?tag=',
  },
  { name: "href の ./ を ../ へ", from: /href="\.\//g, to: 'href="../' },
  { name: "src の ./ を ../ へ", from: /src="\.\//g, to: 'src="../' },
];

const NOINDEX = /\s*<meta name="robots" content="noindex, nofollow">\r?\n?/g;

let totalPath = 0;
let totalNoindex = 0;
const report = [];

for (const file of TARGETS) {
  const path = join(ROOT, "blog", file);
  const before = readFileSync(path, "utf8");
  let text = before;
  const counts = [];

  for (const rule of RULES) {
    const hits = (text.match(rule.from) ?? []).length;
    if (hits) {
      text = text.replace(rule.from, rule.to);
      counts.push(`${rule.name}:${hits}`);
      totalPath += hits;
    }
  }

  const noindexHits = (text.match(NOINDEX) ?? []).length;
  if (noindexHits) {
    text = text.replace(NOINDEX, "\n");
    totalNoindex += noindexHits;
  }

  // 直し漏れがないか自分で点検する
  const leftover = [];
  if (/href="(?!\.\.\/|https?:|#|mailto:|tel:|\/)[^"]*"/.test(text)) {
    const found = text.match(/href="(?!\.\.\/|https?:|#|mailto:|tel:|\/)[^"]*"/g) ?? [];
    leftover.push(...found.slice(0, 3));
  }
  if (/href="[^"]*\.html[^"]*"/.test(text)) {
    const found = text.match(/href="[^"]*\.html[^"]*"/g) ?? [];
    const internal = found.filter((h) => !/https?:\/\/(?!digitool-lab\.com)/.test(h));
    leftover.push(...internal.slice(0, 3));
  }

  report.push({ file, changed: before !== text, counts, noindexHits, leftover });
  if (APPLY && before !== text) writeFileSync(path, text, "utf8");
}

console.log(`${APPLY ? "適用" : "確認（dry-run）"}: ${TARGETS.length}件`);
console.log(`  パス修正 ${totalPath}箇所 / noindex削除 ${totalNoindex}件`);
console.log("");
for (const row of report) {
  console.log(`  ${row.file}`);
  console.log(`     ${row.counts.join(" / ")}${row.noindexHits ? " / noindex削除" : ""}`);
  if (row.leftover.length) console.log(`     ★直し漏れ: ${row.leftover.join(" , ")}`);
}
if (!APPLY) console.log("\n※ --apply で書き込みます");
