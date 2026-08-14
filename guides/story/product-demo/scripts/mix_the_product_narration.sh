#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 3 ]]; then
  echo "Usage: $0 PICTURE_LOCK.mp4 JON_NARRATION.mp3 OUTPUT.mp4" >&2
  exit 2
fi

picture_lock=$1
narration=$2
output=$3

for input in "$picture_lock" "$narration"; do
  if [[ ! -f "$input" ]]; then
    echo "Missing input: $input" >&2
    exit 2
  fi
done

if [[ -e "$output" ]]; then
  echo "Output already exists; refusing to overwrite: $output" >&2
  exit 2
fi

picture_duration=$(ffprobe -v error -show_entries format=duration \
  -of default=nw=1:nk=1 "$picture_lock")
if [[ "$picture_duration" != "54.250000" ]]; then
  echo "Expected the 54.250000-second picture lock, got $picture_duration" >&2
  exit 2
fi

work_dir=$(mktemp -d /tmp/myscoutee-product-narration.XXXXXX)
trap 'rm -rf -- "$work_dir"' EXIT
premaster="$work_dir/premaster.wav"

# The continuous ElevenLabs read is cut only inside its three existing quiet
# paragraph gaps. Each two-paragraph thought block then starts at the matching
# picture boundary. No speech is time-stretched, and the original download is
# never modified.
ffmpeg -hide_banner -loglevel warning -stats \
  -i "$picture_lock" \
  -i "$narration" \
  -filter_complex "
    [0:a]aresample=48000,aformat=sample_fmts=fltp:channel_layouts=stereo[music];
    [1:a]aresample=48000,aformat=sample_fmts=fltp:channel_layouts=mono,
      asplit=4[n0s][n1s][n2s][n3s];
    [n0s]atrim=start=0:end=13.010,asetpts=PTS-STARTPTS,adelay=250[n0];
    [n1s]atrim=start=13.010:end=27.317,asetpts=PTS-STARTPTS,adelay=15417[n1];
    [n2s]atrim=start=27.317:end=41.145,asetpts=PTS-STARTPTS,adelay=30833[n2];
    [n3s]atrim=start=41.145:end=48.06525,asetpts=PTS-STARTPTS,adelay=46250[n3];
    [n0][n1][n2][n3]amix=inputs=4:normalize=0:duration=longest,
      apad=whole_dur=56,volume=2dB,
      asplit=2[nside][nvoice_mono];
    [nvoice_mono]pan=stereo|c0=c0|c1=c0[nvoice];
    [music][nside]sidechaincompress=threshold=0.03:ratio=3:attack=20:
      release=300:knee=2.828:link=average:detection=rms[ducked];
    [ducked][nvoice]amix=inputs=2:normalize=0:duration=first,
      alimiter=limit=0.891:attack=5:release=100,
      atrim=start=0:end=54.25[premaster]
  " \
  -map "[premaster]" -c:a pcm_s24le -ar 48000 -ac 2 "$premaster"

loudness_report=$(ffmpeg -hide_banner -nostats -i "$premaster" \
  -af "loudnorm=I=-14:LRA=11:TP=-1.3:print_format=json" \
  -f null - 2>&1)
loudness_json=$(sed -n '/^{/,/^}/p' <<<"$loudness_report")

measured_i=$(jq -er '.input_i' <<<"$loudness_json")
measured_tp=$(jq -er '.input_tp' <<<"$loudness_json")
measured_lra=$(jq -er '.input_lra' <<<"$loudness_json")
measured_thresh=$(jq -er '.input_thresh' <<<"$loudness_json")
target_offset=$(jq -er '.target_offset' <<<"$loudness_json")

ffmpeg -hide_banner -loglevel warning -stats \
  -i "$picture_lock" \
  -i "$premaster" \
  -filter_complex "
    [1:a]loudnorm=I=-14:LRA=11:TP=-1.3:
      measured_I=$measured_i:measured_TP=$measured_tp:
      measured_LRA=$measured_lra:measured_thresh=$measured_thresh:
      offset=$target_offset:linear=true:print_format=summary[aout]
  " \
  -map 0:v:0 -map "[aout]" \
  -c:v copy -c:a aac -b:a 320k -ar 48000 -ac 2 \
  -t 54.25 -movflags +faststart "$output"

ffprobe -v error \
  -show_entries format=duration,size:stream=index,codec_type,codec_name,width,height,r_frame_rate,nb_frames,sample_rate,channels,bit_rate \
  -of default=noprint_wrappers=1 "$output"
