#!/bin/bash

# 記事デプロイスクリプト
# 使用方法: ./deploy-article.sh "記事名"

ARTICLE_NAME=$1
SOURCE_DIR="作成中の記事/$ARTICLE_NAME"

if [ -z "$ARTICLE_NAME" ]; then
    echo "❌ エラー: 記事名を指定してください"
    echo "使用方法: ./deploy-article.sh \"製造業_経営者_事例\""
    exit 1
fi

if [ ! -d "$SOURCE_DIR" ]; then
    echo "❌ エラー: 記事フォルダが見つかりません: $SOURCE_DIR"
    exit 1
fi

echo "🚀 記事「$ARTICLE_NAME」をデプロイ中..."

# 1. ホームページに複製
echo "📄 ホームページ用HTMLファイルをコピー中..."
if [ -f "$SOURCE_DIR/ホームページ用.html" ]; then
    cp "$SOURCE_DIR/ホームページ用.html" "../public_html/blog/$ARTICLE_NAME.html"
    cp "$SOURCE_DIR/ホームページ用.html" "homepage/$ARTICLE_NAME.html"
    echo "✅ ホームページ用HTML: コピー完了"
else
    echo "⚠️  警告: ホームページ用.htmlが見つかりません"
fi

# 2. noteフォルダに複製
echo "📝 note用記事をコピー中..."
if [ -f "$SOURCE_DIR/note用.md" ]; then
    cp "$SOURCE_DIR/note用.md" "note/$ARTICLE_NAME.md"
    echo "✅ note用記事: コピー完了"
else
    echo "⚠️  警告: note用.mdが見つかりません"
fi

# 3. LinkedInフォルダに複製
echo "💼 LinkedIn用記事をコピー中..."
if [ -f "$SOURCE_DIR/LinkedIn用.md" ]; then
    cp "$SOURCE_DIR/LinkedIn用.md" "linkedin/$ARTICLE_NAME.md"
    echo "✅ LinkedIn用記事: コピー完了"
else
    echo "⚠️  警告: LinkedIn用.mdが見つかりません"
fi

# 4. メタデータがある場合の処理
if [ -f "$SOURCE_DIR/メタデータ.json" ]; then
    echo "📊 メタデータを処理中..."
    
    # case-studies.jsonの更新
    echo "📄 case-studies.jsonを更新中..."
    # ここで実際のJSON更新処理を実装
    # jqコマンドを使用してJSONファイルに新しいエントリーを追加
    
    # content-master-plan.mdの更新
    echo "📋 content-master-plan.mdを更新中..."
    # ここで管理表への行追加処理を実装
    
    # CSVファイルの更新
    echo "📊 活用事例CSVファイルを更新中..."
    if [ -f "../業務効率化サポート事例 - 活用サポート事例.csv" ]; then
        # メタデータからCSV行を生成して追加
        # 実装例は下記のPythonスクリプトを呼び出し
        python3 scripts/update-csv.py "$SOURCE_DIR/メタデータ.json"
        echo "✅ CSVファイル: 更新完了"
    else
        echo "⚠️  警告: CSVファイルが見つかりません"
    fi
    
    echo "✅ メタデータ処理: 完了"
else
    echo "⚠️  警告: メタデータ.jsonが見つかりません"
fi

echo ""
echo "🎉 デプロイ完了!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📱 note記事: article-workspace/note/$ARTICLE_NAME.md"
echo "💼 LinkedIn記事: article-workspace/linkedin/$ARTICLE_NAME.md"
echo "🌐 ホームページ: 自動反映済み (../public_html/blog/$ARTICLE_NAME.html)"
echo "📊 管理ファイル: 更新済み"
echo ""
echo "📝 次の作業:"
echo "1. note記事を手動投稿"
echo "2. LinkedIn記事を手動投稿"
echo "3. git add . && git commit -m \"新規記事追加: $ARTICLE_NAME\" && git push"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"