# MyScoutee story trilogy

This directory is the series hub. The three narrative packages live under
`trilogy/`; material intentionally reused by more than one part lives under
`shared/`. Nothing from a later part is silently folded into Part I, and a
part does not own a duplicate copy of a cross-part workflow.

The known trilogy arc is **product and idea origin → independently documented
middle chapter → actual final outcome**. This describes the narrative function
of the three parts; it does not assign final English titles to Parts II and
III before their stories are ready.

## Parts

| Part | Working identity | Status | Package |
| --- | --- | --- | --- |
| **I** | **The City Between Us** | public, editable book edition `v1.0.0`; 02:48 product-film package in development | [01-the-city-between-us](trilogy/01-the-city-between-us/overview/README.md) |
| **II** | title unassigned | planned; story must be reconstructed from its own primary material | [02-unassigned](trilogy/02-unassigned/overview/README.md) |
| **III** | title unassigned | planned final part; no ending is invented in advance | [03-unassigned](trilogy/03-unassigned/overview/README.md) |

The Roman numeral is the trilogy position, not an edition version. Part `I`
can therefore be book version `0.1`, later `1.0.0`, `1.1.0` or `2.0.0` without ever
becoming Part `II`.

## Ownership boundary

[`trilogy/`](trilogy/README.md) owns the story-specific packages. Every part keeps its
own manuscript, evidence, film, storyboard, prompts, assets, renders, scripts,
version history and production handoff.

[`shared/`](shared/README.md) owns only cross-part material:

- benchmark prompts, control assets and comparable score logs;
- series metadata;
- platform workflows and multi-film cost/credit planning;
- product truth, research and claim boundaries that apply across the trilogy.

When a shared workflow uses Part I as a concrete example, the example points
back into `trilogy/01-the-city-between-us/`; its story-specific files remain
owned by Part I.

## Per-part contract

Every part package keeps these concerns separate:

- no regular file sits directly in a part root; the root contains only the
  directories below;
- `overview/`: part entry point, status and navigation;
- `book/`: English manuscript, visible version metadata, changelog, HTML/PDF
  build and optional illustration contract;
- `research/`: sources and evidence specific to that part;
- `film/`: creative bible, time-coded script, audio and standalone-film scope;
- `storyboard/`: shot plan and checkpoint chain;
- `production/`: part checklist, shot tracking and handoff material;
- `prompts/`: character, location, memory and video-generation prompts specific
  to that part;
- `assets/`, `renders/` and `scripts/`: inputs, generated review outputs and
  reproducible local tooling.

Series metadata is recorded in
[shared/metadata/series.json](shared/metadata/series.json). Exact English titles
for Parts II and III remain unset until the Founder confirms them.
