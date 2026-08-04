# MyScoutee documentation

The project-level documentation is divided into three areas:

| Directory | Content |
|---|---|
| [`manuals`](manuals/README.md) | Released and versioned operations, administrator, and user manuals, including their PDF sources |
| [`pitches`](pitches/) | Sources and generated outputs for the Network and Product presentations |
| [`plans`](plans/) | Project plans, technical context, qualification material, and roadmaps |

The official manual PDFs can be downloaded directly from the
[root README](../README.md#official-manuals).

The living manual QA contract and its Excel execution ledger start with the
[Admin dynamic surfaces QA plan](plans/ADMIN_DYNAMIC_SURFACES_QA_PLAN.md). New
manual feature packs should extend that ledger so previous execution status and
evidence remain discoverable across sessions. Manual sampling frequency uses
the separate [risk-based priority model](plans/MANUAL_QA_PRIORITY_MODEL.md).

## Presentation output directories

- `pitches/network-output`: MyScoutee Network presentation
- `pitches/product-output`: MyScoutee Product presentation

The generator scripts are stored in `pitches`. The Network presentation's
former generic `output` directory has been renamed to `network-output` to
describe its contents more precisely. Each Python generator automatically
copies its versioned PDF and PPTX releases to the flat
`frontend/guides/pitches` directory in the public frontend repository. ODP
files, intermediate slide images, and build assets remain in the private
backend repository. The manual generator similarly publishes versioned PDFs
to `frontend/guides/manuals`.

Run the complete presentation release builds from the repository root:

```bash
python3 guides/pitches/build_network_pitch.py
python3 guides/pitches/build_product_pitch.py
```

The `--no-office` option is intended only for local slide/PDF previews. It
skips PPTX packaging and deliberately does not publish an incomplete release
to the frontend repository.
