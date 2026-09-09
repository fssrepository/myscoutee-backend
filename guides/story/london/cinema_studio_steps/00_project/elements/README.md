# Elements — staged import without duplication

These files are metadata for **Import Elements only**. They do not create rendered reference images and are not video prompts.

**Current starting point:** the supplied 2026-09-09 screenshot already shows imported Elements in **MyScoutee**, with empty **Add element image** slots on the visible entries. Skip import for those entries and supply their matching accepted images. The screenshot alone does not verify all 48 entries; only actually missing definitions need importing.

If the project's original 48 Elements already exist, skip their canonical import batches. Use the correct image with each existing Element rather than creating another Element for the same canonical key. The separate pilot supplement below adds only the requested restaurant-memory container. Use the actual available image-binding control; this guide does not invent a move/copy operation.

For an empty or partially populated project, use `00_pilot.md`, then `01_film.md` through `07_film.md` as needed. Each logical definition appears in exactly one batch. Pilot C01/C02/W01 therefore do not repeat in the first film batch. Together the batches preserve **31 characters + 16 locations + one score-card prop = 48 Elements**.

If an earlier import was partial, submit only genuinely missing definitions. `Primary scene` preserves the original organizational metadata; it is not the import batch number. A memory bank can require a character before that character's main film scene.

SCORE_CARDS has no new standalone image-generation requirement. Storyboard and video prompts specify card behaviour.

## Supplemental test assets

[00_pilot_test_assets.md](00_pilot_test_assets.md) is the versioned Import Elements file for the pilot's additional reusable reference. Import it into **MyScoutee** instead of filling the empty New element form by hand. It follows the existing Markdown definition format and contains **one Location: T01_IMAGE / Pilot Soho Restaurant Memory / v1**. If that Element was already created manually, reuse it and skip the import.

The original eight canonical batches still contain 48 definitions; the supplement adds one, giving 49 intended Elements if both sets are present. The production task count remains 77 because metadata import and image association are part of the existing reference-binding task, not another generation.

| Pilot asset | Treatment |
| --- | --- |
| C01, C02, W01 | Reuse the three already imported Elements and their accepted images; no duplicate definitions in the supplement |
| T01_IMAGE | Import its one new Location definition, then attach the existing accepted restaurant still |
| TA01 | Generate and reference the short clean narration through the verified audio input route; no Character/Location/Prop definition in this import |
| T01_VIDEO, T01_EXTEND | Generated video outputs kept as project media; the accepted first video belongs in the actual Forward Extend source field |

The metadata file contains no image bytes or media URL. After import, associate the existing restaurant still, save, and copy the actual complete Element ID. The assistant verifies the supplied association and propagates that ID through all dependent prompts. Do not replace MW01 with this individual memory or mark the pending pilot ready merely because import succeeded.
