# Habit: respect the existing runtime and test the intended environment

## Trigger

Before starting, stopping, rebuilding, restarting, stress-testing, or launching
a browser/server/container.

## Runtime preflight

1. Determine whether the user already has a dev/E2E/production-like stack
   running.
2. Inspect its health and configuration before starting another instance.
3. Identify which database/profile/frontend configuration it actually uses.
4. Respect explicit instructions such as no build, no restart, no Chrome, or
   use the running stack.
5. Estimate whether the command is CPU-, memory-, disk-, network-, or
   state-destructive before launching it.

## Test selection

- Start with the smallest test that reproduces the changed contract.
- Do not change product code merely because a broad suite has unrelated or
  pre-existing failures.
- Rerun the focused test after the edit.
- Broaden to the owning suite, then cross-layer/E2E only when risk requires it.
- Use production-like optimized frontend output for render/bundle performance;
  use debuggable builds for diagnosis and state the overhead.
- Stress tests require an explicit representative profile and baseline. Do not
  universalize one throughput number.

## Process hygiene

- Do not leave duplicate servers, builds, Chrome processes, or test runners.
- Do not stop a user-owned process unless explicitly requested or necessary to
  complete an authorized workflow; identify the exact process first.
- If the user interrupts or says stop, stop issuing new actions and terminate
  only agent-started work when safe.
- Report long-running commands, environment, and final process state.

## Evidence questions

1. Did the command test the code/configuration just changed?
2. Did it use the intended database and data source?
3. Did it mutate state, and was that state disposable?
4. Does passing prove the user-visible flow or only a component?
5. Are failures new, relevant, and reproducible?

