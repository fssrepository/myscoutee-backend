# MyScoutee continuous-video checkpoint chain

The 02:48 film is planned as one continuous journey. The 24 checkpoint images
are not 24 isolated scenes: every checkpoint is the **last reference frame of
one motion interval** and the **first reference frame of the next**.

```text
CP00 -> CP01 -> CP02 -> ... -> CP22 -> CP23
  interval 01    interval 02          interval 23
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
- The captioned animatic has 56 three-second slide slots: 56 × 3 s = 168 s.
  Reframed repeats between checkpoints stand in for future motion, so the rough
  already has the exact 02:48 runtime without requiring 56 expensive generations.

| ID | Story boundary | Current asset |
| --- | --- | --- |
| CP00 | Budapest: an existing home without stability | `assets/storyboard-rough/CP00.png` |
| CP01 | Departure for London | `assets/storyboard-rough/CP01.png` |
| CP02 | Tottenham Victorian terrace | `assets/storyboard-rough/CP02.png` |
| CP03 | Programmer at work in Soho | `assets/storyboard-rough/CP03.png` |
| CP04 | Victoria line home at night | `assets/storyboard-rough/CP04.png` |
| CP05 | Thirteen people, one bath plus separate WC | `assets/storyboard-rough/CP05.png` |
| CP06 | Shared bedroom inside the HMO | `assets/storyboard-rough/CP06.png` |
| CP07 | Five years buying financial independence and time | `assets/storyboard-rough/CP07.png` |
| CP08 | Travel-memory mosaic | `assets/storyboard-rough/CP08.png` |
| CP09 | Deliberate return to Budapest | `assets/storyboard-rough/CP09.png` |
| CP10 | Unequal attention on apps | `assets/storyboard-rough/CP10.png` |
| CP11 | Rooms full of beginnings | `assets/storyboard-rough/CP11.png` |
| CP12 | Beginner dance floor | `assets/storyboard-rough/CP12.png` |
| CP13 | Advanced class thins out | `assets/storyboard-rough/CP13.png` |
| CP14 | Existing partner makes context clear | `assets/storyboard-rough/CP14.png` |
| CP15 | Three poor date settings | `assets/storyboard-rough/CP15.png` |
| CP16 | The missing bridge | `assets/storyboard-rough/CP16.png` |
| CP17 | Editable private priority for an unknown person or pair | `assets/storyboard-rough/CP17.png` |
| CP18 | Balanced candidate group of strangers | `assets/storyboard-rough/CP18.png` |
| CP19 | Group choice, contextual chat and first-event plan | `assets/storyboard-rough/CP19.png` |
| CP20 | First managed event turns strangers into contacts | `assets/storyboard-rough/CP20.png` |
| CP21 | Later invitations and editable relationship lifecycle | `assets/storyboard-rough/CP21.png` |
| CP22 | Shared core, local brands, voluntary server network and opt-out | `assets/storyboard-rough/CP22.png` |
| CP23 | MyScoutee end frame | `assets/storyboard-rough/CP23.png` |

The generated `assets/storyboard-3s/F00.jpg`–`F55.jpg` files are the captioned
three-second review frames. They may be rebuilt deterministically from the
checkpoint images.
