# Google Flow / Veo 3.1 Lite prompt pack

For each shot paste [continuity-prefix.txt](continuity-prefix.txt), one blank
line, then the matching file under `flow/`. Use Video → Frames, exact first and
last images, Veo 3.1 Lite, 8 seconds, 9:16, one result.

| Shot | Prompt | Endpoint pair |
| --- | --- | --- |
| S01 | [flow/S01.txt](flow/S01.txt) | `PR_CP00 → M1_CP17` |
| S02 | [flow/S02.txt](flow/S02.txt) | `M1_CP17 → M1_CP18` |
| S03 | [flow/S03.txt](flow/S03.txt) | `M1_CP18 → M1_CP19` |
| S04 | [flow/S04.txt](flow/S04.txt) | `M1_CP19 → M1_CP20` plus `M1_LOCAL_PROVIDER` reference |
| S05 | [flow/S05.txt](flow/S05.txt) | `M1_CP20 → M1_CP21` |
| S06 | [flow/S06.txt](flow/S06.txt) | `M1_CP21 → PR_CP22_USER` |

The logo and all readable text are post-only. `PR_P00` and `PR_F48` are review
references, never Flow inputs.
