#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
guide_dir="$(cd "${script_dir}/.." && pwd)"
checkpoint_dir="${guide_dir}/assets/storyboard-rough"
output_dir="${guide_dir}/storyboard/animatics"
output_file="${1:-${output_dir}/myscoutee-part-i-8s-endpoints-720x1280.mp4}"

# Each generated S01–S22 interval shows its exact first checkpoint for four
# seconds and its exact last checkpoint for four seconds. Because an interior
# checkpoint is both one interval's end and the next interval's beginning, it
# appears continuously for eight seconds. CP23 is the deterministic four-second
# end plate. The result is the exact 03:00 production timing without invented
# intermediate frames.
hold_seconds=(
  4 8 8 8 8 8 8 8 8 8 8 8
  8 8 8 8 8 8 8 8 8 8 4 4
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
  -frames:v 4320 -t 180 \
  -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p \
  -an -movflags +faststart "${output_file}"

echo "Built 22 eight-second endpoint intervals plus the end plate: ${output_file} (03:00.000)."
