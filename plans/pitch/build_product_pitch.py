#!/usr/bin/env python3
"""Render the eight-slide MyScoutee product pitch deck.

The deck reuses the visual primitives from build_network_pitch.py. Slides are
rendered as full-page images and packaged into PDF, ODP, and PPTX for predictable
cross-platform presentation.
"""

from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path
from typing import Sequence

from PIL import Image, ImageDraw

import build_network_pitch as ui


ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
OUT = HERE / "product-output"
SLIDES = OUT / "slides"
ASSETS = OUT / "assets"

W, H = ui.W, ui.H

BG = ui.BG
CARD = ui.CARD
CARD_2 = ui.CARD_2
TEXT = ui.TEXT
MUTED = ui.MUTED
MUTED_2 = ui.MUTED_2
BLUE = ui.BLUE
PURPLE = ui.PURPLE
PINK = ui.PINK
ORANGE = ui.ORANGE
GREEN = ui.GREEN
GOLD = ui.GOLD
WHITE = ui.WHITE
INK = ui.INK


SVG_ASSETS = {
    "rating": ROOT / "frontend/src/assets/help-center/explanations/en/home-game/affinity.svg",
    "affinity_network": ROOT / "frontend/src/assets/help-center/explanations/en/home-game/affinity-network.svg",
    "chat": ROOT / "frontend/src/assets/help-center/explanations/en/chats/activity-chat-message-window.svg",
    "event_join": ROOT / "frontend/src/assets/help-center/explanations/en/events/activity-event-join.svg",
    "ticket_scan": ROOT / "frontend/src/assets/help-center/explanations/en/assets-tickets/assets-ticket-scanner.svg",
}


def prepare_assets() -> dict[str, Path]:
    ASSETS.mkdir(parents=True, exist_ok=True)
    rendered: dict[str, Path] = {}
    for key, source in SVG_ASSETS.items():
        destination = ASSETS / f"{key}.png"
        subprocess.run(
            ["convert", "-background", "none", str(source), str(destination)],
            check=True,
        )
        rendered[key] = destination
    return rendered


def footer(image: Image.Image, page: int, *, note: str | None = None) -> None:
    draw = ImageDraw.Draw(image)
    draw.line((88, 1033, 1832, 1033), fill=ui.rgb("#27345F"), width=2)
    ui.text(
        image,
        (88, 1044),
        "MYSCOUTEE PRODUCT  •  CONFIDENTIAL WORKING DRAFT  •  JUL 2026",
        size=14,
        color=MUTED_2,
        weight="medium",
    )
    if note:
        ui.text(image, (960, 1044), note, size=14, color=MUTED_2, anchor="ma", align="center")
    ui.text(image, (1832, 1044), f"{page} / 8", size=14, color=MUTED_2, weight="bold", anchor="ra")


def labeled_card(
    image: Image.Image,
    box: tuple[int, int, int, int],
    label: str,
    title: str,
    body: str,
    *,
    accent: str,
    title_size: int = 24,
    body_size: int = 18,
) -> None:
    ui.rounded_card(image, box, fill=CARD, radius=22, outline=accent, shadow=False)
    x1, y1, x2, _ = box
    ui.text(image, (x1 + 24, y1 + 20), label.upper(), size=14, color=accent, weight="bold")
    ui.text(image, (x1 + 24, y1 + 54), title, size=title_size, weight="bold", max_width=x2 - x1 - 48)
    ui.text(
        image,
        (x1 + 24, y1 + 100),
        body,
        size=body_size,
        color=MUTED,
        max_width=x2 - x1 - 48,
        spacing=6,
    )


def flow_node(
    image: Image.Image,
    box: tuple[int, int, int, int],
    number: str,
    title: str,
    body: str,
    *,
    accent: str,
) -> None:
    ui.rounded_card(image, box, fill=CARD_2, radius=22, outline=accent, shadow=False)
    x1, y1, x2, _ = box
    draw = ImageDraw.Draw(image)
    draw.ellipse((x1 + 22, y1 + 22, x1 + 78, y1 + 78), fill=ui.rgb(accent))
    ui.text(
        image,
        (x1 + 50, y1 + 50),
        number,
        size=16,
        color=BG if accent in (GREEN, ORANGE, GOLD) else WHITE,
        weight="bold",
        anchor="mm",
    )
    ui.text(image, (x1 + 96, y1 + 20), title, size=22, weight="bold", max_width=x2 - x1 - 118)
    ui.text(image, (x1 + 96, y1 + 58), body, size=16, color=MUTED, max_width=x2 - x1 - 118)


def module_card(
    image: Image.Image,
    box: tuple[int, int, int, int],
    title: str,
    lines: Sequence[str],
    *,
    accent: str,
) -> None:
    ui.rounded_card(image, box, fill=CARD, radius=22, outline=accent, shadow=False)
    x1, y1, x2, _ = box
    ui.pill(image, (x1 + 22, y1 + 20), "BUILT", fill=GREEN, color=BG, size=13, height=30, pad_x=13)
    ui.text(image, (x1 + 22, y1 + 64), title, size=23, weight="bold", max_width=x2 - x1 - 44)
    ui.bullet_list(
        image,
        list(lines),
        x=x1 + 22,
        y=y1 + 110,
        width=x2 - x1 - 44,
        size=16,
        gap=8,
        bullet_color=accent,
    )


def slide_1(assets: dict[str, Path]) -> Image.Image:
    image = ui.vertical_gradient("#070B1C", "#141336")
    ui.add_glow(image, (-250, -250, 950, 900), PURPLE, blur=175, alpha=108)
    ui.add_glow(image, (1320, -240, 2200, 720), PINK, blur=180, alpha=72)

    ui.paste_brand_logo(image, (90, 58, 164, 132))
    ui.text(image, (184, 66), "MYSCOUTEE", size=25, weight="bold")
    ui.text(image, (184, 101), "PRODUCT + PARTNER DECK", size=14, color=MUTED, weight="medium")
    ui.pill(
        image,
        (1530, 64),
        "PRODUCT IN REFINEMENT",
        fill=GOLD,
        color=INK,
        size=15,
        height=34,
        pad_x=16,
    )

    ui.text(
        image,
        (90, 175),
        "Designed for the meeting.\nNot the swipe.",
        size=58,
        weight="bold",
        max_width=760,
        spacing=6,
    )
    ui.text(
        image,
        (94, 330),
        "A group-first social discovery engine that turns ranked mutual intent "
        "into comfortable, contextual real-world meetings.",
        size=25,
        color=MUTED,
        max_width=720,
        spacing=8,
    )
    ui.pill(image, (94, 482), "IDEA ORIGIN: 2016", fill=PURPLE, size=16, height=38)

    hero = ROOT / "plans/img/facebook_header.png"
    ui.paste_cover(image, hero, (850, 150, 1832, 535), radius=30, outline="#596BC2", darken=5)
    ui.pill(
        image,
        (888, 484),
        "1–10 PRIORITY  >  MUTUAL GRAPH  >  GROUP  >  EVENT",
        fill="#111936",
        color=WHITE,
        size=16,
        height=38,
    )

    timeline = [
        (
            "2016 • IDEA",
            "The product thesis",
            "The ranked-priority, reciprocal and group-first concept predates the later build phase.",
            BLUE,
        ),
        (
            "AI BUILD PHASE",
            "Breadth became possible",
            "Artificial intelligence (AI)-assisted delivery compressed implementation time across the full workflow.",
            PURPLE,
        ),
        (
            "2026",
            "Engineering the proof",
            "Senior-led refactoring, performance, safety, pilots and measurable meeting outcomes.",
            GREEN,
        ),
    ]
    for x, (label, title, body, accent) in zip((90, 660, 1230), timeline):
        labeled_card(image, (x, 590, x + 520, 848), label, title, body, accent=accent)

    ui.rounded_card(image, (90, 878, 1832, 1006), fill="#101831", radius=24, shadow=False)
    ui.text(image, (122, 902), "THE PRODUCT", size=15, color=GREEN, weight="bold")
    ui.text(
        image,
        (292, 894),
        "Not another matching screen: an end-to-end system from nuanced intent to a shared experience.",
        size=25,
        weight="medium",
        max_width=1450,
    )
    ui.text(
        image,
        (122, 958),
        "≈350,000 physical source lines in the current scoped product • AI-assisted build • no commercial traction claimed",
        size=15,
        color=MUTED_2,
    )
    footer(image, 1, note="Idea originated in 2016; implementation accelerated later")
    return image


def slide_2(assets: dict[str, Path]) -> Image.Image:
    image = ui.vertical_gradient("#07101E", "#101B38")
    ui.add_glow(image, (1200, 50, 2100, 920), BLUE, blur=190, alpha=50)
    ui.section_header(
        image,
        "01",
        "Why it exists",
        "Swipe products stop at a match. MyScoutee starts there.",
        "Binary input, pair pressure and attention-led economics leave the hardest part—meeting well—unsolved.",
    )

    problems = [
        ("01", "Binary input", "A yes/no swipe discards strength, nuance and who someone wants to meet first.", BLUE),
        ("02", "Pair pressure", "An immediate one-to-one match can create a fragile, high-pressure interaction.", PURPLE),
        ("03", "Match ≠ outcome", "A notification or message says nothing about whether people actually meet.", PINK),
        ("04", "Wrong success metric", "Time in feed can be rewarded even when the user never progresses offline.", ORANGE),
    ]
    positions = [(88, 250), (518, 250), (88, 526), (518, 526)]
    for (label, title, body, accent), (x, y) in zip(problems, positions):
        labeled_card(image, (x, y, x + 402, y + 246), label, title, body, accent=accent, title_size=24)

    ui.rounded_card(image, (958, 250, 1832, 964), fill="#151E3D", radius=30, outline="#3A4D87")
    ui.text(image, (998, 284), "A DIFFERENT DEFINITION OF SUCCESS", size=16, color=GREEN, weight="bold")
    ui.text(image, (998, 332), "SUCCESS ≠ MATCH", size=38, color=PINK, weight="bold", mono=True)
    ui.text(
        image,
        (998, 394),
        "SUCCESS = COMPLETED,\nMUTUALLY WELCOMED MEETING",
        size=35,
        color=GREEN,
        weight="bold",
        mono=True,
        spacing=6,
    )
    ImageDraw.Draw(image).line((998, 510, 1792, 510), fill=ui.rgb("#33436F"), width=2)
    ui.text(image, (998, 548), "FIRST WEDGE", size=15, color=BLUE, weight="bold")
    ui.bullet_list(
        image,
        [
            "Singles tired of binary swiping",
            "People who prefer social context before one-to-one interaction",
            "Activity-led communities, campuses, clubs and festivals",
        ],
        x=1000,
        y=588,
        width=742,
        size=20,
        gap=16,
        bullet_color=BLUE,
    )
    ui.rounded_card(image, (994, 760, 1796, 920), fill="#252044", radius=22, outline=PURPLE, shadow=False)
    ui.text(image, (1022, 784), "BUILD PRINCIPLE", size=14, color=PURPLE, weight="bold")
    ui.text(
        image,
        (1022, 822),
        "AI accelerated construction. It did not invent the product thesis—or replace "
        "the engineering needed for architecture, performance and quality.",
        size=21,
        color=TEXT,
        max_width=730,
        spacing=7,
    )
    footer(image, 2)
    return image


def slide_3(assets: dict[str, Path]) -> Image.Image:
    image = ui.vertical_gradient("#0B0921", "#17143A")
    ui.add_glow(image, (-240, 80, 700, 1050), PURPLE, blur=190, alpha=70)
    ui.section_header(
        image,
        "02",
        "Mutual Priority Logic",
        "One richer input becomes a weighted mutual graph.",
        "The engine uses graded intent, reciprocity and context to propose balanced groups—not only isolated pairs.",
        status="BUILT",
    )

    ui.rounded_card(image, (88, 230, 1028, 970), fill=CARD, radius=30)
    ui.text(image, (120, 260), "FROM RANKED SIGNAL TO SOCIAL STRUCTURE", size=16, color=PURPLE, weight="bold")
    ui.paste_cover(image, assets["rating"], (120, 306, 545, 565), radius=20, crop="contain", outline="#5E6FB0")
    ui.paste_cover(
        image,
        assets["affinity_network"],
        (570, 306, 994, 565),
        radius=20,
        crop="contain",
        outline="#5E6FB0",
    )
    ui.text(image, (145, 585), "1–10 PRIORITY", size=17, color=ORANGE, weight="bold")
    ui.text(image, (594, 585), "WEIGHTED MUTUAL GRAPH", size=17, color=GREEN, weight="bold")

    ui.rounded_card(image, (120, 642, 994, 782), fill="#251F48", radius=22, outline="#5C4B91", shadow=False)
    formula = (
        "directed preference:  p[A to B] in [1,10]\n"
        "reciprocal + context evidence  >  weighted relationship\n"
        "weighted relationships  >  balanced group candidates"
    )
    ui.text(image, (148, 666), formula, size=20, color=WHITE, weight="bold", mono=True, spacing=8)
    ui.rounded_card(image, (120, 816, 994, 926), fill="#10312F", radius=22, outline="#2E776C", shadow=False)
    ui.text(image, (148, 840), "CORE UNIT OF VALUE", size=14, color=GREEN, weight="bold")
    ui.text(
        image,
        (148, 876),
        "A viable social group with a path to meeting—not a match notification.",
        size=22,
        color=TEXT,
        max_width=810,
    )

    ui.rounded_card(image, (1070, 230, 1832, 970), fill="#151E3D", radius=30)
    ui.text(image, (1104, 260), "WHAT THE ENGINE DOES", size=16, color=GREEN, weight="bold")
    steps = [
        ("01", "Capture graded intent", "People can prioritize individuals or pairs from 1–10.", BLUE),
        ("02", "Resolve reciprocity", "Mutual ratings and profile/context evidence create weighted edges.", PURPLE),
        ("03", "Plan balanced groups", "Graph components, size/type constraints and swap refinement optimize group affinity.", PINK),
        ("04", "Keep the graph editable", "Priorities can change; meetings add structured reputation evidence.", GREEN),
    ]
    y = 310
    for number, title, body, accent in steps:
        flow_node(image, (1102, y, 1800, y + 132), number, title, body, accent=accent)
        y += 150
    footer(image, 3, note="Working backend engine; no claim yet that it improves real-world outcomes")
    return image


def slide_4(assets: dict[str, Path]) -> Image.Image:
    image = ui.vertical_gradient("#07131F", "#10243A")
    ui.add_glow(image, (1180, 40, 2080, 930), GREEN, blur=200, alpha=47)
    ui.section_header(
        image,
        "03",
        "Product journey",
        "One workflow turns mutual intent into a shared experience.",
        "Discovery, group formation, communication, event operations and post-meeting evidence live in one workflow.",
        status="BUILT",
    )

    flow = [
        ("01", "PRIORITIZE", "1–10 signal", BLUE),
        ("02", "FORM", "mutual group", PURPLE),
        ("03", "TALK", "contextual chat", PINK),
        ("04", "PLAN", "shared event", ORANGE),
        ("05", "MEET", "ticket / check-in", GREEN),
        ("06", "LEARN", "feedback", GOLD),
    ]
    node_w = 250
    for idx, (number, title, body, accent) in enumerate(flow):
        x = 88 + idx * 294
        ui.rounded_card(image, (x, 248, x + node_w, 420), fill=CARD, radius=22, outline=accent, shadow=False)
        ui.pill(
            image,
            (x + 20, 270),
            number,
            fill=accent,
            color=BG if accent in (ORANGE, GREEN, GOLD) else WHITE,
            size=14,
            height=32,
            pad_x=13,
        )
        ui.text(image, (x + 20, 320), title, size=23, weight="bold")
        ui.text(image, (x + 20, 362), body, size=17, color=MUTED, max_width=node_w - 40)
        if idx < len(flow) - 1:
            ui.draw_arrow(image, (x + node_w + 8, 334), (x + node_w + 34, 334), color=MUTED_2, width=3, head=9)

    visuals = [
        ("GROUP CHAT", "Shared context before the meeting", assets["chat"], BLUE),
        ("EVENT WORKFLOW", "Invitation > checkout > check-in > feedback", assets["event_join"], ORANGE),
        ("VERIFIED ARRIVAL", "Ticket and quick-response (QR) check-in", assets["ticket_scan"], GREEN),
    ]
    for x, (title, subtitle, path, accent) in zip((88, 680, 1272), visuals):
        ui.rounded_card(image, (x, 468, x + 560, 914), fill=CARD, radius=26, outline=accent)
        ui.text(image, (x + 26, 492), title, size=16, color=accent, weight="bold")
        ui.text(image, (x + 26, 528), subtitle, size=19, weight="medium", max_width=500)
        ui.paste_cover(image, path, (x + 24, 574, x + 536, 874), radius=18, crop="contain", outline="#405187")

    ui.rounded_card(image, (88, 936, 1832, 998), fill="#10312F", radius=18, outline="#2E776C", shadow=False)
    ui.text(image, (116, 954), "NORTH STAR", size=14, color=GREEN, weight="bold")
    ui.text(
        image,
        (276, 950),
        "Completed, mutually welcomed real-world meetings—not swipe volume, feed time or raw message count.",
        size=22,
        weight="medium",
        max_width=1490,
    )
    footer(image, 4)
    return image


def slide_5(assets: dict[str, Path]) -> Image.Image:
    image = ui.vertical_gradient("#081021", "#111B3A")
    ui.add_glow(image, (1200, 120, 2060, 1040), BLUE, blur=210, alpha=52)
    ui.section_header(
        image,
        "04",
        "Built product surface",
        "The graph is only one part of the product.",
        "Current code spans discovery, group planning, chat, events, operations, commerce scaffolding and governance.",
        status="BUILT",
    )

    modules = [
        (
            "MATCH INTELLIGENCE",
            ["1–10 single/pair signals", "Reciprocal affinity edges", "Network-aware discovery"],
            BLUE,
        ),
        (
            "GROUP + CHAT",
            ["Affinity-led group planner", "Replies, reactions, media", "Push and support trails"],
            PURPLE,
        ),
        (
            "EVENT ENGINE",
            ["Create, explore, invite, join", "Waitlists, stages and slots", "Tournament + leaderboard"],
            PINK,
        ),
        (
            "REAL-WORLD OPERATIONS",
            ["Transport and accommodation", "Supplies and contributions", "Capacity and request approval"],
            ORANGE,
        ),
        (
            "COMMERCE WORKFLOW",
            ["Basket, pricing, promo codes", "Tickets, QR and audit", "Payment adapters; live pay off"],
            GREEN,
        ),
        (
            "TRUST + CONTROL",
            ["Structured event feedback", "Report, warn, block and review", "Admin stats and graph tools"],
            GOLD,
        ),
    ]
    boxes = [
        (88, 242, 460, 558),
        (482, 242, 854, 558),
        (876, 242, 1248, 558),
        (88, 580, 460, 896),
        (482, 580, 854, 896),
        (876, 580, 1248, 896),
    ]
    for box, (title, lines, accent) in zip(boxes, modules):
        module_card(image, box, title, lines, accent=accent)

    ui.rounded_card(image, (1280, 242, 1832, 970), fill="#182445", radius=30, outline="#3C518C")
    ui.text(image, (1314, 272), "DELIVERY FOUNDATION", size=16, color=GREEN, weight="bold")
    stack = [
        ("FRONTEND", "Angular web app", BLUE),
        ("BACKEND", "Java / Spring services", PURPLE),
        ("DATA + REALTIME", "MongoDB • Redis • WebSocket", PINK),
        ("DEPLOYMENT", "Debian-packaged Docker stack", ORANGE),
    ]
    y = 320
    for label, value, accent in stack:
        ui.rounded_card(image, (1312, y, 1800, y + 92), fill=CARD, radius=18, outline=accent, shadow=False)
        ui.text(image, (1336, y + 18), label, size=13, color=accent, weight="bold")
        ui.text(image, (1336, y + 48), value, size=20, weight="bold", max_width=430)
        y += 108

    ui.rounded_card(image, (1312, 764, 1800, 842), fill="#11362F", radius=17, outline="#2D7A6A", shadow=False)
    ui.text(image, (1336, 781), "CHAT LOAD EVIDENCE", size=13, color=GREEN, weight="bold")
    ui.text(image, (1336, 811), "500 concurrent clients validated", size=19, weight="bold")
    ui.rounded_card(image, (1312, 858, 1800, 938), fill="#33202D", radius=17, outline="#7B405D", shadow=False)
    ui.text(image, (1336, 875), "BOUNDARY TO VALIDATE", size=13, color=PINK, weight="bold")
    ui.text(image, (1336, 905), "10,000 connections / deployment stated ceiling", size=17, weight="bold")

    ui.text(
        image,
        (88, 930),
        "Repository truth: checkout and payment adapters exist, but production payment integration is disabled. Built capability ≠ live revenue.",
        size=16,
        color=MUTED_2,
        max_width=1150,
    )
    footer(image, 5, note="Product breadth is implemented; product-market fit and commercial traction are not demonstrated")
    return image


def slide_6(assets: dict[str, Path]) -> Image.Image:
    image = ui.vertical_gradient("#0C0A22", "#171238")
    ui.add_glow(image, (-240, 130, 650, 1020), PURPLE, blur=190, alpha=65)
    ui.section_header(
        image,
        "05",
        "Why it is different",
        "MyScoutee changes the full discovery system.",
        "The comparison is with a typical swipe flow—not a performance claim against any named competitor.",
    )

    ui.rounded_card(image, (88, 232, 1260, 932), fill=CARD, radius=30)
    ui.text(image, (122, 264), "TYPICAL SWIPE FLOW", size=16, color=MUTED, weight="bold")
    ui.text(image, (676, 264), "MYSCOUTEE", size=16, color=GREEN, weight="bold")
    rows = [
        ("Binary like / dislike", "1–10 ranked priority"),
        ("Pair is the matching unit", "Compatible group is the matching unit"),
        ("Match ends discovery", "Match starts a meeting workflow"),
        ("Immediate one-to-one chat", "Contextual group interaction"),
        ("Repeated feed decisions", "Continuously editable social graph"),
        ("Optimize matches and messages", "Optimize accepted groups and meetings"),
        ("Monetize access or attention", "Let local operators earn from real-world action"),
    ]
    y = 312
    for index, (left, right) in enumerate(rows):
        fill = "#121A35" if index % 2 == 0 else "#18213F"
        ui.rounded_card(image, (116, y, 1232, y + 72), fill=fill, radius=14, outline=None, shadow=False)
        ui.text(image, (142, y + 21), left, size=19, color=MUTED, max_width=500)
        ui.text(image, (696, y + 21), right, size=19, color=TEXT, weight="medium", max_width=500)
        ui.text(image, (650, y + 36), ">", size=22, color=GREEN, weight="bold", anchor="mm")
        y += 82

    ui.rounded_card(image, (1290, 232, 1832, 932), fill="#192445", radius=30, outline="#40548F")
    ui.text(image, (1324, 264), "WHAT CAN BECOME DEFENSIBLE", size=16, color=PURPLE, weight="bold")
    defensibility = [
        ("01", "Behavioral model", "A pre-AI product thesis around ranked, reciprocal and group-centric discovery.", BLUE),
        ("02", "Integrated workflow", "Graph > group > chat > event > feedback in one operating layer.", PURPLE),
        ("03", "Outcome loop", "Future meeting evidence can connect graph quality to real-world results.", GREEN),
        ("04", "Delivery rail", "A packaged product can serve direct, community and branded deployments.", ORANGE),
    ]
    y = 312
    for number, title, body, accent in defensibility:
        flow_node(image, (1320, y, 1800, y + 126), number, title, body, accent=accent)
        y += 144

    ui.rounded_card(image, (88, 952, 1832, 1006), fill="#33202D", radius=16, outline="#7B405D", shadow=False)
    ui.text(image, (116, 967), "MOAT TRUTH", size=13, color=PINK, weight="bold")
    ui.text(
        image,
        (260, 965),
        "Raw AI-generated code is not the moat. The model, integrated workflow, engineered quality and validated outcome loop can be.",
        size=19,
        weight="medium",
        max_width=1510,
    )
    footer(image, 6)
    return image


def slide_7(assets: dict[str, Path]) -> Image.Image:
    image = ui.vertical_gradient("#120A18", "#27132A")
    ui.add_glow(image, (1200, -80, 2080, 780), ORANGE, blur=200, alpha=55)
    ui.section_header(
        image,
        "06",
        "Operator economics",
        "Local operators earn when groups create real-world action.",
        "A virtual private server (VPS) is an operator-hosted deployment; its partner commission belongs to that operator.",
        status="PLANNED",
    )

    revenue_rails = [
        (
            "PRIMARY HYPOTHESIS",
            "Operator partner commission",
            "An operator signs venues, festivals, activities, travel or experience partners for its own private deployment; attributable bookings pay that operator.",
            GREEN,
        ),
        (
            "EXPANSION",
            "Operator event commerce",
            "The operator may earn ticketing, checkout or organizer service fees from transactions handled by its local deployment.",
            ORANGE,
        ),
        (
            "LOCAL CONTROL",
            "Independent commercial model",
            "The operator chooses partners, pricing, payout account, tax and refunds. The software executes the configured payment flow.",
            PURPLE,
        ),
    ]
    y = 250
    for label, title, body, accent in revenue_rails:
        labeled_card(image, (88, y, 894, y + 210), label, title, body, accent=accent, body_size=17)
        y += 228

    ui.rounded_card(image, (936, 250, 1832, 944), fill=CARD, radius=30)
    ui.text(image, (970, 282), "LOCAL OPERATOR REVENUE LOOP", size=16, color=GREEN, weight="bold")
    funnel = [
        ("BETTER GROUP", BLUE),
        ("LOCAL PARTNER", PURPLE),
        ("REAL MEETING", PINK),
        ("BOOKING", ORANGE),
        ("OPERATOR EARNS", GREEN),
    ]
    x = 972
    for label, accent in funnel:
        box = ui.pill(
            image,
            (x, 330),
            label,
            fill=accent,
            color=BG if accent in (ORANGE, GREEN) else WHITE,
            size=13,
            height=34,
            pad_x=12,
        )
        x = box[2] + 12

    ui.rounded_card(image, (970, 406, 1798, 566), fill="#27203D", radius=22, outline="#5A476E", shadow=False)
    ui.text(image, (998, 430), "LOCAL OPERATOR REVENUE MODEL", size=14, color=PURPLE, weight="bold")
    equation = (
        "operator revenue\n"
        "= local partner bookings × agreed commission\n"
        "+ local transaction value × operator-set fee"
    )
    ui.text(image, (998, 468), equation, size=20, color=WHITE, weight="bold", mono=True, spacing=7)

    ui.text(image, (970, 600), "WHAT EXISTS TODAY", size=14, color=BLUE, weight="bold")
    ui.bullet_list(
        image,
        [
            "Event creation, resources, pricing, basket, promo and ticket surfaces",
            "Stripe and Barion adapter code plus payment audit workflow",
            "Operator-owned payout flow is planned; production charging remains disabled",
        ],
        x=972,
        y=636,
        width=790,
        size=17,
        gap=10,
        bullet_color=BLUE,
    )

    ui.rounded_card(image, (970, 782, 1798, 922), fill="#33202D", radius=18, outline="#7B405D", shadow=False)
    ui.text(image, (994, 802), "SEPARATE NETWORK FALLBACK", size=14, color=PINK, weight="bold")
    ui.text(
        image,
        (994, 836),
        "Only at 10 million verified monthly active users (MAU) with no exit: the founder seeks 5% of the contract-defined "
        "combined member-contribution base. It is not the operator’s local partner commission.",
        size=17,
        color=TEXT,
        max_width=770,
        spacing=6,
    )
    footer(image, 7, note="Operator partner commission ≠ founder’s proposed 10-million/no-exit 5% network share")
    return image


def slide_8(assets: dict[str, Path]) -> Image.Image:
    image = ui.vertical_gradient("#07101F", "#111D36")
    ui.add_glow(image, (1180, 160, 2100, 1080), BLUE, blur=210, alpha=60)
    ui.section_header(
        image,
        "07",
        "Roadmap + ask",
        "Prove the meeting loop—then scale distribution.",
        "The next milestone is evidence that mutual-priority groups create repeatable real-world outcomes, not a larger codebase.",
        status="MODEL — NOT TRACTION",
    )

    ui.rounded_card(image, (88, 230, 1160, 962), fill=CARD, radius=30)
    ui.text(image, (120, 260), "GATED PRODUCT PLAN", size=16, color=GREEN, weight="bold")
    phases = [
        ("NOW", "HARDEN THE CORE", "Performance • mobile processor • safety • tests • independent chat-load validation", GREEN),
        ("PILOT", "ONE DENSE COMMUNITY", "Enough reciprocal signals, group inventory and relevant events to test the loop", BLUE),
        ("MEASURE", "FULL OUTCOME FUNNEL", "Group proposed > accepted > active chat > event > attendance > feedback", PURPLE),
        ("REVENUE", "OPERATOR COMMISSION", "Test whether local bookings create attributable operator commission", ORANGE),
        ("REPEAT", "LAUNCH PLAYBOOK", "Expand by community, city, partner and—where useful—branded deployment", PINK),
    ]
    line_x = 162
    draw = ImageDraw.Draw(image)
    draw.line((line_x, 344, line_x, 872), fill=ui.rgb("#35446F"), width=5)
    y = 322
    for timing, title, body, accent in phases:
        draw.ellipse((line_x - 16, y + 12, line_x + 16, y + 44), fill=ui.rgb(accent), outline=ui.rgb(WHITE), width=2)
        ui.pill(image, (208, y), timing, fill="#242E52", color=accent, size=13, height=30, outline=accent)
        ui.text(image, (208, y + 42), title, size=21, weight="bold")
        ui.text(image, (490, y + 42), body, size=17, color=MUTED, max_width=600, spacing=5)
        y += 112
    ui.rounded_card(image, (120, 888, 1128, 932), fill="#10312F", radius=14, outline="#2E776C", shadow=False)
    ui.text(
        image,
        (144, 900),
        "Gate: accepted groups + completed meetings + healthy repeat behavior + partner value",
        size=16,
        color=GREEN,
        weight="medium",
    )

    ui.rounded_card(image, (1192, 230, 1832, 962), fill="#182445", radius=30, outline="#3C518C")
    ui.text(image, (1226, 260), "THE ASK", size=16, color=GREEN, weight="bold")
    ask_items = [
        ("PILOT", "test community", "dense enough to test group formation", BLUE),
        ("PARTNERS", "venues + experiences", "inventory and attributable booking tests", ORANGE),
        ("EXPERTISE", "safety + graph advisors", "privacy, trust and behavioral validation", PURPLE),
        ("CAPITAL", "strategic build funding", "hardening, product validation and distribution", GREEN),
    ]
    y = 312
    for value, title, body, accent in ask_items:
        ui.rounded_card(image, (1224, y, 1800, y + 112), fill=CARD, radius=19, outline=accent, shadow=False)
        ui.text(image, (1248, y + 20), value, size=17, color=accent, weight="bold")
        ui.text(image, (1420, y + 18), title, size=20, weight="bold", max_width=340)
        ui.text(image, (1420, y + 56), body, size=15, color=MUTED, max_width=340)
        y += 126

    ui.text(image, (1226, 828), "THE PRODUCT PROMISE", size=14, color=PINK, weight="bold")
    ui.rounded_card(image, (1224, 858, 1800, 930), fill="#33202D", radius=18, outline="#7B405D", shadow=False)
    ui.text(
        image,
        (1250, 876),
        "We win when people progress beyond the screen and actually meet.",
        size=21,
        weight="bold",
        max_width=520,
    )
    footer(image, 8, note="Next version: refine pilot density, meeting funnel and operator partner attribution")
    return image


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--no-office", action="store_true", help="Skip ODP/PPTX packaging")
    args = parser.parse_args()

    OUT.mkdir(parents=True, exist_ok=True)
    SLIDES.mkdir(parents=True, exist_ok=True)
    assets = prepare_assets()
    builders = [slide_1, slide_2, slide_3, slide_4, slide_5, slide_6, slide_7, slide_8]

    slide_paths: list[Path] = []
    for index, builder in enumerate(builders, start=1):
        slide = builder(assets).convert("RGB")
        path = SLIDES / f"{index:02d}.png"
        slide.save(path, quality=96)
        slide_paths.append(path)
        print(f"rendered {path}")

    direct_pdf = OUT / "myscoutee_product_pitch.pdf"
    ui.save_pdf(slide_paths, direct_pdf)
    print(f"rendered {direct_pdf}")

    contact_sheet = OUT / "contact-sheet.png"
    ui.make_contact_sheet(slide_paths, contact_sheet)
    print(f"rendered {contact_sheet}")

    if not args.no_office:
        ui.package_with_libreoffice(
            slide_paths,
            OUT / "myscoutee_product_pitch.odp",
            OUT / "myscoutee_product_pitch.pptx",
            OUT / "myscoutee_product_pitch-office.pdf",
        )
        print(f"packaged {OUT / 'myscoutee_product_pitch.pptx'}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
