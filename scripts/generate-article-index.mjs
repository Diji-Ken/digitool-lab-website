#!/usr/bin/env node

// This page is built from existing, indexable sitemap pages. It never discovers
// drafts by walking the filesystem and never republishes noindex/evidence-gated pages.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const siteOrigin = 'https://digitool-lab.com';
export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const archiveUrl = `${siteOrigin}/articles/`;
export const archiveFile = path.join(root, 'articles/index.html');

export function decodeHtml(value) {
  return String(value).replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replaceAll('&quot;', '"').replaceAll('&#39;', "'").replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>').replaceAll('&amp;', '&');
}

function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

export function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(["'])(.*?)\2/gs)]
    .map((match) => [match[1].toLowerCase(), decodeHtml(match[3])]));
}

export function robotsValue(html) {
  return [...html.matchAll(/<meta\b[^>]*>/gi)].map((match) => attributes(match[0]))
    .filter((tag) => /^(?:robots|googlebot|bingbot)$/i.test(tag.name ?? ''))
    .map((tag) => tag.content ?? '').join(', ');
}

export function sitemapLocations() {
  return [...fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => decodeHtml(match[1].trim()));
}

export function localFileForUrl(url) {
  const parsed = new URL(url);
  if (parsed.origin !== siteOrigin) throw new Error(`Non-site sitemap URL: ${url}`);
  const relative = decodeURIComponent(parsed.pathname).replace(/^\/+|\/+$/g, '');
  if (relative.split('/').includes('..')) throw new Error(`Unsafe sitemap URL: ${url}`);
  const candidates = relative ? [`${relative}/index.html`, `${relative}.html`, relative] : ['index.html'];
  const file = candidates.map((candidate) => path.join(root, candidate))
    .find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
  if (!file) throw new Error(`Sitemap HTML is missing: ${url}`);
  return file;
}

export function gatedUrls() {
  const gate = JSON.parse(fs.readFileSync(path.join(root, 'data/case-evidence-status.json'), 'utf8'));
  const cases = JSON.parse(fs.readFileSync(path.join(root, 'data/case-studies.json'), 'utf8'));
  return new Set([
    ...gate.entries.map((entry) => new URL(entry.url, `${siteOrigin}/`).href),
    ...cases.filter((entry) => entry.evidenceStatus === 'unverified')
      .map((entry) => new URL(entry.url, `${siteOrigin}/`).href),
  ]);
}

export function loadPublicPages() {
  const excluded = gatedUrls();
  return sitemapLocations().filter((url) => url !== archiveUrl).map((url) => {
    const html = fs.readFileSync(localFileForUrl(url), 'utf8');
    if (excluded.has(url) || /\bnoindex\b/i.test(robotsValue(html))) {
      throw new Error(`The sitemap contains a page excluded from public discovery: ${url}`);
    }
    const canonical = [...html.matchAll(/<link\b[^>]*>/gi)].map((match) => attributes(match[0]))
      .find((tag) => tag.rel?.split(/\s+/).includes('canonical'))?.href;
    if (canonical !== url) throw new Error(`Sitemap/canonical mismatch: ${url}`);
    const heading = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1];
    const title = decodeHtml((heading ?? '').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
    if (!title) throw new Error(`An article-index entry has no visible h1: ${url}`);
    return { url, pathname: new URL(url).pathname, title, html };
  });
}

const groupDefinitions = [
  { id: 'planning', name: '導入の進め方・費用・相談先', description: 'DXやAIの導入前に、支援範囲、費用、選び方を整理する記事です。' },
  { id: 'ai-work', name: 'AIを日々の業務に使う', description: '文書作成、調査、会議、社内ルールなど、身近な仕事でAIを使う方法を探せます。' },
  { id: 'workflows', name: '現場業務・情報共有を整える', description: '記録、集計、顧客管理、受発注など、業務改善を扱う記事です。記事ごとの出典・対象・条件をご確認ください。' },
  { id: 'services', name: '支援メニュー・資料', description: '地域や課題に応じた支援内容、相談の進め方、無料資料を確認できます。' },
  { id: 'company', name: '会社情報・お問い合わせ', description: '運営会社、問い合わせ窓口、各種方針をご案内します。' },
];

function groupFor(page) {
  if (!page.pathname.startsWith('/blog/')) {
    return /^\/(?:about|contact|privacy-policy|terms-of-service|tokutei)?$/.test(page.pathname) ? 'company' : 'services';
  }
  if (/(?:-cost$|^\/blog\/(?:dx-support|dx-consulting|dx-subsidy|how-to-choose|saitama-small-business|internal-portal|business-system|excel-to-system|ai-training|ai-search|meo-citation))/.test(page.pathname)) return 'planning';
  if (/^\/blog\/(?:ai-|\d{3}_)/.test(page.pathname)) return 'ai-work';
  return 'workflows';
}

export function renderArticleIndex(pages = loadPublicPages()) {
  const groups = groupDefinitions.map((group) => ({ ...group,
    pages: pages.filter((page) => groupFor(page) === group.id)
      .sort((a, b) => a.url < b.url ? -1 : a.url > b.url ? 1 : 0),
  })).filter((group) => group.pages.length);
  const articleCount = pages.filter((page) => page.pathname.startsWith('/blog/')).length;
  const title = 'DX・AI活用の記事一覧｜株式会社デジタルツール研究所';
  const description = 'DX・AI活用の手順、費用の考え方、業務改善の記事をテーマ別に探せます。導入を検討する方から、現場の記録や情報共有を整えたい方まで、近い課題からお読みください。';
  const structured = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'CollectionPage', '@id': archiveUrl, name: title, description, url: archiveUrl,
        inLanguage: 'ja-JP', publisher: { '@id': `${siteOrigin}/#organization` },
        mainEntity: { '@type': 'ItemList', numberOfItems: pages.length,
          itemListElement: groups.flatMap((group) => group.pages).map((page, index) => ({
            '@type': 'ListItem', position: index + 1, name: page.title, url: page.url,
          })) } },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'ホーム', item: `${siteOrigin}/` },
        { '@type': 'ListItem', position: 2, name: '記事一覧', item: archiveUrl },
      ] },
    ],
  };
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${archiveUrl}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${archiveUrl}">
  <meta property="og:image" content="${siteOrigin}/images/hero-dx-support.webp">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="/favicon.ico">
  <link rel="stylesheet" href="/css/style.css?v=2026061401">
  <style>
    .article-index { color: #0b2344; background: #fff; line-height: 1.7; }
    .article-index h1, .article-index h2 { color: #0b2344; font-weight: 700; line-height: 1.4; }
    .article-index .container { max-width: 1120px; }
    .article-header { position: static; box-shadow: none; border-bottom: 1px solid #e3e6ea; }
    .article-header .container { min-height: 88px; height: auto; gap: 24px; padding-top: 12px; padding-bottom: 12px; }
    .article-header img { display: block; width: 110px; height: auto; }
    .article-header nav { display: flex; flex-wrap: wrap; gap: 12px 24px; font-size: 14px; }
    .article-header a:hover { text-decoration: underline; text-underline-offset: 4px; }
    .article-intro { padding: 48px 0 32px; border-bottom: 1px solid #e3e6ea; }
    .article-crumb { font-size: 14px; color: #6b7480; margin-bottom: 24px; }
    .article-crumb a { color: #0b2344; text-decoration: underline; }
    .article-index h1 { font-size: clamp(28px, 4vw, 40px); margin: 0 0 20px; }
    .article-intro p { max-width: 760px; margin: 0 0 16px; }
    .article-count { font-size: 14px; color: #6b7480; font-variant-numeric: tabular-nums; }
    .article-jumps { display: flex; flex-wrap: wrap; gap: 10px; margin: 24px 0 0; }
    .article-jumps a { color: #0b2344; background: #f7f8fa; padding: 8px 12px; border: 1px solid #e3e6ea; border-radius: 6px; font-size: 14px; }
    .article-jumps a:hover { text-decoration: underline; }
    .article-group { padding: 36px 0; scroll-margin-top: 24px; border-bottom: 1px solid #e3e6ea; }
    .article-group h2 { margin: 0 0 8px; font-size: 24px; }
    .article-group > p { margin: 0 0 20px; color: #6b7480; }
    .article-links { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 32px; }
    .article-links li { border-bottom: 1px solid #e3e6ea; }
    .article-links a { display: block; padding: 14px 0; color: #12355f; font-size: 15px; text-decoration: underline; text-decoration-color: #b6c3d1; text-underline-offset: 4px; }
    .article-links a:hover { text-decoration-color: #12355f; background: #f7f8fa; }
    .article-index a:focus-visible { outline: 3px solid #12355f; outline-offset: 4px; }
    .article-next { padding: 36px 0 48px; }
    .article-next p { margin-bottom: 20px; }
    .article-next .btn { background: #f97316; color: #0b2344; border-radius: 6px; box-shadow: none; font-weight: 600; }
    .article-footer { padding: 28px 0; color: #fff; background: #0b2344; }
    .article-footer p { margin: 0; color: #fff; font-size: 14px; }
    @media (max-width: 680px) {
      .article-header .container { align-items: flex-start; gap: 16px; }
      .article-header nav { gap: 8px 16px; font-size: 13px; justify-content: flex-end; }
      .article-header img { width: 88px; }
      .article-intro { padding-top: 32px; }
      .article-links { grid-template-columns: 1fr; }
      .article-group h2 { font-size: 22px; }
    }
  </style>
  <script type="application/ld+json">${JSON.stringify(structured).replaceAll('<', '\\u003c')}</script>
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-BFWCDFQXC8"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-BFWCDFQXC8',{anonymize_ip:true,allow_google_signals:false,allow_ad_personalization_signals:false});</script>
</head>
<body class="article-index">
  <!-- Generated by scripts/generate-article-index.mjs from the public sitemap. -->
  <header class="article-header"><div class="container">
    <a href="/" aria-label="株式会社デジタルツール研究所 ホーム"><img src="/images/logo-160.webp" alt="デジタルツール研究所" width="160" height="160" decoding="async"></a>
    <nav aria-label="メインメニュー"><a href="/service">事業内容</a><a href="/case-studies">事例・活用記事</a><a href="/about">会社情報</a><a href="/contact">お問い合わせ</a></nav>
  </div></header>
  <main id="main-content" class="container">
    <section class="article-intro">
      <nav class="article-crumb" aria-label="パンくず"><a href="/">ホーム</a> / 記事一覧</nav>
      <h1>DX・AI活用の記事一覧</h1>
      <p>導入を検討している方も、毎日の仕事を少しずつ整えたい方も。費用の考え方、AIの使い方、現場の業務改善など、近い課題からお読みください。</p>
      <p class="article-count">${articleCount}本の記事と、支援メニュー・会社案内を掲載しています。</p>
      <nav class="article-jumps" aria-label="テーマから探す">${groups.map((group) => `<a href="#${group.id}">${group.name}</a>`).join('')}</nav>
    </section>
${groups.map((group) => `    <section id="${group.id}" class="article-group" aria-labelledby="${group.id}-heading">
      <h2 id="${group.id}-heading">${group.name}</h2>
      <p>${group.description}</p>
      <ul class="article-links">
${group.pages.map((page) => `        <li><a href="${escapeHtml(page.pathname)}">${escapeHtml(page.title)}</a></li>`).join('\n')}
      </ul>
    </section>`).join('\n')}
    <section class="article-next" aria-label="業務改善の相談">
      <h2>自社ではどこから始めるか、迷ったときに</h2>
      <p>今の業務や困っていることを伺い、最初に取り組む範囲を一緒に整理します。</p>
      <a class="btn" href="/contact">業務改善を相談する</a>
    </section>
  </main>
  <footer class="article-footer"><div class="container"><p>株式会社デジタルツール研究所</p><p>〒331-0821 埼玉県さいたま市北区別所町738-3</p></div></footer>
</body>
</html>
`;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const expected = renderArticleIndex();
    const current = fs.existsSync(archiveFile) ? fs.readFileSync(archiveFile, 'utf8') : '';
    if (process.argv.includes('--check')) {
      if (current !== expected) throw new Error('Article index is stale. Run node scripts/generate-article-index.mjs.');
      console.log('Article index is in sync with the indexable sitemap pages.');
    } else if (current !== expected) {
      fs.mkdirSync(path.dirname(archiveFile), { recursive: true });
      fs.writeFileSync(archiveFile, expected);
      console.log('Generated articles/index.html from the indexable sitemap pages.');
    } else {
      console.log('Article index is already up to date.');
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
