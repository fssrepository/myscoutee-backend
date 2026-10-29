#!/usr/bin/env python3
"""Build the illustrated English-first MyScoutee mini-book and HU translation."""

import base64
import hashlib
import html
import json
import re
import shutil
import subprocess
import tempfile
from pathlib import Path

ROOT = next(candidate for candidate in Path(__file__).resolve().parents if (candidate / "myscoutee-frontend/src/assets/logo/heart.png").is_file())
BOOK = Path(__file__).resolve().parent
PACKAGE = BOOK
PUBLISHED = BOOK
LOGO = ROOT / "myscoutee-frontend/src/assets/logo/heart.png"
COVER_ART = BOOK / "assets/illustrations/after-door-opens.jpg"
DIVIDER_ORNAMENT = BOOK / "assets/ornaments/hungarian-symmetric-divider.svg"
INITIAL_ORNAMENT = BOOK / "assets/ornaments/hungarian-symmetric-initial.svg"
VERSION = BOOK / "version.json"
DECORATED_CHAPTERS = frozenset({1, 4, 6, 9})

EDITIONS = [
    {
        "lang": "en",
        "source": BOOK / "A_MATCH_IS_NOT_A_MEETING_EN.md",
        "html": BOOK / "A_MATCH_IS_NOT_A_MEETING_EN.html",
        "draft": BOOK / "MyScoutee_A_Match_Is_Not_A_Meeting_v1.0.0_EN.pdf",
        "public": PUBLISHED / "MyScoutee_A_Match_Is_Not_A_Meeting_v1.0.0_EN.pdf",
        "metadata": BOOK / "metadata.en.json",
        "illustrations": BOOK / "illustrations.json",
        "running": "MYSCOUTEE · THE PRODUCT · A MATCH IS NOT A MEETING",
        "eyebrow": "MYSCOUTEE PRODUCT",
        "product": "The Product",
        "edition": "First English edition",
        "published": "Published 20 August 2026",
        "holiday": "(Hungary’s State Foundation Day)",
        "contents": "Contents",
        "toc_section": "The product journey",
    },
    {
        "lang": "hu",
        "source": BOOK / "A_MATCH_NEM_TALALKOZAS_HU.md",
        "html": BOOK / "A_MATCH_NEM_TALALKOZAS_HU.html",
        "draft": BOOK / "MyScoutee_A_Match_Nem_Talalkozas_v1.0.0_HU.pdf",
        "public": PUBLISHED / "MyScoutee_A_Match_Nem_Talalkozas_v1.0.0_HU.pdf",
        "metadata": BOOK / "metadata.hu.json",
        "illustrations": BOOK / "illustrations.hu.json",
        "running": "MYSCOUTEE · A TERMÉK · A MATCH NEM TALÁLKOZÁS",
        "eyebrow": "MYSCOUTEE TERMÉK",
        "product": "A termék",
        "edition": "Első magyar kiadás",
        "published": "Megjelent 2026. augusztus 20.",
        "holiday": "(Magyarország államalapításának ünnepe)",
        "contents": "Tartalom",
        "toc_section": "A termék útja",
    },
]


def data_url(path: Path) -> str:
    mime = {
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".svg": "image/svg+xml",
    }.get(path.suffix.lower(), "application/octet-stream")
    return f"data:{mime};base64,{base64.b64encode(path.read_bytes()).decode('ascii')}"


def inline(text: str) -> str:
    escaped = html.escape(text)
    escaped = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", escaped)
    escaped = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"<em>\1</em>", escaped)
    escaped = re.sub(r"`(.+?)`", r"<code>\1</code>", escaped)
    return escaped


def render_illustration(key: str, registry: dict) -> str:
    entry = registry.get(key)
    if not entry:
        raise ValueError(f"Unknown illustration key: {key}")
    path = BOOK / entry["file"]
    if not path.is_file():
        raise FileNotFoundError(path)
    placement = html.escape(entry.get("placement", "full"), quote=True)
    alt = html.escape(entry.get("alt", "Book illustration"), quote=True)
    caption = inline(entry.get("caption", ""))
    return (
        f"<figure class='illustration {placement}'>"
        f"<img src='{data_url(path)}' alt='{alt}'/>"
        f"<figcaption>{caption}</figcaption></figure>"
    )


def chapter_entries(source: str) -> list[tuple[int, str, str]]:
    entries = []
    for number, line in enumerate(
        (line for line in source.splitlines() if line.startswith("## ")), start=1
    ):
        entries.append((number, line[3:].strip(), f"chapter-{number:02d}"))
    if not entries:
        raise ValueError("The manuscript must contain numbered H2 chapters")
    return entries


def markdown_blocks(source: str, registry: dict) -> str:
    lines = source.splitlines()
    start = next((index for index, line in enumerate(lines) if line.startswith("## ")), None)
    if start is None:
        raise ValueError("The manuscript must contain numbered H2 chapters")
    lines = lines[start:]
    out: list[str] = []
    paragraph: list[str] = []
    list_kind: str | None = None
    section_open = False
    chapter_number = 0
    pending_drop_cap = False
    lead_open = False

    def flush_paragraph() -> None:
        nonlocal paragraph, pending_drop_cap, lead_open
        if paragraph:
            value = " ".join(line.strip() for line in paragraph)
            first = re.match(r"([^\W\d_])", value, flags=re.UNICODE)
            if pending_drop_cap and first:
                letter = first.group(1)
                out.append(
                    "<p class='chapter-opening'>"
                    f"<span class='drop-cap'>{html.escape(letter)}</span>"
                    f"{inline(value[len(letter):])}</p>"
                )
            else:
                out.append(f"<p>{inline(value)}</p>")
            if lead_open:
                out.append("</div>")
                lead_open = False
            pending_drop_cap = False
            paragraph = []

    def close_list() -> None:
        nonlocal list_kind
        if list_kind:
            out.append(f"</{list_kind}>")
            list_kind = None

    def close_section() -> None:
        nonlocal section_open, lead_open
        if section_open:
            flush_paragraph()
            close_list()
            if lead_open:
                out.append("</div>")
                lead_open = False
            out.append("</section>")
            section_open = False

    for line in lines:
        if not line.strip():
            flush_paragraph()
            close_list()
            continue
        if line.startswith("## "):
            close_section()
            chapter_number += 1
            pending_drop_cap = chapter_number in DECORATED_CHAPTERS
            out.append(
                f"<section class='chapter' id='chapter-{chapter_number:02d}'>"
                f"<div class='chapter-lead'><h2>{inline(line[3:])}</h2>"
            )
            lead_open = True
            section_open = True
            continue
        anchor = re.fullmatch(r"<!--\s*illustration:\s*([a-z0-9_]+)\s*-->", line.strip())
        if anchor:
            flush_paragraph()
            close_list()
            out.append(render_illustration(anchor.group(1), registry))
            continue
        numbered = re.match(r"^(\d+)\.\s+(.*)", line)
        bullet = re.match(r"^-\s+(.*)", line)
        if numbered or bullet:
            flush_paragraph()
            wanted = "ol" if numbered else "ul"
            if list_kind != wanted:
                close_list()
                out.append(f"<{wanted}>")
                list_kind = wanted
            out.append(f"<li>{inline((numbered or bullet).group(2 if numbered else 1))}</li>")
            continue
        paragraph.append(line)
    close_section()
    return "\n".join(out)


def build_html(edition: dict) -> str:
    metadata = json.loads(edition["metadata"].read_text(encoding="utf-8"))
    registry = json.loads(edition["illustrations"].read_text(encoding="utf-8"))
    logo_url = data_url(LOGO)
    source_text = edition["source"].read_text(encoding="utf-8")
    chapters = chapter_entries(source_text)
    body = markdown_blocks(source_text, registry)
    toc = (
        f"<li class='level-1'>{html.escape(edition['toc_section'])}</li>\n"
        + "\n".join(
        f"<li class='level-2'><a href='#chapter-{number:02d}'>{inline(title)}</a></li>"
        for number, title, _ in chapters
        )
    )
    divider_url = data_url(DIVIDER_ORNAMENT)
    initial_url = data_url(INITIAL_ORNAMENT)
    cover_alt = html.escape(registry["after_door_opens"]["alt"], quote=True)
    cover = f"""
<section class='cover' aria-label='{html.escape(metadata['title'], quote=True)}'>
  <div class='brand-lockup'><img src='{logo_url}' alt=''/><span>yScoutee</span></div>
  <div class='eyebrow'>{edition['eyebrow']}</div>
  <div class='product-label'>{edition['product']}</div>
  <h1>{html.escape(metadata['title'])}</h1>
  <img class='cover-art' src='{data_url(COVER_ART)}' alt='{cover_alt}'/>
  <div class='route'></div>
  <div class='tagline'><em>{html.escape(metadata['subtitle'])}</em></div>
  <div class='edition'>
    <span>{edition['edition']}</span>
    <span>{edition['published']}</span>
    <small>{edition['holiday']}</small>
  </div>
</section>"""
    contents = f"""
<nav class='toc'>
  <h1>{edition['contents']}</h1>
  <ol>{toc}</ol>
  <img class='folk-divider toc-divider' src='{divider_url}' alt=''/>
</nav>"""
    return f"""<!doctype html>
<html lang='{edition['lang']}'><head><meta charset='utf-8'/>
<meta name='author' content='MyScoutee'/>
<meta name='description' content='{html.escape(metadata['subject'], quote=True)}'/>
<title>{html.escape(metadata['title'])}</title>
<style>
:root {{ --ink:#172336; --muted:#617086; --paper:#fbf7ef; --night:#101d33;
  --blue:#245bc9; --gold:#f1b544; --violet:#6d4fd3; --coral:#e36c57; }}
* {{ box-sizing:border-box; }}
html {{ background:#d9dde4; }}
body {{ margin:0; background:var(--paper); color:var(--ink);
  font:10.4pt/1.48 Georgia,"Times New Roman",serif; hyphens:auto;
  text-rendering:optimizeLegibility; }}
html[lang='hu'] body {{ font-size:10.25pt; line-height:1.45; }}
@page {{ size:6in 9in; margin:.68in .62in .7in;
  @bottom-center {{ content:counter(page); color:#7a8492;
    font:8pt Arial,sans-serif; }} }}
@page cover {{ size:6in 9in; margin:.68in .62in .7in;
  @bottom-center {{ content:none; }} }}
.cover {{ width:4.76in; height:7.62in; margin:0; padding:.38in .46in .34in;
  page:cover; page-break-after:always; overflow:hidden; position:relative; text-align:center;
  color:#fff; display:flex; flex-direction:column; align-items:center;
  background:radial-gradient(circle at 78% 17%,rgba(241,181,68,.3),transparent 18%),
  radial-gradient(circle at 20% 86%,rgba(109,79,211,.48),transparent 25%),
  linear-gradient(155deg,#101b31 0%,#153663 54%,#15182a 100%); }}
.cover::after {{ content:''; position:absolute; inset:.2in; border:1px solid rgba(255,255,255,.24);
  border-radius:22px; pointer-events:none; }}
.brand-lockup {{ display:flex; align-items:center; justify-content:center; gap:.02em;
  font:800 25pt/1 Arial,sans-serif; letter-spacing:.01em; color:#fff; z-index:2; }}
.brand-lockup img {{ width:1.18em; height:1.18em; object-fit:contain; }}
.eyebrow {{ margin-top:.22in; color:#ffcf70; font:700 8pt/1.2 Arial,sans-serif;
  letter-spacing:.19em; text-transform:uppercase; z-index:2; }}
.product-label {{ margin-top:.14in; color:#fff; font:500 30pt/1 Georgia,serif; z-index:2; }}
.cover h1 {{ margin:.1in auto 0; max-width:3.75in; color:#cddcf6;
  font:500 19pt/1.04 Arial,sans-serif; letter-spacing:-.02em; z-index:2; }}
.cover-art {{ width:3.78in; height:2.12in; margin-top:.2in; object-fit:cover;
  object-position:center 48%; border-radius:14px; border:1px solid rgba(255,255,255,.3);
  box-shadow:0 10px 28px rgba(0,0,0,.34); z-index:2; }}
.route {{ width:3.72in; height:1px; margin-top:.2in; position:relative;
  background:linear-gradient(90deg,#efb544,#e36c57,#8eaaf0); z-index:2; }}
.route::before,.route::after {{ content:''; position:absolute; top:-4px; width:9px;
  height:9px; border-radius:50%; background:#fff; }}
.route::before {{ left:0; }} .route::after {{ right:0; background:#efb544; }}
.tagline {{ margin-top:.2in; color:#dce5f5; font:italic 10pt/1.35 Georgia,serif; z-index:2; }}
.edition {{ margin-top:.14in; color:#aebbd0; font:7.5pt/1.32 Arial,sans-serif;
  letter-spacing:.08em; text-transform:uppercase; z-index:2; }}
.edition span,.edition small {{ display:block; }} .edition small {{ font-size:.88em; }}
.toc {{ height:7.62in; page-break-after:always; display:flex; flex-direction:column;
  position:relative; }}
.toc h1 {{ margin:.2in 0 .28in; font-size:24pt; font-weight:500; }}
.toc ol {{ list-style:none; margin:0; padding:0; columns:2; column-gap:.34in; }}
.toc li {{ break-inside:avoid; margin:0 0 .07in; line-height:1.2; }}
.toc .level-1 {{ column-span:all; margin-top:.16in;
  color:var(--blue); font:700 8pt/1.2 Arial,sans-serif;
  letter-spacing:.1em; text-transform:uppercase; }}
.toc .level-2 {{ padding-left:.08in; font-size:8.6pt; }}
.toc a {{ color:inherit; text-decoration:none; }}
.chapter {{ margin:.34in 0 0; position:relative; }}
.chapter:first-child {{ margin-top:.12in; }}
.chapter-lead {{ break-inside:avoid; page-break-inside:avoid; }}
h2 {{ color:var(--night); font:500 19pt/1.12 Georgia,serif; margin:0 0 .18in;
  break-after:avoid; page-break-after:avoid; }}
h2::after {{ content:''; display:block; width:100%; height:2px; margin-top:.1in;
  background:linear-gradient(90deg,var(--gold),var(--coral) 46%,rgba(109,79,211,.12)); }}
p {{ margin:0 0 .12in; orphans:3; widows:3; }} strong {{ color:#132d49; }}
.drop-cap {{ display:inline-block; width:.48in; height:.47in; margin:0 .055in 0 0;
  color:#172336; text-align:center; vertical-align:baseline;
  background:url('{initial_url}') center 88%/.5in auto no-repeat;
  font:500 31pt/.47in Georgia,serif;
  text-shadow:-1px -1px 0 rgba(255,255,255,.92),1px 1px 0 rgba(255,255,255,.92); }}
ol,ul {{ margin:0 0 .2in .22in; padding-left:.2in; }} li {{ margin-bottom:.08in; }}
code {{ font-family:monospace; background:#eef2f5; padding:.1em .25em; }}
.illustration {{ margin:.12in 0 .18in; page-break-inside:avoid; }}
.illustration img {{ display:block; width:100%; max-height:2.18in; object-fit:cover;
  border-radius:12px; border:1px solid #d5c8b6; }}
.illustration figcaption {{ margin-top:.07in; color:#617086;
  font:italic 8.3pt/1.35 Georgia,serif; text-align:center; }}
.folk-divider {{ display:block; width:3.55in; height:auto; margin-left:auto;
  margin-right:auto; break-inside:avoid; page-break-inside:avoid; }}
.toc-divider {{ margin-top:auto; margin-bottom:.1in; }}
.final-divider {{ width:1.45in; margin-top:.08in; margin-bottom:0; }}
@media print {{ html,body {{ background:var(--paper); }} }}
</style></head><body>{cover}{contents}<main>{body}
<img class='folk-divider final-divider' src='{divider_url}' alt=''/>
</main></body></html>"""


def main() -> None:
    chrome = shutil.which("google-chrome") or shutil.which("chromium")
    if not chrome:
        raise RuntimeError("google-chrome or chromium is required")
    version = json.loads(VERSION.read_text(encoding="utf-8"))
    PUBLISHED.mkdir(parents=True, exist_ok=True)
    for edition in EDITIONS:
        html_path = edition["html"]
        draft = edition["draft"]
        public = edition["public"]
        html_path.write_text(build_html(edition), encoding="utf-8")
        with tempfile.TemporaryDirectory(prefix="myscoutee-mini-book-") as profile:
            subprocess.run([
                chrome, "--headless", "--no-sandbox", "--disable-gpu",
                "--disable-dev-shm-usage", "--no-pdf-header-footer",
                f"--user-data-dir={profile}", f"--print-to-pdf={draft}",
                html_path.resolve().as_uri()
            ], check=True)
        digest = hashlib.sha256(public.read_bytes()).hexdigest()
        public.with_suffix(public.suffix + ".sha256").write_text(
            f"{digest}  {public.name}\n", encoding="utf-8"
        )
        metadata = json.loads(edition["metadata"].read_text(encoding="utf-8"))
        record = {
            "file": public.name,
            "sha256": digest,
            "kind": "standalone-product-mini-book",
            "edition_version": version["version"],
            "published": version["published"],
            "sourceLanguage": "en",
            "translationOf": None if edition["lang"] == "en" else EDITIONS[0]["public"].name,
            "metadata": metadata,
        }
        public.with_suffix(".publication.json").write_text(
            json.dumps(record, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
        print(html_path.relative_to(ROOT))
        print(public.relative_to(ROOT))


if __name__ == "__main__":
    main()
