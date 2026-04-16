"""Generate public/og.png for social sharing. Run with: python scripts/generate-og.py"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "og.png"
LOGO = ROOT / "public" / "images" / "logo_blue.png"
LOGO_WHITE = ROOT / "public" / "images" / "logo_white.png"

W, H = 1200, 630
PRIMARY = (61, 130, 196)
PRIMARY_DARK = (44, 102, 158)
WHITE = (255, 255, 255)
TEXT_SOFT = (235, 242, 250)

img = Image.new("RGB", (W, H), PRIMARY)
draw = ImageDraw.Draw(img)

for y in range(H):
    t = y / H
    r = int(PRIMARY[0] + (PRIMARY_DARK[0] - PRIMARY[0]) * t)
    g = int(PRIMARY[1] + (PRIMARY_DARK[1] - PRIMARY[1]) * t)
    b = int(PRIMARY[2] + (PRIMARY_DARK[2] - PRIMARY[2]) * t)
    draw.line([(0, y), (W, y)], fill=(r, g, b))

try:
    logo = Image.open(LOGO_WHITE).convert("RGBA")
except Exception:
    logo = Image.open(LOGO).convert("RGBA")

logo_size = 380
logo = logo.resize((logo_size, logo_size), Image.LANCZOS)
img.paste(logo, (80, (H - logo_size) // 2), logo)

font_paths = [
    "C:/Windows/Fonts/segoeuib.ttf",
    "C:/Windows/Fonts/arialbd.ttf",
    "C:/Windows/Fonts/seguisb.ttf",
]
def load_font(size):
    for p in font_paths:
        try:
            return ImageFont.truetype(p, size)
        except Exception:
            continue
    return ImageFont.load_default()

title_font = load_font(110)
subtitle_font = load_font(40)
small_font = load_font(28)

text_x = 520
draw.text((text_x, 180), "Pawly", fill=WHITE, font=title_font)
draw.text(
    (text_x, 320),
    "Des pattes propres\nen quelques secondes.",
    fill=TEXT_SOFT,
    font=subtitle_font,
    spacing=10,
)

draw.rectangle([(text_x, 500), (text_x + 270, 556)], fill=WHITE)
draw.text((text_x + 20, 510), "pawly.shopping", fill=PRIMARY_DARK, font=small_font)

img.save(OUT, "PNG", optimize=True)
print(f"Wrote {OUT}  ({W}x{H})")
