# サブドメイン検索エンジン非表示設定ガイド

## 概要
サブドメイン `shop.digitool-lab.com` を検索エンジンの検索結果に表示させないための設定方法をまとめています。サイト自体は残しつつ、SEO上の影響を回避できます。

## 実装方法

### 方法1: robots.txt設定（最も簡単・推奨）

#### 手順
1. **Xserverサーバーパネルにログイン**
   - https://www.xserver.ne.jp/ → サーバーパネル

2. **ファイルマネージャーでサブドメインディレクトリへ移動**
   - `ファイルマネージャー` をクリック
   - `shop.digitool-lab.com` ディレクトリ（または対応するディレクトリ）へ移動
   - ルートディレクトリ（index.htmlがある場所）を確認

3. **robots.txtファイルを作成・アップロード**
   ```
   User-agent: *
   Disallow: /
   
   User-agent: Googlebot
   Disallow: /
   
   Crawl-delay: 86400
   ```

4. **ファイル名**: `robots.txt`
5. **配置場所**: `https://shop.digitool-lab.com/robots.txt` でアクセスできる場所

#### 効果
- 全ての検索エンジンボットがサイトをクロールしなくなる
- 24-48時間以内に効果が現れ始める
- 人間のアクセスには影響なし

### 方法2: .htaccess設定（より確実）

#### 手順
1. **サブドメインディレクトリの.htaccessファイルを編集**
2. **以下のコードを追加**:
   ```apache
   RewriteEngine On
   
   # 検索エンジンボットをブロック
   RewriteCond %{HTTP_USER_AGENT} (googlebot|bingbot|slurp|duckduckbot) [NC]
   RewriteRule ^(.*)$ - [F,L]
   
   # セキュリティヘッダー追加
   <IfModule mod_headers.c>
       Header set X-Robots-Tag "noindex, nofollow, noarchive, nosnippet"
   </IfModule>
   ```

#### 効果
- 検索エンジンボットのアクセスを完全にブロック
- 人間のアクセスは正常に動作
- より技術的な解決方法

### 方法3: HTMLメタタグ（既存ページ修正）

#### 手順
1. **各HTMLページの`<head>`セクションに追加**:
   ```html
   <meta name="robots" content="noindex, nofollow, noarchive, nosnippet">
   <meta name="googlebot" content="noindex, nofollow">
   <meta name="bingbot" content="noindex, nofollow">
   ```

#### 効果
- ページごとに個別制御可能
- 既にインデックスされたページにも効果的
- より細かい制御が可能

## Google Search Console対応

### 既にインデックスされている場合の追加対策

1. **Google Search Consoleにログイン**
2. **「削除」機能を使用**
   - URL削除ツールで `shop.digitool-lab.com/*` を一時的に削除申請
   - 上記設定完了後に実行

3. **サイトマップの削除**
   - もしサイトマップが登録されていれば削除

## 確認方法

### 設定確認
1. **robots.txtの確認**:
   ```
   https://shop.digitool-lab.com/robots.txt
   ```
   正しく表示されることを確認

2. **検索結果の確認**:
   ```
   site:shop.digitool-lab.com
   ```
   Googleで検索して結果が出ないことを確認（時間がかかる場合あり）

### タイムライン
- **即座**: robots.txt、.htaccess設定完了
- **24-48時間**: 新しいクロールが停止
- **1-4週間**: 検索結果から徐々に削除
- **1-3ヶ月**: 完全に検索結果から消える

## 注意事項

### 重要なポイント
- **アクセス自体は可能**: URLを直接入力すればアクセス可能
- **リンクは機能**: 他サイトからのリンクは正常に動作
- **検索のみブロック**: 検索エンジンからの発見のみを防ぐ

### ベストプラクティス
1. **方法1（robots.txt）から開始**: 最も簡単で効果的
2. **効果が薄い場合は方法2を追加**: より確実な制御
3. **定期的な確認**: 月1回程度の検索結果チェック

## トラブルシューティング

### よくある問題
- **robots.txtが効かない**: ファイルの場所、記述ミスをチェック
- **まだ検索に出る**: 完全削除には時間がかかります
- **アクセスできない**: .htaccessの設定ミスの可能性

### サポート
技術的な問題が発生した場合は、Xserverサポートまたは弊社までお問い合わせください。

---

**作成日**: 2024年
**更新日**: 随時更新
**対象**: shop.digitool-lab.com サブドメイン 
 
 
 
 