#!/usr/bin/env python3
"""Build the English Part II review edition with the Part I book system."""

from __future__ import annotations

import html
import importlib.util
import json
from pathlib import Path


BOOK_DIR = Path(__file__).resolve().parent
PROJECT_DIR = next(
    candidate
    for candidate in (BOOK_DIR, *BOOK_DIR.parents)
    if (candidate / "frontend/src/assets/logo/heart.png").is_file()
)
BASE_BUILDER = (
    PROJECT_DIR
    / "guides/story/trilogy/01-the-city-between-us/book/build_public_book.py"
)
spec = importlib.util.spec_from_file_location("myscoutee_part_one_book", BASE_BUILDER)
if spec is None or spec.loader is None:
    raise RuntimeError(f"Could not load the shared book system: {BASE_BUILDER}")
book = importlib.util.module_from_spec(spec)
spec.loader.exec_module(book)


ASSET_DIR = BOOK_DIR / "assets"
MOTIF_DIR = ASSET_DIR / "ending-motifs"
MOTIFS = (
    (MOTIF_DIR / "00-line-becomes-rule.svg", "The connecting line becomes a rule"),
    (MOTIF_DIR / "01-legal-door-and-clock.svg", "A legal door under a fast clock"),
    (MOTIF_DIR / "02-three-partial-windows.svg", "Three partial windows"),
    (MOTIF_DIR / "03-sentence-and-body.svg", "The sentence and the body"),
    (MOTIF_DIR / "04-person-inside-the-file.svg", "A person inside the file"),
    (MOTIF_DIR / "05-home-debt-and-return.svg", "Home, debt, and return"),
    (MOTIF_DIR / "06-streets-and-institutions.svg", "Streets and institutions"),
    (MOTIF_DIR / "07-human-system-network.svg", "A human system network"),
    (MOTIF_DIR / "08-open-line-to-part-three.svg", "The open line to Part III"),
)

book.BOOK_DIR = BOOK_DIR
book.PROJECT_DIR = PROJECT_DIR
book.DEFAULT_SOURCE = BOOK_DIR / "THE_SYSTEM_BETWEEN_US_REVIEW_DRAFT_EN.md"
book.DEFAULT_HTML = BOOK_DIR / "MYSCOUTEE_THE_STORY_PART_II_PUBLIC_EDITION_EN.html"
book.BOOK_DRAFT_DIR = BOOK_DIR / "draft"
book.PUBLISHED_DIR = BOOK_DIR.parent / "published"
book.LOGO = PROJECT_DIR / "frontend/src/assets/logo/heart.png"
book.COVER_EMBLEM = ASSET_DIR / "cover-emblem.svg"
book.ILLUSTRATIONS = BOOK_DIR / "illustrations.json"
book.BOOK_VERSION = BOOK_DIR / "version.json"
book.BOOK_METADATA = BOOK_DIR / "metadata.json"
book.ENDING_MOTIF_DIR = MOTIF_DIR
book.ENDING_MOTIFS = MOTIFS
book.OPENER_WATERMARKS = tuple(path for path, _ in MOTIFS)
book.COMPACT_ENDING_MOTIF_INDEXES = frozenset()
base_append_ending_tail = book.append_ending_tail


def append_ending_tail(parts: list[str], motif_index: int) -> None:
    """Use tighter, context-specific tails at the two proven Part II breaks."""
    if motif_index == 0:
        tail_count = min(3, len(parts))
        tail = parts[-tail_count:]
        del parts[-tail_count:]
        parts.append(
            '<div class="ending-tail compact-prologue-tail">'
            + "\n".join(tail)
            + "\n"
            + book.render_ending_motif(motif_index)
            + "</div>"
        )
        return
    if motif_index == 1:
        # Chapters 2 and 3 are already indivisible short-chapter blocks. Do not
        # also pull the final sentence of Chapter 1 onto a page of its own.
        tail_count = min(2, len(parts))
        tail = parts[-tail_count:]
        del parts[-tail_count:]
        parts.append(
            '<div class="ending-tail">'
            + "\n".join(tail)
            + "\n"
            + book.render_ending_motif(motif_index)
            + "</div>"
        )
        return
    base_append_ending_tail(parts, motif_index)


def versioned_pdf_name(version: dict[str, object]) -> str:
    suffix = "EN.pdf" if version["status"] == "public" else "EN_REVIEW.pdf"
    return (
        "MyScoutee_The_Story_Part_II_The_System_Between_Us_"
        f"v{version['version']}_{suffix}"
    )


def stylesheet() -> str:
    inherited = book._part_one_stylesheet()
    overrides = r"""
  :root {
    --ink: #192534; --muted: #687384; --paper: #fbf7ef;
    --night: #111c2c; --blue: #2c668f; --violet: #76528f;
    --gold: #e6ad52; --coral: #c95f50;
  }
  .cover {
    background:
      radial-gradient(circle at 75% 21%, rgba(230,173,82,.25), transparent 19%),
      radial-gradient(circle at 23% 82%, rgba(129,70,91,.42), transparent 27%),
      linear-gradient(155deg, #111a29 0%, #24445d 52%, #251d2d 100%);
  }
  .cover .story-emblem { left: .38in; top: 4.5in; width: 4in; }
  .part-opener h1::before { content: "MYSCOUTEE SYSTEM STORY"; }
  .part-opener.opener-0 { background: linear-gradient(150deg, #284b62, #171c2b); }
  .part-opener.opener-1 { background: linear-gradient(150deg, #765039, #33252b); }
  .part-opener.opener-2 { background: linear-gradient(150deg, #3e6570, #232d3c); }
  .part-opener.opener-3 { background: linear-gradient(150deg, #81505b, #33283b); }
  .part-opener.opener-4 { background: linear-gradient(150deg, #4a5874, #27283a); }
  .part-opener.opener-5 { background: linear-gradient(150deg, #6f5e43, #30313e); }
  .part-opener.opener-6 { background: linear-gradient(150deg, #485d78, #252d43); }
  .part-opener.opener-7 { background: linear-gradient(150deg, #654d75, #29304a); }
  .part-opener.opener-8 { background: linear-gradient(150deg, #375e6b, #28253c); }
  main h2.context-0 { --chapter-divider: linear-gradient(90deg, #2c668f, #c95f50 48%, rgba(201,95,80,.1)); }
  main h2.context-1 { --chapter-divider: linear-gradient(90deg, #8a573a, #e6ad52 48%, rgba(230,173,82,.1)); }
  main h2.context-2 { --chapter-divider: linear-gradient(90deg, #39727c, #7caeb3 48%, rgba(124,174,179,.1)); }
  main h2.context-3 { --chapter-divider: linear-gradient(90deg, #9d4d5c, #d98b78 48%, rgba(217,139,120,.1)); }
  main h2.context-4 { --chapter-divider: linear-gradient(90deg, #4a5874, #8d9abb 48%, rgba(141,154,187,.1)); }
  main h2.context-5 { --chapter-divider: linear-gradient(90deg, #8a6a42, #d5ae69 48%, rgba(213,174,105,.1)); }
  main h2.context-6 { --chapter-divider: linear-gradient(90deg, #476b91, #84a6ce 48%, rgba(132,166,206,.1)); }
  main h2.context-7 { --chapter-divider: linear-gradient(90deg, #76528f, #b68bc2 48%, rgba(182,139,194,.1)); }
  main h2.context-8 { --chapter-divider: linear-gradient(90deg, #396c77, #d09a61 48%, rgba(208,154,97,.1)); }
  .review-note { font-size: 10pt; line-height: 1.42; }
  .review-note p { margin-bottom: .08in; }
  main { overflow-wrap: anywhere; }
  .toc h1 { margin-bottom: .18in; }
  .toc li { margin-bottom: .035in; line-height: 1.12; }
  .toc .level-1 { margin-top: .09in; font-size: 7.4pt; }
  .toc .level-2 { font-size: 8pt; }
  .compact-prologue-tail { line-height: 1.46; }
  .compact-prologue-tail > p { margin-bottom: .08in; }
  .compact-chapter-15 { line-height: 1.47; }
  .compact-chapter-15 > p { margin-bottom: .09in; }
  .compact-chapter-15 .illustration.portrait-right { margin-bottom: .08in; }
  .drop-cap { background-position: center 88%; background-size: .5in auto; }
  @media print {
    .ending-tail:has(> .closing-invitation) {
      height: 7.62in;
      position: relative;
    }
    .ending-tail:has(> .closing-invitation) > .closing-invitation {
      left: 0;
      margin: 0;
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }
"""
    return inherited + overrides


def build_document(source: Path) -> str:
    lines = source.read_text(encoding="utf-8").splitlines()
    front, body_lines = book.extract_front(lines)
    registry = json.loads(book.ILLUSTRATIONS.read_text(encoding="utf-8"))
    version = book.load_book_version()
    toc_items = book.collect_toc(body_lines)
    logo_url = book.data_url(book.LOGO)
    emblem_url = book.data_url(book.COVER_EMBLEM)
    toc = "\n".join(
        f'<li class="level-{level}"><a href="#{anchor}">{book.inline_markdown(title)}</a></li>'
        for level, title, anchor in toc_items
    )
    body = book.markdown_to_html(body_lines, registry)
    chapter_15_heading = body.find(
        'id="15-three-years-with-an-unlicensed-assistant"'
    )
    chapter_15_start = body.rfind(
        '<div class="chapter-lead">', 0, chapter_15_heading
    )
    chapter_16_start = body.find(
        '<div class="ending-tail"><section class="short-chapter"><h2 '
        'class="context-5" id="16-the-house-as-a-human-archive">',
        chapter_15_heading,
    )
    if min(chapter_15_heading, chapter_15_start, chapter_16_start) < 0:
        raise ValueError("Could not isolate Chapter 15 for compact review layout")
    body = (
        body[:chapter_15_start]
        + '<section class="compact-chapter-15">'
        + body[chapter_15_start:chapter_16_start]
        + "</section>"
        + body[chapter_16_start:]
    )
    note_start = body.find('<h2 class="context-0" id="a-note-to-the-reader">')
    note_break = body.find('<div class="pagebreak"></div>', note_start)
    if note_start < 0 or note_break < 0:
        raise ValueError("Could not isolate the reader note for review layout")
    body = (
        body[:note_start]
        + '<section class="review-note">'
        + body[note_start:note_break]
        + "</section>"
        + body[note_break:]
    )
    title = html.escape(front["title"])
    subtitle = html.escape(front["subtitle"])
    tagline = html.escape(front["tagline"])
    roman = html.escape(str(version["trilogy_roman"]))
    edition_version = html.escape(str(version["version"]))
    status = html.escape(str(version["status"]))
    if version["status"] == "public":
        published = html.escape(book.display_date(version["published"]))
        edition = f"Public edition v{edition_version} · Published {published}"
        truth = (
            "A first-person public memoir of an unresolved legal and institutional "
            "period. Documentary record, attributed recollection, memoir and later "
            "public context remain explicitly distinct."
        )
        title_suffix = "public edition"
    else:
        updated = html.escape(book.display_date(version["updated"]))
        edition = f"Review draft v{edition_version} · Unpublished · Updated {updated}"
        truth = (
            "An unpublished first-person review draft about an unresolved legal and "
            "institutional period. Documentary record, attributed recollection, memoir "
            "and later public context remain explicitly distinct."
        )
        title_suffix = "review"
    return f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="author" content="MyScoutee">
<meta name="description" content="A first-person MyScoutee systems memoir.">
<meta name="book-version" content="{edition_version}">
<meta name="book-status" content="{status}">
<meta name="trilogy-part" content="{roman}">
<title>{title} · Part {roman} · {subtitle} · v{edition_version} {title_suffix}</title>
<style>{stylesheet()}</style></head><body>
<section class="cover" aria-label="{title}">
  <div class="brand-lockup" aria-label="MyScoutee"><img src="{logo_url}" alt="" aria-hidden="true"><span>yScoutee</span></div>
  <div class="eyebrow">MyScoutee trilogy</div>
  <div class="volume-lockup" aria-label="Part {roman}"><span class="volume-roman">{roman}</span><span class="volume-copy">Part two<br>of the trilogy</span></div>
  <h1>The Story</h1><h2>{subtitle}</h2>
  <img class="story-emblem" src="{emblem_url}" alt="Two human paths remain connected through a transparent system">
  <div class="route"></div><div class="tagline">{tagline}<span class="edition">{edition}</span></div>
</section>
<section class="title-page">
  <div class="brand-lockup" aria-label="MyScoutee"><img src="{logo_url}" alt="" aria-hidden="true"><span>yScoutee</span></div>
  <span class="volume-roman">{roman}</span><span class="volume-copy">Part two of the MyScoutee trilogy</span>
  <h1>The Story</h1><h2>{subtitle}</h2><p><em>{tagline}</em></p>
  <p class="edition">{edition}</p><p class="truth">{truth}</p>
</section>
<nav class="toc"><h1>Contents</h1><ol>{toc}</ol></nav>
<main>{body}</main></body></html>"""


book._part_one_stylesheet = book.stylesheet
book.stylesheet = stylesheet
book.append_ending_tail = append_ending_tail
book.versioned_pdf_name = versioned_pdf_name
book.build_document = build_document


if __name__ == "__main__":
    book.main()
