import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ledgerPath = path.join(root, 'data/case-public-sources.json');
const caseDataPath = path.join(root, 'data/case-studies.json');
const ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function isPublicHttpsUrl(value) {
  try {
    const parsed = new URL(value);
    const host = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, '');
    if (parsed.protocol !== 'https:' || parsed.username || parsed.password) return false;
    if (host === 'localhost' || host.endsWith('.local') || host === '::1') return false;
    if (/^127\./.test(host) || /^10\./.test(host) || /^192\.168\./.test(host)) return false;
    const private172 = host.match(/^172\.(\d{1,3})\./);
    if (private172 && Number(private172[1]) >= 16 && Number(private172[1]) <= 31) return false;
    if (/^169\.254\./.test(host) || /^fc/i.test(host) || /^fd/i.test(host) || /^fe[89ab]/i.test(host)) return false;
    return Boolean(host);
  } catch {
    return false;
  }
}

function normalizeSources(sources) {
  const seen = new Set();
  return (Array.isArray(sources) ? sources : []).map((source) => {
    const title = String(source?.title ?? '').replace(/\s+/g, ' ').trim();
    const url = String(source?.url ?? '').trim();
    if (!title) throw new Error('Public source title is required.');
    if (!isPublicHttpsUrl(url)) throw new Error(`Unsafe public source URL: ${url || '(empty)'}`);
    if (seen.has(url)) throw new Error(`Duplicate public source URL: ${url}`);
    seen.add(url);
    return { title, url, host: new URL(url).hostname.replace(/^www\./, '') };
  });
}

function renderSources(sources) {
  const items = sources.map((source) => `          <li style="margin-bottom:0.75rem;">
            <a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer" style="font-weight:600;color:var(--orange-700);text-decoration:underline;text-underline-offset:0.2em;">${escapeHtml(source.title)}</a>
            <span style="display:block;font-size:0.85rem;color:var(--gray-600);overflow-wrap:anywhere;">${escapeHtml(source.host)}</span>
          </li>`).join('\n');
  return `      <section class="article-sources" data-evidence-status="public-source" aria-labelledby="article-sources-heading" style="margin:3rem 0;padding:1.5rem;border:1px solid var(--gray-200);border-radius:0.75rem;background:var(--gray-50);">
        <h2 id="article-sources-heading" style="font-size:1.35rem;font-weight:700;margin:0 0 0.75rem;border-left:4px solid var(--orange-500);padding-left:0.75rem;">出典・参考資料</h2>
        <p style="font-size:0.95rem;line-height:1.7;margin:0 0 1rem;color:var(--gray-700);">この記事の作成にあたり参照した公開情報です。リンク先の事実と、当社による整理・解説を区別してご確認いただけます。</p>
        <ol style="margin:0 0 0 1.25rem;padding:0;line-height:1.6;">
${items}
        </ol>
      </section>`;
}

function articleNodes(value, found = []) {
  if (!value || typeof value !== 'object') return found;
  if (Array.isArray(value)) {
    for (const item of value) articleNodes(item, found);
    return found;
  }
  const types = Array.isArray(value['@type']) ? value['@type'] : [value['@type']];
  if (types.includes('Article')) found.push(value);
  if (Array.isArray(value['@graph'])) articleNodes(value['@graph'], found);
  return found;
}

function serializeJsonLd(value) {
  return JSON.stringify(value)
    .replaceAll('<', '\\u003c')
    .replaceAll('\u2028', '\\u2028')
    .replaceAll('\u2029', '\\u2029');
}

function isEditorialTag(value) {
  return /^(?:freshness|source-count):/i.test(String(value).trim());
}

function cleanArticleKeywords(article) {
  if (Array.isArray(article.keywords)) {
    article.keywords = article.keywords.filter((keyword) => !isEditorialTag(keyword));
    return;
  }
  if (typeof article.keywords === 'string') {
    article.keywords = article.keywords
      .split(',')
      .map((keyword) => keyword.trim())
      .filter((keyword) => keyword && !isEditorialTag(keyword))
      .join(', ');
  }
}

function updateArticleJsonLd(html, sources) {
  let updatedArticles = 0;
  const updated = html.replace(
    /(<script\b[^>]*\btype=["']application\/ld\+json["'][^>]*>)([\s\S]*?)(<\/script>)/gi,
    (full, open, body, close) => {
      let parsed;
      try {
        parsed = JSON.parse(body.trim());
      } catch {
        return full;
      }
      const articles = articleNodes(parsed);
      for (const article of articles) {
        article.citation = sources.map((source) => source.url);
        article.dateModified = ledger.reviewedAt;
        cleanArticleKeywords(article);
        updatedArticles += 1;
      }
      return articles.length ? `${open}${serializeJsonLd(parsed)}${close}` : full;
    },
  );
  if (updatedArticles !== 1) {
    throw new Error(`Expected one Article JSON-LD node, updated ${updatedArticles}.`);
  }
  return updated;
}

function removeEditorialTagLinks(html) {
  return html.replace(
    /\n[ \t]*<a\b(?=[^>]*\bclass=["'][^"']*\barticle-tag\b[^"']*["'])[^>]*>(?:freshness|source-count):[^<]*<\/a>/gi,
    '',
  );
}

function insertVisibleSources(html, sources) {
  const withoutOld = html.replace(
    /\n?[ \t]*<section\b[^>]*class=["'][^"']*\barticle-sources\b[^"']*["'][\s\S]*?<\/section>\n*/gi,
    '\n',
  );
  const articleClose = withoutOld.lastIndexOf('</article>');
  if (articleClose < 0) throw new Error('Article closing tag not found.');
  const wrapperClose = withoutOld.lastIndexOf('</div>', articleClose);
  if (wrapperClose < 0) throw new Error('Article content wrapper closing tag not found.');
  const wrapperLineStart = withoutOld.lastIndexOf('\n', wrapperClose) + 1;
  if (!/^\s*$/.test(withoutOld.slice(wrapperLineStart, wrapperClose))) {
    throw new Error('Article content wrapper closing tag must begin on its own line.');
  }
  const block = `${renderSources(sources)}\n\n`;
  return `${withoutOld.slice(0, wrapperLineStart)}${block}      ${withoutOld.slice(wrapperClose)}`;
}

const caseData = JSON.parse(fs.readFileSync(caseDataPath, 'utf8'));
const caseByUrl = new Map(caseData.map((item) => [item.url, item]));
const ledgerUrls = new Set();
let sourceCount = 0;

for (const entry of ledger.entries ?? []) {
  if (ledgerUrls.has(entry.url)) throw new Error(`${entry.url}: duplicate ledger entry.`);
  ledgerUrls.add(entry.url);
  const sources = normalizeSources(entry.sources);
  if (!sources.length) throw new Error(`${entry.url}: at least one public source is required.`);
  sourceCount += sources.length;

  const filePath = path.join(root, `${entry.url}.html`);
  if (!fs.existsSync(filePath)) throw new Error(`${entry.url}: HTML file not found.`);
  const before = fs.readFileSync(filePath, 'utf8');
  const after = insertVisibleSources(removeEditorialTagLinks(updateArticleJsonLd(before, sources)), sources);
  if (after !== before) fs.writeFileSync(filePath, after, 'utf8');

  const item = caseByUrl.get(entry.url);
  if (!item) throw new Error(`${entry.url}: case-studies.json entry not found.`);
  item.evidenceStatus = 'verified';
  item.evidenceReviewedAt = ledger.reviewedAt;
  item.publicSourceCount = sources.length;
  item.tags = (Array.isArray(item.tags) ? item.tags : []).filter((tag) => !isEditorialTag(tag));
}

fs.writeFileSync(caseDataPath, `${JSON.stringify(caseData, null, 2)}\n`, 'utf8');
console.log(`Public source citations applied: ${ledgerUrls.size} cases, ${sourceCount} source links.`);
