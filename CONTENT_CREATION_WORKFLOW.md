# コンテンツ作成・管理 統合ワークフロー

## 1. 概要
このドキュメントは、株式会社デジタルツール研究所における**ウェブサイトの更新**と**SNSの投稿管理**の2つの業務を、単一のリポジトリで一元的に管理するための**公式な手順書**です。

## 2. 全体アーキテクチャ
このリポジトリは、ウェブサイト公開用のファイル群と、SNS投稿を自動化するための管理システムが共存しています。

```mermaid
graph TD
    subgraph "リポジトリ: Diji-Ken/digitool-lab-website"
        direction LR
        subgraph "A: ウェブサイト管理"
            A1["各種HTML/CSS/JSファイル"]
            A2["blog/ (記事HTML)"]
            A3["data/case-studies.json"]
            A1 & A2 & A3 --> A4{XServerへ自動デプロイ}
        end
        subgraph "B: SNS投稿管理"
            B1["posts-management/ (管理システム)"]
            B2[".github/workflows/linkedin_poster.yml"]
            B1 & B2 --> B3((GitHub Actionsによる自動投稿))
            B3 --> B4[LinkedIn]
        end
    end
```

---

## 3. ウェブサイトの更新フロー
（このセクションは、既存の `README.md` の内容をベースにしています）

### Step 1: カード情報の登録
- **操作ファイル:** `data/case-studies.json`
- **作業内容:** 新しい記事の情報を、このJSONファイルに追記します。`id`は必ず連番にしてください。

### Step 2: 記事ファイルの作成
- **配置場所:** `blog/` ディレクトリ
- **作業内容:** 新しいHTML記事ファイルを作成します。既存の記事を複製する場合、CSSや画像へのパスがずれるため、パスの先頭に`../`を追加する修正が必須です。

### Step 3: Gitへのプッシュ
- `git add .`, `git commit`, `git push` を行い、変更をリポジトリに反映します。
- プッシュ後、GitHub Actionsが自動で本番環境（XServer）にファイルをデプロイします。

---

## 4. SNS投稿の自動化フロー (コンテンツ分離方式)
編集のしやすさと確実な実行を両立した、現在の標準ワークフローです。

> **開発者向け注記:**
>
> 投稿スクリプトをローカル環境で直接実行・デバッグする際の手順については、
> [`posts-management/README.md`](./posts-management/README.md) を参照してください。

### アーキテクチャ
```mermaid
graph TD
    subgraph "準備フェーズ"
        A[ユーザー] -- "1. AIに指示" --> B{AIアシスタント}
        B -- "2. CSVに行を追記<br>(ステータス: draft)" --> C["posts-master.csv"]
        B -- "3. MDファイルを作成" --> D["/contents/P001_linkedin.md"]
    end

    subgraph "編集・承認フェーズ"
        A -- "4. MDファイルを編集・校正" --> D
        A -- "5. CSVのステータスを'ready'に更新" --> C
    end

    subgraph "投稿・アーカイブフェーズ"
        A -- "6. GitHub Issueで '/post P001' とコメント" --> E((GitHub Actions))
        E -- "7. 投稿スクリプト実行" --> F[LinkedIn]
        E -- "8. CSVを更新<br>(ステータス: posted, URL追記)" --> C
        E -- "9. MDファイルをアーカイブ" --> G["/contents/archive/"]
        D -- "移動" --> G
    end

    style C fill:#D1F2EB,stroke:#1ABC9C
    style D fill:#FDEDEC,stroke:#E74C3C
    style G fill:#FADBD8,stroke:#C0392B
    style F fill:#AED6F1,stroke:#3498DB
```

### 手順1: 投稿コンテンツの生成 (AI)
1.  **指示出し (ユーザー)**:
    > **指示例**:
    > 「マスターCSVのNo.125の事例を元に、LinkedIn用の投稿を1つ作成してください。」

2.  **AIの処理 (ドラフト作成)**:
    - **① 管理CSVの更新:** `posts-management/posts-master.csv` に新しい投稿IDで行を追記し、ステータスを `draft` とします。
    - **② コンテンツファイルの作成:** `posts-management/contents/` に、対応するMarkdownファイルを作成します。

### 手順2: 校正と承認 (ユーザー)
1.  **本文の編集:** `posts-management/contents/` にあるMarkdownファイルを編集します。
2.  **投稿の承認:** `posts-management/posts-master.csv` を開き、該当行のステータスを `ready` に変更します。

### 手順3: 自動投稿とアーカイブ (ユーザー & GitHub Actions)
1.  **投稿指示 (ユーザー)**: GitHubリポジトリの**Issues**で、新しいコメントとして以下のように入力します。
    > `/post P001`
2.  **全自動処理 (GitHub Actions)**:
    - **a. 投稿:** LinkedInに投稿します。
    - **b. CSV更新:** ステータスを `posted` に更新し、URLを追記します。
    - **c. アーカイブ:** 使用したMarkdownファイルを `archive` ディレクトリに移動します。
    - **d. コミット:** すべての変更をリポジトリに自動でコミット＆プッシュします。 