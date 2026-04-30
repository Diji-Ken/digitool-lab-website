#!/usr/bin/env python3
import html
import json
import re
from pathlib import Path
from urllib.parse import quote

from bs4 import BeautifulSoup, Comment


ROOT = Path(__file__).resolve().parents[1]
BLOG_DIR = ROOT / "blog"
DATA_PATH = ROOT / "data" / "case-studies.json"
STYLE_VERSION = "2026043001"
TODAY = "2026-04-25"
SITE_URL = "https://digitool-lab.com"


def clean_text(value):
    return re.sub(r"\s+", " ", value or "").strip()


def slugify(value, index):
    cleaned = re.sub(r"[^\w\u3040-\u30ff\u3400-\u9fff-]+", "-", value, flags=re.UNICODE)
    cleaned = cleaned.strip("-").lower()
    return cleaned or f"section-{index}"


def metric_candidates(text):
    pattern = re.compile(
        r"(?:[0-9０-９]+(?:\.[0-9０-９]+)?\s*(?:%|％|時間|分|件|社|名|円|万円|ポイント|倍|割|日|週間|ヶ月|月)|ゼロ|ほぼゼロ|半減|大幅削減|自動化|効率化)"
    )
    seen = []
    for match in pattern.findall(text):
        value = clean_text(match)
        if value and value not in seen:
            seen.append(value)
        if len(seen) >= 4:
            break
    return seen


def build_tag_links(soup, tags):
    holder = soup.new_tag("div")
    holder["class"] = "article-enhanced-tags"
    for tag in tags[:6]:
        a = soup.new_tag("a", href=f"../case-studies.html?tag={quote(tag)}")
        a["class"] = "article-tag"
        a.string = tag
        holder.append(a)
    return holder


def update_meta(soup, article, url, image_url):
    head = soup.head
    if not head:
        return

    def ensure_meta(attr_name, attr_value, content):
        meta = head.find("meta", attrs={attr_name: attr_value})
        if not meta:
            meta = soup.new_tag("meta")
            meta[attr_name] = attr_value
            head.append(meta)
        meta["content"] = content

    ensure_meta("name", "robots", "index, follow")
    ensure_meta("property", "og:type", "article")
    ensure_meta("property", "og:url", url)
    ensure_meta("property", "og:image", image_url)
    ensure_meta("name", "twitter:card", "summary_large_image")
    ensure_meta("name", "twitter:title", f"{article['title']} | デジタルツール研究所")
    ensure_meta("name", "twitter:description", article.get("summary", ""))
    ensure_meta("name", "twitter:image", image_url)

    canonical = head.find("link", rel="canonical")
    if not canonical:
        canonical = soup.new_tag("link", rel="canonical")
        head.append(canonical)
    canonical["href"] = url

    for link in head.find_all("link", rel="stylesheet"):
        href = link.get("href", "")
        if "css/style.css" in href:
            link["href"] = re.sub(r"\?v=[0-9]+", "", href) + f"?v={STYLE_VERSION}"


def fix_blog_relative_paths(soup):
    def needs_prefix(value):
        if not value:
            return False
        return not value.startswith(("../", "/", "#", "http://", "https://", "mailto:", "tel:"))

    for tag in soup.find_all(src=True):
        src = tag.get("src", "")
        if needs_prefix(src):
            tag["src"] = "../" + src.lstrip("./")

    for tag in soup.find_all(href=True):
        href = tag.get("href", "")
        if needs_prefix(href):
            tag["href"] = "../" + href.lstrip("./")


def json_script(soup, element_id, data):
    existing = soup.find("script", id=element_id)
    if existing:
        existing.decompose()
    script = soup.new_tag("script", id=element_id, type="application/ld+json")
    script.string = "\n" + json.dumps(data, ensure_ascii=False, indent=2) + "\n"
    return script


def blog_posting_data(article, url, image_url):
    return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": article["title"],
        "description": article.get("summary", ""),
        "image": image_url,
        "datePublished": article.get("date", TODAY),
        "dateModified": TODAY,
        "author": {
            "@type": "Organization",
            "name": "株式会社デジタルツール研究所",
            "url": SITE_URL + "/about",
        },
        "publisher": {
            "@type": "Organization",
            "name": "株式会社デジタルツール研究所",
            "logo": {
                "@type": "ImageObject",
                "url": SITE_URL + "/images/企業ロゴ最終.png",
            },
        },
        "mainEntityOfPage": {"@type": "WebPage", "@id": url},
        "articleSection": article.get("industry", ""),
        "inLanguage": "ja-JP",
        "keywords": [article.get("industry", ""), *article.get("tags", [])],
        "about": [{"@type": "Thing", "name": tag} for tag in article.get("tags", [])[:8]],
        "isPartOf": {
            "@type": "Blog",
            "name": "ご支援事例",
            "url": f"{SITE_URL}/case-studies",
        },
    }


def update_json_ld(soup, article, url, image_url, faq_items):
    head = soup.head
    if not head:
        return
    has_blog_posting = False
    for script in head.find_all("script", type="application/ld+json"):
        if script.get("id"):
            continue
        try:
            data = json.loads(script.string or "")
        except json.JSONDecodeError:
            continue
        if data.get("@type") == "BlogPosting":
            data["articleSection"] = article.get("industry", "")
            data["keywords"] = [article.get("industry", ""), *article.get("tags", [])]
            data["image"] = image_url
            data["dateModified"] = TODAY
            data["about"] = [{"@type": "Thing", "name": tag} for tag in article.get("tags", [])[:8]]
            data["isPartOf"] = {
                "@type": "Blog",
                "name": "ご支援事例",
                "url": f"{SITE_URL}/case-studies",
            }
            data["mainEntityOfPage"] = {"@type": "WebPage", "@id": url}
            script.string = "\n" + json.dumps(data, ensure_ascii=False, indent=2) + "\n"
            has_blog_posting = True
            break
    if not has_blog_posting:
        head.append(json_script(soup, "article-blogposting-jsonld", blog_posting_data(article, url, image_url)))

    breadcrumb = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "ホーム", "item": SITE_URL + "/"},
            {"@type": "ListItem", "position": 2, "name": "ご支援事例", "item": f"{SITE_URL}/case-studies"},
            {"@type": "ListItem", "position": 3, "name": article["title"], "item": url},
        ],
    }
    faq = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": question,
                "acceptedAnswer": {"@type": "Answer", "text": answer},
            }
            for question, answer in faq_items
        ],
    }
    head.append(json_script(soup, "article-breadcrumb-jsonld", breadcrumb))
    head.append(json_script(soup, "article-faq-jsonld", faq))


def remove_previous_enhancements(soup):
    for node in soup.select("[data-codex-enhancement]"):
        node.decompose()


def clean_generated_artifacts(soup, article):
    for comment in soup.find_all(string=lambda text: isinstance(text, Comment)):
        value = str(comment)
        if "IMAGE_PLANS" in value or "case-studies.html?tag=タグ名" in value or "タグは手動" in value:
            comment.extract()

    for p in list(soup.find_all("p")):
        text = clean_text(p.get_text(" "))
        if not text:
            p.decompose()
            continue
        if text == "---" or (text.startswith("# ") and article["title"] in text):
            p.decompose()
            continue
        if text.startswith("![") or (text.startswith("!") and p.find("a")):
            p.decompose()
            continue
        if text.startswith("> "):
            blockquote = soup.new_tag("blockquote")
            inner = soup.new_tag("p")
            inner.string = text[2:].strip()
            blockquote.append(inner)
            p.replace_with(blockquote)

    paragraphs = list(soup.find_all("p"))
    index = 0
    while index < len(paragraphs):
        p = paragraphs[index]
        if not p.parent or p.get_text(strip=True).count("|") < 2:
            index += 1
            continue

        rows = []
        current = p
        while current and current.name == "p":
            text = clean_text(current.get_text(" "))
            if text.count("|") < 2 or not text.startswith("|"):
                break
            rows.append((current, [cell.strip() for cell in text.strip("|").split("|")]))
            current = current.find_next_sibling()

        data_rows = [
            (node, cells)
            for node, cells in rows
            if cells and not all(re.fullmatch(r"-+", cell) for cell in cells)
        ]
        if len(data_rows) >= 2:
            table = soup.new_tag("table")
            table["class"] = "article-data-table"
            thead = soup.new_tag("thead")
            tbody = soup.new_tag("tbody")
            head_row = soup.new_tag("tr")
            for cell in data_rows[0][1]:
                th = soup.new_tag("th")
                th.string = cell
                head_row.append(th)
            thead.append(head_row)
            for _, cells in data_rows[1:]:
                tr = soup.new_tag("tr")
                for cell in cells:
                    td = soup.new_tag("td")
                    td.string = cell
                    tr.append(td)
                tbody.append(tr)
            table.append(thead)
            table.append(tbody)
            data_rows[0][0].replace_with(table)
            for node, _ in rows[1:]:
                node.decompose()
            paragraphs = list(soup.find_all("p"))
            index = 0
            continue
        index += 1


def update_visible_article_header(soup, article):
    page_header = soup.find(class_="page-header")
    if not page_header:
        return

    h1 = page_header.find("h1")
    if h1:
        h1.string = article["title"]

    category = page_header.find("span")
    if category:
        category.string = article.get("industry", "")

    published = page_header.find("time")
    if published:
        published.string = article.get("date", "")

    tag_wrap = page_header.select_one(".article-tags > div")
    if tag_wrap:
        tag_wrap.clear()
        for tag in article.get("tags", [])[:6]:
            a = soup.new_tag("a", href=f"../case-studies.html?tag={quote(tag)}")
            a["class"] = "article-tag"
            a.string = tag
            tag_wrap.append(a)

    breadcrumb = soup.find("nav", class_="breadcrumb")
    if breadcrumb:
        spans = breadcrumb.find_all("span")
        if spans:
            spans[-1].string = f"{article.get('industry', '')}の事例"


def enhance_article_body(soup, article, metrics):
    article_tag = soup.find("article")
    if not article_tag:
        return []
    article_tag["class"] = list(dict.fromkeys([*(article_tag.get("class") or []), "enhanced-case-article"]))

    container = article_tag.find(class_="container") or article_tag
    container["class"] = list(dict.fromkeys([*(container.get("class") or []), "article-body-container"]))

    headings = []
    for index, h2 in enumerate(container.find_all("h2"), start=1):
        if h2.find_parent(attrs={"data-codex-enhancement": "true"}):
            continue
        text = clean_text(h2.get_text(" "))
        if not text:
            continue
        h2["id"] = h2.get("id") or slugify(text, index)
        headings.append((h2["id"], text.lstrip("■ ")))

    answer = soup.new_tag("section")
    answer["class"] = "article-answer-panel"
    answer["data-codex-enhancement"] = "true"
    answer.append(BeautifulSoup(f"""
      <p class="article-kicker">この記事の要点</p>
      <h2>{html.escape(article['title'])}</h2>
      <p>{html.escape(article.get('summary', ''))}</p>
    """, "html.parser"))
    if metrics:
        grid = soup.new_tag("div")
        grid["class"] = "article-impact-grid"
        for value in metrics[:4]:
            card = soup.new_tag("div")
            card["class"] = "article-impact-card"
            card.append(BeautifulSoup(f"<strong>{html.escape(value)}</strong><span>本文内で確認できる成果・規模</span>", "html.parser"))
            grid.append(card)
        answer.append(grid)
    answer.append(build_tag_links(soup, article.get("tags", [])))

    if headings:
        toc = soup.new_tag("nav")
        toc["class"] = "article-toc"
        toc["aria-label"] = "記事の目次"
        toc["data-codex-enhancement"] = "true"
        toc.append(BeautifulSoup("<h2>目次</h2>", "html.parser"))
        ul = soup.new_tag("ul")
        for target, text in headings[:8]:
            li = soup.new_tag("li")
            a = soup.new_tag("a", href=f"#{target}")
            a.string = text
            li.append(a)
            ul.append(li)
        toc.append(ul)
        container.insert(0, toc)
    container.insert(0, answer)

    trust = soup.new_tag("section")
    trust["class"] = "article-trust-panel"
    trust["data-codex-enhancement"] = "true"
    trust.append(BeautifulSoup(f"""
      <h2>この事例で確認した実務ポイント</h2>
      <div>
        <p><strong>対象業種:</strong> {html.escape(article.get('industry', ''))}</p>
        <p><strong>支援の観点:</strong> 業務フローの棚卸し、既存ツールの整理、現場で使い続けられる運用設計、導入後の定着確認。</p>
        <p><strong>同じ課題に向く企業:</strong> IT担当者が不在、紙や表計算での管理が限界、AIや自動化を試したいが社内だけでは進めにくい企業。</p>
      </div>
    """, "html.parser"))
    container.append(trust)
    return headings


def enhance_media(soup, article):
    media = soup.find("img", src=re.compile(r"(case-studies|images/articles|articles)/"))
    thumbnail = "../" + article.get("thumbnail", "").lstrip("/")
    if not media:
        page_header = soup.find(class_="page-header")
        if not page_header:
            return
        media_section = soup.new_tag("div")
        media_section["style"] = "background-color: var(--gray-100); padding: 2rem 0;"
        media_section.append(BeautifulSoup(f"""
          <div class="container article-hero-media" style="max-width: 800px; text-align: center;">
            <img src="{html.escape(thumbnail)}" alt="{html.escape(article['title'])}" style="max-width: 100%; border-radius: 8px; box-shadow: var(--shadow-lg);">
          </div>
        """, "html.parser"))
        page_header.insert_after(media_section)
        media = media_section.find("img")
    media["src"] = thumbnail
    media["alt"] = article["title"]
    media["width"] = "800"
    media["height"] = "450"
    media["loading"] = "eager"
    media["decoding"] = "async"
    media["fetchpriority"] = "high"
    media["class"] = list(dict.fromkeys([*(media.get("class") or []), "article-main-image"]))
    wrapper = media.find_parent("div")
    if wrapper:
        wrapper["class"] = list(dict.fromkeys([*(wrapper.get("class") or []), "article-hero-media"]))


def faq_items(article):
    title = article["title"]
    summary = article.get("summary", "")
    industry = article.get("industry", "")
    return [
        (
            "この事例では何を改善しましたか？",
            f"{title}の事例では、{summary}",
        ),
        (
            "同じような相談はできますか？",
            f"はい。{industry}に限らず、業務の棚卸し、AI活用、ツール導入、システム開発、運用定着まで相談できます。",
        ),
        (
            "IT担当者がいない会社でも依頼できますか？",
            "可能です。現場の業務内容を確認したうえで、専門用語に偏らず、既存の体制で続けられる形に落とし込みます。",
        ),
    ]


def insert_faq_and_cta(soup, article, items):
    main = soup.find("main")
    if not main:
        return
    faq = soup.new_tag("section")
    faq["class"] = "article-faq-section"
    faq["data-codex-enhancement"] = "true"
    faq.append(BeautifulSoup("<div class=\"container\"><h2>よくある質問</h2></div>", "html.parser"))
    inner = faq.find(class_="container")
    faq_list = soup.new_tag("div")
    faq_list["class"] = "article-faq-list"
    for question, answer in items:
        item = soup.new_tag("div")
        item.append(BeautifulSoup(f"<h3>{html.escape(question)}</h3><p>{html.escape(answer)}</p>", "html.parser"))
        faq_list.append(item)
    inner.append(faq_list)

    cta = soup.new_tag("section")
    cta["class"] = "article-consult-cta"
    cta["data-codex-enhancement"] = "true"
    cta.append(BeautifulSoup(f"""
      <div class="container">
        <p>中小企業のDX・AI活用相談</p>
        <h2>{html.escape(article.get('industry', ''))}の業務改善を、現場に合わせて設計します</h2>
        <div class="article-consult-actions">
          <a href="../contact.html" class="btn btn-primary">無料相談をする</a>
          <a href="../case-studies.html" class="btn btn-outline">他の事例を見る</a>
        </div>
      </div>
    """, "html.parser"))

    target = main.find("section", string=False)
    main.append(faq)
    main.append(cta)


def enhance_file(path, article):
    raw = path.read_text(encoding="utf-8")
    soup = BeautifulSoup(raw, "html.parser")
    remove_previous_enhancements(soup)
    fix_blog_relative_paths(soup)
    clean_generated_artifacts(soup, article)
    if soup.body:
        soup.body["class"] = list(dict.fromkeys([*(soup.body.get("class") or []), "enhanced-blog-page"]))

    page_url = f"{SITE_URL}/{article['url'].replace('.html', '')}"
    image_url = f"{SITE_URL}/{article.get('thumbnail', '').lstrip('/')}"
    text = clean_text(BeautifulSoup(raw, "html.parser").get_text(" "))
    metrics = metric_candidates(" ".join([article["title"], article.get("summary", ""), text]))
    faqs = faq_items(article)

    update_meta(soup, article, page_url, image_url)
    update_json_ld(soup, article, page_url, image_url, faqs)
    update_visible_article_header(soup, article)
    enhance_media(soup, article)
    enhance_article_body(soup, article, metrics)
    insert_faq_and_cta(soup, article, faqs)

    rendered = str(soup)
    path.write_text(rendered, encoding="utf-8")


def main():
    articles = {article["url"]: article for article in json.loads(DATA_PATH.read_text(encoding="utf-8"))}
    count = 0
    for path in sorted(BLOG_DIR.glob("*.html")):
        article = articles.get(f"blog/{path.name}")
        if not article:
            continue
        enhance_file(path, article)
        count += 1
    print(f"enhanced {count} blog articles")


if __name__ == "__main__":
    main()
