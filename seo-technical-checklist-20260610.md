# 技術SEOチェックリスト反映メモ

更新日: 2026-06-10

参照資料:

- `/Users/m/Downloads/IMG_0460.JPG`
- `/Users/m/Downloads/IMG_0461.JPG`
- `/Users/m/Downloads/IMG_0462.JPG`
- `/Users/m/Downloads/IMG_0463.JPG`

## 目的

共有されたSEOチェックリストを、自社HP `https://digitool-lab.com/` の技術SEO、AIO、LLMOの実行項目へ落とし込む。

今回の方針は、検索に出すべきページを強くし、検索に出すべきではない薄い補助ページは明確にnoindexにすること。市町村名やキーワードを増やす前に、クロール、正規URL、構造化データ、メタ情報の土台を整える。

## チェックリスト要点

### URL・ドメイン

- 独自ドメインを使う
- URLは簡潔で、意味が分かる英数字にする
- URLは不要に変えない
- PC/スマホで同一URLにする
- HTTPSに統一する
- `www` ありなし、`index.html`、`.html` の揺れを統一する
- リニューアル時は過去URLから適切に301リダイレクトする

### キーワード・サイト構造

- 主要ページごとに狙う検索意図とキーワードを割り当てる
- 同じ検索意図のキーワードは1つのページ群にまとめる
- 地域名は実体・事例・対応可能性があるものだけ使う
- サイト全体を親子階層で設計する
- グローバルナビとフッターから重要ページへの導線を確保する
- 関連ページへの内部リンクを本文中にも配置する

### コンテンツ・見出し

- 1ページ1テーマにする
- 200字程度の薄いページを大量に作らない
- タイトルだけ、リンクだけのページを作らない
- H1は原則1つにする
- H1とtitleは近い内容にする
- H2〜H4で構造化する
- 狙うキーワードは自然に入れる
- キーワード出現率だけを目的にしない
- 長いページは目次や内部リンクを置く

### 画像・リンク・モバイル

- メインの重要テキストを画像だけにしない
- 画像altは内容を表すものにする
- 説明画像はcaptionやfigure構成を検討する
- ブログ等では遅延読み込みを使う
- アンカーテキストはリンク先の内容が分かる表現にする
- リンクは静的な `a href` を基本にする
- ボタン・リンクはクリックできると分かるデザインにする
- PC/スマホで表示内容を原則同じにする
- 画面範囲外に要素を飛ばさない
- 隠しテキスト、過度なインタースティシャルは使わない

### クロール・インデックス・構造化

- `sitemap.xml` を生成する
- パンくずリストを設置する
- 構造化データを設置する
- 検索結果ページ、テストページ、完了画面はnoindexにする
- `robots.txt` は必要な場合だけ使い、noindexと矛盾させない
- canonicalは基本的に自分自身の正規URLへ向ける
- 重複や旧ページはcanonical、noindex、301を使い分ける
- HTTPステータスを適切に返す
- ユーザー向けとGooglebot向けで違う内容を返さない
- JavaScriptだけに依存する重要コンテンツを避ける
- リンク切れを定期的に確認する
- 古いコンテンツは更新日と内容を見直す
- Search Consoleでエラー、手動対策、セキュリティ問題を見る
- 被リンク購入や低品質リンク施策はしない
- 外部掲載と同一内容を自社サイトに載せる場合は重複扱いを避ける
- ウイルス感染、スパム汚染を定期的に確認する

## 2026-06-10監査結果

対象:

- 公開HTML 175件
- 除外: `backup_20250703_112022/`, `article-workspace/`, `posts-management/`, `apps/`

対応後の結果:

- title未設定: 0件
- index対象ページのmeta description不足: 0件
- index対象ページのcanonical不足: 0件
- index対象ページのH1異常: 0件
- index対象ページのJSON-LD不足: 0件
- 画像alt不足ページ: 0件
- noindex明示: 12件

noindexにした、または既存noindexを維持したページ:

- `case.html`
- `contact_secure.html`
- `download_thanks.html`
- `case-template.html`
- `debug-mobile.html`
- `data-deletion.html`
- `service-otomo.html`
- `facebook-data-deletion.html`
- `contact_success.html`
- `test-cards.html`
- `analytics-template.html`
- `google-analytics-setup.html`

## 今回実施したこと

- 主要な公開ページにcanonicalを追加
- 主要な公開ページにmeta descriptionを追加
- 旧事例ページ `case.html` は `/case-studies` に正規化しつつnoindex化
- 統合済み旧サービス `service-otomo.html` は `/services/consulting` に正規化しつつnoindex化
- テスト、テンプレート、送信完了、計測設定系ページをnoindex化
- データ削除系の補助ページをnoindex化し、サイトマップから除外
- `privacy-policy`, `terms-of-service`, `tokutei`, `presentation` にWebPage構造化データを追加
- `sitemap.xml` の法律系ページ更新日を2026-06-10に更新

## 2026-06-10 速度・画像まわりの追加対応

- PageSpeed Insights APIは429で取得できなかったため、資産サイズとローカルブラウザ確認を優先
- トップページ下部で読み込んでいた `images/top1.jpg` 1.4MBを `images/top1.webp` 72KBへ変換
- トップページの該当画像をWebPへ差し替え、`width`、`height`、`loading="lazy"`、`decoding="async"` を追加
- サイト全体で使用しているロゴ画像に `width`、`height`、`decoding="async"` を追加
- フッターのロゴ画像に `loading="lazy"` を追加
- `.htaccess` に画像、CSS、JS、フォントのブラウザキャッシュ設定を追加
- ローカルブラウザでトップページを確認し、`hero-dx-support.webp`、ロゴ、`top1.webp` が200で読み込まれることを確認
- 表示用ロゴを `images/logo-160.webp` に差し替え、元の大きいロゴは構造化データ等の会社ロゴ参照として維持
- トップページからGoogle Fonts、未使用のFont Awesome/AOS外部読み込み、`style.css` の外部CSS `@import` を削除
- トップページの画像比率、色コントラスト、見出し順を修正
- ローカルLighthouseでトップページを再確認
  - Performance: 56 -> 98
  - Accessibility: 93 -> 100
  - Best Practices: 92 -> 100
  - SEO: 100 -> 100

## 2026-06-10 主要SEOページのLighthouse追加確認

- 主要LP、費用記事、資料DLページでローカルLighthouseを確認
- `seo-lp.css` が参照していた `--navy-900` を共通CSS変数に追加し、LP下部CTAの背景が確実に効くよう修正
- SEOページの小見出しアクセントを `--orange-700` に変更し、コントラスト指摘を解消
- スマホ幅のヒーロー余白、本文行間、パネル密度を調整し、資料DLページのLCPを改善
- 長い日本語H1がデスクトップ幅で細かく折れないよう、SEOページ共通のヒーロー見出し上限を調整
- ローカルブラウザで `/downloads/` を確認し、横スクロールなし、ロゴWebP読み込み、ヒーロー改行を確認
- ローカルLighthouse結果
  - `/dx-support-saitama/`: Performance 98、Accessibility 100、Best Practices 100、SEO 100
  - `/blog/dx-support-cost.html`: Performance 99、Accessibility 100、Best Practices 100、SEO 100
  - `/downloads/`: Performance 86 -> 99、Accessibility 100、Best Practices 100、SEO 100

## 2026-06-10 Search Console確認

- URLプレフィックスプロパティ `https://digitool-lab.com/` を確認
- サイトマップ `/sitemap.xml` を再送信
  - 送信日: 2026/06/10
  - 最終読み込み日時: 2026/06/10
  - ステータス: 成功
  - 検出ページ: 162
- 手動による対策: 問題は検出されませんでした
- セキュリティの問題: 問題は検出されませんでした
- ページインデックス
  - 登録済み: 142
  - 未登録: 53
  - 未登録理由: リダイレクト17、404が5、重複1、クロール済み未登録26、検出未登録4
- 404例5件は正規URLへ301リダイレクトを追加
- 404例5件は本番で1回の301リダイレクト後に最終200へ到達することを確認
- Search Consoleで「見つかりませんでした（404）」の修正検証を開始
  - 開始日: 2026/06/10

## 2026-06-13 公開再確認

- `https://digitool-lab.com/`、主要LP、ブログ記事、資料DLページ、`https://showroom.digitool-lab.com/subsidies` の200応答を確認
- `sitemap.xml` の176 URLを確認し、HTTP 4xx/5xxは0件
- 主要ページのtitle、description、canonical、H1、JSON-LD、現住所、現電話番号の表示を確認
- Search Consoleは接続Chromeが未ログイン状態のため、GSC画面上でのURL検査、サイトマップ再送信、手動対策、セキュリティ問題の再確認は人間ログイン後に実施
- PageSpeed Insights APIは429で実測不可。主要ページの資産確認では、追加で圧縮すべき大容量画像は確認されなかった
- 旧電話番号を含むバックアップディレクトリが公開URLとして到達可能だったため、`backup_20250703_112022/`、`backup_images_20250727_213226/`、`backup_images_20250727_213230/`、`article-workspace/`、`posts-management/`、`scripts/`、`.bak`、`.md` を410化
- `privacy.html` と `terms.html` は自然流入・外部掲載で使われやすいため、正規URL `privacy-policy`、`terms-of-service` へ301リダイレクト
- 本番反映後、バックアップURL、`.bak`、`.md` が410、`privacy.html` と `terms.html` が正規URLへ301、トップ・法務ページ・サイトマップ・AI検索/MEO LP・資料DLページが200で返ることを確認

## 2026-06-14 Chromeログイン確認

- Chrome拡張経由で `info@digitool-lab.com` のログイン状態を確認
- Search Consoleのドメインプロパティ `sc-domain:digitool-lab.com` は権限なし。URLプレフィックス `https://digitool-lab.com/` は閲覧・操作可能
- Search Consoleサマリー: 直近表示でクリック260、未登録55、登録済み140、HTTPS 23、パンくず19、FAQ18
- `/sitemap.xml` を再送信。送信日は2026/06/14に更新。最終読み込みはGoogle側処理待ちで2026/06/10のまま
- `/ai-search-meo-support/`、`/blog/ai-search-company-information-checklist`、`/blog/meo-citation-nap-checklist` はいずれも「検出 - インデックス未登録」だったため、3URLすべてインデックス登録をリクエスト済み
- ページインデックス: 未登録55、登録済み140、404は5件で検証開始状態
- 手動による対策、セキュリティの問題はいずれも問題なし
- GA4 `intrepid-stock-458907-v1` を確認。過去7日でアクティブユーザー99、イベント848、キーイベント9、Organic Search 49セッション、AI Assistant 1セッション
- GA4イベント詳細の過去28日: `form_submit` 16、`generate_lead` 10、`contact_click` 11を確認
- Google検索のGBP表示で、住所 `〒331-0821 埼玉県さいたま市北区別所町738-3`、電話 `048-700-7030` を確認
- 検索結果にYahoo!マップの旧台東区住所が残っていたため、サイテーション修正の優先候補にする
- PageSpeed Insightsをブラウザ経由で確認。トップページはモバイル Performance 89、desktop Performance 99、Accessibility/Best Practices/SEOはいずれも100
- `/business-system-development/` のdesktopは Performance 99、SEO 100、Accessibility 92。原因候補は白背景上の明るいオレンジ文字だったため、ナビ active/hover の文字色を `--orange-700` に変更し、`style.css` のキャッシュバージョンを `2026061401` に更新

## 2026-06-14 追加確認

- PageSpeed Insights APIは日次クォータ上限が継続しており、API経由の再計測は不可
- Chrome DevTools Lighthouseで公開URLを再監査
  - `https://digitool-lab.com/`: Accessibility 100、Best Practices 100、SEO 100
  - `https://digitool-lab.com/business-system-development/`: Accessibility 100、Best Practices 100、SEO 100
- 前回 `/business-system-development/` で出ていたコントラスト指摘は、公開反映後のDevTools Lighthouseでは解消済み
- Agentic Browsing監査で `llms.txt is missing or incomplete` が残っていた。原因は `llms.txt` 内の主要URLがMarkdownリンク形式ではなかったため
- `llms.txt` の主要URL・相談前記事URLをMarkdownリンク形式へ修正し、AI検索・LLMO向けに主要ページを機械的にたどれる形へ改善
- `llms.txt` 修正を本番反映後、トップページのChrome DevTools Lighthouseで Accessibility 100、Best Practices 100、SEO 100、Agentic Browsing 100、失敗0を確認
- Chrome拡張は現在選択中のChromeプロファイル `Profile 8` では無効状態。Yahoo!マップ修正、Search Consoleドメインプロパティの別アカウント確認は、Codex Chrome Extensionを有効化または対象Googleアカウントのプロファイルに切替後に実施する

## 2026-06-23 経過確認

- Chrome拡張は `Profile 8` で有効化済み。GSCとYahoo!マップのブラウザ確認が可能な状態
- Search Console URLプレフィックス `https://digitool-lab.com/` を確認
  - サマリー: ウェブ検索クリック316、未登録59、登録済み148、HTTPS 27、パンくず23
  - `/sitemap.xml`: 送信日2026/06/14、最終読み込み2026/06/14、成功、検出ページ176
  - ページインデックス: リダイレクト17、リダイレクトエラー1、重複1、クロール済み未登録32、検出未登録3、404が5
  - 404検証は引き続き「開始」状態
- 2026-06-14にインデックス登録リクエストした3URLはすべてGoogle登録済み
  - `https://digitool-lab.com/ai-search-meo-support/`
  - `https://digitool-lab.com/blog/ai-search-company-information-checklist`
  - `https://digitool-lab.com/blog/meo-citation-nap-checklist`
- 手動による対策、セキュリティの問題はいずれも問題なし
- Search Consoleドメインプロパティ `sc-domain:digitool-lab.com` は、Chromeにログイン済みの複数Googleアカウントで確認しても全て権限なし
- Yahoo!マップの該当掲載 `https://map.yahoo.co.jp/place?gid=q67CJgiK-l6` は旧住所 `東京都台東区下谷2丁目23-8` のまま
  - `掲載情報の修正・報告` から住所修正フォームへ進めるが、送信にはYahoo! JAPAN IDログインが必須
  - 現在のChrome状態ではYahoo!未ログインのため、修正提案の送信は未完了
- PageSpeed Insights APIは引き続き429。ブラウザ版PageSpeed Insightsでは再計測可能
  - トップページ mobile: Performance 83、Accessibility 100、Best Practices 100、SEO 100、Agentic Browsing 3/3
  - `/business-system-development/` desktop: Performance 99、Accessibility 100、Best Practices 100、SEO 100
  - PageSpeed画面では同LPのAgentic Browsingが一時的に2/3、`llms.txt を取得できませんでした` と表示
  - ただし `https://digitool-lab.com/llms.txt` はHTTP 200、H1あり、Markdownリンク36件で取得可能。Chrome DevTools Lighthouseでは同LPも Agentic Browsing 100、失敗0

## 2026-06-23 ドメインプロパティ認証

- Xserver DNSに `google-site-verification=fSO-fqfwKEyylvVbSCkfArYC7sNGRW2HwTtBd_lxkec` が追加されたことを確認
- `dig +trace TXT digitool-lab.com` で権威DNS `ns3.xserver.jp` から該当TXTが返ることを確認
- Search Consoleで `sc-domain:digitool-lab.com` のドメインプロパティにアクセスできることを確認
- ドメインプロパティのサマリー確認値
  - ウェブ検索クリック: 322
  - 登録済みページ: 228
  - 未登録ページ: 985
  - HTTPS: 28
  - パンくずリスト: 24
- ドメインプロパティはサブドメインやURLバリエーションを含むため、URLプレフィックス `https://digitool-lab.com/` より未登録数が多く表示される

## 2026-06-23 GSCドメインプロパティ横断監査

- サイトマップ
  - `https://digitool-lab.com/sitemap.xml`: 送信日2026/06/14、最終読み込み2026/06/14、成功、検出ページ176
  - `https://showroom.digitool-lab.com/sitemap.xml`: 送信日2026/06/02、最終読み込み2026/06/21、成功、検出ページ64
- ページインデックス
  - 未登録985、登録済み228
  - 主な未登録理由: リダイレクト424、noindex203、クロール済み未登録289、検出未登録53、404が5、リダイレクトエラー1
  - 404の5件は本番で正規URLへ301済みのため、GSCで修正検証を開始（開始日: 2026/06/23）
  - `tokutei.html` のリダイレクトエラー1件は本番で `/tokutei` が200到達するため、GSCで修正検証を開始（開始日: 2026/06/23）
  - `showroom.digitool-lab.com` の補助金詳細は、システム開発・AI/DX関連性が高いURLだけindexし、それ以外はnoindexにする設計。noindex対象サンプルは現行サイトマップには混入していないことを確認
  - `showroom` の補助金詳細でクロール済み未登録のURLがあるため、今後は重要URLだけ内部リンク・説明量・FAQを増やす
- robots.txt
  - GSC robots.txtレポートで `https://plat.digitool-lab.com/robots.txt` の404が重大エラーとして表示
  - `digiken-platform/public/robots.txt` を追加し、ローカル `pnpm build` は成功
  - 本番VPS `162.43.25.149` へのSSH接続は現在の鍵では不可。`plat` のrobots本番反映は接続権限またはデプロイ経路の確認待ち
  - `shop.digitool-lab.com` はrobotsでブロックされているため、GSC上の2件は放置可。ECを再開する場合のみ別途index方針を決める
- 検索パフォーマンス
  - 直近値: クリック322、表示8,660、CTR3.7%、平均掲載順位15.8
  - 上位クリック: `デジタルツール研究所` 47、`株式会社デジタルツール研究所` 27、`松岡哲平` 10
  - 改善候補: `警備業務効率化 ai活用事例` は表示143/クリック0。該当記事 `blog/security-property-management-dx.html` のtitle、description、H1、JSON-LD、事例データ、sitemap lastmodを更新
  - 同記事に `business-system-development/`、`dx-support-saitama/`、`ai-search-meo-support/` への関連相談先リンクを追加し、GSCで弱い主要LPへの内部リンクを補強
- リンク
  - 外部リンク合計12。主なリンク元はnote.com 5、scamadviser.com 2、timewell.jp 2
  - 内部リンク合計202。トップページへの内部リンクが152と偏っており、主要LP・記事への内部リンク追加が継続課題
- エクスペリエンス/拡張
  - HTTPS: 非HTTPS URL 0、HTTPS URL 28、直近90日で問題なし
  - Core Web Vitals: モバイル/PCともデータ不足
  - パンくずリスト: 有効24、無効0
- 権限
  - GSCドメインプロパティに `info@digitool-lab.com` 以外の確認済みオーナー5件が残存
  - 不明アカウントの削除は権限変更のため、ユーザー確認後に実施する

## 継続TODO

### P0

- Search Consoleの404検証結果を数日後に確認する
- Search Consoleドメインプロパティの不明な確認済みオーナー5件を、ユーザー確認後に削除する
- `plat.digitool-lab.com/robots.txt` を本番反映し、GSC robots重大エラーが消えるか確認する
- Yahoo!マップに残る旧台東区住所を修正する。Chrome拡張は有効化済みだが、修正提案の送信にはYahoo! JAPAN IDログインが必要
- `noindex` へ変更したページがサイトマップに再混入していないことを継続確認する

### P1

- GSCドメインプロパティの検索クエリを月次で抽出し、表示回数が多くCTRが低いページからtitle/descriptionを調整する
- `showroom` の補助金詳細は、全件indexではなく社内ポータル・業務システム・AI/DX・省力化に近いURLだけindexする方針を維持し、重要URLの本文量を増やす
- PageSpeed Insights APIは2026-06-23時点でも429。ブラウザ版PageSpeed InsightsとDevTools Lighthouseで代替確認済み
- 主要LP、記事、資料DLページのLighthouse確認は初回実施済み。今後は追加LP・古い記事へ範囲を広げる
- 主要LPと記事の内部リンクを増やす
- 古い記事のtitle、H2、FAQ、CTA、更新日を順に見直す
- リンク切れチェックを月1回実施する

### P2

- 画像サイトマップが必要か判断する
- FAQPage、Service、Article、BreadcrumbListの設計を既存記事全体で再点検する
- 表示回数が出たがCTRが低いページをGSCで抽出し、title/descriptionを改善する
- AI検索で引用されやすい会社情報、代表情報、支援範囲、FAQを外部媒体と一致させる
