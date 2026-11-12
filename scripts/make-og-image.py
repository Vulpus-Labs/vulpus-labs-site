#!/usr/bin/env python3
"""Compose the homepage link-preview image (assets/og-image.png, 1200x630).

The Vulpus Labs logo sits on the left; the three synths' faceplates are
stacked on the right, each overlapping the one behind it. Re-run after
regenerating the faceplates (scripts/capture-faceplates.mjs).

    pip install pillow
    python3 scripts/make-og-image.py
"""

import argparse
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
W, H = 1200, 630
INK = "#1a1917"
LINE = "#3a3732"

# Back to front: each sits lower and further right than the one before.
FACEPLATES = ["vxn-1c", "vxn-2b", "polykritter"]
SHOT_W = 660
STEP = (105, 118)
STACK_RIGHT, STACK_TOP = W - 36, 34


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", type=Path, default=ROOT / "assets" / "og-image.png")
    args = ap.parse_args()

    img = Image.new("RGB", (W, H), INK)

    shots = []
    for name in FACEPLATES:
        shot = Image.open(ROOT / "content" / "products" / name / "faceplate.png").convert("RGB")
        h = round(shot.height * SHOT_W / shot.width)
        shots.append(shot.resize((SHOT_W, h), Image.LANCZOS))

    n = len(shots)
    x0 = STACK_RIGHT - SHOT_W - (n - 1) * STEP[0]
    for i, shot in enumerate(shots):
        x, y = x0 + i * STEP[0], STACK_TOP + i * STEP[1]
        # A soft shadow so each plate reads as lying on the one behind.
        shadow = Image.new("L", (W, H), 0)
        ImageDraw.Draw(shadow).rectangle((x - 4, y + 4, x + SHOT_W + 6, y + shot.height + 12), fill=170)
        shadow = shadow.filter(ImageFilter.GaussianBlur(14))
        img.paste(Image.new("RGB", (W, H), "#0b0a09"), (0, 0), shadow)
        img.paste(shot, (x, y))
        ImageDraw.Draw(img).rectangle((x - 1, y - 1, x + SHOT_W, y + shot.height), outline=LINE)

    logo = Image.open(ROOT / "themes" / "vulpus-labs" / "assets" / "logo.png").convert("RGBA")
    lh = 250
    logo = logo.resize((round(logo.width * lh / logo.height), lh), Image.LANCZOS)
    lx = (x0 - logo.width) // 2
    img.paste(logo, (lx, (H - lh) // 2), logo)

    args.out.parent.mkdir(parents=True, exist_ok=True)
    img.save(args.out, optimize=True)
    print(f"wrote {args.out}")


if __name__ == "__main__":
    main()
