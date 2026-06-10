# SEO/AIO/LLMO/MEO 実行ロードマップ

更新日: 2026-06-10

## 結論

SEO/AIO/LLMOの主戦場は、自社HPに置く。note、LinkedIn、Qiita/Zenn、YouTube、地域媒体、GBP投稿は、自社HPへ戻すための入口・言及・被リンク補助として使う。

理由:

- 自社HPは、問い合わせ、資料DL、構造化データ、会社情報、NAP、FAQ、計測を自社で管理できる
- AI検索向けには、公式情報、代表者、所在地、支援領域、FAQ、llms.txtを一貫して置ける
- noteは検索に強い場合があるが、最終的な評価、CV、ブランド資産はnote側に残りやすい
- 外部媒体は、公式HPにない切り口、一次情報の補足、自然な言及、被リンクのために使う

## 2026-06-10 追加管理ファイル

- `seo-source-traceability-20260610.md`: 共有資料、既存台帳、キーワード調査、外部資料の出典別トレース
- `seo-content-and-external-action-queue-20260610.md`: 次に作るページ、既存改善、外部媒体、被リンク、計測改善キュー
- `seo-meo-aio-master-worklist-20260610.md`: SEO/MEO/AIO/LLMOの網羅的な作業リストと今日の推奨実行順
- `meo-citation-handoff-20260610.md`: 別PCのサイテーション作業用NAP統一表
- `gbp-operation-drafts-20260610.md`: GBP投稿、Q&A、写真追加候補の公開前ドラフト

## 媒体ごとの役割

| 媒体 | 役割 | 使い方 |
|---|---|---|
| 自社HP | 主戦場・CV受け皿 | 固定LP、費用記事、比較記事、FAQ、資料DL、構造化データ、llms.txt |
| showroom | 事例・補助金探索 | 事例や補助金から公式HPの相談導線へ接続 |
| note | 入口・言及・認知 | 読み物、考え方、地域/業種別の軽い記事。最後は公式HPへ誘導 |
| LinkedIn / X / Instagram | 指名検索・言及 | 投稿、実績、考え方、更新告知。会社名とサービス名を自然に出す |
| Qiita / Zenn | 技術信頼 | GAS、社内ポータル、AI活用、業務自動化の技術記事 |
| YouTube / Speaker Deck | 信頼・再利用 | セミナー、画面例、チェックリスト解説、研修資料 |
| GBP | MEO・近隣検索 | 投稿、写真、Q&A、サービス、口コミ依頼 |
| 地域媒体/団体 | サイテーション・被リンク | さいたま市、埼玉、商工会、士業、金融機関、支援団体 |

## noteでSEO/MEO記事を増やす方針

noteはやる。ただし、noteを主戦場にしない。

良い使い方:

- 自社HPの記事より少し柔らかい読み物にする
- タイトルは検索意図を含めるが、本文は体験・考え方・実務メモにする
- 公式HPの該当LP、チェックリスト、相談ページへリンクする
- 同じ内容をコピペしない。noteは別切り口にする

避けること:

- 自社HPと同じ記事を丸ごと転載する
- 市町村名だけ差し替えた量産記事を作る
- noteだけで完結させ、公式HPへ戻さない
- 被リンク目的だけの薄い記事を増やす

## 現在できていること

- 公式HPのNAP更新: さいたま市北区別所町738-3 / 048-700-7030
- 出典別トレース台帳作成: `seo-source-traceability-20260610.md`
- `llms.txt` / `llms_full.txt` 整備
- 主要固定LP追加
  - DX伴走支援
  - IT担当者がいない会社向け
  - 社内ポータル開発
  - 業務システム開発
  - AI研修
  - Excel・紙業務DX
  - 補助金DX相談
  - さいたま市DX支援
- 費用/比較記事追加
  - DX支援費用
  - IT担当採用/外注比較
  - 業務システム開発費用
  - AI研修費用
  - 社内ポータル開発費用
  - AI検索・MEO・サイテーション対策
- 資料DLページ追加
- サービス詳細資料・相談前チェックリストPDF追加
- 資料DLフォームをリード送信できる流れに修正
- note下書き5本作成
- GSC/GA4初期連携、主要URL検査の一部実施
- 技術SEOチェックリスト反映
  - index対象ページのtitle、description、canonical、H1、JSON-LD、画像altの不足0件を確認
  - テスト、テンプレート、完了画面、旧統合ページ、データ削除補助ページをnoindex整理
  - 法律系ページと会社紹介資料にWebPage構造化データを追加
  - 詳細: `seo-technical-checklist-20260610.md`

## 優先TODO

### P0: すぐやる

- [x] GSCで新規記事3本とさいたま市LPのURL検査、インデックス登録リクエスト、sitemap再送信を実施する
  - `https://digitool-lab.com/blog/ai-training-cost`
  - `https://digitool-lab.com/blog/internal-portal-development-cost`
  - `https://digitool-lab.com/blog/ai-search-meo-citation-checklist`
  - `https://digitool-lab.com/area/saitama-city-dx/`
- [x] `https://digitool-lab.com/sitemap.xml` をGSCで再送信する
- [x] 2026-06-10の技術SEO整理後、Search Consoleでサイトマップ再送信とページインデックスのエラー確認を行う
- [x] 共有資料、既存台帳、キーワード調査、外部資料を出典別に棚卸しし、`seo-source-traceability-20260610.md` に整理する
- [x] 次に作るページ、既存ページ改善、外部媒体、被リンク、計測改善を `seo-content-and-external-action-queue-20260610.md` に整理する
- [ ] note下書き5本を公開するか、公開前にタイトル/CTAだけ最終確認する
- [x] GBP投稿・Q&Aの公開前ドラフトを作る
  - テーマ: さいたま市の中小企業向けDX支援・AI検索/MEOチェックリスト
- [ ] GBP投稿・Q&Aを人間確認後に公開する
- [x] サイテーション作業用に、NAP統一表を別PC側へ渡せる形にする
- [ ] `ai-training-cost` と `internal-portal-development-cost` のGSC登録状況を3〜7日後に再確認する

### P1: 今週やる

- [ ] 自社HPブログを増やす
  - [x] DX支援会社の選び方
  - [x] 補助金を使う前のDX要件整理
  - [x] さいたま市の中小企業がDXで最初に見直す業務
  - [x] IT担当者がいない会社のチェックリスト
  - [x] 社内ポータル導入で失敗するパターン
  - [x] AI研修後に社内定着しない理由
  - [x] 業務システム開発を外注する前に決めること
  - [x] Excel業務をシステム化するか残すかの判断基準
  - [x] AI検索に引用されやすい会社情報の整え方
  - [x] MEOとサイテーションで最初に揃えるNAPチェックリスト
  - [x] 月額DX伴走支援で依頼できること
- [ ] 既存LPへFAQを追加する
  - 料金
  - 対応地域
  - 補助金
  - AI研修
  - 社内体制
  - 運用定着
- [ ] noteを週2本ペースで公開する
- [ ] LinkedIn/X/Instagramに、公式記事の更新告知を投稿する
- [ ] 地域団体、士業、金融機関、パートナー候補リストを作る

### P2: 30日以内

- [x] 業種別ハブを作る
  - 製造業DX
  - 建設業DX
  - 福祉/介護DX
  - 飲食/小売DX
- [x] 課題別ハブを作る
  - 日報自動化
  - 申請/承認
  - 顧客管理
  - マニュアル/ナレッジ共有
  - Excel脱却
  - AI活用
- [x] AI検索・MEO・サイテーション情報整備支援LPを作る
- [ ] 無料資料を個別化する
  - DX診断チェックリスト
  - 社内ポータル要件定義チェックリスト
  - MEO・サイテーションチェックリスト
  - AIO・LLMOチェックリスト
  - 広告入稿前チェックリスト
- [ ] Qiita/Zennに技術記事を2本公開する
- [ ] Speaker DeckまたはPDF資料を公開し、公式HPへリンクする

### P3: 60〜90日

- [ ] GSCデータを見て、表示回数が出たページのタイトル/FAQ/内部リンクを調整する
- [ ] 11〜20位に出たクエリは、新規記事より既存ページ改善を優先する
- [ ] 口コミ依頼フローを運用する
- [ ] GBP投稿と写真追加を継続する
- [ ] 実績がある地域だけ、市町村別ページを検討する
- [ ] セミナー/ウェビナーを1回作り、動画・スライド・記事へ再利用する

## コンテンツ制作ルール

- 自社HPは、検索意図に対する答え、FAQ、CTA、構造化データ、関連リンクを必ず入れる
- noteは、公式HPと同じ内容を繰り返さず、実務メモ・考え方・背景に寄せる
- 市町村ページは、実体、事例、訪問可能性、地域情報があるものだけ作る
- 補助金、広告、SEO、MEOで成果保証に見える表現は避ける
- 公式HP、GBP、外部媒体のNAPは常に同一表記にする

## KPI

- SEO: GSC表示回数、クリック数、CTR、掲載順位、登録URL数
- AIO/LLMO: 指名検索、AI経由らしい参照、外部言及数、FAQ閲覧
- MEO: GBP閲覧、検索語句、Webクリック、電話、経路、口コミ、写真閲覧
- CV: 資料DL、問い合わせ、LINE、Timerex、無料相談
- 外部導線: note/LinkedIn/Qiita/Zenn/YouTubeからの参照流入、被リンク、サイテーション

## 次に見るファイル

- `seo-audit-todo.md`
- `seo-aio-llmo-strategy-ledger.md`
- `seo-strategy-guide.md`
- `seo-technical-checklist-20260610.md`
- `posts-management/note_master.csv`
- `research/leadgen-materials-20260609/action-plan.md`
