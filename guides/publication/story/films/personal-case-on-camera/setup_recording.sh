#!/usr/bin/env bash
# Reapply the local OBS, VLC Snap, and playback fixes from the recording session.
set -euo pipefail

if pgrep -x obs >/dev/null; then
  echo 'Close OBS before running this script; it overwrites configuration on exit.' >&2
  exit 1
fi

for tool in python3 pactl getfacl setfacl pkexec snap; do
  command -v "$tool" >/dev/null || { echo "Missing command: $tool" >&2; exit 1; }
done
snap list vlc >/dev/null || { echo 'The existing VLC Snap is required.' >&2; exit 1; }

render_node=/dev/dri/by-path/pci-0000:00:02.0-render
camera=/dev/video2
sink=alsa_output.pci-0000_00_1f.3-platform-skl_hda_dsp_generic.HiFi__hw_sofhdadsp__sink
for device in "$render_node" "$camera"; do
  [[ -e "$device" ]] || { echo "Missing device: $device" >&2; exit 1; }
done
pactl list short sinks | cut -f2 | grep -Fxq "$sink" || {
  echo "Laptop headphone sink is missing: $sink" >&2; exit 1;
}
microphone=$(pactl list short sources | cut -f2 | grep '^alsa_input.usb-DJI_DJIPocket3_' | head -n 1)
[[ -n "$microphone" ]] || { echo 'DJI Pocket 3 microphone is missing.' >&2; exit 1; }

# Snap confinement needs the current user to traverse/read /home.
if ! getfacl -cp /home | awk -F: -v user="$(id -un)" \
  '$1 == "user" && $2 == user && $3 ~ /^r.x$/ { found = 1 } END { exit !found }'; then
  pkexec setfacl -m "u:$(id -un):rx" /home
fi

pactl set-default-sink "$sink"
pactl set-default-source "$microphone"
python3 "$(dirname "$0")/configure_obs.py" --microphone "$microphone"
echo 'Setup applied. Start OBS and restart VLC if it was already open.'
