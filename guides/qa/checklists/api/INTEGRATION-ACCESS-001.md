# INTEGRATION-ACCESS-001 — API/MCP access packs and domain operations

Stable checklist for MSC-116. Record execution status/evidence in the QA matrix,
not this document. Previous API or explanation-guide PASS results do not cover
this extension. Tests are scheduled separately; creating this checklist is not a
PASS. Use the versioned fixture/browser launcher when a fixture-backed run is
started; no fixture or browser action is part of writing this guide.

## Preparation

Use ordinary issuing profiles in Dating, Work and Community; include a second
unrelated account and a Community manager/member distinction from the approved
fixture. Generate test keys in the normal UI, never seed token secrets. Verify the
running backend, frontend, Java client and MCP image match the candidate commits.
Use disposable resources. Never put tokens or private messages into evidence.

## 1. Shared settings and local drafts

1. Open Profile → API/integrations. Confirm a shield button beside each API key's
   copy control, the main MCP URL, each manual MCP client and each OAuth client.
2. Open each selector. Its label identifies the target. Check fixed red Blocked,
   amber Write, green Full segments, current-state label and changing shield color.
   The short explanation below follows the selected pack inside the standard
   light-blue message block. Ordinary rating controls retain their original appearance.
3. Move between the three choices: no network request. X restores the opening
   selection. A changed-state tick stages the choice and closes the nested popup.
4. Stage different values for API, main MCP and a client. The parent tick appears.
   Save once: exactly one settings PUT includes all values/revision. Reopen and
   reload: all saved choices persist. X in the parent discards staged changes.
5. Check the combined settings GET supplies API/MCP connections and permissions;
   opening Advanced or a permission selector must not load separate settings.
6. Create/revoke a disposable key while another permission change is staged.
   Existing key operations stay explicit, metadata updates without losing the
   staged value, and one-time secrets remain attached to the issuing identity.
7. Switch active profile during a delayed load/create. Old results, secret and
   open permission editor must not appear in the new profile. Close/reopen clears
   secrets. A save error retains the draft and shows the existing error surface.
8. With two settings views, save one then the stale other: 409, no partial change.
   Reload before trying again. Foreign, revoked or admin key IDs must be rejected.

Repeat the draft/save/reopen and normal profile edit after saving in both HTTP and
local modes. Local IndexedDB reload must retain access. No bootstrap/seed-builder
import belongs on the settings or landing path.

## 2. Enforcement and discovery

| Main MCP | Client Blocked | Client Write | Client Full |
| --- | --- | --- | --- |
| Blocked | blocked | blocked | blocked |
| Write | blocked | Write | Write |
| Full | blocked | Write | Full |

1. Check the matrix using a manual MCP client and an OAuth client. API keys remain
   independent of the main MCP level. Missing configuration defaults to Write.
2. Blocked denies private calls. Write includes supported creation/invitation/organizing operations and their
   minimal results. Full adds permitted reads, not extra decision authority.
3. Downgrade an already connected Full client. Next discovery drops Full tools;
   a previously discovered Full read fails; an authorized organizing write remains available. Existing OAuth access/refresh and
   new authorization honor blocking. Queued callbacks stop for a blocked key.
4. Anonymous help remains available. API failure/absent capability metadata must
   not advertise personal tools. Switching the interactive workspace does not
   retarget the issuing profile. Removed membership does not retain group access.
5. Compare declared operations across API, Java SDK/CLI and MCP generated schema.
   Base assets, Work campaigns and Community domain restrictions must agree.

## 3. Read and organizing contract

1. With Full, sample paged events, groups, chats/messages, notifications and ratings.
   For Work include campaigns/history; for Community services/cases/announcements/
   recurring tasks. Base-profile assets remain base-only. Follow nextCursor as
   returned; cross-owner IDs must respect existing visibility, without hidden data. Reading
   messages through MCP must not change unread counts or send human read receipts.
2. Compare normal UI results to API results for the same actor/filter. Ratings are
   existing results only; omitting campaignId uses the aggregate view, with decimals.
3. Use SDK/CLI and MCP for a disposable organizing change: campaign draft update/
   publication and manager-owned case/board/announcement/recurring-task action.
   Repeat with Write and Full; both allow authorized organizing writes. Check that
   new write receipts contain only ID/status/version, not broad private data. Check
   real UI/persistence, version conflicts and lack of authority. Payload
   userId cannot change actor. Do not send real invitations during an unapproved test.
4. Attempt personal actions through API and MCP: rate/interest/feedback/ballot,
   recommendation, join/leave, take-over, accept/decline invitation, offer/edit and
   offer acceptance/rejection. None is callable. No state, notification, rating,
   membership or financial decision may be written. These require the existing
   application view and the person's decision; there is no new approval queue.
5. The existing normal app buttons still work under their original rules. An
   in-app possible-action flag returned by a read is not an integration capability.

## 4. Guides and presentation

Run EN and HU on desktop and mobile. Check profile.integrations and
profile.integration-access anchors, correct target descriptions, no overlap with
copy controls, keyboard/focus behavior, tick/X explanations and nested close.
Every newly affected guide step must be tested; old guide PASS is not sufficient.

## Completion boundary

PASS requires actual HTTP/local save/reload, API/OAuth denial, live MCP discovery
and stale-call rejection, sampled SDK operations and human-decision exclusions.
Source compilation/schema comparison alone is not sufficient. Release and public
plugin submission remain separate. Revoke disposable keys and remove only the
resources created by this checkpoint through the existing cleanup flow.
