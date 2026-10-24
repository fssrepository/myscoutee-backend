#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 5 ]]; then
  echo "Usage: $0 SHORT_24S.mp4 S02.mp4 S03.mp4 LONG_48S.mp4 OUTPUT.mp4" >&2
  exit 2
fi

short_render=$1
s02_render=$2
s03_render=$3
long_render=$4
output=$5

for input in "$short_render" "$s02_render" "$s03_render" "$long_render"; do
  if [[ ! -f "$input" ]]; then
    echo "Missing input: $input" >&2
    exit 2
  fi
done

# Frame-accurate trims, concatenation and boundary fades require one final
# encode. Preserve the accepted long master render's delivered average video
# and audio bitrate instead of replacing it with a CRF-defined quality level.
master_video_bitrate=$(ffprobe -v error -select_streams v:0 \
  -show_entries stream=bit_rate -of default=nw=1:nk=1 "$long_render")
master_audio_bitrate=$(ffprobe -v error -select_streams a:0 \
  -show_entries stream=bit_rate -of default=nw=1:nk=1 "$long_render")
if [[ ! "$master_video_bitrate" =~ ^[0-9]+$ ]] || \
   [[ ! "$master_audio_bitrate" =~ ^[0-9]+$ ]]; then
  echo "Could not read numeric master bitrates from: $long_render" >&2
  exit 2
fi
video_buffer_size=$((master_video_bitrate * 2))

echo "Preserving master targets: video=${master_video_bitrate} bit/s, audio=${master_audio_bitrate} bit/s"

if [[ -e "$output" ]]; then
  echo "Output already exists; refusing to overwrite: $output" >&2
  exit 2
fi

for input in "$short_render" "$s02_render" "$s03_render" "$long_render"; do
  video_signature=$(ffprobe -v error -select_streams v:0 \
    -show_entries stream=width,height,r_frame_rate \
    -of csv=p=0:s=x "$input")
  audio_signature=$(ffprobe -v error -select_streams a:0 \
    -show_entries stream=sample_rate,channels \
    -of csv=p=0:s=x "$input")
  if [[ "$video_signature" != "720x1280x24/1" ]]; then
    echo "Expected 720x1280 at 24 fps, got $video_signature: $input" >&2
    exit 2
  fi
  if [[ "$audio_signature" != "48000x2" ]]; then
    echo "Expected 48 kHz stereo audio, got $audio_signature: $input" >&2
    exit 2
  fi
done

# Veo's next exact checkpoint usually matches the frame seven frames before the
# preceding 8-second boundary. S01 comes from the short render, S02 and S03 are
# new standalone renders, and S04–S07 come from seconds 16–48 of the long
# render. Keep frames 0..184 from the first six logical shots and all 192 frames
# from the final shot: 1302 frames / 24 fps = 54.25 seconds.
# Picture joins remain hard cuts. Each outgoing audio segment keeps 120 ms from
# the otherwise removed visual tail, then overlaps the incoming segment with an
# equal-power crossfade. This softens incompatible music without inserting a
# silent dip or changing the final A/V duration.
ffmpeg -n -hide_banner -loglevel warning -stats \
  -i "$short_render" \
  -i "$s02_render" \
  -i "$s03_render" \
  -i "$long_render" \
  -filter_complex "
    [0:v]trim=start_frame=0:end_frame=185,setpts=N/(24*TB),format=yuv420p[v0];
    [1:v]trim=start_frame=0:end_frame=185,setpts=N/(24*TB),format=yuv420p[v1];
    [2:v]trim=start_frame=0:end_frame=185,setpts=N/(24*TB),format=yuv420p[v2];
    [3:v]trim=start_frame=384:end_frame=569,setpts=N/(24*TB),format=yuv420p[v3];
    [3:v]trim=start_frame=576:end_frame=761,setpts=N/(24*TB),format=yuv420p[v4];
    [3:v]trim=start_frame=768:end_frame=953,setpts=N/(24*TB),format=yuv420p[v5];
    [3:v]trim=start_frame=960:end_frame=1152,setpts=N/(24*TB),format=yuv420p[v6];
    [v0][v1][v2][v3][v4][v5][v6]concat=n=7:v=1:a=0[vout];

    [0:a]atrim=start=0:end=7.828333333,asetpts=PTS-STARTPTS[a0];
    [1:a]atrim=start=0:end=7.828333333,asetpts=PTS-STARTPTS[a1];
    [2:a]atrim=start=0:end=7.828333333,asetpts=PTS-STARTPTS[a2];
    [3:a]atrim=start=16:end=23.828333333,asetpts=PTS-STARTPTS[a3];
    [3:a]atrim=start=24:end=31.828333333,asetpts=PTS-STARTPTS[a4];
    [3:a]atrim=start=32:end=39.828333333,asetpts=PTS-STARTPTS[a5];
    [3:a]atrim=start=40:end=48,asetpts=PTS-STARTPTS[a6];
    [a0][a1]acrossfade=d=0.12:o=1:c1=qsin:c2=qsin[x01];
    [x01][a2]acrossfade=d=0.12:o=1:c1=qsin:c2=qsin[x012];
    [x012][a3]acrossfade=d=0.12:o=1:c1=qsin:c2=qsin[x0123];
    [x0123][a4]acrossfade=d=0.12:o=1:c1=qsin:c2=qsin[x01234];
    [x01234][a5]acrossfade=d=0.12:o=1:c1=qsin:c2=qsin[x012345];
    [x012345][a6]acrossfade=d=0.12:o=1:c1=qsin:c2=qsin[aout]
  " \
  -map "[vout]" -map "[aout]" \
  -r 24 -c:v libx264 -preset medium -threads 2 \
  -b:v "$master_video_bitrate" -minrate "$master_video_bitrate" \
  -maxrate "$master_video_bitrate" -bufsize "$video_buffer_size" \
  -x264-params "nal-hrd=cbr:force-cfr=1" \
  -profile:v high -level:v 3.2 -pix_fmt yuv420p \
  -c:a aac -b:a "$master_audio_bitrate" -ar 48000 \
  -movflags +faststart \
  "$output"

ffprobe -v error \
  -show_entries format=duration,size:stream=index,codec_type,codec_name,width,height,r_frame_rate,nb_frames,sample_rate,channels \
  -of default=noprint_wrappers=1 \
  "$output"
