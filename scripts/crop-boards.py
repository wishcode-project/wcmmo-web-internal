"""Cut the story concept boards into one picture per story beat.

    python3 scripts/crop-boards.py [boards_dir]      (default: content/boards)

Boards live in wcmmo-specs/gdd/boards/ and are copied to content/boards/ by the sync.
Output: src/shared/story/<id>.webp. Every file there is PUBLIC (the Lore page imports the folder), so only
cut panels that are spoiler-free and carry no placeholder names. The team sees the full boards instead.
Coordinates are (left, top, right, bottom) in board pixels: picture areas only, captions left out.
Re-run after a board changes; adjust the boxes if its layout changes.
"""
import sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
BOARDS = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "content" / "boards"
OUT = ROOT / "src" / "shared" / "story"

PANELS = {
    "chapter-0-tutorial.png": {
        "ch0-1": (12, 97, 326, 290),
        "ch0-2": (336, 97, 603, 285),
        "ch0-3": (612, 97, 955, 283),
        "ch0-4": (965, 97, 1224, 355),
        # ch0-5 (the three Bloodline sigils + names) is left out: names are still open (D-48)
        "ch0-6": (12, 455, 377, 605),
        "ch0-7": (387, 455, 789, 605),
        "ch0-8": (798, 455, 1132, 605),
        "ch0-9": (1141, 455, 1527, 655),
    },
    "chapter-1-part-1.png": {
        "ch1-1": (12, 48, 322, 345),
        "ch1-2": (335, 48, 648, 265),
        "ch1-3": (663, 48, 975, 345),
        "ch1-4": (988, 48, 1300, 345),
        "ch1-5": (12, 468, 322, 745),
        "ch1-6": (335, 468, 648, 745),
        "ch1-7": (663, 468, 975, 745),
        "ch1-8": (988, 468, 1300, 745),
        "ch1-9": (12, 866, 352, 1110),
        "ch1-10": (365, 866, 687, 1110),
        "ch1-11": (700, 866, 952, 1110),
        "ch1-12": (965, 866, 1300, 1110),
    },
    "first-city.png": {
        # the whole board, shown on the home page as the first-draft city design theme
        # (owner decision 2026-09-30; its names are working titles and say so on the page)
        "city-board": (0, 0, 1536, 1024),
        "city-gate": (12, 662, 310, 828),
        "city-trade": (318, 662, 612, 828),
        "city-hall": (622, 662, 917, 828),
        "city-harbour": (927, 662, 1221, 828),
        "city-homes": (1232, 662, 1526, 828),
    },
}

OUT.mkdir(parents=True, exist_ok=True)
for board, panels in PANELS.items():
    src = BOARDS / board
    if not src.exists():
        print(f"skip {board}: not found in {BOARDS}")
        continue
    img = Image.open(src).convert("RGB")
    for name, box in panels.items():
        img.crop(box).save(OUT / f"{name}.webp", "WEBP", quality=82, method=6)
        print(f"{name}.webp {box[2] - box[0]}x{box[3] - box[1]}")
