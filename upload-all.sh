#!/bin/bash

# Xserver FTP設定
FTP_SERVER="sv16039.xserver.jp"
FTP_USER="digitalai"
FTP_PASS="Mirai0524"
REMOTE_DIR="/public_html"

echo "🚀 全ファイルの自動アップロードを開始します..."

# HTMLファイルをアップロード
echo "📄 HTMLファイルをアップロード中..."
for file in *.html; do
    if [ -f "$file" ]; then
        echo "Uploading $file..."
        curl -T "$file" "ftp://$FTP_SERVER$REMOTE_DIR/$file" --user "$FTP_USER:$FTP_PASS"
    fi
done

# CSSファイルをアップロード
echo "🎨 CSSファイルをアップロード中..."
for file in css/*; do
    if [ -f "$file" ]; then
        echo "Uploading $file..."
        curl -T "$file" "ftp://$FTP_SERVER$REMOTE_DIR/$file" --user "$FTP_USER:$FTP_PASS" --create-dirs
    fi
done

# JavaScriptファイルをアップロード
echo "⚡ JavaScriptファイルをアップロード中..."
for file in js/*; do
    if [ -f "$file" ]; then
        echo "Uploading $file..."
        curl -T "$file" "ftp://$FTP_SERVER$REMOTE_DIR/$file" --user "$FTP_USER:$FTP_PASS" --create-dirs
    fi
done

# データファイルをアップロード
echo "📊 データファイルをアップロード中..."
for file in data/*; do
    if [ -f "$file" ]; then
        echo "Uploading $file..."
        curl -T "$file" "ftp://$FTP_SERVER$REMOTE_DIR/$file" --user "$FTP_USER:$FTP_PASS" --create-dirs
    fi
done

# 画像ファイルをアップロード（抜粋）
echo "🖼️ 画像ファイルをアップロード中..."
for file in images/*.{jpg,png,gif,svg}; do
    if [ -f "$file" ]; then
        echo "Uploading $file..."
        curl -T "$file" "ftp://$FTP_SERVER$REMOTE_DIR/$file" --user "$FTP_USER:$FTP_PASS" --create-dirs
    fi
done

echo "✅ アップロード完了！"
echo "🌐 Webサイトを確認: http://digitool-lab.com/" 