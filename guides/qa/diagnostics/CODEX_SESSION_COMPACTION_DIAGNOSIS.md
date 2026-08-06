# Codex session compaction and latency diagnosis

Status: working-method correction applied; product runtime is not implicated
Last updated: 2026-08-05

## Observed symptom

During the event publish/chat QA chain, useful work was repeatedly interrupted
by context compaction. The visible cadence felt time-based, roughly every few
minutes, but compaction is driven primarily by accumulated context size rather
than a five-minute application timer.

This is separate from the laptop's high RAM and swap usage. Duplicate builds,
test processes or large dev watchers can slow commands and the machine, while a
large conversation, screenshots and command output force model-context
compaction. Either can increase response time, but one does not prove the other.

## Why this session became slow

1. The session retained a long cross-layer history: event lifecycle, chat,
   notifications, counters, polling, local/HTTP parity, fixtures, QA documents
   and build behavior.
2. Many high-resolution screenshots and repeated checkpoint corrections stayed
   relevant to the same conversation.
3. Earlier investigation commands returned broad repository searches and long
   file excerpts. That diagnostic output also consumes working context.
4. The active contract was not pinned early enough in one short authoritative
   handoff. After compaction, details had to be rediscovered from code, Git and
   prior evidence.
5. Incorrect assumptions produced correction loops. Each loop added more text
   while leaving the original context in place.
6. Broad build/test attempts were sometimes disproportionate to the changed
   boundary and also competed with the already-running hot-deploy stack for
   laptop resources.

The dominant avoidable cause was therefore workflow expansion: too many active
contracts and too much repeated evidence in one session. It was not the
complexity of the latest question alone.

## Corrected working method

For the remaining QA work I must use this bounded loop:

1. Pin one checkpoint in a short handoff containing only: required behavior,
   current state, next user action, oracle, changed files and explicit
   prohibitions.
2. Keep one product boundary active at a time. Queue unrelated observations
   instead of investigating them immediately.
3. Search narrowly by symbol and path. Cap command output and never dump an
   entire large file when a focused range answers the question.
4. Inspect the current diff before editing. Do not reconstruct intended state
   from conversation memory when Git or a fixture oracle can answer it.
5. Use the running dev/hot-deploy stack. Do not start another server or watcher.
   Run only the smallest focused test that proves the changed contract.
6. Report only the outcome, exact evidence and next checkpoint. Do not repeat
   the history already stored in the handoff.
7. When a checkpoint closes, update its durable QA record and start the next
   checkpoint from that record rather than carrying every screenshot forward.

## Session-level regression check

For each subsequent checkpoint, record these values in its handoff:

| Check | Pass condition |
| --- | --- |
| Active contract | One named checkpoint and one next user action |
| Scope | No unrelated production boundary edited |
| Runtime | No new server, watcher or duplicate stack process |
| Search output | Focused paths/symbols; no unbounded repository dump |
| Test ladder | Focused test first; broad suite only when the blast radius requires it |
| Handoff | Enough state to resume without rereading the full conversation |
| Final report | Changed files, passed/not-run proof and remaining gap only |

This check cannot guarantee that the platform will never compact context. It
does prevent compaction from forcing a broad rediscovery loop and keeps host
resource usage separate from model-context pressure.
