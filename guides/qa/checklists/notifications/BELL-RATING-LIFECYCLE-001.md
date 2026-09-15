# BELL-RATING-LIFECYCLE-001 user test guide

This single Notifications journey proves the rating/feedback producer, target
bell, read transition, Statistics delta and resulting affinity pair. It does
not repeat unrelated Event Feedback or generic Administration coverage.

This is a stable tester guide, not an execution log. Stop at the first mismatch
and report the step number.

## Actors and startup

- **Casey** gives the first rating and must not receive their own notification.
- **Nova** receives and reads Casey's rating, then gives the reciprocal rating.
- **Ava** checks Statistics, Monitoring and the Affinity Graph.
- Codex prepares one isolated Casey/Nova pair and later one isolated feedback
  branch. It snapshots and restores only their controlled rows and worker state.

To start, tell Codex:

`Prepare BELL-RATING-LIFECYCLE-001 at the rating baseline.`

For the rating sections, Codex reuses the versioned reciprocal-rating fixture:

```bash
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh stage graph-rating BELL-RATING-LIFECYCLE-001
node guides/qa/tools/open-checkpoint-browser-sessions.mjs BELL-RATING-LIFECYCLE-001
```

Read-only evidence: `python3 guides/qa/tools/bell-rating-oracle.py <label>`.
If the graph still shows an older materialized layout after both recompute
targets complete, use `schedule-layout graph-rating BELL-RATING-LIFECYCLE-001`
with the same Docker harness. It makes the existing scheduler rule due; its
original configuration and graph materializations are retained for reset.
Close the managed windows before
`reset graph-rating BELL-RATING-LIFECYCLE-001`; the common launcher/harness
restores retained sessions before the fixture restores the controlled documents.

The feedback section reuses the existing feedback fixture with a browser/session
rollback wrapper (the browser ID is a substage of this same testcase):

```bash
bash server/docker/scripts/admin-job-fixtures/admin-job-fixtures.sh prepare bell-rating-feedback feedback
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh stage bell-feedback BELL-RATING-FEEDBACK-001
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh prepare-rating-baseline bell-feedback BELL-RATING-FEEDBACK-001
# Wait for the normal worker's three baseline tasks to finish, then:
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh capture-rating-baseline bell-feedback BELL-RATING-FEEDBACK-001
node guides/qa/tools/open-checkpoint-browser-sessions.mjs BELL-RATING-FEEDBACK-001
```

The configured seed actors are Lucas Lane, Nagy Eszter, Maya Stone and Kiss
Balázs. Complete the three required cards, then submit once. The wrapper checks
the prepared identities before startup. The normal worker settles existing seed
rating projections before the feedback baseline is captured; the original
documents remain retained for reset. The oracle keeps submitted rating inputs
separate from the worker's calculated affinity/confidence fields. Use
`python3 guides/qa/tools/bell-feedback-oracle.py <label> [previous-label]` for
recipient/read isolation evidence. After submission and its immediate oracle,
use `make-recompute-due bell-feedback BELL-RATING-FEEDBACK-001` with the common
Docker harness: only this fixture's newly created pending tasks become due,
so the normal worker can process them without the five-minute debounce wait.
After observation, close the windows and
restore in this order:

```bash
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh verify-reset-ready bell-feedback BELL-RATING-FEEDBACK-001
node guides/qa/tools/open-checkpoint-browser-sessions.mjs BELL-RATING-FEEDBACK-001 --close-only
bash server/docker/scripts/admin-job-fixtures/admin-job-fixtures.sh reset bell-rating-feedback
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh reset bell-feedback BELL-RATING-FEEDBACK-001
```

Begin only after Codex confirms the printed Casey/Nova pair, zero target
notification delta, the starting Statistics values and the unchanged graph
control pair.

## 1. First rating, bell and read state

1. In **Nova**, open Notifications and record the visible New count. Leave the
   target row absent.
2. In **Casey**, open `Activities -> Rates`, select the **Preferences / Met** (Single)
   filter and find Nova's exact prepared card.
3. Open the card's `Rate` control and select **4**, but do not select `Save`.
   The editor shows 4 while Nova's bell and the card's persisted state remain
   unchanged. Report:

   `BELL-RATING-LIFECYCLE-001 score 4 selected, not saved`

4. After Codex confirms that selection produced no write, select `Save`
   exactly once. Nova's card remains under Met and now displays 4; it must not
   disappear or duplicate.
5. Allow up to 35 seconds for the normal frontend rating batch. Without
   reloading, Nova's notification counter increases by exactly one.
6. In Nova, open `Notifications -> New`. Exactly one new row is titled
   **New rating**, identifies Casey as sender and has the expected timestamp.
   Casey has no matching self-notification.
7. Use that one Nova row’s `⋮ -> Mark as read` action. It becomes read exactly once, leaves New, remains
   once in All, and Nova's counter returns to its recorded baseline. Marking
   it read must not alter either rating or create another notification.
8. Close and reopen Notifications once. The same row remains read in All and
   does not return to New. Report:

   `BELL-RATING-LIFECYCLE-001 first rating and read complete`

Codex now verifies one Casey-to-Nova rating, one logical target outbox, one
read Nova row with a stable first `readAt`, no Casey row and matching stored
counter projections.

## 2. Reciprocal rating, Statistics and affinity

9. In **Nova**, open Casey's prepared Preferences / Met (Single) card. Select **3** and
   then `Save` exactly once.
10. Allow the same normal batch window. Casey receives exactly one New rating
    row from Nova; Nova receives no self-notification. Use Casey's row’s `⋮ -> Mark as read` action once and
    confirm the same New-to-All read transition.
11. In **Ava**, open Statistics after Codex says the normal Statistics worker
    completed. Compared with the captured baseline:

    - today's Ratings is exactly `+2`;
    - Matching / Rates synced is exactly `+2`;
    - the recorded unrelated Events/assets, Communication and Moderation
      controls are unchanged.

12. In Ava, open `Monitoring -> Matching` and `Monitoring -> Notifications`.
    The two rating writes, target deliveries and recompute work agree; no
    unexplained failed item or extra delivery is present.
13. After Codex confirms both recompute targets are terminal, open Ava's
    Affinity Graph, select the Casey/Nova pair and use link depth **1**.
14. Confirm the same pair is visible once, `mutualSingleCount` is greater than
    zero and its displayed weight matches the post-recompute oracle. An edge
    may already have existed from Met evidence; the required result is the
    changed reciprocal pair, not necessarily a brand-new edge.
15. Confirm the prepared unrelated control pair and all older materialized
    timeline points remain unchanged. Report:

    `BELL-RATING-LIFECYCLE-001 reciprocal graph ready`

## 3. Feedback notification parity

16. Wait while Codex saves the rating/graph oracle, restores that fixture and
    prepares the separate `feedback` variation. Use only the printed actor,
    Event and eligible non-self targets.
17. In the printed actor window, open `Event Feedback -> Pending`, open the
    exact prepared Event and submit the prepared feedback once. Do not add an
    organizer note or repeat the broader Event Feedback lifecycle.
18. In each printed target window, confirm exactly one matching unread feedback
    notification. The submitting actor receives none.
19. Use one target notification’s `⋮ -> Mark as read` action once. It becomes read without changing the
    submitted feedback or the other target rows, and the feedback branch must
    not create or change any rating. The earlier rating/graph evidence was
    already captured before its fixture was restored.
20. Report:

    `BELL-RATING-LIFECYCLE-001 feedback bell complete`

Codex verifies the exact feedback recipients, one inbox row per target, no
actor row, no duplicate logical outbox and matching unread/read projections,
then restores the feedback fixture.

## Completion and expected effort

PASS requires all three sections plus their persisted oracles. A target bell
screenshot alone cannot prove the rating, read idempotency, Statistics or graph
state.

| Work | Clean run | With one focused replay |
| --- | ---: | ---: |
| Rating pair, bells and read transitions | 20 min | 40 min |
| Statistics, Monitoring and affinity comparison | 20 min | 50 min |
| Feedback notification parity | 10 min | 25 min |
| Evidence and exact reset | 5 min | 15 min |
| **Total** | **55 min** | **130 min** |
