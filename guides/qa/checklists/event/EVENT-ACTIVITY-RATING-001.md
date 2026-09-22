# EVENT-ACTIVITY-RATING-001 — two-person activity rating

This is a manual Event-domain comparison of Standard, Tournament and Speed
meeting rating sources. Execution evidence belongs in the dated progress log,
not in this reusable checklist. The tester controls both browser windows.

## Actors and fixture boundary

| Window | Profile | Fixture user ID |
| --- | --- | --- |
| Left | Casey Rating QA | `6a00000000000000000000a1` |
| Right | Nova Rating QA | `6a00000000000000000000a2` |

The profiles are isolated from the original Casey/Nova demo users.

The `before-meeting` variant creates **no events, memberships or completed
rounds**. Only Casey has rated Nova: **9/0**, `met:false`, no friendship.
The tester first inspects all bucket lists, then may reciprocate from Nova.
Without a meeting, reciprocal ratings belong to **Mutual**, not Met. Later
automatic event/room creation is outside this prepared checkpoint and is not
claimed as verified. No worker timing is changed for this variant.

In the optional event-history variants, both are
accepted participants, including Casey as organizer, in these events:

| Title | Event ID | Prepared history |
| --- | --- | --- |
| QA RATING · Standard | `qa-rating-001-standard` | Ended event with two accepted members |
| QA RATING · Tournament | `qa-rating-001-tournament` | Ended event and finalized stage |
| QA RATING · Speed meeting | `qa-rating-001-speed-meeting` | Completed session, two completed rounds, same pair at Table 1 |

The fixture supplies membership and completed history. It does not exercise
Tournament scoring/group generation or real-time Speed meeting transitions;
those belong to EVENT-MODE-REGRESSION-001. For Standard/Tournament (and `all`), a pre-existing **9/0** one-sided rate is
seeded as a prerequisite with `met: false`, an earlier creation date and a fixed
record identity. Speed meeting starts without a rate. Neither variant seeds a
Met result, friendship or submitted feedback. The existing event-counter-expiry
worker must add Met while preserving prior scores/identity, or create the new
0/0 row when there was no prior rate. Its schedule is temporarily shortened to ten seconds and
restored by `ready` or `reset`.

There is one shared rating relationship for the same two people, even when
three events contribute meeting evidence. Expect one counterpart, not three
independent score cards. The last processed event supplies the displayed event
context; use the isolated format variants below to compare each source.

## Numbered manual sequence

1. Verify the prepared windows identify Casey Rating QA and Nova Rating QA.
   Open Activities → Rates. **Before saving any rating**, inspect every bucket
   and its counter in both windows: All, Given, Received, Mutual and Met.
   Record the existing filters; clear them normally if they hide the counterpart.
2. In `before-meeting` and Standard/Tournament, only Casey has rated: **Casey gives 9; Nova has
   not rated (0)**. Casey's counterpart should be in Given, Nova's in Received.
   Inspect All, Mutual and Met too, before changing anything. There is one
   shared relationship and no friendship. Compare `priorRate` with the projected
   row: same ID, sync key, creation date, users and9/0 scores. In `before-meeting`,
   Met remains false and there are no events. Only the event-history variants
   add meeting evidence through the worker. Do not confuse the stored Met flag
   with the bucket chosen for a one-sided rating.
3. For Speed meeting's separate no-prior-rate variant, first inspect the0/0
   counterpart in Met. Only then give9 from Casey and save once. Wait for the
   ordinary sync cycle and inspect all buckets again: Given for Casey, Received
   for Nova. Skip this first save for all pre-existing-rate variants, which already start9/0.
4. Keep Nova unrated while exploring the one-sided bucket lists. Reopen cards,
   inspect scores and counters, and reload if desired. No automatic action may
   submit Nova's rating or advance past this observation point.
5. **When the tester finishes that inspection**, they may give Casey6 from
   Nova and save once. After sync, inspect all buckets again. Expected views:
   Casey given9 / received6; Nova given6 / received9. The single shared
   relationship moves to **Mutual when no meeting has occurred**, or Met in
   the completed-event variants. Inspect the full bucket list, not just the target
   bucket. Do not submit this reciprocal rating automatically.
6. Change Casey's score to **4**, save, then change Nova's to **9** and save.
   Reopen both cards after sync and then reload normally. Check the saved
   perspectives are 4/9 and 9/4. Further free rating changes may now be made;
   record the chosen numbers before comparing persisted state.
7. Inspect Friends and the event feedback entry independently. A rating save
   must not fabricate a submitted event feedback answer. Record the friendship
   outcome after reciprocal positive ratings. Do not infer a friendship-removal
   rule from subsequently lowering a score; that is outside this checklist.
8. For Speed meeting feedback, open the normal event-level feedback entry.
   The same co-participant from two rounds must appear once, within the single
   event feedback flow. Do not expect a separate wizard for each table. Leave
   it unsubmitted unless deliberately testing feedback; record any submission.
9. To isolate each event source, explicitly finish the current exploration,
   request reset/restage with `standard`, `tournament`, then `speed-meeting`,
   and repeat steps 1–6. Only the selected source is ended in each variant;
   other events remain future prerequisites. Record each run separately.
10. When finished, request scoped cleanup using the commands below. Preserve
    evidence before reset. Do not reset a live manual exploration automatically.

## Side-menu badge baseline

The Rates side-menu badge retains its existing **total rate-list item count**
meaning. It is not a Received-only attention counter. This two-person fixture
has one shared visible rate per viewer, so `activities.game` is **1 for both**,
including after reciprocity moves the item to Mutual. Bucket badges retain their
own list totals. Stage initializes the counter for a pre-existing rate; ready
sets it after verifying a real projected meeting row in event-history variants.

For an already-active fixture with missing counters, repair only these two
profiles without resetting ratings or browser sessions:

```bash
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh repair-rate-counters event-rating EVENT-ACTIVITY-RATING-001
```

## Bucket comparison reference

This table describes the current service mapping to inspect, not a replacement
for the user's agreed acceptance rules. Any discrepancy with those rules must
be reported and resolved rather than silently marking the test PASS.

| Meeting evidence | Casey gives | Nova gives | Casey bucket | Nova bucket |
| --- | --- | --- | --- | --- |
| No | 9 | 0 | Given | Received |
| No | 9 | 6 | Mutual | Mutual |
| Yes | 0 | 0 | Met | Met |
| Yes | 9 | 0 | Given | Received |
| Yes | 9 | 6 | Met | Met |

The Met flag remains false in `before-meeting` and true in event-history variants. A relationship with meeting
evidence and two positive ratings is currently mapped to Met, not Mutual.
The normal frontend batch can take one 30-second cycle. Persisted verification
must distinguish a pending local edit from a completed server write.

## Reproducible fixture commands

Run from the repository root against the already-running development MongoDB.
`stage`, `ready`, `reset` and browser startup mutate only their documented scope;
`status` reads it. Do not start another stack or compiler.

```bash
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh stage event-rating EVENT-ACTIVITY-RATING-001 before-meeting
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh status event-rating EVENT-ACTIVITY-RATING-001
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh ready event-rating EVENT-ACTIVITY-RATING-001
node guides/qa/tools/open-checkpoint-browser-sessions.mjs EVENT-ACTIVITY-RATING-001
```

For `before-meeting`, `ready` checks one-sided9/0, Met=false, zero events and
zero friendships; it neither waits for nor changes a worker. For event variants,
`ready` refuses to proceed until the real worker has produced the relevant
source flags and Met result: preserved pre-existing identity/scores for
Standard/Tournament, or a new zero-score row for Speed meeting. If not ready, inspect
the existing worker and repeat the readiness check; do not seed its output.
After startup, the tester owns navigation, clicks, rating and form submission.

For an explicitly requested replay/cleanup, close only these managed sessions
and reset. Reset restores their common session snapshot and removes the reserved
fixture records and their scoped rating/notification/affinity state. Global
append-only operational telemetry is not rewound.

```bash
node guides/qa/tools/open-checkpoint-browser-sessions.mjs EVENT-ACTIVITY-RATING-001 --close-only
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh reset event-rating EVENT-ACTIVITY-RATING-001
```

Then stage again using `before-meeting`, `all`, `standard`, `tournament` or `speed-meeting`, run
`ready`, and launch. Reset/restage is the supported baseline replay. The stored
baseline snapshot is evidence; there is no separate rollback-to-baseline command.
