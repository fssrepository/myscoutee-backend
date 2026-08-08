#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
guide_dir="$(cd "${script_dir}/.." && pwd)"
checkpoint_dir="${guide_dir}/assets/checkpoints"
output_dir="${guide_dir}/storyboard/animatics"
output_file="${1:-${output_dir}/myscoutee-part-i-8s-endpoints-720x1280.mp4}"

# This is a still-only checkpoint inspection master, not the 03:00 motion edit.
# CP00 begins at 00:00, CP01 at 00:08, CP02 at 00:16 and so on. Every generated
# endpoint receives one complete eight-second hold. CP23 is the separate
# deterministic four-second end plate. No intermediate frame is invented.
hold_seconds=(
  8 8 8 8 8 8 8 8 8 8 8 8
  8 8 8 8 8 8 8 8 8 8 8 4
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
  -frames:v 4512 -t 188 \
  -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p \
  -an -movflags +faststart "${output_file}"

echo "Built the 8-second checkpoint inspection slideshow plus end plate: ${output_file} (03:08.000)."
