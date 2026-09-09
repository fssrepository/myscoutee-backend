# Current production budget

**Creator-reported 2026-09-09: 80 credits already spent on tests; at most 720 credits available from now for ALL remaining work.** These are reported amounts, not a live account query. The 720 is remaining, so do not deduct the historical 80 twice. Do not assume the old 2200-credit working ceiling, 3000-credit total or an additional protected 800 are available. Those are superseded planning assumptions.

The 720 must cover any further pilot work, seven final video blocks, exact inner-monologue inputs, required hosted assembly/export and any paid preparation. The creator cannot repair or assemble the film in a local editor. Covered Unlimited images consume no credits only when the selected operation actually confirms that coverage. No new media job is launched by a prompt edit.

## Visible pilot cost tracker — three tests

**Recorded spend: 80 credits. Creator-reported remaining cap: 720 credits.** No later charge has been reported or entered. These are the current planning figures, not a live account balance.

| Test | Prompt | Quoted cost for next execution | New actual charge recorded | Remaining cap after execution |
| --- | --- | --- | --- | --- |
| 1. First visual scene, 8 s / 480p | [test_video_8s.txt](../01_pilot/test_video_8s.txt) | **20 credits was the earlier standalone UI quote**; current complete-input quote still needs confirmation | Not reported | **700 only if the next actual charge is 20** and no other new charge intervenes |
| 2. Native continuation, 4 added seconds / 480p | [test_extend_4s.txt](../01_pilot/test_extend_4s.txt) | **Unknown**; inspect the actual Extend operation | Not reported | Prior remainder minus actual Extend charge |
| 3. Narrated version of the joined test | [test_narrated_video.txt](../01_pilot/test_narrated_video.txt) | **Unknown**; include short speech + mixing/output, and any joining fee not already included | Not reported | Prior remainder minus all actual narrated-test charges |

Three test tasks do not necessarily mean exactly three account debits: test 3 may require separately priced speech and mixing. List those component quotes before execution, then record each actual charge once. If a single confirmed operation includes them, count its combined price once. Do not interpret an unknown price or unreported charge as zero.

**Full next test-round cost: not yet known.** With the historical first-video quote as a provisional value, the forecast is `20 + Extend quote + narrated-test components`. The spent total would be `80 + all new actual charges`; the remaining cap is `720 - all new actual charges`. This table does not claim a 500-credit test round or a 100-credit allowance per file.

Update this table and the [credit ledger](../04_tracking/credit_ledger.csv) whenever the creator supplies a new quote or actual debit. Older per-job prices cannot be inferred from the aggregate 80 already spent.

## Testing and remaining budget

The original pilot ceiling was 100 credits total including its short narration and 4-second continuation check. With 80 spent, only 20 remains in that original allocation. A further 20-credit clip would use all of it and leave 700 of the reported overall remaining budget, with narration/continuation still unpriced. Do not treat either the historical quote or the available balance as approval for automatic retries. Keep the current generation, review its actual useful mechanisms, and complete textual preparation before any next operator submission.

## Final production is not yet costed within 720

The creative target remains 200 seconds (six 30-second blocks plus one 20-second ending) at 1080p. Plan one retained final take per block, without first generating seven full-length drafts. An 8-second 480p success would not guarantee a complete 30-second result or identical output at 1080p. Upscaling and native generation are different operations; no automatic paid upscale or reroll is assumed.

The old indicative video-only estimate was 1800 credits, with another 250 for narration and 50 for finishing. That does NOT fit 720. These historical figures are not current account quotes, and the previous 1080p plan is not funded evidence. Obtain actual audio-ON References/Extend prices, speech costs and hosted finishing costs before treating the full route as affordable. Do not silently shorten the film, change resolution or drop narration to force the arithmetic.

For each proposed paid operation, include the complete remaining work:

```text
spending after the reported 720 snapshot
+ next operation's actual quote
+ quoted cost of all remaining necessary production and delivery
<= 720 credits
```

Seven exact monologues remain planned in one retained voice. Native video supplies music and SFX; no separate music generation is added. The source-audio/continuation route and hosted final assembly remain unproven. Their costs must be included before committing the final blocks. Unknown prices make the forecast incomplete, not affordable by assumption.

Record actual new charges once in [credit_ledger.csv](../04_tracking/credit_ledger.csv). The existing 80-credit entry is an aggregate, not four independently verified job charges. Do not invent an additional charge merely because another downloaded file is reviewed. No top-up or extra subscription is assumed.

## Narrated pilot is a separate priced test

The joined visual pilot must actually be rendered/mixed into a narrated result and reviewed. Its standalone prompt is `01_pilot/test_narrated_video.txt`; writing it does not perform that operation. Include the short speech preparation and the narrated-video/hosted mixing quote as distinct costs when they are distinct operations. If one confirmed operation includes both, count that actual combined charge once. Include any necessary hosted joining/export charge too. All amounts remain unquoted until shown by the selected interface; do not assume that preserving source frames makes the operation free. These costs fall inside the same remaining 720, not an additional allowance.
