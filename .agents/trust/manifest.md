# MyScoutee trust manifest

Status: project-local protocol, version 0.1  
Authority: subordinate to the current user request and system instructions;
authoritative over agent defaults and repository frequency.

## Purpose

This library is MyScoutee's continuity supervisor and mandatory habit loop. It
makes an agent repeatedly recover the project's intended identity, boundaries,
known-good patterns, user working context, and previously learned failure modes
instead of reconstructing them from scratch.

It is not:

- a replacement for canonical product, protocol, security, or operations docs;
- a claim that the most frequent implementation in this AI-heavy codebase is
  the correct one;
- a checklist that can be satisfied with unsupported yes/no answers;
- authorization to expand the user's requested scope.

## Mandatory workflow

### 1. Establish current state

Before planning an edit:

1. Inspect `git status --short` in the parent repository.
2. Inspect `git -C frontend status --short` when the submodule is present.
3. Identify active services or commands only when relevant; do not start a
   duplicate stack merely to discover that one already exists.
4. Restate internally the current task, queued additions, explicit exclusions,
   and required verification.

Load [habits/worktree-and-scope.md](habits/worktree-and-scope.md).

### 2. Classify and route

Use [routing.md](routing.md). Load every review selected by the touched
behavior, not merely by filename. A frontend edit that changes a Java wire DTO
is also a backend and contract task; a seed edit that affects packaged Explore
is also an environment and packaging task.

### 3. Recover intent before editing

Read the relevant canonical sources from [sources.md](sources.md), then find:

- the current implementation;
- its tests and fixtures;
- at least one approved or candidate reference from
  [patterns/catalog.md](patterns/catalog.md);
- relevant Git history, including evidence that a removed behavior may have
  been intentionally removed.

For a bug, record the observed behavior, expected behavior, reproducing
environment, and smallest proven failing boundary. Load
[habits/diagnosis-before-change.md](habits/diagnosis-before-change.md).

### 4. Declare the behavior delta

Before the first behavior-affecting edit, be able to state:

```text
Current behavior:
Required behavior:
Smallest owning layer:
Files expected to change:
Explicit non-goals:
Evidence that this is the root cause:
```

If these cannot be answered, continue diagnosis. Do not compensate in a more
convenient layer.

### 5. Implement narrowly

Apply [habits/change-discipline.md](habits/change-discipline.md). Preserve the
current task ledger. Do not refactor adjacent code, add compatibility fallbacks,
materialize new state, or rewrite fixtures unless the task and evidence require
it. Run [habits/efficiency-scan.md](habits/efficiency-scan.md) on every changed
loop, batch, query/projection, bootstrap, and multi-step workflow.

### 6. Verify the real contract

Use the routed review cards and [evidence-model.md](evidence-model.md). Prefer a
focused proof first, then broaden in proportion to the blast radius. Verify
save/reload, mutation/read, restart/retry, local/HTTP, or build/artifact parity
when those are part of the behavior—not just the easiest in-memory path.

### 7. Complete and learn

Run [reviews/completion.md](reviews/completion.md). Report exact tests, failures,
untested boundaries, and remaining risks. If the user had to correct a repeated
agent behavior, create or update a learning candidate using
[templates/learning-candidate.md](templates/learning-candidate.md); do not
silently turn a one-off preference into a permanent rule.

## Loading budget

Always read:

- this manifest;
- [constitution.md](constitution.md);
- [routing.md](routing.md);
- [learnings/working-context.md](learnings/working-context.md);
- [learnings/accepted.md](learnings/accepted.md);
- [habits/worktree-and-scope.md](habits/worktree-and-scope.md);
- [habits/efficiency-scan.md](habits/efficiency-scan.md);
- [reviews/completion.md](reviews/completion.md).

Read other files only when routed. This progressive loading is intentional: a
trust system that exhausts the context window will eventually be skipped.

## Rule precedence inside this library

1. Current explicit user instruction.
2. Canonical project/trust/operations document.
3. Accepted invariant in `constitution.md`.
4. Accepted learning.
5. Approved reference pattern.
6. Candidate reference or candidate learning.
7. Repository frequency and historical code.

If two higher-level sources conflict, stop the affected decision, name the
conflict, and avoid an irreversible or behavior-changing guess.
