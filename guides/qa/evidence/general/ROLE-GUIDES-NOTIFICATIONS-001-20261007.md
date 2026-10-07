# MSC-118 development evidence — 2026-10-07

Implementation and focused runtime checks completed. **Manual browser QA NOT
RUN.** No browser was operated, existing fixture was reset, separate application
compiler was started or update package was installed for these checks.

## Implemented boundaries

- Same Help revision model/API/seeds, new `isSystem` flag. Editor selector and
  returned editor state exclude system content. Local and Java services reject
  create-in-context, protected-source cloning, activation and deletion.
- 37 operator/admin contexts, 136 conditional fields, EN/HU in default, Work
  and Community. Shared popup lifecycle performs bounded context registration.
- Shared guide/notification launchers, menu access, persistent visibility
  switches, unread/mute state and realtime synchronization include all roles.
  The established responsive guide placement was preserved.
- Existing notification outbox/inbox handles release discovery, node member
  registration and admin report/feedback events. Existing login audits handle
  privileged security warnings. Recipient roles are resolved through existing
  configuration/selectors. No member's private profile is included in the
  node-level notice. Role targets are an allowlist of existing UI routes.
- Local report/feedback and registration/update paths use the existing local
  repositories; role demo rows share one canonical definition with Mongo seeds.
  Local feedback now persists into the existing moderation store before its
  notification, replacing the old success response without storage.

## Passed checks

Existing frontend watcher output, without compiler or browser:

```sh
node --max-old-space-size=192 frontend/scripts/check-role-guides-notifications-runtime.mjs server/docker/conf/nginx/app/myscoutee
node --max-old-space-size=192 frontend/scripts/check-guide-empty-surface-runtime.mjs server/docker/conf/nginx/app/myscoutee
node --max-old-space-size=192 frontend/scripts/sync-work-seeds.js --check
```

- Role runtime: 37 contexts × EN/HU × three groups × three Mongo catalogs;
  unique revision identity, flag, exact field/section parity and concise copy.
- Actual compiled Guide service: nested context restoration, no per-step load,
  explicit re-enable after dismiss. Shared Popup registration changes only on
  a changed/closed context.
- Actual local Help service: flag mapping, active read, editor filtering,
  attempted writes rejected before repository mutation.
- Actual NotificationCenterStore: browser preference persistence, hidden inbox
  access, unchanged mute/unread state, stale realtime rejection.
- Actual local role producer/repository/converter: event→inbox→role target,
  replay/read idempotence and recipient isolation; external target rejected.
- Empty-guide regression: article/other empty surfaces keep centered feedback;
  X/Escape/Back/launcher/shade close it; valid tours and real load errors remain
  distinct; 200 unchanged notifications cause zero rescans.

Already compiled Java service/repositories, temporary prefixed collections in
the running demo Mongo; no application build or second Spring server:

```sh
docker exec myscoutee sh -c '
  for qa_process in /proc/[0-9]*/cmdline; do
    if tr "\000" "\n" < "$qa_process" 2>/dev/null | grep -Fxq "com.raxim.myscoutee.Main"; then
      qa_classpath=$(tr "\000" "\n" < "$qa_process" | sed -n "/^-cp$/{n;p;}")
      test -n "$qa_classpath" || continue
      exec java -Xmx192m -cp "$qa_classpath" /workspace/docker/scripts/manual-qa-checkpoints/RoleGuidesNotificationsProbe.java
    fi
  done
  exit 1
'
```

- Role events through real outbox/inbox Mongo repositories: repeated release
  and join events produce two Operator rows and three admin rows; member gets
  zero. Correct target, cross-recipient read rejection, idempotent read and
  persisted unread count pass.
- Real login audit path: bootstrap Operator warning and repeated admin login
  attempt use correct workspace URLs and produce no replay duplicate.
- Real Help service/repositories: Mongo `isSystem` mapping, direct active lookup,
  hidden editor state, HTTP-status 403 exceptions for create/clone/activate/delete.
- Probe removed every temporary collection in its finally block. Existing
  fixture documents and inboxes were untouched. Controller/session-policy
  integration for these writes is not claimed by this service-level probe.

Live GET `/api/explanation/active`: **222/222 PASS** (37 contexts × EN/HU ×
default/Work/Community), checking exact field IDs and `isSystem: true` on the
running HTTP service after seed import. An editor GET without an active session
returned 401; no session was manufactured for an HTTP editor mutation test.

The existing backend watcher reported BUILD SUCCESSFUL and Started Main;
frontend-sync reported successful bundle generation at 04:19 and synchronized
its output. No extra Angular/Gradle compiler ran. Both Git diffs passed whitespace
checks. The i18n generator was run through the existing canonical seed path.

## Corrections found during verification

- Work/Community already contained menu-guide v7 under their historical IDs.
  A new v7 would conflict with Mongo's compound unique index. The new navigation
  guide is v8; existing history is retained. The generator now validates that
  exact unique key before writing any catalog. Import completed at 04:19:22:
  **738 imported, zero failed**. Subsequent unchanged sync stayed idle.
- The Java test isolation wrapper originally double-prefixed an aggregate's
  collection name; the wrapper now prefixes idempotently. This was a probe
  isolation issue, not a change to the product repository query.

CPU snapshot after seed settlement: mongodb-sync 0.00%, frontend-sync 3.13%,
backend 30.83%, MongoDB 8.39%. These are one sampling interval during development,
not an idle performance benchmark. Available memory was approximately 4.3 GiB.
Guide checks establish operation bounds, not physical-phone responsiveness.

## Manual work not claimed

The new [stable checklist](../../checklists/general/ROLE-GUIDES-NOTIFICATIONS-001.md)
covers actual five-line fit, desktop/mobile controls, role deep-link popup
transitions, all conditional targets, Local/HTTP UI and read/mute/reload.
Native push, an actual six-hour scheduler cycle and full browser producer
journeys were not run. Existing unrelated QA PASS records remain historical.

## Delivery

Frontend: `0fdeea7d2` — MSC-118 Add protected role guides and shared notification
controls. Backend changes and this evidence are in the dedicated MSC-118 commit
that updates the frontend submodule to that revision. Only these two source
repositories changed; the roadmap issue and Project track delivery.
