# Google Flow / Veo 3.1 Lite prompt pack

For each shot paste [continuity-prefix.txt](continuity-prefix.txt), one blank
line, then the matching file under `flow/`. Use Video → Frames, exact first and
last images, Veo 3.1 Lite, 8 seconds, 9:16, one result.

The seven original checkpoint-image briefs and their shared visual lock are in
[FRAME_GENERATION.md](FRAME_GENERATION.md).

| Shot | Prompt | Endpoint pair |
| --- | --- | --- |
| S01 | [flow/S01.txt](flow/S01.txt) | `PR_CP00 → PR_CP08` |
| S02 | [flow/S02.txt](flow/S02.txt) | `PR_CP08 → PR_CP16` |
| S03 | [flow/S03.txt](flow/S03.txt) | `PR_CP16 → PR_CP24` |
| S04 | [flow/S04.txt](flow/S04.txt) | `PR_CP24 → PR_CP32` |
| S05 | [flow/S05.txt](flow/S05.txt) | `PR_CP32 → PR_CP40` |
| S06 | [flow/S06.txt](flow/S06.txt) | `PR_CP40 → PR_CP48` |

The logo and all readable text are post-only. `PR_P00` and `PR_F48` are review
references, never Flow inputs.
