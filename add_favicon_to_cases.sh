#!/bin/bash

# 事例ページ用のファビコン追加スクリプト
favicon_links='  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">
  <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">
  <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="192x192" href="android-chrome-192x192.png">
  <link rel="icon" type="image/png" sizes="512x512" href="android-chrome-512x512.png">
  <link rel="manifest" href="site.webmanifest">'

# 事例ページファイル一覧を取得
for file in case-*.html; do
    if [[ -f "$file" ]]; then
        echo "Processing $file..."
        # 最初のlink要素の前にファビコンを挿入
        sed -i.bak "/link href=\"https:\/\/fonts.googleapis.com/i\\
$favicon_links" "$file"
        rm "${file}.bak"
        echo "Added favicon to $file"
    fi
done

echo "Favicon addition completed for all case files."
