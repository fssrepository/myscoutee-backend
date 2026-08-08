#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
guide_dir="$(cd "${script_dir}/.." && pwd)"
checkpoint_dir="${guide_dir}/assets/checkpoints"
output_dir="${guide_dir}/storyboard/animatics"
output_file="${1:-${output_dir}/myscoutee-part-ii-8s-endpoints-720x1280.mp4}"

# This is a still-only checkpoint inspection master, not the 03:00 motion edit.
# CP00 begins at 00:00, CP01 at 00:08, CP02 at 00:16 and so on. Every exact 9:16
# checkpoint receives one complete eight-second hold. If the deterministic E01
# end card exists, it is appended for four seconds.
hold_seconds=(
  8 8 8 8 8 8 8 8 8 8 8 8
  8 8 8 8 8 8 8 8 8 8 8
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

end_card="${checkpoint_dir}/E01.png"
target_seconds=184
if [[ -f "${end_card}" ]]; then
  printf "file '%s'\nduration 4\nfile '%s'\n" \
    "${end_card}" "${end_card}" >> "${concat_list}"
  target_seconds=188
fi

target_frames=$((target_seconds * 24))

ffmpeg -hide_banner -loglevel warning -y \
  -f concat -safe 0 -i "${concat_list}" \
  -vf "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,fps=24" \
  -frames:v "${target_frames}" -t "${target_seconds}" \
  -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p \
  -an -movflags +faststart "${output_file}"

echo "Built Part II 8-second checkpoint inspection slideshow: ${output_file} (${target_seconds}s)."
