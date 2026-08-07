#!/usr/bin/env python3
"""Build the English MyScoutee public-review book as HTML and PDF."""

from __future__ import annotations

import argparse
import base64
import html
import json
import re
import subprocess
from pathlib import Path


BOOK_DIR = Path(__file__).resolve().parent


def find_project_dir(start: Path) -> Path:
    logo_path = Path("frontend/src/assets/logo/heart.png")
    for candidate in (start, *start.parents):
        if (candidate / logo_path).is_file():
            return candidate
    raise FileNotFoundError("Could not locate the repository root from the book path")


PROJECT_DIR = find_project_dir(BOOK_DIR)
DEFAULT_SOURCE = BOOK_DIR / "THE_CITY_BETWEEN_US_PUBLIC_EDITION_EN.md"
DEFAULT_HTML = BOOK_DIR / "MYSCOUTEE_THE_STORY_PUBLIC_EDITION_EN.html"
DEFAULT_PDF = BOOK_DIR.parent / "renders" / "MyScoutee_The_Story_Public_Review_EN.pdf"
LOGO = PROJECT_DIR / "frontend" / "src" / "assets" / "logo" / "heart.png"
ILLUSTRATIONS = BOOK_DIR / "illustrations.json"
BOOK_VERSION = BOOK_DIR / "version.json"


def slugify(value: str) -> str:
    value = re.sub(r"[^a-zA-Z0-9]+", "-", value).strip("-").lower()
    return value or "section"


def inline_markdown(value: str) -> str:
    escaped = html.escape(value, quote=False)
    escaped = re.sub(
        r"\[([^\]]+)\]\((https?://[^)]+)\)",
        lambda match: (
            f'<a href="{html.escape(match.group(2), quote=True)}">'
            f"{match.group(1)}</a>"
        ),
        escaped,
    )
    escaped = re.sub(r"`([^`]+)`", r"<code>\1</code>", escaped)
    escaped = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", escaped)
    escaped = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"<em>\1</em>", escaped)
    return escaped


def data_url(path: Path) -> str:
    mime = "image/png" if path.suffix.lower() == ".png" else "image/jpeg"
    encoded = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:{mime};base64,{encoded}"


def render_illustration(key: str, registry: dict[str, dict[str, object]]) -> str:
    entry = registry.get(key)
    if not entry:
        raise ValueError(f"Unknown illustration key: {key}")

    filenames = entry.get("files") or [entry.get("file")]
    paths = [BOOK_DIR / str(name) for name in filenames if name]
    if not paths or not all(path.is_file() for path in paths):
        return ""

    placement = html.escape(str(entry.get("placement", "full")), quote=True)
    alt = html.escape(str(entry.get("alt", "Book illustration")), quote=True)
    caption = inline_markdown(str(entry.get("caption", "")))
    images = "".join(
        f'<img src="{data_url(path)}" alt="{alt}">' for path in paths
    )
    return (
        f'<figure class="illustration {placement}"><div class="image-set">'
        f"{images}</div><figcaption>{caption}</figcaption></figure>"
    )


def extract_front(lines: list[str]) -> tuple[dict[str, str], list[str]]:
    try:
        break_index = lines.index("<!-- pagebreak -->")
    except ValueError as exc:
        raise ValueError("The source needs a pagebreak after its cover metadata") from exc

    front = [line.strip() for line in lines[:break_index] if line.strip()]
    if len(front) < 3:
        raise ValueError("Incomplete title metadata")
    metadata = {
        "title": front[0].removeprefix("# "),
        "subtitle": front[1].removeprefix("## "),
        "tagline": front[2].strip("*"),
    }
    return metadata, lines[break_index + 1 :]


def load_book_version() -> dict[str, object]:
    version = json.loads(BOOK_VERSION.read_text(encoding="utf-8"))
    required = {
        "trilogy_volume",
        "trilogy_roman",
        "status",
        "version",
        "updated",
        "published",
    }
    missing = required.difference(version)
    if missing:
        raise ValueError(f"Missing book version fields: {sorted(missing)}")
    if version["status"] not in {"draft", "public"}:
        raise ValueError("Book status must be 'draft' or 'public'")
    if version["status"] == "public" and not version["published"]:
        raise ValueError("A public book version requires a publication date")
    return version


def collect_toc(lines: list[str]) -> list[tuple[int, str, str]]:
    toc: list[tuple[int, str, str]] = []
    for line in lines:
        if line.startswith("# "):
            title = line[2:].strip()
            toc.append((1, title, slugify(title)))
        elif line.startswith("## "):
            title = line[3:].strip()
            toc.append((2, title, slugify(title)))
    return toc


def markdown_to_html(
    lines: list[str], registry: dict[str, dict[str, object]]
) -> str:
    parts: list[str] = []
    index = 0
    while index < len(lines):
        stripped = lines[index].strip()
        if not stripped:
            index += 1
            continue
        if stripped == "<!-- pagebreak -->":
            lookahead = index + 1
            while lookahead < len(lines) and not lines[lookahead].strip():
                lookahead += 1
            if not (
                lookahead < len(lines)
                and lines[lookahead].strip().startswith("# ")
            ):
                parts.append('<div class="pagebreak"></div>')
            index += 1
            continue
        illustration = re.fullmatch(r"<!-- illustration: ([a-z0-9_]+) -->", stripped)
        if illustration:
            rendered = render_illustration(illustration.group(1), registry)
            if rendered:
                parts.append(rendered)
            index += 1
            continue
        if stripped == "---":
            parts.append("<hr>")
            index += 1
            continue
        if stripped.startswith("# "):
            title = stripped[2:].strip()
            parts.append(
                f'<section class="part-opener"><h1 id="{slugify(title)}">'
                f"{inline_markdown(title)}</h1></section>"
            )
            index += 1
            continue
        if stripped.startswith("## "):
            title = stripped[3:].strip()
            parts.append(
                f'<h2 id="{slugify(title)}">{inline_markdown(title)}</h2>'
            )
            index += 1
            continue
        if stripped.startswith("### "):
            title = stripped[4:].strip()
            parts.append(
                f'<h3 id="{slugify(title)}">{inline_markdown(title)}</h3>'
            )
            index += 1
            continue
        if stripped.startswith("> "):
            quote_lines: list[str] = []
            while index < len(lines) and lines[index].strip().startswith("> "):
                quote_lines.append(lines[index].strip()[2:])
                index += 1
            parts.append(
                f"<blockquote><p>{inline_markdown(' '.join(quote_lines))}</p></blockquote>"
            )
            continue
        if stripped.startswith("- "):
            items: list[str] = []
            while index < len(lines) and lines[index].strip().startswith("- "):
                item_lines = [lines[index].strip()[2:]]
                index += 1
                while index < len(lines):
                    continuation = lines[index].strip()
                    if not continuation or continuation.startswith(
                        ("#", "> ", "- ", "<!--")
                    ):
                        break
                    item_lines.append(continuation)
                    index += 1
                items.append(" ".join(item_lines))
            parts.append(
                "<ul>"
                + "".join(f"<li>{inline_markdown(item)}</li>" for item in items)
                + "</ul>"
            )
            continue

        paragraph_lines = [stripped]
        index += 1
        while index < len(lines):
            candidate = lines[index].strip()
            if not candidate:
                break
            if (
                candidate.startswith("#")
                or candidate.startswith("> ")
                or candidate.startswith("- ")
                or candidate.startswith("<!--")
            ):
                break
            paragraph_lines.append(candidate)
            index += 1
        parts.append(f"<p>{inline_markdown(' '.join(paragraph_lines))}</p>")
    return "\n".join(parts)


def stylesheet() -> str:
    return r"""
  :root {
    --ink: #172336; --muted: #617086; --paper: #fbf7ef;
    --night: #101d33; --blue: #245bc9; --violet: #6d4fd3;
    --gold: #f1b544; --coral: #e36c57;
  }
  * { box-sizing: border-box; }
  html { background: #d9dde4; }
  body {
    margin: 0 auto; width: 6in; background: var(--paper); color: var(--ink);
    font-family: Georgia, "Times New Roman", serif; font-size: 10.4pt;
    line-height: 1.53; text-rendering: optimizeLegibility;
  }
  @page {
    size: 6in 9in; margin: 0.68in 0.62in 0.7in;
    @bottom-center {
      content: counter(page); color: #7a8492; font: 8pt Arial, sans-serif;
    }
  }
  @page:first { margin: 0; @bottom-center { content: none; } }
  .cover {
    width: 6in; height: 9in; padding: 0.72in 0.72in 0.62in; color: #fff;
    background:
      radial-gradient(circle at 78% 18%, rgba(241,181,68,.34), transparent 18%),
      radial-gradient(circle at 22% 85%, rgba(109,79,211,.48), transparent 25%),
      linear-gradient(155deg, #101b31 0%, #153663 53%, #15182a 100%);
    position: relative; page-break-after: always; overflow: hidden;
  }
  .cover::after {
    content: ""; position: absolute; inset: 0.32in;
    border: 1px solid rgba(255,255,255,.24); border-radius: 22px;
  }
  .brand-lockup {
    align-items: center; display: flex; gap: .02em; position: relative; z-index: 2;
    font: 800 25pt/1 Arial, sans-serif; letter-spacing: .01em; color: #fff;
  }
  .brand-lockup img { height: 1.18em; width: 1.18em; object-fit: contain; }
  .cover .eyebrow {
    margin-top: .5in; font: 700 8pt/1.2 Arial, sans-serif; letter-spacing: .19em;
    text-transform: uppercase; color: #ffcf70; position: relative; z-index: 2;
  }
  .cover .volume-lockup {
    align-items: center; display: flex; gap: .18in; margin-top: .18in;
    position: relative; z-index: 2;
  }
  .cover .volume-roman {
    color: #fff; font: 400 92pt/.78 Georgia, "Times New Roman", serif;
    letter-spacing: -.08em;
  }
  .cover .volume-copy {
    border-left: 1px solid rgba(255,255,255,.28); color: #cddcf6;
    font: 700 8pt/1.45 Arial, sans-serif; letter-spacing: .14em;
    padding-left: .16in; text-transform: uppercase;
  }
  .cover h1 {
    margin: .13in 0 0; max-width: 4.35in; font-size: 38pt; line-height: .98;
    font-weight: 500; letter-spacing: -.035em; color: #fff;
    position: relative; z-index: 2;
  }
  .cover h2 {
    margin: .22in 0 0; max-width: 4in; font: 500 15pt/1.25 Arial, sans-serif;
    color: #cddcf6; position: relative; z-index: 2;
  }
  .cover .route {
    position: absolute; left: .72in; right: .72in; bottom: 1.55in; height: 1px;
    background: linear-gradient(90deg, #efb544, #e36c57, #8eaaf0); z-index: 2;
  }
  .cover .route::before, .cover .route::after {
    content: ""; position: absolute; top: -4px; width: 9px; height: 9px;
    border-radius: 50%; background: #fff;
  }
  .cover .route::before { left: 0; }
  .cover .route::after { right: 0; background: #efb544; }
  .cover .tagline {
    position: absolute; left: .72in; right: .72in; bottom: .86in;
    font: italic 10pt/1.4 Georgia, serif; color: #dce5f5; z-index: 2;
  }
  .cover .edition {
    display: block; margin-top: .12in; font: 7.5pt/1.3 Arial, sans-serif;
    letter-spacing: .08em; text-transform: uppercase; color: #93a5c1;
  }
  .title-page { page-break-after: always; padding-top: 1.2in; text-align: center; }
  .title-page .brand-lockup { justify-content: center; color: var(--night); font-size: 20pt; }
  .title-page .volume-roman {
    display: block; margin-top: .28in; color: var(--violet);
    font: 400 54pt/.9 Georgia, "Times New Roman", serif;
  }
  .title-page .volume-copy {
    display: block; color: var(--muted); font: 700 7.5pt/1.3 Arial, sans-serif;
    letter-spacing: .14em; text-transform: uppercase;
  }
  .title-page h1 { margin: .24in 0 .06in; font-size: 26pt; font-weight: 500; }
  .title-page h2 { margin: .12in 0; font: 500 14pt/1.3 Arial, sans-serif; color: var(--blue); }
  .title-page p { margin: .08in auto; max-width: 3.7in; color: var(--muted); }
  .title-page .edition {
    font: 700 7.5pt/1.4 Arial, sans-serif; letter-spacing: .08em;
    text-transform: uppercase;
  }
  .title-page .truth {
    margin-top: .62in; padding-top: .2in; border-top: 1px solid #d9cdbb;
    font: 8.5pt/1.5 Arial, sans-serif;
  }
  .toc { page-break-after: always; }
  .toc h1 { font-size: 24pt; font-weight: 500; margin: .2in 0 .28in; }
  .toc ol { list-style: none; margin: 0; padding: 0; columns: 2; column-gap: .34in; }
  .toc li { break-inside: avoid; margin: 0 0 .07in; line-height: 1.2; }
  .toc .level-1 {
    column-span: all; margin-top: .16in; font: 700 8pt/1.2 Arial, sans-serif;
    letter-spacing: .1em; text-transform: uppercase; color: var(--blue);
  }
  .toc .level-2 { font-size: 8.6pt; padding-left: .08in; }
  .toc a { color: inherit; text-decoration: none; }
  main > h2 {
    margin: .48in 0 .2in; font-size: 19pt; line-height: 1.12;
    font-weight: 500; color: var(--night); break-after: avoid;
  }
  main > h2::after {
    content: ""; display: block; width: .58in; margin-top: .12in;
    border-bottom: 3px solid var(--gold);
  }
  h3 { font: 700 10pt/1.3 Arial, sans-serif; color: var(--blue); break-after: avoid; }
  p { margin: 0 0 .14in; orphans: 3; widows: 3; }
  main > h2 + p::first-letter {
    float: left; margin: .035in .055in 0 0; font-size: 34pt;
    line-height: .72; color: var(--violet);
  }
  blockquote {
    margin: .28in .16in; padding: .18in .23in .18in .26in;
    border-left: 4px solid var(--coral); background: #f2ebdf;
    color: #2c3950; font-size: 12pt; font-style: italic; break-inside: avoid;
  }
  blockquote p { margin: 0; }
  hr { margin: .3in 0; border: 0; border-top: 1px solid #d9cdbb; }
  ul { margin: .12in 0 .22in .22in; padding-left: .16in; }
  li { margin-bottom: .07in; }
  a { color: #2759a8; overflow-wrap: anywhere; }
  code { font: 8pt/1.3 "DejaVu Sans Mono", monospace; }
  strong { color: #142f59; }
  .part-opener {
    min-height: 7.5in; margin: -.68in -.62in -.7in; padding: 2.65in .72in .7in;
    color: #fff;
    background: linear-gradient(150deg, rgba(36,91,201,.82), rgba(22,34,57,.96)), var(--night);
    page-break-before: always; page-break-after: always; position: relative; overflow: hidden;
  }
  .part-opener::before {
    content: ""; position: absolute; width: 3.7in; height: 3.7in;
    border: 1px solid rgba(255,255,255,.18); border-radius: 50%;
    top: -.8in; right: -1.2in;
    box-shadow: 0 0 0 .35in rgba(255,255,255,.035), 0 0 0 .7in rgba(255,255,255,.025);
  }
  .part-opener h1 {
    margin: 0; max-width: 4.4in; font-size: 30pt; line-height: 1.03;
    font-weight: 500; color: #fff; position: relative;
  }
  .part-opener h1::before {
    content: "MYSCOUTEE ORIGIN STORY"; display: block; margin-bottom: .22in;
    font: 700 7.5pt/1 Arial, sans-serif; letter-spacing: .18em; color: #ffcf70;
  }
  .pagebreak { page-break-before: always; height: 0; }
  .illustration { margin: .26in 0 .3in; break-inside: avoid; }
  .illustration img { display: block; width: 100%; border-radius: 12px; }
  .illustration figcaption {
    margin-top: .09in; font: italic 8.2pt/1.4 Georgia, serif; color: var(--muted);
  }
  .illustration.side-right { float: right; clear: right; width: 1.55in; margin: .02in 0 .16in .2in; }
  .illustration.side-right img { aspect-ratio: 4 / 5; object-fit: cover; }
  .illustration.full { clear: both; width: 100%; }
  .illustration.full img { max-height: 4.8in; object-fit: cover; }
  .illustration.portrait-grid { clear: both; }
  .illustration.portrait-grid .image-set {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: .09in;
  }
  .illustration.portrait-grid img { aspect-ratio: 4 / 5; object-fit: cover; }
  @media screen {
    body { box-shadow: 0 0 30px rgba(0,0,0,.18); }
    .title-page, .toc, main { padding-left: .62in; padding-right: .62in; }
    main { padding-bottom: .7in; }
  }
  @media print { html, body { background: var(--paper); } body { width: auto; } }
"""


def build_document(source: Path) -> str:
    lines = source.read_text(encoding="utf-8").splitlines()
    metadata, body_lines = extract_front(lines)
    registry = json.loads(ILLUSTRATIONS.read_text(encoding="utf-8"))
    version = load_book_version()
    toc_items = collect_toc(body_lines)
    logo_url = data_url(LOGO)

    toc = "\n".join(
        f'<li class="level-{level}"><a href="#{anchor}">{inline_markdown(title)}</a></li>'
        for level, title, anchor in toc_items
    )
    body = markdown_to_html(body_lines, registry)
    title = html.escape(metadata["title"])
    subtitle = html.escape(metadata["subtitle"])
    tagline = html.escape(metadata["tagline"])
    volume_roman = html.escape(str(version["trilogy_roman"]))
    edition_version = html.escape(str(version["version"]))
    updated = html.escape(str(version["updated"]))
    status = str(version["status"])
    if status == "draft":
        edition = f"Draft v{edition_version} · Not yet published · Updated {updated}"
        truth = (
            "An unpublished first-person review draft. Autobiographical memory "
            "is kept distinct from verified product capability and future "
            "product outcomes."
        )
    else:
        published = html.escape(str(version["published"]))
        edition = f"Public edition v{edition_version} · Published {published}"
        truth = (
            "A first-person public edition. Autobiographical memory is kept "
            "distinct from verified product capability and future product outcomes."
        )

    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="author" content="MyScoutee">
<meta name="description" content="A first-person MyScoutee origin story.">
<meta name="book-version" content="{edition_version}">
<meta name="book-status" content="{status}">
<meta name="trilogy-volume" content="{volume_roman}">
<title>{title} · Volume {volume_roman} · {subtitle} · v{edition_version}</title>
<style>{stylesheet()}</style>
</head>
<body>
<section class="cover" aria-label="{title}">
  <div class="brand-lockup" aria-label="MyScoutee">
    <img src="{logo_url}" alt="" aria-hidden="true"><span>yScoutee</span>
  </div>
  <div class="eyebrow">MyScoutee trilogy</div>
  <div class="volume-lockup" aria-label="Volume {volume_roman}">
    <span class="volume-roman">{volume_roman}</span>
    <span class="volume-copy">Volume one<br>of the trilogy</span>
  </div>
  <h1>The Story</h1>
  <h2>{subtitle}</h2>
  <div class="route"></div>
  <div class="tagline">{tagline}<span class="edition">{edition}</span></div>
</section>
<section class="title-page">
  <div class="brand-lockup" aria-label="MyScoutee">
    <img src="{logo_url}" alt="" aria-hidden="true"><span>yScoutee</span>
  </div>
  <span class="volume-roman">{volume_roman}</span>
  <span class="volume-copy">Volume one of the MyScoutee trilogy</span>
  <h1>The Story</h1>
  <h2>{subtitle}</h2>
  <p><em>{tagline}</em></p>
  <p class="edition">{edition}</p>
  <p class="truth">{truth}</p>
</section>
<nav class="toc"><h1>Contents</h1><ol>{toc}</ol></nav>
<main>{body}</main>
</body>
</html>
"""


def render_pdf(html_path: Path, pdf_path: Path, chrome: str) -> None:
    pdf_path.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        [
            chrome,
            "--headless=new",
            "--no-sandbox",
            "--disable-gpu",
            "--disable-dev-shm-usage",
            "--no-pdf-header-footer",
            f"--print-to-pdf={pdf_path}",
            html_path.resolve().as_uri(),
        ],
        check=True,
    )


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=DEFAULT_SOURCE)
    parser.add_argument("--html", type=Path, default=DEFAULT_HTML)
    parser.add_argument("--pdf", type=Path, default=DEFAULT_PDF)
    parser.add_argument("--chrome", default="google-chrome")
    parser.add_argument("--html-only", action="store_true")
    args = parser.parse_args()

    args.html.parent.mkdir(parents=True, exist_ok=True)
    args.html.write_text(build_document(args.source.resolve()), encoding="utf-8")
    print(f"Wrote {args.html}")
    if not args.html_only:
        render_pdf(args.html, args.pdf, args.chrome)
        print(f"Wrote {args.pdf}")


if __name__ == "__main__":
    main()
