# Part II prompt pack

Status: **written baseline synchronized to the 05:28 script and CP00–CP38
storyboard; no frame-generation run is authorized by this document**.

All generation instructions are English. Public narration and editable titles
are defined in [SCRIPT.md](../film/SCRIPT.md); video models must invent neither.

## One eight-second generation

1. Upload the exact approved `CPxx.png` first frame and `CPyy.png` last frame.
2. Paste [continuity-prefix.txt](continuity-prefix.txt).
3. Paste only the matching `SHOT Sxx` block from
   [shot-prompts.txt](shot-prompts.txt).
4. In Flow append: `Generate exactly one Veo 3.1 Lite Frames-to-Video result,
   8 seconds, 9:16, using the uploaded checkpoint images as exact first and last
   frames.`
Do not paste all thirty-nine shots into an ordinary generator. Each interval is
one independent first/last-frame request. Never replace the endpoint contract
with Extend or a prompt-only result.

## Reference tokens

| Token | Meaning |
| --- | --- |
| `[FOUNDER_REF]` | exact approved Part I Founder identity |
| `[ACCOUNTANT_REF]` | approved accountant whose repeated task failure is shown through the work, not facial caricature |
| `[TAX_OFFICER_REF]` | approved ordinary tax officer |
| `[OFFICER_REF]` | approved ordinary police officer |
| `[FINGERPRINT_OFFICER_REF]` | professional fingerprint officer; no erotic framing |
| `[EXPERT_A_REF]` | first forensic expert |
| `[EXPERT_B_REF]` | visually distinct second forensic expert |
| `[JUDGE_REF]` | anonymized judge, never a real-person likeness |
| `[DEFENCE_COUNSEL_REF]` | anonymized court-appointed counsel |
| `[PROSECUTOR_ROLE]` | anonymous prosecutor on the Founder's left |
| `[CLERK_ROLE]` | anonymous clerk at the far-left corner |
| `[HOUSEMATE_REF]` | anonymized Part I London resident |
| `[BUDAPEST_FLAT]` | exact approved Part I apartment reference |
| `[BUDAPEST_WORLD]` | approved Budapest civic-location reference |
| `[LONDON_SHARED_HOME]` | approved Part I Lee Valley shared-home reference |
| `[PART_I_FINAL_FRAME]` | lossless Part I handoff used as `M2_CP00.png` |

Public figures are not character tokens. Use hands, silhouettes, office
geometry, empty chairs and post-added dates. Accurate editorial material, if
licensed later, belongs in post.

## Endpoint contract

- `S01 = CP00→CP01`; `S02 = CP01→CP02`; continue identically through
  `S18 = CP17→CP18`; insert `S18A = CP18→CP18A`; then
  `S19 = CP18A→CP19` and continue identically through `S38 = CP37→CP38`.
- Each clip begins and ends on the supplied frames without redesign, crop,
  reframing or recolouring.
- `P00→CP00` is the generated eight-second true-story opening transition;
  `CP38→E01` is the generated eight-second reflective closing transition.
- Exact title, mark and lettering are stabilized in post. `BOOK AVAILABLE`
  appears only on P00; E01 carries the invitation and `TO BE CONTINUED`.
- If a model cannot accept both endpoints, label it unsuitable for the chain.

## Flow audio contract

Flow generates and retains the musical bed for each clip:

- let Veo freely choose the instrumental musical underscore, ambience and sound
  effects that best fit the scene;
- no spoken words, dialogue, narration, singing, lyrics, chanting or
  intelligible human vocalization;
- no visible word articulation, lip sync or several people speaking at once;
- naturally relaxed mouths, breathing, listening, gaze, nods and restrained
  hand gestures remain allowed.

Do not instruct Flow to return a silent video, and do not state that its native
audio will be discarded or replaced.

Append this block to every Flow shot:

```text
FLOW AUDIO: Let Veo freely choose and generate the instrumental musical
underscore, ambience and sound effects that best fit the scene. No person may
speak. Generate no spoken words, dialogue, narration, singing, lyrics, chanting
or intelligible human vocalization. Nobody visibly speaks, forms words or
lip-syncs.
```

## Privacy and truth contract

- Never upload raw tax, police, court, medical-adjacent or private email pages.
- Recreate documents as anonymized unreadable plates; add exact public text in
  post.
- No private name, address, account value, password, employer brand, diagnosis,
  public-figure likeness or official seal appears in generated imagery.
- Do not reproduce the disputed sentence or visualize threatened harm.
- The accountant, tax officer, police, two experts and judge remain ordinary
  people; humour is a human micro-expression, not proof about the case.
- Always keep two distinct experts and the exact C-shaped courtroom geometry.
- Financial questions do not become completed confiscation, eviction or fine.
- Seven judges first recuse and an eighth follows; no June departure from office
  is invented.
- Clemency refusal and the later presidential signature are memoir irony, not
  equivalent acts, cause, revenge or legal judgment.
- The anonymous professor asks a research question; no proof or prize is shown.
- The 2026 election does not decide the private case. Part III owns the result.

## Credit lock

- Part I: `22 × 8 s = 220` Flow credits at the observed Veo 3.1 Lite rate.
- Part II: `39 × 8 s = 390` credits.
- Base two-film motion: `610` credits.
- Observed balance: `970`; reserve after base generation: `360` credits.
- Veo 3.1 Lite is locked. Generate only exact production endpoints and final-use
  eight-second intervals. No slideshow, animatic, midpoint or decorative test frame.
- Generate the remaining chain only after the Founder approves the books,
  written prompts and production model.

## Release recheck

Immediately before generation, verify the live model names, endpoint support,
eight-second duration, watermark control, audio behaviour and charged credits.
Immediately before release, recheck the hearing date, public presidency and any
source correction that changes the film rather than only the notes.
