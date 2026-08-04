# Reproducible manual-QA prompt

## Original user requests

The following Hungarian requests define why this harness exists and are kept
verbatim so the workflow is reproducible:

> lenyeg az, hogy a scheduler utemezesen lehet modositani, igy lehet tesztelni
> a scheduler-t azt az adatbazisban atirod kb. es varjuk a csodat, de a tesztet
> ugy kell megismetelni hogy nekem idom legyen legalab egy screenshotra es igy
> a checkpointokrol tudok erdemi informaciot adni

> ne a fixture-t alakitsd at, hanem ez most manualis teszt a fixture-t meg
> automatan futtatod, ehez az 57 teszthez kulon ne nyulj, hanem keszits valamit
> manualisra es esetleg berakod valami alkonyvtarba hogy ezen egy QA rajtam
> fuggetlenul is at tud menni

> sot azt is rakd be hogy promtban mit kertem toled, hogy reprodukalhato legyen
> a munkafolyamat

> azert probaljuk ugy hogy eloszor minden ablakot kinyitok van 3 gmailes
> accountom igy a sessionok nem keverednek, igy csokkentheto az utemezesi ablak
> is

> es amugy ezt is leirhatod a tervbe, ha bvalaki reprodukalni szeretne

> azert ne 3 percet varjak mar ra

> ugye itt amit mi leellenoriztunk arra is keszits qa manual scriptet (amit a
> mostani folyamatban levo tesztre is csinalsz), hogy megismetelheto, legyen, de
> most kulon nem ismeteljuk meg

> na, akkor csinald meg, de ugye ezen most nem fogunk meg egyzser atmenni

> ugye itt az is kell, hogy esetleg lefuttat valamit, amivel csokenti a scheuler
> utemezeset is, tehat eloall valami amit utan kezdhet mar tesztelni

Related standing instructions from the same QA session:

- Always begin a manual step by explaining why it is performed and what is
  being tested.
- Use the already-running dev stack and its hot deploy; do not start a parallel
  backend, frontend, Gradle build, database, or scheduler.
- Exercise the real scheduler by changing persisted timing and waiting for its
  normal poll. Do not replace this with a manual hook or direct job endpoint.
- Test data may establish a controlled initial state, but baselines must be
  captured after staging and before the scheduler-created result.
- Preserve every checkpoint and record manual versus automated evidence in the
  QA plan/matrix.
- Open all observation windows first in three isolated Gmail/browser sessions,
  then use a short persisted schedule delay; the sessions must not share active
  users or cookies.

## Reusable prompt for another Codex or QA operator

```text
Continue the MyScoutee manual dynamic-surfaces QA with STAT-012.

Use server/docker/scripts/manual-qa-checkpoints only. Do not modify or execute
the admin-job-fixtures automated suite and do not start any additional dev
stack, frontend, backend, Gradle, Mongo, or scheduler process.

At every human action, first explain why the step is needed, what it tests, and
the exact expected visible result. Work through these checkpoints one at a
time, waiting for the human screenshot/confirmation before continuing:

1. Verify `status stat-012` is not-staged.
2. Run `stage stat-012`. Verify the baseline-ready database oracle has zero
   invite/marker/outbox/bell artifacts. Record the printed deterministic
   `expectedInvitee`; the stage has already materialized the test event in the
   Statistics event inventory baseline.
3. Ask the human to capture post-stage Statistics, Monitoring/All, and
   event-auto-inviter Admin Job baseline screenshots. Do not schedule yet.
4. Before scheduling, have the human open Monitoring, Statistics, Admin Job
   detail, and the `expectedInvitee` notification view across three isolated
   Gmail/browser sessions. After all baseline screenshots are confirmed, run
   `schedule stat-012 30`. Report the printed real scheduler run window and ask
   for the scheduled Admin Job checkpoint.
5. Wait for the existing scheduler; never call Run or a job endpoint. Poll only
   `status stat-012` until scheduler-completed.
6. Verify exactly one invitation, marker, outbox, and bell with identical seeded
   recipient, lastRunCount 1, and pendingCount 0.
7. Ask for post-run Monitoring, Statistics, Admin Job, and invited-user bell
   screenshots, one step at a time. Compare only against the post-stage
   baseline.
8. Record evidence and manual/automated status in the QA MD/CSV/XLSX without
   deleting existing rows or priorities.
9. Run `reset stat-012`, confirm not-staged, and report what was restored.

The already completed BASE-STAT, STAT-010, STAT-011, and STAT-020 cases must be
maintained as reproducible manual QA scripts under completed-runs, but do not
rerun them merely to create or improve their documentation.

Each completed-case script must also have a callable helper where applicable:
`stage` creates a controlled post-stage baseline, `schedule` shortens only the
persisted real scheduler window when that flow actually has a scheduler,
`status` provides independent machine oracles, and `reset` restores selected
temporary data/configuration. Never invent a scheduler for immediate chat or
frontend-batched rating paths; preserve their real periodic mechanism.

If a functional gap appears, retain the failed evidence, fix it with a focused
regression test where appropriate, verify the existing hot deploy compiled it,
and repeat only the affected manual checkpoint. Be explicit about which data
was staged directly and which result was created by the real scheduler.
```
