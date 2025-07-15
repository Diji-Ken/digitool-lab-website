#!/usr/bin/env python3
"""
Google Search Console未登録ページ確認スクリプト
"""

import os
import glob
import xml.etree.ElementTree as ET

def get_all_html_files():
    """すべてのHTMLファイルのパスを取得"""
    html_files = []
    for root, dirs, files in os.walk('.'):
        for file in files:
            if file.endswith('.html'):
                file_path = os.path.join(root, file)
                # 相対パスに変換
                file_path = file_path.replace('./', '')
                html_files.append(file_path)
    return sorted(html_files)

def get_sitemap_urls():
    """sitemap.xmlから登録済みURLを取得"""
    sitemap_urls = []
    try:
        tree = ET.parse('sitemap.xml')
        root = tree.getroot()
        
        # 名前空間を考慮
        namespace = {'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
        
        for url in root.findall('.//ns:url', namespace):
            loc = url.find('ns:loc', namespace)
            if loc is not None:
                url_path = loc.text.replace('https://digitool-lab.com/', '')
                if url_path == 'https://digitool-lab.com/':
                    url_path = 'index.html'
                sitemap_urls.append(url_path)
    except Exception as e:
        print(f"sitemap.xml読み込みエラー: {e}")
    
    return sorted(sitemap_urls)

def should_exclude_file(file_path):
    """除外すべきファイルかどうか判定"""
    exclude_patterns = [
        'case-template.html',
        'debug-mobile.html',
        'download_thanks.html',
        'presentation.html',
        'case.html',
        'test',
        'temp',
        'backup',
        'old',
        'draft'
    ]
    
    for pattern in exclude_patterns:
        if pattern in file_path:
            return True
    return False

def main():
    print("=== Google Search Console 未登録ページ確認 ===\n")
    
    # すべてのHTMLファイルを取得
    html_files = get_all_html_files()
    print(f"総HTMLファイル数: {len(html_files)}")
    
    # sitemap.xmlから登録済みURLを取得
    sitemap_urls = get_sitemap_urls()
    print(f"sitemap.xml登録数: {len(sitemap_urls)}")
    
    # 未登録ページを特定
    missing_pages = []
    for html_file in html_files:
        if should_exclude_file(html_file):
            continue
            
        # index.htmlの場合は空文字列もチェック
        if html_file == 'index.html':
            if html_file not in sitemap_urls and '' not in sitemap_urls:
                missing_pages.append(html_file)
        else:
            if html_file not in sitemap_urls:
                missing_pages.append(html_file)
    
    print(f"\n=== 未登録ページ ({len(missing_pages)}件) ===")
    if missing_pages:
        for i, page in enumerate(missing_pages, 1):
            print(f"{i:2d}. {page}")
            
        print(f"\n=== 推奨対応 ===")
        print("1. 重要なページはsitemap.xmlに追加")
        print("2. Google Search Consoleで「URL検査」を実行")
        print("3. 「インデックス登録をリクエスト」を実行")
        print("4. 不要なページは削除またはnoindexを追加")
    else:
        print("すべてのページがsitemap.xmlに登録されています！")
    
    print(f"\n=== 除外されたファイル例 ===")
    excluded_files = [f for f in html_files if should_exclude_file(f)]
    for f in excluded_files[:10]:  # 最初の10個だけ表示
        print(f"- {f}")
    if len(excluded_files) > 10:
        print(f"... 他{len(excluded_files)-10}個")

if __name__ == "__main__":
    main()