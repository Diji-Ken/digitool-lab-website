# GSCドメインプロパティ運用TODO

作成日: 2026-06-23
対象: `sc-domain:digitool-lab.com`
状態: DNS TXT認証済み。2026-06-24にSearch Consoleのドメインプロパティサマリー表示を再確認済み。

## できるようになったこと

`https://digitool-lab.com/` のURLプレフィックスだけでは見えなかった、サブドメイン横断の状態を確認できるようになった。

- `digitool-lab.com` の公式HP
- `showroom.digitool-lab.com` の事例・補助金ショールーム
- `plat.digitool-lab.com` のポータル/API
- `shop.digitool-lab.com` の旧EC/商品URL
- `www`、`http`、旧URL、拡張子ありURLの正規化状態

## 運用方針

- すべてのURLをindexさせない
- 問い合わせに近いLP、費用記事、比較記事、事例、showroom主要ページだけを優先する
- 低優先の補助金詳細、管理画面、API、検索結果、旧URLは、noindex、robots、301、410のどれかで整理する
- GSCの件数は「エラー件数」ではなく、意図した除外かどうかで判断する

## P0: すでに着手・解消済み

- [x] GSCドメインプロパティ `sc-domain:digitool-lab.com` を確認済みにする
- [x] GSC 404例5件を本番で301到達確認
- [x] `tokutei.html` のリダイレクトエラーを本番で301到達確認
- [x] `case-studies` とshowroom主要ページへの内部リンクを増やす
- [x] 主要内部リンクの `.html` 表記を正規URLへ寄せる
- [x] 公開HTML全体の内部 `.html` hrefを0件化し、相対リンク・CSS・画像参照の切れを修正する
- [x] `plat.digitool-lab.com/robots.txt` の本番404を解消する
- [x] 手動対策、セキュリティ、HTTPS、パンくず、サイトマップ、リンクレポートの初回ヘルスチェックを実施する

## 作成済みTODO

ポータルと本台帳で追うTODOは以下。

- GSCドメインプロパティで全体検索パフォーマンスを週次確認する
- GSC上限解除後に優先未登録URL5件のインデックス登録リクエストを再実行する
- GSC未登録の優先URLの内部リンク強化とURL検査を行う
- GSCリンクレポートで主要LP・記事への内部リンク不足を確認して追加導線を決める
- GSC月次ヘルスチェックを実施する
- GSCサイトマップ最終読み込み日と送信URL数を確認する
- GSCドメインプロパティの不明な確認済みオーナー5件を確認して整理する
- `plat.digitool-lab.com` のrobots.txt重大エラーがGSC側で消えたか確認する

## P1: 今すぐ追う

| TODO | 理由 | 証拠/確認方法 |
|---|---|---|
| GSC上限解除後に優先URL5件のインデックス登録リクエストを再実行 | 重要URLが「検出/クロール済み - インデックス未登録」に残っている | URL検査 |
| `showroom.digitool-lab.com` のindex対象ルールを確定 | 補助金詳細は件数が多く、全件indexは薄いページ化しやすい | GSC未登録URL例、showroom sitemap/noindex |
| `case-studies`、費用記事、MEO/AIO記事のインデックス反映確認 | 問い合わせ導線に近い | GSC URL検査、検索パフォーマンス |
| GSCの404/リダイレクトエラー検証結果を確認 | 修正済みでもGSC反映に時間差がある | ページのインデックス登録 > 検証結果 |
| `plat.digitool-lab.com/robots.txt` の重大エラー消失を確認 | 本番200化済み。GSC側の再クロール待ち | robots.txtレポート/ページのインデックス登録 |

## 2026-06-23 追加実行

- `digitool-lab.com/sitemap.xml` をGSCで再送信。送信日/最終読み込み日時ともに2026/06/23、成功、検出176件を確認。
- `showroom.digitool-lab.com/sitemap.xml` は送信日/最終読み込み日時ともに2026/06/23、成功、検出564件を確認。
- 生成AI専用レポートはGSCサイドバーに未表示。通常の検索パフォーマンス内に「AI を使用してパフォーマンス レポートをカスタマイズする」は表示。
- `ai-search-meo-citation-checklist`、showroomの `subsidies/internal-portal`、`subsidies/system-development`、`cases`、`pricing` をURL検査。`system-development` はリクエスト済み表示が安定しないため、次回再確認する。
- `/about` はURL検査でGoogle登録済み、HTTPS/パンくず有効を確認し、インデックス登録リクエスト済み。
- `/service` はGSCで検索露出が出ているため、サービスハブとしてtitle、description、H1、主要サービス要約、FAQ、WebPage/Organization/Service/ItemList JSON-LDを改善。次回GSCでCTRとクエリ変化を確認する。

## 2026-06-23 DNS反映後確認

- `digitool-lab.com` のDNS TXTに `google-site-verification` レコードが公開されていることを確認。
- Chromeログイン済みGSCで `sc-domain:digitool-lab.com` のサマリー画面を開けることを確認。
- サマリー上で検索パフォーマンス322クリック、未登録985件、登録済み228件、HTTPS 31件、パンくず有効25件を確認。
- 以後はURLプレフィックスではなく、原則ドメインプロパティを正本として公式HP、showroom、plat、shop、www/httpを横断確認する。

## 2026-06-24 反映後再確認

- GSCドメインプロパティ `sc-domain:digitool-lab.com` のサマリー画面をChromeログイン済み状態で再確認できた。
- 検索パフォーマンスは過去3か月でクリック322、表示8,660、CTR3.7%、平均掲載順位15.8。最終更新は6時間前。
- ページインデックスは登録済み228、未登録985。未登録の内訳は、リダイレクト424、noindex203、クロール済み - インデックス未登録289、検出 - インデックス未登録53、404が5、リダイレクトエラー1。
- サイトマップは `https://digitool-lab.com/sitemap.xml` が176 URL、`https://showroom.digitool-lab.com/sitemap.xml` が564 URLで、どちらも2026/06/23最終読み込み・成功。
- リンクレポートは外部リンク12件、内部リンク202件。外部リンク元は `note.com` 5件、`scamadviser.com` 2件、`timewell.jp` 2件など。内部リンクはトップ152件に偏り、主要LPや記事へのリンク強化を継続する。

## 2026-06-24 追加TODO

| 優先 | TODO | 理由 |
|---|---|---|
| P0 | GSCの検索パフォーマンスをホスト別に分け、`digitool-lab.com` / `showroom` / `plat` / `shop` の露出URLを保存する | ドメイン全体で見えるようになったため、どのサブドメインが検索露出しているか分けて判断する |
| P0 | `クロール済み - インデックス未登録` 289件から、問い合わせに近い重要URLを10件だけ選ぶ | 全件対応ではなく、CVに近いURLだけをindex改善対象にする |
| P0 | `検出 - インデックス未登録` 53件から、新規LP・費用記事・showroom主要カテゴリを優先確認する | Googleに発見されているがまだ評価前のページを早めに拾う |
| P0 | 404 5件とリダイレクトエラー1件のGSC検証結果を再確認する | 本番修正済みでもGSC反映には時間差があるため |
| P1 | 表示回数が多くCTRが低いページを5件選び、title/description/H1/冒頭回答を再調整する | 表示はあるがクリックされていない機会損失を減らす |
| P1 | 11〜20位のクエリを5件選び、既存ページの本文・FAQ・内部リンクを増やす | 新規記事より早く順位改善しやすい |
| P1 | 内部リンク下位の重要LP・記事へ、トップ、サービス、費用記事、関連ブログから導線を追加する | 重要ページがGoogleに弱く見える状態を避ける |
| P2 | 外部リンク12件を初期値として、サイテーション・note・外部発信後のリンク増加を月次で照合する | 外部施策の成果をGSC上でも確認する |
| P2 | GSCの生成AI/AI features系レポートが出たか月次確認する | AIO/LLMOの実露出が取れるようになったら優先改善対象にする |

## P2: 週次で見る

| TODO | 理由 | 改善アクション |
|---|---|---|
| 検索パフォーマンスで表示回数が出ているクエリを抽出 | 実際に見られているキーワードを優先できる | title、description、FAQ、冒頭回答を調整 |
| 11〜20位のクエリを抽出 | 既存ページ改善で上げやすい | 内部リンク、FAQ、比較表、事例リンクを追加 |
| CTRが低いページを抽出 | 表示されているのにクリックされていない | title/descriptionの具体化 |
| リンクレポートで内部リンク不足ページを確認 | 重要ページが孤立するとindexされにくい | トップ、LP、記事、ハブからリンク追加 |
| sitemap最終読み込み日と送信URL数を確認 | 新規ページの発見状況を確認する | sitemap再送信、lastmod更新 |

## P3: 月次で見る

| TODO | 理由 |
|---|---|
| 手動対策・セキュリティ問題を確認 | サイト全体の検索可視性に直結 |
| HTTPS、パンくず、構造化データを確認 | 技術SEOの基本チェック |
| noindex URLがsitemapへ混入していないか確認 | 意図しない除外/混乱を防ぐ |
| リダイレクトURLが増えすぎていないか確認 | 内部リンクが旧URLへ戻っていないか見る |
| `shop`、`plat`、`showroom` の除外方針を見直す | サブドメインごとの目的が違うため |

## 人間確認が必要なもの

- GSCの不明な確認済みオーナー削除
- note、Qiita/Zenn、YouTube、GBP投稿の実公開
- 顧客名や実名事例を含む外部掲載
- 口コミ依頼
- 有料掲載、共催、団体登録

## 次の実行順

1. GSC上限解除後に優先URLの登録リクエストを再実行する
2. GSCの検索パフォーマンスから、表示回数・CTR・11〜20位クエリを抽出する
3. 抽出結果から既存ページのtitle、FAQ、内部リンクを更新する
4. `showroom` のindex対象補助金・事例をルール化する
5. 週次・月次の確認結果を `seo-audit-todo.md` と `gsc-index-coverage-triage-20260623.md` に追記する
