# GROUP-LIFECYCLE-001 — 2026-09-26 execution

Status: **NOT RUN**. Dev HTTP baseline for block **1/25** verified; no manual
checklist action or UI PASS is claimed. Local mode remains NOT RUN.

## Retained baseline and resume gate

The previous managed startup was interrupted by the reported location defect.
The reverted launcher configuration was restored in the existing launcher;
no alternative seed catalogue or browser runner was added.

The versioned command is read-only:

```sh
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh status community-group GROUP-LIFECYCLE-001
```

It verifies the retained `community-group` snapshot: ten groups and 27 community
memberships remain identical, and all three actors have eligible stored points.
The old marker's `permittedBlocks: [1,2]` referred to two list steps, which now
both belong to numbered block **1**. It does **not** prepare group creation in
block 2. Before mutation blocks, extend the existing fixture with exact snapshots
for their writes; do not restore this old snapshot over new user actions.

Actors: Alex Turner (owner control), Nagy Eszter (member/other owner), Maya Stone
(pending/other owner). Closed Calendar and Affiliate checkpoints remain closed.
The existing dev watchers own builds. No seed replacement or stack restart was
performed for this resume.

## Reported location popup

Read-only inspection of Maya's reported window found `/game`, a public member
with stored coordinates `47.5111, 19.0354`, and Setup open in settings mode:
`loggedIn=true`, `locationMissing=false`, no pending login completion or location
validation callback. This does not establish which earlier action opened it.
Current source routes automatic Setup requests through entry; background location
rejection does not open it. The user rule is explicit: discard unsupported new
coordinates, retain the last accepted point, and never automatically open Setup
or terminate a session for that update. This is recorded in block 20; the complete
manual regression remains NOT RUN. User-invoked Settings remains available.

## First manual block

In Alex's Groups list, compare these controls without writing data:

- Hosting: Seattle Friends, Design Circle.
- Participation: Photo Walks, Study Buddies (accepted), Makers Network
  (pending join), Game Night (pending invitation).
- Explore: the own and interacted groups above must be absent. Seattle Trail
  Club and Seattle Neighbours are public unrelated controls. Apply the existing
  visibility rules to private/invitation-only groups; no new rule is inferred.
- Check category filters, selected-menu tint, icon/card colors and pending badges.

Do not click Create/Join/Approve/Leave during this read-only block.

## Numbered block progress

| Block | Stable checklist section | Dev HTTP | Local |
| --- | --- | --- | --- |
| 1/25 | Group lists and category colors | NOT RUN | NOT RUN |
| 2/25 | Create and reopen a group | NOT RUN | NOT RUN |
| 3/25 | Group rules and draft persistence | NOT RUN | NOT RUN |
| 4/25 | Join requests and member decisions | NOT RUN | NOT RUN |
| 5/25 | Workspace selection and profile loading | NOT RUN | NOT RUN |
| 6/25 | App moderation, group moderation and support | NOT RUN | NOT RUN |
| 7/25 | Leave and remove membership | NOT RUN | NOT RUN |
| 8/25 | External sharing links and admission | NOT RUN | NOT RUN |
| 9/25 | Chat sharing basket and message changes | NOT RUN | NOT RUN |
| 10/25 | Cash history and affiliate exclusion | NOT RUN | NOT RUN |
| 11/25 | Contacts and the existing chat popup | NOT RUN | NOT RUN |
| 12/25 | Selection limits and contact-request controls | NOT RUN | NOT RUN |
| 13/25 | Empty calendar export | NOT RUN | NOT RUN |
| 14/25 | Birthday, horoscope and children fields | NOT RUN | NOT RUN |
| 15/25 | Landing social heading | NOT RUN | NOT RUN |
| 16/25 | Setup permission help | NOT RUN | NOT RUN |
| 17/25 | Common help seed and AI integration | NOT RUN | NOT RUN |
| 18/25 | Back and close-button history | NOT RUN | NOT RUN |
| 19/25 | First location save and Firebase sign-in | NOT RUN | NOT RUN |
| 20/25 | Stored location and optional tracking | NOT RUN | NOT RUN |
| 21/25 | Mobile sheet close buttons | NOT RUN | NOT RUN |
| 22/25 | Account-owned tools and Asset Explore | NOT RUN | NOT RUN |
| 23/25 | Profile scope and asset payment history | NOT RUN | NOT RUN |
| 24/25 | Account contacts and event-linked assets | NOT RUN | NOT RUN |
| 25/25 | Global notifications and scoped API keys | NOT RUN | NOT RUN |


## Setup popup defect follow-up

The popup reappeared during standardized startup despite valid stored actor
coordinates. Source tracing found an independent trigger in AppSetupPopupComponent:
`installPromptVisible` opened Setup whenever no other popup covered it. It had
no session guard. This supersedes the earlier incomplete diagnosis based only
on the open store state; no user settings click is inferred.

Added a session guard at that existing automatic-offer boundary, using session
identity even before the profile loads. Explicit Settings and entry permission
requests remain available. Four focused tests pass (demo/Firebase/operator
sessions and signed-out automatic offer); the separate existing help-rendering
test was not run in that focused command. Existing frontend watcher rebuilt and
published successfully. The first focused runner attempt failed before loading
tests because its temporary setup file was outside the Vite root; the rerun used
a removed-after-run setup file in the project root. No duplicate Angular build.

Initial resume startup completed for all three actors, but this popup defect
interrupted the handoff; that startup does not prove the fix. Group block 1 and
the complete entry regressions remain NOT RUN. Block 19.1 and API blocks 2–3 now
explicitly require real entry UI; closed PASS rows remain unchanged.
