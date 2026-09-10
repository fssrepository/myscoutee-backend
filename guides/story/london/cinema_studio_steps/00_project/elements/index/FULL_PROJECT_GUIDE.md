# Current import and image-generation guide

## Existing library

Import the [84 present-world single-view Elements](../additions/WORLD_SINGLE_VIEWS_IMPORT.md). Follow the [replacement guide](../additions/WORLD_SINGLE_VIEWS_REPLACEMENT_GUIDE.md) to remove exactly the 21 superseded W01–W07 page Elements. Keep characters, morphs, memories, restaurant/clinical references and typography. If the seven typography Elements are still missing from the earlier 157-element base, add [TYPOGRAPHY_IMPORT.md](../categories/TYPOGRAPHY_IMPORT.md) once.

## Clean import

[FULL_PROJECT_IMPORT.md](../full/FULL_PROJECT_IMPORT.md) contains **227 definitions**. Alternatively use the [four categories](../categories/README.md): 31 characters, 114 worlds/memories, 75 morphs and seven typography Elements. Use one import route, not both. Import files contain short Type, Canonical key, Name, Version and Description metadata; detailed render instructions belong in the TXT prompts.

## Generation

The [CSV prompt map](FULL_PROJECT_PROMPT_MAP.csv) lists all 227 references with paths relative to `cinema_studio_steps`.

- Present worlds: **84 separate full-frame 16:9 images at 2K**, four replacements for each of the 21 former pages. All are below 15,000 characters. Names retain world, A/B/C group and 01–04 position; original view identities are explicit.
- The other **143 references remain 4K**: 31 character identity sheets (1×3), 30 memory/clinical/restaurant pages (2×2), 75 morph sheets (2×2) and seven typography sheets (TY001 3×3, others 2×2).
- The three oversized morph prompts MR001, R008 and R014 still require length work. They were not edited in the world split. Do not assume all 227 prompts fit the image UI limit.
- Maps remain excluded. No image/video generation, platform import or debit has been performed by these file edits.

Reuse accepted images when they satisfy their current roles. Resolve each real imported Element handle before generating a dependent prompt; an `@UNBOUND_...` token is not a bound reference. Attach world references in the order in the video setup; spatial view order does not create cuts or override the video choreography. Camera position, lens and image composition remain in the image prompts; camera travel, timing and sound are in the video prompts.

At the reported rates, the gross image estimate is **572 credits** for 143 paid 4K outputs plus 84 eligible 2K Unlimited outputs at zero, conditional on active entitlement and the displayed price. See [BUDGET.md](../../BUDGET.md). Old archived import batches are not the current production route.
