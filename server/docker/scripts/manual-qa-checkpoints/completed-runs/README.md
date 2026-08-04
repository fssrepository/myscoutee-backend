# Completed manual runbooks

These human-executable QA scripts reconstruct the manual Statistics work
completed on 2026-08-04. Each script records purpose, preconditions/isolation,
ordered checkpoints, pass criteria, cleanup, evidence, and a reusable operator
prompt.
They were written retrospectively from preserved screenshots, API snapshots,
fixture oracles, and the living QA matrix. Creating these files did **not**
rerun the scenarios or mutate the demo database.

| Runbook | Historical result | Current action |
| --- | --- | --- |
| [BASE-STAT](BASE-STAT.md) | Manual UI PASS | Documented only; not rerun |
| [STAT-010 rating](STAT-010-RATING.md) | Statistics/bell/manual functional PASS; Monitoring/Graph partial | Documented only; not rerun |
| [STAT-011 chat](STAT-011-CHAT.md) | Manual UI + functional PASS | Documented only; not rerun |
| [STAT-020 graph timeline](STAT-020-GRAPH-TIMELINE.md) | Defect fixed; runtime + Statistics UI PASS; Affinity Graph comparison pending | Documented only; not rerun |
| [STAT-012 auto-inviter](STAT-012-AUTO-INVITER.md) | Manual UI + functional PASS; cleanup verified | Executed with the real scheduler on 2026-08-04 |

Every future execution must create a new dated evidence entry. It must not erase
or silently replace the historical result recorded here.

The scripts were normalized after the run; that documentation work is not a
new execution. No database staging, scheduler timing change, browser action, or
automated fixture was performed to produce these files.
