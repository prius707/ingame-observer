#!/usr/bin/env bash
# Render public/og-image.jpg from scripts/og-card.html (1200×630).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public/og-image.jpg"
TMP="$(mktemp -d)"
PORT="${OG_PORT:-8765}"
cd "$ROOT"

python3 -m http.server "$PORT" --bind 127.0.0.1 >/dev/null 2>&1 &
SERVER_PID=$!
cleanup() {
  kill "$SERVER_PID" 2>/dev/null || true
  rm -rf "$TMP"
}
trap cleanup EXIT
sleep 0.4

# Headless Chrome often stays alive after --screenshot; cap the wait.
timeout 20 google-chrome \
  --headless=new \
  --disable-gpu \
  --no-sandbox \
  --no-first-run \
  --no-default-browser-check \
  --user-data-dir="$TMP/chrome" \
  --hide-scrollbars \
  --force-device-scale-factor=2 \
  --window-size=1200,630 \
  --default-background-color=000000 \
  --screenshot="$TMP/og.png" \
  --virtual-time-budget=8000 \
  "http://127.0.0.1:${PORT}/scripts/og-card.html" \
  || true

if [[ ! -s "$TMP/og.png" ]]; then
  echo "screenshot failed" >&2
  exit 1
fi

ffmpeg -y -loglevel error -i "$TMP/og.png" -vf scale=1200:630 -frames:v 1 -q:v 3 "$OUT"
echo "wrote $OUT ($(wc -c < "$OUT") bytes)"
