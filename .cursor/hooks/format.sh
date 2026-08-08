#!/bin/bash
input=$(cat)
if command -v jq >/dev/null 2>&1; then
  path=$(echo "$input" | jq -r '.path // .file // empty')
else
  path=$(printf '%s' "$input" | /usr/bin/python3 -c 'import json,sys; d=json.load(sys.stdin); print(d.get("path") or d.get("file") or "")')
fi
if [ -z "$path" ] || [ ! -f "$path" ]; then
  exit 0
fi
case "$path" in
  *.ts|*.tsx|*.js|*.jsx|*.css|*.json|*.md|*.html)
    if [ -x ./node_modules/.bin/prettier ]; then
      ./node_modules/.bin/prettier --write "$path" >/dev/null 2>&1 || true
    fi
    ;;
esac
exit 0
