# Static article navigation

`/articles/` makes the existing public pages discoverable through ordinary HTML links. It is a theme-based article directory, not a count of customer projects or a list of verified company achievements.

## Publishing an article

Keep the normal publishing process: update the article HTML and add its canonical URL to `sitemap.xml`. The deployment workflow runs `node scripts/generate-article-index.mjs` before audits and uploads the generated page. A separate manual edit of the directory is not required.

For local preview or a reviewed content change, run:

```sh
node scripts/generate-article-index.mjs
node scripts/audit-crawl-reachability.mjs
```

Commit the generated `articles/index.html` when convenient, but an outdated generated copy does not block an otherwise valid new article: CI rebuilds it. Do not edit the generated HTML directly. Its presentation and classification live in `scripts/generate-article-index.mjs`.

## Safety and consistency checks

- The source is the sitemap, not every HTML file or the working-content folders.
- Sitemap entries with `noindex`, a mismatched canonical, or an evidence-gated URL stop generation. They cannot be silently reintroduced into navigation.
- Existing headings become escaped link text. The generator adds no customer names, numerical outcomes, or claims of its own.
- `node scripts/generate-article-index.mjs --check` detects stale output without writing files.
- The reachability audit follows real static `<a href>` links from the homepage to every sitemap URL plus `/articles/`. It does not count JavaScript buttons, JSON-LD references, or sitemap entries as navigation links.
- The audit also checks that the existing evidence-gated pages retain `noindex` and are not linked from the directory.

CI rebuilds before checking consistency. This keeps daily publishing automatic while still failing on broken source URLs, excluded pages, or disconnected navigation. The daily production-health workflow uses the same generated result as its local expectation.
