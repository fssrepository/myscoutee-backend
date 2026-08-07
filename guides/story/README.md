# MyScoutee story trilogy

This directory is the series hub. Each volume owns its own book, film plan,
storyboard, prompts, assets, renders, version history and production handoff.
Nothing from a later volume is silently folded into Volume I.

The known trilogy arc is **product and idea origin → independently documented
middle chapter → actual final outcome**. This describes the narrative function
of the three volumes; it does not assign final English titles to Volumes II and
III before their stories are ready.

## Volumes

| Volume | Working identity | Status | Package |
| --- | --- | --- | --- |
| **I** | **The City Between Us** | unpublished book draft `v0.1`; 02:48 product-film package in development | [01-the-city-between-us](01-the-city-between-us/overview/README.md) |
| **II** | title unassigned | planned; story must be reconstructed from its own primary material | [02-unassigned](02-unassigned/overview/README.md) |
| **III** | title unassigned | planned final volume; no ending is invented in advance | [03-unassigned](03-unassigned/overview/README.md) |

The Roman numeral is the trilogy position, not an edition version. Volume `I`
can therefore be book version `0.1`, later `1.0`, `1.1` or `2.0` without ever
becoming Volume `II`.

## Per-volume contract

Every volume package keeps these concerns separate:

- no regular file sits directly in a volume root; the root contains only the
  directories below;
- `overview/`: volume entry point, status and navigation;
- `book/`: English manuscript, visible version metadata, changelog, HTML/PDF
  build and optional illustration contract;
- `research/`: sources, evidence map, product truth and claim boundaries;
- `film/`: creative bible, time-coded script, audio and standalone-film scope;
- `storyboard/`: shot plan and checkpoint chain;
- `production/`: workflow, purchase, model, checklist, tracking and handoff
  material;
- `prompts/`: character, location, memory and video-generation prompts specific
  to that volume;
- `assets/`, `renders/` and `scripts/`: inputs, generated review outputs and
  reproducible local tooling.

Cross-volume style or tooling may be promoted into a future `shared/` package
only after two volumes genuinely use the same artifact. Until then, keeping a
copy inside one volume is safer than creating an ambiguous global source.

Series metadata is recorded in [series.json](series.json). Exact English titles
for Volumes II and III remain unset until the Founder confirms them.
