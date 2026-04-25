#!/usr/bin/env python3
import argparse
import copy
import html
import json
from pathlib import Path
from urllib.parse import quote

from bs4 import BeautifulSoup, NavigableString, Tag


ROOT = Path(__file__).resolve().parents[1]
BLOG_DIR = ROOT / "blog"
DATA_PATH = ROOT / "data" / "case-studies.json"

COLOR_MAP = {
    "飲食業": ("orange", "orange"),
    "飲食・サービス業": ("orange", "orange"),
    "サービス業": ("green", "green"),
    "美容・サロン業": ("pink", "pink"),
    "小売業": ("blue", "blue"),
    "製造業": ("purple", "purple"),
    "ITサービス業": ("cyan", "cyan"),
    "建設・不動産業": ("blue", "blue"),
    "介護・福祉": ("pink", "pink"),
}


def load_articles():
    return json.loads(DATA_PATH.read_text(encoding="utf-8"))


def target_paths():
    paths = []
    for path in sorted(BLOG_DIR.glob("*.html")):
        text = path.read_text(encoding="utf-8")
        if "desktop-nav" not in text and "mobile-menu-button" not in text:
            paths.append(path)
    return paths


def append_style(tag, style):
    current = tag.get("style", "").strip()
    if current and not current.endswith(";"):
        current += ";"
    tag["style"] = f"{current} {style}".strip()


def wrap_tables(soup):
    for table in list(soup.find_all("table")):
        parent = table.parent
        if isinstance(parent, Tag) and parent.get("data-table-wrapper") == "true":
            continue
        wrapper = soup.new_tag("div")
        wrapper["data-table-wrapper"] = "true"
        wrapper["style"] = "overflow-x: auto; margin: 2rem 0;"
        table.wrap(wrapper)


def style_body_fragment(fragment, accent):
    soup = BeautifulSoup(fragment, "html.parser")
    wrap_tables(soup)

    for section in soup.find_all("section"):
        append_style(section, "margin-bottom: 3rem;")

    for h2 in soup.find_all("h2"):
        append_style(
            h2,
            f"font-size: 1.75rem; font-weight: 700; color: var(--gray-900); "
            f"margin-bottom: 1.5rem; border-left: 4px solid var(--{accent}-500); "
            "padding-left: 1rem;",
        )

    for h3 in soup.find_all("h3"):
        append_style(
            h3,
            f"font-size: 1.25rem; font-weight: 700; color: var(--{accent}-600); "
            "margin: 2rem 0 1rem;",
        )

    for h4 in soup.find_all("h4"):
        append_style(
            h4,
            "font-size: 1.1rem; font-weight: 700; color: var(--gray-800); "
            "margin: 1.5rem 0 0.75rem;",
        )

    for p in soup.find_all("p"):
        append_style(p, "font-size: 1.05rem; line-height: 1.8; margin-bottom: 1.25rem;")

    for ul in soup.find_all("ul"):
        append_style(ul, "font-size: 1.05rem; line-height: 1.8; margin: 1rem 0 1.5rem 1.5rem;")

    for ol in soup.find_all("ol"):
        append_style(ol, "font-size: 1.05rem; line-height: 1.8; margin: 1rem 0 1.5rem 1.5rem;")

    for li in soup.find_all("li"):
        append_style(li, "margin-bottom: 0.5rem;")

    for div in soup.find_all("div"):
        if div.get("data-table-wrapper") == "true":
            continue
        classes = set(div.get("class", []))
        if classes:
            append_style(
                div,
                f"background-color: var(--gray-50); padding: 1.5rem; border-radius: 8px; "
                f"border-left: 4px solid var(--{accent}-500); margin: 2rem 0;",
            )

    for blockquote in soup.find_all("blockquote"):
        append_style(
            blockquote,
            f"background-color: var(--gray-100); padding: 1.5rem; border-radius: 8px; "
            f"border-left: 4px solid var(--{accent}-500); margin: 2rem 0;",
        )

    for cite in soup.find_all("cite"):
        append_style(cite, "display: block; margin-top: 1rem; color: var(--gray-600); font-style: normal;")

    for pre in soup.find_all("pre"):
        append_style(
            pre,
            "background-color: var(--gray-900); color: var(--white); padding: 1.5rem; "
            "border-radius: 8px; overflow-x: auto; line-height: 1.6; white-space: pre-wrap;",
        )

    for table in soup.find_all("table"):
        append_style(
            table,
            "width: 100%; border-collapse: collapse; background-color: var(--white); "
            "border-radius: 8px; overflow: hidden; box-shadow: var(--shadow-md);",
        )

    for th in soup.find_all("th"):
        append_style(
            th,
            "padding: 1rem; text-align: left; border: 1px solid var(--gray-200); "
            "font-weight: 600; background-color: var(--gray-100);",
        )

    for td in soup.find_all("td"):
        append_style(td, "padding: 1rem; border: 1px solid var(--gray-200);")

    for a in soup.find_all("a"):
        href = a.get("href", "")
        if href and not href.startswith(("http://", "https://", "../", "#", "mailto:", "tel:")):
            a["href"] = href
        append_style(a, f"color: var(--{accent}-600); font-weight: 600;")

    return soup.decode(formatter="html")


def extract_sections(raw):
    soup = BeautifulSoup(raw, "html.parser")
    article = soup.find("article")
    if not article:
        body = soup.find("body")
        if not body:
            raise ValueError("No article/body found")
        article = body

    sections = article.find_all("section", recursive=False)
    if not sections:
        sections = article.find_all("section")
    if not sections:
        raise ValueError("No section found")

    holder = BeautifulSoup("", "html.parser")
    for section in sections:
        holder.append(copy.copy(section))
        holder.append(NavigableString("\n\n"))
    return holder.decode(formatter="html").strip()


def tag_links(tags):
    links = []
    for tag in dict.fromkeys(tags):
        safe = html.escape(tag)
        href = f"../case-studies.html?tag={quote(tag)}"
        links.append(f'            <a href="{href}" class="article-tag">{safe}</a>')
    return "\n".join(links)


def render(article, body_content):
    title = article["title"]
    description = article.get("summary", "")
    industry = article.get("industry", "その他")
    badge, accent = COLOR_MAP.get(industry, ("gray", "gray"))
    tags = article.get("tags", [])
    keywords = ", ".join(dict.fromkeys([industry, *tags, "デジタルツール研究所"]))
    thumbnail = "../" + article.get("thumbnail", "").lstrip("/")
    url = article["url"]
    canonical = f"https://digitool-lab.com/{url}"
    og_image = f"https://digitool-lab.com/{article.get('thumbnail', '').lstrip('/')}"
    body = style_body_fragment(body_content, accent)

    return f"""<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{html.escape(title)} - ご支援事例 - 株式会社デジタルツール研究所</title>
    <meta name="description" content="{html.escape(description)}">
    <meta name="keywords" content="{html.escape(keywords)}">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="icon" type="image/x-icon" href="../favicon.ico">
    <link rel="icon" type="image/png" sizes="16x16" href="../favicon-16x16.png">
    <link rel="icon" type="image/png" sizes="32x32" href="../favicon-32x32.png">
    <link rel="apple-touch-icon" sizes="180x180" href="../apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="192x192" href="../android-chrome-192x192.png">
    <link rel="icon" type="image/png" sizes="512x512" href="../android-chrome-512x512.png">
    <link rel="manifest" href="../site.webmanifest">
    <link rel="canonical" href="{html.escape(canonical)}">
    <meta property="og:title" content="{html.escape(title)} | デジタルツール研究所">
    <meta property="og:description" content="{html.escape(description)}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="{html.escape(canonical)}">
    <meta property="og:image" content="{html.escape(og_image)}">
    <link rel="stylesheet" href="../css/style.css?v=2024120513">
  <!-- Google Analytics 4 -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-BFWCDFQXC8"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){{dataLayer.push(arguments);}}
    gtag("js", new Date());
    gtag("config", "G-BFWCDFQXC8", {{
      "anonymize_ip": true,
      "allow_google_signals": false,
      "allow_ad_personalization_signals": false
    }});
  </script>
</head>
<body>
<div class="flex flex-col min-h-screen">
  <header>
    <div class="container">
      <a href="../index.html" class="logo">
        <img src="../images/企業ロゴ最終.png" alt="株式会社デジタルツール研究所 ロゴ">
      </a>
      <div class="header-right-panel">
        <nav class="desktop-nav">
          <a href="../about.html">私たちについて</a>
          <a href="../service.html">事業内容</a>
          <a href="../case-studies.html" class="active">ご支援事例</a>
        </nav>
        <div class="header-buttons">
          <a href="#" id="header-download-button" class="btn btn-sm btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><polyline points="10 16 12 18 14 16"></polyline></svg>
            <span>資料ダウンロード</span>
          </a>
          <a href="../contact.html" class="btn btn-sm btn-dark">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            <span>お問い合わせ</span>
          </a>
        </div>
      </div>
      <button class="menu-button" id="mobile-menu-button" aria-label="メニューを開く">
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>
      </button>
    </div>
    <nav class="mobile-nav" id="mobile-menu">
        <a href="../about.html">私たちについて</a>
        <a href="../service.html">事業内容</a>
        <a href="../case-studies.html" class="active">ご支援事例</a>
        <a href="../contact.html">お問い合わせ</a>
    </nav>
  </header>

  <main class="flex-grow">
    <nav class="breadcrumb" style="padding: 1rem; background-color: var(--gray-50); border-bottom: 1px solid var(--gray-200);">
      <div class="container">
        <a href="../index.html" style="color: var(--gray-600); text-decoration: none;">ホーム</a>
        <span style="margin: 0 0.5rem; color: var(--gray-400);">&gt;</span>
        <a href="../case-studies.html" style="color: var(--gray-600); text-decoration: none;">ご支援事例</a>
        <span style="margin: 0 0.5rem; color: var(--gray-400);">&gt;</span>
        <span style="color: var(--gray-800);">{html.escape(industry)}の事例</span>
      </div>
    </nav>

    <div class="page-header" style="padding: 3rem 1rem;">
      <div class="container" style="max-width: 800px;">
        <div style="margin-bottom: 1rem;">
          <span style="background-color: var(--{badge}-100); color: var(--{badge}-600); padding: 0.25rem 0.75rem; border-radius: 9999px; font-weight: 600; font-size: 0.875rem;">{html.escape(industry)}</span>
          <time style="margin-left: 1rem; color: var(--gray-600); font-size: 0.875rem;">{html.escape(article.get("date", ""))}</time>
        </div>
        <h1 style="font-size: 2.25rem; font-weight: 800; line-height: 1.3; margin: 0;">{html.escape(title)}</h1>

        <div class="article-tags" style="margin-top: 1.5rem;">
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
{tag_links(tags)}
          </div>
        </div>
      </div>
    </div>

    <div style="background-color: var(--gray-100); padding: 2rem 0;">
      <div class="container" style="max-width: 800px; text-align: center;">
        <img src="{html.escape(thumbnail)}" alt="{html.escape(title)}" style="max-width: 100%; border-radius: 8px; box-shadow: var(--shadow-lg);">
      </div>
    </div>

    <article style="padding: 3rem 1rem;">
      <div class="container" style="max-width: 800px;">
{body}
      </div>
    </article>

    <section style="background-color: var(--gray-50); padding: 3rem 1rem;">
      <div class="container" style="max-width: 800px; text-align: center;">
        <h2 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 2rem;">他の事例も見る</h2>
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          <a href="../case-studies.html" class="btn btn-outline" style="margin-bottom: 1rem;">事例一覧に戻る</a>
          <a href="../contact.html" class="btn btn-primary" style="margin-bottom: 1rem;">お問い合わせ</a>
        </div>
      </div>
    </section>
  </main>

  <footer>
    <div class="footer-content">
      <div class="footer-company">
        <img src="../images/企業ロゴ最終.png" alt="株式会社デジタルツール研究所" class="footer-logo">
        <div class="footer-company-info">
          <h3>株式会社デジタルツール研究所</h3>
          <p>〒110-0004<br>
          東京都台東区下谷2丁目23番8号<br>
          リベール上野4F</p>
        </div>
      </div>

      <div></div>
      <div></div>
      <div></div>

      <div class="footer-services">
        <h4>事業内容</h4>
        <ul>
          <li><a href="../services/consulting.html">DX伴走サポート</a></li>
          <li><a href="../services/training.html">フルオーダーメイドAI研修</a></li>
          <li><a href="../services/development.html">開発・デジタル支援</a></li>
        </ul>
      </div>

      <div class="footer-site-links">
        <ul>
          <li><a href="../case-studies.html">ご支援事例</a></li>
          <li><a href="../about.html">会社情報</a></li>
          <li><a href="../service.html">サービス一覧</a></li>
          <li><a href="../contact.html">お問い合わせ</a></li>
        </ul>
      </div>

      <div class="footer-social">
        <h4>SNS</h4>
        <div class="social-links">
          <a href="https://www.instagram.com/digiken_dx/" class="social-link" aria-label="Instagram">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="m16 11.37-1.63-1.63a2 2 0 0 0-2.83 0L9 12.37V16a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-4.63z"></path>
              <circle cx="12" cy="12" r="3"></circle>
              <circle cx="17.5" cy="6.5" r="1.5"></circle>
            </svg>
            <span>Instagram</span>
          </a>
          <a href="https://www.youtube.com/@%E3%83%87%E3%82%B8%E7%A0%94DX" class="social-link" aria-label="YouTube">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
              <polygon points="9.75,15.02 15.5,11.75 9.75,8.48"></polygon>
            </svg>
            <span>YouTube</span>
          </a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2024 株式会社デジタルツール研究所. All rights reserved.</p>
    </div>
  </footer>
</div>

<div id="download-modal" class="modal-overlay" style="display: none;">
  <div class="modal-content">
    <button id="close-modal" class="modal-close">&times;</button>
    <h3>サービス詳細資料</h3>
    <p>フォームにご入力いただくと、資料のダウンロードリンクをメールでお送りします。（実際には送信されず、すぐにダウンロードが始まります）</p>
    <form id="download-form">
      <div class="form-group">
        <label for="modal-name">お名前 *</label>
        <input type="text" id="modal-name" name="name" required>
      </div>
      <div class="form-group">
        <label for="modal-email">メールアドレス *</label>
        <input type="email" id="modal-email" name="email" required>
      </div>
      <button type="submit" class="btn btn-primary btn-block">ダウンロード</button>
    </form>
  </div>
</div>

<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
<script src="../js/main.js"></script>
</body>
</html>
"""


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int, default=0)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--file", action="append", default=[])
    args = parser.parse_args()

    articles = {article["url"]: article for article in load_articles()}
    if args.file:
        targets = [(BLOG_DIR / name).resolve() for name in args.file]
    else:
        targets = [path for path in target_paths() if f"blog/{path.name}" in articles]
    if args.limit:
        targets = targets[: args.limit]

    for path in targets:
        article = articles[f"blog/{path.name}"]
        raw = path.read_text(encoding="utf-8")
        body = extract_sections(raw)
        rendered = render(article, body)
        if args.dry_run:
            print(f"{path.relative_to(ROOT)}: {len(raw)} -> {len(rendered)}")
        else:
            path.write_text(rendered, encoding="utf-8")
            print(f"updated {path.relative_to(ROOT)}")

    print(f"processed {len(targets)} files")


if __name__ == "__main__":
    main()
