#!/bin/bash
input=$(cat)
if command -v jq >/dev/null 2>&1; then
  command=$(echo "$input" | jq -r '.command // empty')
else
  command=$(printf '%s' "$input" | /usr/bin/python3 -c 'import json,sys; print(json.load(sys.stdin).get("command",""))')
fi
if echo "$command" | grep -Eq 'git[[:space:]]+(push[[:space:]]+--force|push[[:space:]]+-f|reset[[:space:]]+--hard|clean[[:space:]]+-fd)'; then
  printf '%s\n' '{
    "permission": "ask",
    "user_message": "This command is destructive to git history or the working tree. Please confirm.",
    "agent_message": "A project hook flagged a destructive git command."
  }'
  exit 0
fi
echo '{ "permission": "allow" }'
exit 0
