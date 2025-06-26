# 株式会社デジタルツール研究所 - 公式Webサイト

## 概要
株式会社デジタルツール研究所の公式Webサイトです。

## 自動デプロイ設定完了
✅ GitHub Actions による自動デプロイが設定されました。
✅ コミット時に自動でXserverに反映されます。

## ファイル構成
- `index.html` - トップページ
- `about.html` - 会社情報
- `service.html` - サービス一覧
- `case-studies.html` - ご支援事例一覧
- `case-*.html` - 個別事例ページ
- `service/` - 個別サービスページ
- `css/` - スタイルシート
- `js/` - JavaScript
- `images/` - 画像ファイル
- `data/` - JSONデータ

## 新しい事例記事の追加方法

### 1. HTMLファイルの作成
既存の`case-001.html`をテンプレートとして、新しい`case-XXX.html`を作成してください。

### 2. JSONデータの更新
`data/case-studies.json`に新しい事例の情報を追加してください。

### 3. 画像の追加
`images/case-thumbnail-XXX.jpg`形式でサムネイル画像を追加してください。

## デプロイ
このリポジトリにプッシュすると、GitHub Actionsが自動でXserverにデプロイされます。

## ローカル開発
```bash
# ローカルサーバーを起動
python3 -m http.server 8000

# ブラウザでアクセス
open http://localhost:8000
``` 