# GSC公開後チェックリスト

作成日: 2026-06-23
対象: `digitool-lab.com` / `showroom.digitool-lab.com`

## 目的

新規LP、記事、資料DLページ、showroom重要ページを公開したあとに、Google Search Consoleで確認すべき作業を固定化する。公開しただけで終わらせず、Googleが読める状態、検索に出る状態、クリックされる状態まで追う。

## 公開前にローカルで確認する

- `sitemap.xml` にindex対象URLだけが入っている
- `lastmod` が公開日または更新日に合っている
- canonical が本番URLと一致している
- noindex が混入していない
- title、description、H1が検索意図と一致している
- 見える本文とFAQPage/Article/Serviceなどの構造化データが矛盾していない
- 重要LP、関連記事、資料DL、問い合わせへの内部リンクがある
- 画像altが内容を説明している
- PC/スマホで横スクロールやCTA欠けがない
- `node scripts/audit-seo-links.mjs`
- `node scripts/audit-seo-indexability.mjs`
- `node scripts/audit-structured-data.mjs`
- `node scripts/audit-priority-internal-links.mjs`

## 公開直後にGSCで確認する

- `digitool-lab.com/sitemap.xml` を再送信する
- showroomを更新した場合は `showroom.digitool-lab.com/sitemap.xml` も再送信する
- URL検査で公開URLを検査する
- ライブURLテストでクロール可能か確認する
- 重要ページはインデックス登録リクエストを実行する
- 旧URL、`.html`、`index.html`、http/wwwのリダイレクトがある場合は、正規URLへ301到達するか確認する
- 404/リダイレクトエラーの修正をした場合は、検証開始または検証結果を確認する

## 3〜7日後にGSCで確認する

- ページのインデックス登録状況を確認する
- `クロール済み - インデックス未登録` に残った場合、本文量、独自性、内部リンク、title、description、canonicalを再確認する
- `検出 - インデックス未登録` に残った場合、内部リンクとsitemap読み込み状況を再確認する
- 検索パフォーマンスで表示回数、クリック、CTR、平均順位を初期値として記録する
- 低CTRならtitle、description、冒頭回答、FAQを調整する
- 8〜20位なら本文補強と内部リンク追加を行う

## 週次で確認する

- ドメイン全体の検索パフォーマンスをCSV保存する
- `digitool-lab.com`、`showroom`、`plat`、`shop`、`www/http` をホスト別に見る
- 重点クラスタを確認する: さいたま市、DX支援、業務システム、社内ポータル、AI研修、MEO、サイテーション、補助金
- 未登録URLを重要/放置/noindex/リダイレクト/削除候補へ分ける
- sitemap最終読み込み日と検出URL数を確認する

## 月次で確認する

- 手動対策
- セキュリティ問題
- HTTPS
- パンくず
- Core Web Vitals
- 構造化データ拡張レポート
- 内部リンク上位/下位ページ
- 外部リンク元と外部公開ログの突き合わせ
- GSCに生成AI/AI features系レポートが表示されたか
- GA4のCVページとGSCクエリの突き合わせ

## 記録先

- 全体TODO: `seo-audit-todo.md`
- GSC全体TODO: `gsc-domain-full-todo-20260623.md`
- 未登録URL仕分け: `gsc-index-coverage-triage-20260623.md`
- 検索パフォーマンス改善: `gsc-performance-opportunities-20260623.md`
- 技術ヘルス: `gsc-technical-health-20260623.md`
- 外部公開ログ: `posts-management/external-publication-log-20260611.csv`
