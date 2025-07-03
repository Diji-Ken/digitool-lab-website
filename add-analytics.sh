#!/bin/bash

# Google Analytics & Search Console 一括設定スクリプト
# 使用方法: ./add-analytics.sh G-XXXXXXXXXX XXXXXXXXXXXXXXXXXXXXXXXXX

if [ $# -ne 2 ]; then
    echo "使用方法: $0 <測定ID> <確認コード>"
    echo "例: $0 G-XXXXXXXXXX XXXXXXXXXXXXXXXXXXXXXXXXX"
    exit 1
fi

MEASUREMENT_ID=$1
VERIFICATION_CODE=$2

echo "🚀 Google Analytics & Search Console コード追加開始"
echo "📊 測定ID: $MEASUREMENT_ID"
echo "🔍 確認コード: ${VERIFICATION_CODE:0:10}..."

# 追加するコードを作成
ANALYTICS_CODE="
  <!-- Google Search Console 所有権確認 -->
  <meta name=\"google-site-verification\" content=\"$VERIFICATION_CODE\" />

  <!-- Google Analytics 4 -->
  <script async src=\"https://www.googletagmanager.com/gtag/js?id=$MEASUREMENT_ID\"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '$MEASUREMENT_ID', {
      'anonymize_ip': true,
      'allow_google_signals': false,
      'allow_ad_personalization_signals': false
    });
  </script>
"

# バックアップディレクトリ作成
BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# 対象ファイルリスト
FILES=(
    "index.html"
    "about.html"
    "service.html"
    "case-studies.html"
    "contact.html"
    "service-otomo.html"
    "privacy-policy.html"
    "terms-of-service.html"
    "tokutei.html"
    "services/consulting.html"
    "services/training.html"
    "services/development.html"
)

# 事例ファイルを追加（case-024.htmlを除く）
for i in {001..025}; do
    if [ "$i" != "024" ]; then
        FILES+=("case-$i.html")
    fi
done

# 各ファイルにコードを追加
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "📝 処理中: $file"
        
        # バックアップ作成
        cp "$file" "$BACKUP_DIR/"
        
        # 構造化データの後にAnalyticsコードを追加
        # </script>の後に追加
        sed -i '' '/<!-- 構造化データ/,/script>/a\
'"$ANALYTICS_CODE"'
' "$file"
        
        echo "✅ 完了: $file"
    else
        echo "⚠️  ファイルが見つかりません: $file"
    fi
done

echo ""
echo "🎉 設定完了！"
echo "📁 バックアップディレクトリ: $BACKUP_DIR"
echo ""
echo "🔍 次のステップ:"
echo "1. Google Search Console でサイトマップを送信: sitemap.xml"
echo "2. Google Analytics でリアルタイムデータを確認"
echo "3. 数日後に Search Console でインデックス状況を確認"
echo ""
echo "📊 確認URL:"
echo "- Google Analytics: https://analytics.google.com/"
echo "- Search Console: https://search.google.com/search-console/" 