# MyScoutee continuous-video checkpoint chain

The 03:00 film is planned as one continuous journey. The 24 checkpoint images
are not 24 isolated scenes: every checkpoint is the **last reference frame of
one motion interval** and the **first reference frame of the next**.

```text
CP00 -> CP01 -> CP02 -> ... -> CP22    CP23
  interval 01    interval 02          end plate
```

This makes later revision local. If one interior checkpoint changes, normally
only the two adjacent Flow/OpenArt intervals need rebuilding; the entire film
does not.

Rules:

- Keep checkpoint filenames stable when a visual is regenerated.
- Generate motion between adjacent pairs, for example `CP07 -> CP08`.
- Preserve identity, notebook, colour, light and camera direction at boundaries.
- CP00 is the opening frame; CP23 is the deterministic brand end frame.
- The present Founder and cast are fictional planning placeholders.
- The checkpoint inspection export holds every exact 9:16 checkpoint for one
  complete eight-second block: CP00 at 00:00, CP01 at 00:08, CP02 at 00:16 and
  so on. Do not split an interval into four-second halves and do not invent
  intermediate stills. Adjacent checkpoints still become the exact first and
  last frames of each later motion generation. S01–S22 form the 02:56 motion
  chain; CP23 is the separate deterministic four-second end plate. The
  still-only inspection therefore runs 03:08.000, while the finished moving
  film remains exactly 03:00.000.

| ID | Story boundary | Current asset |
| --- | --- | --- |
| CP00 | Rural small-producer roots | `assets/storyboard-rough/CP00.png` |
| CP01 | Degree, multinational work and beautiful Budapest | `assets/storyboard-rough/CP01.png` |
| CP02 | Workers' hostel and parent-assisted flat key | `assets/storyboard-rough/CP02.png` |
| CP03 | Soho programmer hiding the price of lunch | `assets/storyboard-rough/CP03.png` |
| CP04 | London cultural magic and Victoria line connection | `assets/storyboard-rough/CP04.png` |
| CP05 | Thirteen Hungarian lives with different reasons for leaving and relationships to home | `assets/storyboard-rough/CP05.png` |
| CP06 | Shared bedroom: constraint, agency and some residents happier in London | `assets/storyboard-rough/CP06.png` |
| CP07 | Shared-room savings fund journeys and Budapest-only independence; London housing becomes stop-loss | `assets/storyboard-rough/CP07.png` |
| CP08 | Global routes, local encounters, self-discovery and COVID threshold | `assets/storyboard-rough/CP08.png` |
| CP09 | Deliberate return to the parent-assisted Budapest flat that stood empty | `assets/storyboard-rough/CP09.png` |
| CP10 | Unequal attention on apps | `assets/storyboard-rough/CP10.png` |
| CP11 | Rooms full of beginnings | `assets/storyboard-rough/CP11.png` |
| CP12 | Beginner dance floor | `assets/storyboard-rough/CP12.png` |
| CP13 | Advanced class thins out | `assets/storyboard-rough/CP13.png` |
| CP14 | Existing partner makes context clear | `assets/storyboard-rough/CP14.png` |
| CP15 | Three poor date settings | `assets/storyboard-rough/CP15.png` |
| CP16 | Age/appearance/history verdicts fall away; the human-context bridge appears | `assets/storyboard-rough/CP16.png` |
| CP17 | Editable private priority for an unknown person or pair | `assets/storyboard-rough/CP17.png` |
| CP18 | Balanced candidate: three women and three men cast by plausible need rather than an age quota | `assets/storyboard-rough/CP18.png` |
| CP19 | Independent choice, contextual chat and first in-person introductions | `assets/storyboard-rough/CP19.png` |
| CP20 | Four event-resource buckets and a first shared event turn strangers into contacts | `assets/storyboard-rough/CP20.png` |
| CP21 | Later invitations, an organically wider adult community and editable relationship lifecycle | `assets/storyboard-rough/CP21.png` |
| CP22 | 2016 idea, AI-assisted build, shared core, locally shaped pilots and opt-out | `assets/storyboard-rough/CP22.png` |
| CP23 | MyScoutee end frame | `assets/storyboard-rough/CP23.png` |

The superseded three-second review, the earlier four-second-split endpoint
review and their pseudo-motion frames are not production masters. Rebuild the
checkpoint-hold review only after the approved 9:16 checkpoints replace the
current composition studies.
