# MyScoutee agent instructions

These instructions cover this repository, its `frontend` submodule, and work
that crosses into the sibling `myscoutee-registry` repository.

## Focus and continuation

- During active implementation, debugging or QA, a user question, correction,
  side note or status request does not pause or replace the active task. Answer
  briefly and continue until the requested work is complete, unless the user
  explicitly asks to stop, pause or switch tasks.
- A defect reported during that work is an instruction to diagnose, fix and
  verify it within the active scope, then continue the remaining work. Do not
  stop at acknowledging the defect or ask again whether to fix it. Respect an
  explicit diagnosis-only or no-edit instruction.
- Do not ask optional, speculative or adjacent-feature questions during active
  work. Ask only when missing information genuinely blocks progress or a
  material, destructive or irreversible scope decision needs user direction.

## User-authorized full-flow testing

- Codex takes over full-flow testing only when the user clearly and explicitly
  requests it for a specified flow, checkpoint or campaign (for example,
  `test the entire flow yourself`). Merely discussing this option or asking
  to document it does not activate it. Once granted, authorization remains
  active for the delegated scope until completion or
  until the user changes or revokes it; do not request it again after each
  step, question or defect report.
- Within that scope, Codex may inspect and operate the browser, navigate,
  click, fill forms, submit the intended test actions and execute the full
  applicable checklist. Diagnose, repair and retest in-scope defects, then
  continue the remaining steps. Report verified results and actual blockers.
- This explicit delegation overrides the default manual-QA restriction that
  reserves browser actions to the user after standardized startup. Without
  that delegation, the user retains browser control; a question or defect
  report alone does not authorize browser interaction.
- Keep the versioned fixture baseline and browser launcher requirements, the
  existing resource rules and the user's explicit acceptance criteria. Use
  the active stable checklist where applicable; do not invent acceptance
  rules or expand the delegated testing scope.

## CRITICAL LOCAL RESOURCE RULE

**Backend JUnit exception authorized by the user:** standard and embedded JUnit
tests may run in a separate, serial process while the dev server runs. Use
`tools/run-backend-junit.sh`; it reuses the existing Gradle/JUnit implementation
with isolated `build/junit` outputs and `server/build/junit-gradle` project state,
and does not signal DevTools or connect to the dev databases. Integration tests
are a separate, opt-in JUnit group. This exception does not authorize a second
server or changes to the running QA deployment.

**If the dev stack is already running and its hot-deploy process or watcher
handles compilation or builds, trigger that existing process and inspect its
logs, regardless of available capacity. Never repeat the same compilation or
build with a separate npm, ng test, Vitest, Gradle, Java build, watcher, test or
server process. A separate focused build or test may run only if the running
dev pipeline does not perform it, machine capacity has been checked first,
and the user has not prohibited it.**

**For a cache lock, first identify the existing process holding the lock. If
the running dev stack owns compilation or builds, never create a new cache,
use a new `GRADLE_USER_HOME`, use a `/tmp` workaround or start a second process;
restart only the lock owner. If the owner or the impact of restarting it is
unclear, stop and ask for direction.**

**Trigger compilation or build verification through the running dev
hot-deploy process with a narrow change to the relevant source file or the
project's own trigger, then read the existing backend or frontend process
logs. If hot-deploy fails or gets stuck, identify the lock and its owning
process, and restart only that one existing target process.**

**If a change requires stopping the existing owner process, stop that one
process first, then restart it. Never start its replacement alongside the
old process.**

**Invoke the versioned manual-QA checkpoint harness with the Docker access
needed for the already-running MongoDB container on the first attempt. A
sandboxed run may falsely report `MONGO CONTAINER 'MONGODB' IS NOT ALREADY RUNNING`
because of a Docker socket permission error; this does not prove that the
container is stopped. In that case, rerun the same harness command with Docker
access and verify the already-running container. Do not start, rebuild or
duplicate MongoDB, a server, a watcher or a Compose stack because of this
error.**

## Managed manual-QA browser sessions

- Every fixture-backed browser launch must use the versioned
  `guides/qa/tools/open-checkpoint-browser-sessions.mjs` launcher. Before it
  registers new demo logins, its common harness snapshots and clears the
  configured actors' server-side active-session lists so a retained login
  cannot cause `BLOCKED_LIMIT`.
- Keep this cleanup centralized; do not copy actor-specific session mutations
  into each scenario. A normal versioned fixture `reset` restores the retained
  pre-launch session-state snapshot before restoring the fixture itself.
- The common preparation is part of standardized startup only. It does not
  itself authorize any browser navigation or checklist action after handoff.
  Explicit user delegation under **User-authorized full-flow testing** permits
  those actions within the delegated scope.

## Trust mode gate

For engineering investigations or changes involving code, configuration, seed,
test, packaging, operations, or architecture, resolve one trust mode at task
start. Precedence is:

1. the user's explicit instruction for the current task (`trust off`, `trust
   light`, `trust standard`, or `trust deep`);
2. `.trust-mode.local`, when present;
3. `standard` by default.

Modes:

- `off`: do not load the trust library. System/developer instructions and the
  user's current request still apply.
- `light`: read [the trust kernel](.agents/trust/kernel.md) only.
- `standard`: read the kernel, then only the cards it routes for the task.
- `deep`: read the kernel and follow its deep-loading route before editing.

An invalid local value falls back to `standard` and must be reported. Do not
create or change `.trust-mode.local` unless the user asks. The local override is
gitignored and can be managed with `tools/trust/trust-mode.sh`.

The trust protocol is project context, not an optional skill. A skill or
harness may automate it but does not override the selected mode or the current
user instruction.

## Higgsfield production route

For MyScoutee Higgsfield / Cinema Studio work, including continuation in a new
Codex session, first read the
[Higgsfield skill](.agents/skills/myscoutee-higgsfield/SKILL.md), which points to
the separate [Higgsfield trust guide](.agents/trust/higgsfield/README.md).
Use that guide for production continuity and recovered conversation decisions.
This does not activate application manual QA or its handoff/checklist.

## Optional manual-QA continuation route

Treat manual-QA continuation as an opt-in repository workflow skill, not as
default context for ordinary engineering tasks. Activate it only when the user
explicitly asks to continue/resume the manual QA campaign (for example,
`continue the QA campaign`), even if the request arrives months after the
previous session.

When this route is active, read
[`guides/qa/handoffs/CURRENT_QA_SESSION.md`](guides/qa/handoffs/CURRENT_QA_SESSION.md)
first. Treat its resume block as the sole current checkpoint pointer and load
only the detailed checkpoint document it links. Do not preload the full QA
pack or reconstruct already-proven checkpoints from conversation history. If
the saved runtime boundary may be stale, use the handoff's read-only resume
gate before any fixture mutation, browser relaunch or replay.

While the campaign is active, keep the handoff's reusable methodology and live
resume pointer current, and keep transactional checkpoint evidence/status in
the QA pack and CSV/XLSX ledger named by that handoff. This preserves a
future-session entry point without turning the handoff into a backup of those
authoritative evidence files.
