#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 2 ]]; then
  echo "Usage: $0 INPUT.mp4 OUTPUT.mp4" >&2
  exit 2
fi

input=$1
output=$2
script_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
package_dir=$(cd -- "$script_dir/.." && pwd)
opening_overlay="$package_dir/assets/frames/PR_OPENING_OVERLAY.png"
closing_overlay="$package_dir/assets/frames/PR_CLOSING_OVERLAY.png"

for required in "$input" "$opening_overlay" "$closing_overlay"; do
  if [[ ! -f "$required" ]]; then
    echo "Missing input: $required" >&2
    exit 2
  fi
done

if [[ -e "$output" ]]; then
  echo "Output already exists; refusing to overwrite: $output" >&2
  exit 2
fi

video_bitrate=$(ffprobe -v error -select_streams v:0 \
  -show_entries stream=bit_rate -of default=nw=1:nk=1 "$input")
frame_count=$(ffprobe -v error -select_streams v:0 \
  -show_entries stream=nb_frames -of default=nw=1:nk=1 "$input")
signature=$(ffprobe -v error -select_streams v:0 \
  -show_entries stream=width,height,r_frame_rate \
  -of csv=p=0:s=x "$input")

if [[ ! "$video_bitrate" =~ ^[0-9]+$ ]] || [[ "$frame_count" != "1302" ]] || \
   [[ "$signature" != "720x1280x24/1" ]]; then
  echo "Unexpected video master: bitrate=$video_bitrate frames=$frame_count signature=$signature" >&2
  exit 2
fi

video_buffer_size=$((video_bitrate * 2))

# Keep the opening art fully visible through 1.4 seconds, then fade it away by
# 2.0 seconds. Fade the closing art in from 51.75 to 52.75 seconds and hold it
# through the final frame. Only the overlay opacity changes; both scenes remain
# in motion beneath it.
ffmpeg -hide_banner -loglevel warning -stats \
  -i "$input" \
  -loop 1 -framerate 24 -i "$opening_overlay" \
  -loop 1 -framerate 24 -i "$closing_overlay" \
  -filter_complex "
    [0:v]setpts=PTS-STARTPTS[base];
    [1:v]format=rgba,fade=t=out:st=1.4:d=0.6:alpha=1,
      setpts=PTS-STARTPTS[opening];
    [2:v]format=rgba,fade=t=in:st=51.75:d=1.0:alpha=1,
      setpts=PTS-STARTPTS[closing];
    [base][opening]overlay=shortest=1:format=auto[first];
    [first][closing]overlay=shortest=1:format=auto,format=yuv420p[vout]
  " \
  -map "[vout]" -map 0:a:0 \
  -frames:v "$frame_count" -r 24 \
  -c:v libx264 -preset medium -threads 2 \
  -b:v "$video_bitrate" -minrate "$video_bitrate" \
  -maxrate "$video_bitrate" -bufsize "$video_buffer_size" \
  -x264-params "nal-hrd=cbr:force-cfr=1" \
  -profile:v high -level:v 3.2 -pix_fmt yuv420p \
  -c:a copy -movflags +faststart "$output"

ffprobe -v error \
  -show_entries format=duration,size:stream=index,codec_type,codec_name,width,height,r_frame_rate,nb_frames,sample_rate,channels,bit_rate \
  -of default=noprint_wrappers=1 "$output"
