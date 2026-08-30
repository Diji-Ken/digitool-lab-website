#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;

const pages = {
  dxLocal: "dx-support-saitama/index.html",
  dxCost: "blog/dx-support-cost.html",
  aiLocal: "ai-training-saitama/index.html",
  aiCost: "blog/ai-training-cost.html",
  portalCost: "blog/internal-portal-development-cost.html",
  nap: "blog/meo-citation-nap-checklist.html",
  consulting: "services/consulting.html",
  llms: "llms.txt",
  llmsFull: "llms_full.txt",
};

const content = Object.fromEntries(
  Object.entries(pages).map(([key, file]) => [key, readFileSync(join(root, file), "utf8")]),
);

const findings = [];

function requireAll(key, labels) {
  for (const label of labels) {
    if (!content[key].includes(label)) {
      findings.push(`${pages[key]}: missing priority intent text: ${label}`);
    }
  }
}

requireAll("dxLocal", [
  "<title>埼玉・さいたま市のDXコンサル・伴走支援",
  "月額10万円から",
  '"price": "100000"',
  "DXコンサルとDX伴走支援は何が違いますか？",
]);
requireAll("dxCost", [
  "<title>DX支援の費用",
  "月額10万円",
  'href="../services/consulting"',
]);
requireAll("consulting", [
  "月額10万円",
  '"price": "100000"',
]);
requireAll("aiLocal", [
  "<title>埼玉の企業向け生成AI研修",
  "さいたま市北区を拠点",
  "埼玉県内で訪問研修に対応できますか？",
  "オンライン研修",
]);
requireAll("aiCost", [
  "<title>生成AI研修・AI研修の費用相場",
  "中小企業のAI研修で見積を分ける4項目",
  "事前ヒアリング・教材設計",
  "研修後の定着支援",
]);
requireAll("portalCost", [
  "<title>社内ポータルの費用相場",
  "数十万円台から",
  "100万円台から300万円台以上",
  "300万円超",
]);
requireAll("nap", [
  "<title>NAPとは？",
  "NAPはName・Address・Phoneの略",
  "MEOでは公式HP・GBP・外部媒体で揃えます",
]);
requireAll("llms", [
  "DX伴走支援「OToMo」: 月額10万円から",
  "DXコンサル 埼玉",
  "生成AI研修 費用",
  "NAP MEO",
]);
requireAll("llmsFull", [
  "DX伴走支援「OToMo」は月額10万円から",
  "埼玉県内の訪問研修",
]);

if (findings.length) {
  console.error(`GSC priority intent audit failed: ${findings.length} finding(s).`);
  for (const finding of findings) console.error(`  ${finding}`);
  process.exit(1);
}

console.log("GSC priority intent audit passed: 6 query-led pages and pricing/AIO summaries checked.");
