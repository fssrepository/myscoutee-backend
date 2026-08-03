# MyScoutee agent instructions

These instructions apply to the backend repository, its `frontend` submodule,
the deployment and packaging code, and work that crosses into the sibling
`myscoutee-registry` repository.

For every code, configuration, seed, test, packaging, operational, or
architecture-documentation change, apply the repository trust protocol:

1. Read [`.agents/trust/manifest.md`](.agents/trust/manifest.md).
2. Classify the task with [`.agents/trust/routing.md`](.agents/trust/routing.md).
3. Load the required review and habit cards before editing.
4. Identify the current behavior and at least one relevant approved reference
   or canonical source before creating or changing an implementation.
5. Complete the evidence review before reporting the task as finished.

The trust library is part of the project and is versioned with the code.
This protocol is mandatory and does not depend on an optional skill trigger. A
skill or harness may automate routing and evidence capture, but it cannot
replace, bypass, or override the repository habits.

The highest-priority behavioral rules are:

- Preserve user work in both the parent repository and the `frontend`
  submodule.
- Do not introduce fallbacks, repair-on-read/write behavior, silent behavior
  changes, or broad refactors while diagnosing a focused failure.
- Treat test, fixture, seed, environment, and harness defects as distinct from
  production-code defects. A failing test alone does not authorize a product
  behavior change.
- Never resurrect behavior from Git history merely because it used to exist.
  History is evidence to inspect, not authority to restore.
- Before accepting a loop, batch, bootstrap, projection, or multi-step flow,
  run the efficiency habit: look for database/IndexedDB/HTTP/filesystem calls
  inside iteration, repeated reads of the same state, and work that can be
  batched or passed in memory without weakening correctness.
- Respect explicit stop, no-edit, no-build, no-restart, and undo instructions
  immediately.
