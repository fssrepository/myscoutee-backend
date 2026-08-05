# MyScoutee agent instructions

These instructions cover this repository, its `frontend` submodule, and work
that crosses into the sibling `myscoutee-registry` repository.

## CRITICAL LOCAL RESOURCE RULE

**HA A DEV STACK MÁR FUT, ÉS A HOT-DEPLOY/WATCHER MAGA VÉGZI A FORDÍTÁST VAGY BUILD-ET, AKKOR KAPACITÁSTÓL FÜGGETLENÜL AZT KELL TRIGGERELNI ÉS ANNAK A LOGJÁT KELL ELLENŐRIZNI. ILYENKOR TILOS UGYANAZT A FORDÍTÁST KÜLÖN `NPM`, `NG TEST`, VITEST, GRADLE, JAVA BUILD, WATCHER, TESZT- VAGY SZERVERFOLYAMATTAL MEGISMÉTELNI. KÜLÖN FÓKUSZÁLT BUILD VAGY TESZT CSAK AKKOR FUTTATHATÓ, HA AZT A FUTÓ DEV PIPELINE NEM VÉGZI EL, A GÉP KAPACITÁSA ELŐTTE ELLENŐRZÖTT, ÉS NINCS FELHASZNÁLÓI TILTÁS.**

**CACHE LOCK ESETÉN ELŐSZÖR AZONOSÍTSD A LOCKOT BIRTOKLÓ MEGLÉVŐ FOLYAMATOT. HA A FUTÓ DEV STACK A FORDÍTÁS/BUILD TULAJDONOSA, TILOS ÚJ CACHE-T, ÚJ `GRADLE_USER_HOME`-OT, `/TMP` KERÜLŐUTAT VAGY MÁSODIK FOLYAMATOT INDÍTANI; KIZÁRÓLAG A LOCK TULAJDONOSÁT INDÍTSD ÚJRA. HA A TULAJDONOS VAGY AZ ÚJRAINDÍTÁS HATÁSA NEM EGYÉRTELMŰ, ÁLLJ MEG ÉS KÉRJ IRÁNYMUTATÁST.**

**A FUTÓ DEV HOT-DEPLOY FORDÍTÁSI/BUILD-ELLENŐRZÉSÉT A MEGFELELŐ FORRÁSFÁJL SZŰK MÓDOSÍTÁSÁVAL VAGY A PROJEKT SAJÁT TRIGGERÉVEL INDÍTSD EL, MAJD A MEGLÉVŐ BACKEND- VAGY FRONTEND-FOLYAMAT LOGJÁT OLVASD. HA A HOT-DEPLOY HIBÁS VAGY BERAGADT, A LOCKOT/FOLYAMATOT AZONOSÍTSD, ÉS CSAK AZT AZ EGY MEGLÉVŐ CÉLFOLYAMATOT INDÍTSD ÚJRA.**

**HA EGY MÓDOSÍTÁS MIATT A MEGLÉVŐ TULAJDONOS-FOLYAMATOT LE KELL ÁLLÍTANI, ELŐBB AZT AZ EGY FOLYAMATOT ÁLLÍTSD LE, MAJD UGYANAZT INDÍTSD ÚJRA. SOHA NE INDÍTSD EL AZ UTÓDJÁT A RÉGI MELLÉ.**

**A VERZIÓZOTT MANUÁLIS QA CHECKPOINT HARNESST A MÁR FUTÓ MONGODB KONTÉNERHEZ SZÜKSÉGES DOCKER-HOZZÁFÉRÉSSEL KELL ELSŐRE MEGHÍVNI. A SANDBOXOLT FUTÁS DOCKER SOCKET JOGOSULTSÁGHIBA MIATT HAMISAN AZT IS ÍRHATJA, HOGY `MONGO CONTAINER 'MONGODB' IS NOT ALREADY RUNNING`; EZ NEM BIZONYÍTJA, HOGY A KONTÉNER ÁLL. ILYENKOR UGYANAZT A HARNESS PARANCSOT FUTTASD ÚJRA DOCKER-HOZZÁFÉRÉSSEL, ÉS ELLENŐRIZD A MÁR FUTÓ KONTÉNERT. EMIATT TILOS MONGODB-T, SZERVERT, WATCHERT VAGY COMPOSE STACKET INDÍTANI, ÚJRAÉPÍTENI VAGY DUPLIKÁLNI.**

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
