# 外部発信用 UTM付きURL一覧

更新日: 2026-06-11

## 目的

note、Qiita、Zenn、LinkedIn、Googleビジネスプロフィール、被リンク相談先からの流入を、GA4で後から判別できるようにする。公開時は原則として下記のUTM付きURLを使う。

## 命名ルール

| パラメータ | ルール |
|---|---|
| `utm_source` | 媒体名。`note`、`qiita`、`zenn`、`linkedin`、`google_business_profile`、`outreach` |
| `utm_medium` | `organic_social`、`organic_tech`、`organic_local`、`referral_outreach` |
| `utm_campaign` | 施策単位。初期は `seo_external_202606`、GBPは `meo_weekly_202606` |
| `utm_content` | 投稿ID。`N001`、`T001`、`GBP-01` など |

## note

| ID | タイトル | UTM付きURL |
|---|---|---|
| N001 | 中小企業のDXが定着しない理由 | `https://digitool-lab.com/dx-support-saitama/?utm_source=note&utm_medium=organic_social&utm_campaign=seo_external_202606&utm_content=N001` |
| N002 | もう一人のIT担当 | `https://digitool-lab.com/it-tantou-outsourcing/?utm_source=note&utm_medium=organic_social&utm_campaign=seo_external_202606&utm_content=N002` |
| N003 | 社内ポータルを作る前に整理すべき業務 | `https://digitool-lab.com/internal-portal-development/?utm_source=note&utm_medium=organic_social&utm_campaign=seo_external_202606&utm_content=N003` |
| N004 | 補助金ありきDXの落とし穴 | `https://digitool-lab.com/subsidy-dx-ai-system/?utm_source=note&utm_medium=organic_social&utm_campaign=seo_external_202606&utm_content=N004` |
| N005 | AI検索時代に見つかる会社になるために | `https://digitool-lab.com/ai-search-meo-support/?utm_source=note&utm_medium=organic_social&utm_campaign=seo_external_202606&utm_content=N005` |

## 技術媒体

| ID | 媒体 | タイトル | UTM付きURL |
|---|---|---|---|
| T001 | Zenn | 社内ポータルの権限設計 | `https://digitool-lab.com/internal-portal-development/?utm_source=zenn&utm_medium=organic_tech&utm_campaign=seo_external_202606&utm_content=T001` |
| T002 | Qiita | 日報自動集計の設計メモ | `https://digitool-lab.com/excel-paper-dx/?utm_source=qiita&utm_medium=organic_tech&utm_campaign=seo_external_202606&utm_content=T002` |

## LinkedIn

| ID | タイトル | UTM付きURL |
|---|---|---|
| P001 | 製造業の品質判断基準の見える化 | `https://digitool-lab.com/industries/?utm_source=linkedin&utm_medium=organic_social&utm_campaign=seo_external_202606&utm_content=P001` |

## Googleビジネスプロフィール

| ID | テーマ | UTM付きURL |
|---|---|---|
| GBP-01 | さいたま市の中小企業向けDX相談 | `https://digitool-lab.com/dx-support-saitama/?utm_source=google_business_profile&utm_medium=organic_local&utm_campaign=meo_weekly_202606&utm_content=GBP-01` |
| GBP-02 | AI検索・MEO・公式情報の整理 | `https://digitool-lab.com/ai-search-meo-support/?utm_source=google_business_profile&utm_medium=organic_local&utm_campaign=meo_weekly_202606&utm_content=GBP-02` |
| GBP-03 | 社内ポータル・業務システム相談 | `https://digitool-lab.com/internal-portal-development/?utm_source=google_business_profile&utm_medium=organic_local&utm_campaign=meo_weekly_202606&utm_content=GBP-03` |
| GBP-04 | 生成AI研修・社内ルールづくり | `https://digitool-lab.com/ai-training-saitama/?utm_source=google_business_profile&utm_medium=organic_local&utm_campaign=meo_weekly_202606&utm_content=GBP-04` |
| GBP-05 | Excel・紙業務の見直し | `https://digitool-lab.com/excel-paper-dx/?utm_source=google_business_profile&utm_medium=organic_local&utm_campaign=meo_weekly_202606&utm_content=GBP-05` |
| GBP-06 | IT担当者がいない会社の相談 | `https://digitool-lab.com/it-tantou-outsourcing/?utm_source=google_business_profile&utm_medium=organic_local&utm_campaign=meo_weekly_202606&utm_content=GBP-06` |
| GBP-07 | 補助金を使う前の要件整理 | `https://digitool-lab.com/subsidy-dx-ai-system/?utm_source=google_business_profile&utm_medium=organic_local&utm_campaign=meo_weekly_202606&utm_content=GBP-07` |
| GBP-08 | 無料資料・相談前チェックリスト | `https://digitool-lab.com/downloads/?utm_source=google_business_profile&utm_medium=organic_local&utm_campaign=meo_weekly_202606&utm_content=GBP-08` |

## 掲載・共催相談

| 用途 | UTM付きURL |
|---|---|
| DX支援紹介 | `https://digitool-lab.com/dx-support-saitama/?utm_source=outreach&utm_medium=referral_outreach&utm_campaign=backlink_outreach_202606&utm_content=dx_support` |
| 事例一覧 | `https://digitool-lab.com/case-studies.html?utm_source=outreach&utm_medium=referral_outreach&utm_campaign=backlink_outreach_202606&utm_content=case_studies` |
| 課題別事例 | `https://digitool-lab.com/case-themes/?utm_source=outreach&utm_medium=referral_outreach&utm_campaign=backlink_outreach_202606&utm_content=case_themes` |
| 無料資料 | `https://digitool-lab.com/downloads/?utm_source=outreach&utm_medium=referral_outreach&utm_campaign=backlink_outreach_202606&utm_content=downloads` |

## 公開時の注意

- 外部媒体のプロフィール欄は、UTMなしの公式URLでもよい。記事本文や投稿リンクはUTM付きURLを優先する。
- URLが長すぎて見栄えが悪い媒体では、本文中は通常URL、ボタン・リンク欄はUTM付きURLにする。
- GA4で確認する時は、`source / medium` と `campaign` を見る。
- UTMを変えた場合は、公開URL記録表にも実際に使ったURLを残す。
