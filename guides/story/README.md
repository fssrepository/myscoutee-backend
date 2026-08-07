# MyScoutee story trilogy

This directory is the series hub. The three narrative packages live under
`trilogy/`; material intentionally reused by more than one volume lives under
`shared/`. Nothing from a later volume is silently folded into Volume I, and a
volume does not own a duplicate copy of a cross-volume workflow.

The known trilogy arc is **product and idea origin → independently documented
middle chapter → actual final outcome**. This describes the narrative function
of the three volumes; it does not assign final English titles to Volumes II and
III before their stories are ready.

## Volumes

| Volume | Working identity | Status | Package |
| --- | --- | --- | --- |
| **I** | **The City Between Us** | unpublished book draft `v0.1`; 02:48 product-film package in development | [01-the-city-between-us](trilogy/01-the-city-between-us/overview/README.md) |
| **II** | title unassigned | planned; story must be reconstructed from its own primary material | [02-unassigned](trilogy/02-unassigned/overview/README.md) |
| **III** | title unassigned | planned final volume; no ending is invented in advance | [03-unassigned](trilogy/03-unassigned/overview/README.md) |

The Roman numeral is the trilogy position, not an edition version. Volume `I`
can therefore be book version `0.1`, later `1.0`, `1.1` or `2.0` without ever
becoming Volume `II`.

## Ownership boundary

[`trilogy/`](trilogy/README.md) owns the story-specific packages. Every volume keeps its
own manuscript, evidence, film, storyboard, prompts, assets, renders, scripts,
version history and production handoff.

[`shared/`](shared/README.md) owns only cross-volume material:

- benchmark prompts, control assets and comparable score logs;
- series metadata;
- platform workflows and multi-film cost/credit planning;
- product truth, research and claim boundaries that apply across the trilogy.

When a shared workflow uses Volume I as a concrete example, the example points
back into `trilogy/01-the-city-between-us/`; its story-specific files remain
owned by Volume I.

## Per-volume contract

Every volume package keeps these concerns separate:

- no regular file sits directly in a volume root; the root contains only the
  directories below;
- `overview/`: volume entry point, status and navigation;
- `book/`: English manuscript, visible version metadata, changelog, HTML/PDF
  build and optional illustration contract;
- `research/`: sources and evidence specific to that volume;
- `film/`: creative bible, time-coded script, audio and standalone-film scope;
- `storyboard/`: shot plan and checkpoint chain;
- `production/`: volume checklist, shot tracking and handoff material;
- `prompts/`: character, location, memory and video-generation prompts specific
  to that volume;
- `assets/`, `renders/` and `scripts/`: inputs, generated review outputs and
  reproducible local tooling.

Series metadata is recorded in
[shared/metadata/series.json](shared/metadata/series.json). Exact English titles
for Volumes II and III remain unset until the Founder confirms them.
