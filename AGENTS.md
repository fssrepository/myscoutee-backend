# MyScoutee agent instructions

These instructions cover this repository, its `frontend` submodule, and work
that crosses into the sibling `myscoutee-registry` repository.

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

## QA session continuity

When resuming the active manual QA campaign, read
[`guides/qa/handoffs/CURRENT_QA_SESSION.md`](guides/qa/handoffs/CURRENT_QA_SESSION.md)
first. Treat its resume block as the current checkpoint and load only the
detailed document it links. Do not preload the full QA pack or reconstruct
already-proven checkpoints from conversation history.
