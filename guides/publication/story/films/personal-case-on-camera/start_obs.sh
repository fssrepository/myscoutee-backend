#!/usr/bin/env bash
# Start OBS with a matched recording profile and scene collection.
set -euo pipefail

case "${1:-}" in
  4k) name='DJI Pocket 3 - 4K 16x9' ;;
  1080p-landscape) name='DJI Pocket 3 - 1080p 16x9' ;;
  1080p-portrait) name='DJI Pocket 3 - 1080p 9x16' ;;
  *)
    echo 'Usage: start_obs.sh {4k|1080p-landscape|1080p-portrait}' >&2
    exit 2
    ;;
esac

if pgrep -x obs >/dev/null; then
  echo 'Close the running OBS window before switching presets.' >&2
  exit 1
fi

exec obs --profile "$name" --collection "$name"
