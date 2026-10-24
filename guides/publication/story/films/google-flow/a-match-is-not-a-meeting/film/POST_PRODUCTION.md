# Post-production and delivery

## Picture assembly

Build the seven-shot sequence with `scripts/assemble_the_product.sh`: S01 comes
from the accepted 24-second render, S02 and S03 are standalone replacements,
and S04–S07 come from the accepted 48-second render. The script keeps 185 frames
from each of S01–S06 and all 192 frames from S07, producing an expected
`1302`-frame, `00:54.250` picture lock at constant `24 fps`. Preserve the
accepted Flow-generated music, ambience and physical effects. Do not add a
title card or end card.

The frame-accurate trims and audio fades require one final encode. The assembly
script reads the accepted 48-second master render's delivered video and audio
bitrates and uses those exact values as its output targets; it must not replace
them with a lower CRF-based encode.

At 00:00 composite `assets/frames/PR_OPENING_OVERLAY.png` over the moving S01:
unmodified `heart.png`, editable `yScoutee`, and `MATCH ≠ MEETING`. Hold through
00:01.400 and fade only the overlay by 00:02.000; do not ask Flow to animate the
logo. At 00:51.750 fade in `PR_CLOSING_OVERLAY.png` over the moving S07, reaching
the same mark and `DESIGNED FOR THE MEETING.` at 00:52.750 and holding through
00:54.250. The branded reference PNGs document the two full-opacity endpoints.

Keep text inside the central mobile-safe area. The platform UI can cover the
right edge and lower portion of a 9:16 video, so captions should sit above the
closing slogan and never cover faces or event-resource icons.

## Audio

- keep the accepted Flow audio of all seven logical shots, matching the delivered
  Parts I–II edit method requested for this reel;
- reject or regenerate a clip if it contains speech, singing, a bad audio defect
  or music that cannot be joined cleanly;
- use short equal-power boundary crossfades only where a hard seam is audible;
- record the English narration with the exact approved ElevenLabs **Jon — Warm
  & Grounded Storyteller** settings in `NARRATION_PRODUCTION_CUT.md`;
- duck the retained Flow soundtrack under Jon rather than replacing it;
- dialogue/narration remains intelligible on a phone speaker;
- target approximately `-14 LUFS` integrated and no more than `-1 dBTP`;
- archive clean narration and the assembled Flow music/effects stem separately
  outside Git.

## Caption timing

The committed SRT files target the final `00:54.250` narrated master. One
correctly named file per language is shared by Facebook and YouTube. Keep at
most two lines and do not burn captions into the clean master; create a
burned-caption social derivative only if a platform test shows it is necessary.

## Git boundary

Commit scripts, prompts, still frames, caption files, manifests and the PDF.
Keep Flow downloads, narration takes, music licenses, edit caches, stems and the
final MP4 outside Git. Record their external location in a local-only handoff if
needed; never add private paths to the public package.
