# Lighthouse実測メモ

実施日: 2026-06-23

PageSpeed Insights APIは `429 Quota exceeded` のため、ローカルLighthouseで主要3URLをモバイル条件で確認した。

| URL | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
|---|---:|---:|---:|---:|---:|---:|---:|
| `https://digitool-lab.com/` | 85 | 100 | 100 | 100 | 4.0s | 0 | 90ms |
| `https://digitool-lab.com/business-system-development/` | 85 | 100 | 100 | 100 | 4.0s | 0 | 60ms |
| `https://digitool-lab.com/internal-portal-development/` | 83 | 100 | 100 | 100 | 4.1s | 0 | 100ms |

## 判断

- SEO、アクセシビリティ、ベストプラクティスは主要3URLで問題なし
- Performanceは80点台で致命的ではないが、LCPが4秒前後
- 次の改善候補はファーストビュー画像、CSS、フォント読み込み、サーバー応答時間の確認
- PageSpeed Insights APIの上限解除後に、トップ、主要LP、資料DL、代表記事を再計測する

## 2026-06-24 追加対応

- PageSpeed Insights APIは引き続き `429 Quota exceeded` のため、API実測は継続不可。
- トップページと `seo-hero` を使う主要LP/記事29ページに、共通ヒーロー背景画像 `hero-dx-support.webp` のpreloadを追加した。
- preloadには `fetchpriority="high"` を付与し、CSS背景画像の発見遅れによるLCP悪化を抑える方針にした。
- `scripts/audit-hero-preload.mjs` を追加し、`seo-hero` を使うページとトップページでヒーロー画像preloadが欠けていないかCI監査するようにした。
- ローカル実ブラウザでトップ、業務システムLP、社内ポータルLP、さいたま市LP、主要ブログ3本をスマホ幅390pxで確認し、preload検出、横スクロールなし、コンソールエラーなしを確認した。
