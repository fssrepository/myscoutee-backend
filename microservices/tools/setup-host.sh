#!/usr/bin/env bash
# Run in the user's terminal: sudo owns password entry; the script never reads it.
set -euo pipefail
umask 077
tools_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
state_root="${XDG_STATE_HOME:-${HOME}/.local/state}/myscoutee-microservices/msc121"
[[ ! -L "${state_root}" ]] || { echo 'Refusing symlinked lab state.' >&2; exit 2; }
install -d -m 0700 "${state_root}"
rm -f -- "${state_root}/host-setup.complete"
sudo python3 "${tools_root}/host.py" install --user "$(id -un)"
sudo python3 "${tools_root}/host.py" start
date -u +%FT%TZ > "${state_root}/host-setup.complete"
echo 'Host setup completed. Boot autostart is disabled. VM startup remains explicit.'
