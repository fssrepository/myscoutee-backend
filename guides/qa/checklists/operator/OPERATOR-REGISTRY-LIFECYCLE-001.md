# OPERATOR-REGISTRY-LIFECYCLE-001 — Binding, claim, community and measurement

## Purpose

Register one disposable QA binding, complete one claim/link path, compare
community/leaderboard membership, synchronize measurements, then
disconnect and establish a new connection. Verify the corresponding local and
Registry records as well as the visible results.

**Actors:** the prepared Operator, named claimant, and member/Admin used for
access checks. Codex names the isolated deployment, QA Registry, measurement
period, expected totals, existing identities and restoration baseline.

## Fixture prerequisites

Fixtures supply deployment/account prerequisites and measurement source data;
do not repeat their previously tested creation journeys. Registration and
claim are the behavior under test here, so their successful results must come
from normal actions rather than prewritten bindings or receipts. Record
existing IDs/counts before acting to distinguish new work from retained data.

## 1. Registration and signed membership

1. Open **Registration / Registry**. The address, deployment and initial
   connection state match the prepared QA target.
2. Register that deployment once through the normal action. Observe the
   intermediate state and final result; pending does not count as accepted.
3. Codex correlates the local binding, Registry deployment membership and
   its signed membership evidence with this operation. Exactly one intended
   connection converges; identify any asynchronous operation that carries it.
4. Close and reopen the panel. The accepted connection and identifiers persist;
   a read/reopen produces no second registration or membership.

Report: `OPERATOR-REGISTRY-LIFECYCLE-001 block 1 done`.

## 2. Claim/link, leaderboard and community

5. Open **Claim** and complete the selected claim/link route once with the
   named identity and deployment.
6. Observe submitted/pending/accepted state honestly. Any required normal
   approval is performed by the designated authorized actor.
7. Codex correlates the accepted claim/group receipt, binding and membership
   on both sides. The operation does not create a second identity or group.
8. Open the relevant **Leaderboard** and **Community** views. Name, membership,
   deployment count and authorized visibility agree with the accepted connection.
   Provider availability is reported truthfully; unavailable data is not success
   or a fabricated empty result. Do not inject an outage for this happy path.
9. Reopen those read-only views. The same membership remains, with no new claim,
   group, measurement report or business-counter increment caused by reading.

Report: `OPERATOR-REGISTRY-LIFECYCLE-001 block 2 done`.

## 3. One measurement period

10. Inspect the prepared period, source totals and initial report/receipt counts.
    Start one normal measurement synchronization.
11. Compare created, sent, accepted and pending states with the actual records.
    Codex identifies the report, its corresponding Registry receipt and any
    related operation/job; sent alone does not prove accepted.
12. Verify the accepted period totals appear once. Source data, deployment,
    period and receipt agree; unrelated periods and control data remain unchanged.
13. Reopen measurements and the related leaderboard/community result. The durable
    accepted totals remain the same; reopening creates no duplicate report or receipt.

Report: `OPERATOR-REGISTRY-LIFECYCLE-001 block 3 done`.

## 4. Disconnect, reconnect and exact restoration

14. Deactivate the named binding using its normal lifecycle action. Observe the
    resulting local and Registry state for that same connection.
15. Verify local user and activity data remain intact. Member/Admin local access
    and Operator recovery remain available; Registry-dependent actions reflect
    the disconnected state. Disconnecting is not deletion of the local application.
16. Connect again through the normal registration action. This establishes a new
    connection, not restoration of the old binding or claim. Identify the old
    archived connection and the new accepted enrollment separately.
17. Synchronize the retained local source data through the new connection. With
    unchanged sources, the same period totals must result; additional qualifying
    records must be reflected if present. Compare source totals, accepted reports
    and signed receipts. Reopening must not create duplicates within the new
    connection; do not mistake its legitimate new records for duplicates of the old one.
18. Restore the declared local and Registry QA baselines exactly. Retain the
    execution evidence separately from fixture cleanup and verify control state.

Report: `OPERATOR-REGISTRY-LIFECYCLE-001 done`.

## Original matrix coverage

| Source | Owning checks |
| --- | --- |
| Registry registration and signed deployment membership | Block 1 |
| Claim/link and claim/group receipt | Block 2, steps 5–7 |
| Community/leaderboard membership and provider availability | Block 2, steps 8–9 |
| Measurement report, exact totals and accepted receipt | Block 3 |
| Local data/access retained; Registry disconnect and new connection | Block 4, steps 14–16 |
| Retained-source resynchronization, no duplicates within a connection, exact restored state | Block 4, steps 17–18 and reopen checks |

## Execution boundary

Dedicated fixtures and managed browsers are prepared when this test starts.
Protocol abuse, token/security tests, retry storms, measurement failures and
announcement fan-out remain automated coverage. No installed-host health or
restart campaign is added to this normal Operator journey.
