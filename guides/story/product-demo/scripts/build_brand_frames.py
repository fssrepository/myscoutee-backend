#!/usr/bin/env python3
"""Build deterministic 720x1280 opening and closing review frames."""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[4]
PACKAGE = ROOT / "guides/story/product-demo"
SOURCE = PACKAGE / "assets/source/PR_CP00_imagegen_source.png"
FRAMES = PACKAGE / "assets/frames"
LOGO = ROOT / "frontend/src/assets/logo/heart.png"
ENDING = PACKAGE / "assets/source/PR_CP22_USER_imagegen_source.png"
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


def gradient_overlay(image: Image.Image, top_height: int, bottom_height: int) -> Image.Image:
    result = image.convert("RGBA")
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
    return Image.alpha_composite(result, shade)


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
    FRAMES.mkdir(parents=True, exist_ok=True)
    clean = cover(Image.open(SOURCE))
    clean.save(FRAMES / "PR_CP00.png", optimize=True)

    opening = gradient_overlay(clean, 180, 170)
    brand(opening, 42)
    centered_text(opening, "MATCH ≠ MEETING", 1165, 42)
    opening.convert("RGB").save(FRAMES / "PR_P00.png", optimize=True)

    clean_ending = cover(Image.open(ENDING))
    clean_ending.save(FRAMES / "PR_CP22_USER.png", optimize=True)
    closing = gradient_overlay(clean_ending, 180, 205)
    brand(closing, 42)
    centered_text(closing, "DESIGNED FOR THE MEETING.", 1138, 34)
    closing.convert("RGB").save(FRAMES / "PR_F48.png", optimize=True)

    for path in (FRAMES / "PR_CP00.png", FRAMES / "PR_CP22_USER.png",
                 FRAMES / "PR_P00.png", FRAMES / "PR_F48.png"):
        with Image.open(path) as image:
            if image.size != SIZE:
                raise RuntimeError(f"Unexpected frame size: {path} {image.size}")
        print(path.relative_to(ROOT))


if __name__ == "__main__":
    main()
