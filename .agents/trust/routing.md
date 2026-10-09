# Trust routing

Classify by behavior and risk, not only by changed file extension. Select all
matching rows.

| Trigger or touched surface | Required review cards | Additional habits/patterns |
| --- | --- | --- |
| Any defect investigation | `reviews/bugfix.md` | `habits/diagnosis-before-change.md` |
| Any Angular/UI/shared-core change | `reviews/frontend.md` | `patterns/frontend-vertical-slice.md` |
| Popup/dialog/drawer/page surface with a list, SmartList, or live collection | `reviews/frontend.md` | `patterns/smart-list-live-surface.md` |
| Java controller/service/repository/model change | `reviews/java-backend.md` | `patterns/java-domain-slice.md` |
| Backend domain, dependency, Spring configuration, worker, transport or deployment change | `reviews/microservices-compatibility.md` | canonical composition in `microservices/assemblies.json` |
| Mongo JSON, frontend seed, IndexedDB, demo fixture | `reviews/data-and-seeds.md` | `patterns/environment-isolation.md`, `habits/efficiency-scan.md` |
| Environment, Compose, profile, routing-mode change | `reviews/demo-e2e-production.md` | `patterns/environment-isolation.md` |
| Counter, badge, list bucket, aggregate, projection | `reviews/derived-state.md`, `reviews/performance.md` | `patterns/write-time-derived-state.md` |
| Performance, load, polling, cache, query optimization | `reviews/performance.md` | `habits/runtime-and-tests.md`, `habits/efficiency-scan.md` |
| Tests, E2E runner, stress harness, fixtures | `reviews/testing.md` | `habits/runtime-and-tests.md` |
| Registry client, signatures, receipts, ledger, identity | `reviews/protocol-and-registry.md`, `reviews/security-and-privacy.md` | `patterns/external-durable-work.md` |
| Java–Go or backend–frontend contract | `reviews/cross-repository.md` plus each owning layer | `habits/full-flow-evidence.md` |
| Auth, secrets, privacy, permissions, operator boundary | `reviews/security-and-privacy.md` | `habits/change-discipline.md` |
| Packaging, install, update, backup, restore, release | `reviews/packaging-and-release.md`, `reviews/security-and-privacy.md` | `patterns/external-durable-work.md` |
| UI text, i18n seed, help/manual/roadmap | `reviews/docs-and-i18n.md` | `habits/full-flow-evidence.md` |
| New abstraction, helper, service, or framework | owning-layer review | `habits/search-before-create.md` |
| Loop, batch, bootstrap step, per-item repository/service call | owning-layer review | `habits/efficiency-scan.md` |
| Behavior removal or compatibility change | owning-layer review, `reviews/bugfix.md` | `habits/change-discipline.md` |

Always finish with `reviews/completion.md`.

## Risk escalation

Also read [risk-model.md](risk-model.md) when any of these are true:

- more than one persistence system or repository is touched;
- a private key, signature, auth identity, payment, update, backup, or restore
  path is involved;
- the change alters externally visible behavior rather than correcting an
  implementation to an already-proven contract;
- a destructive operation, data migration, seed replacement, or broad rename
  is proposed;
- the correct answer depends on reconciling conflicting docs, tests, current
  code, and Git history.

## Minimal routing record

Keep this in the working notes or task ledger; it need not be committed:

```text
Task tags:
Risk tier:
Selected reviews:
Canonical sources:
Reference implementations:
Explicit exclusions:
```
