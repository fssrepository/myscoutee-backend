# Film production and final delivery

Production is closed. The accepted film retains the v3 picture, P11 repair,
opening subtitle **THE PATH BETWEEN PEOPLE**, and complete Neutral v4 narration.
The source library and P00–P12 prompts are retained; no regeneration is pending.

| Source | Owner |
| --- | --- |
| Original prompt and reference allocation | [plan.json](plan.json) |
| Ordered production requests | P00–P12 directories, each with its own prompt files |
| Accepted spoken text | [narration_directors_cut_v4.txt](../narration_directors_cut_v4.txt) |
| Narration timing | [v4 paragraph placements](../../04_tracking/DIRECTORS_CUT_NARRATION_PLACEMENT_V4.json) |
| Local assembly | `tools/` |

## Final deliverables

- `myscoutee_directors_cut_v4_final.mp4`: 604,817,042 bytes; 4861 frames,
  202.541667 seconds, 1920×1080 at 24 fps, HEVC Main 10 / CRF 8, BT.709.
- `myscoutee_directors_cut_narration_v4.mp3`: 3,241,830 bytes; aligned mono
  44.1-kHz / 128-kbit/s narration, including the initial silence and paragraph gaps.

The original delivery location was `/home/raxim/Downloads`. The creator later
reported upload completion. Public links and social packages are in the
[film entry](../../README.md); festival submission is not established by those links.

The final picture is a lossy re-encode of the accepted large v4 master using the
source clips' CRF 8 image-coding settings. Comparison covered all 4861 frames:
SSIM mean 0.998879, worst 0.996194; no decoder errors. Original background and the
accepted mix balance remain. All 6,038,255 source narration samples were retained
once in the aligned working WAV; its MP3 delivery is lossy. Narration ends at
196.502 seconds, before the 197.042-second clinical cut. No internal speech,
sentence order, speed, pitch or timbre edits were applied.

## Reproduction inputs

Keep original clips, `narration_v4.mp3`, the title-corrected v3 picture and the
private `.full-film-dream` working sources. The final compressed movie is not a
generation source. Existing delivered files must not be overwritten implicitly.

`tools/directors_cut_audio.py` accepts the recorded v4 placement file, source
recording and `_v4` suffix. The final mux uses the title-corrected picture with
video stream copy and the v4 mix; the older fixed-source mux helper is not the
v4 recipe. Exact final video/MP3 commands and measured encoding settings are in
[final compression validation](../../04_tracking/DIRECTORS_CUT_FINAL_COMPRESSION_VALIDATION.json)
and the [original encoding audit](../../04_tracking/DIRECTORS_CUT_ORIGINAL_ENCODING_AUDIT.json).
[v4 audio validation](../../04_tracking/DIRECTORS_CUT_AUDIO_VALIDATION_V4.json) and
[v4 delivery validation](../../04_tracking/DIRECTORS_CUT_DELIVERY_VALIDATION_V4.json)
own the final timing/source checks. Intermediate deliveries stay in Git history.

[Production statistics](../../../../../../../statistics/film-production/README.md)
retain the frozen 12 September cutoff; documentation cleanup does not recalculate them.
