# QA-to-E2E checkpoint

This directory is the durable bridge between completed manual QA branches and
the executable collections under [`../../../e2e`](../../../e2e/README.md).
It prevents a later E2E update from re-reading the complete manual QA pack.

## Current reviewed boundary

- Reviewed source commit: `153ef0e180642aa18a24445b307b33608c6f694e`
- Reviewed QA result set: 89 rows whose matrix `Result` is `PASS` or
  `PASS / CLOSED`
- Review date: 2026-09-08
- Durable row/section fingerprints: [`checkpoint.json`](checkpoint.json)

`checkpoint.json` fingerprints each completed matrix row together with its
same-ID section in the domain lifecycle pack, when such a section exists.
It does not claim that every manual visual branch is automated. Functional
`request.json` files, backend/UI stress scenario JSON files and standalone
stress metadata declare `qaBranches.core` for a primary executable contract
and `qaBranches.supporting` for narrower, load-oriented or adjacent evidence.
Missing links remain visible as automation backlog instead of being mislabeled
as coverage.

## Completed E2E update at this boundary

The 89 completed branches above were reviewed once against every E2E family,
including functional backend, functional browser, backend stress, browser
stress, standalone WebSocket load, and the repository audits. The resulting
closeout on 2026-09-08 was:

- functional backend: 95 passed, 0 failed, 0 skipped;
- functional browser: 26 passed, 0 failed, 0 skipped;
- restored affinity graph contract: 55 seeded users, 1,129 materialized edges,
  all 6 focused endpoint cases passed;
- backend stress smoke: 16/16 flow iterations, 20/20 contract iterations, and
  18/18 WebSocket handshakes passed;
- affinity graph read stress: 2,352/2,352 requests passed;
- standalone WebSocket room: 20/20 clients and 100/100 deliveries passed;
- selected slow-mobile browser stress for bootstrap, scoped admin support,
  admin help media, and asset/resource lifecycle passed;
- media breakpoint audit passed; Mongo hard-code audit regenerated; E2E reset
  covers 73/73 discovered Java-model and tracked seed collections.

Traceability at closeout is intentionally honest: 20 branches have core E2E
coverage, 33 have supporting coverage, and 36 remain explicitly unlinked. An
unlinked branch is visible automation backlog, not an implied automated pass.
The scoped admin-support browser case additionally proves that its tracked,
tab-local demo session does not replace the original admin app, workspace, or
active-demo session.

## Incremental continuation

Run this first:

```bash
node guides/qa/e2e/audit.mjs
```

A clean run is the explicit checkpoint that the previously reviewed QA branches
have not changed. If QA grows or a completed branch is edited, the command fails
with only the new, changed or no-longer-PASS IDs. Review those IDs only, update
their executable tests and `qaBranches` metadata, then replace only their
fingerprints in `checkpoint.json`. Unchanged branches stay accepted.

Print the candidate current snapshot after that focused review:

```bash
node guides/qa/e2e/audit.mjs --print-current
```

The same audit validates QA metadata across functional, stress and standalone
E2E descriptors. It also compares the E2E database reset list with every Java
`@Document` collection and every tracked E2E seed JSON file. This keeps
stateful E2E cases isolated as new persistence collections are introduced.

Run an individual QA-linked subset without searching the whole collection:

```bash
E2E_SERVER_MODE=e2e node e2e/functional/backend/run.mjs \
  --qa-case EVENT-LIFE-001 --include-mutations

E2E_UI_BASE_URL=https://127.0.0.1 node e2e/functional/ui/run.mjs \
  --qa-case EVENT-EDITOR-001 --include-mutations

node e2e/stress/backend/run.mjs --list --qa-case EVENT-LIFE-001
node e2e/stress/backend/run.mjs \
  --scenario e2e-flow-smoke --qa-case AUTH-SESSION-001

node e2e/stress/ui/run.mjs --list --qa-case EVENT-EDITOR-001
node e2e/stress/ui/run.mjs \
  --scenario app-event-editor-open --qa-case EVENT-EDITOR-001
```

The functional mutation stress driver and concurrent backend runner accept the
same `--qa-case` selector. `websocket-room.mjs` accepts it for its standalone
chat fanout contract. Performance comparisons and audits remain suite-wide
tools rather than pretending to be direct QA-branch coverage.

The standalone stack always uses disposable `e2e_db`. Never point these
mutation runs at the manual-QA `demo_db` fixture transaction.
