# MyScoutee continuous-video checkpoint chain

The 03:12 film is planned as one continuous journey. P00, CP00–CP22 and E01 are
the 25 motion-endpoint images for 24 eight-second intervals, not isolated
scenes: every interior checkpoint is the **last reference frame of one motion
interval** and the **first reference frame of the next**.

```text
P00 -> CP00 -> CP01 -> CP02 -> ... -> CP22 -> E01
 opening     interval 01    interval 02         closing breath
```

This makes later revision local. If one interior checkpoint changes, normally
only the two adjacent Veo Lite intervals need rebuilding; the entire film
does not.

Rules:

- Keep checkpoint filenames stable when a visual is regenerated.
- Generate motion between adjacent pairs, for example `CP07 -> CP08`.
- Preserve identity, notebook, colour, light and camera direction at boundaries.
- P00 is the opening frame, CP00 closes the title-to-soil transition, CP22 is
  the final story endpoint and E01 closes the generated reflective transition.
- Stabilize the exact repository logo and editable English type over the P00
  and E01 motion where necessary; do not accept model-distorted lettering.
- The present Founder and cast are fictional planning placeholders.
- Do not build a checkpoint inspection export, slideshow or animatic. Adjacent
  checkpoints go directly into eight-second motion generation as exact first
  and last frames. Do not split an interval into four-second halves or invent
  intermediate stills. P00-to-CP00 is the generated eight-second opening
  transition; S01–S22 form the 02:56 story chain; CP22-to-E01 supplies the
  generated eight-second closing breath. The finished film is exactly 03:12.000.

| ID | Story boundary | Current asset |
| --- | --- | --- |
| P00 | MyScoutee true-story route globe and exact opening identity | `assets/frames/P00.png` |
| CP00 | Rural small-producer roots | `assets/frames/CP00.png` |
| CP01 | Degree, multinational work and beautiful Budapest | `assets/frames/CP01.png` |
| CP02 | Workers' hostel and parent-assisted flat key | `assets/frames/CP02.png` |
| CP03 | Soho programmer hiding the price of lunch | `assets/frames/CP03.png` |
| CP04 | London cultural magic and Victoria line connection | `assets/frames/CP04.png` |
| CP05 | Exactly ten adults total, seven men and three women aged about 23–55, with different reasons for leaving and relationships to home | `assets/frames/CP05.png` |
| CP06 | Shared bedroom: constraint, agency and some residents happier in London | `assets/frames/CP06.png` |
| CP07 | Shared-room savings fund journeys and Budapest-only independence; London housing becomes stop-loss | `assets/frames/CP07.png` |
| CP08 | Global routes, local encounters, self-discovery and COVID-19 threshold | `assets/frames/CP08.png` |
| CP09 | Deliberate return to the parent-assisted Budapest flat that stood empty | `assets/frames/CP09.png` |
| CP10 | Unequal attention on apps | `assets/frames/CP10.png` |
| CP11 | Rooms full of beginnings | `assets/frames/CP11.png` |
| CP12 | Beginner dance floor | `assets/frames/CP12.png` |
| CP13 | Advanced class thins out | `assets/frames/CP13.png` |
| CP14 | Existing partner makes context clear | `assets/frames/CP14.png` |
| CP15 | Three poor date settings | `assets/frames/CP15.png` |
| CP16 | Age/appearance/history verdicts fall away; the human-context bridge appears | `assets/frames/CP16.png` |
| CP17 | Editable private priority for an unknown person or pair | `assets/frames/CP17.png` |
| CP18 | Balanced candidate: three women and three men cast by plausible need rather than an age quota | `assets/frames/CP18.png` |
| CP19 | Independent choice, contextual chat and first in-person introductions | `assets/frames/CP19.png` |
| CP20 | Four event-resource buckets and a first shared event turn strangers into contacts | `assets/frames/CP20.png` |
| CP21 | Later invitations, an organically wider adult community and editable relationship lifecycle | `assets/frames/CP21.png` |
| CP22 | 2016 idea, AI-assisted build, shared core, locally shaped pilots and opt-out | `assets/frames/CP22.png` |
| E01 | Exact MyScoutee invitation and continuation endpoint | `assets/frames/E01.png` |

The superseded three-second review, four-second-split endpoint review and their
pseudo-motion frames are not production masters and must not be rebuilt. Replace
the current composition studies with approved 9:16 checkpoints only as each
direct generation pair is prepared.
