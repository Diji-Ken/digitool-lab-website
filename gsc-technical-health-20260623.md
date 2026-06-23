# GSC Technical Health Check

Date: 2026-06-23
Property: `sc-domain:digitool-lab.com`

## Summary

Search Console domain property is usable across the main domain and subdomains. No critical manual/security/HTTPS/breadcrumb issues were visible in the reports checked today.

## Checked Reports

| Report | Current State | Action |
|---|---|---|
| Manual actions | No issues detected | Continue monthly check |
| Security issues | No issues detected | Continue monthly check |
| HTTPS | Non-HTTPS URLs: 0, HTTPS URLs: 28, no critical issue | Continue monthly check |
| Breadcrumbs | Invalid: 0, Valid: 25 | Continue monitoring |
| Sitemaps | `digitool-lab.com/sitemap.xml`: success, 176 pages. `showroom.digitool-lab.com/sitemap.xml`: success, 564 pages | Recheck after new important releases |
| Page indexing | Registered: 228, Not registered: 985 | Triage important URLs only |

## Link Report Snapshot

External links:

- Total external links: 12
- Top linked pages:
  - `https://digitool-lab.com/`: 8
  - `https://digitool-lab.com/blog/hr-turnover-prediction-ai`: 3
  - `https://digitool-lab.com/ai-training-saitama/`: 1
- Top linking sites:
  - `note.com`: 5
  - `scamadviser.com`: 2
  - `timewell.jp`: 2
  - `buffett-code.com`: 1
  - `free-lifestyle.com`: 1

Internal links:

- Total internal links: 202
- Top linked pages:
  - `https://digitool-lab.com/`: 152
  - `https://digitool-lab.com/internal-portal-development/`: 12
  - `https://digitool-lab.com/business-system-development/`: 8
  - `https://digitool-lab.com/it-tantou-outsourcing/`: 8
  - `https://digitool-lab.com/downloads/`: 6
  - `https://digitool-lab.com/service`: 6
  - `https://digitool-lab.com/about`: 4
  - `https://digitool-lab.com/ai-training-saitama/`: 4
  - `https://digitool-lab.com/blog/ai-training-cost`: 1
  - `https://digitool-lab.com/blog/internal-portal-development-cost`: 1

## Findings

- The main site has no visible manual/security issue in GSC.
- Breadcrumb structured data is valid where detected.
- `showroom` sitemap has updated from the old 64-page state to 564 detected pages after resubmission.
- Internal links are heavily concentrated on the top page.
- High-priority AIO/MEO pages and articles were not prominent in the internal links report yet.

## Implemented After This Check

- Added internal links to `https://digitool-lab.com/ai-search-meo-support/` from the top page, service page structure, DX support LP, Saitama city LP, internal portal LP, business system LP, and related AIO/MEO articles.
- Added links between AIO/MEO supporting articles.
- Updated `sitemap.xml` lastmod for modified pages.
- Normalized `llms.txt` and `llms_full.txt` main links from `.html` variants to canonical URLs.
- Added `scripts/audit-priority-internal-links.mjs` to CI so important LPs, cost articles, AIO/MEO articles, downloads, and case hubs keep enough internal link sources.
- Added related links from the cost cluster to `blog/dx-consulting-monthly-support` because it had fewer referring pages than the other priority cost pages.

## Next Check

- Confirm in GSC whether the new internal link additions appear in the Links report.
- Recheck whether `ai-search-meo-citation-checklist`, `meo-citation-nap-checklist`, and `ai-search-company-information-checklist` move out of "discovered/crawled but not indexed" states.
- Continue PageSpeed/Lighthouse checks separately because PageSpeed Insights API had been rate limited earlier.
