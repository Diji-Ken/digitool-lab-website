#!/usr/bin/env python3
import os
import re

# ファビコンセット
favicon_lines = '''    <link rel="icon" type="image/x-icon" href="favicon.ico">
    <link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">
    <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">
    <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="192x192" href="android-chrome-192x192.png">
    <link rel="icon" type="image/png" sizes="512x512" href="android-chrome-512x512.png">
    <link rel="manifest" href="site.webmanifest">'''

# HTMLファイルを検索
for root, dirs, files in os.walk('.'):
    for file in files:
        if file.endswith('.html'):
            file_path = os.path.join(root, file)
            
            # ファイルを読み込み
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # faviconが既に設定されているかチェック
                if 'favicon' in content:
                    continue
                
                # Noto+Sans+JPの後にファビコンを追加
                pattern = r'(\s*<link href="https://fonts\.googleapis\.com/css2\?family=Noto\+Sans\+JP[^>]*>\s*)'
                if re.search(pattern, content):
                    new_content = re.sub(pattern, r'\1' + favicon_lines + '\n', content)
                    
                    # ファイルに書き戻し
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Added favicon to {file_path}")
                else:
                    # InterフォントやCSSファイルの後にファビコンを追加
                    pattern2 = r'(\s*<link href="https://fonts\.googleapis\.com/css2\?family=Inter[^>]*>\s*)'
                    if re.search(pattern2, content):
                        new_content = re.sub(pattern2, r'\1' + favicon_lines + '\n', content)
                        
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"Added favicon to {file_path}")
                    else:
                        # CSSファイルの前にファビコンを追加
                        pattern3 = r'(\s*<link rel="stylesheet" href="css/style\.css[^>]*>\s*)'
                        if re.search(pattern3, content):
                            new_content = re.sub(pattern3, favicon_lines + '\n' + r'\1', content)
                            
                            with open(file_path, 'w', encoding='utf-8') as f:
                                f.write(new_content)
                            print(f"Added favicon to {file_path}")
                        
            except Exception as e:
                print(f"Error processing {file_path}: {e}")

print("Favicon addition completed!")
