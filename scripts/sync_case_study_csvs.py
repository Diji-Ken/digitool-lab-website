import pandas as pd
import os
import shutil

# --- 設定 ---
MASTER_CSV_PATH = '業務効率化サポート事例 - 活用サポート事例.csv'
OUTPUT_DIR = 'article-workspace/case_studies_data'
INDUSTRY_DIR = os.path.join(OUTPUT_DIR, '【業界別】')
JOB_TYPE_DIR = os.path.join(OUTPUT_DIR, '【職種別】')
TEMP_DIR = 'article-workspace/temp'

# 'industry-job-simple-list.md' に基づく職種の正規化マッピング
# このマッピングに従って、元の詳細な職種が、汎用的な職種カテゴリーに分類されます。
JOB_TYPE_MAPPING = {
    # 経営・管理職
    'マネージャー': '経営・管理職', 'オーナー': '経営・管理職', '経営者': '経営・管理職',
    '店長': '経営・管理職', '事務長': '経営・管理職', '院長': '経営・管理職',
    '施設長': '経営・管理職', '教室長': '経営・管理職', '教務主任': '経営・管理職',
    '副園長': '経営・管理職', '園長': '経営・管理職', '現場責任者': '経営・管理職',
    '生産管理者': '経営・管理職', '支配人': '経営・管理職', '女将': '経営・管理職',
    '農場主': '経営・管理職', '代表': '経営・管理職', '所長': '経営・管理職',
    '工場長': '経営・管理職', '店舗運営責任者': '経営・管理職', '店主': '経営・管理職',
    '責任者': '経営・管理職', '事業部長': '経営・管理職', '管理職': '経営・管理職',
    '部門責任者': '経営・管理職', 'チームリーダー': '経営・管理職', '社長': '経営・管理職',
    'エリアマネージャー': '経営・管理職', '支店長': '経営・管理職', '管理者': '経営・管理職',
    '看護師長': '経営・管理職',

    # 事務・バックオフィス
    '総務担当': '事務・バックオフィス', '事務担当': '事務・バックオフィス', '事務員': '事務・バックオフィス',
    '経理担当': '事務・バックオフィス', '一般事務': '事務・バックオフィス', '営業事務': '事務・バックオフィス',
    '庶務': '事務・バックオフィス', '会計担当': '事務・バックオフィス', '秘書': '事務・バックオフィス',
    'データ入力': '事務・バックオフィス', '経理事務': '事務・バックオフィス', '人事担当': '事務・バックオフィス',
    '医療事務担当': '事務・バックオフィス', '保育事務担当': '事務・バックオフィス', '介護事務担当': '事務・バックオフィス',

    # 営業・販売・接客
    '店舗スタッフ': '営業・販売・接客', '受付担当': '営業・販売・接客', 'サービス担当': '営業・販売・接客',
    '予約管理担当': '営業・販売・接客', '営業担当': '営業・販売・接客', '不動産営業': '営業・販売・接客',
    '相談員': '営業・販売・接客', '受付係': '営業・販売・接客', '接客スタッフ': '営業・販売・接客',
    'レジスタッフ': '営業・販売・接客', '販売員': '営業・販売・接客', '受付スタッフ': '営業・販売・接客',
    'カウンタースタッフ': '営業・販売・接客', '営業アシスタント': '営業・販売・接客',
    'フロントスタッフ': '営業・販売・接客', '販売責任者': '営業・販売・接客',
    '窓口業務': '営業・販売・接客', '接客責任者': '営業・販売・接客', '従業員': '営業・販売・接客',

    # マーケティング・Web担当
    'Web担当': 'マーケティング・Web担当', 'SNS担当': 'マーケティング・Web担当', 'マーケティング担当': 'マーケティング・Web担当',
    '広報担当': 'マーケティング・Web担当', '集客担 当': 'マーケティング・Web担当', '集客担当': 'マーケティング・Web担当',
    'デジタルマーケティング担当': 'マーケティング・Web担当', 'Webデザイナー': 'マーケティング・Web担当',
    '販促担当': 'マーケティング・Web担当', 'EC担当': 'マーケティング・Web担当', '広告担当': 'マーケティング・Web担当',
    'コンテンツ担当': 'マーケティング・Web担当', '宣 伝担当': 'マーケティング・Web担当', '宣伝担当': 'マーケティング・Web担当',

    # 現場管理・専門職
    '物件管理者': '現場管理・専門職', '工事管理者': '現場管理・専門職', '安全管理者': '現場管理・専門職',
    '設計士': '現場管理・専門職', '現場監督': '現場管理・専門職', '職人': '現場管理・専門職',
    '技術者': '現場管理・専門職', '介護士': '現場管理・専門職', '理学療法士': '現場管理・専門職',
    '作業療法士': '現場管理・専門職', 'ケアマネージャー': '現場管理・専門職', '主任': '現場管理・専門職',
    '指導員': '現場管理・専門職', '講師': '現場管理・専門職', '教師': '現場管理・専門職',
    '保育士': '現場管理・専門職', '作業員': '現場管理・専門職', '配車係': '現場管理・専門職',
    '倉庫管理者': '現場管理・専門職', '運行管理者': '現場管理・専門職', '組合員': '現場管理・専門職',
    'デザイナー': '現場管理・専門職', 'コンサルタント': '現場管理・専門職', 'パートナー': '現場管理・専門職',
    'エンジニア': '現場管理・専門職', 'アドバイザー': '現場管理・専門職', 'プランナー': '現場管理・専門職',
    '品質管理責任者': '現場管理・専門職', '生産管理担当': '現場管理・専門職', '品質検査員': '現場管理・専門職',
    '現場作業員': '現場管理・専門職', '設計担当': '現場管理・専門職', '購買担当': '現場管理・専門職',
    '商品管理担当': '現場管理・専門職', '在庫管 理担当': '現場管理・専門職', '在庫管理担当': '現場管理・専門職',
    'バイヤー': '現場管理・専門職', '品質管理担当': '現場管理・専門職', '現場管理者': '現場管理・専門職',
    '物流管理者': '現場管理・専門職', '施設管理者': '現場管理・専門職', '製造管理者': '現場管理・専門職'
}

def clean_filename(name):
    """ファイル名として不適切な文字を削除・置換する"""
    return str(name).replace('/', '／').replace('\\', '＼').strip()

def sync_csv_files():
    """
    マスターCSVを読み込み、業界別・職種別のCSVファイルを生成する。
    職種別ファイルは正規化されたカテゴリー名で作成する。
    """
    if not os.path.exists(MASTER_CSV_PATH):
        print(f"エラー: マスターファイルが見つかりません: {MASTER_CSV_PATH}")
        return

    print("マスターCSVの同期を開始します...")

    for directory in [INDUSTRY_DIR, JOB_TYPE_DIR]:
        if os.path.exists(directory):
            shutil.rmtree(directory)
        os.makedirs(directory)

    try:
        df = pd.read_csv(MASTER_CSV_PATH, encoding='utf-8-sig')
        print("マスターCSVを正常に読み込みました。")
    except Exception as e:
        print(f"CSV読み込みエラー: {e}")
        return

    # --- 業界別CSVの生成 (元の職種名をそのまま使用) ---
    print("業界別ファイルの生成中...")
    grouped_industry = df.groupby('業界')
    for industry, group in grouped_industry:
        industry_name = clean_filename(industry)
        output_path = os.path.join(INDUSTRY_DIR, f"{industry_name}.csv")
        group.to_csv(output_path, index=False, encoding='utf-8-sig')
    print(f"{len(grouped_industry)}個の業界別ファイルを生成しました。")

    # --- 職種別CSVの生成 (正規化した職種カテゴリーを使用) ---
    print("職種別ファイルの生成中...")
    # '職種'列をマッピングに沿って新しい'職種カテゴリー'列に変換。マッピングにないものは'その他専門職'に分類。
    df['職種カテゴリー'] = df['職種'].map(JOB_TYPE_MAPPING).fillna('その他専門職')
    
    grouped_job_type = df.groupby('職種カテゴリー')
    for job_category, group in grouped_job_type:
        job_category_name = clean_filename(job_category)
        # 元の'職種カテゴリー'列は不要なため、保存前に削除
        group_to_save = group.drop(columns=['職種カテゴリー'])
        output_path = os.path.join(JOB_TYPE_DIR, f"{job_category_name}.csv")
        group_to_save.to_csv(output_path, index=False, encoding='utf-8-sig')
    print(f"{len(grouped_job_type)}個の正規化済み職種別ファイルを生成しました。")

    # --- tempディレクトリのクリーンアップ ---
    print(f"'{TEMP_DIR}'内の古いCSVファイルを整理します...")
    if os.path.exists(TEMP_DIR):
        for filename in os.listdir(TEMP_DIR):
            if filename.endswith('_事例データ.csv'):
                file_path = os.path.join(TEMP_DIR, filename)
                try:
                    os.remove(file_path)
                    print(f"  - 削除: {filename}")
                except OSError as e:
                    print(f"  - 削除失敗: {filename} ({e.strerror})")

    print("同期プロセスが完了しました。")

if __name__ == '__main__':
    sync_csv_files() 