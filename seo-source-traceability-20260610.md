# SEO/AIO/LLMO/MEO 出典別トレース台帳

更新日: 2026-06-10

## 目的

ユーザーから共有されたSEO、AIO、LLMO、MEO、法人集客、サイテーション、被リンク関連の資料を、出典別に棚卸しする。各資料から拾うべき施策を、実装済み、Codexで継続実行できるもの、人間確認が必要なものに分ける。

「98%相当」は、今日時点でCodexだけで実行・整理できる土台作業をほぼ残さない状態を指す。検索順位、AI検索での引用、GBP反映、外部掲載、口コミ、GSC検証結果は、外部サービス側の審査・時間経過・人間の承認が必要なため、同じ尺度では完了扱いにしない。

## 現在の見立て

| 領域 | 状態 | 進捗感 | 補足 |
|---|---|---:|---|
| 技術SEO | 主要項目は実装・検証済み | 95% | index対象ページのtitle、description、canonical、H1、JSON-LD、画像alt不足0件。Lighthouse主要ページ98〜100点台。 |
| NAP/会社情報 | 公式HPは反映済み | 95% | 本社、電話、構造化データ、llms系は反映済み。外部媒体・サイテーションは別PC作業と同期が必要。 |
| 受け皿LP | 主要LPは作成済み | 90% | DX支援、IT担当不在、社内ポータル、業務システム、AI研修、Excel/紙、補助金、さいたま市、資料DLが存在。 |
| 記事/FAQ | 初期記事は作成済み | 70% | 費用/比較/AI検索系は作成済み。選び方、補助金要件整理、業種別/課題別は追加余地あり。 |
| AIO/LLMO | 土台は実装済み | 85% | llms.txt、FAQ、構造化データ、会社情報は整備済み。外部言及・SNS・第三者媒体はこれから。 |
| MEO | GBP初期更新済み | 65% | 電話番号は反映済み。投稿、Q&A、写真、口コミ依頼、サイテーション運用は継続作業。 |
| 外部導線/被リンク | 下書き中心 | 45% | note、Qiita/Zenn下書きあり。公開、URL記録、地域団体/士業/金融機関への掲載相談は人間作業。 |
| 計測/改善 | 初期設定済み | 75% | GA4/GSC連携、CVイベント実装済み。実データ蓄積後のキーイベント追加と改善が必要。 |

## 出典別マッピング

| ID | 出典 | 抽出した施策 | 現在の状態 | 次アクション |
|---|---|---|---|---|
| S01 | `/Users/m/Downloads/digitool-lab-seo-aio-llmo-meo-strategy-20260601.docx` | 「もう一人のIT担当」ポジション、固定LP優先、showroom役割分離、MEO/NAP、外部媒体導線 | `seo-strategy-guide.md` と `seo-aio-llmo-strategy-ledger.md` に反映済み | staleなTODOを整理し、外部媒体/人間確認項目を別枠管理 |
| S02 | `/Users/m/Downloads/企業集客.docx` | GBP基本設定、MEO投稿、口コミ、サイテーション、広告前チェック | `research/leadgen-materials-20260609/action-plan.md` に反映済み | GBP投稿/Q&A/写真追加の運用ドラフトを作る |
| S03 | `/Users/m/Workspace/mirai/web/Clippings/法人集客/「ググる」が死んだ...AIO対策×SNS運用ハック...md` | JSON-LD、冒頭回答、E-E-A-T、1ドメイン継続更新、SNS導線 | 主要LP、記事、llms、構造化データへ反映済み | 追加記事は冒頭回答とFAQを必須化 |
| S04 | `/Users/m/Workspace/mirai/web/Clippings/法人集客/LLMOをガチったら...md` | AI検索では外部言及・引用・linkless mentionも重要 | 戦略台帳に外部言及方針として反映済み | 有料/ASP/作為的リンクは採用せず、地域団体・共同事例・技術記事に寄せる |
| S05 | `/Users/m/Workspace/mirai/web/Clippings/法人集客/【実例保存版】SEO専門家がClaudeと協業...md` | 技術SEO監査、キーワード難易度、競合比較、ROI優先順位 | 技術監査と戦略台帳に反映済み | Ahrefs等の外部有料データが必要な分析は人間確認 |
| S06 | `/Users/m/Downloads/IMG_0460.JPG`〜`IMG_0463.JPG` | URL、構造、Hタグ、内部リンク、画像alt、mobile、sitemap、canonical、noindex、robots、GSC、リンク購入禁止 | `seo-technical-checklist-20260610.md` に反映済み | 月次監査項目に継続化 |
| S07 | `/Users/m/Workspace/mirai/00_knowledge/company/keyword_research/SEO対策_総合キーワード調査.md` | SEO対策、費用、会社、相談、AI、埼玉、比較、外注 | 自社HPのSEO/AIO受け皿作成の参考として確認済み | 自社の主業務とずれるため、SEOサービス単独売りは優先しない。AIO/MEO相談記事に限定活用 |
| S08 | `/Users/m/Workspace/mirai/00_knowledge/company/keyword_research/MEO対策_総合キーワード調査.md` | MEO対策、費用、会社、自分で、SEOとの違い、口コミ、GBP | `ai-search-meo-citation-checklist` とMEO方針へ反映済み | MEOを主商材化するなら専用LPを別途検討 |
| S09 | `/Users/m/Downloads/digitool-lab-seo-aio-llmo-gptpro-input-20260601.zip` | GPT Pro向けサイト現状共有、llms、主要ページスナップショット | 参考資料として保存済み | 現在の本番との差分が大きくなったら再作成 |
| S10 | `seo-audit-todo.md` | 30/60/90日TODO、GSC、GA4、LP、外部投稿、MEO | 現行TODOの基準 | 完了済みGSC/速度/404を整理し、残タスクを絞る |
| S11 | `seo-aio-llmo-strategy-ledger.md` | 検索意図別の受け皿、CTA、AIO/LLMO要素、被リンク候補 | 現行戦略台帳 | 人間確認が必要なものを明記 |
| S12 | `seo-aio-llmo-execution-roadmap.md` | 媒体ごとの役割、優先TODO、KPI | 現行ロードマップ | P0を現状に合わせて更新 |
| S13 | `seo-technical-checklist-20260610.md` | 技術SEO監査とLighthouse/GSC結果 | 最新の技術SEO証跡 | 古い記事への範囲拡大を継続TODO化 |
| S14 | `posts-management/note_master.csv` | note下書き5本 | 下書き作成済み、公開待ち | 公開は人間確認。公開URLを記録する |
| S15 | `posts-management/contents/tech/*.md` | Qiita/Zenn下書き2本 | 下書き作成済み、公開待ち | 公開は人間確認。公開URLを記録する |
| S16 | `company-contact-inventory.md` | NAP、住所、電話、旧住所削除方針 | 公式HP側は更新済み | サイテーション別PC作業の基準表にする |

## Codexだけで進められる残タスク

優先順:

1. 既存TODOの棚卸しと完了状況の整合
2. GBP投稿、GBP Q&A、写真追加候補のドラフト作成
3. サイテーション別PC作業用のNAP・表記統一ハンドオフ作成
4. note、Qiita/Zenn、LinkedIn、Speaker Deck用の投稿URL記録表を整備
5. 既存記事の改善キュー作成
   - title/description調整候補
   - FAQ追加候補
   - 内部リンク追加候補
   - 更新日を入れる候補
6. 次に作るSEOページの優先順位表を作成
   - DX支援会社の選び方
   - 補助金を使う前のDX要件整理
   - さいたま市の中小企業がDXで最初に見直す業務
   - 社内ポータル導入で失敗するパターン
   - AI研修後に定着しない理由
7. 月次監査チェックコマンドと確認手順を固定化

## 人間確認が必要な項目

| 項目 | 理由 | 確認してほしいこと |
|---|---|---|
| note公開 | アカウント投稿・表現承認が必要 | 下書き5本を公開してよいか、タイトルとCTAに違和感がないか |
| Qiita/Zenn公開 | アカウント投稿・技術コミュニティ向け表現確認が必要 | 技術記事2本を公開してよいか |
| LinkedIn/X/Instagram投稿 | 会社アカウント運用方針が必要 | 代表発信にするか、会社発信にするか |
| GBP投稿/Q&A/写真追加 | Google上の公開情報になる | 投稿文、Q&A、写真を公開してよいか |
| 口コミ依頼 | 実体験者への依頼が必要 | 誰に依頼するか。謝礼、評価指定、選別依頼はしない |
| サイテーション登録 | 別PC/別ツールで進行中 | 表記を `株式会社デジタルツール研究所 / 〒331-0821 埼玉県さいたま市北区別所町738-3 / 048-700-7030` に統一 |
| 地域団体・士業・金融機関への掲載相談 | 対外連絡・関係性が必要 | 優先候補、連絡可否、紹介者の有無 |
| GSCの経過確認 | Googleの反映待ちがある | 404検証、インデックス状況、11〜20位クエリを数日後に再確認 |
| Ahrefs等の有料競合調査 | 契約・ログインが必要 | 使えるツールがあるか。なければGSC中心で進める |
| セミナー/動画公開 | 顔出し・資料・日程の判断が必要 | YouTube/Speaker Deckを使うか、まずPDF公開にするか |

## 98%へ近づけるための判断

今日中にCodexが到達できる上限は「サイト内実装・台帳・ドラフト・検証」の98%であり、検索順位やAI回答への採用を今日中に98%にすることはできない。次の状態になれば、Codex側でできる当面の土台作業は98%相当とみなせる。

- 既存台帳のP0/P1が現在地に合わせて整理済み
- 外部投稿・GBP・サイテーション・口コミの人間確認リストが明確
- 次に作るページと記事の優先順位が明確
- 技術SEO、速度、GSC、404、sitemap、llms、構造化データの証跡が残っている
- 公開済みページの品質を落とさず、追加作業が運用タスクとして残っている
