# Film prompt preparation audit — 2026-09-11

## Full-library coverage correction — 2026-09-11

This audit supersedes the earlier implication that preserving the previous video prompts' reference sets meant the entire prepared library was connected. The current video prompts contain only 182 of the 266 canonical library handles. All 266 canonical Elements were found with images attached in the read-only MCP inventory; 84 are absent from every direct video input list. Text descriptions of their actions do not pass their images to the model. No indirect use through a newly generated storyboard can be claimed: those storyboard slots are empty and their current prompts omit these same library groups.

Live inventory: 292 workspace Elements, 268 with an image and 24 empty. These are Element counts, not the project's All assets output count. The 266 canonical library records, one logo, one pilot end-frame and 24 empty production containers account for these counts. Project membership and visual quality are not established by this list.

Current production is nine generated videos: V00 ident plus eight story portions (01–05, 06A, 06B, 07). The final assembled export is not a tenth generation job.

| Video | Existing image references | Pending storyboard references | Pending preceding end-frame references | Total current mentions |
|---|---:|---:|---:|---:|
| 00 | 1 | 0 | 0 | 1 |
| 01 | 32 | 1 | 0 | 33 |
| 02 | 46 | 1 | 1 | 48 |
| 03 | 28 | 1 | 1 | 30 |
| 04 | 26 | 1 | 1 | 28 |
| 05 | 31 | 1 | 1 | 33 |
| 06A | 46 | 1 | 1 | 48 |
| 06B | 44 | 1 | 1 | 46 |
| 07 | 41 | 1 | 1 | 43 |

The per-video counts overlap because identities and locations recur. They cannot be added to obtain unique-library coverage.

Unconnected groups: 21 architectural morphs (MR), 48 object/material references (R), six character morphs (CM), seven typography references (TY), and two restaurant detail views (T01_DETAILS_B/C). The MR/R/CM groups total all 75 prepared morph assets. These are omissions from direct inputs, not a finding that all 84 should appear in every clip. Each needs assignment to the actual scripted material/action or an explicit reason to remain an alternative.

The exact asset-to-video matrix, including every omitted handle, is [VIDEO_ASSET_COVERAGE.csv](VIDEO_ASSET_COVERAGE.csv).

### Storyboard decision before further spending

Do not generate the current storyboard prompts. They request nine panels but contain multi-stage video actions and 32–47 reference mentions, and the first prompt even mixes a grid requirement with generic prohibitions on grids/numbers. The previous UI-level 50-reference check did not validate Nano Banana Pro's model-level image support. The public Google documentation reports up to 14 reference images for Nano Banana Pro; the Higgsfield model metadata returned no numerical cap and did not establish how excess Element images are handled. [Google image-generation documentation](https://ai.google.dev/gemini-api/docs/generate-content/image-generation)

A storyboard is an ordered composition plan, not a requirement to regenerate the already available characters, rooms or morph studies. First reuse the existing images to inspect coverage and, if helpful, arrange local review contact sheets without AI generation or Higgsfield credits. Such a sheet does not prove the combined scene or its motion. Commission an additional composition image only for a specific visual question the existing material cannot answer; do not multiply paid jobs merely by changing a 3×3 layout to 2×2 or 2K.

Next: map omitted action/typography assets to their scripted portions and select relevant views within the actual model input constraints. Do not append all 84 indiscriminately or remove unique story content to meet an arbitrary reference count. Current video prompts still depend on empty SB Elements; they must be revised if generated storyboards are removed from the route. No reference selection, generation, new grid jobs or budget debit occurred in this audit. The previous 32-credit board allowance remains provisional, not committed spend.

Preparation only; no generation, upload, account mutation or debit. Creator confirmed the 25-Element import and logo attachment. Read-only MCP verified all production handles; local prompt binding is complete. Only LOGO_MYS currently has attached media; SB/EF/video containers remain empty. Previous full prompt wording remains in Git commit `b516ef057dcf1188e18fe50a8512bfc546367c73`; the canonical master and library image prompts are unchanged.

All original 63 story beats are mapped to the prepared prompts. Existing library mentions remain in each block; Block 06's two-part union contains its complete previous 83-reference inventory. Block 01 also includes the already existing C10 handle for its scripted dating-memory identity. Narration reference placeholders A01–A07 are removed from all film video prompts; the seven spoken source files remain byte-for-byte unchanged and are concatenated in 03_film/narration.txt.

| Portion | Original block beats | Video chars | Board chars | Video input count | Pending media |
|---|---|---:|---:|---:|---|
| 01 | 1,2,3,4,5,6,7,8,9 | 14793 | 13039 | 33 | SB01 |
| 02 | 1,2,3,4,5,6,7,8,9 | 14450 | 11910 | 48 | SB02, EF01 |
| 03 | 1,2,3,4,5,6,7,8,9 | 13783 | 10641 | 30 | SB03, EF02 |
| 04 | 1,2,3,4,5,6,7,8,9 | 13384 | 10316 | 28 | SB04, EF03 |
| 05 | 1,2,3,4,5,6,7,8,9 | 14001 | 10797 | 33 | SB05, EF04 |
| 06A | 1,2,3,4 | 12846 | 9495 | 48 | SB06A, EF05 |
| 06B | 5,6,7,8,9 | 13104 | 9856 | 46 | SB06B, EF06A |
| 07 | 1,2,3,4,5,6,7,8,9 | 13987 | 10864 | 43 | SB07, EF06B |

The import contains 25 unique keys and Names: LOGO_MYS, V00, eight SB, eight story V and seven EF records. V07 needs no outgoing EF; V00 is a graphic ident and does not supply V01's opening. All 17 generation prompts were checked after actual handle binding and remain below 15,000 characters. Both the storyboard and video request stay within 50 inputs, including each required end frame.

For each generation request, preserve its existing refs plus only its own SB and incoming EF. Binding by exact imported Name is a read-only lookup followed by local edits; it does not attach a file. No library reimport, media reassignment or additional generation is implied. The previous aggregate full-library import remains a library artifact, not the production-container import.

## Readiness and unresolved evidence

- Eight storyboards and all main-film videos are prepared, not generated.
- LOGO_MYS is ready: @prop_MYS_mys-film-m-logo_s0_v1, assigned image 7c332e7e-e64e-4a23-94c9-ef445ecbc23d. Its 200 × 200 logo image was visually checked. V00 can proceed through the creator’s UI quote/generation step.
- Final frames cannot be assigned before their accepted source videos exist; they must be extracted, not generated or guessed from a thumbnail.
- Planned boundary motion is a handoff target, not a measurement of an ungenerated predecessor. Inspect the actual end before binding the next storyboard/video.
- The exact effect of storyboard conditioning, generic end-frame references and longer 1080p video jobs remains unverified. The pilot showed that spatial correction may be needed.
- Local sound mixing is planned; an image cannot guarantee native musical phase continuity. One clean full narration is prepared; duration, cost and final mix remain unmeasured.
- The 1882-credit remaining estimate uses historical rates. Import/binding do not authorize an unquoted paid job.

## Video detail revision — 2026-09-11

Expanded selected existing material transitions, spatial separation of memory rooms, hand/object contact and the clinical reveal. No new story beats, reference inputs or duration changes. All nine video prompts remain below 15,000 characters; the 00 ident remains proportionate to its simpler action. Prompt length is a constraint, not evidence of generation quality. Storyboard images and preceding final frames still require sequential generation/attachment before the dependent film clips.
