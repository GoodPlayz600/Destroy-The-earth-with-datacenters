#!/usr/bin/env python3
"""Regenerate the Unity catalog using the master specification."""
import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ROW = re.compile(r"^\| `(\d{2,3}-\d\d)`\s*\|\s*([^|]+)\|\s*(\$[\d,]+)\s*\|\s*([^|]+)\|", re.M)


def generate():
    specification = (ROOT / "prompt.md").read_text(encoding="utf-8")
    entries = []
    ids = set()
    for node, name, price, effect in ROW.findall(specification):
        branch, level = map(int, node.split("-"))
        previous = f"{branch:02d}-{level - 1:02d}" if level > 1 else ""
        if node in ids or previous and previous not in ids:
            raise ValueError(f"Duplicate or out-of-order upgrade {node}")
        ids.add(node)
        entries.append({
            "id": node,
            "name": name.strip().removeprefix("**").removesuffix("**"),
            "price": int(price[1:].replace(",", "")),
            "effect": effect.strip(),
            "previousInBranch": previous,
        })
    expected = {f"{branch:02d}-{level:02d}" for branch in range(1, 113)
                for level in range(1, 13 if branch <= 24 else 17)}
    if ids != expected or len(entries) != 1696:
        raise ValueError("Expected exactly the 1,696 master-spec IDs in branches 1–112")
    return '{\n  "entries": [\n' + ',\n'.join('    ' + json.dumps(entry, ensure_ascii=False) for entry in entries) + '\n  ]\n}\n'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Check that the committed catalog is current")
    args = parser.parse_args()
    target = ROOT / "Assets" / "Clearcut" / "Resources" / "UpgradeCatalog.json"
    generated = generate()
    if args.check:
        if target.read_text(encoding="utf-8") != generated:
            parser.exit(1, "Catalog differs from prompt.md. Run this script without --check.\n")
    else:
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(generated, encoding="utf-8")
    print(f"Validated 1,696 upgrade entries in {target.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
