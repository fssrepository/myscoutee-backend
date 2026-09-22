# EVENT-ACTIVITY-RATING-001 — two-person activity rating

This is a manual Event-domain comparison of Standard, Tournament and Speed
meeting rating sources. Execution evidence belongs in the dated progress log,
not in this reusable checklist. The tester controls both browser windows.

## Actors and fixture boundary

| Window | Profile | Fixture user ID |
| --- | --- | --- |
| Left | Casey Rating QA | `6a00000000000000000000a1` |
| Right | Nova Rating QA | `6a00000000000000000000a2` |

The profiles are isolated from the original Casey/Nova demo users. Both are
accepted participants, including Casey as organizer, in these events:

| Title | Event ID | Prepared history |
| --- | --- | --- |
| QA RATING · Standard | `qa-rating-001-standard` | Ended event with two accepted members |
| QA RATING · Tournament | `qa-rating-001-tournament` | Ended event and finalized stage |
| QA RATING · Speed meeting | `qa-rating-001-speed-meeting` | Completed session, two completed rounds, same pair at Table 1 |

The fixture supplies membership and completed history. It does not exercise
Tournament scoring/group generation or real-time Speed meeting transitions;
those belong to EVENT-MODE-REGRESSION-001. No rating, Met row, friendship or
submitted feedback is seeded. The existing event-counter-expiry worker projects
Met from that history. Its schedule is temporarily shortened to ten seconds and
restored by `ready` or `reset`.

There is one shared rating relationship for the same two people, even when
three events contribute meeting evidence. Expect one counterpart, not three
independent score cards. The last processed event supplies the displayed event
context; use the isolated format variants below to compare each source.

## Numbered manual sequence

1. Verify the prepared windows identify Casey Rating QA and Nova Rating QA.
   Open Activities → Rates → Met in each. If a retained filter hides the card,
   clear the filter through the normal UI. Record the filter and visible counts.
2. Confirm each sees the other once, with zero given/received scores. Record
   the event caption. The fixture `status` must show exactly one Met row, 0/0,
   no friendship and no submitted feedback before the first rating.
3. In Casey's counterpart card, open the normal rating action, select **8**,
   and press **Save once**. Selection alone is not submission. Allow the normal
   rating sync cycle to finish; do not repeatedly submit to force synchronization.
4. Inspect Casey's Given and Nova's Received buckets, including their counters.
   Reopen the card and check Casey's given score and Nova's received score are
   both 8. Capture the actual bucket membership, then request a fixture `status`
   read to verify one shared row with 8/0 in Casey's orientation.
5. In Nova's counterpart card, give Casey **6** and save once. After sync,
   inspect Met, Given, Received and Mutual in both windows. Reopen the card:
   Casey's perspective is given 8 / received 6; Nova's is given 6 / received 8.
   There must still be one relationship, with no duplicated counterpart.
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

## Bucket comparison reference

This table describes the current service mapping to inspect, not a replacement
for the user's agreed acceptance rules. Any discrepancy with those rules must
be reported and resolved rather than silently marking the test PASS.

| Casey gives | Nova gives | Casey bucket | Nova bucket |
| --- | --- | --- | --- |
| 0 | 0 | Met | Met |
| 8 | 0 | Given | Received |
| 8 | 6 | Met | Met |

The Met flag remains on the same record throughout. A relationship with meeting
evidence and two positive ratings is currently mapped to Met, not Mutual.
The normal frontend batch can take one 30-second cycle. Persisted verification
must distinguish a pending local edit from a completed server write.

## Reproducible fixture commands

Run from the repository root against the already-running development MongoDB.
`stage`, `ready`, `reset` and browser startup mutate only their documented scope;
`status` reads it. Do not start another stack or compiler.

```bash
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh stage event-rating EVENT-ACTIVITY-RATING-001 all
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh status event-rating EVENT-ACTIVITY-RATING-001
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh ready event-rating EVENT-ACTIVITY-RATING-001
node guides/qa/tools/open-checkpoint-browser-sessions.mjs EVENT-ACTIVITY-RATING-001
```

`ready` refuses to proceed until the real worker has produced the zero-score
Met baseline and the relevant source projection flags. If not ready, inspect
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

Then stage again using `all`, `standard`, `tournament` or `speed-meeting`, run
`ready`, and launch. Reset/restage is the supported baseline replay. The stored
baseline snapshot is evidence; there is no separate rollback-to-baseline command.
