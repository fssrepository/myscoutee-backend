# AFFILIATE-REVENUE-001 — 2026-09-23

Status: IN PROGRESS. Full-flow user delegation active. Admin client fixture reset before entry; invitation fixture status returned no active state, no owned users/referrals/tokens. Use existing dev watchers only. Stable checklist: ../checklists/api/AFFILIATE-REVENUE-001.md.

## Initial UI and registration

Owner 6aff10000000000000000001: Revenue green header pill 83.94px desktop, 36px at 360px viewport without overflow. Summary zero purchases/bookings/net. Registered new invitee demo-profile-86b7cd0a-8f9d-4de9-9e59-7a2a56738045 through the actual personal link and normal onboarding/photo upload. Mongo attribution points to owner; registration alone did not seed payments/revenue. `stage-revenue` creates two scoped event prerequisites (6aff20000000000000000001 EUR100, ...002 HUF5000), zero financial outcomes.

## User correction: demo Cards

Explore entry -> disposable owner -> Payments -> Cards works on dev HTTP, including 360px 36px compact control and opening the empty cards list. Fresh local seed now selects simulated Stripe; local menu poll derives availability from the operator configuration instead of literal false. Explicit cash-only null is preserved by the mapper. Fresh payment-simulator SQLite state now seeds a connected simulated Stripe provider; retained cash-only state stays unchanged. Existing live simulator was already configured, so no restart/rebuild. Frontend watcher PASS. New Go regression could not run: dependency download modernc.org/sqlite remained stalled; stopped only disposable test container. No live service stopped.

## Blocking UI defect found during payment entry

New invitee has browser location permission already granted but no saved location coordinates. Existing UI correctly disables server actions; however the setup popup hid Update when both toggles were disabled, making coordinate acquisition unreachable (notifications are not configured). Narrow fix keeps Update visible while profile location is missing. Retest pending; no fixture coordinates injected to hide the defect.

## Missing-location defensive branch — PASS (19:39 CEST)

User clarified the absent coordinates are a fixture defect, not evidence of a normal registration failure. Kept production demo GPS isolation: `AppLocationService` persists browser coordinates only for Firebase member sessions. No demo GPS bypass added. Actual Firebase permission/Update recovery is NOT RUN in these demo sessions.

With the registered disposable invitee's persisted coordinates null, reloaded the managed window: zero `/game-cards/query` requests, no rating cards, and the main card panel shows “To see profiles, open Settings → Install, enable location access, then press Update.” EN/HU source bundles and all three Mongo seeds are synchronized (7438 messages). At 900px and 360px, panel is visible without horizontal overflow. Bell is `notifications_off`, disabled, slate palette; it is not an offline indicator. Install popup exposes Update even if location permission is already granted.

Added push location checks to the existing recipient batch at enqueue and worker dispatch. No new database call or per-recipient lookup. Preserves the existing in-app inbox audience; this guard controls device push delivery. Added focused source regressions for missing-location enqueue and location removal before delivery, including single batch-query assertions; Java tests NOT RUN because the existing continuous classes watcher owns compilation. Existing watcher: BUILD SUCCESSFUL, DevTools restart healthy.

Versioned affiliate fixture `stage-location-push` queued a pending direct push with an enabled synthetic device and matching fingerprint for the location-less invitee (no real provider token). The real scheduled worker completed it: status=sent, tokenSuccessCount=0, tokenFailureCount=0, retryCount=0. `finish-location-gap` independently checked that result, removed the owned test outbox row, restored the original devices and supplied valid coordinates from the owner fixture. Browser reload then showed locationMissing=false, no warning panel, and one normal card query. Financial outcomes remain unmodified. Full affiliate revenue checkpoint is still IN PROGRESS.

## Approval continuation diagnosis and focused replay — 20:13 CEST

The initial diagnosis incorrectly treated basket `succeeded` alone as payment evidence. History (`585ebabba`) and the existing free-ticket QA show that terminal reservation closure is intentional for completed acceptance. No payment occurred during the failed attempts. Do not report those attempts as a completed checkout or broadly revert unrelated work.

The paid, unpaid branch has two traced problems: Explore ignored `currentUserMembershipStatus` when resolving approval, and terminal basket results are removed by `reconcileExpiredEventDrafts`. The first attempted `approveReservation` wrapper was incomplete: the later Join call finalized the basket again. That wrapper and its caller changes are no longer present. The existing common `finalizeAcceptedReservation` now retains a positive-price basket without a checkout session as approved/pending; free/payment-backed terminal closure remains the existing path. Local adapter has the same condition. Added regression sources cover four unpaid input states plus free/payment-backed controls; tests NOT RUN separately from the existing build owners.

User clarified that post-approval continuation must use the existing Continue path without another confirmation, and questioned showing the details step again. Inspection found the existing payment-review predicate and automatic payment-step restoration recognized confirmed/pay but omitted approved. The final checkout-popup change only includes approved in those existing predicates (three lines); no new confirmation bypass handler or custom button-label branch remains.

Focused real UI replay: ordinary owner Remove, visitor Join and confirmation, owner Approve and confirmation. Before approval: membership pending/member/approval; basket `6ab414b9de5ce0e8f4b54e49` approval-pending/pending active, amount EUR100, no session, zero payments; reopening shows Waiting for approval/Cancel request. After owner approval: same basket approved/pending active, membership accepted, zero payments. Full reload resolves accepted membership despite the stale approval-pending local draft. An intermediate pre-final-UI-fix continuation produced active basket `6ab41545de5ce0e8f4b54e50`, approved/pending, no payment.

After the final three-line UI change and existing watcher build (18:10:22Z), full reload and basket open go directly to Review Booking & Pay / Items to pay for, with no Join or confirmation. Back to details shows the existing Continue. Clicking Continue returns directly to payment with no confirmation and zero `/events/join` resource requests before/after. Mongo basket ID, update timestamp (18:07:01.804241216Z), accepted membership and zero payment count remain unchanged. This proves this transition only; payment capture, refund, free/payment-backed runtime regression and the full affiliate checkpoint are NOT COMPLETE. No charge was submitted. The visitor window remains at payment selection; expired simulator card-registration frames were closed by reload. Frontend and backend watcher builds passed; focused diffs pass whitespace checks.

## In-scope UI corrections during approval QA — 21:14 CEST

Latest gallery rule supersedes the intermediate magnifier/red-counter designs:
use the existing Activity event-card badge style, showing uploaded image count /
gallery capacity (for example `2 / 5`), with no magnifier, no extra red counter
and no duplicate bottom-left index on the cover. Apply in editable/read-only
gallery covers, feed cards and the Article gallery action. The carousel and
InfoCard now share the original 25px badge surface styling; the feed only supplies
the label/data. Article header actions support the same badge surface.

Actual managed owner browser: reopened fixture-owned `QA Approval Popup 20260923`;
its approval settings retain OFF and 5 hours after save/reload. The Capacity-styled
10px-radius field is on its own row with `in hours`; mobile screenshot
`/tmp/gallery-approval-current.png`. Uploaded two repository logo images through
normal file inputs into this disposable event and saved through the normal editor.
Fresh reload shows `2 / 5`, no red counter and no duplicate cover index. At 360px
and 900px viewport the badge measures 34.5625 x 25px; desktop has no page overflow.
Clicking opens the real gallery with 2 filled slots / 5 available slots.
Screenshots: `/tmp/gallery-badge-final-mobile.png` and
`/tmp/gallery-badge-final-desktop.png` (local runtime evidence).

The visitor Public feed was empty; its populated-card visual and Article viewer
visual are NOT RUN in this correction. Existing frontend-sync build passed at
19:11:03Z; focused frontend diff whitespace check passed. No separate compiler or
test process started. Financial QA remains IN PROGRESS; this UI correction does
not assert completion of the outstanding approval/payment/refund checks above.

Follow-up 21:15 CEST: removed the cover-level X as requested. Fresh managed
owner reload: cover shows `2 / 5` and Copy, zero remove buttons. Opening the
gallery shows two filled images and two remove buttons. Closed the gallery
without deleting either image. Existing frontend-sync build passed 19:14:32Z.

## Read-only financial resume gate — 21:16 CEST

Versioned fixture status remains revenue-ready with hufApprovalControl=true;
live application, frontend watcher and local payment simulator are healthy.
Mongo confirms EUR payment 6ab41748de5ce0e8f4b54e52 captured EUR100, fulfillment
succeeded, affiliateRevenuePending=false; EUR membership accepted. HUF basket
6ab41e32de5ce0e8f4b54e6b is approved/pending, reservationActive=true, amount HUF5000,
expires 2026-09-25T13:15:59.529Z, exactly 4 hours before event start. HUF membership
is pending, pendingSource=member, requestKind=payment. No HUF payment exists.
This supersedes the earlier retained-EUR-unpaid/no-payments resume pointer.

## Payment-grace correction and preparation — 21:30 CEST

Final user rule: independent payment grace enabled flag/hours, configured through
clock action in the payment block; Auto approve is again a direct toggle. The
old Auto approve popup and ON-means-no-grace interpretation are superseded.
Frontend/local/HTTP mapping, Java event persistence, event cloning and canonical
checkout deadline now carry paymentDeadlineEnabled independently of approval.
Default remains enabled/4h; disabled pricing or disabled grace applies zero lead
offset, retaining the event-start boundary. Existing watcher builds passed;
i18n audit passed (7450 messages, 2 bundles, 3 seeds). Updated service regression
source covers both approval modes plus grace OFF/free pricing; tests NOT RUN.

Actual managed owner UI: changed Auto approve from OFF to ON without any popup,
enabled Pricing, opened the clock form, set grace OFF and saved the event.
Reload verified hours=5, disabled input, Auto approve ON. Re-enabled grace and
saved; Mongo confirms approvalRequired=false, pricing.enabled=true,
paymentDeadlineEnabled=true, paymentDeadlineHours=5. The final number input is
37.5px high; an intermediate textarea-style height error was found and corrected.

Visitor retained HUF5000 control: Continue booking opens payment directly. Back
shows Continue, and Continue returns to payment without a confirmation. No HUF
payment was submitted. The event card incorrectly said Waiting for approval;
DTO/card mapping now distinguishes payment pending without extra DB queries.
Runtime retest of that label is still pending.

Versioned `stage-grace-cases` creates only event/admin prerequisites: manual
6aff20000000000000000003 and automatic 6aff20000000000000000004, each EUR10,
grace enabled/4h. No visitor memberships, baskets, payments or revenue were seeded.
Both events appear in visitor Explore. Their unpaid scheduled-expiry and fresh
Join checks are NOT YET RUN. `expire-grace-case manual|auto` advances only their
event/basket timestamps after real unpaid Join; `reopen-grace-case` requires actual
expiry completion before making another normal Join eligible.

## Unpaid grace expiry and fresh Join — 21:49 CEST

Actual managed UI on the retained fixture, no payment submitted for any grace
control. Manual Join created basket 6ab429bdde5ce0e8f4b54e80; owner Approve once
kept membership pending/requestKind=payment, showed Waiting for payment above the
eye, and removed Approve from the member menu. Auto Join created confirmed/pending
basket 6ab42a01de5ce0e8f4b54e87 and opened payment without admin approval.
Both server deadlines were 19:58:13.947Z, event start minus four hours.

The versioned timing-only expire commands advanced these two events/baskets.
The REAL scheduled event-checkout-basket-purge run at 19:36:10.575706108Z processed
two items: both memberships became deleted, both reservations inactive and basket
resultState deleted. No payment existed. EUR100 control stayed accepted; affiliate
revision 5, EUR gross/net 10000 minor units, refunded 0, purchases/eventBookings 1
were unchanged. No outcome or counter was seeded.

Reopening eligibility exposed a client reconciliation defect: a terminal server
basket did not clear its cached draft until the later cached browser deadline.
The shared draft store now clears authoritative deleted results regardless of
that stale timestamp, preserving pending drafts. Normal Explore then offered
Book Event/Join instead of the expired approval. Fresh manual Join created basket
6ab42c1ede5ce0e8f4b54e92 (approval-pending); the owner UI again showed Waiting For
Admin Approval and Approve/Reject. Fresh auto Join created 6ab42c33de5ce0e8f4b54e95
(confirmed/pending), opened payment normally, and reused neither expired basket.
Old tombstones remained retained. Zero payments in both cases.

The event-list label defect was also reproduced and fixed: lightweight card DTOs
had no member snapshot/pending reason. The existing batch basket projection now
includes status and carries the pending reason through both detail and card
mapping, with no extra DB request. Fresh UI verifies manual is Waiting for
approval; Auto and retained HUF5000 approved control are Waiting for payment.
Membership remains pending; the change does not perform approval or Join.

Disabled-grace control 6aff20000000000000000005 was staged with prerequisites only
via stage-grace-off (Auto ON, grace OFF, retained hours=4, event start two hours
away, so its configured four-hour offset was already in the past). Normal UI Join
created 6ab42ce6de5ce0e8f4b54e9a, confirmed/pending, expiry exactly event start
21:47:36.013Z. Scheduled purge completed at 19:48:20.679826113Z with zero expired
items; that basket stayed active. No payment or affiliate contribution arose.
This proves OFF does not enforce the retained four-hour offset.

Build verification uses existing owners only: frontend bundle/sync PASS
19:41:11.396Z; backend continuous BUILD SUCCESSFUL after final source change and
DevTools restart 19:48:20Z. Focused regression sources cover stale local deadline
reconciliation, pending/payment card reason and a single repository query;
Java/TS test suites NOT RUN separately. Whitespace checks pass with the existing
CRLF CSV convention. Full affiliate financial/refund/recovery journey remains
IN PROGRESS; these results only close the exercised expiry/fresh-Join controls.
