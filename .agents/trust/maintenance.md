# Maintaining the trust library

## Change categories

- `accepted invariant`: stable project identity or boundary backed by a
  canonical source or repeated explicit decision.
- `approved pattern`: a concrete implementation approved as a responsibility
  reference; not necessarily a copy template.
- `candidate`: plausible learning or reference awaiting real-task validation.
- `rejected pattern`: a demonstrated failure mode that should trigger review.
- `historical note`: context only; never a rule by itself.

## Promotion rules

Promote a candidate when at least one is true:

- it is directly backed by a canonical architecture/trust/operations source;
- the user explicitly establishes it as a durable rule;
- the same correction recurs in independent tasks and the generalized wording
  survives review;
- a severe security, privacy, data-loss, or trust-boundary failure justifies an
  immediate guardrail.

Do not promote:

- a workaround tied to one broken environment;
- a preference inferred only from one ambiguous comment;
- a rule that merely describes the most frequent code shape;
- raw emotional language or private conversation content.

## Editing discipline

- Keep canonical project detail in its owning document and link to it here.
- Write questions that demand evidence, not slogans or yes/no confirmation.
- Include triggers and exceptions so cards do not run on every task.
- Merge duplicate rules and delete obsolete ones; more text does not create
  more trust.
- Keep `kernel.md` compact. Details belong in routed cards; do not duplicate a
  full checklist in `AGENTS.md`, the kernel, and a review card.
- A `standard` task should normally load the kernel plus one to three routed
  cards. If a rule is not broadly useful, do not add it to the kernel.
- When a code reference moves, update the catalog in the same change.
- Run `bash tools/validate-trust-library.sh` after library changes.

## Performance and local modes

- The repository default is `standard`; no committed mode-state file is
  required.
- `.trust-mode.local` is a gitignored machine-local override. Valid
  values are `off`, `light`, `standard`, and `deep`.
- Use `tools/trust-mode.sh off` to disable trust loading locally and
  `tools/trust-mode.sh default` to restore the repository default.
- A current explicit user instruction overrides the local file for that task.
- `off` disables this project library only. It cannot disable system/developer
  instructions or broaden the user's authorization.

## Review cadence

After five to ten real tasks, review:

- which cards prevented an error;
- which questions were skipped or rubber-stamped;
- which routing loaded irrelevant context;
- which user correction was not captured;
- which accepted rule conflicts with current code or docs;
- whether any candidate is ready to promote or reject.
