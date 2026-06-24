# Oracle Prompt: SEO/AIO/LLMO 100本記事制作レビュー

あなたはSEO/AIO/LLMOと中小企業向けBtoBコンテンツ設計に強い編集長です。

## 背景

株式会社デジタルツール研究所は、埼玉県さいたま市北区を拠点に、中小企業向けのDX伴走支援、社内ポータル開発、業務システム開発、AI研修、AI検索/MEO/サイテーション情報整備を行っています。

公式HP `https://digitool-lab.com/` を主戦場にし、showroom `https://showroom.digitool-lab.com/` は事例・補助金探索、note/Qiita/Zenn/GBP/LinkedInは外部導線として使います。

現在、HPには主要LP、費用記事、比較記事、事例記事、llms.txt、構造化データ、GSC連携、技術SEO監査が入っています。記事ドラフトは `article_drafts` に818件あり、HP204件、note362件、X252件、approved194件です。

## 添付予定ファイル

- `seo-100-article-direction-20260624.md`
- `seo-verification-snapshot-20260624.md`
- `seo-aio-llmo-strategy-ledger.md`
- `seo-content-and-external-action-queue-20260610.md`
- `gsc-domain-action-board-20260624.md`
- `llms.txt`
- `llms_full.txt`
- `/Users/m/Workspace/Code/digiken-platform/.claude/knowledge/article-style-hp.md`
- `/Users/m/Workspace/Code/digiken-platform/.claude/knowledge/article-style-note.md`
- `/Users/m/Workspace/Code/digiken-platform/.claude/knowledge/article-style-x.md`

## 依頼

`seo-100-article-direction-20260624.md` の100本方針をレビューしてください。

欲しい出力:

1. 100本方針の問題点
   - 重複している検索意図
   - 問い合わせに遠いテーマ
   - 自社HPではなくnote/外部媒体に回した方がよいテーマ
   - 市町村名差し替え量産に見えるリスク
2. 優先順位の再設計
   - P0: すぐHP公開すべき10本
   - P1: 30日以内にHP公開すべき30本
   - P2: GSCデータを見て判断する30本
   - External: note/Qiita/Zenn/GBP/LinkedIn向け30本
3. 記事テンプレート
   - HP事例記事テンプレート
   - CV直結記事テンプレート
   - note記事テンプレート
   - Qiita/Zenn技術記事テンプレート
4. 10本ずつ生成するためのバッチプロンプト
   - Batch 1: HP事例記事10本
   - Batch 2: CV直結記事10本
   - Batch 3: 業種別記事10本
   - Batch 4: 課題別記事10本
   - Batch 5: note/Qiita/Zenn外部導線10本
5. 品質基準
   - 公開前チェックリスト
   - 重複回避ルール
   - AIO/LLMO向けのFAQ/構造化データ/llms反映ルール

## 制約

- 100本の本文を一括で書かない。まずは設計とバッチプロンプトまで。
- 顧客名、売上、実績金額など未確認の固有情報を創作しない。
- 自社HPとnoteに同じ記事を転載しない。
- さいたま市以外の市町村ページを量産しない。地域実体があるものだけ扱う。
- SEOだけでなく、問い合わせ・資料DL・無料相談につながる導線を優先する。
- 「DX」「AI」「システム開発」を抽象語のまま使いすぎず、現場業務に落とし込む。
