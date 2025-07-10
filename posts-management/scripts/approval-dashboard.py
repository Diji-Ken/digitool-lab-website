#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
承認ダッシュボード
draft状態のコンテンツを確認・承認・編集
"""

import csv
import os
import pandas as pd
from datetime import datetime

class ApprovalDashboard:
    def __init__(self):
        self.base_dir = "/Users/m/Downloads/Develop/digitool-lab.com/posts-management"
        self.master_csv = os.path.join(self.base_dir, "master-control.csv")
        self.sns_dir = os.path.join(self.base_dir, "content-queue", "sns")
        self.note_dir = os.path.join(self.base_dir, "content-queue", "note")
        self.hp_dir = os.path.join(self.base_dir, "content-queue", "hp-articles")
    
    def load_master_csv(self):
        """マスターCSVを読み込み"""
        try:
            return pd.read_csv(self.master_csv, encoding='utf-8')
        except FileNotFoundError:
            print(f"❌ マスターCSVが見つかりません: {self.master_csv}")
            return pd.DataFrame()
        except Exception as e:
            print(f"❌ CSV読み込みエラー: {e}")
            return pd.DataFrame()
    
    def save_master_csv(self, df):
        """マスターCSVを保存"""
        try:
            df.to_csv(self.master_csv, index=False, encoding='utf-8')
            print(f"✅ マスターCSV更新完了")
        except Exception as e:
            print(f"❌ CSV保存エラー: {e}")
    
    def get_content_file_path(self, content_id, content_type):
        """コンテンツファイルパスを取得"""
        type_dir_map = {
            'SNS': self.sns_dir,
            'note': self.note_dir,
            'HP記事': self.hp_dir
        }
        
        target_dir = type_dir_map.get(content_type)
        if not target_dir:
            return None
        
        # ディレクトリ内のファイルを検索
        for filename in os.listdir(target_dir):
            if filename.startswith(content_id) and filename.endswith('.md'):
                return os.path.join(target_dir, filename)
        
        return None
    
    def load_content_from_file(self, filepath):
        """Markdownファイルからコンテンツを読み込み"""
        if not filepath or not os.path.exists(filepath):
            return None
        
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            return content
        except Exception as e:
            print(f"❌ ファイル読み込みエラー: {e}")
            return None
    
    def extract_post_content(self, markdown_content):
        """Markdownから投稿コンテンツ部分を抽出"""
        if not markdown_content:
            return ""
        
        lines = content.split('\\n')
        content_start = False
        content_lines = []
        
        for line in lines:
            if '## 📝' in line and ('投稿コンテンツ' in line or '記事コンテンツ' in line):
                content_start = True
                continue
            elif line.strip().startswith('## ') and content_start:
                break
            elif content_start and line.strip():
                content_lines.append(line)
        
        return '\\n'.join(content_lines).strip()
    
    def list_draft_content(self):
        """draft状態のコンテンツ一覧を表示"""
        df = self.load_master_csv()
        
        if df.empty:
            print("📂 マスターデータがありません")
            return []
        
        draft_content = df[df['ステータス'] == 'draft'].copy()
        
        if draft_content.empty:
            print("📝 承認待ちのコンテンツがありません")
            return []
        
        print(f"\\n📋 承認待ちコンテンツ ({len(draft_content)}件)")
        print("=" * 80)
        
        for i, (_, row) in enumerate(draft_content.iterrows(), 1):
            content_type_emoji = {
                'SNS': '📱',
                'note': '📝', 
                'HP記事': '🏠'
            }.get(row['コンテンツタイプ'], '❓')
            
            print(f"{i}. {content_type_emoji} {row['コンテンツID']} | {row['コンテンツタイプ']} | {row['業界']}")
            print(f"   タイトル: {row['タイトル']}")
            print(f"   作成日時: {row['作成日時']}")
            print(f"   備考: {row['備考']}")
            print()
        
        return draft_content.to_dict('records')
    
    def preview_content(self, content_data):
        """コンテンツの詳細プレビュー"""
        content_id = content_data['コンテンツID']
        content_type = content_data['コンテンツタイプ']
        
        print(f"\\n📄 コンテンツプレビュー: {content_id}")
        print("=" * 60)
        print(f"タイプ: {content_type}")
        print(f"タイトル: {content_data['タイトル']}")
        print(f"業界: {content_data['業界']}")
        print(f"プラットフォーム: {content_data['対象プラットフォーム']}")
        print(f"作成日時: {content_data['作成日時']}")
        print()
        
        # ファイルからコンテンツを読み込み
        filepath = self.get_content_file_path(content_id, content_type)
        if filepath:
            markdown_content = self.load_content_from_file(filepath)
            if markdown_content:
                # 投稿コンテンツ部分を抽出
                post_content = self.extract_post_content(markdown_content)
                
                print("📝 投稿内容:")
                print("-" * 40)
                if len(post_content) > 500:
                    print(post_content[:500] + "\\n\\n[... 続きあり ...]")
                else:
                    print(post_content)
                print("-" * 40)
                print(f"文字数: {len(post_content)}文字")
            else:
                print("❌ コンテンツの読み込みに失敗しました")
        else:
            print("❌ コンテンツファイルが見つかりません")
    
    def edit_content(self, content_data):
        """コンテンツの編集"""
        content_id = content_data['コンテンツID']
        content_type = content_data['コンテンツタイプ']
        
        filepath = self.get_content_file_path(content_id, content_type)
        if not filepath:
            print("❌ コンテンツファイルが見つかりません")
            return False
        
        print(f"\\n✏️ コンテンツ編集: {content_id}")
        print("編集方法を選択してください:")
        print("1. タイトル変更")
        print("2. 業界変更") 
        print("3. 備考追加")
        print("4. ファイルを直接開く")
        print("5. キャンセル")
        
        choice = input("\\n選択 (1-5): ")
        
        if choice == '1':
            new_title = input("新しいタイトル: ")
            if new_title:
                self.update_master_field(content_id, 'タイトル', new_title)
                print(f"✅ タイトルを更新しました: {new_title}")
        
        elif choice == '2':
            new_industry = input("新しい業界: ")
            if new_industry:
                self.update_master_field(content_id, '業界', new_industry)
                print(f"✅ 業界を更新しました: {new_industry}")
        
        elif choice == '3':
            current_note = content_data.get('備考', '')
            print(f"現在の備考: {current_note}")
            additional_note = input("追加する備考: ")
            if additional_note:
                new_note = f"{current_note} | {additional_note}" if current_note else additional_note
                self.update_master_field(content_id, '備考', new_note)
                print(f"✅ 備考を更新しました")
        
        elif choice == '4':
            print(f"📁 ファイルパス: {filepath}")
            print("ファイルを直接編集してください。編集後、Enterキーを押してください。")
            input("編集完了後、Enterキーを押してください...")
            print("✅ ファイル編集を確認しました")
        
        elif choice == '5':
            print("❌ 編集をキャンセルしました")
            return False
        
        else:
            print("❌ 無効な選択です")
            return False
        
        return True
    
    def update_master_field(self, content_id, field, value):
        """マスターCSVの特定フィールドを更新"""
        df = self.load_master_csv()
        
        if df.empty:
            return False
        
        mask = df['コンテンツID'] == content_id
        if mask.any():
            df.loc[mask, field] = value
            self.save_master_csv(df)
            return True
        
        return False
    
    def approve_content(self, content_data):
        """コンテンツを承認"""
        content_id = content_data['コンテンツID']
        
        print(f"\\n✅ コンテンツ承認: {content_id}")
        
        # 投稿スケジュール設定
        print("投稿スケジュールを設定しますか？")
        print("1. 即座に投稿準備完了にする")
        print("2. 特定日時を指定")
        print("3. キャンセル")
        
        schedule_choice = input("選択 (1-3): ")
        
        if schedule_choice == '1':
            # 即座にready状態にする
            updates = {
                'ステータス': 'ready',
                '承認日時': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }
            
        elif schedule_choice == '2':
            # 特定日時指定
            scheduled_date = input("投稿予定日 (YYYY-MM-DD): ")
            if scheduled_date:
                updates = {
                    'ステータス': 'ready',
                    '承認日時': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                }
            else:
                print("❌ 日付が無効です")
                return False
        
        elif schedule_choice == '3':
            print("❌ 承認をキャンセルしました")
            return False
        
        else:
            print("❌ 無効な選択です")
            return False
        
        # マスターCSVを更新
        df = self.load_master_csv()
        mask = df['コンテンツID'] == content_id
        
        if mask.any():
            for field, value in updates.items():
                df.loc[mask, field] = value
            
            self.save_master_csv(df)
            
            # ファイル名も更新 (draft → ready)
            self.rename_content_file(content_data, 'draft', 'ready')
            
            print(f"✅ {content_id} を承認しました")
            return True
        
        return False
    
    def rename_content_file(self, content_data, old_status, new_status):
        """コンテンツファイル名を更新"""
        content_id = content_data['コンテンツID']
        content_type = content_data['コンテンツタイプ']
        
        filepath = self.get_content_file_path(content_id, content_type)
        if not filepath:
            return False
        
        try:
            new_filepath = filepath.replace(f'_{old_status}.md', f'_{new_status}.md')
            os.rename(filepath, new_filepath)
            print(f"✅ ファイル名更新: {os.path.basename(new_filepath)}")
            return True
        except Exception as e:
            print(f"⚠️ ファイル名更新エラー: {e}")
            return False
    
    def bulk_approve(self, content_list):
        """一括承認"""
        print(f"\\n📦 一括承認: {len(content_list)}件")
        
        confirm = input(f"{len(content_list)}件のコンテンツを一括承認しますか？ (y/n): ").lower()
        if confirm != 'y':
            print("❌ 一括承認をキャンセルしました")
            return
        
        approved_count = 0
        for content_data in content_list:
            content_id = content_data['コンテンツID']
            
            # 自動的にready状態にする
            updates = {
                'ステータス': 'ready',
                '承認日時': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }
            
            df = self.load_master_csv()
            mask = df['コンテンツID'] == content_id
            
            if mask.any():
                for field, value in updates.items():
                    df.loc[mask, field] = value
                
                self.save_master_csv(df)
                self.rename_content_file(content_data, 'draft', 'ready')
                
                approved_count += 1
                print(f"✅ {content_id} 承認完了")
        
        print(f"\\n🎉 一括承認完了: {approved_count}/{len(content_list)}件")
    
    def main_dashboard(self):
        """メインダッシュボード"""
        print("=== 承認ダッシュボード ===")
        
        while True:
            draft_list = self.list_draft_content()
            
            if not draft_list:
                print("\\n✅ 承認待ちのコンテンツはありません")
                break
            
            print("\\n📋 操作メニュー:")
            print("1. コンテンツ詳細確認")
            print("2. コンテンツ編集")
            print("3. コンテンツ承認")
            print("4. 一括承認")
            print("5. 更新・再読み込み")
            print("6. 終了")
            
            choice = input("\\n選択 (1-6): ")
            
            if choice == '1':
                try:
                    index = int(input(f"確認するコンテンツ番号 (1-{len(draft_list)}): ")) - 1
                    if 0 <= index < len(draft_list):
                        self.preview_content(draft_list[index])
                    else:
                        print("❌ 無効な番号です")
                except ValueError:
                    print("❌ 数値を入力してください")
            
            elif choice == '2':
                try:
                    index = int(input(f"編集するコンテンツ番号 (1-{len(draft_list)}): ")) - 1
                    if 0 <= index < len(draft_list):
                        self.edit_content(draft_list[index])
                    else:
                        print("❌ 無効な番号です")
                except ValueError:
                    print("❌ 数値を入力してください")
            
            elif choice == '3':
                try:
                    index = int(input(f"承認するコンテンツ番号 (1-{len(draft_list)}): ")) - 1
                    if 0 <= index < len(draft_list):
                        self.approve_content(draft_list[index])
                    else:
                        print("❌ 無効な番号です")
                except ValueError:
                    print("❌ 数値を入力してください")
            
            elif choice == '4':
                self.bulk_approve(draft_list)
            
            elif choice == '5':
                print("🔄 データを再読み込み中...")
                continue
            
            elif choice == '6':
                print("👋 ダッシュボードを終了しました")
                break
            
            else:
                print("❌ 無効な選択です")

def main():
    dashboard = ApprovalDashboard()
    
    try:
        dashboard.main_dashboard()
    except KeyboardInterrupt:
        print("\\n\\n終了しました。")
    except Exception as e:
        print(f"\\nエラーが発生しました: {e}")

if __name__ == "__main__":
    main()