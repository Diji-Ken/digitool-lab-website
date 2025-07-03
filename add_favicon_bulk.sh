#!/bin/bash

# ファビコンセット
FAVICON_LINES='    <link rel="icon" type="image/x-icon" href="favicon.ico">
    <link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">
    <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">
    <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="192x192" href="android-chrome-192x192.png">
    <link rel="icon" type="image/png" sizes="512x512" href="android-chrome-512x512.png">
    <link rel="manifest" href="site.webmanifest">'

# ファビコンが設定されていないHTMLファイル一覧を取得
FILES=$(find . -name "*.html" -exec grep -L "favicon" {} \;)

for file in $FILES; do
    if [[ -f "$file" ]]; then
        echo "Processing $file..."
        # Noto+Sans+JPのlink要素の後にファビコンを追加
        sed -i.bak "/Noto\+Sans\+JP/a\\
$FAVICON_LINES" "$file"
        rm "${file}.bak" 2>/dev/null
        echo "Added favicon to $file"
    fi
done

echo "Bulk favicon addition completed!"
