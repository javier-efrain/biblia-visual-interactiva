#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
for folder in static/miniaturas static/banners; do
  while IFS= read -r -d '' source; do
    target="${source%.png}.webp"
    tmp="$target.tmp"
    cwebp -quiet -q 95 -m 6 "$source" -o "$tmp"
    mv "$tmp" "$target"
    printf '%s: %s -> %s bytes\n' "$source" "$(wc -c < "$source")" "$(wc -c < "$target")"
  done < <(find "$folder" -type f \( -name 'marcos-01-01-*.png' -o -name 'marcos-01-02-*.png' -o -name 'marcos-01-03-*.png' \) -print0)
done
for block in marcos-01-01 marcos-01-02 marcos-01-03; do
  for name in contexto exegesis ensenanza devocional; do
    test -s "static/miniaturas/$block-$name.webp"
  done
  test -s "static/banners/$block-banner.webp"
done
