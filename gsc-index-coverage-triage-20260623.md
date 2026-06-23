# GSCインデックス未登録 初回仕分け台帳

作成日: 2026-06-23
対象プロパティ: `sc-domain:digitool-lab.com`

## 目的

GSCドメインプロパティで見える未登録985件を、すべて同じ問題として扱わず、SEO上の対応優先度に分ける。

- 検索に出すべきページは、本文量、内部リンク、title/description、sitemap、URL検査で改善する
- 検索に出すべきではないページは、noindex、410、301、robotsの設計どおりなら放置する
- サブドメイン別に、`digitool-lab.com`、`showroom.digitool-lab.com`、`plat.digitool-lab.com`、`shop.digitool-lab.com` を分けて見る

## GSC現状値

| 指標 | 件数 | 初回判断 |
|---|---:|---|
| 登録済み | 228 | 主要ページは増加傾向。重要LPと記事は継続監視 |
| 未登録 | 985 | 全件対応ではなく、理由別に仕分ける |
| リダイレクト | 424 | 多くは正規URL統合。旧URL/拡張子ありURLなら原則OK |
| noindex | 203 | テスト、テンプレート、完了画面、低優先補助ページならOK |
| クロール済み - インデックス未登録 | 289 | P1。重要ページだけ本文・内部リンク・検索意図を補強 |
| 検出 - インデックス未登録 | 53 | P1。重要URLは内部リンクとsitemap再送信、URL検査 |
| 404 | 5 | P0。既に301修正検証を開始済み。結果待ち |
| リダイレクトエラー | 1 | P0。`tokutei.html` は本番で `/tokutei` 200到達を確認済み。検証結果待ち |

## 2026-06-23 URL例抽出結果

GSCの「ページのインデックス登録」から、未登録理由ごとの代表URLを確認した。

| 理由 | 件数 | 代表URL例 | 判定 |
|---|---:|---|---|
| ページにリダイレクトがあります | 424 | `http://digitool-lab.com/index`, `https://digitool-lab.com/index.html`, `https://www.digitool-lab.com/`, `https://digitool-lab.com/service-otomo`, `https://showroom.digitool-lab.com/subsidies/338a85e9-e435-466e-a1af-d5d0d174a789` | 大半はhttp/www/index.html/旧URLの正規化で対応不要。内部リンクに `.html` が残る箇所は今後の低優先改善候補 |
| noindex タグによって除外されました | 203 | `https://showroom.digitool-lab.com/subsidies/a170f375-a549-4511-bf3f-8868993fcb0f`, `https://showroom.digitool-lab.com/subsidies/72bc8574-3726-42aa-806f-3db074dbcd58` | showroomの低優先補助金詳細が中心。AI/DX/省力化に近い補助金だけindex対象へ昇格する方針ならOK |
| 代替ページ（適切な canonical タグあり） | 4 | `https://showroom.digitool-lab.com/subsidies/dc46d598-43b1-40c2-9290-2508b7f4b314`, `https://www.digitool-lab.com/blog/restaurant-order-system-cost-reduction` | canonical統合として原則OK。`www` はnon-www正規化で対応不要 |
| 重複しています。ユーザーにより、正規ページとして選択されていません | 3 | `https://digitool-lab.com/data-deletion`, `https://www.digitool-lab.com/services/development`, `https://www.digitool-lab.com/blog/restaurant-shift-management` | 旧/補助ページの重複扱い。問い合わせ導線に直結しないため優先度低 |
| robots.txt によりブロックされました | 2 | `https://shop.digitool-lab.com/`, `https://shop.digitool-lab.com/product/lp自動文字起こしツール/` | shopは現状SEO対象外。EC再開時まで対応不要 |
| クロール済み - インデックス未登録 | 289 | `https://digitool-lab.com/blog/meo-citation-nap-checklist`, `https://digitool-lab.com/blog/ai-gemini-table-cleanup`, `https://digitool-lab.com/case-studies`, `https://digitool-lab.com/tokutei`, `https://showroom.digitool-lab.com/subsidies/internal-portal`, `https://showroom.digitool-lab.com/subsidies/system-development` | P1。`case-studies`、MEO/AIO記事、showroom主要補助金カテゴリを優先して内部リンク強化・URL検査対象にする |
| 検出 - インデックス未登録 | 53 | `https://digitool-lab.com/blog/ai-search-meo-citation-checklist`, `https://digitool-lab.com/blog/apartment-management-dx`, `https://digitool-lab.com/blog/restaurant-waste-cost-reduction`, `https://showroom.digitool-lab.com/cases`, `https://showroom.digitool-lab.com/pricing` | P1。内部リンク不足またはクロール待ち。問い合わせに近い記事とshowroom主要ページを優先する |
| 重複しています。Google により、ユーザーがマークしたページとは異なるページが正規ページとして選択されました | 1 | `https://showroom.digitool-lab.com/subsidies/e4e7c384-8843-4dd0-8810-8d7308d56350` | showroom補助金詳細1件。index対象外なら放置、重要補助金ならcanonical/本文重複を確認 |
| 見つかりませんでした（404） | 5 | `https://digitool-lab.com/ai-notebooklm-podcast-knowledge.html`, `https://digitool-lab.com/ai-gemini-document-comparison.html`, `https://digitool-lab.com/ai-notebooklm-law-podcast.html`, `https://digitool-lab.com/case-009`, `https://digitool-lab.com/case-016` | P0だが本番では全件301→200到達を確認済み。GSCの修正検証結果待ち |
| リダイレクト エラー | 1 | `https://digitool-lab.com/tokutei.html` | P0だが本番では301→`/tokutei` 200到達を確認済み。GSCの修正検証結果待ち |

優先して進めるURL:
- `https://digitool-lab.com/case-studies`
- `https://digitool-lab.com/blog/meo-citation-nap-checklist`
- `https://digitool-lab.com/blog/ai-search-meo-citation-checklist`
- `https://showroom.digitool-lab.com/subsidies/internal-portal`
- `https://showroom.digitool-lab.com/subsidies/system-development`
- `https://showroom.digitool-lab.com/cases`
- `https://showroom.digitool-lab.com/pricing`

低優先または放置でよいもの:
- `http` / `www` / `index.html` / `.html` から正規URLへの301
- `shop.digitool-lab.com` のrobotsブロック
- showroomの低優先補助金詳細noindex
- 旧URL404扱いだが本番で301済みの5件

## 2026-06-23 内部リンク強化・URL検査状況

実施済み:
- 主要HTML内の `case-studies.html`、`contact.html`、`about.html`、`service.html` への内部リンクを、拡張子なし正規URLへ寄せた
- 公開HTML全体の内部 `href` を再点検し、内部リンクに残る `.html` を0件化した
- 一部ブログ記事と補助金記事の相対リンク不整合を修正し、CSS、画像、内部リンクの参照切れ0件を確認した
- `scripts/audit-seo-links.mjs` を追加し、GitHub Actionsのデプロイ前に内部 `.html` href と内部参照切れを自動検査するようにした
- `scripts/audit-seo-indexability.mjs` を追加し、sitemap掲載URLの存在、canonical一致、noindex混入、title/description/H1、lastmod形式を自動検査するようにした
- `business-system-development/` から `https://showroom.digitool-lab.com/cases`、`https://showroom.digitool-lab.com/subsidies/system-development`、`https://showroom.digitool-lab.com/pricing` へ直接リンクを追加した
- `internal-portal-development/` から `https://showroom.digitool-lab.com/cases`、`https://showroom.digitool-lab.com/subsidies/internal-portal`、`https://showroom.digitool-lab.com/pricing` へ直接リンクを追加した
- `subsidy-dx-ai-system/` から `https://showroom.digitool-lab.com/subsidies/internal-portal`、`https://showroom.digitool-lab.com/subsidies/system-development`、`https://showroom.digitool-lab.com/cases` へ直接リンクを追加した
- `case-studies` から `https://showroom.digitool-lab.com/cases` と `https://showroom.digitool-lab.com/pricing` へ直接リンクを追加した
- `sitemap.xml` の `case-studies`、`internal-portal-development/`、`business-system-development/`、`subsidy-dx-ai-system/` の `lastmod` を `2026-06-23` に更新した
- `plat.digitool-lab.com/robots.txt` の本番404を解消し、VPS上の `digiken-platform` を `914c2b4` まで反映した。2026-06-23時点で `https://plat.digitool-lab.com/robots.txt` は200応答

本番反映確認:
- `https://digitool-lab.com/case-studies`、`business-system-development/`、`internal-portal-development/`、`subsidy-dx-ai-system/` は200応答
- 上記4ページで追加したshowroomリンクの反映を確認
- 上記4ページ内に `case-studies.html` が残っていないことを確認
- 公開HTML内の内部 `.html` href は0件、内部 `href/src` 参照切れは0件
- デプロイ前監査として `node scripts/audit-seo-links.mjs` を実行する
- デプロイ前監査として `node scripts/audit-seo-indexability.mjs` を実行する

GSC URL検査:
- `https://digitool-lab.com/case-studies`: 登録済み。インデックス登録を再リクエストし、優先クロールキュー追加を確認
- `https://digitool-lab.com/blog/meo-citation-nap-checklist`: 登録済み。インデックス登録を再リクエストし、優先クロールキュー追加を確認
- `https://digitool-lab.com/blog/ai-search-meo-citation-checklist`: `検出 - インデックス未登録`。インデックス登録リクエスト時にGSCの1日割り当て量上限に到達

次回GSCリクエスト対象:
- `https://digitool-lab.com/blog/ai-search-meo-citation-checklist`
- `https://showroom.digitool-lab.com/subsidies/internal-portal`
- `https://showroom.digitool-lab.com/subsidies/system-development`
- `https://showroom.digitool-lab.com/cases`
- `https://showroom.digitool-lab.com/pricing`

2026-06-23 追加実行:
- `https://digitool-lab.com/blog/ai-search-meo-citation-checklist`: `検出 - インデックス未登録`。インデックス登録リクエスト済み表示を確認。
- `https://showroom.digitool-lab.com/subsidies/internal-portal`: `クロール済み - インデックス未登録`。インデックス登録リクエスト済み表示を確認。
- `https://showroom.digitool-lab.com/subsidies/system-development`: `クロール済み - インデックス未登録`。リクエスト操作は実施したが、最終表示で「リクエスト済み」が安定しないため次回再確認対象。
- `https://showroom.digitool-lab.com/cases`: `検出 - インデックス未登録`。インデックス登録リクエスト済み表示を確認。
- `https://showroom.digitool-lab.com/pricing`: `検出 - インデックス未登録`。インデックス登録リクエスト済み表示を確認。
- GSCページインデックスレポートの最終更新日は2026/06/12のまま。404 5件とリダイレクトエラー1件は検証開始状態。

2026-06-23 追加リダイレクト改善:
- `.htaccess` の旧事例URL `/case-001.html` などが、一部 `*.html` 付き記事URLへ301され、その後に拡張子なしURLへ再301される2段階になっていたため、正規の拡張子なしURLへ直接301するように修正した。
- GSC上では旧URLが「ページにリダイレクトがあります」に残るのは正常だが、不要なリダイレクトチェーンを減らし、クロール効率と検証の見通しを改善した。

## カテゴリ別判断

### リダイレクト 424件

初回判断: 原則OK。ただし、主要LPや記事の誤ったリダイレクトが混ざっていないかだけ確認する。

根拠:
- `.htaccess` で `http -> https`、`www -> non-www`、`index.html -> /`、`.html -> 拡張子なし` を301正規化している
- 旧事例URL `/case-001.html` などを新しいブログURLへ301している
- `privacy.html`、`terms.html` は正規法務URLへ301している

次アクション:
- GSCで代表URL例を確認し、旧URL・拡張子ありURL・www/httpの正規化なら対応不要に分類する
- 主要LPが意図せず別ページへ飛んでいる例があれば個別修正する

### noindex 203件

初回判断: 多くはOK。サイトマップ混入がなければ放置。

根拠:
- noindex明示ページは、テスト、テンプレート、送信完了、計測設定、旧サービス、データ削除補助ページが中心
- ローカル確認でnoindexを含むHTML/PHPは22件
- GSCドメインプロパティでは `showroom` 側の補助金詳細noindexも含まれるため、URLプレフィックス単体より件数が増える

次アクション:
- noindex URLが `sitemap.xml` に入っていないか月次確認する
- `showroom` は社内ポータル、業務システム、AI/DX、省力化に近い補助金だけindex強化し、それ以外はnoindex方針を維持する

### クロール済み - インデックス未登録 289件

初回判断: 重要URLだけP1対応。全件indexを目指さない。

対応対象:
- 主要LP
- 問い合わせに近い費用・比較・選び方記事
- GSCで表示回数があるがCTRが低い記事
- `showroom` の補助金詳細のうち、システム開発・AI/DX・省力化に近いもの

対応しない候補:
- 低優先の補助金詳細
- 類似性が高い薄いデータページ
- テンプレート、一覧補助、検索結果に出す必要が薄いページ

次アクション:
- GSCでURL例を抽出し、重要URLだけ `title/H1/冒頭回答/FAQ/内部リンク/sitemap lastmod/URL検査` の改善対象へ回す

### 検出 - インデックス未登録 53件

初回判断: 重要URLなら内部リンク不足の可能性が高い。P1対応。

次アクション:
- sitemapにあるが未クロールのURLを確認する
- 重要URLは関連LP、記事、一覧ページからの内部リンクを追加する
- 本文が薄いDB詳細ページはindex対象から外すか、説明量を増やす

### 404 5件

初回判断: P0だが、修正済みの検証待ち。

根拠:
- 2026-06-23時点で、GSCの404例5件は本番で正規URLへ301済み
- GSCで修正検証を開始済み

次アクション:
- 数日後にGSC検証結果を確認する
- 新規404が出た場合は、正規URLがあるものは301、不要なものは410へ分類する

### リダイレクトエラー 1件

初回判断: P0だが、検証待ち。

根拠:
- `tokutei.html` は本番で `/tokutei` が200到達することを確認済み
- GSCで修正検証を開始済み

次アクション:
- GSCの修正検証結果を確認する
- 再発する場合は `.htaccess` の拡張子なしリライトと法務ページURLの順序を再確認する

## サブドメイン別方針

| ホスト | 方針 |
|---|---|
| `digitool-lab.com` | 主要LP、記事、資料DL、法務ページをindex対象。バックアップ、md、bak、作業管理系は410/noindex/robotsで除外 |
| `showroom.digitool-lab.com` | システム開発・AI/DX・省力化に近い事例と補助金だけindex強化。全補助金詳細のindexは狙わない |
| `plat.digitool-lab.com` | 社内ポータル用途。公開SEO対象ではないが、robots.txt 404はGSC重大エラーのため解消する |
| `shop.digitool-lab.com` | 現状はrobotsブロック方針。EC再開時だけindex方針を再設計 |

## 次に実施すること

1. `case-studies`、MEO/AIO記事、showroom主要カテゴリの内部リンクを増やす
2. 上記優先URLをURL検査し、未登録のものはインデックス登録をリクエストする
3. `showroom.digitool-lab.com` はindex対象補助金とnoindex維持補助金のルールを月次で見直す
4. `plat.digitool-lab.com/robots.txt` のGSCエラー消失を後日確認する
5. 404/リダイレクトエラーの検証結果を確認する
6. 内部リンクの `.html` 再混入を、新規ページ追加時と月次監査で確認する
