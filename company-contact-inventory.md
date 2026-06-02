# 会社連絡先・住所更新メモ

最終更新: 2026-06-02

## 現在の公開表記

- 本社: 〒331-0821 埼玉県さいたま市北区別所町738-3
- 営業所: 〒361-0023 埼玉県行田市長野973-1
- 電話番号: 048-606-4504

## 掲載方針

- 旧本社住所は全削除。
- 旧営業所住所は全削除。
- 行田市営業所は一般HP上の会社情報・フッターでは残す。
- 利用規約、プライバシーポリシー、特商法、データ削除ページ、問い合わせ自動返信などの法務・運用文面は本社住所のみ掲載する。
- 電話番号変更時は、構造化データ、特商法、自動返信メール、関連ドキュメントを同時に確認する。

## 主要更新対象

- `index.html`: JSON-LD、トップページフッター
- `about.html`: 会社概要、フッター
- `contact.html`: フッター
- `privacy-policy.html`: 問い合わせ窓口、フッター
- `terms-of-service.html`: フッター
- `tokutei.html`: 所在地、フッター、電話番号
- `data-deletion.html`, `facebook-data-deletion.html`, `facebook-data-deletion`: 住所表記
- `contact_form.php`, `contact_form_secure.php`: 自動返信メール署名
- `llms.txt`, `llms_full.txt`: AI向け会社情報
- `robots.txt`: 内部監査メモ、Markdown、scriptsのクロール除外
- `blog/*.html`: 記事フッター
- `apps/*.html`, `services/*.html`: 派生ページ
- `scripts/unify_blog_case_templates.py`: ブログテンプレート内フッター

## 棚卸しコマンド

```bash
 cd /Users/m/Workspace/mirai/50_Reference/digitool-lab.com/public_html
./scripts/audit-company-contact.sh
```

旧住所系の具体文字列は公開ルート内に保存しない方針。旧住所残存確認は、非公開メモまたは作業時の一時検索クエリで実施し、公開ファイルへ旧住所文字列を再保存しない。
