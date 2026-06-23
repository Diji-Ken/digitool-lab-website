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
