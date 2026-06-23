# GSCドメインプロパティ運用TODO

作成日: 2026-06-23
対象: `sc-domain:digitool-lab.com`

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

- [x] GSC 404例5件を本番で301到達確認
- [x] `tokutei.html` のリダイレクトエラーを本番で301到達確認
- [x] `case-studies` とshowroom主要ページへの内部リンクを増やす
- [x] 主要内部リンクの `.html` 表記を正規URLへ寄せる
- [x] `plat.digitool-lab.com/robots.txt` の本番404を解消する

## P1: 今すぐ追う

| TODO | 理由 | 証拠/確認方法 |
|---|---|---|
| GSC上限解除後に優先URL5件のインデックス登録リクエストを再実行 | 重要URLが「検出/クロール済み - インデックス未登録」に残っている | URL検査 |
| `showroom.digitool-lab.com` のindex対象ルールを確定 | 補助金詳細は件数が多く、全件indexは薄いページ化しやすい | GSC未登録URL例、showroom sitemap/noindex |
| `case-studies`、費用記事、MEO/AIO記事のインデックス反映確認 | 問い合わせ導線に近い | GSC URL検査、検索パフォーマンス |
| GSCの404/リダイレクトエラー検証結果を確認 | 修正済みでもGSC反映に時間差がある | ページのインデックス登録 > 検証結果 |
| `plat.digitool-lab.com/robots.txt` の重大エラー消失を確認 | 本番200化済み。GSC側の再クロール待ち | robots.txtレポート/ページのインデックス登録 |

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
