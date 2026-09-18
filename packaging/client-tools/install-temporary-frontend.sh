#!/usr/bin/env bash
# Compatibility shortcut for the explicitly scoped frontend update.
set -euo pipefail
script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
action="${1:---help}"
if [[ "$action" == --help || "$action" == -h ]]; then
  exec bash "$script_dir/install-temporary-image.sh" --help
fi
shift
exec bash "$script_dir/install-temporary-image.sh" "$action" nginx "$@"
