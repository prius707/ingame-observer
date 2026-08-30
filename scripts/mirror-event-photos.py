#!/usr/bin/env python3
"""Download event stills into public/event-photos and rewrite src/events.ts imageUrls."""
from __future__ import annotations

import hashlib
import json
import re
import ssl
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EVENTS = ROOT / "src" / "events.ts"
OUT = ROOT / "public" / "event-photos"
MAP = Path(__file__).with_name("event-photo-map.json")
UA = "Mozilla/5.0 (compatible; ingame.observer mirror/1.0; +https://ingame.observer/)"


def local_name(url: str) -> str:
    m = re.search(r"/(\d+)_[\w-]+_[a-z]\.jpe?g$", url)
    if m:
        return f"{m.group(1)}.jpg"
    last = url.rstrip("/").split("/")[-1]
    if not last.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
        last = hashlib.sha1(url.encode()).hexdigest()[:16] + ".jpg"
    name = re.sub(r"[^A-Za-z0-9._-]+", "-", last)
    if not name.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
        name += ".jpg"
    return name


def main() -> None:
    text = EVENTS.read_text()
    urls = re.findall(r'"imageUrl":\s*"([^"]+)"', text)
    OUT.mkdir(parents=True, exist_ok=True)
    mapping: dict[str, str] = {}
    used: set[str] = set()
    ctx = ssl.create_default_context()

    for url in urls:
        if url.startswith("event-photos/"):
            mapping[url] = url.removeprefix("event-photos/")
            continue
        name = local_name(url)
        if name in used:
            stem, suf = Path(name).stem, Path(name).suffix
            name = f"{stem}-{hashlib.sha1(url.encode()).hexdigest()[:8]}{suf}"
        used.add(name)
        mapping[url] = name
        dest = OUT / name
        if dest.exists() and dest.stat().st_size > 1000:
            print(f"skip {name}")
            continue
        req = urllib.request.Request(
            url, headers={"User-Agent": UA, "Referer": "https://ingame.observer/"}
        )
        with urllib.request.urlopen(req, context=ctx, timeout=60) as r:
            data = r.read()
            ctype = r.headers.get("Content-Type", "")
        if len(data) < 500 or "html" in ctype.lower():
            raise SystemExit(f"bad response for {url}: {ctype} {len(data)}")
        dest.write_bytes(data)
        print(f"ok {name} ({len(data)} bytes)")
        time.sleep(0.15)

    def repl(m: re.Match[str]) -> str:
        url = m.group(1)
        if url.startswith("event-photos/"):
            return m.group(0)
        return f'"imageUrl": "event-photos/{mapping[url]}"'

    new, n = re.subn(r'"imageUrl":\s*"([^"]+)"', repl, text)
    EVENTS.write_text(new)
    MAP.write_text(json.dumps({k: v for k, v in mapping.items() if k.startswith("http")}, indent=2) + "\n")
    print(f"rewrote {n} imageUrl fields")


if __name__ == "__main__":
    main()
