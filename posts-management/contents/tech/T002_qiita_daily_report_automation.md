# Qiita下書き: Googleフォームとスプレッドシートで日報を自動集計する時の設計メモ

想定媒体: Qiita

リンク先:
- https://digitool-lab.com/excel-paper-dx/
- https://digitool-lab.com/business-system-development/

## この記事で伝えること

日報自動化は、フォームを作るだけでは終わらない。入力項目、集計単位、通知、修正方法、閲覧権限を先に決めると運用しやすい。

## 構成案

### 1. 日報自動化で最初に決めること

- 誰が入力するか
- 何を必須にするか
- 誰が確認するか
- どの単位で集計するか
- 修正や差し戻しをどう扱うか

### 2. よくある項目

- 日付
- 担当者
- 案件名
- 作業内容
- 作業時間
- 問題・相談
- 写真や添付ファイル

### 3. シンプルな構成

```text
Googleフォーム
  -> Googleスプレッドシート
  -> GASで通知
  -> 月次集計シート
```

### 4. 最初に作り込みすぎない

- 入力項目を増やしすぎると現場が使わない
- 集計に使う項目だけ必須にする
- 写真や自由記述は必要な業務だけにする

### 5. 公式LPへの導線

Excel・紙業務のデジタル化支援:
https://digitool-lab.com/excel-paper-dx/

業務システム開発・基幹システム改善:
https://digitool-lab.com/business-system-development/
