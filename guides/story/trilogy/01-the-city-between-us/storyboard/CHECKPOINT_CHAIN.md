# MyScoutee continuous-video checkpoint chain

The 03:00 film is planned as one continuous journey. CP00–CP22 are the 23
motion-endpoint images, not isolated scenes: every interior checkpoint is the
**last reference frame of one motion interval** and the **first reference frame
of the next**. CP23 is a deterministic post-production brand plate, never a
video-model endpoint.

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
- CP00 is the opening frame; CP22 is the final generated-motion endpoint.
- CP23 is the deterministic brand end frame assembled in post and consumes no
  image- or video-generation credit.
- The present Founder and cast are fictional planning placeholders.
- Do not build a checkpoint inspection export, slideshow or animatic. Adjacent
  checkpoints go directly into eight-second motion generation as exact first
  and last frames. Do not split an interval into four-second halves or invent
  intermediate stills. S01–S22 form the 02:56 motion chain; CP23 is the separate
  deterministic eight-second end plate; the finished film is exactly 03:04.000.

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
| CP23 | Deterministic MyScoutee post-production end frame; not a motion endpoint | `assets/storyboard-rough/CP23.png` |

The superseded three-second review, four-second-split endpoint review and their
pseudo-motion frames are not production masters and must not be rebuilt. Replace
the current composition studies with approved 9:16 checkpoints only as each
direct generation pair is prepared.
