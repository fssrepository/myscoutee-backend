#!/usr/bin/env python3
"""Build deterministic brand layers and optionally rebuild source checkpoints."""

import argparse
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = next(candidate for candidate in Path(__file__).resolve().parents if (candidate / "frontend/src/assets/logo/heart.png").is_file())
PACKAGE = ROOT / "guides/publication/story/films/google-flow/a-match-is-not-a-meeting"
FRAMES = PACKAGE / "assets/frames"
LOGO = ROOT / "frontend/src/assets/logo/heart.png"
SOURCES = {
    name: PACKAGE / f"assets/source/{name}_imagegen_source.png"
    for name in ("PR_CP01", "PR_CP02", "PR_CP03", "PR_CP04", "PR_CP05", "PR_CP06", "PR_CP07", "PR_CP08")
}
FONT_REGULAR = Path("/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf")
FONT_BOLD = Path("/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf")
SIZE = (720, 1280)


def cover(image: Image.Image) -> Image.Image:
    image = image.convert("RGB")
    scale = max(SIZE[0] / image.width, SIZE[1] / image.height)
    resized = image.resize((round(image.width * scale), round(image.height * scale)), Image.LANCZOS)
    left = (resized.width - SIZE[0]) // 2
    top = (resized.height - SIZE[1]) // 2
    return resized.crop((left, top, left + SIZE[0], top + SIZE[1]))


def gradient_layer(top_height: int, bottom_height: int) -> Image.Image:
    shade = Image.new("RGBA", SIZE, (0, 0, 0, 0))
    px = shade.load()
    for y in range(top_height):
        alpha = round(205 * (1 - y / top_height))
        for x in range(SIZE[0]):
            px[x, y] = (4, 13, 26, alpha)
    for y in range(SIZE[1] - bottom_height, SIZE[1]):
        alpha = round(225 * ((y - (SIZE[1] - bottom_height)) / bottom_height))
        for x in range(SIZE[0]):
            px[x, y] = (4, 13, 26, alpha)
    return shade


def gradient_overlay(image: Image.Image, top_height: int, bottom_height: int) -> Image.Image:
    return Image.alpha_composite(
        image.convert("RGBA"), gradient_layer(top_height, bottom_height)
    )


def brand(draw_target: Image.Image, y: int) -> None:
    logo = Image.open(LOGO).convert("RGBA").resize((74, 74), Image.LANCZOS)
    font = ImageFont.truetype(str(FONT_BOLD), 64)
    word = "yScoutee"
    probe = ImageDraw.Draw(draw_target)
    box = probe.textbbox((0, 0), word, font=font)
    total = 74 + 15 + (box[2] - box[0])
    x = (SIZE[0] - total) // 2
    draw_target.alpha_composite(logo, (x, y))
    probe.text((x + 89, y + 3), word, font=font, fill=(250, 250, 248, 255),
               stroke_width=2, stroke_fill=(3, 9, 18, 210))


def centered_text(image: Image.Image, text: str, y: int, size: int) -> None:
    draw = ImageDraw.Draw(image)
    font = ImageFont.truetype(str(FONT_BOLD), size)
    box = draw.textbbox((0, 0), text, font=font, stroke_width=2)
    x = (SIZE[0] - (box[2] - box[0])) // 2
    draw.text((x, y), text, font=font, fill=(255, 198, 72, 255),
              stroke_width=2, stroke_fill=(3, 9, 18, 230))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--rebuild-checkpoints",
        action="store_true",
        help="explicitly replace approved frame PNGs from their source images",
    )
    args = parser.parse_args()

    FRAMES.mkdir(parents=True, exist_ok=True)
    if args.rebuild_checkpoints:
        for name, source in SOURCES.items():
            cover(Image.open(source)).save(FRAMES / f"{name}.png", optimize=True)
    else:
        missing = [FRAMES / f"{name}.png" for name in SOURCES if not (FRAMES / f"{name}.png").is_file()]
        if missing:
            joined = ", ".join(str(path) for path in missing)
            raise RuntimeError(
                f"Approved checkpoints are missing: {joined}. "
                "Use --rebuild-checkpoints only when replacement is intentional."
            )

    clean = Image.open(FRAMES / "PR_CP01.png")

    opening = gradient_overlay(clean, 180, 170)
    brand(opening, 42)
    centered_text(opening, "MATCH ≠ MEETING", 1165, 42)
    opening.convert("RGB").save(FRAMES / "PR_OPENING_BRANDED.png", optimize=True)

    opening_overlay = gradient_layer(180, 170)
    brand(opening_overlay, 42)
    centered_text(opening_overlay, "MATCH ≠ MEETING", 1165, 42)
    opening_overlay.save(FRAMES / "PR_OPENING_OVERLAY.png", optimize=True)

    clean_ending = Image.open(FRAMES / "PR_CP08.png")
    closing = gradient_overlay(clean_ending, 180, 205)
    brand(closing, 42)
    centered_text(closing, "DESIGNED FOR THE MEETING.", 1138, 34)
    closing.convert("RGB").save(FRAMES / "PR_CLOSING_BRANDED.png", optimize=True)

    closing_overlay = gradient_layer(180, 205)
    brand(closing_overlay, 42)
    centered_text(closing_overlay, "DESIGNED FOR THE MEETING.", 1138, 34)
    closing_overlay.save(FRAMES / "PR_CLOSING_OVERLAY.png", optimize=True)

    paths = [FRAMES / f"{name}.png" for name in SOURCES]
    paths.extend((
        FRAMES / "PR_OPENING_OVERLAY.png",
        FRAMES / "PR_CLOSING_OVERLAY.png",
        FRAMES / "PR_OPENING_BRANDED.png",
        FRAMES / "PR_CLOSING_BRANDED.png",
    ))
    for path in paths:
        with Image.open(path) as image:
            if image.size != SIZE:
                raise RuntimeError(f"Unexpected frame size: {path} {image.size}")
        print(path.relative_to(ROOT))


if __name__ == "__main__":
    main()
