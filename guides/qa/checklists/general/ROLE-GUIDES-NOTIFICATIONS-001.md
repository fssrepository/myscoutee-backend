# ROLE-GUIDES-NOTIFICATIONS-001 — operator/admin guides and shared notifications

MSC-118: [project issue](https://github.com/fssrepository/myscoutee-roadmap/issues/156).
Manual status: **NOT RUN**. Automated evidence is recorded separately in
[the execution record](../../evidence/general/ROLE-GUIDES-NOTIFICATIONS-001-20261007.md).

## Baseline and ownership

Use the existing dev stack and disposable demo data, never production users.
Check the running watcher logs and the canonical seed synchronizer first:
`node --max-old-space-size=192 frontend/scripts/sync-work-seeds.js --check`.
Before launch, verify the running demo database has the operator
`operator@myscoutee.local`, admin `admin-demo-ava` and member
`650000000000000000000061`, and their current unread counts match their inboxes.
Verify the role-v1 seed inbox rows exist: three for the operator and four for
each configured demo admin. Additional legitimate notifications are allowed;
record the baseline rather than deleting them. No server, database, browser
profile or fixture reset is implied by this checklist.

Launch only after that baseline has been verified:

```sh
node guides/qa/tools/open-checkpoint-browser-sessions.mjs ROLE-GUIDES-NOTIFICATIONS-001
```

The common launcher owns isolated profiles and retained session cleanup. After
handoff the user controls all checklist actions unless explicitly delegated.
Guide inspection does not authorize submitting a form, moderating a user,
editing a job, connecting a node or installing/rolling back a release.
The read/mute steps below are deliberate writes to these disposable inboxes;
record the changed notification IDs and restore the original mute preference.
Do not reset an unrelated retained QA fixture. Close these windows through the
same launcher with `--close-only` when finished.

## 1. Shared controls in all three roles

1. Open the avatar menu in Operator, Ava and Casey. Notifications, Explanations
   and Notification button visibility are available in every role. Operator
   and admin do not need a member location merely to open their inbox.
2. With unread, unmuted notifications, both floating buttons are reachable.
   Drag each, including near screen edges, without activating it accidentally.
   Their hit targets must remain separate. Preserve the existing desktop and
   mobile guide-card placement; do not treat a layout redesign as acceptance.
3. Turn each visibility switch OFF, close/reopen the menu, reload, then turn it
   ON. The preference persists in that browser and the launcher returns when
   its normal visibility conditions apply. After a red-X dismissal, the menu
   also restores it. Hiding the bell neither mutes nor reads notifications.
4. The Notifications menu action opens the inbox even with its floating button
   hidden. Guide remains usable on the inbox and returns to the parent after
   closing it. Missing guides show the existing centered “no guide” explanation
   and stay open until dismissed; they must not flash or appear frozen.
5. Repeat EN/HU, 1280×900 and 390×844, including a short mobile viewport. Guide
   text fits within five lines and neither launcher covers the other. Record
   actual five-line overflow rather than relying on text-length checks.

## 2. System guide inventory

Open each surface normally, then Guide. Run Next, Back, step picker and Done.
Only visible targets count; absent conditional controls are omitted. Guide
navigation never executes the highlighted business action. Closing a child
popup releases its context and restores the parent guide; repeated opening
must not accumulate registrations or reload content on every step.

| Area | Contexts |
| --- | --- |
| Operator page/menu | `operator.home`, `operator.navigation` |
| Operator popups | `operator.updates`, `operator.registration`, `operator.claim`, `operator.configuration`, `operator.revenue`, `operator.community`, `operator.deployments` |
| Admin page/menu | `admin.home`, `admin.navigation` |
| Moderation | `admin.content-moderation`, `admin.moderation-settings`, `admin.reports`, `admin.report-detail`, `admin.blocked-users`, `admin.feedback`, `admin.feedback-detail`, `admin.chat-review`, `admin.item-preview` |
| Content | `admin.help-editor`, `admin.idea-editor`, `admin.article-view`, `admin.article-edit` |
| Jobs and parameters | `admin.notifications`, `admin.process-detail`, `admin.schedule-edit`, `admin.job-parameter`, `admin.params`, `admin.parameter-edit`, `admin.parameter-history` |
| Observability/payments | `admin.stats`, `admin.graph-help`, `admin.affinity-graph`, `admin.monitoring`, `admin.payment-simulator`, `admin.payment-authorizations` |

There are **37 contexts / 136 conditional fields**. Exact field IDs and order:
`frontend/src/app/shared/core/local/seed/data/help-center-guide-fields.json`.
Check EN/HU and Local/HTTP; the same system content is seeded in default,
Work and Community scopes. Use existing role permissions and prerequisites.
Record an unreachable conditional surface with its prerequisite instead of
inventing a role or submitting an irreversible action to reach it.

## 3. Content editor protection

1. As Ava, open Content Editor → Explanations. The 37 system contexts are absent
   from the context selector; ordinary member contexts remain available.
2. Open Help on the editor itself: `admin.help-editor` still loads normally.
   System content uses the ordinary Help revision/section API and model, with
   `isSystem: true`; it does not require a separate guide content service.
3. The automated Local/Java guard check must pass for attempted new language
   drafts, copying a protected source into an editable context, activation and
   deletion. A forged client request must not override `isSystem`. HTTP editor
   access still requires a valid authorized session before the content guard.
4. Check the persisted flag and seed import parity after the normal dev startup.
   Ordinary revisions without the flag retain their existing editability.

## 4. Inbox contents, routes and counters

| Recipient | Event | Expected target |
| --- | --- | --- |
| Operator | Verified newer release | Operator → Updates; never installs automatically |
| Operator and app-admin | Ordinary account completes node registration | Informational for Operator; Statistics for admin |
| App-admin | New report / feedback | Reports / Feedback respectively |
| Account owner, including privileged roles | Existing additional-login security warning; successful operator bootstrap login | That account's workspace |

1. Check the prepared role inbox rows in New/All and their translated EN/HU
   text. Regular members must not receive operator/admin events. Security
   messages describe the owner's login, not arbitrary other users' locations.
2. Open the release/report/feedback/statistics target. It opens the existing
   corresponding popup, not an empty page or a new workflow. Return and reopen;
   the route marker must not keep reopening it. Unknown/external targets cannot
   navigate through this action, and a different role cannot use its target.
3. Mark one recorded row read. It leaves New, remains once in All, and decrements
   only its recipient's count once. Repeating the read has no further decrement.
   Reload and verify persistence; a late realtime response must not restore an
   older unread count. Check the workspace filter is respected during sync.
4. Mute/unmute with the existing notification action. Muting, hiding the button
   and marking read remain distinct operations. Restore the initial mute value.
5. Producer, replay, recipient-isolation and read-count proof is in the bounded
   automated probe below. For real browser producer journeys, use the existing
   registration, report/feedback, authentication and Operator Update fixtures;
   do not simulate successful registration by directly editing an inbox. Push
   provider/device delivery remains under MOBILE-PUSH-LIFECYCLE-001.

## 5. Performance and regression

- No new global DOM scan, timer, observer or Save-button anchor is used to bind
  these guides. Shared popups register on context/active changes and release on
  close/destroy. Next/Back must not refetch the guide.
- HTTP active-guide lookup selects the indexed group/kind/language/context
  revision; local loading uses its existing active-revision key.
- Release discovery reuses signed metadata verification: one bounded check
  after startup and every six hours, only with a configured signing key and
  valid installed version. Opening Updates also checks. No package installation
  is part of discovery. Duplicate discovery cannot duplicate the inbox entry.
- During normal guide navigation and an idle open page, record visible jank and
  CPU evidence. Existing watcher compilation is the only build owner. Do not
  start another build/test compiler or stack to verify this case.

Record each section as PASS/FAIL/NOT RUN with role, language, adapter, viewport,
context/field and reproduction. Automated checks do not replace the manual
layout, click-through, native push or long-duration scheduler observations.
