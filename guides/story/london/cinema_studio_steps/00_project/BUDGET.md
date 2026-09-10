# Current production budget

## Current decision: all images remain 4K

2026-09-10: the creator explicitly confirmed that **every image remains at 4K**. All 171 active image prompts retain their existing detailed content and grid layouts. No prompt was converted to 2K or split into two sheets for budget reasons.

Keep all four morph states together on ONE 2×2 sheet: intact source, first substantial material reconstruction, a distinctly different advanced reconstruction, and resolved destination. Character identity sheets retain 1×3; TY001 retains its specific 3×3 typography layout. All these sheets remain 4K.

The prompts request 3840×2160 pixels. At that exact canvas size, each 2×2 cell is 1920×1080. Check actual downloaded file dimensions rather than treating a model's resolution label as a measured output. The earlier 2K and split-sheet scenarios were discussed but not adopted; they are not the current production plan.

## Creator-confirmed image prices

2026-09-10: the creator reports **4 credits per 4K output image using Nano Banana Pro in Higgsfield**, and confirms that the seven-day Unlimited offer covers **2K images only**. Use these account-specific observations for planning; they are not a universal price for every model or operation.

One complete sheet is one image, regardless of whether it contains 1×3, 2×2 or 3×3 cells. Additional output variants and paid regenerations count as additional images. Importing Elements and editing files do not generate images or incur an image-generation debit.

The conditional zero-credit 2K estimate applies only to eligible generations made in Unlimited mode during the active seven-day window. The 4K operation remains chargeable at the reported rate.

## Full first pass at the current 4K setting

| Category | Sheets | Credits/image | First pass |
|---|---:|---:|---:|
| Character identities | 31 | 4 | 124 |
| Present-world references | 21 | 4 | 84 |
| Memory, clinical and restaurant worlds | 30 | 4 | 120 |
| Building and space morphs | 37 | 4 | 148 |
| Object and material morphs | 32 | 4 | 128 |
| Character morphs | 6 | 4 | 24 |
| Typography sheets | 7 | 4 | 28 |
| Optional maps | 7 | 4 | 28 |
| **Imported library, excluding maps** | **164** | **4** | **656** |
| **All image prompts, including maps** | **171** | **4** | **684** |

The typography supplement is **7 images / 28 credits**, already included in both totals. The earlier 157-asset library without typography would have cost 628 credits for one complete 4K pass.

Current prompts request a 3840×2160 canvas. Character identity sheets use 1×3 cells; worlds, memories and morphs use 2×2. TY001 uses 3×3 short rating samples; the other typography sheets use 2×2. At that exact canvas size, the cells are 1280×2160, 1920×1080 and 1280×720 respectively. These are requested dimensions, not verified generated-file measurements.

This is a gross first-pass estimate: one new image per listed prompt. Existing usable outputs must be reused rather than regenerated. Do not automatically subtract the four retained C01, C02, MR001 and R002 images. Subtract only images actually reused for the current role and quality requirement. The older R002 bus angle sheet is not the new bus morph. Each reused image removes 4 credits from the planned 4K first pass.

## Current balance and hard spending limits

2026-09-10: the creator reports **2860 credits currently available**. This replaces the earlier approximate 700-credit balance. The creator will purchase **no more than 500 additional credits**. No purchase has been confirmed or made here; the current available balance remains 2860, and the maximum balance including a future permitted top-up would be 3360.

**No regeneration is allowed for images or videos under the current plan.** Additional attempts and retry allowances are zero. The earlier 10%/20% image allowances and one/two extra video attempts are superseded. Review prompts, reference assignments, settings and the displayed cost before the first generation; retain usable existing outputs. A failed output does not authorize another attempt. No automatic retry, variant batch or replacement generation is included.

All images remain 4K with their current complete grid compositions and detailed prompts.

| Funding scenario | Total credits | After 164 imported-asset images (656 credits) | After all 171 images including maps (684 credits) |
|---|---:|---:|---:|
| Current creator-reported balance | 2860 | 2204 | **2176** |
| With the maximum further 500-credit purchase, if made | 3360 | 2704 | **2676** |

The remainder must cover the first planned test-video generations, final footage, audio, assembly and export. These are remaining spending ceilings, not a quote for those operations or confirmation that the entire film will fit. The optional 500 credits must not be treated as already available. No larger top-up is part of this plan.

## Video and finishing costs are separate

| Operation | Last known price or status |
|---|---|
| Detailed 8-second / 480p pilot | Earlier standalone UI quote: 20 credits; current price with the complete input set is unconfirmed |
| Native extension, +8 seconds | Current Extend price unknown |
| Narrated version of the joined test | Current speech, mix and any attachment/output costs unknown |
| Full film: six 30-second blocks and one 20-second ending | Current prices of the selected final generation operations unknown |
| Assembly, mix and export | Calculate from the actual Higgsfield operation |

The narrated test uses a 16-word excerpt lasting approximately 7–9 seconds; it does not require replacing the existing scene with a new generation or another image pass. Accepted images can also be reused in the final film. This budget does not change the film's duration, story or visual content.

```text
remaining new paid 4K sheets × 4
+ further test videos and their audio
+ first generations of the full film
+ assembly / mix / export
= total remaining credit requirement
```

The itemized estimate is [IMAGE_GENERATION_ESTIMATE.csv](../04_tracking/IMAGE_GENERATION_ESTIMATE.csv). Its current baseline remains one 4K output per prompt, using `planned_new_images × credits_per_image`; `additional_attempts` must remain zero under the no-regeneration constraint. It records a plan, not an order or debit. Actual entries in [credit_ledger.csv](../04_tracking/credit_ledger.csv) are unchanged; do not deduct the previously recorded 80-credit test spend again. No image generation was started here.

The [archived earlier budget](../04_tracking/archive/budgets/BUDGET_BEFORE_4K_IMAGE_QUOTE_2026_09_10.md) preserves the previous Unlimited assumption and test plan. Use this current document for forward estimates.
