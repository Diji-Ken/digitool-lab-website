#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// コマンドライン引数から情報を取得
const args = process.argv.slice(2);
if (args.length < 3) {
    console.log('使用方法: node create-case-study.js <case-number> <title> <industry>');
    console.log('例: node create-case-study.js 026 "AIによる業務効率化" "製造業"');
    process.exit(1);
}

const [caseNumber, title, industry] = args;
const caseId = `case-${caseNumber.padStart(3, '0')}`;

// テンプレートを読み込み
const templatePath = path.join(__dirname, '..', 'case-template.html');
const template = fs.readFileSync(templatePath, 'utf8');

// プレースホルダーを置換
const content = template
    .replace(/{{CASE_ID}}/g, caseId)
    .replace(/{{TITLE}}/g, title)
    .replace(/{{INDUSTRY}}/g, industry)
    .replace(/{{DATE}}/g, new Date().toISOString().split('T')[0]);

// HTMLファイルを作成
const outputPath = path.join(__dirname, '..', `${caseId}.html`);
fs.writeFileSync(outputPath, content);

// JSONデータを更新
const jsonPath = path.join(__dirname, '..', 'data', 'case-studies.json');
const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const newCase = {
    "id": caseId,
    "title": title,
    "summary": "（要約を入力してください）",
    "industry": industry,
    "date": new Date().toISOString().split('T')[0],
    "tags": [industry, "（タグを追加してください）"],
    "thumbnail": `images/case-thumbnail-${caseNumber.padStart(3, '0')}.jpg`
};

jsonData.push(newCase);
fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2));

console.log(`✅ 新しい事例記事を作成しました:`);
console.log(`   HTMLファイル: ${caseId}.html`);
console.log(`   JSONデータに追加済み`);
console.log(`\n次の手順:`);
console.log(`1. ${caseId}.html を編集して内容を入力`);
console.log(`2. images/case-thumbnail-${caseNumber.padStart(3, '0')}.jpg を追加`);
console.log(`3. data/case-studies.json のsummaryとtagsを更新`); 
 
 
 