# INTEGRATION-ACCESS-001 — API/MCP access packs and domain operations

## Publication preparation follow-up — MSC-119, 2026-10-07

Execution remains **NOT RUN**. After consolidation, include the MCP repository's
`plugins/PUBLICATION_HANDOFF.md` and canonical five positive/three negative review
cases in host QA. Check the actual packaged 1.6.0 version, all explicit tool effect
annotations, two-account OAuth isolation, permitted reads/organizing commands,
and refusal of personal decisions/privileged writes. Anonymous-help packages
must use their separate help-only cases. The ZIP/source checks recorded in the
handoff do not mark these functional cases PASS. Reconcile the other session's
latest checklist/ledger changes before executing the full campaign.

Stable checklist for MSC-116 and MSC-119. Record execution status/evidence in the QA matrix,
not this document. Previous API or explanation-guide PASS results do not cover
this extension. Tests are scheduled separately; creating this checklist is not a
PASS. Use the versioned fixture/browser launcher when a fixture-backed run is
started; no fixture or browser action is part of writing this guide.

## Template regression and fix propagation — MSC-122

Repeat applicable API/MCP consent, client/key settings, permissions, masking,
revocation and account-isolation checks in the template using its actual tool
catalog and selected member/admin roles. Check local settings and real HTTP
protocol behavior separately. Affiliate and other omitted product operations
are N/A; the source's larger tool catalog is not a template requirement.

Follow the [shared template regression requirements](../README.md#template-regression-and-fix-propagation--msc-122).
Record template impact, propagated revisions and its own targeted result for
each defect; source PASS alone does not close the template follow-up.

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
   amber Write, blue Read, green Full segments, current-state label and changing shield color.
   The short explanation below follows the selected pack inside the standard
   light-blue message block. Ordinary rating controls retain their original appearance.
3. Move between the four choices: no network request. X restores the opening
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

1. In Dating, Work and Community, open Help in the Affiliate/API popup. Check
   the API-key shield, main MCP shield, individual MCP/OAuth shield and parent
   Save tick steps when those controls are rendered. Absent controls are skipped.
2. Open an existing permission selector. Help must switch to
   `profile.integration-access`: level, conditional Apply tick and Close.
   Its three catalog fields do not imply three visible steps before editing.
3. Next/Back/Done must not change permissions, stage a draft or save settings.
   Closing only Help leaves the selector and its draft intact.
4. Close the selector: the guide returns to `profile.integrations`. Repeat
   open/close; no stale child registration or repeated settings load occurs.
5. Verify all three workspaces load their own EN/HU child guide, not a fallback
   to Dating. Preserve the established mobile/desktop guide placement and check
   that guide/bell targets remain separately usable.

The 2026-10-07 development follow-up added the missing enabled-surface entry and
Work/Community child-guide seeds. Watcher-AOT guide lifecycle and seed parity
checks passed; this is **not** a permission-enforcement or manual browser PASS.
See [the guide follow-up evidence](../../evidence/general/EXPLANATION-GUIDE-001-20261007.md).

## Completion boundary

PASS requires actual HTTP/local save/reload, API/OAuth denial, live MCP discovery
and stale-call rejection, sampled SDK operations and human-decision exclusions.
Source compilation/schema comparison alone is not sufficient. Release and public
plugin submission remain separate. Revoke disposable keys and remove only the
resources created by this checkpoint through the existing cleanup flow.

## MSC-119 extension — defaults, Events separation and privileged readers

Status: **NOT RUN**. Earlier guide checks do not establish these new behaviors.

1. On an account without saved access preferences, main MCP is Blocked; fresh
   API/manual MCP client packs remain Write. Generating a key has no added approval
   step and does not enable the main link. Explicit old Write/Full preferences persist.
2. Set main/client combinations Read/Full and Full/Read: normal permitted queries
   work, Events catalog is empty and subscriptions fail. Full/Full permits only the
   current role/domain's catalog. Full→Read stops queued delivery and preserves reads.
3. Admin settings load existing desktop API keys plus MCP rows in one GET. Its
   parent tick saves both atomically. Blocking the old admin key stops overview;
   do not regress the existing desktop endpoint. Local and HTTP drafts round-trip.
4. Role MCP/regular integration connections: Write exposes no role operations;
   Read/Full exposes adminOverview for app-admin and operatorMeasurements /
   operatorRevenueReports for operator. Member/group identities cannot discover
   or invoke these. Force a call with another identity or a revoked role: denied.
5. Role integration credentials cannot invoke member organizing commands, legacy
   /watch setup, moderation, payment, update approval, report sync or configuration
   changes. No new writes are granted by Full. Existing interactive buttons work.
6. Open `?` help: connection steps, four packs, Events purpose/setup/stop/limitations,
   role readers and manual key help in EN/HU. Run its own guide, close, reopen;
   return to the parent context without leaking its registration.
7. Run permission guide: level, selected-pack explanation, Apply and Close targets.
   Run both parent and help guides in base, Work, Community and role profiles.
   Local seed reset and HTTP seeded revisions both contain the updated sections.
   Existing user-edited help is not silently overwritten.


## MSC-119 MCP User Guide verification — NOT RUN

Use MSC-MCP-001, `guides/manuals/MyScoutee_MCP_User_Guide_EN.pdf`.
Artifact generation, source anchors, text extraction, the cover/table rendering
and identical backend/frontend copies were checked; these are document checks.

- [ ] Follow the automatic OAuth setup with separate ChatGPT and Claude users;
  verify each consents to their own intended profile rather than a publisher account.
- [ ] Follow the client-generation table for API and manual MCP credentials;
  verify one-time reveal, expiry, cap, revocation and unchanged generation flow.
- [ ] Match the four-pack and main/client tables to actual saved behavior,
  including nested tick versus parent save and the initial main Blocked state.
- [ ] Check the host's actual Scheduled location, account/workspace availability
  and chosen execution environment; do not mark supported solely from documentation.
- [ ] Follow Events setup only on a host advertising the extension; use
  MCP-EVENTS-001 for lifecycle, role checks, delivery and stopping.
- [ ] Confirm human ratings, ballots and personal decisions remain unavailable;
  an ordinary Read pack is cumulative and is not a read-only member credential.
- [ ] Check PDF links from both public README catalogs after deployment of the
  documented revision. A source branch push does not imply a marketplace release.
