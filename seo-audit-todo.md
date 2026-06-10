# SEO/AIO/LLMO/MEO 実行TODO - 株式会社デジタルツール研究所

更新日: 2026-06-10
元資料: `/Users/m/Downloads/digitool-lab-seo-aio-llmo-meo-strategy-20260601.docx`
追加資料: `/Users/m/Workspace/mirai/00_knowledge/clients/OToMo/projects/ai-showcase/research/leadgen-materials-20260609/`
実行台帳: `seo-aio-llmo-strategy-ledger.md`
全体ロードマップ: `seo-aio-llmo-execution-roadmap.md`
技術SEOチェック: `seo-technical-checklist-20260610.md`

## 現在の実行方針

- 自社HPをSEO/AIO/LLMOの主戦場にする。
- note、SNS、Qiita/Zenn、YouTube、地域媒体は、自社HPへ戻すための外部導線・言及・被リンク補助にする。
- noteでもSEO/MEO/AIO記事は作るが、自社HPと同じ内容を転載せず、読み物・実務メモ・考え方として公開する。
- 以後の全体像は `seo-aio-llmo-execution-roadmap.md` を優先して見る。

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
- [x] 2026-06-10の技術SEO整理後、Search Consoleでサイトマップを再送信し、ページインデックス、手動対策、セキュリティ問題を確認する
- [ ] PageSpeed Insightsでトップ、主要LP、記事、資料DLページを確認し、画像・CSS・外部JSの改善点を洗い出す
- [x] トップページの重い下部画像をWebP化し、画像サイズ指定・遅延読み込み・静的資産キャッシュ設定を追加する
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
- [ ] FAQ記事、費用記事、比較記事を6〜10本作る（初期5本: DX支援費用、IT担当採用/外注比較、業務システム開発費用、AI研修費用、社内ポータル開発費用）
- [ ] note 4本、Qiita/Zenn 2本、YouTube 2本を初期公開する
- [x] note 4本、Qiita/Zenn 2本の初期下書きを作成する
- [x] 法人集客資料を保存し、MEO・サイテーション、AIO・LLMO、広告入稿前チェックリストの導線を `/downloads/` と `llms.txt` 系へ反映する
- [x] 資料DLフォームを `send_lead.php` に送信する流れへ修正し、サービス詳細資料・相談前チェックリストPDFを作成する
- [x] AI検索・MEO・サイテーション対策記事を追加し、sitemap、llms、無料資料ページから内部リンクする
- [x] note下書き `N005` を追加する
- [ ] 地域団体、士業、金融機関、パートナー候補への掲載・共催相談リストを作る
- [x] `llms.txt` / `llms_full.txt` に主要LP、showroom、代表/著者情報、現在の本社所在地、事例要約を反映する
- [ ] `ai-training-cost` と `internal-portal-development-cost` のGSC URL検査・インデックス登録リクエスト完了を確認する

## 90日以内

- [x] `/area/saitama-city-dx/` を制作する
- [ ] 行田市、上尾市、伊奈町、桶川市は実績・相談・地域情報が揃ったものから独立ページ化を判断する
- [ ] 事例を課題別に再編集し、課題別事例ハブを作る
- [ ] DX診断シート、社内ポータル要件定義シート、補助金チェックリスト等の無料DL資産を公開する
- [x] 保存資料をもとに、MEO・サイテーション、AIO・LLMO、広告入稿前確認の実チェックリスト初版を自社用PDFに統合する
- [ ] 必要に応じて、MEO・AIO/LLMO・広告入稿前確認を個別PDF/個別LPとして分ける
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
