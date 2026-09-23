# EVENT-GALLERY-FEED-001 — 2026-09-23 delegated runtime QA

Status: IN PROGRESS. User authorized the five new QA cases automatically; calendar runs last with phone attached later. Stable checklist is `../checklists/event/EVENT-GALLERY-FEED-001.md`.

## Runtime and preparation

- Initial preflight: no containers/watchers and localhost:80 refused connection. User then started the stack; nginx entry returned 200, myscoutee healthy, frontend-sync built and synced the current bundle. Existing continuous backend/frontend pipelines own compilation.
- Initial fixture was staged, but managed browser launcher correctly rejected it: snapshot lacked `checkpointId`/phase metadata. No browser checklist action had run.
- Corrected metadata in the three newly introduced gallery/email/admin-client fixtures: record checkpointId and staging phase; change to ready after preparation. The common session-cleanup gate remains unchanged. Gallery reset through its versioned fixture and restaged; managed launch restarted.
- Actors: Gallery QA Creator `6a1100000000000000000001`, Viewer `6a1100000000000000000002`, Ava and Noel. Moderation auto-approval temporarily disabled by the fixture; no success results seeded.

## Checklist status

1. Stack readiness PASS; fixture preparation corrected/retested.
2. PASS: all four managed isolated sessions passed /auth/me and realtime readiness. Four tall app windows at x=0/480/960/1440, 480×1000; same-row layout avoids Chrome tabbed-window minimum width. Android device 22126RN91Y connected/authorized, reserved for Calendar last.
3. PASS: uploaded `server/docker/conf/minio/media/images/demo-assets/asset-001/v1/large.webp` through `asset-005/v1/large.webp` (five distinct images).
4–5. IN PROGRESS: Event `QA Gallery 20260923 Event` (`h1790162538595`) saved through UI and reopened; five images retained in order, first cover; no arrows in Event editor, gallery controls available. Image 1 location Austin, Texas and caption `QA gallery first image by the river` persisted; cancelled caption edit discarded. Sixth slot absent. Evidence `/tmp/qa-event-reopened.json`. User reported native unstyled caption textarea: fixed by reusing shared text-control SCSS; existing frontend-sync build/sync passed 2026-09-23T11:25:43Z; fresh-page visual retest next.
6–16. NOT RUN yet.

No domain-flow PASS or final cleanup claimed. Follow this log and current fixture/managed manifest before resuming.

## Live observations and corrections (continued)

- Event cover removal shifted remaining image order; removed image metadata did not leak to new cover. Added fifth image again, saved and reopened. Caption limited to 40 characters with remaining 0; location persisted. Published Event is read-only even for creator, gallery has navigation and no upload/remove controls. Moderation row opens the actual read-only Event editor for admin.
- Shared carousel partial final-page movement verified: desktop 1850 px viewport, 1015 px strip/4 visible slots, final movement 251.535 px, last edge gap 2.567 px; 900 px viewport/3 slots, movement 534.227 px, gap 2.556 px; mobile simulation 360 px/one slot scroll offsets 0/311/623/934/1246 with final next hidden. Browser focus required for animation evidence.
- User-reported UI fixes use shared controls: caption text-control mixin, popup backdropTone dim, SingleRow menuPosition top-right, menu tinted palettes. At 480 px moderation row menu top/right inset both 9.797 px. Distinct category and status colors measured from rendered shared menus. Settings toggle aligns to input bottom. Added missing Confirm/Megerősítés translation; catalog and all three Mongo seeds audit PASS (7386 messages); watcher imported new bundle.
- Feed post `733b9801-8942-4dda-9f88-41a2fafccd87` created through gallery with five images, caption QA Feed near Austin, location Austin, Texas. Deliberately failed POST via CDP before sending: visible error, five images retained; retry succeeded, Mongo contains exactly one post. Cancelling a new empty gallery leaves one post. Creator sees pending post; Viewer Feed remains empty before approval. Stored moderation counts Event under-review=1 and Feed under-review=1, both admin poll/menu count=2.
- Cancelled Event acceptance confirmation left both rows and counter=2 unchanged. Acceptance not yet completed.
- Feed SmartList now uses established first-item anchor, mandatory snapping and conditional first marker from Contacts/Explore; distance header is 5 km rather than duplicate 0–5 km range. User-reported hover/press removed through normal non-clickable InfoCard plus existing data-motion=none, retaining shared image cycling. Real CDP mouse hover/held press/release: transform none, filter none, identical box shadow, no pseudo animation; image URL advances after release. `/tmp/feed-pointer-fixed.json`.

Remaining: complete Viewer gallery/visibility, Article, profile-info, Feed distance ordering/paging, Asset category, moderation transitions/errors/shared settings/Job, then queued Email/Admin client/Affiliate/Calendar. No campaign closure claimed.
