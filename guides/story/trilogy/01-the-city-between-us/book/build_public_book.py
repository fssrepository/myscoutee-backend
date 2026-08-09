#!/usr/bin/env python3
"""Build the English MyScoutee public edition as HTML and PDF."""

from __future__ import annotations

import argparse
import base64
import hashlib
import html
import json
import re
import subprocess
import tempfile
from datetime import date
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
BOOK_DRAFT_DIR = BOOK_DIR / "draft"
PUBLISHED_DIR = BOOK_DIR.parent / "published"
LOGO = PROJECT_DIR / "frontend" / "src" / "assets" / "logo" / "heart.png"
COVER_EMBLEM = BOOK_DIR / "assets" / "cover-emblem-v1.png"
ILLUSTRATIONS = BOOK_DIR / "illustrations.json"
BOOK_VERSION = BOOK_DIR / "version.json"
BOOK_METADATA = BOOK_DIR / "metadata.json"
ENDING_MOTIF_DIR = BOOK_DIR / "assets" / "ending-motifs"
ENDING_MOTIFS = (
    (ENDING_MOTIF_DIR / "01-roots-and-open-horizon.svg", "Roots and the open horizon"),
    (ENDING_MOTIF_DIR / "02-ground-key-and-gate.svg", "Ground, key, and gate"),
    (ENDING_MOTIF_DIR / "03-house-between-cities.svg", "The house between cities"),
    (ENDING_MOTIF_DIR / "04-indigo-world-routes.svg", "Indigo world routes"),
    (
        ENDING_MOTIF_DIR / "05-human-heart-and-encounter.svg",
        "Human heart and encounter",
    ),
    (
        ENDING_MOTIF_DIR / "06-lace-network-and-star.svg",
        "Lace network and star",
    ),
    (
        ENDING_MOTIF_DIR / "07-notebook-truth-and-return.svg",
        "Notebook, truth, and return",
    ),
)
OPENER_WATERMARKS = tuple(path for path, _ in ENDING_MOTIFS)
OPENER_WATERMARKS = (
    *OPENER_WATERMARKS[:3],
    BOOK_DIR / "assets" / "opener-watermarks" / "04-indigo-world-routes.svg",
    *OPENER_WATERMARKS[4:],
)
# The closing chapters of Part Four use deliberately tighter paragraph spacing
# so their short lines return to the preceding page and the complete encounter
# motif can remain below the prose, without colliding with it or spilling onto
# an otherwise empty page.
COMPACT_ENDING_MOTIF_INDEXES = frozenset({1, 4})
SHORT_CHAPTER_WORD_LIMIT = 250


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


def render_dropcap_paragraph(value: str, context: int) -> str:
    first_letter = re.match(r"([A-Za-z])", value)
    if not first_letter:
        return f"<p>{inline_markdown(value)}</p>"
    letter = first_letter.group(1)
    return (
        f'<p><span class="drop-cap context-{context}">{letter}</span>'
        f"{inline_markdown(value[1:])}</p>"
    )


def data_url(path: Path) -> str:
    mime = {
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".svg": "image/svg+xml",
    }.get(path.suffix.lower(), "application/octet-stream")
    encoded = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:{mime};base64,{encoded}"


def render_ending_motif(index: int) -> str:
    motif_path, label = ENDING_MOTIFS[index]
    return (
        f'<figure class="folk-divider divider-{index + 1}" '
        f'aria-label="{html.escape(label, quote=True)}">'
        f'<img src="{data_url(motif_path)}" alt="">'
        "</figure>"
    )


def render_full_page_motif(index: int) -> str:
    motif_path, label = ENDING_MOTIFS[index]
    return (
        f'<section class="full-page-motif divider-{index + 1}" '
        f'aria-label="{html.escape(label, quote=True)}">'
        f'<img src="{data_url(motif_path)}" alt="">'
        "</section>"
    )


def append_ending_tail(parts: list[str], motif_index: int) -> None:
    """Keep a meaningful closing text unit on the stamped ornament page."""
    if not parts:
        raise ValueError("An ending motif requires preceding content")
    if motif_index in COMPACT_ENDING_MOTIF_INDEXES:
        tail_count = min(14 if motif_index == 1 else 27, len(parts))
        tail = parts[-tail_count:]
        del parts[-tail_count:]
        closing_count = min(3, len(tail))
        leading = tail[:-closing_count]
        closing = tail[-closing_count:]
        compact_class = (
            "compact-ending-tail compact-ending-tail-tight"
            if motif_index == 1
            else "compact-ending-tail"
        )
        parts.append(
            f'<div class="{compact_class}">'
            + "\n".join(leading)
            + '<div class="ending-tail">'
            + "\n".join(closing)
            + "\n"
            + render_ending_motif(motif_index)
            + "</div>"
            + "</div>"
        )
        return

    # Invitation and colophon pages already supply their own full-page layout.
    # Ordinary part endings keep their final three rendered blocks together so
    # a short final sentence or the invisible ornament spacer cannot spill onto
    # an otherwise empty page.
    final_block = parts[-1]
    tail_count = (
        1
        if "closing-invitation" in final_block or "edition-colophon" in final_block
        else min(3, len(parts))
    )
    tail = parts[-tail_count:]
    del parts[-tail_count:]
    parts.append(
        '<div class="ending-tail">'
        + "\n".join(tail)
        + "\n"
        + render_ending_motif(motif_index)
        + "</div>"
    )


def render_illustration(key: str, registry: dict[str, dict[str, object]]) -> str:
    entry = registry.get(key)
    if not entry:
        raise ValueError(f"Unknown illustration key: {key}")

    filenames = entry.get("files") or [entry.get("file")]
    paths = [BOOK_DIR / str(name) for name in filenames if name]
    if not paths or not all(path.is_file() for path in paths):
        return ""

    placement = html.escape(str(entry.get("placement", "full")), quote=True)
    count_class = f" count-{len(paths)}" if len(paths) > 1 else ""
    alt = html.escape(str(entry.get("alt", "Book illustration")), quote=True)
    caption = inline_markdown(str(entry.get("caption", "")))
    images = "".join(
        f'<img src="{data_url(path)}" alt="{alt}">' for path in paths
    )
    return (
        f'<figure class="illustration {placement}{count_class}"><div class="image-set">'
        f"{images}</div><figcaption>{caption}</figcaption></figure>"
    )


def keep_short_chapter_together(parts: list[str], start_index: int | None) -> None:
    """Keep a genuinely short numbered chapter on one printed page."""
    if start_index is None or start_index >= len(parts):
        return
    chapter = parts[start_index:]
    if not chapter or not chapter[0].startswith(("<h2 ", '<div class="chapter-lead">')):
        return
    plain_text = html.unescape(re.sub(r"<[^>]+>", " ", " ".join(chapter)))
    word_count = len(re.findall(r"\b[\w’'-]+\b", plain_text))
    if word_count > SHORT_CHAPTER_WORD_LIMIT:
        return
    parts[start_index:] = [
        '<section class="short-chapter">' + "\n".join(chapter) + "</section>"
    ]


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
        "trilogy_part",
        "trilogy_roman",
        "status",
        "version",
        "locked",
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
    if not isinstance(version["locked"], bool):
        raise ValueError("Book locked state must be a boolean")
    return version


def load_book_metadata() -> dict[str, object]:
    metadata = json.loads(BOOK_METADATA.read_text(encoding="utf-8"))
    required = {
        "title",
        "author",
        "subject",
        "keywords",
        "creator",
        "language",
        "copyright",
    }
    missing = required.difference(metadata)
    if missing:
        raise ValueError(f"Missing book metadata fields: {sorted(missing)}")
    for field in required.difference({"keywords"}):
        if not isinstance(metadata[field], str) or not metadata[field].strip():
            raise ValueError(f"Book metadata field '{field}' must be non-empty text")
    if not isinstance(metadata["keywords"], list) or not all(
        isinstance(keyword, str) and keyword.strip()
        for keyword in metadata["keywords"]
    ):
        raise ValueError("Book metadata keywords must be a non-empty-text list")
    return metadata


def versioned_pdf_name(version: dict[str, object]) -> str:
    return (
        "MyScoutee_The_Story_Part_I_The_City_Between_Us_"
        f"v{version['version']}_EN.pdf"
    )


def default_pdf_path(version: dict[str, object]) -> Path:
    stage_dir = PUBLISHED_DIR if version["locked"] else BOOK_DRAFT_DIR
    return stage_dir / versioned_pdf_name(version)


def draft_pdf_path(version: dict[str, object]) -> Path:
    return BOOK_DRAFT_DIR / versioned_pdf_name(version)


def display_date(value: object) -> str:
    parsed = date.fromisoformat(str(value))
    return f"{parsed.day} {parsed.strftime('%B')} {parsed.year}"


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
    ending_motif_index = 0
    current_context = 0
    pending_drop_cap_context: int | None = None
    numbered_chapter_start: int | None = None
    chapter_lead_start: int | None = None
    while index < len(lines):
        stripped = lines[index].strip()
        if not stripped:
            index += 1
            continue
        if stripped == "<!-- pagebreak -->":
            keep_short_chapter_together(parts, numbered_chapter_start)
            numbered_chapter_start = None
            chapter_lead_start = None
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
        if stripped == "<!-- closing-invitation -->":
            index += 1
            while index < len(lines) and not lines[index].strip():
                index += 1
            if index >= len(lines):
                raise ValueError("Closing invitation marker requires text")
            parts.append(
                '<div class="closing-invitation">'
                f"{inline_markdown(lines[index].strip())}</div>"
            )
            index += 1
            continue
        if stripped == "<!-- edition-colophon -->":
            index += 1
            colophon_lines: list[str] = []
            while index < len(lines):
                line = lines[index].strip()
                if line:
                    colophon_lines.append(line)
                index += 1
            if not colophon_lines:
                raise ValueError("Edition colophon marker requires text")
            parts.append(
                '<div class="edition-colophon">'
                + "".join(
                    f"<p>{inline_markdown(line)}</p>" for line in colophon_lines
                )
                + "</div>"
            )
            continue
        if stripped.startswith("# "):
            keep_short_chapter_together(parts, numbered_chapter_start)
            numbered_chapter_start = None
            chapter_lead_start = None
            title = stripped[2:].strip()
            if parts:
                append_ending_tail(parts, ending_motif_index)
                ending_motif_index += 1
            current_context = ending_motif_index
            opener_motif = OPENER_WATERMARKS[ending_motif_index]
            parts.append(
                f'<section class="part-opener opener-{ending_motif_index}">'
                f'<h1 id="{slugify(title)}">{inline_markdown(title)}</h1>'
                f'<img class="opener-watermark" src="{data_url(opener_motif)}" '
                'alt="" aria-hidden="true"></section>'
            )
            index += 1
            continue
        if stripped.startswith("## "):
            keep_short_chapter_together(parts, numbered_chapter_start)
            title = stripped[3:].strip()
            is_numbered_chapter = re.match(r"\d+\.\s", title) is not None
            numbered_chapter_start = len(parts) if is_numbered_chapter else None
            chapter_lead_start = len(parts) if is_numbered_chapter else None
            parts.append(
                f'<h2 class="context-{current_context}" id="{slugify(title)}">'
                f"{inline_markdown(title)}</h2>"
            )
            pending_drop_cap_context = current_context
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
            pending_drop_cap_context = None
            quote_lines: list[str] = []
            while index < len(lines) and lines[index].strip().startswith("> "):
                quote_lines.append(lines[index].strip()[2:])
                index += 1
            parts.append(
                f"<blockquote><p>{inline_markdown(' '.join(quote_lines))}</p></blockquote>"
            )
            continue
        if stripped.startswith("- "):
            pending_drop_cap_context = None
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
        paragraph = " ".join(paragraph_lines)
        if pending_drop_cap_context is None:
            parts.append(f"<p>{inline_markdown(paragraph)}</p>")
        else:
            parts.append(render_dropcap_paragraph(paragraph, pending_drop_cap_context))
            pending_drop_cap_context = None
        if chapter_lead_start is not None:
            lead = parts[chapter_lead_start:]
            if not any('class="illustration ' in block for block in lead):
                parts[chapter_lead_start:] = [
                    '<div class="chapter-lead">' + "\n".join(lead) + "</div>"
                ]
            chapter_lead_start = None
    keep_short_chapter_together(parts, numbered_chapter_start)
    append_ending_tail(parts, ending_motif_index)
    ending_motif_index += 1
    if ending_motif_index != len(ENDING_MOTIFS):
        raise ValueError(
            "The manuscript structure requires exactly "
            f"{len(ENDING_MOTIFS)} ending motifs, found {ending_motif_index}"
        )
    return "\n".join(parts)


def stylesheet() -> str:
    base = r"""
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
  @page cover {
    size: 6in 9in; margin: 0.68in 0.62in 0.7in;
    @bottom-center { content: none; }
  }
  @page part {
    size: 6in 9in; margin: 0.68in 0.62in 0.7in;
    @bottom-center { content: none; }
  }
  .cover {
    page: cover; width: 4.76in; height: 7.62in; margin: 0;
    padding: 0.52in 0.52in 0.46in; color: #fff;
    background:
      radial-gradient(circle at 78% 18%, rgba(241,181,68,.34), transparent 18%),
      radial-gradient(circle at 22% 85%, rgba(109,79,211,.48), transparent 25%),
      linear-gradient(155deg, #101b31 0%, #153663 53%, #15182a 100%);
    position: relative; page-break-after: always; overflow: hidden;
    text-align: center;
  }
  .cover::after {
    content: ""; position: absolute; inset: 0.24in;
    border: 1px solid rgba(255,255,255,.24); border-radius: 22px;
  }
  .brand-lockup {
    align-items: center; display: flex; gap: .02em; position: relative; z-index: 2;
    font: 800 25pt/1 Arial, sans-serif; letter-spacing: .01em; color: #fff;
  }
  .brand-lockup img { height: 1.18em; width: 1.18em; object-fit: contain; }
  .cover .brand-lockup { justify-content: center; }
  .cover .eyebrow {
    margin-top: .5in; font: 700 8pt/1.2 Arial, sans-serif; letter-spacing: .19em;
    text-transform: uppercase; color: #ffcf70; position: relative; z-index: 2;
  }
  .cover .volume-lockup {
    align-items: center; display: flex; gap: .18in; margin-top: .18in;
    justify-content: center; position: relative; z-index: 2;
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
    margin: .13in auto 0; max-width: 3.72in; font-size: 34pt; line-height: .98;
    font-weight: 500; letter-spacing: -.035em; color: #fff;
    position: relative; z-index: 2;
  }
  .cover h2 {
    margin: .2in auto 0; max-width: 3.62in; font: 500 13pt/1.25 Arial, sans-serif;
    color: #cddcf6; position: relative; z-index: 2;
  }
  .cover .story-emblem {
    display: block; height: auto; left: .27in; position: absolute; top: 4.35in;
    width: 4.22in; z-index: 2;
  }
  .cover .route {
    position: absolute; left: .52in; right: .52in; bottom: 1.3in; height: 1px;
    background: linear-gradient(90deg, #efb544, #e36c57, #8eaaf0); z-index: 2;
  }
  .cover .route::before, .cover .route::after {
    content: ""; position: absolute; top: -4px; width: 9px; height: 9px;
    border-radius: 50%; background: #fff;
  }
  .cover .route::before { left: 0; }
  .cover .route::after { right: 0; background: #efb544; }
  .cover .tagline {
    position: absolute; left: .52in; right: .52in; bottom: .6in;
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
  main h2 {
    margin: .48in 0 .08in; font-size: 19pt; line-height: 1.12;
    font-weight: 500; color: var(--night); break-after: avoid;
  }
  main h2::after {
    background: var(--chapter-divider); content: ""; display: block;
    height: 2px; margin-top: .12in; width: 100%;
  }
  main h2.context-0 {
    --chapter-divider: linear-gradient(90deg, #b52d3b 0%, #2d7650 44%, rgba(45,118,80,.12) 100%);
  }
  main h2.context-1 {
    --chapter-divider: linear-gradient(90deg, #718050 0%, #f1b544 42%, rgba(113,128,80,.12) 100%);
  }
  main h2.context-2 {
    --chapter-divider: linear-gradient(90deg, #8f4f64 0%, #73849c 44%, rgba(115,132,156,.12) 100%);
  }
  main h2.context-3 {
    --chapter-divider: linear-gradient(90deg, #1f6f91 0%, #8fc6e8 44%, rgba(31,111,145,.12) 100%);
  }
  main h2.context-4 {
    --chapter-divider: linear-gradient(90deg, #a94359 0%, #e29a7c 44%, rgba(169,67,89,.12) 100%);
  }
  main h2.context-5 {
    --chapter-divider: linear-gradient(90deg, #6755b5 0%, #9ea7df 44%, rgba(103,85,181,.12) 100%);
  }
  main h2.context-6 {
    --chapter-divider: linear-gradient(90deg, #8a573a 0%, #d1a164 44%, rgba(138,87,58,.12) 100%);
  }
  h3 { font: 700 10pt/1.3 Arial, sans-serif; color: var(--blue); break-after: avoid; }
  p { margin: 0 0 .14in; orphans: 3; widows: 3; }
  .chapter-lead { break-inside: avoid; page-break-inside: avoid; }
  .short-chapter { break-inside: avoid; page-break-inside: avoid; }
  .short-chapter > h2:first-child { margin-top: .48in; }
  .drop-cap {
    background-position: center; background-repeat: no-repeat;
    background-size: 2.28in auto; color: #18263b; display: inline-block;
    font: 500 31pt/.47in Georgia, "Times New Roman", serif;
    height: .47in; margin: 0 .055in 0 0; text-align: center;
    text-shadow: -1px -1px 0 rgba(255,255,255,.9), 1px 1px 0 rgba(255,255,255,.9);
    vertical-align: baseline; width: .48in;
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
  .closing-invitation {
    display: block; margin: .65in 0 .12in; padding: .12in .2in;
    text-align: center;
    font: 600 17pt/1.35 Georgia, "Times New Roman", serif; color: #142f59;
  }
  .closing-invitation strong { color: inherit; }
  .edition-colophon {
    align-items: center; break-before: page; display: flex; flex-direction: column;
    justify-content: center; min-height: 6.15in; padding: .45in; text-align: center;
    color: var(--muted); font: 9.5pt/1.5 Arial, sans-serif;
  }
  .edition-colophon p { margin: .06in 0; }
  .part-opener {
    page: part; width: 4.76in; height: 7.62in; margin: 0;
    padding: 2.18in .52in .55in;
    color: #fff;
    background: linear-gradient(150deg, rgba(36,91,201,.82), rgba(22,34,57,.96)), var(--night);
    break-inside: avoid; page-break-before: always; page-break-after: always;
    position: relative; overflow: hidden;
  }
  .part-opener.opener-1 {
    background: linear-gradient(150deg, rgba(77,91,55,.94), rgba(35,49,42,.98));
  }
  .part-opener.opener-2 {
    background: linear-gradient(150deg, rgba(98,55,69,.94), rgba(35,39,57,.98));
  }
  .part-opener.opener-3 {
    background: linear-gradient(150deg, rgba(25,91,120,.94), rgba(20,43,78,.98));
  }
  .part-opener.opener-4 {
    background: linear-gradient(150deg, rgba(137,60,72,.92), rgba(55,35,62,.98));
  }
  .part-opener.opener-5 {
    background: linear-gradient(150deg, rgba(82,67,151,.94), rgba(27,42,79,.98));
  }
  .part-opener.opener-6 {
    background: linear-gradient(150deg, rgba(113,71,48,.94), rgba(35,42,63,.98));
  }
  .part-opener::before {
    content: ""; position: absolute; width: 3.7in; height: 3.7in;
    border: 1px solid rgba(255,255,255,.18); border-radius: 50%;
    top: -.8in; right: -1.2in;
    box-shadow: 0 0 0 .35in rgba(255,255,255,.035), 0 0 0 .7in rgba(255,255,255,.025);
  }
  .part-opener h1 {
    margin: 0; max-width: 3.72in; font-size: 27pt; line-height: 1.03;
    font-weight: 500; color: #fff; position: relative;
  }
  .part-opener h1::before {
    content: "MYSCOUTEE ORIGIN STORY"; display: block; margin-bottom: .22in;
    font: 700 7.5pt/1 Arial, sans-serif; letter-spacing: .18em; color: #ffcf70;
  }
  .opener-watermark {
    position: absolute; left: .25in; bottom: .45in; width: 4.26in; height: auto;
    opacity: .12; filter: grayscale(1) brightness(4.8); mix-blend-mode: screen;
  }
  .folk-divider {
    width: 4.25in; margin: .44in auto .04in; break-inside: avoid;
    page-break-inside: avoid;
  }
  .folk-divider img { display: block; width: 100%; height: auto; }
  .full-page-motif {
    background: var(--paper); height: 7.62in; margin: 0; overflow: hidden;
    page: part; position: relative; width: 4.76in;
    break-before: page; break-after: page;
  }
  .full-page-motif img {
    bottom: .55in; display: block; height: auto; left: 50%; position: absolute;
    transform: translateX(-50%); width: 4.25in;
  }
  .compact-ending-tail > p,
  .compact-ending-tail .ending-tail > p { margin-bottom: .08in; }
  .compact-ending-tail-tight { line-height: 1.43; }
  .compact-ending-tail-tight > p,
  .compact-ending-tail-tight .ending-tail > p { margin-bottom: .07in; }
  .compact-chapter-8,
  .compact-chapter-18 { line-height: 1.38; }
  .compact-chapter-8 > p,
  .compact-chapter-8 .ending-tail > p,
  .compact-chapter-18 > p,
  .compact-chapter-18 .ending-tail > p { margin-bottom: .08in; }
  .compact-chapter-8 .illustration.portrait-right img { height: 1.95in; }
  .epilogue-compact { font-size: 10pt; line-height: 1.32; }
  .epilogue-compact > p,
  .epilogue-compact .ending-tail > p { margin-bottom: .07in; }
  .epilogue-compact .closing-invitation {
    margin: .22in 0 .04in; padding: .05in .16in; font-size: 14.5pt;
  }
  .pagebreak { page-break-before: always; height: 0; }
  .illustration { margin: .26in 0 .3in; break-inside: avoid; }
  .illustration img { display: block; width: 100%; border-radius: 12px; }
  .illustration figcaption {
    margin-top: .09in; font: italic 8.2pt/1.4 Georgia, serif; color: var(--muted);
  }
  .illustration.side-right { float: right; clear: right; width: 2.2in; max-width: 48%; margin: .02in 0 .16in .22in; }
  .illustration.side-left { float: left; clear: left; width: 2.2in; max-width: 48%; margin: .02in .22in .16in 0; }
  .illustration.side-right img,
  .illustration.side-left img { height: 2.35in; object-fit: cover; }
  .illustration.portrait-right {
    float: right; clear: right; width: 1.35in; max-width: 32%;
    margin: .02in 0 .16in .22in;
  }
  .illustration.portrait-right .image-set { text-align: center; }
  .illustration.portrait-right img {
    display: inline-block; height: 2.35in; width: auto; max-width: 100%;
    object-fit: contain;
  }
  .illustration.full { clear: both; width: 100%; }
  .illustration.full img { max-height: 4.8in; object-fit: cover; }
  .illustration.portrait-grid { clear: both; }
  .illustration.portrait-grid .image-set {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: .09in;
  }
  .illustration.portrait-grid.count-4 .image-set {
    grid-template-columns: repeat(4, 1fr);
  }
  .illustration.portrait-grid img { aspect-ratio: 4 / 5; object-fit: cover; }
  @media screen {
    body { box-shadow: 0 0 30px rgba(0,0,0,.18); }
    .title-page, .toc, main { padding-left: .62in; padding-right: .62in; }
    main { padding-bottom: .7in; }
  }
  @media print {
    html, body { background: var(--paper); }
    body { width: auto; }
    /* Reserve the same lower-page band that receives the stamped ornament.
       The image stays hidden here because the final coloured SVG is added
       after pagination. Keeping the preceding block with this spacer prevents
       both prose/ornament collisions and ornament-only spill pages. */
    .folk-divider {
      display: block; height: 1in; margin: 0 auto; visibility: hidden;
      break-inside: avoid; page-break-inside: avoid;
    }
    .ending-tail {
      break-inside: avoid; page-break-inside: avoid;
    }
    .compact-chapter-8 .folk-divider,
    .compact-chapter-18 .folk-divider { height: .88in; }
    .epilogue-compact .folk-divider { height: .72in; }
    .part-one-final-tail {
      height: 5.72in; min-height: 5.72in; position: relative;
    }
    .part-one-final-tail > .edition-colophon {
      break-before: auto; min-height: 0; padding: 0 .25in;
      position: absolute; left: 0; right: 0; top: 48%;
      transform: translateY(-50%);
    }
    .part-one-final-tail > .folk-divider {
      bottom: 0; height: .9in; left: .25in; margin: 0;
      position: absolute; width: 4.25in;
    }
  }
"""
    context_rules = "\n".join(
        f'.drop-cap.context-{index} {{ background-image: url("{data_url(path)}"); }}'
        for index, (path, _) in enumerate(ENDING_MOTIFS)
    )
    return f"{base}\n{context_rules}\n"


def build_document(source: Path) -> str:
    lines = source.read_text(encoding="utf-8").splitlines()
    metadata, body_lines = extract_front(lines)
    registry = json.loads(ILLUSTRATIONS.read_text(encoding="utf-8"))
    version = load_book_version()
    toc_items = collect_toc(body_lines)
    logo_url = data_url(LOGO)
    cover_emblem_url = data_url(COVER_EMBLEM)

    toc = "\n".join(
        f'<li class="level-{level}"><a href="#{anchor}">{inline_markdown(title)}</a></li>'
        for level, title, anchor in toc_items
    )
    body = markdown_to_html(body_lines, registry)

    # Three short Part I endings should use the available page instead of
    # spilling a few closing lines, the ornament or the colophon onto a nearly
    # empty sheet. The prose is unchanged; these wrappers only tighten the two
    # proven chapter tails and keep the final colophon with Product Claims.
    compact_ranges = (
        (
            'id="8-the-first-three-years-and-the-fifth"',
            '<section class="part-opener opener-3">',
            "compact-chapter-8",
        ),
        (
            'id="18-when-the-world-closed"',
            '<section class="part-opener opener-4">',
            "compact-chapter-18",
        ),
    )
    for heading_marker, next_opener, class_name in compact_ranges:
        heading_index = body.find(heading_marker)
        range_start = body.rfind('<div class="chapter-lead">', 0, heading_index)
        range_end = body.find(next_opener, heading_index)
        if min(heading_index, range_start, range_end) < 0:
            raise ValueError(f"Could not isolate {class_name} for print layout")
        body = (
            body[:range_start]
            + f'<section class="{class_name}">'
            + body[range_start:range_end]
            + "</section>"
            + body[range_end:]
        )

    # Keep the short Epilogue, its invitation and its closing ornament on one
    # page. The prose is unchanged; only this final chapter uses the tighter
    # rhythm needed to avoid an invitation-only spill page.
    epilogue_marker = 'id="epilogue-the-star-above-the-open-space"'
    epilogue_heading = body.find(epilogue_marker)
    epilogue_start = body.rfind("<h2", 0, epilogue_heading)
    epilogue_end = body.find('<section class="part-opener opener-6">', epilogue_heading)
    if min(epilogue_heading, epilogue_start, epilogue_end) < 0:
        raise ValueError("Could not isolate the Part I Epilogue for print layout")
    body = (
        body[:epilogue_start]
        + '<section class="epilogue-compact">'
        + body[epilogue_start:epilogue_end]
        + "</section>"
        + body[epilogue_end:]
    )

    final_tail = '<div class="ending-tail"><div class="edition-colophon">'
    if final_tail not in body:
        raise ValueError("Could not isolate the Part I colophon tail")
    body = body.replace(
        final_tail,
        '<div class="ending-tail part-one-final-tail">'
        '<div class="edition-colophon">',
        1,
    )
    title = html.escape(metadata["title"])
    subtitle = html.escape(metadata["subtitle"])
    tagline = html.escape(metadata["tagline"])
    part_roman = html.escape(str(version["trilogy_roman"]))
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
        published = html.escape(display_date(version["published"]))
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
<meta name="trilogy-part" content="{part_roman}">
<title>{title} · Part {part_roman} · {subtitle} · v{edition_version}</title>
<style>{stylesheet()}</style>
</head>
<body>
<section class="cover" aria-label="{title}">
  <div class="brand-lockup" aria-label="MyScoutee">
    <img src="{logo_url}" alt="" aria-hidden="true"><span>yScoutee</span>
  </div>
  <div class="eyebrow">MyScoutee trilogy</div>
  <div class="volume-lockup" aria-label="Part {part_roman}">
    <span class="volume-roman">{part_roman}</span>
    <span class="volume-copy">Part one<br>of the trilogy</span>
  </div>
  <h1>The Story</h1>
  <h2>{subtitle}</h2>
  <img class="story-emblem" src="{cover_emblem_url}" alt="Six people meeting around a shared compass beneath a guiding star">
  <div class="route"></div>
  <div class="tagline">{tagline}<span class="edition">{edition}</span></div>
</section>
<section class="title-page">
  <div class="brand-lockup" aria-label="MyScoutee">
    <img src="{logo_url}" alt="" aria-hidden="true"><span>yScoutee</span>
  </div>
  <span class="volume-roman">{part_roman}</span>
  <span class="volume-copy">Part one of the MyScoutee trilogy</span>
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


def chrome_print(html_path: Path, pdf_path: Path, chrome: str) -> None:
    # Chrome otherwise attempts to create a profile below the invoking user's
    # configuration directory. That can be read-only in review/build
    # environments and is unnecessary for deterministic local PDF printing.
    with tempfile.TemporaryDirectory(prefix="myscoutee-chrome-") as profile_name:
        subprocess.run(
            [
                chrome,
                "--headless=new",
                "--no-sandbox",
                "--disable-gpu",
                "--disable-dev-shm-usage",
                "--no-pdf-header-footer",
                f"--user-data-dir={profile_name}",
                f"--print-to-pdf={pdf_path}",
                html_path.resolve().as_uri(),
            ],
            check=True,
        )


def full_bleed_document(document: str) -> tuple[str, list[str]]:
    cover_match = re.search(
        r'(<section class="cover".*?</section>)', document, flags=re.DOTALL
    )
    part_fragments = re.findall(
        r'(<section class="part-opener[^"]*">.*?</section>)',
        document,
        flags=re.DOTALL,
    )
    if not cover_match or not part_fragments:
        raise ValueError("Could not extract cover and part-opener pages")

    part_titles = [
        html.unescape(re.sub(r"<[^>]+>", "", fragment)).strip()
        for fragment in part_fragments
    ]
    fragments = [cover_match.group(1), *part_fragments]
    standalone_css = r"""
      @page {
        size: 6in 9in; margin: 0.68in 0.62in 0.7in;
        @bottom-center { content: none; }
      }
      html, body { width: auto; margin: 0; padding: 0; background: #fff; }
      .cover, .part-opener {
        page: auto !important; width: 4.76in !important; height: 7.62in !important;
        margin: 0 !important; break-before: auto !important;
        page-break-before: auto !important; break-after: page !important;
        page-break-after: always !important;
      }
      .part-opener:last-child { break-after: auto !important; page-break-after: auto !important; }
    """
    replacement_document = (
        '<!doctype html><html lang="en"><head><meta charset="utf-8">'
        f"<style>{stylesheet()}{standalone_css}</style></head><body>"
        + "".join(fragments)
        + "</body></html>"
    )
    return replacement_document, part_titles


def pdf_page_texts(pdf_path: Path) -> list[str]:
    result = subprocess.run(
        ["pdftotext", "-layout", str(pdf_path), "-"],
        check=True,
        capture_output=True,
        text=True,
    )
    pages = result.stdout.split("\f")
    if pages and not pages[-1].strip():
        pages.pop()
    return pages


def locate_part_pages(base_pdf: Path, part_titles: list[str]) -> list[int]:
    pages = pdf_page_texts(base_pdf)
    normalized_pages = [re.sub(r"\s+", " ", page).strip() for page in pages]
    located: list[int] = []
    for title in part_titles:
        needle = re.sub(r"\s+", " ", title).strip()
        matches = [
            page_number
            for page_number, page_text in enumerate(normalized_pages, start=1)
            if needle in page_text
        ]
        if len(matches) != 1:
            raise ValueError(
                f"Expected one PDF page for part opener {title!r}, found {matches}"
            )
        located.append(matches[0])
    return located


def render_motif_overlay(motif_path: Path, pdf_path: Path, inkscape: str) -> None:
    source = motif_path.read_text(encoding="utf-8")
    body_match = re.search(r"<svg[^>]*>(.*)</svg>\s*$", source, flags=re.DOTALL)
    if not body_match:
        raise ValueError(f"Could not read SVG body from {motif_path}")

    # The 720×150 ornament is scaled to 4.25 inches and sits in the lower
    # margin, above the page number. The page itself remains transparent so it
    # can be stamped over the typeset page without covering the prose.
    overlay_svg = (
        '<svg xmlns="http://www.w3.org/2000/svg" width="6in" height="9in" '
        'viewBox="0 0 432 648">'
        '<g transform="translate(63 532) scale(.425)">'
        f"{body_match.group(1)}</g></svg>"
    )
    svg_path = pdf_path.with_suffix(".svg")
    svg_path.write_text(overlay_svg, encoding="utf-8")
    subprocess.run(
        [
            inkscape,
            str(svg_path),
            f"--export-filename={pdf_path}",
            "--export-background-opacity=0",
        ],
        check=True,
    )


def stamp_ending_motifs(
    page_inputs: dict[int, Path],
    ending_pages: list[int],
    temp_dir: Path,
    inkscape: str,
) -> None:
    if len(ending_pages) != len(ENDING_MOTIFS):
        raise ValueError(
            f"Expected {len(ENDING_MOTIFS)} ending pages, found {ending_pages}"
        )
    if len(set(ending_pages)) != len(ending_pages) or min(ending_pages) < 1:
        raise ValueError(f"Invalid ending-page map: {ending_pages}")

    for motif_index, ((motif_path, _), page_number) in enumerate(
        zip(ENDING_MOTIFS, ending_pages, strict=True)
    ):
        overlay_pdf = temp_dir / f"motif-overlay-{motif_index + 1}.pdf"
        stamped_pdf = temp_dir / f"stamped-{page_number}.pdf"
        render_motif_overlay(motif_path, overlay_pdf, inkscape)
        subprocess.run(
            [
                "pdftk",
                str(page_inputs[page_number]),
                "stamp",
                str(overlay_pdf),
                "output",
                str(stamped_pdf),
            ],
            check=True,
        )
        page_inputs[page_number] = stamped_pdf


def render_pdf(html_path: Path, pdf_path: Path, chrome: str, inkscape: str) -> None:
    pdf_path.parent.mkdir(parents=True, exist_ok=True)
    document = html_path.read_text(encoding="utf-8")
    replacement_document, part_titles = full_bleed_document(document)
    metadata = load_book_metadata()

    def pdfmark_string(value: object) -> str:
        text = str(value)
        try:
            text.encode("ascii")
        except UnicodeEncodeError:
            encoded = (b"\xfe\xff" + text.encode("utf-16-be")).hex().upper()
            return f"<{encoded}>"
        escaped = (
            text.replace("\\", "\\\\")
            .replace("(", "\\(")
            .replace(")", "\\)")
        )
        return f"({escaped})"

    keywords = ", ".join(str(item) for item in metadata["keywords"])
    docinfo = (
        f"[ /Title {pdfmark_string(metadata['title'])} "
        f"/Author {pdfmark_string(metadata['author'])} "
        f"/Subject {pdfmark_string(metadata['subject'])} "
        f"/Keywords {pdfmark_string(keywords)} "
        f"/Creator {pdfmark_string(metadata['creator'])} "
        f"/Copyright {pdfmark_string(metadata['copyright'])} "
        "/DOCINFO pdfmark"
    )

    with tempfile.TemporaryDirectory(prefix="myscoutee-book-") as temp_name:
        temp_dir = Path(temp_name)
        base_pdf = temp_dir / "base.pdf"
        replacement_html = temp_dir / "full-bleed.html"
        replacement_pdf = temp_dir / "full-bleed.pdf"
        merged_pdf = temp_dir / "merged.pdf"
        metadata_pdf = temp_dir / "metadata.pdf"
        metadata_info = temp_dir / "metadata-info.txt"
        final_pdf = temp_dir / "final.pdf"

        replacement_html.write_text(replacement_document, encoding="utf-8")
        chrome_print(html_path, base_pdf, chrome)
        chrome_print(replacement_html, replacement_pdf, chrome)

        part_pages = locate_part_pages(base_pdf, part_titles)
        base_page_text = pdf_page_texts(base_pdf)
        replacement_count = 1 + len(part_titles)

        subprocess.run(
            ["pdfseparate", str(base_pdf), str(temp_dir / "base-%d.pdf")],
            check=True,
        )
        subprocess.run(
            [
                "pdfseparate",
                str(replacement_pdf),
                str(temp_dir / "replacement-%d.pdf"),
            ],
            check=True,
        )

        replacement_by_page = {1: 1}
        replacement_by_page.update(
            {
                base_page: replacement_index
                for replacement_index, base_page in enumerate(part_pages, start=2)
            }
        )
        if len(replacement_by_page) != replacement_count:
            raise ValueError("Full-bleed replacement page mapping is incomplete")

        page_inputs = {
            page_number: temp_dir
            / (
                f"replacement-{replacement_by_page[page_number]}.pdf"
                if page_number in replacement_by_page
                else f"base-{page_number}.pdf"
            )
            for page_number in range(1, len(base_page_text) + 1)
        }
        ending_pages = [page_number - 1 for page_number in part_pages]
        ending_pages.append(len(base_page_text))
        stamp_ending_motifs(page_inputs, ending_pages, temp_dir, inkscape)

        merge_inputs = [
            str(page_inputs[page_number])
            for page_number in range(1, len(base_page_text) + 1)
        ]
        subprocess.run(
            ["pdftk", *merge_inputs, "cat", "output", str(merged_pdf)],
            check=True,
        )
        subprocess.run(
            [
                "gs",
                "-q",
                "-dBATCH",
                "-dNOPAUSE",
                "-sDEVICE=pdfwrite",
                f"-sOutputFile={metadata_pdf}",
                "-c",
                docinfo,
                "-f",
                str(merged_pdf),
            ],
            check=True,
        )
        info_fields = (
            ("Title", metadata["title"]),
            ("Author", metadata["author"]),
            ("Subject", metadata["subject"]),
            ("Keywords", keywords),
            ("Creator", metadata["creator"]),
            ("Language", metadata["language"]),
            ("Copyright", metadata["copyright"]),
        )
        metadata_info.write_text(
            "".join(
                "InfoBegin\n"
                f"InfoKey: {key}\n"
                f"InfoValue: {str(value).replace(chr(10), ' ').replace(chr(13), ' ')}\n"
                for key, value in info_fields
            ),
            encoding="utf-8",
        )
        subprocess.run(
            [
                "pdftk",
                str(metadata_pdf),
                "update_info_utf8",
                str(metadata_info),
                "output",
                str(final_pdf),
            ],
            check=True,
        )
        final_pdf.replace(pdf_path)


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def write_publication_integrity_files(
    pdf_path: Path,
    version: dict[str, object],
) -> None:
    metadata = load_book_metadata()
    digest = sha256_file(pdf_path)
    checksum_path = pdf_path.with_suffix(f"{pdf_path.suffix}.sha256")
    manifest_path = pdf_path.with_suffix(".publication.json")
    checksum_path.write_text(f"{digest}  {pdf_path.name}\n", encoding="utf-8")
    manifest_path.write_text(
        json.dumps(
            {
                "file": pdf_path.name,
                "sha256": digest,
                "part": version["trilogy_part"],
                "part_roman": version["trilogy_roman"],
                "edition_version": version["version"],
                "published": version["published"],
                "metadata": metadata,
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    print(f"Wrote publication checksum {checksum_path}")
    print(f"Wrote publication manifest {manifest_path}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=DEFAULT_SOURCE)
    parser.add_argument("--html", type=Path, default=DEFAULT_HTML)
    parser.add_argument("--pdf", type=Path)
    parser.add_argument("--chrome", default="google-chrome")
    parser.add_argument("--inkscape", default="inkscape")
    parser.add_argument("--html-only", action="store_true")
    args = parser.parse_args()

    version = load_book_version()
    default_pdf = default_pdf_path(version)
    pdf_path = args.pdf or default_pdf
    is_default_output = args.pdf is None
    if (
        not args.html_only
        and is_default_output
        and version["locked"]
        and pdf_path.exists()
    ):
        raise FileExistsError(
            "Published versions are immutable: increment version.json before "
            f"building another edition ({pdf_path})"
        )

    args.html.parent.mkdir(parents=True, exist_ok=True)
    args.html.write_text(build_document(args.source.resolve()), encoding="utf-8")
    print(f"Wrote {args.html}")
    if not args.html_only:
        render_pdf(args.html, pdf_path, args.chrome, args.inkscape)
        print(f"Wrote {pdf_path}")
        if is_default_output and version["locked"]:
            write_publication_integrity_files(pdf_path, version)


if __name__ == "__main__":
    main()
