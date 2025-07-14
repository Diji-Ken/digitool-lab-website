#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
活用事例CSVファイル更新スクリプト
使用方法: python3 update-csv.py メタデータ.json
"""

import json
import csv
import sys
import os

def update_csv(metadata_file):
    # メタデータファイルを読み込み
    try:
        with open(metadata_file, 'r', encoding='utf-8') as f:
            metadata = json.load(f)
    except FileNotFoundError:
        print(f"❌ エラー: メタデータファイルが見つかりません: {metadata_file}")
        return False
    except json.JSONDecodeError:
        print(f"❌ エラー: メタデータファイルの形式が正しくありません: {metadata_file}")
        return False

    # CSVファイルのパス
    csv_file = "../業務効率化サポート事例 - 活用サポート事例.csv"
    
    if not os.path.exists(csv_file):
        print(f"❌ エラー: CSVファイルが見つかりません: {csv_file}")
        return False

    # 現在のCSVファイルを読み込んで最大No.を取得
    max_no = 0
    existing_rows = []
    
    try:
        with open(csv_file, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            headers = next(reader)  # ヘッダー行
            existing_rows.append(headers)
            
            for row in reader:
                if row and row[0].isdigit():  # No.が数字の行のみ
                    max_no = max(max_no, int(row[0]))
                existing_rows.append(row)
    except Exception as e:
        print(f"❌ エラー: CSVファイルの読み込みに失敗: {e}")
        return False

    # 新しい行を作成
    new_no = max_no + 1
    new_row = [
        str(new_no),                          # No.
        metadata.get('industry', ''),         # 業界
        metadata.get('job_type', ''),         # 業種
        metadata.get('business_content', ''), # 業務内容
        metadata.get('challenges', ''),       # 支援前の課題
        metadata.get('ai_solution', ''),      # AI活用方法
        metadata.get('effects', ''),          # 業務効率化の効果
        metadata.get('summary', '')           # まとめ
    ]

    # CSVファイルに新しい行を追加
    try:
        existing_rows.append(new_row)
        
        with open(csv_file, 'w', encoding='utf-8', newline='') as f:
            writer = csv.writer(f)
            writer.writerows(existing_rows)
        
        print(f"✅ CSVファイルに新しい行を追加: No.{new_no}")
        print(f"   業界: {metadata.get('industry', '')}")
        print(f"   業種: {metadata.get('job_type', '')}")
        return True
        
    except Exception as e:
        print(f"❌ エラー: CSVファイルの更新に失敗: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("使用方法: python3 update-csv.py メタデータ.json")
        sys.exit(1)
    
    metadata_file = sys.argv[1]
    success = update_csv(metadata_file)
    
    if success:
        print("🎉 CSVファイルの更新が完了しました!")
        sys.exit(0)
    else:
        print("❌ CSVファイルの更新に失敗しました")
        sys.exit(1)