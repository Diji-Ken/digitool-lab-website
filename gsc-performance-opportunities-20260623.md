# GSC検索パフォーマンス改善候補

作成日: 2026-06-23
対象: `sc-domain:digitool-lab.com`
期間: 過去3か月
取得元: Search Console CSVエクスポート

## 全体値

| 指標 | 値 |
|---|---:|
| クリック数 | 322 |
| 表示回数 | 8,663 |
| 平均CTR | 3.7% |
| 平均掲載順位 | 15.8 |
| クエリ数 | 252 |
| ページ数 | 246 |

## 優先改善クエリ

表示回数があり、順位が近く、クリックが弱いものを優先する。

| クエリ | クリック | 表示 | CTR | 順位 | 判断 |
|---|---:|---:|---:|---:|---|
| `dx支援 費用` | 0 | 49 | 0% | 8.78 | 費用記事/LPのtitleとFAQを継続改善 |
| `社内ポータル 費用` | 0 | 36 | 0% | 8.33 | 費用記事と社内ポータルLPの相互リンクを強化 |
| `業務システム 費用` | 0 | 36 | 0% | 16.06 | 業務システム費用記事の冒頭回答と比較表を強化 |
| `ai 研修 費用` | 0 | 23 | 0% | 17.74 | AI研修費用記事とAI研修LPの導線を強化 |
| `離職率 改善 ai` | 0 | 84 | 0% | 12.18 | 離職予測AI記事のtitle/冒頭/CTA改善候補 |
| `離職 予測 ai` | 0 | 83 | 0% | 17.19 | 離職予測AI記事の検索意図を補強 |
| `ai 離職予測システム` | 0 | 81 | 0% | 16.00 | AIシステム開発導線へ接続 |
| `faqシステム chatgpt` | 0 | 40 | 0% | 17.88 | FAQ作成記事から社内ナレッジ/ポータル導線へ接続 |
| `警備 dx 導入事例` | 0 | 24 | 0% | 11.46 | 事例一覧・警備事例のtitle/内部リンク候補 |
| `経営分析レポート 自動作成` | 0 | 25 | 0% | 10.64 | 経営分析AI記事のCTA強化 |

## 優先改善ページ

| ページ | クリック | 表示 | CTR | 順位 | 判断 |
|---|---:|---:|---:|---:|---|
| `/blog/hr-turnover-prediction-ai` | 7 | 1,114 | 0.63% | 14.24 | 最大機会。title、冒頭回答、AIシステム相談CTAを改善 |
| `/case-studies` | 0 | 94 | 0% | 9.11 | 事例一覧なのにクリック0。title/descriptionを具体化 |
| `/blog/dx-support-cost` | 0 | 149 | 0% | 20.93 | 費用クラスタ。改善済みのため反映待ち、後日確認 |
| `/blog/ai-training-cost` | 0 | 100 | 0% | 18.27 | 費用クラスタ。AI研修LPと内部リンク強化 |
| `/blog/internal-portal-development-cost` | 0 | 55 | 0% | 9.95 | 順位は近い。title/descriptionのクリック訴求を確認 |
| `/blog/business-system-development-cost` | 0 | 43 | 0% | 15.56 | 比較・見積前チェックの追記候補 |
| `/ai-training-saitama/` | 1 | 123 | 0.81% | 15.43 | AI研修LPのtitle/FAQ/地域訴求を再確認 |
| `/blog/ai-chatgpt-faq-creation` | 0 | 82 | 0% | 18.87 | 社内FAQ/ナレッジ共有/ポータル導線へ接続 |
| `/blog/management-data-aggregation-ai` | 1 | 280 | 0.36% | 8.53 | 順位は良いがCTR低い。title改善候補 |
| `/blog/security-property-management-dx` | 3 | 334 | 0.90% | 24.70 | 警備DXの切り口で事例・業務システム導線へ接続 |

## 対応しない/低優先

- `facebook データ削除` 系は、指名/サービス相談につながりにくい
- `デジタルツール` 単体は曖昧すぎるため、指名検索強化としては会社名表記を継続
- `小売 在庫管理`、`製造業 需要予測` は順位が遠いものが多く、現時点では既存記事改善より主力LP/費用記事を優先

## 次の実装候補

1. `/case-studies` のtitle/descriptionを、単なる事例一覧ではなく「社内ポータル・業務システム・AI活用の開発事例」に寄せる
2. `/blog/hr-turnover-prediction-ai` の冒頭に、離職率改善AI・離職予測システムの答えを追加し、AIシステム開発相談へ接続する
3. `/blog/internal-portal-development-cost`、`/blog/ai-training-cost`、`/blog/business-system-development-cost` は改善反映後のGSC確認を待つ
4. `/ai-training-saitama/` のtitle/FAQを「研修後の定着」「費用」「社内ルール」へ寄せる
5. 次回GSCで、11〜20位のクエリを中心にtitle/FAQ/内部リンク改善を実施する

## 2026-06-23 実施

- `/case-studies` のtitle、description、OGP、Twitter、JSON-LD description、H1、冒頭説明を、社内ポータル・業務システム開発・AI活用の事例一覧として具体化した
- `/blog/hr-turnover-prediction-ai` のtitle、description、OGP、Twitter、JSON-LD headline/description、H1、冒頭回答、画像altを、GSCで表示が出ている `離職率 改善 ai`、`離職 予測 ai`、`ai 離職予測システム` に寄せた
- `/blog/management-data-aggregation-ai` の壊れていたTwitter title属性を修正し、title、description、OGP、Twitter、JSON-LD、H1、冒頭回答、FAQを `経営分析レポート 自動作成` に寄せた
- `/blog/ai-chatgpt-faq-creation` のtitle、description、OGP、Twitter、JSON-LD、H1、冒頭回答、FAQ、関連リンクを `FAQシステム ChatGPT`、`社内FAQ`、`ナレッジ` に寄せた
- `/blog/security-property-management-dx` のtitle、description、OGP、Twitter、JSON-LD、H1、冒頭回答、FAQを `警備DX 導入事例` に寄せた

## 2026-06-23 追加改善

GSCドメインプロパティの検索パフォーマンスで、`警備業務効率化 ai活用事例` が143表示・0クリックだったため、既存受け皿ページ `/blog/security-property-management-dx` をさらに実クエリへ寄せた。

- title、OGP、Twitter、meta descriptionを `警備業務効率化のAI活用事例` へ変更
- H1、画像alt、冒頭回答を `警備業務効率化` と `AI活用事例` の検索意図へ寄せた
- FAQ本文とFAQPage JSON-LDに「警備業の業務効率化では何から始めますか？」を追加
- 既存の `警備DX` 表現は本文文脈として残しつつ、検索結果に出る主要要素では実クエリの語順を優先した
- `/ai-training-saitama/` のtitle、description、OGP、Twitter、JSON-LD、H1、冒頭回答を、GSCで表示が出ているAI研修系クエリと地域検索に合わせて `埼玉・さいたま市` を明示した

## 2026-06-23 費用クラスタ追加改善

GSCで表示はあるがクリックが出ていない費用系クエリのうち、`ai 研修 費用` と関連する費用記事群を追加改善した。

- `/blog/ai-training-cost` のtitle、description、OGP、Twitter、JSON-LD headline/description、H1、冒頭回答を `AI研修の費用相場` へ寄せた
- `/blog/ai-training-cost` に「AI研修の費用相場を見るときの分け方」セクションを追加し、単発研修、部署別ワークショップ、定着支援つき研修の違いを明示した
- FAQ本文とFAQPage JSON-LDに「AI研修の費用相場はどのように見ればよいですか？」を追加した
- `/blog/dx-support-cost`、`/blog/internal-portal-development-cost`、`/blog/business-system-development-cost`、`/blog/ai-training-cost` の相互リンクを強化し、費用比較系クエリの内部導線を整理した
- 次回GSCでは、`ai 研修 費用`、`AI研修 費用相場`、`生成AI研修 費用`、`ChatGPT研修 法人` の表示回数、CTR、平均順位を確認する

## 2026-06-23 経営分析レポート自動作成ページ追加改善

GSCで `/blog/management-data-aggregation-ai` が表示280、CTR0.36%、平均順位8.53と順位に対してクリックが弱かったため、検索結果とAI回答で拾われる要素を追加調整した。

- title、description、OGP、Twitter、JSON-LD headline/description、H1、画像altを `経営分析レポートの自動作成`、`AI・Power BI`、`月次レポート自動化` に寄せた
- `経営分析レポート自動作成で最初に整理すること` セクションを追加し、指標、データ元、更新頻度、自動化範囲を明示した
- FAQ本文とFAQPage JSON-LDに「経営分析レポートの自動作成は何から始めるべきですか？」「Power BIやAIを使えば月次レポートは完全自動化できますか？」を追加した
- 関連リンクに `業務システム開発` と `レポート要約AIの事例` を追加し、事例閲覧から相談導線へ接続した
- 次回GSCでは、`経営分析レポート 自動作成`、`月次レポート 自動化`、`Power BI レポート 自動化`、`経営分析 AI` の表示回数、CTR、平均順位を確認する

## 2026-06-23 離職率改善AIページ追加改善

GSCで `離職率 改善 ai`、`離職 予測 ai`、`ai 離職予測システム` の表示があり、ページ単位でも `/blog/hr-turnover-prediction-ai` が表示1,114に対してCTR0.63%だったため、検索結果と相談導線を追加調整した。

- title、description、OGP、Twitter、JSON-LD headline/description、H1、画像altを `AIで離職率改善` と `離職予測システム` の検索意図へ寄せた
- `AIで離職率改善を始める前に整理すること` セクションを追加し、見るデータ、見る指標、運用ルール、権限と説明を明示した
- FAQ本文とFAQPage JSON-LDに「AIで離職率改善を始めるには何を整理すべきですか？」「離職予測AIでは個人情報の扱いに注意が必要ですか？」を追加した
- 関連リンクに `業務システム開発の費用相場` を追加し、AI活用事例から開発範囲・費用検討へ接続した
- 次回GSCでは、`離職率 改善 ai`、`離職 予測 ai`、`離職予測システム`、`AI 離職対策` の表示回数、CTR、平均順位を確認する

## 2026-06-23 費用系2ページ追加改善

GSCで `社内ポータル 費用` が36表示・平均順位8.33、`業務システム 費用` が36表示・平均順位16.06と、問い合わせに近い費用系クエリでクリックが出ていなかったため、費用レンジと見積前チェックを追加した。

- `/blog/internal-portal-development-cost` のtitle、description、OGP、Twitter、JSON-LDを `社内ポータル開発の費用相場`、`中小企業向け料金目安`、`見積前チェック` に寄せた
- 社内ポータル費用ページに `社内ポータル開発費用の目安` セクションを追加し、既存ツール活用、小規模ポータル、連携・権限・保守運用込みの違いを明示した
- `/blog/business-system-development-cost` のtitle、description、OGP、Twitter、JSON-LDを `業務システム開発の費用相場`、`中小企業向け料金目安`、`見積前チェック` に寄せた
- 業務システム費用ページに `業務システム開発費用の目安` セクションを追加し、Excel改善、小規模システム、基幹連携・帳票・データ移行ありの違いを明示した
- 両ページのFAQ本文とFAQPage JSON-LDに `いくらから検討できるか`、社内ポータル側には `保守費用や月額費用` の項目も追加した
- 次回GSCでは、`社内ポータル 費用`、`社内ポータル 開発 費用`、`業務システム 費用`、`業務システム開発 費用相場` の表示回数、CTR、平均順位を確認する

## 2026-06-23 IT担当採用/外注比較ページ追加改善

問い合わせに近い既存改善キューから `/blog/it-person-outsourcing-vs-hiring` を選び、`IT担当 外注`、`情シス代行 中小企業`、`社外IT担当`、`IT担当 外注 費用` の検索意図へ寄せた。

- title、description、OGP、Twitter、BlogPosting JSON-LDを `IT担当を採用するか外注するか`、`情シス代行`、`社外IT担当`、`費用感` に寄せた
- BreadcrumbList JSON-LDを追加した
- `採用・外注・月額伴走の比較表` と `IT担当を採用する前に整理すること` を追加した
- FAQ本文とFAQPage JSON-LDに `IT担当の外注費用は何で変わるか`、`採用と外注を併用できるか` を追加した
- 関連リンクに `月額DX伴走支援`、`IT担当不在の導入チェック`、`無料チェックリスト` を追加した
- 次回GSCでは、`IT担当 外注`、`情シス代行 中小企業`、`社外IT担当`、`IT担当 外注 費用` の表示回数、CTR、平均順位を確認する

## 2026-06-23 AI研修LPの費用導線追加改善

GSCで `ai 研修 費用` が23表示・0クリック・平均順位17.74、`/ai-training-saitama/` が表示123・CTR0.81%だったため、AI研修LP側にも費用判断と関連導線を追加した。

- `/ai-training-saitama/` に `AI研修の費用を考える前に決めること` セクションを追加した
- 対象人数と部署、扱う業務テーマ、定着支援の有無を費用変動要素として明示した
- `AI研修の費用相場`、`AI研修後に定着しない理由`、`AI活用チェックリスト` への内部リンクを追加した
- FAQ本文とFAQPage JSON-LDに `AI研修の費用はどのように決まりますか？` を追加した
- 次回GSCでは、`ai 研修 費用`、`AI研修 埼玉`、`生成AI研修 企業`、`ChatGPT研修 法人` の表示回数、CTR、平均順位を確認する

## 2026-06-23 会社情報ページのAIO/LLMO補強

GSC上位ページに `/about` があり、指名検索・代表者検索・AI検索で会社情報の正確性が重要になるため、会社情報ページを単なる代表メッセージから、会社・代表・所在地・支援領域が検索エンジンとLLMに伝わるページへ補強した。

- `/about` のtitle、description、OGP、Twitterを `会社概要・代表者情報`、`さいたま市のDX支援会社`、代表者情報、社内ポータル開発、業務システム開発、AI研修、DX伴走支援へ寄せた
- H1を `会社概要・代表者情報` に変更し、冒頭で本社所在地と支援領域を明示した
- `AboutPage`、`Organization`、`LocalBusiness`、`FAQPage` のJSON-LDを追加し、代表者、住所、電話番号、対応地域、支援領域を明示した
- 会社情報本文に、社内ポータル開発、業務システム開発、AI研修、DX伴走支援への内部リンクカードを追加した
- 旧住所系のGoogleマップ埋め込みURLを、現住所 `〒331-0821 埼玉県さいたま市北区別所町738-3` のGoogleマップ検索埋め込みへ差し替えた
- PC幅1280px、スマホ幅390pxで横スクロールなし、FAQ表示、現住所マップURL、旧住所テキストなし、コンソールエラーなしを確認した
- GSC URL検査で `/about` は `URL は Google に登録されています`、HTTPS/パンくず有効を確認し、インデックス登録リクエストを実行した

## 2026-06-23 事業内容ページのサービスハブ補強

GSC上位ページに `/service` があり、表示303・クリック7と既に検索露出があるため、単なる「事業内容」ページから、DX伴走支援、社内ポータル開発、業務システム開発、AI研修の入口として伝わるサービスハブへ補強した。

- `/service` のtitle、description、OGP、Twitterを `DX伴走支援`、`社内ポータル`、`業務システム開発`、`AI研修`、`さいたま市`、`中小企業` へ寄せた
- H1を `事業内容・サービス一覧` に変更し、冒頭説明で所在地、対象、主要サービス、支援範囲を明示した
- ファーストビュー直下に、DX伴走支援、社内ポータル・業務システム開発、AI研修・補助金活用相談の要約帯と無料相談CTAを追加した
- `WebPage`、`Organization`、`Service`、`ItemList` のJSON-LDを追加し、主要サービス一覧と提供会社情報を構造化した
- FAQ本文とFAQPage JSON-LDに、社内ポータル/業務システムを同じ窓口で相談できること、さいたま市以外も対応できることを追加した
- PC幅1590px、スマホ幅390pxで横スクロールなし、追加要約・FAQ表示、コンソールエラーなしを確認した
- 次回GSCでは、`事業内容`、`DX支援 さいたま市`、`社内ポータル 開発`、`業務システム開発 中小企業`、`AI研修 企業` の表示回数、CTR、平均順位を確認する
