#!/usr/bin/env bash

set -euo pipefail

CHROME_BIN="${CHROME_BIN:-/opt/google/chrome/chrome}"
PROFILE_PICK_DELAY_SECONDS="${PROFILE_PICK_DELAY_SECONDS:-7}"

if [[ ! "$PROFILE_PICK_DELAY_SECONDS" =~ ^[1-9][0-9]*$ ]]; then
  echo "PROFILE_PICK_DELAY_SECONDS must be a positive integer." >&2
  exit 1
fi
if [[ ! -x "$CHROME_BIN" ]]; then
  echo "Chrome is not executable at: $CHROME_BIN" >&2
  exit 1
fi

for actor in Casey Nova Riley; do
  "$CHROME_BIN" --new-window 'chrome://profile-picker/' >/dev/null 2>&1 &
  echo "Select an unused Google profile for ${actor}; continuing in ${PROFILE_PICK_DELAY_SECONDS} seconds."
  sleep "$PROFILE_PICK_DELAY_SECONDS"
done

echo "Three independently selected Chrome-profile windows are ready. Open MyScoutee as Casey, Nova and Riley."
read -r -p "Keep this helper running during QA. Press Enter only when all three Chrome sessions may be closed. "
