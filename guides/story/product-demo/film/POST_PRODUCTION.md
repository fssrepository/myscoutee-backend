# Post-production and delivery

## Picture assembly

Join the six approved Flow downloads in manifest order. Normalize each picture
stream to `720×1280`, constant `24 fps` and exactly 192 frames. Preserve the
accepted Flow-generated music, ambience and physical effects with each shot. Do
not add a title card or end card.

At 00:00 composite `assets/frames/PR_OPENING_BRANDED.png` as the exact first appearance, or
rebuild its deterministic layers over S01: unmodified `heart.png`, editable
`yScoutee`, and `MATCH ≠ MEETING`. Fade the overlay only; do not ask Flow to
animate the logo. At 00:45.5 fade in the same mark and
`DESIGNED FOR THE MEETING.` over S06, converging on `PR_CLOSING_BRANDED.png` at 00:48.

Keep text inside the central mobile-safe area. The platform UI can cover the
right edge and lower portion of a 9:16 video, so captions should sit above the
closing slogan and never cover faces or event-resource icons.

## Audio

- keep the accepted Flow audio of all six 8-second shots, matching the delivered
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

The committed SRT/VTT files are production timing guides. After the final voice
recording, micro-retime them against the waveform, keep at most two lines, and
preserve the correctly named Facebook copies. Do not burn captions into the
clean master; create a burned-caption social derivative only if a platform test
shows it is necessary.

## Git boundary

Commit scripts, prompts, still frames, caption files, manifests and the PDF.
Keep Flow downloads, narration takes, music licenses, edit caches, stems and the
final MP4 outside Git. Record their external location in a local-only handoff if
needed; never add private paths to the public package.
