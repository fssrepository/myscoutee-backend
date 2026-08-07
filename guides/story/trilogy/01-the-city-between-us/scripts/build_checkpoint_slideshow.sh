#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
guide_dir="$(cd "${script_dir}/.." && pwd)"
checkpoint_dir="${guide_dir}/assets/storyboard-rough"
slide_dir="${guide_dir}/assets/storyboard-3s"
output_dir="${guide_dir}/renders"
output_file="${1:-${output_dir}/myscoutee-storyboard-v01-3s-720x1280.mp4}"
regular_font="/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
bold_font="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

mkdir -p "${slide_dir}" "${output_dir}"

checkpoint_by_slide=(
  00 00 01 01 02 02 03 03 04 04 05 05 05 06 06 06 07 07 07 08 08 08
  09 09 09 10 10 11 11 12 12 12 13 13 14 14 15 15 16 16 16 17 17 17
  18 18 19 19 20 20 20 21 21 22 22 23
)

title_by_checkpoint=(
  "HOME" "DEPARTURE" "TOTTENHAM" "SOHO" "VICTORIA LINE" "THIRTEEN"
  "SHARED ROOM" "FIVE YEARS" "WORLD" "HOMECOMING" "ASYMMETRY"
  "BEGINNINGS" "DANCE CLASS" "THINNING OUT" "CONTEXT" "WRONG PLACES"
  "THE MISSING BRIDGE" "1–10 PRIORITY" "GROUP OF STRANGERS" "INTRODUCTIONS"
  "FIRST EVENT" "RELATIONSHIP LIFECYCLE" "SHARED CORE + LOCAL" "MYSCOUTEE"
)

caption_by_slide=(
  "I had a home — but not yet a stable future I could build there."
  "Budapest was beautiful, yet my life inside it remained uncertain."
  "I leave for London, carrying one suitcase and unfinished questions."
  "Work and deliberate saving may create room to move."
  "I find a place in a converted Victorian house in Tottenham."
  "Near the Victoria line — and far from the life I knew."
  "By day I work as a software developer in Soho."
  "Code, long days and a personal cognac notebook."
  "At night the Victoria line carries me back to Tottenham."
  "The window holds Soho and the street outside home at once."
  "Thirteen of us live inside the same Victorian house."
  "We share one full bathroom and one separate toilet."
  "Waiting in the corridor becomes part of daily life."
  "I share the bedroom too."
  "Two beds, two small personal worlds."
  "Not anonymous misery: real people in a narrow shared home."
  "For five years I work, save and adapt."
  "The shared room funds journeys and lets savings accumulate."
  "Only lower-cost Budapest turns those savings into independence."
  "My parent-assisted Budapest flat has stood empty throughout."
  "London never becomes financially independent or privately livable."
  "Housing becomes my stop-loss."
  "I return to Budapest — now with a deliberate purpose."
  "The London key reaches the table; the notebook opens to a new page."
  "I left to make a living. I came home to find a partner."
  "I enter the world of dating apps."
  "Some wait for one reply; others drown in attention."
  "Talks and social evenings are full of beginnings."
  "Many people share a room, yet few paths continue."
  "The beginner dance floor is full."
  "Movement makes a first conversation feel natural."
  "Partners, change — another brief encounter begins."
  "By the advanced class, the room has thinned."
  "Continuity disappears again between one level and the next."
  "At last, a conversation begins."
  "A friendly partner arrives; the context becomes clear."
  "A café too loud for either person to hear."
  "A basement bar where the place itself works against conversation."
  "A beautiful table — yet two strangers still perform roles."
  "Sorry — what did you say?"
  "There are many ways to begin."
  "Most apps stop at the match; MyScoutee follows the relationship lifecycle."
  "A person or pair receives an editable one-to-ten priority."
  "Priority is private, changing intent — never a public human score."
  "Reciprocal choices and context can suggest a group of strangers."
  "Three women and three men: six people with six distinct expectations."
  "The system proposes a balanced group; every adult decides independently."
  "With shared context, the strangers introduce themselves in person."
  "Separate thoughts become attention, conversation and a first shared plan."
  "People, transport, place and supplies make the event manageable."
  "Ticket, check-in and feedback remain separate; strangers become contacts."
  "People met there can be invited again; repeated meetings may form community."
  "A private priority change can make another shared meeting less likely."
  "Local operators test one shared core through their own brands and cultures."
  "Independent servers cooperate voluntarily with a real opt-out."
  "MyScoutee. Designed for the meeting."
)

if [[ ${#checkpoint_by_slide[@]} -ne 56 || ${#caption_by_slide[@]} -ne 56 ]]; then
  echo "The storyboard must contain exactly 56 three-second slides." >&2
  exit 1
fi

for slide_index in $(seq 0 55); do
  printf -v slide_id '%02d' "${slide_index}"
  checkpoint_id="${checkpoint_by_slide[slide_index]}"
  source_file="${checkpoint_dir}/CP${checkpoint_id}.png"
  output_slide="${slide_dir}/F${slide_id}.jpg"
  elapsed_seconds=$((slide_index * 3))
  printf -v timecode '%02d:%02d' $((elapsed_seconds / 60)) $((elapsed_seconds % 60))
  variant=$((slide_index % 3))
  zoom=$((100 + variant * 4))

  if [[ ! -f "${source_file}" ]]; then
    echo "Missing checkpoint: ${source_file}" >&2
    exit 1
  fi

  convert "${source_file}" \
    -resize '720x1280^' -resize "${zoom}%" -gravity center -extent 720x1280 \
    -fill 'rgba(7,21,38,0.93)' -draw 'rectangle 0,1015 720,1280' \
    -gravity northwest -font "${bold_font}" -fill '#FF6B66' -pointsize 21 \
    -annotate +42+1052 "F${slide_id} · ${timecode} · ${title_by_checkpoint[10#${checkpoint_id}]}" \
    \( -background none -fill '#F7F4ED' -font "${regular_font}" -pointsize 26 \
       -size 636x145 caption:"${caption_by_slide[slide_index]}" \) \
    -gravity northwest -geometry +42+1085 -composite -strip -quality 91 \
    "${output_slide}"
done

concat_list="$(mktemp /tmp/myscoutee-storyboard.XXXXXX.txt)"
trap 'rm -f "${concat_list}"' EXIT
for slide_index in $(seq -w 0 55); do
  printf "file '%s/F%s.jpg'\nduration 3\n" "${slide_dir}" "${slide_index}" >> "${concat_list}"
done
printf "file '%s/F55.jpg'\n" "${slide_dir}" >> "${concat_list}"

ffmpeg -hide_banner -loglevel warning -y \
  -f concat -safe 0 -i "${concat_list}" \
  -vf 'fps=24,tpad=stop_mode=clone:stop_duration=1' -frames:v 4032 -t 168 \
  -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p \
  -an -movflags +faststart "${output_file}"

echo "Built 56 slides and ${output_file} (02:48.000)."
