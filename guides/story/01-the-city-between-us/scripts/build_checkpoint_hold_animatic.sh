#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
guide_dir="$(cd "${script_dir}/.." && pwd)"
checkpoint_dir="${guide_dir}/assets/storyboard-rough"
output_dir="${guide_dir}/renders"
output_file="${1:-${output_dir}/myscoutee-storyboard-v01-checkpoint-hold-720x1280.mp4}"

# Each checkpoint is both the preceding shot's last frame and the following
# shot's first frame. CP00 and CP23 receive half of their adjacent shot; every
# interior checkpoint receives half of both adjacent shots. This keeps the
# locked 02:48 runtime while replacing 56 repeated three-second slides with the
# 24 actual generation boundaries. Most interior frames therefore remain on
# screen for roughly seven to eight seconds.
hold_seconds=(
  4 7.5 7.5 7.5 7.5 8 10 10 7.5 7 6.5 6.5
  7 6.5 6.5 7.5 8 8 8 7.5 6.5 6 5 2
)

if [[ ${#hold_seconds[@]} -ne 24 ]]; then
  echo "The checkpoint-hold animatic requires exactly 24 durations." >&2
  exit 1
fi

mkdir -p "${output_dir}"
concat_list="$(mktemp /tmp/myscoutee-checkpoint-hold.XXXXXX.txt)"
trap 'rm -f "${concat_list}"' EXIT

for checkpoint_index in $(seq 0 23); do
  printf -v checkpoint_id '%02d' "${checkpoint_index}"
  source_file="${checkpoint_dir}/CP${checkpoint_id}.png"
  if [[ ! -f "${source_file}" ]]; then
    echo "Missing checkpoint: ${source_file}" >&2
    exit 1
  fi
  printf "file '%s'\nduration %s\n" \
    "${source_file}" "${hold_seconds[checkpoint_index]}" >> "${concat_list}"
done

# The concat demuxer needs the final image repeated so its duration is honored.
printf "file '%s/CP23.png'\n" "${checkpoint_dir}" >> "${concat_list}"

ffmpeg -hide_banner -loglevel warning -y \
  -f concat -safe 0 -i "${concat_list}" \
  -vf "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,fps=24" \
  -frames:v 4032 -t 168 \
  -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p \
  -an -movflags +faststart "${output_file}"

echo "Built 24 checkpoint holds and ${output_file} (02:48.000)."
