# MyScoutee production effort and image-adherence audit — 12 September 2026

Production cutoff: **2026-09-12 16:48:54 UTC (18:48:54 CEST)**, immediately before this audit request. Audit work itself is excluded. The creator reports both final deliverables uploaded; upload/publication status was not rechecked.

## Frozen checkpoint — use these results for formatting

The numbers and classifications below are saved in `summary.json` and the CSV ledgers. **Do not rescan `.codex`, rerun image sampling or recalculate because the project brief is being reformatted.** Only a requested scope/method correction or new production evidence warrants a new audit revision. Keep the existing brief paragraphs; edits there are confined to its statistics block. The typography bug is a separate authorized one-line addition.

The original detailed brief is preserved in `brief_before_public_summary.md`. An unintended whole-brief rewrite was reverted byte-for-byte before the statistics-only edit. A boundary check confirmed unchanged content before the metrics block (apart from that typography addition) and after it.

## What the records support

Primary festival scope is the August 27 local title plus September 9–12 preparation, library, pilots, generation, narration, editing and final export. Earlier books and Part I/II film work are shown separately. The related August 14 product campaign is excluded from the whole-lineage headline. No new image, video or voice generation was run for this audit.

| Scope | Joint window, 15–30 min rule (h) | Codex task intervals (h) | Residual at 30 min (h) | Total tokens (M) | Uncached input (M) | Cached input (M) | Output (M) |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Festival film incl. local title | 49.14–50.35 | 28.52 | 21.84 | 562.719 | 13.471 | 547.170 | 2.079 |
| Two English books + paired prompts | 27.81–28.83 | 25.31 | 3.51 | 764.300 | 20.516 | 741.319 | 2.465 |
| Whole measured lineage excl. product campaign | 138.06–141.67 | 98.05 | 43.62 | 2185.294 | 60.767 | 2116.033 | 8.493 |
| Related product campaign only | 9.65–9.65 | 7.32 | 2.32 | 109.614 | 2.876 | 106.118 | 0.620 |

**These are reconstructed workload measures, not person-hour timesheets or a bill.** Total tokens include repeatedly processed cached context. Cached input is a subset of input; reasoning output is a subset of output. Neither is added twice. An input/output token sum does not equal the amount of original writing produced. Subscription multipliers, Higgsfield credits and provider-internal image/video/TTS tokens are not derivable from these Codex records.

## Method and uncertainty

- Scanned 595 active/archived JSONL files (17.03 GB); selected 25 root segments from 21 distinct root conversation IDs. Unrelated application QA, Navier–Stokes and demo-asset work were excluded. Older IDE request wrappers were stripped before topic review. Scope decisions use actual requests and task dates, not every occurrence of “book” inside a quoted history.
- September usage uses unique `response_id` records. Older logs use positive differences in cumulative `token_count`; repeated unchanged totals contribute zero. At an initial partial counter or counter reset only the recorded last response is counted. This avoids charging a carried-in cumulative balance again, but any earlier unrecorded usage remains missing.
- Twenty-nine root-linked guardian/approval logs are inventoried separately in `summary.json`. Their copied histories are not extra production sessions. Their counters are not added to root totals because cross-log aggregation/overlap has not been reconciled; the root ledger is not an assertion of a complete platform bill.
- Automatic time is the union of recorded `task_started` to `task_complete` / `turn_aborted` intervals; incomplete intervals stop at last activity or next start. It includes tool execution, rendering, network waits and human messages arriving while a task is active. It is not pure GPU/LLM compute time.
- The all-work joint windows merge task intervals and real user-message timestamps when the gap is at most 15 or 30 minutes. The displayed range is sensitivity to that rule, not a statistical confidence interval. A long actively logged render remains included; unlogged overnight gaps do not. Parallel intervals are unioned, never summed twice. Scope/day subtotals use their selected task intervals; a user-only endpoint can therefore extend a global block beyond a scope subtotal.
- Residual = joint window minus Codex task intervals. It is a proxy for manual interaction, checking/copying/uploading and platform waiting. It cannot distinguish those activities, and excludes manual work overlapping active Codex turns. Therefore it is neither an exact manual-labor figure nor a lower/upper bound on human labor.
- Phase assignment uses documented date boundaries and the dominant task. Book drafting, illustration and paired prompt work were intertwined; some later book corrections are embedded in the earlier-film phase. August 5 also includes a short Navier handoff alongside the story work, so its mixed phase is not a pure film-only cost. No invented second-by-second allocation is used.
- Per-phase joint-window totals need not sum to the all-work union: a short gap across a phase boundary is included globally but not necessarily inside either phase. Tokens do partition exactly. Daily/session/model exports retain full precision; report hours/tokens are rounded.

## Books and the original master prompt

The first explicit book request is logged on **August 7 at 09:05 UTC**. Part II begins on **August 8 at 06:51 UTC**; a two-book closeout with 52/106 pages and synchronized film materials is recorded on **August 9 at 19:43 UTC**. That is about **58 h 38 min of calendar span**, with the joint-work estimate above restricted to the book-dominant phases. Later translations, Kindle/EPUB preparation, paperback fixes and book corrections during earlier film work are separate rows. “Roughly two days” describes the rapid initial production, not all subsequent publishing labor.

The canonical festival master prompt existed before the September Codex review. The creator confirms GPT-5.6 Sol / Extra High for the books, matching logged `gpt-5.6-sol` / `xhigh`. For the original master prompt the creator recalls either that model or GPT-6 Astra / High, over roughly one additional day; Git first records the pack on August 27. **Its original ChatGPT writing session and token usage were not found in the 595 local Codex files.** That reported day is not silently converted to 24 work-hours or assigned invented tokens. Only the local title and later Codex adaptation are measured here. Work done in other ChatGPT/Claude chats or manually in generation UIs outside these joint windows is likewise unobserved.

## Phase ledger

| Dominant phase | Model / reasoning | Codex h | Joint h, 15 min | Joint h, 30 min | Residual h, 30 min | Total tokens M | Cached input M | Output M |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 01 Storyboard and source-film preparation (mixed in 402) | gpt-5.6-sol/xhigh | 5.09 | 6.23 | 6.23 | 1.15 | 64.558 | 61.295 | 0.459 |
| 02 Early Flow tests and source story | gpt-5.6-sol/xhigh | 3.81 | 5.58 | 5.94 | 2.14 | 73.102 | 69.985 | 0.410 |
| 03 Two English books, illustrations and paired prompts | gpt-5.6-sol/xhigh | 25.31 | 27.81 | 28.83 | 3.51 | 764.300 | 741.319 | 2.465 |
| 04 Earlier Part I/II films and experiments | gpt-5.6-sol/xhigh | 25.35 | 37.33 | 37.95 | 12.60 | 502.130 | 485.587 | 1.865 |
| 05 Hungarian books, subtitles and release copy | gpt-5.6-sol/xhigh | 6.73 | 7.27 | 7.27 | 0.54 | 134.702 | 129.224 | 0.837 |
| 06 Related product campaign (separate) | gpt-5.6-sol/xhigh | 7.32 | 9.65 | 9.65 | 2.32 | 109.614 | 106.118 | 0.620 |
| 07 Book audiobook preparation and Kindle packaging | gpt-5.6-sol/xhigh | 1.61 | 2.65 | 3.05 | 1.44 | 38.781 | 37.518 | 0.193 |
| 08 Paperback correction and packaging | gpt-5.6-sol/xhigh | 1.63 | 2.04 | 2.04 | 0.42 | 45.001 | 43.936 | 0.186 |
| 09 Festival title / master-prompt-era local work | gpt-5.6-terra/high | 0.11 | 0.14 | 0.14 | 0.03 | 2.690 | 2.542 | 0.015 |
| 10 Festival master-prompt review and adaptation | gpt-6-astra/xhigh | 0.52 | 0.66 | 0.66 | 0.15 | 5.053 | 4.786 | 0.048 |
| 11 Image library, prompts, imports and pilot tests | gpt-6-astra/high; gpt-6-astra/xhigh | 12.77 | 22.60 | 22.60 | 9.83 | 250.109 | 242.269 | 1.109 |
| 12 Festival video production and continuity repairs | gpt-6-astra/high | 11.05 | 20.40 | 21.25 | 10.20 | 242.404 | 236.422 | 0.678 |
| 13 Assembly, narration, voice tests and local repairs | gpt-6-astra/high | 3.45 | 4.47 | 4.47 | 1.02 | 55.696 | 54.494 | 0.202 |
| 14 Source-matched final delivery and compression | gpt-6-astra/high | 0.61 | 0.69 | 1.05 | 0.45 | 6.768 | 6.656 | 0.027 |

## Model token ledger — all selected roots, including the separate product row

| Logged model | Usage records / deltas | Uncached input M | Cached input M | Output M | Reasoning within output M | Total M |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| gpt-5.6-sol / xhigh | 11593 | 50.173 | 1674.982 | 7.034 | 2.528 | 1732.188 |
| gpt-5.6-terra / high | 39 | 0.132 | 2.542 | 0.015 | 0.006 | 2.690 |
| gpt-6-astra / high | 3242 | 12.143 | 516.909 | 1.874 | 0.328 | 530.925 |
| gpt-6-astra / xhigh | 187 | 1.196 | 27.719 | 0.190 | 0.059 | 29.104 |

## Daily ledger — UTC, all selected roots

| Day | Joint h, 15–30 min | Codex h | Residual h, 30 min | Total tokens M | Output M |
| --- | ---: | ---: | ---: | ---: | ---: |
| 2026-08-04 | 2.03–2.03 | 1.65 | 0.38 | 22.025 | 0.225 |
| 2026-08-05 | 4.21–4.21 | 3.44 | 0.76 | 42.533 | 0.235 |
| 2026-08-06 | 2.96–3.32 | 1.55 | 1.77 | 25.831 | 0.116 |
| 2026-08-07 | 11.86–11.86 | 9.62 | 2.24 | 248.716 | 1.132 |
| 2026-08-08 | 11.78–12.09 | 8.94 | 3.15 | 225.581 | 0.770 |
| 2026-08-09 | 13.45–14.15 | 12.58 | 1.57 | 419.337 | 1.096 |
| 2026-08-10 | 17.11–17.41 | 12.86 | 4.55 | 254.220 | 0.828 |
| 2026-08-11 | 8.97–9.29 | 5.86 | 3.43 | 101.975 | 0.491 |
| 2026-08-12 | 10.51–10.51 | 9.20 | 1.31 | 181.301 | 1.086 |
| 2026-08-13 | 1.10–1.10 | 0.61 | 0.49 | 17.274 | 0.057 |
| 2026-08-14 | 10.98–11.36 | 8.19 | 3.16 | 132.435 | 0.707 |
| 2026-08-15 | 1.28–1.68 | 0.73 | 0.95 | 15.654 | 0.104 |
| 2026-08-16 | 0.04–0.04 | 0.01 | 0.03 | 0.307 | 0.002 |
| 2026-08-20 | 2.04–2.04 | 1.63 | 0.42 | 45.001 | 0.186 |
| 2026-08-27 | 0.14–0.14 | 0.11 | 0.03 | 2.690 | 0.015 |
| 2026-09-09 | 9.35–9.35 | 6.33 | 3.02 | 104.032 | 0.562 |
| 2026-09-10 | 13.92–13.92 | 6.96 | 6.96 | 151.130 | 0.595 |
| 2026-09-11 | 15.87–16.19 | 8.21 | 7.98 | 182.998 | 0.513 |
| 2026-09-12 | 9.86–10.76 | 6.91 | 3.85 | 121.870 | 0.393 |

## Continuous collaboration blocks — 30-minute rule, UTC

| Block | Start UTC | End UTC | Elapsed h | Codex h | Residual h | Tokens M |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| 1 | 2026-08-04 03:22:33 | 2026-08-04 05:24:13 | 2.03 | 1.65 | 0.38 | 22.025 |
| 2 | 2026-08-05 05:24:03 | 2026-08-05 09:36:22 | 4.21 | 3.44 | 0.76 | 42.533 |
| 3 | 2026-08-06 14:04:19 | 2026-08-06 17:23:22 | 3.32 | 1.55 | 1.77 | 25.831 |
| 4 | 2026-08-07 06:27:37 | 2026-08-07 10:05:38 | 3.63 | 3.26 | 0.38 | 70.529 |
| 5 | 2026-08-07 10:45:24 | 2026-08-07 13:29:47 | 2.74 | 2.58 | 0.16 | 59.084 |
| 6 | 2026-08-07 17:05:03 | 2026-08-07 22:28:12 | 5.39 | 3.69 | 1.69 | 116.675 |
| 7 | 2026-08-07 23:06:13 | 2026-08-07 23:12:11 | 0.10 | 0.09 | 0.01 | 2.428 |
| 8 | 2026-08-08 06:51:24 | 2026-08-08 15:24:40 | 8.55 | 7.89 | 0.66 | 196.578 |
| 9 | 2026-08-08 16:33:49 | 2026-08-08 17:50:10 | 1.27 | 0.39 | 0.88 | 9.515 |
| 10 | 2026-08-08 18:38:33 | 2026-08-08 20:54:26 | 2.26 | 0.66 | 1.61 | 19.487 |
| 11 | 2026-08-09 08:41:19 | 2026-08-09 19:43:47 | 11.04 | 10.06 | 0.98 | 366.277 |
| 12 | 2026-08-09 20:52:54 | 2026-08-10 03:33:41 | 6.68 | 5.35 | 1.33 | 99.633 |
| 13 | 2026-08-10 08:14:53 | 2026-08-10 22:07:13 | 13.87 | 10.03 | 3.84 | 207.647 |
| 14 | 2026-08-11 09:23:51 | 2026-08-11 16:20:36 | 6.95 | 4.61 | 2.33 | 74.392 |
| 15 | 2026-08-11 21:37:27 | 2026-08-12 03:25:37 | 5.80 | 3.59 | 2.22 | 73.168 |
| 16 | 2026-08-12 11:38:40 | 2026-08-12 12:31:18 | 0.88 | 0.70 | 0.18 | 18.000 |
| 17 | 2026-08-12 16:33:40 | 2026-08-12 21:11:42 | 4.63 | 4.54 | 0.09 | 80.398 |
| 18 | 2026-08-12 22:13:56 | 2026-08-13 00:52:13 | 2.64 | 2.19 | 0.45 | 54.305 |
| 19 | 2026-08-13 18:23:41 | 2026-08-13 18:37:32 | 0.23 | 0.02 | 0.21 | 0.287 |
| 20 | 2026-08-14 11:42:27 | 2026-08-14 21:10:19 | 9.46 | 7.17 | 2.30 | 105.920 |
| 21 | 2026-08-14 21:45:22 | 2026-08-14 23:38:56 | 1.89 | 1.02 | 0.87 | 26.515 |
| 22 | 2026-08-15 00:37:49 | 2026-08-15 02:18:25 | 1.68 | 0.73 | 0.95 | 15.654 |
| 23 | 2026-08-16 23:37:27 | 2026-08-16 23:39:48 | 0.04 | 0.01 | 0.03 | 0.307 |
| 24 | 2026-08-20 02:32:16 | 2026-08-20 04:34:51 | 2.04 | 1.63 | 0.42 | 45.001 |
| 25 | 2026-08-27 04:03:23 | 2026-08-27 04:11:51 | 0.14 | 0.11 | 0.03 | 2.690 |
| 26 | 2026-09-09 07:11:02 | 2026-09-09 07:50:55 | 0.66 | 0.52 | 0.15 | 5.053 |
| 27 | 2026-09-09 11:43:28 | 2026-09-09 20:24:22 | 8.68 | 5.81 | 2.87 | 98.980 |
| 28 | 2026-09-10 04:07:52 | 2026-09-10 11:17:43 | 7.16 | 3.87 | 3.29 | 76.046 |
| 29 | 2026-09-10 12:10:06 | 2026-09-10 18:55:32 | 6.76 | 3.08 | 3.67 | 75.084 |
| 30 | 2026-09-11 04:20:50 | 2026-09-11 10:25:17 | 6.07 | 2.60 | 3.48 | 63.707 |
| 31 | 2026-09-11 11:09:43 | 2026-09-11 21:16:38 | 10.12 | 5.61 | 4.51 | 119.291 |
| 32 | 2026-09-12 06:03:30 | 2026-09-12 16:48:54 | 10.76 | 6.91 | 3.85 | 121.870 |

## Failure, correction and discarded-experiment windows

These are selected evidence-backed incident windows, **not an exhaustive count of all failures**. Time/tokens measure gross logged work inside each window: diagnosis, retry preparation, generation waiting, validation and sometimes concurrent progress. Resolution may continue outside a window. Successful salvage is not “wasted” work. The exact avoidable-loss fraction cannot be recovered from chat logs; do not publish the sum as a proven waste bill. Creative iterations are explicitly separated. Evidence line pointers and timestamps are in `summary.json`; no private conversation text is copied into this report.

| ID / type | UTC window | Incident | Window min | Codex min | Tokens M incl. cache | Uncached input + output M | Outcome / limit |
| --- | --- | --- | ---: | ---: | ---: | ---: | --- |
| B01 / technical | 08-09 17:33–17:40 | Book PDF blank-page and publication-state repair | 6.8 | 6.8 | 5.641 | 0.069 | One blank page removed; regenerated publication and checksums. |
| F01 / technical | 08-10 16:18–18:05 | Earlier film joins / freeze-frame corrections | 107.3 | 97.2 | 28.191 | 0.855 | Two consecutive local repair conversations; not current festival film. |
| F02 / technical | 08-10 18:07–22:07 | Earlier film native voice/background repair | 240.0 | 171.2 | 68.782 | 1.784 | Audio continuity and unwanted generated voice required local reconstruction. |
| N01 / workflow | 09-09 16:21–16:50 | Pilot prompt scope rollback | 28.9 | 25.3 | 7.698 | 0.125 | User reverted unwanted cumulative changes; rebuilt separate test requests. |
| N02 / workflow | 09-10 12:23–12:48 | Memory detail omitted during prompt restructuring | 24.6 | 9.8 | 5.360 | 0.057 | Restoration/checking after user reported details removed. |
| N03 / platform | 09-10 13:28–13:41 | Image generation with references failed | 13.3 | 5.6 | 2.429 | 0.032 | Investigated failed reference-bound job and continued memory setup. |
| N04 / technical | 09-11 07:16–08:29 | End-frame export and continuation displacement | 72.7 | 57.0 | 16.604 | 0.437 | Compared frames, diagnosed separate early export and spatial offset; repaired test join. |
| N05 / platform | 09-11 11:48–13:35 | Eligibility / 30-reference limit / early replacements | 106.8 | 60.5 | 22.056 | 0.603 | Composer capacity and moderation forced repartition and replacement work. |
| N06 / platform | 09-11 14:17–15:40 | Further Face/IP replacements and stale eligibility | 82.2 | 25.2 | 14.375 | 0.176 | Distinct blocked references and replacement binding checks. |
| N07 / technical | 09-11 18:18–19:26 | Statue join / freeze / VLC repair | 67.3 | 57.9 | 19.363 | 0.330 | Local transition and playback correction; includes attempted solutions. |
| N08 / platform | 09-11 20:13–20:31 | P05 statue NSFW inconsistency | 17.9 | 11.7 | 4.709 | 0.112 | Rejected reference compared with generated content; diagnosis/reporting. |
| N09 / platform | 09-12 08:43–09:08 | P09 sensitive-output rejection and retry | 25.1 | 17.7 | 6.700 | 0.354 | Restart subsequently completed; exact rejection cause unknown. |
| N10 / technical | 09-12 09:27–09:56 | P10 failure / page-turn transition review | 28.6 | 17.7 | 6.013 | 0.180 | Prompt correction and safeguards for P11/P12; no claim that all this interval is rerendering. |
| N11 / technical | 09-12 10:18–10:43 | P11 Parliament/Westminster jump and fixed export | 25.0 | 22.1 | 5.685 | 0.183 | Local statue-style repair and end-frame source correction. |
| N12 / platform | 09-12 10:52–11:01 | Element image fidelity discrepancy | 8.1 | 3.3 | 1.651 | 0.010 | Bit-depth/pixel/metadata comparison; gateway causal link remains unproved. |
| N13 / technical | 09-12 11:35–12:11 | P00 original-quality, lettering, audio and VLC correction | 35.6 | 34.3 | 7.041 | 0.107 | Revisited downloaded original, local title repair and playback/audio handling. |
| C01 / creative | 09-12 12:23–12:59 | Narration meaning and picture-fit rewrite | 36.2 | 25.3 | 5.640 | 0.209 | Creative revision following full-film review; not classified as technical waste. |
| C02 / creative | 09-12 13:08–13:40 | Dream versus plain transition comparison | 32.6 | 25.9 | 9.228 | 0.147 | User-selected experiment later set aside; not all experimentation is failure. |
| N14 / platform | 09-12 14:45–14:50 | Qwen incompatible voice preset | 5.4 | 0.8 | 0.636 | 0.005 | Grady voice preset unavailable; attempted model comparison could not start. |
| N15 / workflow | 09-12 15:45–15:56 | Over-aggressive first compression attempt | 10.4 | 10.4 | 1.930 | 0.052 | CRF 18 attempt stopped after correction; replaced with source-matched CRF 8. Accepted final encode is outside this error window. |

The 15 selected festival technical/platform/workflow windows contain **5.99 h of Codex task intervals** and **122.251 M tokens including cache** (2.765 M uncached input + output). Their 9.20 h gross clock windows include manual/platform gaps. They do not overlap, but are still only selected incident envelopes, not a causal loss estimate.

Credits: existing `../credit_ledger.csv` and rejection trackers remain the source for reported charges/refunds. A completed retry is not proof that the preceding job consumed credits; a refund notice is not a verified settled account transaction. No token/credit conversion is applied.

## One aggregate image metric

All 286 completed image jobs returned by the current Higgsfield history identify the model as **`nano_banana_2`**, not Nano Banana Pro. The creator previously used both names/tools; this audit cannot label this sample a Pro benchmark. Twelve actual raw outputs were downloaded and inspected against their **submitted job prompts**, not later edited local prompts. The sample is stratified: two casting sheets, three memories, three worlds, two morph sheets, one restaurant coverage sheet and one typography sheet. Fixed sampling seed 20260912, latest available job per parsed asset key. This deliberately small sample is not population-weighted.

| Sample/model | Untested candidate text reduction | Main content match | Detail loss | Visible identity-reference match |
| --- | ---: | ---: | ---: | ---: |
| 12 images / Nano Banana 2 | ~74% | ~90% | ~40% | ~65% on 6 inspected identity comparisons |

Core content: 43/48; retained detail: 30/48, hence 37.5% detail loss; identity correspondence: 4/6. Full/partial/absent = 1/0.5/0. Each image has four selected core and four detail criteria. Display percentages round to 5 percentage points, with a half-step rounded upward. Identity checks cover four sampled scene outputs and three bound character sheets; they are a smaller subset, not a score for all input references or internal model use. Whole outputs and selected anchor sheets were reviewed, not every pixel of every image in the library. The sampled job metadata lists empty `input_images` despite reference handles in the submitted prompts; current bound-sheet resemblance is checkable, but historical resolver/attachment use is not established by that field.

Clear failures include **COFFE instead of COFFEE**, a bus cropped and much larger than the requested 15–25% frame width, oversized/missing/wrongly tinted rating cards, a substituted admin colleague, and weak correspondence between specified intermediate letter strokes. The main room/action and broad material endpoints usually survive. A restaurant job still contained `UNBOUND_T01_DETAILS`: that is a prompt/binding workflow defect, not proof of model disobedience. Actual outputs were 2752×1536 or 5504×3072, despite literal 3840×2160/16:9 instructions; this delivery-setting mismatch is logged separately from visual content scoring.

Image prompts total **108,342 characters**. Unexecuted simplification candidates total **28,196 characters (73.98% shorter)** by consolidating repeated layout/material/rating rules, removing irrelevant scene-wide context and keeping the assigned scene, people, stages and reference bindings. The original candidate audit remains in Git history; it does not replace production prompts. This is a concrete shortening hypothesis, **not proof that 74% was unnecessary or that the same images would result**. A paid controlled A/B generation would be needed to test equivalence, and none was authorized or run.


The frozen totals are in [summary.json](summary.json). Source sessions and
intermediate exports remain in their original private storage and Git history;
this directory does not duplicate prompts, session records or derived ledgers.
