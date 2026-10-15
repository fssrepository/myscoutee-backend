# MyScoutee agent instructions

Scope: this repository, its `frontend` submodule and work crossing into the
sibling `myscoutee-registry` repository. Global focus, continuation and reuse
rules apply. An in-scope defect report authorizes diagnosis, repair and
verification, followed by the remaining work; respect diagnosis-only/no-edit
instructions.

## CRITICAL LOCAL RESOURCE RULE

- The running-pipeline restrictions below apply while a development server/stack
  is running. When it is stopped, standalone npm tests, builds and other normal
  project checks are allowed; do not start a server just to obtain a watcher.
  Check for leftover test/build/watch processes and avoid overlapping owners.
- Reuse the running hot-deploy/watcher for compilation and builds, regardless
  of spare capacity. Trigger it through a narrow relevant source change or the
  project's trigger and inspect its logs. Do not duplicate its work with another
  npm, ng test, Vitest, Gradle, Java build, watcher, test or server process.
- While the development stack is running, outside the test exceptions below,
  a separate focused build/test requires
  that the running pipeline does not perform it, capacity has been checked and
  the user has not prohibited it.
- For a cache lock or stuck hot-deploy, identify the owning process. Never bypass
  it with a new cache, `GRADLE_USER_HOME`, `/tmp` workaround or second process.
  Restart only that owner; ask if ownership or restart impact is unclear.
  Whenever replacing an existing owner process, stop it before starting its
  replacement; never overlap them.
- Assess response-time and CPU impact proportionally. Small steps use focused
  JUnit tests and existing runtime health/logs/CPU evidence. Run matched
  load/stress measurements after a coherent change batch or for a concrete
  performance concern: same workload, data, concurrency, warmup and deployment
  limits; record both source revisions and increases as well as decreases.
  Functional success does not prove performance parity.
- Validate completed backend change batches on KVM and monolith, serially with
  one stack running. Focused runtime checks are required in both; duplicate
  stress runs are not required by default.

**Authorized test exceptions:**

- Backend: run standard/embedded JUnit serially through
  `tools/run-backend-junit.sh`, including while the dev server runs. It isolates
  outputs/state in `build/junit` and `server/build/junit-gradle`, without signaling
  DevTools or connecting to dev databases. Integration tests remain opt-in;
  this permits neither a second server nor changing the QA deployment.
- Frontend: follow the [frontend test skill](.agents/skills/myscoutee-frontend-testing/SKILL.md).
  Stop existing `frontend-sync`, wait for watcher exit, run one non-watching
  test, wait for its descendants to exit, then restore the same previously
  running service even on failure. Never overlap test/build owners.
  With the development stack running, compilation-only verification stays with
  the existing watcher; with it stopped, standalone builds are allowed.
- During a large frontend code-change batch with the development stack running,
  temporarily stop `frontend-sync` and wait for its watcher to exit to avoid
  rebuilding intermediate edits. Restore the same previously running container
  after the batch/tests, including on failure, unless the user says to leave it
  stopped. Leave the other services alone.

## User-authorized full-flow testing

Explicit delegation for a specified flow/checkpoint/campaign permits browser
inspection, navigation, clicks, forms and intended test submissions for that
scope. Discussion or documentation of delegation does not activate it. Once
granted, it persists until completion or user change/revocation; repair, retest
and continue without asking again at each step or defect.

This overrides the default manual-QA handoff boundary only for the delegated
scope. Otherwise the user controls the browser, and a defect report permits only
read-only diagnosis. Retain fixture/launcher requirements, resource rules and
explicit acceptance criteria; use the stable checklist without inventing rules
or expanding scope. Report verified results and actual blockers.

## Managed manual-QA browser sessions

- Verify the fixture baseline before every fixture-backed launch; use
  `guides/qa/tools/open-checkpoint-browser-sessions.mjs`.
- Its common harness snapshots and clears configured actors' server-side active
  sessions before demo logins to prevent `BLOCKED_LIMIT`. Keep this centralized;
  do not copy session mutations into scenarios. Normal fixture `reset` restores
  the retained session snapshot before restoring the fixture.
- Standardized startup grants no checklist actions after handoff; those require
  the explicit full-flow delegation above.
- Invoke the versioned checkpoint harness with Docker access to the existing
  MongoDB container. A socket permission error can falsely report
  `MONGO CONTAINER 'MONGODB' IS NOT ALREADY RUNNING`; rerun the same harness with
  Docker access and verify the container. Do not start, rebuild or duplicate
  MongoDB, servers, watchers or Compose stacks because of that error.

## Trust mode gate

Resolve once at engineering task start (code, configuration, seed, test,
packaging, operations or architecture). Precedence: explicit current user mode
(`trust off`, `trust light`, `trust standard`, `trust deep`), then `.trust-mode.local`,
then `standard`. Report invalid local values and use `standard`.

- `off`: do not load the trust library.
- `light`: read [kernel](.agents/trust/kernel.md) only.
- `standard`: read kernel and only its task-matched cards.
- `deep`: follow kernel's deep-loading route before editing.

Current user and higher-priority instructions still apply. Skills/harnesses
cannot override the selected mode. Do not change the gitignored local override
unless asked; its existing manager is `tools/trust/trust-mode.sh`.

## Higgsfield production route

For MyScoutee Higgsfield/Cinema Studio work or continuation, enter through the
[Higgsfield skill](.agents/skills/myscoutee-higgsfield/SKILL.md). It routes production
continuity and historical decisions separately from application manual QA.

## Optional manual-QA continuation route

Only an explicit request to continue/resume the campaign activates this route.
Read [CURRENT_QA_SESSION.md](guides/qa/handoffs/CURRENT_QA_SESSION.md) first; its
resume block is the sole current checkpoint pointer. Load only the linked
checkpoint, not the full QA pack or already-proven history. If the runtime
boundary may be stale, use its read-only resume gate before fixture mutation,
browser relaunch or replay.

Keep reusable methodology and the live pointer in the handoff; transactional
evidence/status belongs in its named QA pack and CSV/XLSX ledger. Do not duplicate
those evidence files in the handoff.
