## Prompt length versus visible result — P00–P05

The observed sequences can be described in **19,994 characters instead of 68,912 (71% less text)**, while keeping all reference handles in the comparison prompts. This does not establish that the shorter prompts would generate the same result.

| Clip | Shorter text | Story match* | Detail loss* | Reference match* |
| --- | ---: | ---: | ---: | ---: |
| P00 | 84% | ~90% | ~35% | ~100% |
| P01 | 73% | ~55% | ~65% | ~60% |
| P02 | 69% | ~65% | ~65% | ~50% |
| P03 | 71% | ~60% | ~60% | ~65% |
| P04 | 66% | ~75% | ~60% | ~55% |
| P05 | 70% | ~30% | ~60% | ~60% |

*Visual estimates from selected scored requirements and recognisable image-reference content (full / partial / not identifiable = 1 / 0.5 / 0), rounded to 5 percentage points. Detail loss includes simplification, omission and replacement. Reference match is visible correspondence, not measured internal model use. Text reduction describes a retrospective rewrite of the observed result, not a tested equivalent generation prompt. Audio is excluded; P00 is the corrected ident.*

Detailed scoring: [requirements](assessment.csv), [references](reference_assessment.csv), [metrics](metrics.csv).
