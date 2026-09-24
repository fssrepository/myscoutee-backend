# INTEGRATION-API-GROUP-001 — Group participant links

Domain: API test. Reuse INTEGRATION-API-001's normal API-key/client and
sign-in/registration path. This adds group coverage without reopening its
closed event evidence or creating a separate invitation mechanism.

## Baseline

Prepare an administrator-owned invitation-only group, a second group, a fresh
registration actor, and an existing non-member. Generate the integration key
through the normal Profile API UI. Snapshot only checkpoint-owned records and
register the scenario with the existing fixture harness and browser launcher
before execution. The external system distributes returned links; testing uses
the links directly and sends no unsolicited messages.

## Numbered checks

1. Call the existing `inviteGroupParticipants(groupId, participantIds)` client
   method / `POST /groups/{groupId}/invites` with two distinct external IDs.
   The response has one app URL per ID in request order. No recipient account
   or membership exists merely because a URL was issued.
2. Repeat the batch and verify stable URLs. Reject blank/duplicate IDs and
   oversized batches; a different owner cannot issue invitations for this group.
3. Open the first URL while signed out. Complete the ordinary registration and
   onboarding flow. The return URL retains the invitation through every gate.
4. After registration, verify that the external participant ID is bound to that
   account, its `activityMembers` community membership is accepted, and exactly
   one workspace profile exists. The claim persists `activeWorkspaceGroupId`
   on the base account. A subsequent full profile load without a selection
   parameter, including after reload/login, returns that workspace. The group
   is selected automatically in the
   header and its profile/body menus are active.
5. Reopen the same URL as that account: membership/profile/participant binding
   are not duplicated. An explicitly cleared home gender filter is preserved.
   Registration defaults initially select the opposite gender on home cards.
6. Open the second URL using the existing non-member account and compare the
   same accepted membership/active-workspace result. Repeat using an existing
   pending join request; the administrator-issued link supplies invitation
   authority without requiring a second manual membership approval.
7. Try the claimed first URL from another account, and a token with altered
   bytes. Reject the claim; neither account gains membership or a profile.
   Reusing an external participant ID already bound to another account is also
   rejected. Revoking the issuing administrator's role prevents new claims.
8. Start from an already selected second workspace, then follow a valid link
   for the first group. Bind the base account, not the virtual workspace
   profile; select the target once and do not duplicate the claim on switching.
9. Retry after a real transport failure during claim or workspace selection.
   A failed selection retains the claim URL for retry. Retried successful
   operations converge to one participant binding, membership and profile.
10. Issue an Event link as a control through the same client. Its normal
    pending-invitation, payment/approval and ended-event rules remain intact;
    group auto-admission must not bypass Event acceptance or checkout.
11. Verify the new group profile against Base and the second group using the
    recorded private target IDs from GROUP-ISOLATION-001. No cross-workspace
    access follows from possessing this group invitation.
12. Revoke the QA API key and verify rejection. Reset only checkpoint-owned
    invitation mappings, accounts/profiles, memberships and groups, preserving
    unrelated records and earlier closed API evidence.

## Evidence boundary

Unit tests are supporting evidence. PASS needs real client responses, the
registration/claim UI, persisted membership/profile, active workspace and
negative authorization outcomes. This integration path is server-owned even
when the application's other demo routes use local data.
