#!/bin/bash

# Google Analytics コードを追加するシンプルなスクリプト
ANALYTICS_CODE='
  <!-- Google Analytics 4 -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-BFWCDFQXC8"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '"'"'G-BFWCDFQXC8'"'"', {
      '"'"'anonymize_ip'"'"': true,
      '"'"'allow_google_signals'"'"': false,
      '"'"'allow_ad_personalization_signals'"'"': false
    });
  </script>'

# 処理対象ファイル
FILES=(
    "service-otomo.html"
    "privacy-policy.html"
    "terms-of-service.html"
    "tokutei.html"
    "services/consulting.html"
    "services/training.html"
    "services/development.html"
)

# 事例ファイルを追加
for i in {001..025}; do
    if [ "$i" != "024" ] && [ -f "case-$i.html" ]; then
        FILES+=("case-$i.html")
    fi
done

echo "🚀 Google Analytics コード追加開始"

for file in "${FILES[@]}"; do
    if [ -f "$file" ] && ! grep -q "G-BFWCDFQXC8" "$file"; then
        echo "📝 処理中: $file"
        
        # バックアップ作成
        cp "$file" "$file.bak"
        
        # ファビコン設定の後にAnalyticsコードを追加
        if grep -q "site.webmanifest" "$file"; then
            sed -i '' '/site\.webmanifest/a\
'"$ANALYTICS_CODE"'
' "$file"
        elif grep -q "</head>" "$file"; then
            sed -i '' '/<\/head>/i\
'"$ANALYTICS_CODE"'
' "$file"
        fi
        
        echo "✅ 完了: $file"
    else
        echo "⏭️  スキップ: $file (既に追加済みまたはファイルが存在しない)"
    fi
done

echo "🎉 処理完了！"
