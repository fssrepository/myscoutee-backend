#!/usr/bin/env bash
# Reproducible desktop entry points. Repeated calls do not duplicate each view.
set -euo pipefail
umask 077
tools_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
state_root="${XDG_STATE_HOME:-${HOME}/.local/state}/myscoutee-microservices/msc121"
install -d -m 0700 "${state_root}"
case "${1:-runtime}" in
  runtime|observe)
    flock -n -E 0 "${state_root}/terminal-observe.lock" \
      gnome-terminal --wait --window --geometry=116x38 --title='MyScoutee MSC-121 — VM / Kubernetes / containers' \
      -- python3 "${tools_root}/vm.py" observe &
    if [[ "${1:-runtime}" == "runtime" ]]; then
    flock -n -E 0 "${state_root}/terminal-console.lock" \
      gnome-terminal --wait --window --maximize --title='MyScoutee MSC-121 — guest shell' \
      -- python3 "${tools_root}/vm.py" console &
    fi
    wait
    ;;
  setup)
    flock -n -E 0 "${state_root}/terminal-setup.lock" \
      gnome-terminal --wait --window --title='MyScoutee MSC-121 — host setup' \
      -- bash -c 'bash "$1/setup-host.sh"; result=$?; printf "\nExit status: %s\nPress Enter to close.\n" "$result"; read -r; exit "$result"' _ "${tools_root}"
    ;;
  *) echo 'Usage: open-terminals.sh [runtime|observe|setup]' >&2; exit 2 ;;
esac
