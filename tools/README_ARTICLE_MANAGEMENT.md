# 📊 記事管理システム

デジタルツール研究所のケーススタディ記事と画像ファイルを効率的に管理するためのシステムです。

## 🚀 機能

### 1. 記事情報管理
- 記事番号、タイトル、カテゴリの一元管理
- ファイル名と画像プレフィックスの自動生成
- 作成日とステータス管理

### 2. 画像ファイル名生成
- 記事番号から自動で画像ファイル名を生成
- 6種類の画像タイプに対応
- 統一された命名規則

### 3. 視覚的管理ダッシュボード
- 記事検索・詳細表示
- 画像ファイル名生成ツール
- 記事一覧表示・データエクスポート

## 📁 ファイル構成

```
public_html/
├── data/
│   └── article_management.json    # 記事データベース
├── tools/
│   ├── article_manager.js         # 管理ライブラリ
│   ├── article_management_dashboard.html  # 管理ダッシュボード
│   └── README_ARTICLE_MANAGEMENT.md      # このファイル
```

## 🎯 使用方法

### 管理ダッシュボードの使用

1. **ダッシュボードにアクセス**
   ```
   http://localhost:8000/tools/article_management_dashboard.html
   ```

2. **記事検索**
   - 記事番号またはタイトルで検索
   - プルダウンから記事を選択して詳細表示

3. **画像ファイル名生成**
   - 記事番号を入力
   - 画像タイプを選択
   - 「画像ファイル名生成」ボタンをクリック

4. **管理ツール**
   - 記事一覧表示
   - データエクスポート
   - 次の記事番号取得

### JavaScriptライブラリの使用

```javascript
// ライブラリを読み込み
<script src="tools/article_manager.js"></script>

// 画像ファイル名を取得
const heroImage = getImageName(1, "hero_image");  // "case-001-hero.jpg"

// 記事の全画像を取得
const allImages = getAllImages(1);
console.log(allImages.images);
// {
//   hero_image: "case-001-hero.jpg",
//   before_image: "case-001-before.jpg",
//   after_image: "case-001-after.jpg",
//   ...
// }

// 記事情報を取得
const article = articleManager.getArticleByNumber(1);
console.log(article.title);  // "顧客管理システムの効率化で売上15%向上"
```

## 🖼️ 画像命名規則

記事番号に基づいて以下の形式で画像ファイル名が生成されます：

- **ヒーロー画像**: `case-XXX-hero.jpg`
- **Before画像**: `case-XXX-before.jpg`
- **After画像**: `case-XXX-after.jpg`
- **プロセス画像**: `case-XXX-process.jpg`
- **結果画像**: `case-XXX-result.jpg`
- **サムネイル**: `case-XXX-thumb.jpg`

**保存先**: `images/case-studies/`

## 📝 新しい記事の追加

### 1. JSONファイルの更新

`data/article_management.json`に新しい記事を追加：

```json
{
  "number": "026",
  "title": "新しいケーススタディ",
  "category": "製造業",
  "filename": "case-026.html",
  "image_prefix": "case-026",
  "description": "説明文",
  "created_date": "2024-05-20",
  "status": "draft"
}
```

### 2. メタ情報の更新

```json
"meta_info": {
  "last_updated": "2024-05-20",
  "total_articles": 26,
  "next_article_number": "027",
  "version": "1.0"
}
```

## 🔍 データ構造

### 記事オブジェクト
```json
{
  "number": "001",
  "title": "記事タイトル",
  "category": "カテゴリ名",
  "filename": "case-001.html",
  "image_prefix": "case-001",
  "description": "記事の説明",
  "created_date": "2024-01-15",
  "status": "published"
}
```

### 画像命名規則
```json
{
  "hero_image": "{image_prefix}-hero.jpg",
  "before_image": "{image_prefix}-before.jpg",
  "after_image": "{image_prefix}-after.jpg",
  "process_image": "{image_prefix}-process.jpg",
  "result_image": "{image_prefix}-result.jpg",
  "thumbnail": "{image_prefix}-thumb.jpg"
}
```

### カテゴリ定義
```json
{
  "製造業": {
    "color": "#3B82F6",
    "icon": "factory"
  },
  "小売業": {
    "color": "#10B981",
    "icon": "store"
  }
}
```

## 🛠️ カスタマイズ

### 新しい画像タイプの追加

`image_naming_convention`セクションに追加：

```json
"new_image_type": "{image_prefix}-new.jpg"
```

### 新しいカテゴリの追加

`categories`セクションに追加：

```json
"新カテゴリ": {
  "color": "#FF5733",
  "icon": "new-icon"
}
```

## 📊 統計情報

ダッシュボードでは以下の統計情報を表示：

- 総記事数
- カテゴリ数
- 次の記事番号
- 公開済み記事数

## 🔧 トラブルシューティング

### よくある問題

1. **「記事データが読み込まれていません」エラー**
   - JSONファイルのパスを確認
   - HTTPサーバー経由でアクセスしているか確認

2. **画像ファイル名が生成されない**
   - 記事番号が存在するか確認
   - 画像タイプが正しく指定されているか確認

3. **記事一覧が表示されない**
   - ブラウザのコンソールでエラーを確認
   - JavaScriptが有効になっているか確認

### デバッグ

ブラウザのコンソールで以下のコマンドを実行：

```javascript
// データの確認
console.log(articleManager.articlesData);

// 記事の確認
console.log(articleManager.getArticleByNumber(1));

// 画像名の確認
console.log(getImageName(1, "hero_image"));
```

## 📄 ライセンス

このシステムは株式会社デジタルツール研究所の内部ツールです。

---

**更新日**: 2024年5月15日  
**バージョン**: 1.0  
**作成者**: デジタルツール研究所 