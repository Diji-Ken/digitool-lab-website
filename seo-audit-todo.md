# SEO/AIO/LLMO/MEO 実行TODO - 株式会社デジタルツール研究所

更新日: 2026-06-23
元資料: `/Users/m/Downloads/digitool-lab-seo-aio-llmo-meo-strategy-20260601.docx`
追加資料: `/Users/m/Workspace/mirai/00_knowledge/clients/OToMo/projects/ai-showcase/research/leadgen-materials-20260609/`
実行台帳: `seo-aio-llmo-strategy-ledger.md`
全体ロードマップ: `seo-aio-llmo-execution-roadmap.md`
技術SEOチェック: `seo-technical-checklist-20260610.md`
GSC未登録仕分け: `gsc-index-coverage-triage-20260623.md`
GSCドメインプロパティ運用TODO: `gsc-domain-property-action-plan-20260623.md`
GSCドメイン全体活用TODO: `gsc-domain-full-todo-20260623.md`
GSC公開後チェックリスト: `gsc-post-release-checklist-20260623.md`
GSC技術ヘルス/リンク確認: `gsc-technical-health-20260623.md`
出典別トレース: `seo-source-traceability-20260610.md`
コンテンツ/外部導線キュー: `seo-content-and-external-action-queue-20260610.md`
サイテーション表記統一: `meo-citation-handoff-20260610.md`
GBPドラフト: `gbp-operation-drafts-20260610.md`
外部発信管理: `https://plat.digitool-lab.com/portal/external-publications`
外部プロフィール文: `posts-management/external-media-profile-drafts-20260611.md`
掲載相談テンプレート: `posts-management/outreach-message-templates-20260611.md`
GBP週次投稿カレンダー: `posts-management/gbp-weekly-calendar-20260611.md`
外部発信実行順: `posts-management/external-publication-execution-plan-20260611.md`
UTM付きURL一覧: `posts-management/external-publication-utm-links-20260611.md`
外部公開記録CSV: `posts-management/external-publication-log-20260611.csv`
GBP短縮投稿文: `posts-management/gbp-short-copy-bank-20260611.md`

## 現在の実行方針

- 自社HPをSEO/AIO/LLMOの主戦場にする。
- note、SNS、Qiita/Zenn、YouTube、地域媒体は、自社HPへ戻すための外部導線・言及・被リンク補助にする。
- noteでもSEO/MEO/AIO記事は作るが、自社HPと同じ内容を転載せず、読み物・実務メモ・考え方として公開する。
- 以後の全体像は `seo-aio-llmo-execution-roadmap.md` を優先して見る。

## 2026-06-13 フォローアップ

- 公開URLでトップ、主要LP、ブログ、資料DL、showroom補助金ページの200応答を再確認した。
- `sitemap.xml` は176 URLを確認し、HTTP 4xx/5xxの登録URLは0件だった。
- 主要ページのtitle、description、canonical、H1、JSON-LD、現住所、現電話番号の表示を再確認した。
- 公開検索で `/business-system-development/`、`/ai-training-saitama/`、`/internal-portal-development/`、費用記事、資料DLページの検索結果表示を確認した。
- 公開検索では `/ai-search-meo-support/`、`/blog/ai-search-company-information-checklist`、`/blog/meo-citation-nap-checklist` はまだ確認しきれないため、Search ConsoleのURL検査で再確認する。
- PageSpeed Insights APIは2026-06-13時点でも429で実行不可。ローカル資産確認では主要LPに大容量画像は見当たらず、実測はAPI回復後またはブラウザ画面で再実施する。
- Chrome DevTools接続のSearch Consoleは未ログイン画面に戻るため、GSC/GA4/GBPの数値確認、URL検査、サイトマップ再送信は人間ログインが必要。
- 旧電話番号を含む `backup_20250703_112022/`、`.bak`、内部Markdownが公開URLとして到達可能な可能性があったため、バックアップ系、`.bak`、`.md`、`posts-management/`、`scripts/` を410化し、`/privacy.html` と `/terms.html` を正規法務URLへ301化する。

## 方針

- MEOは電話番号変更後にまとめて実施する。
- SEO/AIO/LLMOはすぐ進める。
- 記事量産より、問い合わせに近い固定LPを優先する。
- 外部媒体は自社サイトへの導線と自然被リンク獲得に使う。
- 市町村ページは大量生成せず、さいたま市・行田市など実体のある地域から始める。

## 30日以内

- [x] NAP棚卸し、旧住所/旧電話の残存確認、JSON-LD、canonical、主要テンプレートを再確認する
- [x] トップページ本文・meta・OGP・Twitter descriptionを現在の本社所在地「埼玉県さいたま市北区」に寄せる
- [x] Organization / LocalBusiness / WebSite / WebPage / Service のJSON-LDを統合し、本社所在地と主要サービスを明確化する
- [x] robots.txtで公開ルートのMarkdown監査メモと `/scripts/` をクロール除外する
- [x] Google Search Consoleで現状クエリ、表示回数、CTR、CVページを確認し、初期SEOダッシュボードを作る
- [x] Googleビジネスプロフィールの現状確認と、電話番号変更後に更新する項目を事前整理する
- [x] 共有資料、GPT Pro用資料、法人集客資料、Clippings、SEOチェック画像、キーワード調査、既存台帳を出典別に棚卸しする
- [x] 次に作るページ、既存ページ改善、外部媒体、被リンク、計測改善を1つのキューに整理する
- [x] サイテーション作業用のNAP統一ハンドオフを作る
- [x] GBP投稿、Q&A、写真追加候補の公開前ドラフトを作る
- [x] GBP週次投稿カレンダー、外部媒体プロフィール文、被リンク/共催相談メッセージを作成する
- [x] 外部発信の実行順、UTM付きURL、公開URL記録表、GBP短縮投稿文を作成する
- [x] 共有SEOチェックリストを技術SEO監査へ反映し、index対象ページのtitle、description、canonical、H1、JSON-LD、画像alt不足を0件にする
- [x] テスト、テンプレート、完了画面、旧統合ページ、データ削除補助ページをnoindex整理し、noindex対象をサイトマップから外す
- [x] 事例一覧ページを静的HTML化し、業種・課題・成果で探せる状態にする
- [x] `/dx-support-saitama/` を制作する
- [x] `/it-tantou-outsourcing/` を制作する
- [x] `/internal-portal-development/` を制作する
- [x] 既存事例20〜30本から新LPへ内部リンクを張る
- [x] 資料DL、無料相談、LINE、TimerexクリックをCV計測できるようにする
- [x] `digitool-lab.com` と `showroom.digitool-lab.com` のサイトマップをSearch Consoleで再送信する
- [x] 新規LPと事例一覧のURL検査を実施し、未登録URLのインデックス登録をリクエストする
- [x] トップページ更新後、Search Consoleで `https://digitool-lab.com/` のインデックス登録をリクエストする
- [x] GA4で `form_submit` をキーイベント化し、GA4とSearch Consoleを連携する

## 60日以内

- [ ] GA4で `generate_lead`、`file_download`、`timerex_click`、`line_click` が実データとして出たらキーイベント/探索レポートに追加する
- [ ] GSCの新規LPインデックス状況を3〜7日後に再確認する
- [ ] GSCドメインプロパティ `sc-domain:digitool-lab.com` で、`digitool-lab.com` / `showroom.digitool-lab.com` / `plat.digitool-lab.com` / `shop.digitool-lab.com` を横断して監視する
  - 2026-06-23: DNS TXT認証済み。Search Consoleのドメインプロパティサマリー表示を確認し、検索パフォーマンスCSVを取得。クリック322、表示8,663、CTR3.7%、平均順位15.8を初期値として記録。
  - 2026-06-23: 手動対策、セキュリティ、HTTPS、パンくず、サイトマップ、リンクレポートを確認。詳細は `gsc-technical-health-20260623.md`。
- [ ] GSCの未登録985件を、改善対象、noindexで正しいもの、リダイレクトで正しいもの、削除/410対象に仕分ける
  - 2026-06-23: `gsc-index-coverage-triage-20260623.md` にカテゴリ単位の初回仕分けを作成。次はGSCのURL例を抽出し、URL単位の重要/放置/削除候補へ細分化する。
  - 2026-06-23: GSCの各未登録理由から代表URL例を抽出。`case-studies`、MEO/AIO記事、showroom主要カテゴリを優先改善、http/www/index.html/旧URL301、shop robots、低優先補助金noindexは対応不要に分類した。
  - 2026-06-23: 公開HTML全体の内部リンク正規化を実施。内部 `href` に残る `.html` を0件化し、一部ブログ/補助金記事の相対リンク、CSS、画像参照切れも修正。内部参照チェック0件を確認。
  - 2026-06-23: `scripts/audit-seo-links.mjs` を追加し、GitHub ActionsのXserverデプロイ前に内部 `.html` href と内部 `href/src` 参照切れを自動検査するようにした。
  - 2026-06-23: `scripts/audit-seo-indexability.mjs` を追加し、sitemap掲載URLの存在、canonical一致、noindex混入、title/description/H1、lastmod形式をデプロイ前に自動検査するようにした。
  - 2026-06-23: 未登録代表URLだった `/blog/ai-search-meo-citation-checklist` と `/blog/meo-citation-nap-checklist` を追加改善。AI検索対策・MEO・サイテーションの違い、進める順番、住所/電話変更後のNAP確認、FAQ/JSON-LDを増強した。
- [ ] GSCの低CTR・表示回数多めクエリを月次抽出し、title、description、H1、冒頭回答、FAQ、内部リンクを改善する
  - 2026-06-23: `gsc-performance-opportunities-20260623.md` に初回抽出結果を保存。`case-studies` と `blog/hr-turnover-prediction-ai` のtitle、description、H1、構造化データ、冒頭回答を改善し本番反映。
  - 2026-06-23: 追加で `management-data-aggregation-ai`、`ai-chatgpt-faq-creation`、`security-property-management-dx` をGSC表示クエリに合わせて改善。経営分析レポート自動作成、FAQシステム/ChatGPT、警備DX導入事例の検索意図へ寄せた。
  - 2026-06-23: GSCドメインプロパティで `警備業務効率化 ai活用事例` が143表示/0クリックだったため、`security-property-management-dx` のtitle、description、H1、FAQ、JSON-LDを `警備業務効率化のAI活用事例` へ再調整。
  - 2026-06-23: `/ai-training-saitama/` をAI研修系クエリと地域検索向けに改善。title、description、OGP、Twitter、JSON-LD、H1、冒頭回答で `埼玉・さいたま市` を明示した。
  - 2026-06-23: `/blog/ai-training-cost` を `AI研修の費用相場` に寄せ、費用の分け方、FAQ、FAQPage JSON-LDを追加。`dx-support-cost`、`internal-portal-development-cost`、`business-system-development-cost`、`ai-training-cost` の相互リンクも強化した。
  - 2026-06-23: `/blog/management-data-aggregation-ai` を追加改善。`経営分析レポートの自動作成`、`AI・Power BI`、`月次レポート自動化` にtitle、description、H1、FAQ、JSON-LD、内部リンクを寄せた。
  - 2026-06-23: `/blog/hr-turnover-prediction-ai` を追加改善。`AIで離職率改善`、`離職予測システム` にtitle、description、H1、FAQ、JSON-LD、内部リンクを寄せ、個人情報の扱いと始め方の即答を追加した。
  - 2026-06-23: `/blog/internal-portal-development-cost` と `/blog/business-system-development-cost` を追加改善。`中小企業向け料金目安`、`見積前チェック`、`いくらから検討できるか` のFAQと費用レンジを追加し、費用検索のクリック前不安に回答した。
  - 2026-06-23: `/blog/it-person-outsourcing-vs-hiring` を追加改善。`IT担当 外注`、`情シス代行 中小企業`、`社外IT担当`、`IT担当 外注 費用` に合わせてtitle、description、比較表、採用前チェック、FAQ、BreadcrumbList JSON-LD、月額DX伴走/無料チェックリスト導線を強化した。
  - 2026-06-23: `/ai-training-saitama/` に `AI研修の費用を考える前に決めること` セクションとFAQ/FAQPage JSON-LDを追加し、`ai 研修 費用`、`AI研修 埼玉`、`生成AI研修 企業` の検索意図から費用記事・定着記事・無料チェックリストへ接続した。
  - 2026-06-23: `/about` を会社概要・代表者情報ページとして追加改善。title、description、H1、AboutPage/Organization/LocalBusiness/FAQPage JSON-LD、支援領域カード、FAQを追加し、旧住所系Googleマップ埋め込みURLを現住所検索埋め込みへ差し替えた。
  - 2026-06-23: `/about` はGSC URL検査でGoogle登録済み、HTTPS/パンくず有効を確認し、インデックス登録リクエストを実施した。
  - 2026-06-23: `/service` を事業内容・サービス一覧ページとして追加改善。title、description、H1、WebPage/Organization/Service/ItemList JSON-LD、主要サービス要約、FAQを追加し、DX伴走支援、社内ポータル開発、業務システム開発、AI研修の検索・AI回答入口として補強した。
- [x] GSCリンクレポートで、主要LPと問い合わせに近い記事への内部リンク不足を確認し、トップ偏重を減らす
  - 2026-06-23: 外部リンク12件、内部リンク202件を確認。内部リンクはトップページ152件に偏り、AIO/MEO系記事の露出が弱かったため、トップ、事業内容、DX伴走、さいたま市、社内ポータル、業務システム、関連ブログから `ai-search-meo-support` とAIO/MEO関連記事への導線を追加。
  - 2026-06-23: `scripts/audit-priority-internal-links.mjs` を追加し、問い合わせに近いLP、費用記事、AIO/MEO記事、資料DL、事例ハブの内部リンク元数をCIで監査するようにした。月額DX伴走記事は費用記事クラスタからの関連リンクを追加。
- [ ] GSCの手動対策、セキュリティ問題、robots.txt、サイトマップ最終読み込み日、HTTPS、パンくずリストを月次チェックする
  - 2026-06-23: 手動対策なし、セキュリティ問題なし、HTTPS重大問題なし、パンくず無効0/有効25、`showroom` sitemap成功564、`digitool-lab.com` sitemap成功176を確認。
  - 2026-06-23: 内部リンク正規化に伴い、変更された公開HTMLのうちsitemap掲載155 URLの `lastmod` を更新。
  - 2026-06-23: sitemap掲載176 URLについて、ローカルHTML存在、canonical一致、noindex混入なし、title/description/H1、lastmod形式を監査し、CIへ組み込んだ。
  - 2026-06-23: `scripts/audit-structured-data.mjs` を追加し、sitemap掲載176 URLのJSON-LD存在、構文、`@graph`、BreadcrumbList、FAQPage、Article/BlogPosting、Service、Organizationの基本項目をCIで監査するようにした。初回監査は503ブロック確認でエラー0件。
  - 2026-06-23: `gsc-post-release-checklist-20260623.md` を追加し、新規LP・記事公開後のsitemap再送信、URL検査、3〜7日後確認、週次/月次確認を固定化した。
- [ ] GSCドメインプロパティの不明な確認済みオーナー5件は、ユーザー確認後に削除する
- [x] `plat.digitool-lab.com/robots.txt` の本番404を解消する
  - 2026-06-23: `digiken-platform` に `/robots.txt` ルートを追加し、VPS本番を `914c2b4` へ更新。`https://plat.digitool-lab.com/robots.txt` は200応答。GSCのrobots重大エラー消失は後日確認する。
- [x] `showroom.digitool-lab.com` の補助金詳細は、社内ポータル、業務システム、AI/DX、省力化に近いURLだけindex強化し、それ以外はnoindex方針を維持する
  - 2026-06-23: `dtl-system-showroom` 側で `getSubsidySeoIndexDecision` を追加し、closed/低関連制度は `noindex,follow`、関連度40点以上の制度のみ `index,follow` に統一。`docs/subsidy-seo-index-policy.md` を追加し、sitemapは564URLで本番反映済み。
  - 2026-06-23: GSCドメインプロパティで `https://showroom.digitool-lab.com/sitemap.xml` を再送信。送信日は2026/06/23に更新、最終読み込みと検出ページ数は次回処理待ち。
- [x] 費用・相場系クエリ（DX支援費用、社内ポータル費用、業務システム費用、DXコンサル費用、伴走型コンサルティング）をGSC優先クラスタとして既存記事を追加改善する
  - 2026-06-23: `dx-support-cost`、`internal-portal-development-cost`、`business-system-development-cost`、`dx-consulting-monthly-support` のtitle、description、H1、FAQ、JSON-LD、内部リンク、sitemap/llms表記を更新。本番反映後、4URLともGSCでインデックス登録リクエスト済み。`dx-consulting-monthly-support` は検査時点で未登録のため後日再確認する。
- [x] 2026-06-10の技術SEO整理後、Search Consoleでサイトマップを再送信し、ページインデックス、手動対策、セキュリティ問題を確認する
- [ ] PageSpeed Insightsでトップ、主要LP、記事、資料DLページを確認し、画像・CSS・外部JSの改善点を洗い出す
  - 2026-06-10: PageSpeed Insights APIは429で実行不可。ローカル監査では主要5ページのcanonical/meta description/h1/JSON-LD/画像altは問題なし。大容量画像は事例画像に集中しているため、次回PageSpeedまたはLighthouseで実測してから圧縮対象を決める
  - 2026-06-13: PageSpeed Insights APIは429で継続不可。トップ、主要LP、資料DLのHTML資産確認では追加の大容量画像問題なし
  - 2026-06-23: PageSpeed Insights APIは429で継続不可。ローカルLighthouseでトップ、業務システムLP、社内ポータルLPをモバイル実測。SEO/アクセシビリティ/ベストプラクティスは全て100、Performanceは83〜85、LCPは4.0〜4.1秒。詳細は `lighthouse-summary-20260623.md`。
  - 2026-06-24: PageSpeed Insights APIは引き続き429。トップと `seo-hero` を使う主要LP/記事29ページへ `hero-dx-support.webp` のpreload + `fetchpriority="high"` を追加し、`scripts/audit-hero-preload.mjs` をCIに組み込んだ。
- [x] トップページの重い下部画像をWebP化し、画像サイズ指定・遅延読み込み・静的資産キャッシュ設定を追加する
- [x] トップページをLighthouseで確認し、表示ロゴWebP化、Google Fonts外し、不要外部CSS/JS削除、コントラスト/見出し/画像比率を改善する
- [x] 主要SEO受け皿ページ、費用記事、資料DLページをローカルLighthouseで確認し、LP共通CSSのコントラスト、CTA背景、スマホ時LCP、H1改行を改善する
- [x] GSCの404例5件に対して、旧ルート記事URLと拡張子なしcase URLから正規URLへの301リダイレクトを追加する
- [x] 404対応の本番反映後、Search Consoleで「見つかりませんでした（404）」の修正検証を開始する
- [x] 新規SEO記事3本と `/area/saitama-city-dx/` のURL検査・インデックス登録リクエスト・sitemap再送信を実施する
- [x] `/excel-paper-dx/` は2026-06-09にGSCで登録済みを確認する（HTTPS・パンくずリスト・FAQも有効検出）
- [x] `/business-system-development/` を制作する
- [x] `/ai-training-saitama/` を制作する
- [x] `/excel-paper-dx/` を制作する
- [x] `/subsidy-dx-ai-system/` を制作し、showroom補助金ページと接続する
- [x] `/downloads/` を制作し、DX診断・社内ポータル要件・補助金確認・AI活用・業務棚卸しの無料チェックリスト導線を作る
- [x] showroom遷移と外部リンククリックをGA4イベント化する
- [x] FAQ記事、費用記事、比較記事を6〜10本作る（初期17本: DX支援費用、DX支援会社の選び方、補助金を使う前のDX要件整理、さいたま市の中小企業がDXで最初に見直す業務、IT担当採用/外注比較、業務システム開発費用、AI研修費用、社内ポータル開発費用、社内ポータル導入の失敗パターン、AI検索・MEO・サイテーション対策、AI研修後に社内定着しない理由、IT担当者がいない会社のシステム導入チェックリスト、業務システム開発を外注する前に決めること、Excel業務をシステム化するか残すかの判断基準、AI検索に引用されやすい会社情報の整え方、MEOとサイテーションで最初に揃えるNAPチェックリスト、月額DX伴走支援で依頼できること）
- [x] 主力LP4本（社内ポータル、社外IT担当、AI研修、業務システム）のFAQとFAQPage構造化データを増強する
- [ ] note 4本、Qiita/Zenn 2本、YouTube 2本を初期公開する
- [x] note 4本、Qiita/Zenn 2本の初期下書きを作成する
- [x] 法人集客資料を保存し、MEO・サイテーション、AIO・LLMO、広告入稿前チェックリストの導線を `/downloads/` と `llms.txt` 系へ反映する
- [x] 資料DLフォームを `send_lead.php` に送信する流れへ修正し、サービス詳細資料・相談前チェックリストPDFを作成する
- [x] AI検索・MEO・サイテーション対策記事を追加し、sitemap、llms、無料資料ページから内部リンクする
- [x] note下書き `N005` を追加する
- [x] 地域団体、士業、金融機関、パートナー候補への掲載・共催相談リストを作る（サイテーション登録とは別に、被リンク/共催候補として扱う）
- [x] note、Qiita/Zenn、LinkedIn、GBP投稿、被リンク候補を `plat.digitool-lab.com` の外部発信管理ページに集約する
- [x] `llms.txt` / `llms_full.txt` に主要LP、showroom、代表/著者情報、現在の本社所在地、事例要約を反映する
  - 2026-06-23: `scripts/audit-llms.mjs` を追加し、`llms.txt` / `llms_full.txt` の現住所・電話・主要URL・主要サービス・旧住所/旧電話混入・`.html` 旧URL混入をCIで監査するようにした。`llms_full.txt` に残っていた `contact.html` を正規URLへ修正。
- [x] `ai-training-cost` と `internal-portal-development-cost` のGSC URL検査・インデックス登録リクエスト完了を確認する
- [x] 2026-06-10にFAQ増強した `/it-tantou-outsourcing/`、`/ai-training-saitama/`、`/business-system-development/` のGSC URL検査とインデックス登録リクエストを再実施する

## 90日以内

- [x] `/area/saitama-city-dx/` を制作する
- [ ] 行田市、上尾市、伊奈町、桶川市は実績・相談・地域情報が揃ったものから独立ページ化を判断する
- [x] 事例を課題別に再編集し、課題別事例ハブを作る（初版 `/case-themes/` を作成。今後、実績追加に合わせて個別事例リンクを増やす）
- [x] DX診断シート、社内ポータル要件定義シート、補助金チェックリスト等の無料DL資産を公開する
  - 2026-06-23: `/downloads/` に資料ごとの具体項目、用途別の見る順番、FAQ/FAQPage JSON-LDを追加。`download_thanks.html` に統合PDFで確認できる内容と関連ページ導線を追加し、llms系にも資料内容を明記した。
- [x] 保存資料をもとに、MEO・サイテーション、AIO・LLMO、広告入稿前確認の実チェックリスト初版を自社用PDFに統合する
- [x] 必要に応じて、MEO・AIO/LLMO・広告入稿前確認を個別PDF/個別LPとして分ける（AI検索・MEO情報整備LP `/ai-search-meo-support/` を初版公開対象に追加）
- [ ] セミナー/ウェビナーを1回企画し、動画・スライド・記事に二次利用する
- [ ] GSC/GBPデータを見てタイトル、FAQ、内部リンク、投稿内容を調整する

## MEO/電話番号変更後

- [x] Googleビジネスプロフィールの住所、電話、カテゴリ、サービス、説明文、写真、Q&Aを更新する
- [x] 公式HP、構造化データ、特商法、プライバシーポリシー、メール署名、SNS、外部媒体の電話番号を同時に更新する
- [ ] 口コミ依頼フローを整備する。ただし謝礼、評価指定、選別依頼はしない
- [ ] GBP投稿を週1回運用する

## やらないこと

- [ ] 市町村名だけ差し替えたページを大量生成しない
- [ ] AI生成記事を低品質なまま大量公開しない
- [ ] 被リンク購入、相互リンク集、低品質ディレクトリ登録をしない
- [ ] Googleビジネスプロフィールのビジネス名にキーワードを足さない
- [ ] 口コミ操作をしない

## KPI

- 30日: 新規固定LP3本、事例一覧改善、CVイベント計測開始
- 60日: 新規固定LP累計7本、FAQ/比較/費用記事6〜10本、外部媒体投稿8本前後、自然な掲載/被リンク候補5〜10件
- 90日: 主要LPインデックス90%以上、GSC表示回数前月比増加、問い合わせ/CV増加傾向、外部掲載/自然リンク3〜10件
