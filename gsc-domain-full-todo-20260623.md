# GSCドメイン全体活用TODO

作成日: 2026-06-23
対象プロパティ: `sc-domain:digitool-lab.com`
対象ホスト:

- `digitool-lab.com`
- `www.digitool-lab.com`
- `showroom.digitool-lab.com`
- `plat.digitool-lab.com`
- `shop.digitool-lab.com`

## 目的

`digitool-lab.com` 全体をGoogle Search Consoleのドメインプロパティで横断確認できるようになったため、公式HP、showroom、plat、shop、www/http/旧URLをまとめて監視し、SEO/AIO/LLMO/MEOに使える実行TODOへ落とす。

Google公式の位置づけでは、Search Consoleはクロール、インデックス、検索表示、検索パフォーマンスを確認し改善するためのツール。2026年6月時点では、AI Overviews / AI Modeなどの生成AI機能の表示状況を確認する専用レポートも一部サイトへ展開中。

参考:

- https://developers.google.com/search/docs/monitor-debug/search-console-start
- https://search.google.com/search-console/about
- https://support.google.com/webmasters/answer/7440203
- https://support.google.com/webmasters/answer/7451001
- https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports
- https://developers.google.com/search/docs/appearance/ai-features
- https://developers.google.com/search/docs/fundamentals/ai-optimization-guide

## 現在の初期値

- 初回検索パフォーマンス: クリック322、表示8,663、CTR3.7%、平均順位15.8
- インデックス登録済み: 228件
- 未登録: 985件
- リダイレクト: 424件
- noindex: 203件
- クロール済み - インデックス未登録: 289件
- 検出 - インデックス未登録: 53件
- 404: 5件。主要例は本番301修正済み、GSC検証待ち
- リダイレクトエラー: 1件。`tokutei.html` は本番301修正済み、GSC検証待ち
- sitemap: `digitool-lab.com/sitemap.xml` 176 URL、`showroom.digitool-lab.com/sitemap.xml` 564 URL
- 手動対策: なし
- セキュリティ問題: なし
- HTTPS重大問題: なし
- パンくず: 無効0、有効25
- 外部リンク: 12件
- 内部リンク: 202件。トップページ偏重は一部是正済み

## TODO化サマリー

GSCドメインプロパティで `digitool-lab.com` 全体を見られるようになったことで、次の10系統を継続運用できる。

| 系統 | できること | 優先度 | 主な作業先 |
|---|---|---:|---|
| 検索パフォーマンス | クエリ、ページ、国、デバイスをドメイン全体・ホスト別に確認する | P0 | GSC、`gsc-performance-opportunities-20260623.md` |
| 低CTR改善 | 表示はあるがクリックされないtitle、description、H1、冒頭回答、FAQを直す | P0 | 公式HP、ブログ、LP |
| 8〜20位改善 | もう少しで上位化できるクエリに本文補強と内部リンクを入れる | P0 | 公式HP、ブログ、LP |
| 未登録URL仕分け | indexすべきURLと、noindex/リダイレクト/除外でよいURLを分ける | P0 | GSC、`gsc-index-coverage-triage-20260623.md` |
| sitemap/canonical監視 | Googleがsitemapを読めているか、canonicalやnoindex混入がないかを見る | P1 | GSC、CI監査 |
| URL検査 | 重要LP、費用記事、showroom主要ページの登録状況を個別確認する | P1 | GSC |
| 内部リンク | Googleが重要ページとして認識できるよう、LP・記事・資料DL導線を調整する | P1 | 公式HP、showroom |
| 外部リンク確認 | サイテーションや外部発信後に、リンクとして増えたものを追う | P2 | GSC、外部公開ログ |
| Core Web Vitals | 実ユーザー指標とLighthouseで速度・体験の悪化を検知する | P2 | GSC、PageSpeed/Lighthouse |
| AI検索/AIO | 生成AIレポートが出たらAI露出ページを保存し、導線・本文・FAQへ反映する | P2 | GSC、AIO/LLMO台帳 |

### ポータルTODOへ同期する実行単位

既存TODOと重複しないよう、ポータル側は以下の粒度で管理する。

- GSC検索パフォーマンスをホスト別CSVで保存する
- 表示回数が多くCTRが低いページを改善する
- 8〜20位の惜しいクエリを改善する
- 未登録URLを重要/放置/削除候補へ仕分ける
- sitemap、robots、404、リダイレクト検証結果を確認する
- Core Web Vitals、HTTPS、パンくず、構造化データ、手動対策、セキュリティを月次確認する
- GSC外部リンクとサイテーション/外部発信ログを照合する
- GSC生成AI/AI features系レポートが表示されたか確認する
- GA4のCVページとGSCクエリを突き合わせ、問い合わせに近いページを増強する
- `plat`、`shop`、`showroom`、`www/http` の露出URLを見て、SEO対象/対象外を整理する

## 2026-06-23 実行ログ

- GSCサマリー確認: 検索パフォーマンスはクリック322、表示8,660、CTR3.7%、平均順位15.8。最終更新は3.5時間前。
- 生成AI専用レポート確認: サイドバーに `Generative AI` / `AI features` / `AI Overviews` / `AI Mode` の専用レポートはまだ表示されていない。通常の検索パフォーマンス内には「AI を使用してパフォーマンス レポートをカスタマイズする」が表示されている。
- ページインデックス確認: 最終更新日は2026/06/12のまま。404 5件とリダイレクトエラー1件は検証開始状態で、修正反映はまだGSC側に出ていない。
- sitemap再送信: `https://digitool-lab.com/sitemap.xml` を再送信し、送信日2026/06/23、最終読み込み2026/06/23、成功、検出176件を確認。
- sitemap確認: `https://showroom.digitool-lab.com/sitemap.xml` は送信日2026/06/23、最終読み込み2026/06/23、成功、検出564件を確認。
- URL検査: `https://digitool-lab.com/blog/ai-search-meo-citation-checklist` は `検出 - インデックス未登録`。インデックス登録リクエスト済み表示を確認。
- URL検査: `https://showroom.digitool-lab.com/subsidies/internal-portal` は `クロール済み - インデックス未登録`。インデックス登録リクエスト済み表示を確認。
- URL検査: `https://showroom.digitool-lab.com/subsidies/system-development` は `クロール済み - インデックス未登録`。リクエスト操作は実施したが、最終表示で「リクエスト済み」が安定表示されないため次回再確認対象。
- URL検査: `https://showroom.digitool-lab.com/cases` は `検出 - インデックス未登録`。インデックス登録リクエスト済み表示を確認。
- URL検査: `https://showroom.digitool-lab.com/pricing` は `検出 - インデックス未登録`。インデックス登録リクエスト済み表示を確認。
- 検索パフォーマンス上位クエリ: `デジタルツール研究所` 47クリック/62表示、`株式会社デジタルツール研究所` 27クリック/58表示、`松岡哲平` 10クリック/143表示、`facebook データ削除` 3クリック/54表示、`gemini スクリプト` 1クリック/45表示、`デジタルツール` 0クリック/153表示、`警備業務効率化 ai活用事例` 0クリック/143表示。
- 検索パフォーマンス上位ページ: `/` 102クリック/771表示、`/blog/ai-gemini-gas-file-rename` 32クリック/258表示、`/about` 27クリック/624表示、`/facebook-data-deletion` 10クリック/571表示、`/blog/hr-turnover-prediction-ai` 7クリック/1,114表示、`/service` 7クリック/303表示。

## GSCで新しくできること

### 1. ドメイン全体の検索パフォーマンスを取れる

これまで見落としやすかった `showroom`、`plat`、`shop`、`www`、`http` の検索露出をまとめて見られる。

TODO:

- [ ] 週次で検索パフォーマンスをCSV出力し、クエリ、ページ、国、デバイス別に保存する
- [ ] `digitool-lab.com` / `showroom` / `plat` / `shop` のホスト別にページフィルタを切り、露出があるURLを分ける
- [ ] 表示回数が多くCTRが低いクエリを抽出し、title、description、H1、冒頭回答、FAQを改善する
- [ ] 11位から20位のクエリを抽出し、内部リンクと本文補強で上位10位入りを狙う
- [ ] さいたま市、DX支援、業務システム、社内ポータル、AI研修、MEO、サイテーション、補助金系のクエリを重点クラスタとして追う

### 2. AI検索露出を確認できる可能性がある

2026-06-03にGoogleはSearch Consoleの生成AIパフォーマンスレポートを発表。AI Overviews / AI Mode / Discoverの生成AI機能に表示されたページ、国、デバイス、日付、表示回数を確認できる。ただし一部サイトから段階展開。

TODO:

- [ ] GSCに `Generative AI` / `AI features` 系レポートが表示されているか確認する
- [ ] 表示されている場合、ページ別のAI表示回数を保存する
- [ ] AI表示が出ているページを、問い合わせ導線と内部リンクへ接続する
- [ ] AI表示がない重要LPは、独自事例、判断基準、FAQ、一次情報を増やす
- [ ] AI検索向けの新規特殊マークアップに寄せすぎず、Google公式方針どおり通常SEO、クロール性、内部リンク、本文品質を優先する

### 3. 未登録URLを「直すもの」と「放置でよいもの」に分けられる

未登録985件はすべて悪いわけではない。重要ページだけindex対象にし、低優先補助金、管理画面、旧URL、重複URLは除外でよい。

TODO:

- [ ] `クロール済み - インデックス未登録` 289件から重要URLだけを抜き出す
- [ ] `検出 - インデックス未登録` 53件から問い合わせに近いURLだけを抜き出す
- [ ] `リダイレクト` 424件は、http/www/index.html/.html/旧URLの正規化なら対応不要に分類する
- [ ] `noindex` 203件は、showroom低優先補助金、テスト、完了画面、作業ファイルなら対応不要に分類する
- [ ] `404` 5件と `リダイレクトエラー` 1件のGSC検証結果を確認する
- [ ] 重要URLの未登録が残る場合、本文量、内部リンク、sitemap lastmod、canonical、title、description、URL検査を再確認する

### 4. sitemapとcanonicalの整合性を監視できる

既にCIで `sitemap.xml` のURL存在、canonical一致、noindex混入、title/description/H1、lastmod形式を監査している。GSCではGoogle側で読めているかを確認する。

TODO:

- [ ] `digitool-lab.com/sitemap.xml` の最終読み込み日と検出URL数を週次確認する
- [ ] `showroom.digitool-lab.com/sitemap.xml` の最終読み込み日と検出URL数を週次確認する
- [ ] sitemapエラーが出た場合、robotsブロック、404、手動対策、サーバー不安定、URL誤りを確認する
- [ ] 新規LPや重要記事を追加したら、sitemap lastmod更新、GSCサイトマップ再送信、URL検査をセットで実施する
- [ ] noindex対象URLがsitemapへ混入していないか月次確認する

### 5. URL検査で重要ページの状態を個別確認できる

URL検査では、ページ単位でGoogleのインデックス状況、クロール可否、canonical、クロール日時、ライブテストを確認できる。

TODO:

- [ ] `https://digitool-lab.com/blog/ai-search-meo-citation-checklist` のインデックス登録リクエストを再実行する
- [ ] `https://showroom.digitool-lab.com/subsidies/internal-portal` をURL検査する
- [ ] `https://showroom.digitool-lab.com/subsidies/system-development` をURL検査する
- [ ] `https://showroom.digitool-lab.com/cases` をURL検査する
- [ ] `https://showroom.digitool-lab.com/pricing` をURL検査する
- [ ] 新規作成したLP、費用記事、比較記事、地域ページは公開後にURL検査を行う

### 6. 内部リンクの偏りを改善できる

リンクレポートで、Googleがサイト内のどのページを重要と見ているかを確認できる。

TODO:

- [ ] 月次で内部リンク上位ページと下位ページをCSV出力する
- [ ] トップページ偏重が再発していないか確認する
- [ ] 問い合わせに近いLP、費用記事、比較記事、事例、資料DLへの内部リンクを増やす
- [ ] `ai-search-meo-support`、`business-system-development`、`internal-portal-development`、`dx-support-saitama`、`it-tantou-outsourcing` を内部リンク強化対象として追う
- [ ] showroomの事例・補助金ページから自社HPの関連LPへ戻す導線を増やす

### 7. 外部リンク・サイテーションの効果を確認できる

GSCのリンクレポートで、外部サイトからのリンクが増えたかを確認できる。ただしサイテーションはリンクなし言及もあるため、GSCだけでは全量把握できない。

TODO:

- [ ] 外部リンク元12件を初期値として記録する
- [ ] サイテーション実施後、GSCリンクレポートでリンク増加を月次確認する
- [ ] note、Qiita/Zenn、YouTube、GBP、地域団体、士業、金融機関からの自然導線を記録する
- [ ] 被リンク購入、低品質ディレクトリ、相互リンク集は除外する
- [ ] 外部公開ログ `posts-management/external-publication-log-20260611.csv` とGSCリンク増加を突き合わせる

### 8. Core Web VitalsとPage Experienceを見られる

実ユーザーデータがたまると、URLグループ単位でLCP、INP、CLSの問題が見える。

TODO:

- [ ] GSCのウェブに関する主な指標を月次確認する
- [ ] 問題URLグループが出たら、PageSpeed InsightsまたはLighthouseで対象ページを再測定する
- [ ] LCPが重いページは画像サイズ、WebP、preload、CSS、外部JSを確認する
- [ ] INPが悪い場合はフォーム、CTA、外部スクリプト、イベント処理を確認する
- [ ] 主要LPと資料DLページのモバイル体験を優先して改善する

### 9. 構造化データとリッチリザルトを監視できる

パンくずやFAQなど、検索結果の表示改善に関わる構造化データの問題を確認できる。

TODO:

- [ ] パンくずリストの有効件数とエラー件数を月次確認する
- [ ] FAQPage、LocalBusiness、Organization、Service、Articleの表示本文との整合性を維持する
- [ ] 新規LPや記事公開時に、構造化データが見える本文と矛盾しないか確認する
- [ ] リッチリザルト対象が増えたら、GSCの拡張レポートでエラーを確認する

### 10. 手動対策・セキュリティ問題を早期検知できる

SEO以前の重大リスクをドメイン全体で確認できる。

TODO:

- [ ] 月次で手動対策を確認する
- [ ] 月次でセキュリティ問題を確認する
- [ ] GSCのメール通知が届く状態か確認する
- [ ] 不明な確認済みオーナー5件は、ユーザー確認後に削除する
- [ ] 410化したバックアップ、`.bak`、`.md`、`scripts/`、`posts-management/` がGSCで問題化していないか確認する

## 優先実行順

### P0: 次にGSCを開いたらすぐやる

- [x] 生成AIパフォーマンスレポートが出ているか確認する
- [ ] 検索パフォーマンスをホスト別にCSV出力する
- [x] `ai-search-meo-citation-checklist` とshowroom重要5URLをURL検査する
- [ ] 404 5件とリダイレクトエラー1件の修正検証結果を確認する
- [ ] `plat.digitool-lab.com/robots.txt` のGSC側エラー消失を確認する

### P1: 1週間以内にやる

- [ ] 表示回数が多いがCTRが低いページを5件抽出し、title/descriptionを改善する
- [ ] 11位から20位のクエリを5件抽出し、既存LP・記事の本文と内部リンクを改善する
- [ ] `クロール済み - インデックス未登録` から重要URLを10件だけ選ぶ
- [ ] 内部リンク下位の重要LPを確認し、トップ、関連LP、ブログ、資料DLからリンクを追加する
- [ ] showroomのindex対象補助金ルールをGSC実データで見直す

### P2: 毎週やる

- [ ] 検索パフォーマンスのクリック、表示、CTR、平均順位を記録する
- [ ] ホスト別に増減を確認する
- [ ] サイトマップ最終読み込み日を確認する
- [ ] URL検査待ち・上限到達で残ったURLを再実行する
- [ ] 新規公開ページがGSCに認識されているか確認する

### P3: 毎月やる

- [ ] 手動対策、セキュリティ、HTTPS、パンくず、Core Web Vitalsを確認する
- [ ] 外部リンクとサイテーション実施ログを照合する
- [ ] noindex、リダイレクト、404、robotsブロックの件数推移を確認する
- [ ] GA4のCVとGSCクエリを突き合わせ、問い合わせにつながるページを増強する
- [ ] AI検索露出が取れている場合、表示ページをAIO/LLMO改善キューに回す

## 人間確認が必要なTODO

- [ ] GSCの不明な確認済みオーナー5件の削除可否
- [ ] note、Qiita/Zenn、YouTube、GBP投稿の実公開
- [ ] 顧客名、実名、実績金額を含む事例公開
- [ ] 口コミ依頼文の送付
- [ ] 有料掲載、団体登録、共催依頼
- [ ] Search Console内でしか押せないURL検査、検証開始、所有者削除などの操作

## 管理先

- 全体台帳: `seo-audit-todo.md`
- GSCドメイン運用: `gsc-domain-property-action-plan-20260623.md`
- 未登録仕分け: `gsc-index-coverage-triage-20260623.md`
- 技術ヘルス: `gsc-technical-health-20260623.md`
- パフォーマンス改善: `gsc-performance-opportunities-20260623.md`
- 外部発信管理: `https://plat.digitool-lab.com/portal/external-publications`
