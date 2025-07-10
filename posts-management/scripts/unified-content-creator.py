#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
統合コンテンツ作成ツール
SNS/note/HP記事を統一形式で作成・管理
"""

import csv
import os
import json
import random
from datetime import datetime, timedelta
import pandas as pd

class UnifiedContentCreator:
    def __init__(self):
        self.base_dir = "/Users/m/Downloads/Develop/digitool-lab.com/posts-management"
        self.csv_path = "/Users/m/Downloads/Develop/digitool-lab.com/業務効率化サポート事例 - 活用サポート事例.csv"
        self.master_csv = os.path.join(self.base_dir, "master-control.csv")
        
        # コンテンツディレクトリ
        self.sns_dir = os.path.join(self.base_dir, "content-queue", "sns")
        self.note_dir = os.path.join(self.base_dir, "content-queue", "note")
        self.hp_dir = os.path.join(self.base_dir, "content-queue", "hp-articles")
        
        # ディレクトリ作成
        for dir_path in [self.sns_dir, self.note_dir, self.hp_dir]:
            os.makedirs(dir_path, exist_ok=True)
    
    def load_csv_cases(self):
        """CSVから事例データを読み込み"""
        cases = []
        
        with open(self.csv_path, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            headers = next(reader)
            
            for row in reader:
                if len(row) < 33:
                    continue
                    
                if row[32] and '事例のみ' in row[32]:
                    case = {
                        'id': row[0],
                        'industry': row[1],
                        'sub_industry': row[2],
                        'job_type': row[3],
                        'company_size': row[4],
                        'region': row[5],
                        'title': row[6],
                        'overview': row[8],
                        'problems': row[10],
                        'solution': row[14],
                        'results': row[19],
                        'status': row[32]
                    }
                    cases.append(case)
        
        return cases
    
    def get_next_content_id(self, content_type):
        """次のコンテンツIDを生成"""
        try:
            df = pd.read_csv(self.master_csv)
            
            # コンテンツタイプ別の最大番号を取得
            prefix_map = {'SNS': 'S', 'note': 'N', 'HP記事': 'H'}
            prefix = prefix_map[content_type]
            
            existing_ids = df[df['コンテンツタイプ'] == content_type]['コンテンツID'].tolist()
            
            if not existing_ids:
                return f"{prefix}001"
            
            # 番号部分を抽出して最大値を取得
            numbers = []
            for content_id in existing_ids:
                try:
                    number = int(content_id[1:])  # S001 -> 001 -> 1
                    numbers.append(number)
                except:
                    continue
            
            next_number = max(numbers) + 1 if numbers else 1
            return f"{prefix}{next_number:03d}"
            
        except:
            # ファイルが存在しない場合
            prefix_map = {'SNS': 'S', 'note': 'N', 'HP記事': 'H'}
            return f"{prefix_map[content_type]}001"
    
    def add_to_master_csv(self, content_data):
        """マスターCSVに新規行を追加"""
        try:
            # 既存データを読み込み
            if os.path.exists(self.master_csv):
                df = pd.read_csv(self.master_csv)
            else:
                # 新規作成
                columns = [
                    'コンテンツID', 'コンテンツタイプ', '元事例ID', 'タイトル', '対象プラットフォーム',
                    'ステータス', '業界', '作成日時', '承認日時', '投稿日時',
                    'LinkedIn投稿URL', 'Facebook投稿URL', 'note記事URL', 'HP記事URL',
                    'エンゲージメント合計', '備考'
                ]
                df = pd.DataFrame(columns=columns)
            
            # 新規行を追加
            new_row = pd.DataFrame([content_data])
            df = pd.concat([df, new_row], ignore_index=True)
            
            # 保存
            df.to_csv(self.master_csv, index=False, encoding='utf-8')
            print(f"✅ マスターCSV更新完了: {content_data['コンテンツID']}")
            
        except Exception as e:
            print(f"❌ マスターCSV更新エラー: {e}")
    
    def create_sns_content(self, case):
        """SNS投稿コンテンツ作成（LinkedIn+Facebook共通）"""
        content_id = self.get_next_content_id('SNS')
        
        # 業界別ハッシュタグ
        industry_hashtags = {
            '製造業': ['#製造業DX', '#品質管理', '#生産性向上'],
            '小売業': ['#小売業DX', '#顧客管理', '#売上向上'], 
            'サービス業': ['#サービス業DX', '#顧客満足度', '#業務自動化'],
            '美容・エステ': ['#美容業DX', '#顧客管理', '#リピート率'],
            '飲食業': ['#飲食業DX', '#顧客管理', '#売上向上'],
            '医療・介護': ['#医療DX', '#介護DX', '#業務効率化'],
            '不動産': ['#不動産DX', '#業務自動化', '#顧客管理'],
            '建設業': ['#建設業DX', '#業務効率化', '#安全管理']
        }
        
        hashtags = ['#中小企業DX', '#業務効率化', '#DX支援']
        if case['industry'] in industry_hashtags:
            hashtags.extend(industry_hashtags[case['industry']])
        
        hashtags = list(set(hashtags))[:6]
        
        # SNS投稿コンテンツ
        sns_content = f"""【{case['industry']}のDX成功事例】

❌ 課題
{case['problems']}

✅ 解決策  
{case['solution']}

📈 結果
{case['results']}

💡 学び
{case['industry']}でのDX化は、まず現場の課題を正確に把握することが重要です。
小さな改善の積み重ねが、大きな成果につながります。

同じような課題でお悩みの方はお気軽にDMください 👋

{' '.join(hashtags)}"""

        # Markdownファイル作成
        markdown_content = f"""# {content_id} - {case['title']}

## 📋 メタデータ
- **コンテンツID**: {content_id}
- **元事例ID**: {case['id']}
- **業界**: {case['industry']}
- **職種**: {case['job_type']}
- **プラットフォーム**: LinkedIn+Facebook
- **文字数**: {len(sns_content)}文字
- **作成日時**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## 🏷️ ハッシュタグ
{' '.join(hashtags)}

## 📝 投稿コンテンツ

{sns_content}

## 📊 投稿結果
- **LinkedIn URL**: 
- **Facebook URL**: 
- **合計エンゲージメント**: 
- **備考**: 

## 📈 効果測定
- **LinkedIn いいね**: 
- **LinkedIn コメント**: 
- **LinkedIn シェア**: 
- **Facebook いいね**: 
- **Facebook コメント**: 
- **Facebook シェア**: 
"""

        # ファイル保存
        filename = f"{content_id}_draft.md"
        filepath = os.path.join(self.sns_dir, filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(markdown_content)
        
        # マスターCSVに追加
        master_data = {
            'コンテンツID': content_id,
            'コンテンツタイプ': 'SNS',
            '元事例ID': case['id'],
            'タイトル': case['title'],
            '対象プラットフォーム': 'LinkedIn+Facebook',
            'ステータス': 'draft',
            '業界': case['industry'],
            '作成日時': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            '承認日時': '',
            '投稿日時': '',
            'LinkedIn投稿URL': '',
            'Facebook投稿URL': '',
            'note記事URL': '',
            'HP記事URL': '',
            'エンゲージメント合計': '',
            '備考': f'SNS投稿（{len(sns_content)}文字）'
        }
        
        self.add_to_master_csv(master_data)
        
        print(f"✅ SNS投稿コンテンツ作成完了: {filepath}")
        return filepath
    
    def create_note_content(self, industry, case_count=10):
        """note業界別まとめ記事作成"""
        content_id = self.get_next_content_id('note')
        
        # 指定業界の事例を取得
        all_cases = self.load_csv_cases()
        industry_cases = [case for case in all_cases if case['industry'] == industry]
        
        if len(industry_cases) < case_count:
            print(f"⚠️ {industry}の事例が{case_count}件に満たません（{len(industry_cases)}件）")
            case_count = len(industry_cases)
        
        selected_cases = random.sample(industry_cases, min(case_count, len(industry_cases)))
        
        # note記事コンテンツ生成
        note_content = f"""# {industry}のデジタル変革：成功事例{case_count}選から学ぶDX実践法

## はじめに

{industry}におけるデジタル変革（DX）は、業務効率化と競争力向上の重要な要素となっています。
本記事では、実際に{industry}で成功したDX導入事例{case_count}選をご紹介し、その共通点や成功要因を分析します。

"""

        # 各事例を追加
        for i, case in enumerate(selected_cases, 1):
            note_content += f"""## 事例{i}: {case['title']}

### 課題
{case['problems']}

### 解決策
{case['solution']}

### 成果
{case['results']}

### ポイント
{case['job_type']}での実践例として、特に{case['industry']}業界での応用可能性が高い事例です。

---

"""

        # まとめ追加
        note_content += f"""## {industry}DX成功の共通点

今回ご紹介した{case_count}の事例から見えてくる{industry}DX成功の共通点：

1. **現場課題の正確な把握**: 導入前の課題分析が徹底されている
2. **段階的な導入**: 小さく始めて徐々に拡大
3. **従業員の巻き込み**: 現場の声を重視した導入プロセス
4. **継続的な改善**: 導入後も定期的な見直しと改善

## おわりに

{industry}でのDX推進は、業界特有の課題に対応したソリューション選択が重要です。
今回の事例を参考に、自社に最適なDX戦略を検討してみてください。

---

**デジタルツール研究所では、{industry}を含む様々な業界のDX支援を行っています。**
**お気軽にご相談ください。**

#中小企業DX #{industry}DX #業務効率化 #DX事例
"""

        # Markdownファイル作成
        markdown_content = f"""# {content_id} - {industry}DX成功事例{case_count}選

## 📋 メタデータ
- **コンテンツID**: {content_id}
- **業界**: {industry}
- **事例数**: {case_count}件
- **プラットフォーム**: note
- **文字数**: {len(note_content)}文字
- **作成日時**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
- **元事例ID**: {', '.join([case['id'] for case in selected_cases])}

## 📝 記事コンテンツ

{note_content}

## 📊 投稿結果
- **note URL**: 
- **PV数**: 
- **スキ数**: 
- **コメント数**: 
- **フォロワー獲得数**: 

## 📈 使用事例一覧
"""
        
        # 使用事例の詳細を追加
        for case in selected_cases:
            markdown_content += f"- {case['id']}: {case['title']} ({case['job_type']})\n"

        # ファイル保存
        filename = f"{content_id}_{industry}まとめ_draft.md"
        filepath = os.path.join(self.note_dir, filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(markdown_content)
        
        # マスターCSVに追加
        master_data = {
            'コンテンツID': content_id,
            'コンテンツタイプ': 'note',
            '元事例ID': ','.join([case['id'] for case in selected_cases]),
            'タイトル': f'{industry}DX成功事例{case_count}選',
            '対象プラットフォーム': 'note',
            'ステータス': 'draft',
            '業界': industry,
            '作成日時': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            '承認日時': '',
            '投稿日時': '',
            'LinkedIn投稿URL': '',
            'Facebook投稿URL': '',
            'note記事URL': '',
            'HP記事URL': '',
            'エンゲージメント合計': '',
            '備考': f'{industry}業界{case_count}事例まとめ（{len(note_content)}文字）'
        }
        
        self.add_to_master_csv(master_data)
        
        print(f"✅ note記事作成完了: {filepath}")
        return filepath
    
    def create_hp_article(self, case):
        """HP記事（詳細記事）作成"""
        content_id = self.get_next_content_id('HP記事')
        
        # HP記事コンテンツ生成
        hp_content = f"""# {case['title']}

## 企業概要

{case['industry']}業界における{case['job_type']}の効率化事例をご紹介します。
企業規模: {case.get('company_size', '中小企業')}
地域: {case.get('region', '全国')}

## 導入前の課題

### 具体的な問題点
{case['problems']}

### 課題の影響
業務効率の低下、コスト増加、従業員の負担増加など、様々な問題が発生していました。

## 導入したソリューション

### システム概要
{case['solution']}

### 導入プロセス
1. **現状分析** (1-2週間)
   - 既存業務フローの詳細調査
   - 課題の定量化
   - 改善目標の設定

2. **システム設計** (2-3週間)
   - 要件定義
   - システム構成設計
   - テスト計画策定

3. **導入・テスト** (2-4週間)
   - システム構築
   - 動作テスト
   - ユーザートレーニング

4. **本格運用開始**
   - 段階的な運用開始
   - 継続的なモニタリング
   - 必要に応じた調整

## 導入成果

### 定量的効果
{case['results']}

### 定性的効果
- 業務負担の軽減
- 作業精度の向上
- 従業員満足度の向上
- 顧客満足度の向上

## 導入時の課題と対応

### 主な課題
- 従業員の新システムへの適応
- 既存業務フローとの整合
- データ移行作業

### 対応策
- 段階的な導入による負担軽減
- 十分なトレーニング期間の確保
- 継続的なサポート体制構築

## 今後の展開

### 追加改善計画
- システムの機能拡張
- 他部門への展開
- さらなる自動化の推進

### 期待される効果
- より大幅な効率化
- 競争力のさらなる向上
- 従業員の創造的業務への集中

## 同様の課題をお持ちの企業様へ

{case['industry']}業界での類似課題解決について、お気軽にご相談ください。
当社では、企業規模や業務内容に応じたカスタマイズ対応が可能です。

### サポート内容
- 現状分析・課題整理
- 最適ソリューションの提案
- 導入サポート
- 運用開始後のフォロー

## まとめ

{case['title']}の導入により、{case['industry']}における{case['job_type']}の大幅な効率化を実現しました。
適切な課題分析と段階的な導入により、従業員の負担を最小限に抑えながら大きな成果を得ることができました。

**お問い合わせ・ご相談はこちらから**
[お問い合わせフォーム](https://digitool-lab.com/contact)
"""

        # Markdownファイル作成
        markdown_content = f"""# {content_id} - {case['title']}

## 📋 メタデータ
- **コンテンツID**: {content_id}
- **元事例ID**: {case['id']}
- **業界**: {case['industry']}
- **職種**: {case['job_type']}
- **プラットフォーム**: HP
- **文字数**: {len(hp_content)}文字
- **作成日時**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## 📝 記事コンテンツ

{hp_content}

## 📊 記事結果
- **HP URL**: 
- **PV数**: 
- **滞在時間**: 
- **CV数**: 
- **問い合わせ数**: 

## 📈 SEO情報
- **ターゲットキーワード**: {case['industry']}DX, {case['job_type']}, 業務効率化
- **メタディスクリプション**: {case['industry']}における{case['job_type']}のDX導入事例。{case['title']}の詳細な導入プロセスと成果をご紹介。
"""

        # ファイル保存
        filename = f"{content_id}_{case['title'][:20]}_draft.md"
        filepath = os.path.join(self.hp_dir, filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(markdown_content)
        
        # マスターCSVに追加
        master_data = {
            'コンテンツID': content_id,
            'コンテンツタイプ': 'HP記事',
            '元事例ID': case['id'],
            'タイトル': case['title'],
            '対象プラットフォーム': 'HP',
            'ステータス': 'draft',
            '業界': case['industry'],
            '作成日時': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            '承認日時': '',
            '投稿日時': '',
            'LinkedIn投稿URL': '',
            'Facebook投稿URL': '',
            'note記事URL': '',
            'HP記事URL': '',
            'エンゲージメント合計': '',
            '備考': f'HP詳細記事（{len(hp_content)}文字）'
        }
        
        self.add_to_master_csv(master_data)
        
        print(f"✅ HP記事作成完了: {filepath}")
        return filepath
    
    def interactive_menu(self):
        """対話式メニュー"""
        print("=== 統合コンテンツ作成ツール ===")
        
        while True:
            print("\\n📋 作成メニュー:")
            print("1. SNS投稿作成（LinkedIn+Facebook）")
            print("2. note記事作成（業界別まとめ）")
            print("3. HP記事作成（詳細記事）")
            print("4. 終了")
            
            choice = input("\\n選択してください (1-4): ")
            
            if choice == '1':
                self.create_sns_interactive()
            elif choice == '2':
                self.create_note_interactive()
            elif choice == '3':
                self.create_hp_interactive()
            elif choice == '4':
                print("👋 終了しました")
                break
            else:
                print("❌ 無効な選択です")
    
    def create_sns_interactive(self):
        """SNS投稿対話式作成"""
        cases = self.load_csv_cases()
        case = random.choice(cases)
        
        print(f"\\n📋 選択された事例:")
        print(f"ID: {case['id']}")
        print(f"業界: {case['industry']}")
        print(f"職種: {case['job_type']}")
        print(f"タイトル: {case['title']}")
        print(f"課題: {case['problems'][:100]}...")
        
        confirm = input(f"\\nこの事例でSNS投稿を作成しますか？ (y/n): ").lower()
        if confirm == 'y':
            self.create_sns_content(case)
        else:
            print("❌ 作成をキャンセルしました")
    
    def create_note_interactive(self):
        """note記事対話式作成"""
        industries = ['製造業', '小売業', 'サービス業', '美容・エステ', '飲食業', '医療・介護', '不動産', '建設業']
        
        print("\\n🏭 業界選択:")
        for i, industry in enumerate(industries, 1):
            print(f"{i}. {industry}")
        
        try:
            choice = int(input("\\n業界を選択してください (1-8): "))
            if 1 <= choice <= len(industries):
                industry = industries[choice - 1]
                case_count = int(input(f"事例数を入力してください (デフォルト: 10): ") or 10)
                self.create_note_content(industry, case_count)
            else:
                print("❌ 無効な選択です")
        except ValueError:
            print("❌ 数値を入力してください")
    
    def create_hp_interactive(self):
        """HP記事対話式作成"""
        cases = self.load_csv_cases()
        case = random.choice(cases)
        
        print(f"\\n📋 選択された事例:")
        print(f"ID: {case['id']}")
        print(f"業界: {case['industry']}")
        print(f"職種: {case['job_type']}")
        print(f"タイトル: {case['title']}")
        print(f"概要: {case['overview'][:100]}...")
        
        confirm = input(f"\\nこの事例でHP記事を作成しますか？ (y/n): ").lower()
        if confirm == 'y':
            self.create_hp_article(case)
        else:
            print("❌ 作成をキャンセルしました")

def main():
    creator = UnifiedContentCreator()
    
    try:
        creator.interactive_menu()
    except KeyboardInterrupt:
        print("\\n\\n終了しました。")
    except Exception as e:
        print(f"\\nエラーが発生しました: {e}")

if __name__ == "__main__":
    main()