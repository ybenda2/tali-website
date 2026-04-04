#!/usr/bin/env python3
"""
Resize JPEGs so the long edge is at most MAX_EDGE (downscale only), then re-save
as JPEG via macOS sips. Never uses sips -Z, which can upscale smaller images.

Run from repo root: python3 scripts/compress_images.py
"""
from __future__ import annotations

import os
import re
import subprocess
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMAGES = os.path.join(REPO, "assets", "images")
MAX_EDGE = 2048
# Inline / press shot: keep modest dimensions if it was blown up by mistake
PRESS_NAME = "press_walls_tali_srur_baker.jpg"
PRESS_MAX_EDGE = 1400


def pixel_dims(path: str) -> tuple[int, int]:
    out = subprocess.check_output(
        ["sips", "-g", "pixelWidth", "-g", "pixelHeight", "-1", path],
        text=True,
    )
    m = re.search(r"pixelWidth: (\d+)\|pixelHeight: (\d+)", out)
    if not m:
        raise RuntimeError(f"Could not read dimensions: {path}")
    return int(m.group(1)), int(m.group(2))


def scale_to_max_edge(w: int, h: int, max_edge: int) -> tuple[int, int]:
    """Return (new_w, new_h) with max(new_w, new_h) == max_edge, preserving aspect."""
    if max(w, h) <= max_edge:
        return w, h
    if w >= h:
        nw = max_edge
        nh = max(1, round(h * max_edge / w))
    else:
        nh = max_edge
        nw = max(1, round(w * max_edge / h))
    return nw, nh


def reencode(path: str, nw: int, nh: int, quality: str) -> None:
    tmp = path + ".__tmp.jpg"
    try:
        if (nw, nh) != pixel_dims(path):
            cmd = [
                "sips",
                "-z",
                str(nh),
                str(nw),
                path,
                "-s",
                "format",
                "jpeg",
                "-s",
                "formatOptions",
                quality,
                "-o",
                tmp,
            ]
        else:
            cmd = [
                "sips",
                path,
                "-s",
                "format",
                "jpeg",
                "-s",
                "formatOptions",
                quality,
                "-o",
                tmp,
            ]
        r = subprocess.run(cmd, capture_output=True, text=True)
        if r.returncode != 0:
            raise RuntimeError(r.stderr or r.stdout or "sips failed")
        os.replace(tmp, path)
    finally:
        if os.path.isfile(tmp):
            os.remove(tmp)


def main() -> int:
    if not os.path.isdir(IMAGES):
        print("Missing assets/images", file=sys.stderr)
        return 1

    count = 0
    for dirpath, _, files in os.walk(IMAGES):
        for name in sorted(files):
            if not name.lower().endswith((".jpg", ".jpeg")):
                continue
            path = os.path.join(dirpath, name)
            w, h = pixel_dims(path)
            if name == PRESS_NAME:
                cap = PRESS_MAX_EDGE
                nw, nh = scale_to_max_edge(w, h, cap)
                reencode(path, nw, nh, "normal")
            else:
                nw, nh = scale_to_max_edge(w, h, MAX_EDGE)
                reencode(path, nw, nh, "normal")
            count += 1
            print(path)
    print(f"Done: {count} files", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
