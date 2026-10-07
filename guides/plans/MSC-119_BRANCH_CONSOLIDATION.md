# MSC-119 — consolidation before master QA

User request, 2026-10-07: finish publication preparation, consolidate the active
feature branches into one commit per MSC task, make master match that history,
archive the branches and execute full QA tomorrow on master.

## Repositories and original identities

| Repository | Archived feature tip | Archived remote master | Consolidated master |
| --- | --- | --- | --- |
| frontend | `e8c7fb9395976bc91d0554a77f4c1a08bed5ee22` | `ce041f705ee0b73e16b335f979ce1163be8330ef` | `878c13f85ad66c43a7bc0cd408f99877bcab723b` |
| client | `094caa8b9ed4743003c4a35d1989677964eb13ca` | `97e1b5c34144236b816fb009209c64116123d230` | `094caa8b9ed4743003c4a35d1989677964eb13ca` |
| mcp | `93295fd47d7c8e49741fcc42e0fc019aaf37b31c` | `2e4ece7fcb7f87a4d64f158cab96a76883ea95f1` | `ce94f944552cc94f8302bc869949ffc28a4170ac` |
| backend | `902ddec69b73f33da667c07b82a1ee0d7eec89d7` | `80edd49a46d9f80df88443adb2bcdf0dc642bf20` | `MSC-119 commit containing this record` |

The backend's own final hash is the MSC-119 commit containing this record;
`git log -1 --format=%H` identifies it immediately after integration. Original
feature history and the old master were retained independently, including the
previous master-only frontend/backend documentation publication.

## History construction and verification

- Grouped the feature-only commits by their existing MSC IDs. All had a task ID;
  no unassigned change needed speculative reassignment. Existing history through
  the branch base (MSC-114 or earlier) was preserved.
- Created one commit per task from the task's final cumulative tree. Commit bodies
  retain the original commit identities. The Java client already had one commit
  per task and did not need history rewriting.
- Merged each master-only documentation change in a detached worktree first.
  Both merges were clean and their trees equalled the feature tips: those
  documentation changes were already present in the feature snapshots.
- Consolidated application source bytes match the archived feature snapshots.
  Frontend additionally updates README references to master; client/MCP trees
  match their archived feature tips exactly. Backend additionally updates this
  consolidation record, README links and the frontend gitlink. Every backend MSC
  commit points to its matching consolidated frontend task commit.
- Updated each feature branch first, then made master point to the exact same
  commit. Used explicit expected-commit leases for remote updates, including the
  frontend/backend master documentation commits incorporated into MSC-119.
- Verify remote branch/master equality before deleting the feature references.
  Archived tags initially preserved the original histories; the later cleanup
  below records their user-requested removal.
  Final README branch-link cleanup is folded into the same MSC-119 commits; it
  does not add another task commit or alter application behavior.
- Registry and administrator client were already on master and were not rewritten.
  Dependabot and unrelated historical branches are outside this operation.

Resulting task groups:
- frontend: MSC-115, MSC-116, MSC-117, MSC-118, MSC-119.
- client: MSC-115, MSC-116, MSC-119.
- mcp: MSC-115, MSC-116, MSC-117, MSC-119.
- backend: MSC-115, MSC-116, MSC-117, MSC-118, MSC-119.

## Archive removal and recovery

The user subsequently requested removal of all `archive/*` tags locally and
on GitHub, and of every branch except master and the backend's
`refactor/MSC-120-backend-domain-segregation`. The archive tags named in the
original consolidation are no longer available from origin.

Previously verified full-history bundles and the exact old/new map remain at
`/home/raxim/workspace/.msc119-integration-20261007/`: `backend-original.bundle`,
`frontend-original.bundle`, `client-original.bundle`, `mcp-original.bundle`,
and `state.json`. Their presence was checked again during cleanup; no replacement
archive branch or tag was created.

If historical recovery is explicitly requested, inspect the relevant bundle:

```sh
git bundle verify <repository>-original.bundle
git bundle list-heads <repository>-original.bundle
```

Choose the reference actually listed by the bundle. Do not force-push an old
history over newer master work or recreate archive references merely to inspect it.

## Independent cleanup verification — 2026-10-07

All ten local MyScoutee repositories and their GitHub branches/tags were checked.
Twenty-one archive tags were removed from both locations. Twelve Dependabot
branches (five frontend, seven Registry, including `backup/dependabot/*`) were
deleted with explicit user authorization; their pending dependency upgrades were
not merged into master.

The 21 archived commit identities were checked again after deletion using their
recorded object IDs, rather than relying on the rewritten commit names:

- Seventeen archived snapshots match a snapshot already in master history or
  are its ancestors. Backend comparisons resolve frontend gitlinks to their actual
  source trees, so a changed submodule commit ID is not treated as lost content.
- The remaining four snapshots are the older frontend/backend documentation-only
  masters and their feature tips. Their application source is preserved in master
  history. Both published PDF files, HTML sources and the manual builder match
  current master. The remaining README differences replace retired branch URLs
  with master; this consolidation document is an addition, not omitted work.
- The later backend/frontend guide-review consolidation was independently checked
  at every retained task-group boundary: each resulting source snapshot is
  identical to the corresponding old group end. The domain compatibility and
  guide/dialog corrections remain in master.

One actual omission was found outside the archives: payment simulator branch
`fix/group-admin-authorizations`, original commit
`26b623403475b5d63f0082f7d42d9504ee32ae10`, had not reached master. Its group-scoped
authorization list and configuration-access restriction already match the scope
sent by the backend. The exact source tree was integrated as
`21c7bea879191ebdebaf6600d28877e487061b73` with a normalized `[MSC-115]` title; the
remote master update and branch deletion were atomic, followed by local deletion.

The full payment-simulator `go test -p 1 -count=1 ./...` run, including vet,
passed in the existing `myscoutee-payment-simulator-build:qa` image, with one CPU,
1536 MiB memory and disposable test state. A first 768 MiB run passed the simulator
tests but killed the SQLite dependency's vet process; it was not recorded as a
successful suite. No running application container, dev database or browser was
changed by this verification.

Nine further unbracketed MSC titles were normalized across the Java client,
administrator client, MCP and Registry masters. Every rewritten commit retains
its exact source tree. Release tags were preserved. The backend domain branch
remains synchronized with master as the baseline for subsequent cross-domain
work; cross-domain interfaces and their later E2E/performance checks are not part
of this cleanup.

## Publication continuation and verification boundary

Start in the MCP repository at `plugins/PUBLICATION_HANDOFF.md`. It contains
completed package preparation, exact review cases, artifact checks and the
remaining policy, publisher, deployment, OAuth/Events host-QA, recording and
submission steps. Embedded interfaces are excluded.

Local ZIP checks, malformed-archive checks, the existing MCP image build and
public tool-annotation inspection passed. No application/host/browser/load QA
was executed, no private mutation was made and nothing was submitted to a store.
The pending Go discovery assertions and full QA remain NOT RUN.

Tomorrow's full QA must reconcile the current shared ledger and other agent's
new cases. Start the repository's manual-QA continuation route only when the user
actually requests it; retain its fixture, launcher and browser-control boundaries.
New development can start from a clean master after this consolidation.
