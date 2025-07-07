# 株式会社デジタルツール研究所 - 公式Webサイト

## 概要
株式会社デジタルツール研究所の公式Webサイト（[https://digitool-lab.com/](https://digitool-lab.com/)）のGitリポジトリです。

## 自動デプロイ
このリポジトリの`main`ブランチにプッシュすると、GitHub Actionsが自動で本番環境（Xserver）にファイルがデプロイされます。

## ファイル構成
- `index.html`: トップページ
- `about.html`: 私たちについて
- `service.html`: 事業内容
- `case-studies.html`: ご支援事例一覧ページ
- `blog/`: **ご支援事例（個別記事）** を格納するディレクトリ
  - `restaurant-cost-reduction.html` のように、SEOを意識したURLで記事を格納
- `css/`: スタイルシート
- `js/`: JavaScript
- `images/`: 画像ファイル
- `data/`: `case-studies.json` などの各種データ

## 【重要】新しいご支援事例の追加・更新ワークフロー

新しい記事（ご支援事例）を作成し、ウェブサイトに公開する際の手順です。

### Step 1: カード情報の登録【最重要】
- **操作ファイル:** `data/case-studies.json`
- **作業内容:**
    1. このJSONファイルを開き、既存のデータ形式に倣って、新しい記事の情報を**オブジェクトとして末尾に追記**します。
    2. 最低限、以下の項目を決定し、入力してください。
        - `id`: `case-026` のように、既存の最大番号+1のIDをつけます。
        - `title`: 記事の正式タイトル。
        - `summary`: 一覧ページに表示される短い要約文（約80～120文字）。
        - `industry`: 業種カテゴリー（例: "飲食業"）。
        - `date`: **公開日** (`YYYY-MM-DD`形式)。この日付順に一覧ページは並びます。
        - `tags`: 関連キーワードを配列で5つ指定します (例: `["AI活用", "コスト削減"]`)。
        - `thumbnail`: サムネイル画像のパス (例: `images/case-studies/case-026.jpg`)。
        - `url`: **記事のURL** (例: `blog/new-article.html`)。SEOを意識した分かりやすい名前にします。

### Step 2: 記事ファイルの作成
- **配置場所:** `blog/` ディレクトリ
- **作業内容:**
    1. `Step 1`で決めた`url`と同じ名前で、新しいHTMLファイルを作成します (例: `new-article.html`)。
    2. **【最重要】パスの修正:**
        - 新しい記事は `/blog/` ディレクトリ内に作成されるため、既存の記事をテンプレートとして使用する際は**パスの修正が必須**です。
        - CSS、JavaScript、画像、ページ内リンクなど、すべての相対パスの先頭に `../` を追加してください。
        - **修正例:**
            - **誤:** `<link rel="stylesheet" href="css/style.css">`
            - **正:** `<link rel="stylesheet" href="../css/style.css">`
            - **誤:** `<img src="images/logo.png">`
            - **正:** `<img src="../images/logo.png">`
            - **誤:** `<a href="index.html">`
            - **正:** `<a href="../index.html">`
        - この修正を怠ると、新しい記事のレイアウトが崩れ、画像が表示されなくなります。
    3. 既存の事例記事を参考に、記事のヘッダー情報（タイトル、公開日、タグ）と本文を記述します。

### Step 3: Gitへのプッシュ
- `git add .`, `git commit`, `git push` を行い、変更をリポジトリに反映します。
- プッシュ後、自動で本番環境にデプロイされます。

### Step 4: マスタープランの更新 (任意)
- より詳細な管理のために `content-master-plan.md` を利用する場合は、そちらも更新してください。

## ローカル開発
```bash
# public_html ディレクトリにいることを確認
# ローカルサーバーを起動
python3 -m http.server 8000

# ブラウザでアクセス
open http://localhost:8000
``` 
 
 
 
 