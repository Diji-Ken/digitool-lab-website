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
  businessSystem: "business-system-development/index.html",
  businessSystemCost: "blog/business-system-development-cost.html",
  meoLocal: "ai-search-meo-support/index.html",
  serviceHub: "service.html",
  dxProvider: "blog/how-to-choose-dx-support-company.html",
  aioCompanyInfo: "blog/ai-search-company-information-checklist.html",
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
requireAll("businessSystem", [
  "<title>埼玉・さいたま市の業務システム開発",
  "オーダーメイドシステム開発とは何ですか？",
  "顧客管理・マーケティング業務向けツールの相談例",
  "既存SaaSが向く範囲",
]);
requireAll("businessSystemCost", [
  "<title>業務システム開発の費用はいくら？",
  "数十万円台から",
  "100万〜300万円台以上",
  "300万円超",
  "業務システムの見積に含める6項目",
]);
requireAll("meoLocal", [
  "<title>埼玉・さいたま市のMEO対策",
  "関連性・距離・知名度",
  "行わないMEO対策",
  "実顧客の口コミ",
  "https://support.google.com/business/answer/7091?hl=ja",
]);
requireAll("serviceHub", [
  "DXツールを導入したが定着しなかった場合",
  "入力・権限・通知を簡素化",
  "利用率と業務時間を継続確認",
]);
requireAll("dxProvider", [
  "企業がDXプロバイダーを比較・選定する際に重視すべきポイントは何ですか？",
  "DXプロバイダー比較表",
  "業務理解",
  "導入後の改善",
]);
requireAll("aioCompanyInfo", [
  "会社名をAI検索で出してもらうために必要なページ数は？",
  "労務管理SaaSなどのBtoB SaaSがAI検索に引用されやすいページ構成は？",
  "AI検索対策に強い会社を見分ける7つの質問",
  "llms.txtはAI検索対策に必須ですか？",
  "https://developers.google.com/search/docs/appearance/ai-features",
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

console.log("GSC priority intent audit passed: 12 query-led pages and pricing/AIO summaries checked.");
