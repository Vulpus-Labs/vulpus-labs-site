#!/usr/bin/env python3
"""Compose the free effects' faceplates into one image (assets/fx-faceplates.png).

Wesley stands on the left at full height; Glow-Up and Beverley are stacked
to its right, scaled to one width, so the three fill a single wide block.
The background is transparent. Re-run after a faceplate.png in
content/products/{wesley,glow-up,beverley}/ changes.

    pip install pillow
    python3 scripts/make-fx-image.py
"""

import argparse
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
LINE = "#3a3732"
GAP = 28
RIGHT_W = 1400  # width of the right-hand column, px


def load(name: str) -> Image.Image:
    return Image.open(ROOT / "content" / "products" / name / "faceplate.png").convert("RGBA")


def scaled(img: Image.Image, w: int = 0, h: int = 0) -> Image.Image:
    if w:
        return img.resize((w, round(img.height * w / img.width)), Image.LANCZOS)
    return img.resize((round(img.width * h / img.height), h), Image.LANCZOS)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", type=Path, default=ROOT / "assets" / "fx-faceplates.png")
    args = ap.parse_args()

    glow = scaled(load("glow-up"), w=RIGHT_W)
    bev = scaled(load("beverley"), w=RIGHT_W)
    h = glow.height + GAP + bev.height
    wes = scaled(load("wesley"), h=h)

    img = Image.new("RGBA", (wes.width + GAP + RIGHT_W + 2, h + 2), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    for shot, (x, y) in [
        (wes, (1, 1)),
        (glow, (wes.width + GAP + 1, 1)),
        (bev, (wes.width + GAP + 1, glow.height + GAP + 1)),
    ]:
        img.paste(shot, (x, y))
        draw.rectangle((x - 1, y - 1, x + shot.width, y + shot.height), outline=LINE)

    args.out.parent.mkdir(parents=True, exist_ok=True)
    img.save(args.out, optimize=True)
    print(f"wrote {args.out} {img.size}")


if __name__ == "__main__":
    main()
