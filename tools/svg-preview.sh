#!/usr/bin/env bash
# Screenshot one or more SVGs at large (600px) and small-badge (64px) size, light and dark grounds.
# Usage: tools/svg-preview.sh out.png file1.svg [file2.svg ...]
# Uses Windows Chrome headless via WSL interop (Linux Playwright Chromium lacks libs here).
set -euo pipefail
cd "$(dirname "$0")/.."
OUT="${1:?usage: tools/svg-preview.sh out.png file.svg...}"; shift
CHROME="/mnt/c/Program Files/Google/Chrome/Application/chrome.exe"
TMP="_preview_$$.html"
{
  echo '<!doctype html><meta charset="utf-8"><style>body{margin:0;font:14px system-ui;background:#fdf8f0;display:flex;flex-wrap:wrap;gap:16px;padding:16px}figure{margin:0;text-align:center}.d{display:inline-block;background:#16202b;color:#eee;padding:8px;border-radius:8px}</style>'
  for f in "$@"; do
    echo "<figure><img src=\"$f\" width=\"600\" height=\"600\"><figcaption>$(basename "$f")</figcaption><div><img src=\"$f\" width=\"64\" height=\"64\"> <span class=d><img src=\"$f\" width=\"64\" height=\"64\"></span></div></figure>"
  done
} > "$TMP"
W=$(( $# > 1 ? 1300 : 650 )); H=$(( (($# + 1) / 2) * 740 + 40 ))
WIN_OUT="C:\\Users\\Public\\_svgprev_$$.png"
"$CHROME" --headless=new --disable-gpu --allow-file-access-from-files --hide-scrollbars --screenshot="$WIN_OUT" --window-size=$W,$H "file://$(wslpath -w "$PWD/$TMP" | sed 's#\\#/#g')" >/dev/null 2>&1 || true
mv "/mnt/c/Users/Public/_svgprev_$$.png" "$OUT"
rm -f "$TMP"
echo "wrote $OUT"
