# INTEGRATION-API-GROUP-001 — ordered execution, 2026-09-28

Status: blocks1–3 PASS; 3/7 blocks completed in this independent run.
Current point:4.1, switch between group workspaces.

## Execution contract

Announce every block/point before execution and its actual result afterwards.
Follow blocks1–7 in order; fix/retest concrete failures without silently skipping.
The user subsequently explicitly requested continuing the automatic test on
2026-09-28. Full-flow browser/API execution is delegated for this Group API
case; this supersedes the initial user-controlled startup handoff.

## Baseline and startup

- `mcp-oauth` development fixture reset completed with exact restore; its managed
  browsers closed and optional Inspector process stopped. Development proof is
  retained in `INTEGRATION-API-GROUP-001-oauth-development-20260928.md` and
  `INTEGRATION-API-GROUP-001-generated-keys-20260928.json`.
- Versioned scenario: `integration-api-group`, same testcase ID. Four isolated
  actors: Group API Alex (administrator), Maya (existing non-member), Milo
  (outsider), Nia (pending-branch control). Namespaced IDs use `f0300926`.
- Groups `qa-group-api-a` and `qa-group-api-b`: private/workspace-enabled, Alex
  accepted as Admin, no recipients/memberships/keys pre-created for the test.
- Fresh registration names reserved for the actual entry UI: Group API Fresh
  Rowan / Group API Fresh Event. No fresh user inserted or session injected.
- Baseline snapshots retained by the common harness. Only checkpoint-owned
  identities/resources/registrations are in the cleanup boundary.
- Existing versioned launcher prepared two windows: Group API Alex and a signed-
  out recipient. Both reported ready. Common active-session cleanup is retained.
- Startup completed before the ordered actions recorded below.

## Point ledger

| Block | State | Next check |
| --- | --- | --- |
| 1 | PASS | UI-created Alex and outsider keys; ordered two links; unchanged on replay; blank/duplicate/1001-ID batches400; outsider403; only two unclaimed mappings, no recipient memberships/profiles. |
| 2 | PASS | Fresh account, linked group profile, reload/login, replay and explicit base filter preservation. |
| 3 | PASS | Existing/pending recipients, entry controls, rejection statuses409/404/403; Milo gained no membership/profile on denied claims. |
| 4 | IN PROGRESS | Milo B→A workspace claims, then transport retry. |
| 5 | NOT RUN | Event control/isolation and scoped cleanup checkpoint. |
| 6 | NOT RUN | Attribution and cash exclusion; diagnose the supporting cash-refund test expectation recorded in development evidence. |
| 7 | NOT RUN | Ordered Advanced/manual-key, URL OAuth, callback/tool and help checks; development probes do not replace this run. |

The application and frontend watchers own compilation. No additional stack,
server or main build was started. Latest UI build and seed parity passed.

Block1 proof: `INTEGRATION-API-GROUP-001-ordered-20260928.json`; fixture status confirmed only Alex Admin memberships and no fresh users/workspace profiles. Initial runner used `url` instead of DTO `inviteUrl`; corrected the test harness, no product change.

## 2.1–2.2 — fresh registration and persistence PASS

Normal entry Login → New demo profile → Setup → onboarding (required fields
and three uploads using existing demo media) → Save profile created
`Group API Fresh Rowan`. No seeded fresh account or injected login was used.
The invitation survived the entry gates and was claimed only after registration.
Mongo status confirmed one accepted Member entry, the original base account and
one linked workspace profile; base `activeWorkspaceGroupId=qa-group-api-a`.
The UI selected QA Group API A after creation, full reload, and normal logout /
demo-login to the newly registered account without an invitation URL.

Location boundary: the launcher's default Austin sample was rejected by the
running eligibility endpoint. Budapest was eligible. Only this checkpoint's
managed-browser geolocation was changed through the versioned helper/config;
no application eligibility rule, fallback or production configuration changed.
Code inspection confirms fresh native getCurrentPosition(maximumAge:0), no
invented fallback coordinates, and retryable Setup after rejection. This is
simulated-location QA, not proof of actual device GPS or Firebase production login.

## 2.3 — replay and base filter preservation PASS

Returned to Main profile through the normal workspace picker. Default Gender was
Woman for the new man profile; deselected it to Any and applied. Reopened the
original invitation: QA Group API A became active; base profile remained
accessible and retained Any. Mongo still contained one fresh base account, one
linked workspace profile and one accepted membership. Structured results are
in the ordered JSON evidence.

## 3.1 — entry controls in progress

The first missing-coordinate attempt for Maya was invalid fixture preparation:
the direct Mongo edit bypassed the application's demo-directory cache eviction.
The cached selector retained her earlier coordinates, while the full profile
correctly returned no coordinates and displayed Location required. Do not count
that attempt as proof of the missing-location entry gate. Restored only Maya's
fixture location (base and newly copied workspace) from the staged baseline.

The versioned runner now refreshes the directory through the existing owner
profile-load operation, sending the owner's unchanged saved coordinates, and
reads back the control DTO before browser selection. No application cache or
location fallback was added. Nia is the pending-join and entry-control actor:
missing coordinates → Setup; cancel retains invitation and pending membership,
with no claim/workspace. Invalid coordinates plus denied native GPS → Setup
error, still entry and retained invitation. Valid saved-coordinate check pending.

User corrections during this point: keep the demo selector list under Setup
for existing users too; closing Setup without permission must only dismiss the
child and restore the same selectable list. Narrow frontend changes await
runtime verification after the existing frontend-sync build.

### 3.1 verified continuation

After the correction, the existing-user selector retained all58 rows beneath
Setup and disabled them during selection. Closing Setup with GPS denied kept
all58 rows, re-enabled them, retained the invitation, and opened no onboarding.
Existing frontend-sync build passed at2026-09-28T01:41:25.500Z.

Nia's eligible saved coordinates allowed normal login with native GPS denied.
The pre-existing pending join became one accepted membership and one workspace
profile, bound to the base account. Reload preserved QA Group API A. Normal
logout/login with the browser sample outside eligible regions (Austin) also
restored A using the valid saved profile location. 3.1 PASS.

### In-scope mobile popup correction

Shared API/Affiliate model and affiliate revenue summary now use the existing
fullscreen mobile presentation; Advanced states it explicitly. Runtime DOM
measurements at390×844: Affiliate, Advanced, Referral revenue each at(0,0),
390×844. Existing frontend-sync build PASS at2026-09-28T01:44:56.146Z. This
early regression check does not mark the remaining7.6 Local/HU/EN checks done.

## 3.2 — rejected claims PASS

Actual outsider Milo session: opening Rowan's already-claimed invitation showed
an error and stayed on Main profile. HTTP checks: other account409, altered
token404, same external participant ID issued in B but bound to Rowan409.
Temporarily removed Alex's B administrator role through the versioned fixture;
an otherwise unused B invitation then returned403. Restored the role in a
finally step. Mongo confirmed Milo had zero group memberships, workspace
profiles and claimed invitations before block4 started.

Corrected misleading Event-only error wording in the shared group/Event claim
UI to Invitation / Meghívó in EN/HU, using the existing keys. Affiliate revenue
button now uses account_balance_wallet. I18n8056-message audit and42 seed parity
checks PASS; existing frontend build passed at2026-09-28T01:49:00.228Z.
