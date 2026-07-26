#!/usr/bin/env python3
"""Render the MyScoutee Network pitch deck to PNG, PDF, ODP, and PPTX.

The visual source is intentionally self-contained and uses Pillow. The generated
PPTX/ODP use one full-slide image per page for predictable cross-platform
rendering; edit the copy and layout in this file, then rebuild.
"""

from __future__ import annotations

import argparse
import math
import os
import shutil
import subprocess
import sys
import tempfile
import time
from pathlib import Path
from typing import Iterable, Sequence

from PIL import Image, ImageDraw, ImageFilter, ImageFont
from reportlab.pdfgen import canvas as pdf_canvas


ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
OUT = HERE / "output"
SLIDES = OUT / "slides"

W, H = 1920, 1080

FONT_REG = "/usr/share/fonts/truetype/ubuntu/Ubuntu-R.ttf"
FONT_MED = "/usr/share/fonts/truetype/ubuntu/Ubuntu-M.ttf"
FONT_BOLD = "/usr/share/fonts/truetype/ubuntu/Ubuntu-B.ttf"
FONT_MONO = "/usr/share/fonts/truetype/ubuntu/UbuntuMono-R.ttf"
FONT_MONO_BOLD = "/usr/share/fonts/truetype/ubuntu/UbuntuMono-B.ttf"

BG = "#090E21"
BG_2 = "#111A38"
CARD = "#151E3D"
CARD_2 = "#1B274B"
TEXT = "#F7F8FF"
MUTED = "#AEB9D8"
MUTED_2 = "#7F8BAD"
BLUE = "#4F7CFF"
PURPLE = "#7B5CFF"
PINK = "#FF4D8D"
ORANGE = "#FF7B2D"
GREEN = "#36D399"
GOLD = "#FFD166"
RED = "#FF6B6B"
WHITE = "#FFFFFF"
INK = "#18233F"
RESAMPLE_LANCZOS = getattr(Image, "Resampling", Image).LANCZOS


def rgb(value: str) -> tuple[int, int, int]:
    value = value.lstrip("#")
    return tuple(int(value[i : i + 2], 16) for i in (0, 2, 4))


def rgba(value: str, alpha: int = 255) -> tuple[int, int, int, int]:
    return (*rgb(value), alpha)


def font(size: int, weight: str = "regular", mono: bool = False) -> ImageFont.FreeTypeFont:
    if mono:
        path = FONT_MONO_BOLD if weight == "bold" else FONT_MONO
    elif weight == "bold":
        path = FONT_BOLD
    elif weight == "medium":
        path = FONT_MED
    else:
        path = FONT_REG
    return ImageFont.truetype(path, size=size)


def vertical_gradient(top: str = BG, bottom: str = BG_2) -> Image.Image:
    image = Image.new("RGBA", (W, H), rgb(top) + (255,))
    draw = ImageDraw.Draw(image)
    top_rgb, bottom_rgb = rgb(top), rgb(bottom)
    for y in range(H):
        t = y / max(1, H - 1)
        color = tuple(round(top_rgb[i] * (1 - t) + bottom_rgb[i] * t) for i in range(3))
        draw.line((0, y, W, y), fill=color + (255,))
    return image


def add_glow(image: Image.Image, box: tuple[int, int, int, int], color: str, blur: int = 120, alpha: int = 95) -> None:
    layer = Image.new("RGBA", image.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    draw.ellipse(box, fill=rgba(color, alpha))
    layer = layer.filter(ImageFilter.GaussianBlur(blur))
    image.alpha_composite(layer)


def rounded_card(
    image: Image.Image,
    box: tuple[int, int, int, int],
    *,
    fill: str = CARD,
    alpha: int = 245,
    radius: int = 28,
    outline: str | None = "#2B3968",
    outline_width: int = 2,
    shadow: bool = True,
) -> None:
    x1, y1, x2, y2 = box
    if shadow:
        shadow_layer = Image.new("RGBA", image.size, (0, 0, 0, 0))
        sd = ImageDraw.Draw(shadow_layer)
        sd.rounded_rectangle((x1 + 3, y1 + 10, x2 + 3, y2 + 10), radius=radius, fill=(0, 0, 0, 105))
        shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(18))
        image.alpha_composite(shadow_layer)
    overlay = Image.new("RGBA", image.size, (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    od.rounded_rectangle(
        box,
        radius=radius,
        fill=rgba(fill, alpha),
        outline=rgba(outline, 220) if outline else None,
        width=outline_width,
    )
    image.alpha_composite(overlay)


def wrap_lines(text: str, fnt: ImageFont.FreeTypeFont, max_width: int) -> list[str]:
    out: list[str] = []
    for paragraph in text.split("\n"):
        if not paragraph:
            out.append("")
            continue
        words = paragraph.split()
        line = words[0]
        for word in words[1:]:
            candidate = f"{line} {word}"
            if fnt.getlength(candidate) <= max_width:
                line = candidate
            else:
                out.append(line)
                line = word
        out.append(line)
    return out


def text(
    image: Image.Image,
    xy: tuple[int, int],
    value: str,
    *,
    size: int,
    color: str = TEXT,
    weight: str = "regular",
    max_width: int | None = None,
    spacing: int | None = None,
    mono: bool = False,
    anchor: str | None = None,
    align: str = "left",
) -> tuple[int, int, int, int]:
    draw = ImageDraw.Draw(image)
    fnt = font(size, weight, mono=mono)
    rendered = value
    if max_width is not None:
        rendered = "\n".join(wrap_lines(value, fnt, max_width))
    if spacing is None:
        spacing = max(5, round(size * 0.24))
    draw.multiline_text(
        xy,
        rendered,
        font=fnt,
        fill=rgb(color),
        spacing=spacing,
        anchor=anchor,
        align=align,
    )
    return draw.multiline_textbbox(
        xy,
        rendered,
        font=fnt,
        spacing=spacing,
        anchor=anchor,
        align=align,
    )


def pill(
    image: Image.Image,
    xy: tuple[int, int],
    label: str,
    *,
    fill: str,
    color: str = WHITE,
    size: int = 18,
    pad_x: int = 18,
    height: int = 38,
    outline: str | None = None,
) -> tuple[int, int, int, int]:
    draw = ImageDraw.Draw(image)
    fnt = font(size, "bold")
    width = math.ceil(fnt.getlength(label)) + pad_x * 2
    x, y = xy
    draw.rounded_rectangle(
        (x, y, x + width, y + height),
        radius=height // 2,
        fill=rgb(fill),
        outline=rgb(outline) if outline else None,
        width=2,
    )
    draw.text((x + width / 2, y + height / 2 - 1), label, font=fnt, fill=rgb(color), anchor="mm")
    return (x, y, x + width, y + height)


def status_pill(image: Image.Image, xy: tuple[int, int], label: str) -> tuple[int, int, int, int]:
    palette = {
        "BUILT": (GREEN, BG),
        "PLANNED": (BLUE, WHITE),
        "PROPOSED": (PURPLE, WHITE),
        "MODEL — NOT TRACTION": (GOLD, INK),
    }
    fill, color = palette.get(label, (CARD_2, TEXT))
    return pill(image, xy, label, fill=fill, color=color, size=16, height=34, pad_x=15)


def section_header(
    image: Image.Image,
    index: str,
    category: str,
    title_value: str,
    subtitle: str | None = None,
    *,
    status: str | None = None,
) -> None:
    text(image, (88, 54), f"{index}  /  {category.upper()}", size=19, color=GREEN, weight="bold")
    if status:
        status_pill(image, (1650, 48), status)
    text(image, (88, 94), title_value, size=50, weight="bold", max_width=1580, spacing=8)
    if subtitle:
        text(image, (90, 166), subtitle, size=22, color=MUTED, max_width=1650, spacing=7)


def footer(image: Image.Image, page: int, *, note: str | None = None) -> None:
    draw = ImageDraw.Draw(image)
    draw.line((88, 1033, 1832, 1033), fill=rgb("#27345F"), width=2)
    label = "MYSCOUTEE NETWORK  •  CONFIDENTIAL WORKING DRAFT  •  JUL 2026"
    text(image, (88, 1044), label, size=14, color=MUTED_2, weight="medium")
    if note:
        text(image, (960, 1044), note, size=14, color=MUTED_2, anchor="ma", align="center")
    text(image, (1832, 1044), f"{page} / 7", size=14, color=MUTED_2, weight="bold", anchor="ra")


def paste_cover(
    image: Image.Image,
    src: Path,
    box: tuple[int, int, int, int],
    *,
    radius: int = 28,
    outline: str = "#405187",
    crop: str = "cover",
    darken: int = 0,
) -> None:
    x1, y1, x2, y2 = box
    target_w, target_h = x2 - x1, y2 - y1
    original = Image.open(src).convert("RGBA")
    if crop == "contain":
        scale = min(target_w / original.width, target_h / original.height)
    else:
        scale = max(target_w / original.width, target_h / original.height)
    resized = original.resize(
        (max(1, round(original.width * scale)), max(1, round(original.height * scale))),
        RESAMPLE_LANCZOS,
    )
    canvas = Image.new("RGBA", (target_w, target_h), (0, 0, 0, 0))
    px = (target_w - resized.width) // 2
    py = (target_h - resized.height) // 2
    canvas.alpha_composite(resized, (px, py))
    if darken:
        shade = Image.new("RGBA", canvas.size, (0, 0, 0, darken))
        canvas.alpha_composite(shade)
    mask = Image.new("L", (target_w, target_h), 0)
    md = ImageDraw.Draw(mask)
    md.rounded_rectangle((0, 0, target_w, target_h), radius=radius, fill=255)
    image.paste(canvas, (x1, y1), mask)
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle(box, radius=radius, outline=rgb(outline), width=3)


def paste_brand_logo(image: Image.Image, box: tuple[int, int, int, int]) -> None:
    """Place the trimmed transparent brand mark inside a clean badge.

    The older 1024px app-icon source includes a soft floor glow that turns into
    a white strip at small sizes. The dedicated heart mark is already trimmed,
    so it scales without that edge artifact.
    """
    rounded_card(
        image,
        box,
        fill="#0D1430",
        alpha=255,
        radius=20,
        outline="#6174D5",
        outline_width=3,
        shadow=False,
    )
    x1, y1, x2, y2 = box
    inset = 7
    target_w = x2 - x1 - inset * 2
    target_h = y2 - y1 - inset * 2
    source = Image.open(ROOT / "frontend/src/assets/logo/heart.png").convert("RGBA")
    scale = min(target_w / source.width, target_h / source.height)
    resized = source.resize(
        (max(1, round(source.width * scale)), max(1, round(source.height * scale))),
        RESAMPLE_LANCZOS,
    )
    px = x1 + (x2 - x1 - resized.width) // 2
    py = y1 + (y2 - y1 - resized.height) // 2
    image.alpha_composite(resized, (px, py))


def draw_arrow(
    image: Image.Image,
    start: tuple[int, int],
    end: tuple[int, int],
    *,
    color: str = BLUE,
    width: int = 5,
    head: int = 15,
) -> None:
    draw = ImageDraw.Draw(image)
    draw.line((*start, *end), fill=rgb(color), width=width)
    angle = math.atan2(end[1] - start[1], end[0] - start[0])
    left = (
        end[0] - head * math.cos(angle) + head * 0.6 * math.sin(angle),
        end[1] - head * math.sin(angle) - head * 0.6 * math.cos(angle),
    )
    right = (
        end[0] - head * math.cos(angle) - head * 0.6 * math.sin(angle),
        end[1] - head * math.sin(angle) + head * 0.6 * math.cos(angle),
    )
    draw.polygon((end, left, right), fill=rgb(color))


def bullet_list(
    image: Image.Image,
    items: Sequence[str],
    *,
    x: int,
    y: int,
    width: int,
    size: int = 22,
    color: str = TEXT,
    bullet_color: str = GREEN,
    gap: int = 18,
) -> int:
    cursor_y = y
    for item in items:
        draw = ImageDraw.Draw(image)
        draw.ellipse((x, cursor_y + 10, x + 10, cursor_y + 20), fill=rgb(bullet_color))
        box = text(
            image,
            (x + 26, cursor_y),
            item,
            size=size,
            color=color,
            max_width=width - 26,
            spacing=6,
        )
        cursor_y = box[3] + gap
    return cursor_y


def metric_card(
    image: Image.Image,
    box: tuple[int, int, int, int],
    value: str,
    label: str,
    *,
    accent: str,
    note: str | None = None,
) -> None:
    rounded_card(image, box, fill=CARD, radius=22, shadow=False)
    x1, y1, x2, y2 = box
    ImageDraw.Draw(image).rounded_rectangle((x1, y1, x1 + 9, y2), radius=5, fill=rgb(accent))
    text(image, (x1 + 28, y1 + 20), value, size=34, color=accent, weight="bold")
    text(image, (x1 + 28, y1 + 66), label, size=18, color=TEXT, weight="medium", max_width=x2 - x1 - 50)
    if note:
        text(image, (x1 + 28, y2 - 34), note, size=14, color=MUTED_2, max_width=x2 - x1 - 50)


def slide_1() -> Image.Image:
    image = vertical_gradient("#070B1C", "#12183A")
    add_glow(image, (-240, -250, 900, 900), PURPLE, blur=160, alpha=100)
    add_glow(image, (1320, -200, 2200, 700), PINK, blur=170, alpha=75)
    paste_brand_logo(image, (90, 58, 164, 132))
    text(image, (184, 66), "MYSCOUTEE NETWORK", size=24, weight="bold")
    text(image, (184, 100), "OPERATOR + STRATEGIC PARTNER DECK", size=14, color=MUTED, weight="medium")
    status_pill(image, (1585, 64), "MODEL — NOT TRACTION")

    text(
        image,
        (90, 176),
        "One product engine.\nMany local brands.\nOne verifiable upside.",
        size=62,
        weight="bold",
        max_width=780,
        spacing=4,
    )
    text(
        image,
        (94, 412),
        "A meeting-first social platform deployed by independent operators—"
        "measured by privacy-safe telemetry and linked to exit rights through a claim registry.",
        size=24,
        color=MUTED,
        max_width=760,
        spacing=8,
    )

    hero = ROOT / "plans/img/facebook_header.png"
    paste_cover(image, hero, (900, 150, 1832, 505), radius=30, outline="#596BC2", darken=8)
    pill(image, (928, 456), "Preference > group > event > commerce", fill="#111936", color=WHITE, size=17, height=38)

    cards = [
        ("BUILT", "Meeting-first product", "Affinity matching, groups, chats, events, resources and feedback."),
        ("BUILT", "Packaged self-hosting", "An installable Debian artifact runs the production stack on the operator’s VPS."),
        ("PLANNED", "Claim registry", "Every deployment reports aggregates; a claimed code links weight to an exit-eligible operator."),
        ("PROPOSED", "Shared success pool", "100k founder units; at 1M total units, 10% founder / 90% operator pool."),
    ]
    x_positions = [90, 530, 970, 1410]
    accent_by_status = {"BUILT": GREEN, "PLANNED": BLUE, "PROPOSED": PURPLE}
    for x, (status, heading, body) in zip(x_positions, cards):
        rounded_card(image, (x, 590, x + 400, 872), fill=CARD, radius=26)
        status_pill(image, (x + 24, 614), status)
        text(image, (x + 24, 672), heading, size=28, weight="bold", max_width=350)
        text(image, (x + 24, 748), body, size=20, color=MUTED, max_width=350, spacing=7)
    rounded_card(image, (90, 902, 1832, 1007), fill="#101831", radius=24, shadow=False)
    text(
        image,
        (122, 928),
        "THE THESIS",
        size=16,
        color=GREEN,
        weight="bold",
    )
    text(
        image,
        (282, 920),
        "Local brands acquire communities. A common core makes verified reach more valuable together "
        "than apart—and registry claims allocate that compounding exit upside.",
        size=25,
        weight="medium",
        max_width=1475,
    )
    footer(image, 1, note="100k / 1M / 10M are economic milestones, not current users")
    return image


def slide_2() -> Image.Image:
    image = vertical_gradient()
    add_glow(image, (1200, 20, 2040, 700), PURPLE, blur=170, alpha=55)
    section_header(
        image,
        "01",
        "Product",
        "The product closes the gap between matching and meeting.",
        "Preference signal > affinity graph > optimized group > real-world event > feedback > better graph.",
        status="BUILT",
    )

    visual = ROOT / "frontend/src/assets/logo/cards_no_edges.png"
    paste_cover(image, visual, (88, 230, 1190, 718), radius=28, outline="#465894")

    differentiators = [
        ("01", "Preference, not a swipe", "Rate people or pairs 1–10; reciprocal and contextual signals feed affinity.", BLUE),
        ("02", "Groups, not only pairs", "Graph planning forms balanced rooms and supports inside/outside-network discovery.", PURPLE),
        ("03", "Meetings, not endless chat", "Scoped chat flows into hosted, multi-stage and tournament-style events.", PINK),
        ("04", "Operations, not a shell", "Invites, assets, tickets, pricing, feedback, moderation and admin tooling.", ORANGE),
    ]
    y = 228
    for number, heading, body, accent in differentiators:
        rounded_card(image, (1234, y, 1832, y + 116), fill=CARD, radius=20, shadow=False)
        ImageDraw.Draw(image).ellipse((1254, y + 24, 1306, y + 76), fill=rgb(accent))
        text(image, (1280, y + 50), number, size=17, color=WHITE, weight="bold", anchor="mm")
        text(image, (1328, y + 18), heading, size=23, weight="bold", max_width=470)
        text(image, (1328, y + 54), body, size=17, color=MUTED, max_width=470, spacing=4)
        y += 126

    text(image, (90, 752), "CODEBASE EVIDENCE + CURRENT CAPACITY BOUNDARY  •  NOT CUSTOMER TRACTION", size=16, color=GREEN, weight="bold")
    metric_card(image, (90, 786, 390, 990), "22", "REST controllers", accent=BLUE, note="current Java code")
    metric_card(image, (410, 786, 710, 990), "162", "HTTP endpoint mappings", accent=PURPLE, note="current Java code")
    metric_card(image, (730, 786, 1030, 990), "51", "product help explainers", accent=PINK, note="editable SVG guides")
    metric_card(image, (1050, 786, 1350, 990), "225/s", "event-read requests", accent=ORANGE, note="32 VUs • 0% errors • local")
    metric_card(
        image,
        (1370, 786, 1832, 990),
        "10k max",
        "chat connections / deployment",
        accent=GREEN,
        note="current stated ceiling • validate externally",
    )
    footer(image, 2)
    return image


def slide_3() -> Image.Image:
    image = vertical_gradient("#090E21", "#111936")
    add_glow(image, (-250, 240, 650, 1180), BLUE, blur=190, alpha=55)
    section_header(
        image,
        "02",
        "Distribution",
        "Open distribution surface. Licensed, packaged core.",
        "Operators keep their brand, customer relationship, hosting and local data; MyScoutee standardizes the engine and release rail.",
    )

    rounded_card(image, (92, 235, 1210, 963), fill="#101833", radius=30)
    text(image, (126, 266), "COMMON CORE / LOCAL CONTROL", size=17, color=GREEN, weight="bold")

    rounded_card(image, (394, 320, 902, 456), fill="#222B52", radius=24, outline="#6578CE")
    text(image, (648, 346), "MYSCOUTEE CORE", size=25, weight="bold", anchor="ma", align="center")
    text(
        image,
        (648, 389),
        "backend IP • signed releases • updates • support • common API",
        size=18,
        color=MUTED,
        anchor="ma",
        align="center",
    )
    for cx in (270, 650, 1030):
        draw_arrow(image, (648, 460), (cx, 552), color=BLUE, width=4, head=13)

    operator_specs = [
        ("CAMPUS BRAND", "campus.example", BLUE),
        ("CITY SOCIAL", "city.example", PINK),
        ("CLUB NETWORK", "club.example", ORANGE),
    ]
    for cx, (name, domain, accent) in zip((270, 650, 1030), operator_specs):
        x1, x2 = cx - 160, cx + 160
        rounded_card(image, (x1, 560, x2, 888), fill=CARD_2, radius=24, outline=accent, shadow=False)
        pill(image, (x1 + 24, 584), name, fill=accent, color=BG if accent in (ORANGE,) else WHITE, size=16, height=34)
        text(image, (x1 + 24, 632), domain, size=17, color=MUTED, weight="medium")
        rounded_card(image, (x1 + 22, 676, x2 - 22, 740), fill="#24315A", radius=16, shadow=False, outline=None)
        text(image, (cx, 708), "OPEN FRONTEND  •  PWA", size=17, weight="bold", anchor="mm")
        rounded_card(image, (x1 + 22, 754, x2 - 22, 818), fill="#202A4C", radius=16, shadow=False, outline=None)
        text(image, (cx, 786), "LOCAL .DEB CORE", size=17, weight="bold", anchor="mm")
        text(image, (cx, 851), "profiles • chats • events • payments", size=14, color=MUTED, anchor="ma", align="center")
    text(
        image,
        (126, 918),
        "Aggregate telemetry reports automatically; exit participation begins when the operator claims its deployment code.",
        size=17,
        color=MUTED,
    )

    rounded_card(image, (1260, 235, 1832, 963), fill=CARD, radius=30)
    status_pill(image, (1290, 264), "BUILT")
    text(image, (1290, 318), "Deployable artifact exists", size=28, weight="bold")
    text(image, (1290, 366), "myscoutee_1.0.0_amd64.deb", size=23, color=GREEN, weight="bold", mono=True)
    text(image, (1290, 408), "193,096,630 bytes  •  systemd + Docker stack", size=17, color=MUTED)
    ImageDraw.Draw(image).line((1290, 454, 1802, 454), fill=rgb("#35436F"), width=2)

    text(image, (1290, 482), "OPERATOR KEEPS", size=16, color=BLUE, weight="bold")
    bullet_list(
        image,
        [
            "Brand, domain and customer/community relationship",
            "Hosting, local data and operational control",
            "Own merchant/payment account, pricing and proceeds",
            "Partners, refunds, tax and commercial responsibility",
        ],
        x=1290,
        y=518,
        width=490,
        size=18,
        gap=12,
        bullet_color=BLUE,
    )
    text(image, (1290, 696), "NETWORK STANDARDIZES", size=16, color=PURPLE, weight="bold")
    bullet_list(
        image,
        [
            "Compatible signed core and update channel",
            "Matching, event and resource operating model",
            "Contribution schema and audit rules (planned)",
        ],
        x=1290,
        y=732,
        width=490,
        size=18,
        gap=12,
        bullet_color=PURPLE,
    )
    rounded_card(image, (1288, 866, 1804, 938), fill="#2A2034", radius=17, outline="#6E3E70", shadow=False)
    text(image, (1308, 882), "TRUTH LINE", size=13, color=PINK, weight="bold")
    text(
        image,
        (1408, 878),
        "Software executes the payment flow; the operator owns the account and funds.",
        size=16,
        color=TEXT,
        max_width=370,
    )
    footer(image, 3)
    return image


def slide_4() -> Image.Image:
    image = vertical_gradient("#07131F", "#10243A")
    add_glow(image, (1120, 100, 2080, 980), GREEN, blur=200, alpha=46)
    section_header(
        image,
        "03",
        "Telemetry + claim registry",
        "Every deployment is measured. Only claimed weight participates.",
        "Automatic aggregate telemetry proves scale; a deployment code binds measured history to a verified operator and exit rights.",
        status="PLANNED",
    )

    rounded_card(image, (88, 230, 1070, 972), fill="#0D1D2E", radius=30, outline="#214B50")
    text(image, (120, 260), "DEPLOYMENTS  >  AGGREGATE TELEMETRY  >  CLAIM REGISTRY", size=17, color=GREEN, weight="bold")

    instances = [
        ("CAMPUS", "50k QMAU", BLUE, 332),
        ("CITY", "30k QMAU", PINK, 522),
        ("CLUB", "20k QMAU", ORANGE, 712),
    ]
    for name, value, accent, cy in instances:
        rounded_card(image, (122, cy, 420, cy + 132), fill=CARD_2, radius=22, outline=accent, shadow=False)
        pill(image, (146, cy + 20), name, fill=accent, color=BG if accent == ORANGE else WHITE, size=15, height=32)
        text(image, (146, cy + 70), value, size=27, color=TEXT, weight="bold")
        text(image, (146, cy + 104), "signed aggregate + deploy code", size=14, color=MUTED)
        draw_arrow(image, (430, cy + 66), (586, 589), color=GREEN, width=4, head=12)

    rounded_card(image, (596, 416, 1018, 762), fill="#153B3A", radius=28, outline=GREEN)
    status_pill(image, (628, 446), "PLANNED")
    text(image, (628, 498), "CLAIM REGISTRY", size=29, weight="bold")
    text(image, (628, 542), "telemetry measures  •  code claim attributes", size=17, color="#A9E9D4", weight="medium")
    payload = (
        "verified network MAU\n"
        "deployment code + status\n"
        "registered operator\n"
        "claimed eligible weight\n"
        "indicative exit share\n"
        "history + audit"
    )
    text(image, (628, 582), payload, size=17, color=TEXT, mono=True, spacing=7)
    pill(image, (628, 716), "NO RAW USER CONTENT", fill="#0A2828", color=GREEN, size=14, height=32, outline=GREEN)
    rounded_card(image, (122, 856, 488, 936), fill="#11372F", radius=18, outline="#2D7A6A", shadow=False)
    text(image, (146, 872), "CLAIM CODE", size=14, color=GREEN, weight="bold")
    text(image, (146, 902), "named operator • traceable • exit-eligible", size=15, color=TEXT, weight="medium")
    rounded_card(image, (510, 856, 1018, 936), fill="#20273C", radius=18, outline="#46516D", shadow=False)
    text(image, (534, 872), "LEAVE UNCLAIMED", size=14, color=MUTED, weight="bold")
    text(image, (534, 902), "telemetry remains • no beneficiary • no exit share", size=15, color=TEXT, weight="medium")

    rounded_card(image, (1122, 230, 1832, 972), fill=CARD, radius=30)
    text(image, (1156, 260), "V1 CONTRACT METRIC", size=16, color=GREEN, weight="bold")
    text(image, (1156, 302), "Qualified MAU", size=36, weight="bold")
    text(
        image,
        (1156, 356),
        "A distinct human completing at least two substantive actions on at least two days in a rolling 30-day period.",
        size=22,
        color=MUTED,
        max_width=640,
        spacing=8,
    )
    bullet_list(
        image,
        [
            "Substantive = rate, join, message, host, book or verified attendance",
            "Exclude bots, demos, test accounts, admins and fraud",
            "One person contributes at most one network unit per month",
            "Average the six complete months before the measurement date",
        ],
        x=1158,
        y=500,
        width=620,
        size=18,
        gap=13,
        bullet_color=GREEN,
    )
    rounded_card(image, (1154, 748, 1800, 866), fill="#102C2F", radius=22, outline="#2D7A6A", shadow=False)
    text(image, (1180, 772), "operator weight", size=16, color="#A9E9D4", weight="bold", mono=True)
    text(image, (1180, 808), "= average(QMAU month -6 … month -1)", size=24, color=WHITE, weight="bold", mono=True)
    rounded_card(image, (1154, 886, 1800, 940), fill="#241E37", radius=16, outline="#56437A", shadow=False)
    text(image, (1180, 902), "No exit required • valid claims freeze only if an agreed exit occurs.", size=15, color=MUTED, max_width=590)
    footer(image, 4)
    return image


def slide_5() -> Image.Image:
    image = vertical_gradient("#0C0A22", "#171238")
    add_glow(image, (-240, 130, 650, 1020), PURPLE, blur=190, alpha=70)
    section_header(
        image,
        "04",
        "Network Success Pool",
        "Telemetry sets the curve. Claims divide the pool.",
        "Indicative while the network grows; only verified claims at the exit record date become payable.",
        status="PROPOSED",
    )

    rounded_card(image, (88, 230, 1015, 964), fill=CARD, radius=30)
    text(image, (120, 262), "FOUNDER SHARE AT THE EXIT RECORD DATE", size=17, color=PURPLE, weight="bold")
    chart = (156, 350, 946, 714)
    x1, y1, x2, y2 = chart
    draw = ImageDraw.Draw(image)
    for pct in (10, 20, 30, 40, 50):
        py = y2 - int((pct / 50) * (y2 - y1))
        draw.line((x1, py, x2, py), fill=rgb("#2C365F"), width=2)
        text(image, (x1 - 18, py), f"{pct}%", size=14, color=MUTED_2, anchor="rm")
    labels = ["200k", "500k", "1M", "10M"]
    values = [50, 20, 10, 10]
    xs = [x1 + 35, x1 + 280, x1 + 520, x2 - 35]
    points = []
    for x, label, value in zip(xs, labels, values):
        y = y2 - int((value / 50) * (y2 - y1))
        points.append((x, y))
        draw.line((x, y2, x, y2 + 10), fill=rgb(MUTED_2), width=2)
        text(image, (x, y2 + 24), label, size=16, color=MUTED, weight="medium", anchor="ma")
    draw.line(points, fill=rgb(PURPLE), width=8, joint="curve")
    for x, y in points:
        draw.ellipse((x - 12, y - 12, x + 12, y + 12), fill=rgb(PURPLE), outline=rgb(WHITE), width=3)
    draw.line((xs[2], y1, xs[2], y2), fill=rgb(GREEN), width=3)
    pill(image, (xs[2] - 94, y1 - 28), "1M TRIGGER", fill=GREEN, color=BG, size=15, height=34)
    text(image, (x1, 770), "Total contribution units", size=15, color=MUTED_2)

    rows = [("200k", "50%", "50%"), ("500k", "20%", "80%"), ("1M", "10%", "90%"), ("10M", "10%", "90%")]
    text(image, (124, 812), "TOTAL", size=14, color=MUTED_2, weight="bold")
    text(image, (362, 812), "FOUNDER", size=14, color=MUTED_2, weight="bold")
    text(image, (598, 812), "OPERATOR POOL", size=14, color=MUTED_2, weight="bold")
    for idx, (total, founder, pool) in enumerate(rows):
        y = 850 + idx * 27
        text(image, (124, y), total, size=17, weight="medium")
        text(image, (362, y), founder, size=17, color=PURPLE, weight="bold")
        text(image, (598, y), pool, size=17, color=GREEN, weight="bold")

    rounded_card(image, (1060, 230, 1832, 964), fill=CARD, radius=30)
    text(image, (1094, 262), "WORKING FORMULA", size=16, color=PURPLE, weight="bold")
    rounded_card(image, (1092, 306, 1800, 452), fill="#241D44", radius=22, outline="#56468C", shadow=False)
    formula = (
        "B = 100,000 founder units\n"
        "A = Σ all deployment weights  •  T = B + A\n"
        "C = Σ claimed operator weights\n"
        "F = max(10%, B / T)\n"
        "operator_i = (1 - F) × claimed_i / C"
    )
    text(image, (1122, 316), formula, size=18, color=WHITE, weight="bold", mono=True, spacing=5)
    text(image, (1094, 482), "AT 1M+ TOTAL UNITS", size=16, color=GREEN, weight="bold")
    bar_x1, bar_y1, bar_x2, bar_y2 = 1094, 524, 1798, 604
    split = bar_x1 + int((bar_x2 - bar_x1) * 0.10)
    draw.rounded_rectangle((bar_x1, bar_y1, bar_x2, bar_y2), radius=22, fill=rgb(GREEN))
    draw.rounded_rectangle((bar_x1, bar_y1, split + 16, bar_y2), radius=22, fill=rgb(PURPLE))
    text(image, ((bar_x1 + split) // 2, (bar_y1 + bar_y2) // 2), "10%", size=24, weight="bold", anchor="mm")
    text(image, ((split + bar_x2) // 2, (bar_y1 + bar_y2) // 2), "90% OPERATOR POOL", size=24, color=BG, weight="bold", anchor="mm")

    rounded_card(image, (1092, 638, 1800, 748), fill="#102E31", radius=22, outline="#2A736B", shadow=False)
    text(image, (1118, 660), "EXAMPLE", size=14, color=GREEN, weight="bold")
    text(
        image,
        (1118, 694),
        "At 1M+, an operator with 12% of claimed eligible weight receives 10.8% of defined net exit proceeds.",
        size=21,
        color=TEXT,
        max_width=650,
    )
    rounded_card(image, (1092, 774, 1800, 918), fill="#33202D", radius=22, outline="#7B405D", shadow=False)
    text(image, (1118, 798), "TERM TO LOCK BEFORE EXTERNAL USE", size=14, color=PINK, weight="bold")
    text(
        image,
        (1118, 832),
        "Unclaimed deployment payout = 0. Recommended: it proves scale but does not dilute valid claims. Confirm contractually.",
        size=20,
        color=TEXT,
        max_width=650,
        spacing=7,
    )
    text(
        image,
        (90, 990),
        "Legal structure required: participation agreement / settlement vehicle, exit definition, net proceeds, record date, audit, fraud clawback, tax and investor priority.",
        size=15,
        color=MUTED_2,
        max_width=1720,
    )
    footer(image, 5)
    return image


def slide_6() -> Image.Image:
    image = vertical_gradient("#120A18", "#27132A")
    draw = ImageDraw.Draw(image)
    add_glow(image, (1180, -100, 2080, 760), ORANGE, blur=200, alpha=58)
    section_header(
        image,
        "05",
        "10M fallback",
        "At 10M MAU with no exit, a separate 5% network share activates.",
        "Local partner commission stays with each operator; the founder’s fallback applies only to the defined combined member-contribution base.",
        status="MODEL — NOT TRACTION",
    )

    rounded_card(image, (88, 230, 932, 944), fill=CARD, radius=30)
    status_pill(image, (120, 260), "PROPOSED")
    text(image, (120, 314), "THE TRIGGER", size=29, weight="bold")

    trigger_items = [
        ("01", "VERIFIED NETWORK REACH", "The combined network reaches 10M verified MAU.", BLUE),
        ("02", "NO DEFINED EXIT", "No qualifying sale or other agreed liquidity event has occurred.", PINK),
        ("03", "NETWORK FALLBACK", "The founder receives 5% of the defined combined member-contribution base.", ORANGE),
    ]
    y = 382
    for idx, (number, heading, body, accent) in enumerate(trigger_items):
        rounded_card(image, (122, y, 898, y + 112), fill=CARD_2, radius=20, outline=accent, shadow=False)
        draw.ellipse((144, y + 28, 200, y + 84), fill=rgb(accent))
        text(
            image,
            (172, y + 56),
            number,
            size=17,
            color=BG if accent == ORANGE else WHITE,
            weight="bold",
            anchor="mm",
        )
        text(image, (226, y + 20), heading, size=21, color=accent, weight="bold")
        text(image, (226, y + 58), body, size=18, color=MUTED, max_width=620)
        if idx < len(trigger_items) - 1:
            draw_arrow(image, (510, y + 114), (510, y + 133), color=MUTED_2, width=3, head=9)
        y += 136

    rounded_card(image, (120, 806, 900, 914), fill="#302031", radius=20, outline="#75405F", shadow=False)
    text(image, (146, 828), "NOT A PARTNER TAKE RATE", size=14, color=PINK, weight="bold")
    text(
        image,
        (146, 860),
        "Local partner commission belongs to the operator that acquired the partner for its VPS.",
        size=20,
        color=TEXT,
        max_width=700,
    )

    rounded_card(image, (980, 230, 1832, 944), fill=CARD, radius=30)
    text(image, (1014, 260), "TWO INDEPENDENT ECONOMIES", size=17, color=ORANGE, weight="bold")

    rounded_card(image, (1012, 310, 1800, 514), fill="#102D30", radius=22, outline="#2E7168", shadow=False)
    pill(image, (1038, 334), "LOCAL VPS / OPERATOR", fill="#17463F", color=GREEN, size=14, height=32, outline=GREEN)
    text(image, (1038, 386), "Partner commission", size=27, weight="bold")
    text(
        image,
        (1038, 430),
        "Operator signs the partner; local software handles the transaction; commission is paid to the operator’s account.",
        size=18,
        color=TEXT,
        max_width=720,
    )
    text(
        image,
        (1038, 484),
        "local partner booking  >  operator commission",
        size=17,
        color=GREEN,
        weight="bold",
        mono=True,
    )

    rounded_card(image, (1012, 536, 1800, 752), fill="#322333", radius=22, outline="#7B405D", shadow=False)
    pill(image, (1038, 560), "NETWORK / 10M + NO EXIT", fill="#4A2C1D", color=ORANGE, size=14, height=32, outline=ORANGE)
    text(image, (1038, 612), "Founder 5% network share", size=27, weight="bold")
    text(
        image,
        (1038, 654),
        "Calculated only from the contract-defined combined member-contribution base—not from the local affiliate commission.",
        size=18,
        color=TEXT,
        max_width=720,
    )
    text(
        image,
        (1038, 716),
        "founder share = 5% × defined combined member base",
        size=17,
        color=ORANGE,
        weight="bold",
        mono=True,
    )

    rounded_card(image, (1012, 774, 1800, 914), fill="#171D35", radius=20, outline="#455071", shadow=False)
    text(image, (1038, 796), "OPERATOR INDEPENDENCE NEVER CHANGES", size=14, color=BLUE, weight="bold")
    bullet_list(
        image,
        [
            "Own partners, payment account, pricing and customer funds",
            "Own refunds, tax, commercial terms and customer relationship",
            "Founder never collects end-customer payments",
        ],
        x=1038,
        y=830,
        width=720,
        size=16,
        gap=7,
        bullet_color=BLUE,
    )
    footer(image, 6, note="Operator partner commission ≠ founder’s proposed 10M/no-exit 5% network share")
    return image


def slide_7() -> Image.Image:
    image = vertical_gradient("#07101F", "#111D36")
    add_glow(image, (1160, 180, 2100, 1080), BLUE, blur=210, alpha=62)
    section_header(
        image,
        "06",
        "Participation + value",
        "Install freely. Claim optionally. Let verified scale compound.",
        "No application or founding cohort: registration only activates identity and economic participation.",
    )

    rounded_card(image, (88, 230, 1190, 962), fill=CARD, radius=30)
    text(image, (120, 260), "SELF-SERVE PARTICIPATION", size=17, color=GREEN, weight="bold")
    stages = [
        ("01", "INSTALL", "Run the packaged .deb under any brand—without applying, registering or naming the operator.", GREEN),
        ("02", "MEASURE", "Automatic aggregate telemetry starts under the unique deployment code issued at deployment.", BLUE),
        ("03", "CLAIM — OPTIONAL", "Register the code whenever you want its measured history attributed to a company or operator.", PURPLE),
        ("04", "TRACK", "The dashboard shows verified claimed weight and the indicative exit allocation over time.", ORANGE),
        ("05", "STAY INDEPENDENT", "Leave it unclaimed: the deployment keeps running, while its exit allocation remains zero.", PINK),
    ]
    line_x = 164
    draw = ImageDraw.Draw(image)
    draw.line((line_x, 330, line_x, 830), fill=rgb("#35446F"), width=5)
    y = 318
    for number, heading, body, accent in stages:
        draw.ellipse((line_x - 18, y + 11, line_x + 18, y + 47), fill=rgb(accent), outline=rgb(WHITE), width=2)
        text(image, (line_x, y + 29), number, size=13, color=WHITE, weight="bold", anchor="mm")
        text(image, (216, y), heading, size=22, color=accent, weight="bold")
        text(image, (216, y + 38), body, size=18, color=TEXT, max_width=900, spacing=5)
        y += 112
    rounded_card(image, (120, 884, 1158, 932), fill="#102D30", radius=15, outline="#2E7168", shadow=False)
    text(
        image,
        (144, 899),
        "NO APPLICATION  •  NO INVITATION  •  CLAIM WHEN READY",
        size=16,
        color=GREEN,
        weight="bold",
    )

    rounded_card(image, (1220, 230, 1832, 962), fill="#182445", radius=30, outline="#3C518C")
    text(image, (1252, 260), "FEDERATED VALUE THESIS", size=17, color=GREEN, weight="bold")
    pill(
        image,
        (1252, 298),
        "MODEL — NOT VALUATION",
        fill="#3C331B",
        color=ORANGE,
        size=14,
        height=34,
        outline=ORANGE,
    )

    chart_left, chart_top, chart_right, chart_bottom = 1284, 380, 1778, 642
    draw.line((chart_left, chart_bottom, chart_right, chart_bottom), fill=rgb("#65729B"), width=3)
    draw.line((chart_left, chart_bottom, chart_left, chart_top), fill=rgb("#65729B"), width=3)
    curve_points = []
    for index in range(81):
        progress = index / 80
        x = chart_left + round(progress * (chart_right - chart_left))
        y = chart_bottom - round((progress**2.25) * (chart_bottom - chart_top - 18))
        curve_points.append((x, y))
    draw.line(curve_points, fill=rgb(GREEN), width=8, joint="curve")
    for progress in (0.25, 0.58, 1.0):
        point_index = min(80, round(progress * 80))
        cx, cy = curve_points[point_index]
        draw.ellipse((cx - 7, cy - 7, cx + 7, cy + 7), fill=rgb(WHITE), outline=rgb(GREEN), width=3)
    text(image, (1284, 348), "STRATEGIC NETWORK VALUE", size=13, color=MUTED_2, weight="bold")
    text(image, (1778, 657), "VERIFIED REACH", size=13, color=MUTED_2, weight="bold", anchor="ra")
    text(image, (1510, 443), "SUPERLINEAR /\nCOMPOUNDING", size=18, color=GREEN, weight="bold", align="center")

    rounded_card(image, (1252, 692, 1800, 770), fill="#111A34", radius=17, outline="#45568C", shadow=False)
    text(image, (1278, 710), "V(network)  ~  verified_reach ^ alpha", size=19, color=WHITE, weight="bold", mono=True)
    text(image, (1278, 742), "working hypothesis: alpha > 1", size=15, color=ORANGE, weight="bold", mono=True)

    text(image, (1252, 800), "WHY VALUE CAN COMPOUND", size=14, color=BLUE, weight="bold")
    bullet_list(
        image,
        [
            "More local distribution and verified usage",
            "A larger compatible operating standard",
            "Greater reach, scarcity and strategic relevance",
        ],
        x=1252,
        y=832,
        width=540,
        size=16,
        gap=8,
        bullet_color=BLUE,
    )
    text(image, (1252, 934), "Value hypothesis—not a guaranteed price curve.", size=14, color=MUTED_2, weight="medium")
    footer(image, 7, note="Next version: refine the metric, claim rules and exit record date")
    return image


def save_pdf(slide_paths: Sequence[Path], destination: Path) -> None:
    width_points = 13.333333 * 72
    height_points = 7.5 * 72
    pdf = pdf_canvas.Canvas(str(destination), pagesize=(width_points, height_points))
    for slide_path in slide_paths:
        pdf.drawImage(str(slide_path), 0, 0, width=width_points, height=height_points)
        pdf.showPage()
    pdf.save()


def uno_prop(name: str, value):
    from com.sun.star.beans import PropertyValue

    prop = PropertyValue()
    prop.Name = name
    prop.Value = value
    return prop


def package_with_libreoffice(slide_paths: Sequence[Path], odp_path: Path, pptx_path: Path, pdf_path: Path) -> None:
    try:
        import uno
        from com.sun.star.awt import Point, Size
    except ImportError as exc:
        raise RuntimeError("UNO is unavailable. Run with /usr/bin/python3.") from exc

    pipe_name = f"myscoutee_pitch_{os.getpid()}"
    accept = f"pipe,name={pipe_name};urp;StarOffice.ServiceManager"
    resolve_url = f"uno:pipe,name={pipe_name};urp;StarOffice.ComponentContext"
    profile_dir = Path(tempfile.mkdtemp(prefix="myscoutee-pitch-lo-"))
    process = subprocess.Popen(
        [
            "soffice",
            "--headless",
            "--nologo",
            "--nodefault",
            "--nofirststartwizard",
            "--norestore",
            f"-env:UserInstallation={uno.systemPathToFileUrl(str(profile_dir))}",
            f"--accept={accept}",
        ],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    try:
        local_ctx = uno.getComponentContext()
        resolver = local_ctx.ServiceManager.createInstanceWithContext(
            "com.sun.star.bridge.UnoUrlResolver", local_ctx
        )
        context = None
        deadline = time.time() + 20
        while time.time() < deadline:
            try:
                context = resolver.resolve(resolve_url)
                break
            except Exception:
                time.sleep(0.25)
        if context is None:
            raise RuntimeError("Could not connect to headless LibreOffice.")

        service_manager = context.ServiceManager
        desktop = service_manager.createInstanceWithContext("com.sun.star.frame.Desktop", context)
        document = desktop.loadComponentFromURL("private:factory/simpress", "_blank", 0, ())
        pages = document.getDrawPages()

        page_width, page_height = 33867, 19050
        while pages.getCount() > 1:
            pages.remove(pages.getByIndex(pages.getCount() - 1))

        for index, slide_path in enumerate(slide_paths):
            page = pages.getByIndex(0) if index == 0 else pages.insertNewByIndex(index)
            while page.getCount() > 0:
                page.remove(page.getByIndex(0))
            page.Width = page_width
            page.Height = page_height
            for name in ("BorderLeft", "BorderRight", "BorderTop", "BorderBottom"):
                try:
                    setattr(page, name, 0)
                except Exception:
                    pass

            shape = document.createInstance("com.sun.star.drawing.GraphicObjectShape")
            shape.Position = Point(0, 0)
            shape.Size = Size(page_width, page_height)
            shape.GraphicURL = uno.systemPathToFileUrl(str(slide_path.resolve()))
            page.add(shape)

        odp_url = uno.systemPathToFileUrl(str(odp_path.resolve()))
        document.storeAsURL(odp_url, (uno_prop("FilterName", "impress8"),))
        document.storeToURL(
            uno.systemPathToFileUrl(str(pptx_path.resolve())),
            (uno_prop("FilterName", "Impress MS PowerPoint 2007 XML"),),
        )
        document.storeToURL(
            uno.systemPathToFileUrl(str(pdf_path.resolve())),
            (
                uno_prop("FilterName", "impress_pdf_Export"),
                uno_prop("Overwrite", True),
            ),
        )
        document.close(True)
    finally:
        process.terminate()
        try:
            process.wait(timeout=8)
        except subprocess.TimeoutExpired:
            process.kill()
        shutil.rmtree(profile_dir, ignore_errors=True)


def make_contact_sheet(slide_paths: Sequence[Path], destination: Path) -> None:
    thumb_w, thumb_h = 640, 360
    margin = 28
    cols = 2
    rows = math.ceil(len(slide_paths) / cols)
    sheet = Image.new(
        "RGB",
        (cols * thumb_w + (cols + 1) * margin, rows * thumb_h + (rows + 1) * margin),
        rgb("#050813"),
    )
    for idx, slide_path in enumerate(slide_paths):
        slide = Image.open(slide_path).convert("RGB").resize((thumb_w, thumb_h), RESAMPLE_LANCZOS)
        x = margin + (idx % cols) * (thumb_w + margin)
        y = margin + (idx // cols) * (thumb_h + margin)
        sheet.paste(slide, (x, y))
    sheet.save(destination, quality=94)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--no-office", action="store_true", help="Skip ODP/PPTX packaging")
    args = parser.parse_args()

    OUT.mkdir(parents=True, exist_ok=True)
    SLIDES.mkdir(parents=True, exist_ok=True)
    builders = [slide_1, slide_2, slide_3, slide_4, slide_5, slide_6, slide_7]
    slide_paths: list[Path] = []
    for index, builder in enumerate(builders, start=1):
        slide = builder().convert("RGB")
        path = SLIDES / f"{index:02d}.png"
        slide.save(path, quality=96)
        slide_paths.append(path)
        print(f"rendered {path}")

    direct_pdf = OUT / "myscoutee_network_pitch.pdf"
    save_pdf(slide_paths, direct_pdf)
    print(f"rendered {direct_pdf}")

    contact_sheet = OUT / "contact-sheet.png"
    make_contact_sheet(slide_paths, contact_sheet)
    print(f"rendered {contact_sheet}")

    if not args.no_office:
        package_with_libreoffice(
            slide_paths,
            OUT / "myscoutee_network_pitch.odp",
            OUT / "myscoutee_network_pitch.pptx",
            OUT / "myscoutee_network_pitch-office.pdf",
        )
        print(f"packaged {OUT / 'myscoutee_network_pitch.pptx'}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
