# Part II prompt pack

All generation instructions are in English. The public narration and editable
titles are defined in [SCRIPT.md](../film/SCRIPT.md); video models must not
invent either.

## Assembly order for one eight-second interval

1. Paste [continuity-prefix.txt](continuity-prefix.txt).
2. Paste one `SHOT Sxx` block from [shot-prompts.txt](shot-prompts.txt).
3. In Flow, append: `Generate exactly one Veo Frames-to-Video result, 8 seconds,
   9:16, using the uploaded checkpoint images as exact first and last frames.`
4. In OpenArt, select one model and append: `Generate exactly one silent
   first/last-frame video, 8 seconds, 9:16. Preserve both reference frames.`

Do not paste all twenty-two shot blocks into one ordinary video generator.
The two master files are planning/director prompts for interfaces that can
manage a sequence, not requests for one 176-second generation.

## Reference tokens

Replace each token once in the working copy:

| Token | Meaning |
| --- | --- |
| `[FOUNDER_REF]` | exact approved Part I Founder character/reference |
| `[ACCOUNTANT_REF]` | approved competent, overloaded accountant identity |
| `[TAX_OFFICER_REF]` | approved ordinary tax-officer identity |
| `[OFFICER_REF]` | approved police-officer identity |
| `[FINGERPRINT_OFFICER_REF]` | approved professional fingerprinting officer identity; ordinary human presence, no erotic framing |
| `[EXPERT_A_REF]` | first approved forensic-expert identity |
| `[EXPERT_B_REF]` | second, visually distinct approved forensic-expert identity |
| `[JUDGE_REF]` | anonymized judge identity; never a real-person likeness |
| `[DEFENCE_COUNSEL_REF]` | anonymized court-appointed defence counsel identity |
| `[PROBATION_OFFICER_REF]` | anonymized probation officer preparing the clemency social inquiry |
| `[PROSECUTOR_ROLE]` | anonymous prosecutor role at the Founder's left |
| `[CLERK_ROLE]` | anonymous clerk role at the far-left corner |
| `[HOUSEMATE_REF]` | anonymized Part I London HMO resident |
| `[BUDAPEST_FLAT]` | exact approved Part I apartment/world reference |
| `[BUDAPEST_WORLD]` | approved Budapest civic-location reference |
| `[LONDON_HMO]` | exact approved Part I HMO reference |
| `[PART_I_FINAL_FRAME]` | lossless Part I handoff frame used as CP00 |

Public figures are not character tokens. Use silhouettes, hands, room geometry,
post-produced documents and dates. Accurate editorial imagery, if legally
cleared later, belongs in post rather than generative video.

## Checkpoint contract

- `S01` uses `CP00.png` and `CP01.png`.
- `S02` uses `CP01.png` and `CP02.png`.
- Continue identically through `S22`, which uses `CP21.png` and `CP22.png`.
- The generated clip must begin and end on those frames without reinterpretation.
- `E01` is assembled in post and must use the repository logo, never an
  AI-generated mark.
- If a model cannot accept both endpoints, do not substitute a prompt-only
  generation into the continuity chain. It may be used only as a labelled test.

## Audio contract

Every generated interval is silent production picture:

- no dialogue;
- no narration;
- no generated music;
- no per-clip ambience that restarts at each cut;
- no lip sync.

The final edit receives one time-locked English narrator, one continuous
three-minute score and synchronized post-produced ambience/foley. Any platform
audio generated despite the prompt is discarded.

## Evidence and privacy contract

- Never upload raw tax, police, court, medical-adjacent or private email pages to
  a generative model.
- Recreate every necessary page as an anonymized, unreadable plate and add exact
  public wording later in post.
- Do not reproduce the charged sentence or illustrate threatened harm.
- No private name, address, identifier, account value, password, employer brand
  or diagnosis appears in generated imagery.
- The accountant, tax officer, police, expert and judge remain ordinary human
  beings. No sinister expressions, conspiracy tableau or corrupt-official code.
- Humour is a micro-expression, not proof about the case.
- The apartment/belongings/government-bond sequence represents questions and
  perceived risk. It must not depict completed confiscation, forfeiture or
  eviction.
- The President's constitutional route and the Founder's route are visually
  separate and legally unequal.
- Seven judges recused from one matter; they did not leave the Court in June.
- Part III owns the final outcome.
- Courtroom geography remains exact from the Founder's viewpoint: a C-shaped
  desk with prosecutor left, clerk at the far-left corner, judge centre and
  court-appointed defence counsel right; the Founder sits in front with a table
  microphone directly before him.
- The forensic examination always contains two distinct experts. Do not merge
  their faces, remembered reactions or roles into one composite character.
- The clemency home visitor is a probation officer preparing a social inquiry,
  not a clemency commissioner, judge or sentencing authority.

## Credit-saving test order

Do not test every model on every shot.

1. Generate character/reference sheets outside the final clip budget only after
   Founder approval.
2. Generate CP00–CP22 once with the selected image model.
3. Build the checkpoint-only review slideshow: hold CP00 for eight seconds,
   CP01 for eight seconds, CP02 for eight seconds and continue at exact
   eight-second boundaries. Do not split an interval into four-second halves.
4. Use the identical `CP05→CP06` low-trust-triangle transition as the principal
   people/screen stress test.
5. Use `CP20→CP21` as the secondary abstract/institutional stress test.
6. Compare Flow and OpenArt models only on those two intervals.
7. Select the lowest-cost model that preserves identity, endpoint accuracy,
   readable staging and restrained motion.
8. Generate the remaining intervals once, reserving credit for failed endpoints
   and the hardest continuity repairs.

## Release recheck

Before motion generation or publication, recheck:

- the English book's factual corrections;
- the reviewed Constitutional Court threshold letter and the exact complaint
  route;
- the new justice-administration reply if supplied;
- the 16 September 2026 hearing date;
- the presidency and Constitutional Court composition;
- platform model names, durations, endpoint support, audio behaviour and credit
  costs.
