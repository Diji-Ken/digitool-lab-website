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
