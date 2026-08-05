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
  "OTTHON" "INDULÁS" "TOTTENHAM" "SOHO" "VICTORIA LINE" "TIZENHÁRMAN"
  "MEGOSZTOTT SZOBA" "ÖT ÉV" "VILÁG" "HAZATÉRÉS" "ASZIMMETRIA"
  "KEZDETEK" "TÁNCÓRA" "RITKULÁS" "KONTEXTUS" "ROSSZ HELYEK"
  "A HIÁNYZÓ HÍD" "1–10 PRIORITÁS" "ISMERETLENEK CSOPORTJA" "CSOPORTCHAT"
  "ELSŐ ESEMÉNY" "KAPCSOLATI ÉLETÚT" "KÖZÖS CORE + HELYI" "MYSCOUTEE"
)

caption_by_slide=(
  "Otthonom már volt — stabilitásom nem, amire ott jövőt építhettem volna."
  "Nem egy új ház hiányzott, hanem a kiszámítható saját idő."
  "Több okból is elüldöztek a hazámból; London felé indulok."
  "Ott munkával és takarékossággal próbálok mozgásteret szerezni."
  "Tottenhamben, egy viktoriánus házban találok helyet."
  "Közel vagyok a Victoria line-hoz — és messze az otthontól."
  "Nappal Sohóban dolgozom programozóként."
  "Kód, hosszú munkanapok, egy személyes jegyzetfüzet."
  "Este a Victoria line visz vissza Tottenhambe."
  "Az ablakban egyszerre látszik a Soho és az otthoni utca."
  "Tizenhárman élünk ugyanabban a viktoriánus házban."
  "Egy teljes fürdőszobán és egy külön vécén osztozunk."
  "A folyosón a várakozás is a mindennap része."
  "A hálószobán is osztozom valakivel."
  "Két ágy, két apró személyes világ."
  "Nem személytelen nyomor: valódi emberek szűk, közös otthona."
  "Öt éven át dolgozom és félreteszek."
  "Nem újabb otthonért — az már volt."
  "Anyagi függetlenséget gyűjtök: időt a saját munkámhoz."
  "Közel negyven ország emléke kerül egymás mellé."
  "A legszebb hely is lehet magányos, ha nincs kivel megosztani."
  "A képeslapokból nem lesz automatikusan közös élet."
  "Hazajövök Budapestre — most már tudatosan."
  "A londoni kulcs az asztalra kerül, a jegyzetfüzet új lapra nyílik."
  "Pénzt keresni mentem el; társat keresni jövök haza."
  "Belépek az appok világába."
  "Van, aki egyetlen válaszra vár; más belefullad a figyelembe."
  "Előadások és közösségi esték: tele vannak kezdetekkel."
  "Sokan egy térben, mégis kevés valódi folytatás."
  "A kezdő táncórán tele van a parkett."
  "Mozgás közben könnyebb természetesen megszólalni."
  "„Partnerek, csere!” — újabb rövid találkozás kezdődik."
  "A haladó órára már megfogyatkozik a terem."
  "A folytonosság megint eltűnik a szintről szintre vezető úton."
  "Egy beszélgetés végre elindul."
  "Megérkezik a barátságos partner; a helyzet rögtön érthető."
  "Túl hangos kávézó, ahol egymást sem halljuk."
  "Pincebár, ahol maga a hely dolgozik a beszélgetés ellen."
  "Szép asztal — két idegen mégis szerepet játszik."
  "„Bocsánat, mit mondtál?”"
  "Sok út vezet a kezdéshez."
  "A legtöbb app a matchnél megáll; a MyScoutee a kapcsolat teljes útját követi."
  "Egy ismeretlen embernek vagy párosnak szerkeszthető 1–10 prioritást adsz."
  "A prioritás privát, változtatható szándék — nem nyilvános emberi pontszám."
  "A kölcsönös döntések és a kontextus ismeretlenekből csoportot javasolnak."
  "A szereplők emberek maradnak; a rendszer kiegyensúlyozott csoportot javasol."
  "Mindenki elfogadhatja vagy visszautasíthatja a csoportjavaslatot."
  "Az elfogadott ismeretlenek közös kontextusban kezdenek csoportchatet."
  "A chatből az első valódi, kezelhető esemény terve lesz."
  "Hely, útvonal, erőforrás, jegy és check-in viszi át a tervet a valóságba."
  "Idegenként érkeznek, ismerősként távoznak; a feedback lezárja az eseményt."
  "Akiket ott megismertél, később közvetlenül újrahívhatod; így épül közösség."
  "Ha a kapcsolat megromlik és lejjebb pontozod, kisebb lesz az új találkozás esélye."
  "Helyi operatorok saját branddel és kultúrában tesztelik ugyanazt a közös core-t."
  "Független szerverek működnek együtt önkéntesen, valódi opt-out lehetőséggel."
  "MyScoutee. Találkozásra tervezve."
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
