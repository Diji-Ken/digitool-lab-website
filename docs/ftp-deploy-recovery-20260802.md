# Xserverへのデプロイ復旧（2026-08-02）

## 何が起きていたか

2026-07-19 を最後に本番デプロイが止まり、**記事が9日以上公開されなかった**。
原因は独立した2つの問題が重なっていたこと。

### 問題1: リンクとnoindex（7/21〜）

`case-template.html` は「ルート直下に置く・noindex」前提のひな型だが、
`lapras` の `publish-hp.mjs` がこれをそのまま `blog/{slug}.html` として書き出していた。

- パスが1階層ずれる（`href="favicon.ico"` → `/blog/favicon.ico` で404）
- `robots` が `noindex, nofollow` のまま

結果、CIの `audit-seo-links` が失敗。**対象は189件中12件**（7/19以降に生成された記事）。

リンクだけ直しても `audit-noindex-intent` が同じ12件を弾くため、両方直す必要があった。

### 問題2: FTP接続不能（8/1に判明）

問題1を直したところCIは監査を全通過したが、最後のFTP転送が30秒でタイムアウトした。

```
Failed to connect, are you sure your server works via FTP or FTPS?
Error: Timeout (control socket)
```

## 切り分けの経緯

| 確認したこと | 結果 |
|---|---|
| GitHub Secrets（FTP_SERVER/USERNAME/PASSWORD） | **2025-06-26 から未変更** |
| Xserver の FTP制限設定（IP許可リスト） | 4ドメインとも **設定なし** |
| WAF設定 | 全項目 **OFF** |
| サーバー移転 | **なし**（sv16039 / 162.43.94.180） |
| 手元の国内回線からポート21へ接続 | **`220 FTP Server ready.`** — FTPは稼働中 |
| 同サーバーへ `AUTH TLS` | **`234 AUTH TLS successful`** — FTPS対応 |
| GitHub Actions（海外）から接続 | **タイムアウト** |

国内からは繋がり海外からは繋がらない、かつサーバーはFTPS対応。
**平文FTPのみ到達できない状態**と判断した。

なお当初「国外アクセス制限が有効では」と疑ったが、
このサーバーのセキュリティ設定には **WAFしか存在せず、その機能自体がなかった**。

## 対処

**1. 記事12件の修正**（コミット `b4ad0be`）
- 相対パス465箇所を `../` 起点へ
- 内部リンクの `.html` を削除（CIが内部hrefへの `.html` 混入を禁じている）
- `robots` の noindex を削除

**2. 生成側の再発防止**（digiken-platform / コミット `b8b6502`）
- `scripts/lapras/publish-hp.mjs` に blog配下向けの補正を追加
- 次の記事から自動で正しく出力される

**3. FTPS接続へ切り替え**（本リポジトリ / `.github/workflows/deploy.yml`）

```yaml
protocol: ftps
timeout: 120000
```

## 結果

```
CI          : success（監査7種すべて通過 → FTP転送 21ファイル・488KB）
本番公開     : 12/12件 すべて HTTP 200
noindex     : 解除済み（検索対象になった）
```

## 注意点（今後さわる人へ）

**`./` の一括置換をしてはいけない。**
blog配下45ファイルが `href="./"` を使うが、うち33件は兄弟記事への正しいリンク。
一括置換すると失敗が 12件 → 33件 に増える。対象を限定すること。

**置換は順序依存。**
`case-studies.html?tag=` を先に処理しないと `../case-studies.html?tag=` となり、
`.html` 混入で別ルールに引っかかる。

**平文FTPは使わない。** GitHub Actions から到達できない。

**修正スクリプトは `scripts/fix-blog-template-paths.mjs` に残してある。**
同種の問題が再発した場合、対象ファイル名を書き換えて `--apply` なしで実行すれば影響範囲を確認できる。
