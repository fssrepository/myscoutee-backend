#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
guide_dir="$(cd "${script_dir}/.." && pwd)"
checkpoint_dir="${guide_dir}/assets/checkpoints"
output_dir="${guide_dir}/storyboard/animatics"
output_file="${1:-${output_dir}/myscoutee-part-ii-8s-endpoints-720x1280.mp4}"

# S01–S22 each use CP(n-1) for four seconds and CP(n) for four seconds.
# Interior checkpoints therefore remain continuously visible for eight seconds.
# The final deterministic end card occupies the last four seconds.
hold_seconds=(
  4 8 8 8 8 8 8 8 8 8 8 8
  8 8 8 8 8 8 8 8 8 8 4
)

if [[ ${#hold_seconds[@]} -ne 23 ]]; then
  echo "The Part II endpoint slideshow requires exactly 23 checkpoint holds." >&2
  exit 1
fi

mkdir -p "${output_dir}"
concat_list="$(mktemp /tmp/myscoutee-part-ii-endpoints.XXXXXX.txt)"
trap 'rm -f "${concat_list}"' EXIT

for checkpoint_index in $(seq 0 22); do
  printf -v checkpoint_id '%02d' "${checkpoint_index}"
  source_file="${checkpoint_dir}/CP${checkpoint_id}.png"
  if [[ ! -f "${source_file}" ]]; then
    echo "Missing checkpoint: ${source_file}" >&2
    exit 1
  fi
  printf "file '%s'\nduration %s\n" \
    "${source_file}" "${hold_seconds[checkpoint_index]}" >> "${concat_list}"
done

printf "file '%s/CP22.png'\n" "${checkpoint_dir}" >> "${concat_list}"

ffmpeg -hide_banner -loglevel warning -y \
  -f concat -safe 0 -i "${concat_list}" \
  -vf "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,fps=24" \
  -frames:v 4320 -t 180 \
  -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p \
  -an -movflags +faststart "${output_file}"

echo "Built Part II endpoint review: ${output_file} (03:00.000)."
