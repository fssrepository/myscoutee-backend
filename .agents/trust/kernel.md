# MyScoutee trust kernel

This is the compact default habit loop. It protects continuity without loading
the full project memory on every task. Current user and system instructions
always outrank this library.

## Mode behavior

- `light`: use this file only.
- `standard`: use this file and load only the matching cards below.
- `deep`: also read [manifest.md](manifest.md), [constitution.md](constitution.md),
  [routing.md](routing.md), [risk-model.md](risk-model.md),
  [evidence-model.md](evidence-model.md), [system-map.md](system-map.md),
  [sources.md](sources.md), [working-context.md](learnings/working-context.md),
  [accepted learnings](learnings/accepted.md), and
  [completion review](reviews/completion.md), then load matching cards.

Do not load unrelated cards merely because they exist. Escalate from `light` or
`standard` only when the user requests it or the task reaches a deep-mode
trigger below.

## Six-step loop

1. **Protect state.** Before editing, inspect parent worktree state and the
   frontend submodule when present. Preserve pre-existing user changes; apply
   stop, undo, no-edit, no-build, and no-restart instructions immediately.
2. **Pin intent.** Keep the primary outcome and queued additions. Identify
   current behavior, required behavior, owning layer, explicit non-goals,
   predicted files, and promised evidence.
3. **Find the first wrong boundary.** Separate product, seed/data, adapter,
   backend, environment, test, harness, and runtime defects. A failure does not
   itself select the production-code fix.
4. **Change narrowly.** Do not add an unrequested fallback, repair path,
   compatibility branch, historical resurrection, or adjacent refactor.
5. **Cross fewer boundaries.** Inspect changed loops and helpers for repeated
   DB, IndexedDB, HTTP, filesystem, mapping, or projection work. Fetch/batch
   once or pass in-memory state when correctness remains intact.
6. **Prove and report.** Match verification to the real contract, review the
   final diff, and distinguish passed, failed, not-run, and not-proven claims.

## Interrupt questions

Ask these at the relevant decision, not ritualistically at task end:

- What is the first concretely proven incorrect boundary?
- Would this still be the right product change if the failing test vanished?
- Am I hiding the defect with fallback, repair, or query-time reconstruction?
- Am I changing behavior or scope that the user did not request?
- Was removed historical behavior intentionally removed?
- Will this survive reset/import and save/reload or mutation/read?
- Do local and HTTP paths preserve the same observable contract?
- Is expensive I/O hidden inside a loop or helper, and can state cross that
  boundary once instead of N times?
- Is the user's intended stack already running, and did they prohibit a build,
  restart, browser, edit, or other action?
- What exact evidence supports the completion claim, and what remains unproven?

## Standard routing

Load every matching row, but no unrelated row:

| Trigger | Load |
| --- | --- |
| Defect or failed test | [bugfix review](reviews/bugfix.md) |
| Unclear defect crossing several boundaries | [diagnosis habit](habits/diagnosis-before-change.md) |
| Angular/UI/shared-core | [frontend review](reviews/frontend.md) |
| Popup/dialog/drawer/page surface containing a list or SmartList | [SmartList live-surface pattern](patterns/smart-list-live-surface.md) |
| New frontend service/adapter/store slice | [frontend pattern](patterns/frontend-vertical-slice.md) |
| Java controller/service/repository/model | [Java review](reviews/java-backend.md) |
| New Java endpoint/domain slice | [Java pattern](patterns/java-domain-slice.md) |
| Seed, fixture, Mongo JSON, IndexedDB | [data review](reviews/data-and-seeds.md) |
| Environment, Compose, profile, adapter mode | [environment review](reviews/demo-e2e-production.md) |
| Counter, badge, bucket, aggregate, projection | [derived-state review](reviews/derived-state.md) |
| Loop, batch, polling, cache, performance | [performance review](reviews/performance.md), [efficiency habit](habits/efficiency-scan.md) |
| Test/E2E/stress/runner/fixture | [testing review](reviews/testing.md), [runtime habit](habits/runtime-and-tests.md) |
| Registry, signatures, receipts, ledger, identity | [protocol review](reviews/protocol-and-registry.md), [security review](reviews/security-and-privacy.md) |
| New/reworked durable external operation | [durable-work pattern](patterns/external-durable-work.md) |
| Cross-repository or frontend/backend contract | [cross-repository review](reviews/cross-repository.md), [full-flow habit](habits/full-flow-evidence.md), plus each owning layer |
| Auth, secrets, privacy, permissions | [security review](reviews/security-and-privacy.md) |
| Packaging, update, backup, restore, release | [packaging review](reviews/packaging-and-release.md), [security review](reviews/security-and-privacy.md), [durable-work pattern](patterns/external-durable-work.md) |
| UI text, i18n, help, manual, roadmap | [docs/i18n review](reviews/docs-and-i18n.md) |
| New abstraction/helper/service/framework | [search-before-create habit](habits/search-before-create.md), plus owning layer |
| Behavior removal/default/compatibility change | [change discipline](habits/change-discipline.md), [bugfix review](reviews/bugfix.md) |

Load [completion review](reviews/completion.md) only for behavior changes,
cross-boundary work, high-risk operations, or when preparing a strong
completion claim. For a narrow mechanical change, the completion check below
is sufficient.

## Deep-mode triggers

Recommend or use `deep` when the task changes security/privacy, private keys,
payments/accounting, Registry protocol, destructive data migration,
backup/restore, production packaging/release, or three or more system/persistence
boundaries. Also use it when canonical docs, tests, current code, and history
conflict. A user-selected `off`, `light`, or `standard` mode is not silently
overridden; state the risk instead.

## Compact completion check

Before finishing, establish:

- requested outcome and observable behavior delta;
- exact changed files, including submodule/sibling-repository state;
- focused checks run and their results;
- relevant save/reload, reset/import, local/HTTP, retry/restart, security, or
  artifact boundary not exercised;
- final scope/diff review and any remaining risk;
- whether a repeated user correction belongs in
  [candidate learnings](learnings/candidates.md).
