# OPERATOR-REGISTRY-LIFECYCLE-001 — Registry and community connection

## Purpose

Connect an isolated QA deployment to the Registry, complete one claim/link
flow and verify its community/leaderboard result. Synchronize one measurement
period, then check deactivation and recovery. This is one consolidated test.

**Actors:** the prepared Operator, the named claimant, and the member/Admin
used for access checks. Codex supplies the QA Registry address, deployment
and restoration baseline. Use an isolated connection for lifecycle mutations.

## 1. Register the connection

1. Open **Registration / Registry** in Operator. The address and initial
   state match the prepared QA target.
2. Register the prepared deployment once through the normal registration
   action. Observe its intermediate and final states.
3. Close and reopen the panel. The same registered connection persists;
   Codex compares local and Registry identifiers.

Report: `OPERATOR-REGISTRY-LIFECYCLE-001 block 1 done`.

## 2. Claim/link, leaderboard and community

4. Open **Claim**. Complete the selected claim/link route once using the
   identity and deployment named during preparation.
5. The UI reflects the actual state: submitted/pending is not final approval.
   The designated authorized actor completes any required normal approval;
   then verify the final connection.
6. Open the relevant **Leaderboard** group/deployment and **Community** view.
   Name, membership, deployment count and authorized visibility match the connection.
7. Reopen the views. The connection is not duplicated; Codex identifies the
   same binding, claim and group membership in stored records.

Report: `OPERATOR-REGISTRY-LIFECYCLE-001 block 2 done`.

## 3. One measurement period

8. In Registry measurements, inspect the fixture’s period and baseline
   counts. Start one normal synchronization.
9. Created, sent, accepted and pending report counts reflect actual state.
   Codex compares the period, source data and corresponding Registry receipt.
10. Reopen to verify the durable result. Related leaderboard/community
    displays use the same accepted measurement.

Report: `OPERATOR-REGISTRY-LIFECYCLE-001 block 3 done`.

## 4. Deactivate and recover

11. Deactivate the named connection through its normal lifecycle control.
    Member/Admin access follows the defined inactive rule; Operator recovery
    access remains available.
12. Reactivate the same connection. Permitted access returns without a new
    binding or duplicate membership.
13. Codex compares connection and measurement evidence, then restores both
    local and Registry QA baselines.

Report: `OPERATOR-REGISTRY-LIFECYCLE-001 done`.

## Execution boundary

Dedicated fixtures and managed browsers are prepared when this test starts.
Fixtures provide prerequisite identities and data instead of repeating their
previously tested creation journeys. Protocol abuse, failure injection, retry
storms and announcement fan-out belong to automated coverage, not extra
manual blocks in this journey.
