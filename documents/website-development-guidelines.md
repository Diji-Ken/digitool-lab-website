# Webサイト制作ガイドライン & ベストプラクティス

## 目次
1. [URL設計とクリーンURL](#url設計とクリーンurl)
2. [ナビゲーション設計](#ナビゲーション設計)
3. [コンテンツ管理](#コンテンツ管理)
4. [レスポンシブデザイン](#レスポンシブデザイン)
5. [パフォーマンス最適化](#パフォーマンス最適化)
6. [SEO対策](#seo対策)
7. [デプロイメント](#デプロイメント)
8. [品質管理](#品質管理)

---

## URL設計とクリーンURL

### 基本原則
- **クリーンURL**: `.html`拡張子を非表示にして美しいURLを実現
- **一貫性**: URL構造を統一し、ユーザーにとって予測可能に
- **SEOフレンドリー**: 検索エンジンが理解しやすい構造

### .htaccess設定
```apache
# HTML拡張子の非表示化
RewriteEngine On

# Redirect .html extension to clean URLs
RewriteCond %{THE_REQUEST} /([^.]+)\.html [NC]
RewriteRule ^ /%1? [NC,L,R]

# Internally rewrite clean URLs to .html files
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME}.html -f
RewriteRule ^(.*)$ $1.html [L]

# Force trailing slash removal for directories
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^(.+)/$ /$1 [R=301,L]
```

### URL例
```
良い例:
- https://digitool-lab.com/
- https://digitool-lab.com/about
- https://digitool-lab.com/service
- https://digitool-lab.com/case-studies

悪い例:
- https://digitool-lab.com/index.html
- https://digitool-lab.com/about.html
- https://digitool-lab.com/service/
```

---

## ナビゲーション設計

### 共通原則
- **一貫性**: 全ページで統一されたナビゲーション構造
- **アクセシビリティ**: キーボードナビゲーション対応
- **レスポンシブ**: モバイルでもデスクトップでも使いやすく

### ナビゲーション構造
```html
<!-- デスクトップナビゲーション -->
<nav class="desktop-nav">
  <a href="./about" class="active">私たちについて</a>
  <a href="./service">事業内容</a>
  <a href="./case-studies">ご支援事例</a>
</nav>

<!-- モバイルナビゲーション -->
<nav class="mobile-nav" id="mobile-menu">
  <a href="./about" class="active">私たちについて</a>
  <a href="./service">事業内容</a>
  <a href="./case-studies">ご支援事例</a>
  <a href="./contact">お問い合わせ</a>
</nav>
```

### リンク更新時の注意点
1. **相対パス使用**: `./` を使用して現在のディレクトリからの相対パス
2. **拡張子なし**: `.html` は含めない
3. **全ページ統一**: ヘッダー、フッター、本文すべてで統一
4. **アクティブ状態**: 現在のページに `active` クラスを付与

---

## コンテンツ管理

### ケーススタディ管理
- **管理ファイル**: `case-studies-management.md` で一元管理
- **ファイル命名**: `case-001.html`, `case-002.html` の連番制
- **テンプレート**: `case-template.html` を基準に作成

### 管理ファイルの重要性
```markdown
## 現在のケーススタディ一覧（24件）

### 001-013: 多様な業界での支援実績
- case-001.html: 製造業での業務効率化とデジタル変革
- case-002.html: 小売業のデータ分析によるマーケティング最適化
...

### 014-023, 025: 継続的な支援と成果創出
- case-014.html: エンジニアリング会社での情報共有システム構築
...
```

### 重要ルール
1. **実ファイルとの一致**: 管理ファイルの内容と実際のHTMLファイルのタイトルを必ず一致させる
2. **重複チェック**: 同じ内容のファイルがないか定期確認
3. **更新履歴**: 変更時は必ずコミットメッセージに詳細を記載

---

## レスポンシブデザイン

### ブレイクポイント
```css
/* Mobile First */
.container {
  max-width: 100%;
  padding: 0 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    max-width: 768px;
    padding: 0 2rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    padding: 0 2rem;
  }
}
```

### レスポンシブ原則
1. **Mobile First**: モバイルを基準に設計
2. **タッチフレンドリー**: ボタンサイズは最低44px
3. **読みやすさ**: フォントサイズは16px以上を基本

---

## パフォーマンス最適化

### 画像最適化
- **フォーマット**: WebP推奨、フォールバック用にJPEG/PNG
- **サイズ**: 適切な解像度での配信
- **遅延読み込み**: `loading="lazy"` 属性の活用

### CSS/JS最適化
- **外部ライブラリ**: CDN使用でキャッシュ効率向上
- **不要なコード削除**: 使用していないCSSやJSは除去
- **圧縮**: 本番環境では圧縮版を使用

### 使用ライブラリ
```html
<!-- AOS (Animate On Scroll) -->
<link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>

<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

---

## SEO対策

### 基本メタタグ
```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ページタイトル - 株式会社デジタルツール研究所</title>
<meta name="description" content="ページの説明文">
```

### 構造化データ
- **組織情報**: JSON-LD形式で企業情報を記載
- **パンくずリスト**: 階層構造を明確に
- **LocalBusiness**: 所在地情報を構造化

### 内部リンク最適化
- **アンカーテキスト**: わかりやすいテキストを使用
- **リンク階層**: 3クリック以内ですべてのページにアクセス可能
- **関連ページ**: コンテキストに応じた内部リンク

---

## デプロイメント

### Git管理
```bash
# 基本ワークフロー
git add .
git commit -m "詳細な変更内容の説明"
git push origin main
```

### コミットメッセージルール
```
形式: [カテゴリ] 変更の要約

例:
- [feat] クリーンURL対応と.htaccess設定追加
- [fix] ナビゲーションリンクの拡張子削除
- [content] ケーススタディ024の重複解消
- [style] About pageのスペーシング調整
```

### GitHub Actions
- **自動デプロイ**: mainブランチへのpushで自動デプロイ
- **ビルドテスト**: HTMLバリデーション、リンクチェック

---

## 品質管理

### チェックリスト

#### 新ページ作成時
- [ ] HTMLバリデーション通過
- [ ] レスポンシブデザイン確認
- [ ] 全デバイスでのナビゲーション動作確認
- [ ] 内部リンクに`.html`拡張子が含まれていない
- [ ] メタタグ適切に設定
- [ ] AOS（アニメーション）正常動作

#### リンク更新時
- [ ] 全ページのナビゲーション統一
- [ ] フッターリンク統一
- [ ] 内部リンク全て拡張子なし
- [ ] 外部リンクは適切なtarget設定

#### コンテンツ更新時
- [ ] 管理ファイルと実ファイルの一致確認
- [ ] 重複コンテンツがないかチェック
- [ ] タイトルと内容の整合性確認

### 継続的改善

#### 定期チェック項目
1. **パフォーマンス**: PageSpeed Insightsでの定期測定
2. **アクセシビリティ**: WAVE等のツールでの検証
3. **SEO**: Google Search Consoleでの問題確認
4. **ユーザビリティ**: 実際の利用者からのフィードバック収集

#### 更新頻度
- **コンテンツ**: 月1回以上の新規追加・更新
- **技術的改善**: 四半期ごとの見直し
- **デザイン調整**: 必要に応じて随時

---

## 技術的な注意点

### ファイル構造
```
public_html/
├── .htaccess                  # URL書き換え設定
├── index.html                 # トップページ
├── about.html                 # 会社情報
├── service.html               # サービス一覧
├── contact.html               # お問い合わせ
├── case-studies.html          # 事例一覧
├── case-001.html ~ case-025.html  # 個別事例
├── case-studies-management.md # 事例管理ファイル
├── css/
│   └── style.css              # メインスタイルシート
├── js/
│   ├── main.js                # 共通JavaScript
│   └── case-studies.js        # 事例ページ専用
├── images/                    # 画像ファイル
├── service/                   # サービス詳細ページ
└── documents/                 # ドキュメント類
```

### セキュリティ
- **フォーム処理**: 適切なバリデーションとサニタイゼーション
- **HTTPS**: 常時SSL化
- **セキュリティヘッダー**: 適切なHTTPヘッダー設定

---

## 最後に

このガイドラインは、digitool-lab.comの制作・運用を通じて得られた実践的なノウハウをまとめたものです。

新しいWebサイト制作時は、このガイドラインを参照することで：
- 一貫した品質の維持
- 効率的な開発プロセス
- ユーザーフレンドリーなサイト構築
- 保守性の高いコード

これらを実現できます。

---

**更新履歴**
- 2024-12-19: 初版作成（クリーンURL対応、ナビゲーション統一、コンテンツ管理ベストプラクティス） 