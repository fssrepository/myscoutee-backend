# MyScoutee story and product films

This directory is the series hub. The three narrative packages live under
`trilogy/`; material intentionally reused by more than one part lives under
`shared/`. Nothing from a later part is silently folded into Part I, and a
part does not own a duplicate copy of a cross-part workflow.

The known trilogy arc is **product and idea origin → independently documented
middle chapter → actual final outcome**. Part II now has the working title
**The System Between Us**; Part III remains unassigned until its real outcome
exists.

## Parts

| Part | Working identity | Status | Package |
| --- | --- | --- | --- |
| **I** | **The City Between Us** | public book lineage `v1.0.0`; synchronized `03:12` film package, no new media generated | [01-the-city-between-us](trilogy/01-the-city-between-us/overview/README.md) |
| **II** | **The System Between Us** | revised English book and synchronized `05:20` film/evidence package in review; no new media generated | [02-the-system-between-us](trilogy/02-the-system-between-us/overview/README.md) |
| **III** | title unassigned | planned final part; no ending is invented in advance | [03-unassigned](trilogy/03-unassigned/overview/README.md) |

The Roman numeral is the trilogy position, not an edition version. Part `I`
can therefore be book version `0.1`, later `1.0.0`, `1.1.0` or `2.0.0` without ever
becoming Part `II`.

## Ownership boundary

[`trilogy/`](trilogy/README.md) owns the story-specific packages. Every part keeps its
own manuscript, evidence, film, storyboard, prompts, assets, published outputs,
scripts,
version history and production handoff.

[`shared/`](shared/README.md) owns only cross-part material:

- inactive historical benchmark prompts, control assets and score logs;
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
- `assets/`: source inputs;
- `published/`: one flat directory for approved public book and film outputs;
- `scripts/`: reproducible local tooling. Review videos and timing studies stay
  with their owning storyboard or film package rather than in `published/`.

Series metadata is recorded in
[shared/metadata/series.json](shared/metadata/series.json). Part II's working
title is recorded; Part III remains unset until its story can be concluded
without invention.

## Standalone product reel

[`product-demo/`](product-demo/overview/README.md) is a separate, 48-second
product-first reel and short English-first companion book with a Hungarian
translation. It is not Part III and
does not continue or retell the trilogy. It uses the same ten-directory package
contract as Parts I and II, the same exact MyScoutee mark, and the same locked
Google Flow / Veo 3.1 Lite eight-second production route.
