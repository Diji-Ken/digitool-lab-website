#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SNS投稿管理ツール
CSVマスターファイルベースでの投稿管理システム
"""

import csv
import os
import json
import requests
import pandas as pd
import sys
import argparse
import re

class PostManager:
    def __init__(self, base_dir, linkedin_token, linkedin_person_urn):
        self.base_dir = base_dir
        self.csv_path = os.path.join(self.base_dir, "posts-master.csv")
        self.contents_dir = os.path.join(self.base_dir, "contents")
        
        if not linkedin_token or not linkedin_person_urn:
            raise ValueError("❌ LinkedInの認証情報（トークンまたはPerson URN）が設定されていません。")

        self.linkedin_token = linkedin_token
        self.linkedin_person_urn = linkedin_person_urn
        
        os.makedirs(self.contents_dir, exist_ok=True)
    
    def load_posts_csv(self):
        """投稿マスターCSVを読み込み"""
        try:
            return pd.read_csv(self.csv_path, encoding='utf-8')
        except FileNotFoundError:
            print(f"❌ CSVファイルが見つかりません: {self.csv_path}")
            return pd.DataFrame()
        except Exception as e:
            print(f"❌ CSV読み込みエラー: {e}")
            return pd.DataFrame()
    
    def save_posts_csv(self, df):
        """投稿マスターCSVを保存"""
        try:
            df.to_csv(self.csv_path, index=False, encoding='utf-8')
            print(f"✅ CSV保存完了: {self.csv_path}")
        except Exception as e:
            print(f"❌ CSV保存エラー: {e}")
    
    def load_content_from_markdown(self, filename):
        """Markdownファイルから投稿コンテンツを読み込む（ファイル全体）"""
        filepath = os.path.join(self.contents_dir, filename)
        
        if not os.path.exists(filepath):
            print(f"❌ コンテンツファイルが見つかりません: {filepath}")
            return None
        
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                return f.read().strip()
        except Exception as e:
            print(f"❌ Markdownファイル読み込みエラー: {e}")
            return None
    
    def post_to_linkedin(self, content):
        """LinkedInに投稿"""
        url = "https://api.linkedin.com/v2/ugcPosts"
        
        headers = {
            "Authorization": f"Bearer {self.linkedin_token}",
            "Content-Type": "application/json",
            "X-Restli-Protocol-Version": "2.0.0"
        }
        
        payload = {
            "author": self.linkedin_person_urn,
            "lifecycleState": "PUBLISHED",
            "specificContent": {
                "com.linkedin.ugc.ShareContent": {
                    "shareCommentary": {
                        "text": content
                    },
                    "shareMediaCategory": "NONE"
                }
            },
            "visibility": {
                "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
            }
        }
        
        try:
            response = requests.post(url, headers=headers, json=payload)
            response.raise_for_status()
            
            result = response.json()
            post_id_urn = result.get("id", "")
            post_url = f"https://www.linkedin.com/feed/update/{post_id_urn}/" if post_id_urn else ""
            
            return {
                "success": True,
                "post_id": post_id_urn,
                "post_url": post_url,
                "response": result
            }
            
        except requests.exceptions.RequestException as e:
            return {
                "success": False,
                "error": str(e),
                "status_code": getattr(e.response, 'status_code', None)
            }
    
    def update_post_status(self, post_id, updates):
        """投稿ステータスを更新"""
        df = self.load_posts_csv()
        
        if df.empty:
            print("❌ CSVデータが空です")
            return False
        
        # Ensure the column type is object to avoid dtype issues with NaNs
        if '投稿日時' in df.columns:
            df['投稿日時'] = df['投稿日時'].astype(object)

        mask = df['投稿ID'] == post_id
        
        if not mask.any():
            print(f"❌ 投稿ID {post_id} が見つかりません")
            return False
        
        for column, value in updates.items():
            if column in df.columns:
                df.loc[mask, column] = value
        
        df.loc[mask, '投稿日時'] = pd.to_datetime('now').strftime('%Y-%m-%d %H:%M:%S')

        self.save_posts_csv(df)
        return True

    def post_by_id(self, post_id):
        """指定されたIDの投稿を実行"""
        df = self.load_posts_csv()
        if df.empty:
            return False

        target_post = df[df['投稿ID'] == post_id]

        if target_post.empty:
            print(f"❌ 投稿ID '{post_id}' がCSV内に見つかりません。")
            return False

        post_data = target_post.iloc[0]
        status = post_data.get('ステータス')
        platform = post_data.get('プラットフォーム')
        content_file = post_data.get('コンテンツファイル')

        print(f"\n▶️ 投稿処理を開始します: {post_id} ({post_data['投稿タイトル']})")

        if status != 'ready':
            print(f"⚠️ 投稿ID '{post_id}' のステータスが 'ready' ではありません（現在: {status}）。処理をスキップします。")
            return False
            
        if not content_file or pd.isna(content_file):
            print(f"❌ 投稿ID '{post_id}' にコンテンツファイルが紐付いていません。")
            return False

        content = self.load_content_from_markdown(content_file)
        if not content:
            print(f"❌ コンテンツ '{content_file}' の読み込みに失敗しました。")
            return False
            
        # ラベル除去と改行の正規化
        # 「【任意の文字列】」や「**【任意の文字列】**」のようなラベルを除去
        # `\\n` を `\n` に変換して、APIが正しく改行を認識できるようにする
        cleaned_content = re.sub(r'(\*\*|)【.*?】(\*\*|)\s*', '', content)
        cleaned_content = cleaned_content.replace('\\n', '\n').strip()

        print(f"📄 プラットフォーム '{platform}' への投稿を実行します...")

        if platform.lower() == 'linkedin':
            result = self.post_to_linkedin(cleaned_content)
        else:
            print(f"❌ 未対応のプラットフォームです: {platform}")
            return False

        if result['success']:
            print(f"✅ {platform}への投稿成功！")
            print(f"   - 投稿URL: {result['post_url']}")
            updates = {
                'ステータス': 'posted',
                '投稿URL': result['post_url']
            }
            self.update_post_status(post_id, updates)
            print(f"✅ CSVのステータスを 'posted' に更新しました。")
            return True
        else:
            print(f"❌ {platform}への投稿失敗: {result.get('error', '不明なエラー')}")
            updates = {
                'ステータス': 'error',
                '備考': f"投稿エラー: {result.get('error', '不明なエラー')}"
            }
            self.update_post_status(post_id, updates)
            print(f"❌ CSVのステータスを 'error' に更新しました。")
            return False

    def preview_by_id(self, post_id):
        """指定されたIDの投稿内容をプレビュー"""
        df = self.load_posts_csv()
        if df.empty:
            return False

        target_post = df[df['投稿ID'] == post_id]

        if target_post.empty:
            print(f"❌ 投稿ID '{post_id}' がCSV内に見つかりません。")
            return False

        post_data = target_post.iloc[0]
        content_file = post_data.get('コンテンツファイル')

        if not content_file or pd.isna(content_file):
            print(f"❌ 投稿ID '{post_id}' にコンテンツファイルが紐付いていません。")
            return False

        content = self.load_content_from_markdown(content_file)
        if not content:
            print(f"❌ コンテンツ '{content_file}' の読み込みに失敗しました。")
            return False
        
        # ラベル除去と改行の正規化
        # 「【任意の文字列】」や「**【任意の文字列】**」のようなラベルを除去
        # `\\n` を `\n` に変換して、APIが正しく改行を認識できるようにする
        cleaned_content = re.sub(r'(\*\*|)【.*?】(\*\*|)\s*', '', content)
        cleaned_content = cleaned_content.replace('\\n', '\n').strip()

        print("--- DRY RUN PREVIEW ---")
        print(f"Post ID: {post_id}")
        print(f"Title: {post_data.get('投稿タイトル', 'N/A')}")
        print("--- CONTENT (Processed) ---")
        print(cleaned_content)
        print("---------------------------------")
        return True

if __name__ == "__main__":
    # このスクリプトは posts-management/scripts/ の中にあることを前提とする
    # 基準となるディレクトリは posts-management/
    script_dir = os.path.dirname(os.path.abspath(__file__))
    posts_management_dir = os.path.abspath(os.path.join(script_dir, '..'))

    linkedin_token = os.environ.get("LINKEDIN_ACCESS_TOKEN")
    linkedin_person_urn = os.environ.get("LINKEDIN_PERSON_URN")

    parser = argparse.ArgumentParser(description='SNS投稿管理ツール')
    parser.add_argument('post_id', type=str, help='投稿を実行する投稿ID (例: P001)')
    parser.add_argument('--dry-run', action='store_true', help='投稿せずに内容をプレビュー表示')
    args = parser.parse_args()

    try:
        manager = PostManager(
            base_dir=posts_management_dir,
            linkedin_token=linkedin_token,
            linkedin_person_urn=linkedin_person_urn
        )
        
        if args.dry_run:
            print("💧 ドライランモードで実行します。")
            success = manager.preview_by_id(args.post_id)
        else:
            success = manager.post_by_id(args.post_id)
        
        if not success:
            sys.exit(1)

    except ValueError as e:
        print(e)
        sys.exit(1)
    except Exception as e:
        print(f"❌ 予期せぬエラーが発生しました: {e}")
        sys.exit(1)