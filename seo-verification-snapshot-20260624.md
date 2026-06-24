# SEO/AIO/LLMO 確認スナップショット

作成日: 2026-06-24
対象: `digitool-lab.com` / `showroom.digitool-lab.com` / 記事生成パイプライン

## 結論

機械的に確認できる範囲では、公開サイト、技術SEO監査、GSC運用データ保護、記事生成パイプラインは大きな問題なし。

GSC/GBP/GA4の画面でしか確認できない項目は、ログイン済みChrome側でCSVまたは画面確認が必要。記事制作は、既に承認済みドラフトが十分あるため、100本をゼロから生成する前に、既存ドラフトの公開・再編集を優先する。

## ローカル監査

| 確認 | 結果 |
|---|---|
| private SEO/GSC data audit | pass |
| markdown artifact audit | pass: 185 sitemap pages |
| noindex intent audit | pass: 16 intentional noindex pages |
| SEO link audit | pass: 204 HTML files |
| SEO indexability audit | pass: 185 sitemap URLs |
| structured data audit | pass: 185 sitemap pages / 515 JSON-LD blocks |
| priority internal link audit | pass: 19 priority pages |
| llms audit | pass |
| hero preload audit | pass: 204 HTML files |

## 本番HTTP確認

| URL | 結果 | メモ |
|---|---:|---|
| `https://digitool-lab.com/` | 200 | トップ正常 |
| `https://digitool-lab.com/sitemap.xml` | 200 | 185 URL |
| `https://digitool-lab.com/robots.txt` | 200 | 正常 |
| `https://digitool-lab.com/llms.txt` | 200 | 正常 |
| `https://digitool-lab.com/llms_full.txt` | 200 | 正常 |
| `https://digitool-lab.com/case-studies` | 200 | 正常 |
| `https://digitool-lab.com/blog/hp-teishoku-recipe-standardization-20260620` | 200 | 新規事例記事正常 |
| `https://digitool-lab.com/data/gsc/test-export.csv` | 410 | GSC運用データ保護OK |
| `https://showroom.digitool-lab.com/sitemap.xml` | 200 | 564 URL |
| `https://showroom.digitool-lab.com/subsidies` | 200 | 補助金ポータル正常 |

## GitHub Actions

| run | 結果 | メモ |
|---|---|---|
| `28066625453` | success | `Harden GSC exports and publish recipe case` |

直近2件の失敗はFTPタイムアウトまたは新記事の監査違反が原因。最新runでは監査とFTPデプロイが成功済み。

## PageSpeed

2026-06-24時点でも PageSpeed Insights API は429。

確認したURL:

- `https://digitool-lab.com/`
- `https://digitool-lab.com/business-system-development/`
- `https://digitool-lab.com/blog/hp-teishoku-recipe-standardization-20260620`

結果: `Quota exceeded`。API枠の問題のため、後日再実行またはローカルLighthouseで代替する。

## 記事生成パイプライン

2026-06-24の実行状況:

| agent | 結果 |
|---|---|
| `hp-researcher` | success |
| `note-researcher` | success |
| `pikachu` | success |
| `raichu` | success |
| `ditto` | 2026-06-23 22:30 success |

`article_drafts` 概況:

| 項目 | 件数 |
|---|---:|
| total | 818 |
| HP | 204 |
| note | 362 |
| X | 252 |
| approved | 194 |
| pending_review | 10 |
| published | 13 |
| archived | 595 |
| rejected | 6 |
| auto_approved | 375 |
| auto_revised | 341 |
| needs_human | 96 |

直近HP approved例:

- 従業員16名の農業観光事業／予約と収穫予定を整えて判断時間を減らした話
- 従業員18名の金属加工業／図面確認と見積メモを整えて回答を早くした話
- 従業員15名の理髪店／予約メモと来店後フォローを整えて受付時間を減らした話
- 従業員15名の海運業／倉庫の入出庫確認を整えて在庫確認時間を短くした話
- 従業員12名の放課後等デイサービス／保護者連絡と出席確認を整えて対応時間を減らした話

## 注意点

- `posts-management/scripts/unified-content-creator.py` は古い `/Users/m/Downloads/Develop/...` を参照しているため、そのまま100本生成に使わない。
- 現在の本命は `digiken-platform` の `research_findings -> pikachu -> raichu -> article_drafts`。
- HP公開時は、Supabase上の `approved` ドラフトをそのまま貼るだけでは不十分。HTML化、canonical、JSON-LD、FAQ、sitemap、llms、事例一覧導線、監査を1セットにする。

## 画面確認が必要な項目

- GSCのURL検査: 新規記事、主要LP、showroom主要ページ
- GSCの未登録URL例: 重要/放置/削除/410のURL単位仕分け
- GSC検索パフォーマンスCSV: 低CTR、8〜20位クエリ、ホスト別露出
- GA4: `generate_lead`、`file_download`、`timerex_click`、`line_click` の実データ
- GBP: 表示回数、検索語句、Webクリック、電話、経路、写真閲覧
- 外部媒体: note/GBP/Qiita/Zenn/LinkedInの公開URLと参照流入
