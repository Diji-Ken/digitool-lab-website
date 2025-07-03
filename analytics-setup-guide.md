# Google Analytics & Search Console 設定手順書

## 📋 設定前の準備

### 必要なアカウント
- Googleアカウント（Gmail）
- ウェブサイトの管理者権限

### 設定対象ファイル（42ファイル）
- メインページ: index.html, about.html, service.html, case-studies.html, contact.html
- サービスページ: services/consulting.html, services/training.html, services/development.html
- 事例ページ: case-001.html ～ case-025.html（case-024.html除く）
- その他: service-otomo.html, privacy-policy.html, terms-of-service.html, tokutei.html

## 🎯 STEP 1: Google Analytics 4 設定

### 1-1. アカウント作成
1. https://analytics.google.com/ にアクセス
2. 「測定を開始」をクリック
3. **アカウント設定**
   - アカウント名: `デジタルツール研究所`
   - データ共有設定: 全てチェック（推奨）

### 1-2. プロパティ設定
1. **プロパティ設定**
   - プロパティ名: `digitool-lab.com`
   - レポートのタイムゾーン: `日本`
   - 通貨: `日本円（JPY）`

2. **ビジネス情報**
   - 業種: `コンピュータ・電子機器`
   - ビジネス規模: `小規模（従業員1～10名）`
   - 利用目的: `オンラインでの売上向上`

### 1-3. データストリーム設定
1. **プラットフォーム選択**: 「ウェブ」を選択
2. **ウェブサイト情報**
   - ウェブサイトのURL: `https://digitool-lab.com`
   - ストリーム名: `デジタルツール研究所メインサイト`
3. **測定ID取得**: `G-XXXXXXXXXX` の形式でコピー

### 1-4. 拡張測定機能設定
以下の項目を有効化（推奨）：
- [x] ページビュー
- [x] スクロール数
- [x] 離脱クリック
- [x] サイト内検索
- [x] 動画エンゲージメント
- [x] ファイルのダウンロード

## 🔍 STEP 2: Google Search Console 設定

### 2-1. プロパティ追加
1. https://search.google.com/search-console/ にアクセス
2. 「プロパティを追加」をクリック
3. **プロパティタイプ選択**
   - 「URLプレフィックス」を選択
   - URL: `https://digitool-lab.com` を入力

### 2-2. 所有権確認
1. **確認方法**: 「HTMLタグ」を選択（推奨）
2. **メタタグ取得**: 
   ```html
   <meta name="google-site-verification" content="XXXXXXXXXXXXXXXXXXXXXXXXX" />
   ```
3. このメタタグをコピー

### 2-3. サイトマップ送信
1. 左メニューから「サイトマップ」を選択
2. 「新しいサイトマップの追加」に入力: `sitemap.xml`
3. 「送信」をクリック
4. ステータスが「成功しました」になることを確認

## 💻 STEP 3: HTMLファイルへのコード追加

### 3-1. 追加する場所
各HTMLファイルの `<head>` タグ内、構造化データの後、CSSリンクの前に追加

### 3-2. 追加するコード
```html
<!-- Google Search Console 所有権確認 -->
<meta name="google-site-verification" content="実際の確認コード" />

<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=実際の測定ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  
  gtag('config', '実際の測定ID', {
    'anonymize_ip': true,
    'allow_google_signals': false,
    'allow_ad_personalization_signals': false
  });
</script>
```

### 3-3. 一括置換用のスクリプト作成
以下のコマンドで一括追加できます：

```bash
# 実際の測定IDと確認コードに置き換えてください
MEASUREMENT_ID="G-XXXXXXXXXX"
VERIFICATION_CODE="XXXXXXXXXXXXXXXXXXXXXXXXX"

# 全HTMLファイルに追加
find . -name "*.html" -not -path "./analytics-template.html" -exec sed -i '' '/<!-- 構造化データ/,/script>/a\
\
  <!-- Google Search Console 所有権確認 -->\
  <meta name="google-site-verification" content="'$VERIFICATION_CODE'" />\
\
  <!-- Google Analytics 4 -->\
  <script async src="https://www.googletagmanager.com/gtag/js?id='$MEASUREMENT_ID'"></script>\
  <script>\
    window.dataLayer = window.dataLayer || [];\
    function gtag(){dataLayer.push(arguments);}\
    gtag('\''js'\'', new Date());\
    gtag('\''config'\'', '\''$MEASUREMENT_ID'\'', {\
      '\''anonymize_ip'\'': true,\
      '\''allow_google_signals'\'': false,\
      '\''allow_ad_personalization_signals'\'': false\
    });\
  </script>\
' {} +
```

## 📊 STEP 4: 動作確認

### 4-1. Google Analytics確認
1. Google Analytics管理画面で「リアルタイム」を確認
2. 自分のサイトにアクセスして、リアルタイムでカウントされるか確認
3. 「レポート」→「エンゲージメント」→「ページとスクリーン」で各ページが記録されているか確認

### 4-2. Search Console確認
1. 「URL検査」でトップページのURLを入力
2. 「インデックス登録をリクエスト」をクリック
3. 「カバレッジ」で問題がないか確認

### 4-3. 確認用チェックリスト
- [ ] Google Analytics のリアルタイムでアクセスが表示される
- [ ] Search Console でサイトマップが正常に送信されている
- [ ] 主要ページがインデックスされている
- [ ] 404エラーやクロールエラーがない

## 🎯 STEP 5: 目標設定（コンバージョン）

### 5-1. 重要な目標
1. **資料ダウンロード**: ダウンロードボタンクリック
2. **お問い合わせ**: フォーム送信完了
3. **電話番号クリック**: 電話リンククリック
4. **LINE登録**: LINE公式アカウントリンククリック

### 5-2. コンバージョン設定
Google Analytics 4 の「設定」→「コンバージョン」で以下を設定：

1. **資料ダウンロード**
   - イベント名: `download`
   - 条件: `event_name = download`

2. **お問い合わせ**
   - イベント名: `contact`
   - 条件: `event_name = contact`

## 📈 STEP 6: 定期監視項目

### 6-1. 週次確認項目
- [ ] アクセス数の推移
- [ ] 人気ページランキング
- [ ] 検索クエリ（Search Console）
- [ ] エラーページの有無

### 6-2. 月次確認項目
- [ ] コンバージョン数
- [ ] 検索順位の変動
- [ ] 新規/リピーターの比率
- [ ] 流入経路の分析

### 6-3. 四半期確認項目
- [ ] 目標達成状況
- [ ] 競合分析
- [ ] コンテンツ効果測定
- [ ] SEO施策の効果検証

## 🚨 注意事項

### プライバシー対応
- 個人情報保護に配慮したトラッキング設定
- Cookie使用に関する適切な告知
- GDPR対応（必要に応じて）

### データ保持期間
- Google Analytics: 最大14ヶ月
- Search Console: 最大16ヶ月
- 定期的なデータエクスポート推奨

## 📞 サポート

設定でお困りの場合は、以下までお問い合わせください：
- 電話: 048-606-4504
- メール: contact@digitool-lab.com

---

**作成日**: 2024年12月11日  
**更新日**: 随時更新  
**対象サイト**: https://digitool-lab.com 