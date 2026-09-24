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

## Financial continuation and callback correction — 22:15 CEST

Normal visitor UI captured HUF5000: payment 6ab42e95de5ce0e8f4b54ea2,
gateway b6d1fa42-ee97-46b3-8e2c-95cc4abbc278. Owner revenue then showed two paid
purchases/bookings, EUR100 and HUF5000 separately. Original EUR100 payment
6ab41748de5ce0e8f4b54e52: visitor requested refund, with no aggregate effect;
owner approved the configured EUR25 refund through Payment history. Provider
succeeded, payment refundStatus=partial, refundedAmount=25. Totals became
EUR100 gross/25 refunded/75 net; HUF stayed5000. Successful callback replay
returned HTTP200 without duplicate money/counts. The normal menu no longer
provides a second refund request after the partial refund, so the remaining75
refund branch is NOT RUN/unsupported by that current UI; no outcome was seeded.

Owner saved About through the normal profile editor, generated and revoked a
Client1 integration key, then reopened Revenue: amounts unchanged. Visitor's
own summary remained zero. No credentials were recorded. Payment history at
360px fitted without horizontal overflow; EN/HU compact All/Cards header controls
and card picker were inspected. Broader public DTO/privacy and fault/concurrency
steps remain pending.

Callback replay exposed a lifecycle defect: a saved payment contains pre-payment
basket items without its session, and callback Join reconstruction could retain
an approved/pending active basket even though membership was accepted. HUF stale
basket 6ab42ec4de5ce0e8f4b54ea5 records the pre-fix failure. The callback finalizer
now closes an accepted result with the verified payment session, matching the
existing synchronous pay path; pending membership is not closed. Focused Java
regression sources added, NOT RUN separately. Existing backend watcher build PASS.

Versioned stage-callback-control created only event/admin prerequisites for
6aff20000000000000000006, EUR10/Auto ON/grace4h. Actual normal Join, card selection
and Payment captured payment6ab432f4de5ce0e8f4b54eb6. Replaying gateway
9daf2008-f178-4d4f-8d3a-61240079af86 returned200; fulfillment succeeded, membership
accepted, reconstructed basket6ab43305de5ce0e8f4b54eb9 pay/succeeded/inactive, older
baskets deleted/inactive. A second replay returned200 with totals unchanged:
purchases3, eventBookings3, EUR110 gross/25 refunded/85 net; HUF5000 unchanged.
Reloaded Activities card has no Waiting for payment label. Existing HUF pre-fix
basket remains a retained defect artifact, not a successful retest.

Versioned stage-revenue-asset created only a free accepted event prerequisite
6aff20000000000000000007, stage qa-affiliate-borrow-stage and public EUR20 transport
6aff30000000000000000001. No borrow/payment outcome seeded. Normal visitor UI is
continuing through stage Transport -> Explore for purchase-only accounting.

User asked about many currencies overflowing. Revenue uses the shared popup's
bounded body with overflow-y:auto. Actual360x430 viewport: popup340.8x410.8 stays
inside viewport; body360px, scrollHeight415px, scrollTop55 reaches bottom while
header/close remain fixed. Restored360x780 afterwards. This proves overflow
behavior with the real two-currency data at reduced height; a many-currency
financial dataset was not fabricated. Add this overflow control to the checklist.

## Asset capture, full-refund control and privacy — 22:28 CEST

Asset checkout first failed404 because saveBasket applied the new canonical EVENT
cutoff to resource-only baskets. Narrowed that branch to event/sub_event baskets;
resource baskets preserve the prior supplied expiry/10-minute fallback. Existing
backend watcher BUILD SUCCESSFUL. Focused resource-expiry regression source added,
NOT RUN separately. Retrying normal Confirm borrow now opened Payment.

The asset fixture had a hex-string Mongo _id; Spring save converted it to ObjectId
and collided with the original syncKey after capture. This is a fixture defect.
Versioned repair-revenue-asset-id preserved all fields, snapshotted the original,
and changed only the untouched prerequisite document's BSON id type. Seed now
uses ObjectId from the start. Normal Pay retry reused the SAME captured payment
6ab43464de5ce0e8f4b54ebd/gateway0974ba21-019f-4caf-8d88-044af69c688a, persisted the
pending borrow request and assignment, and marked fulfillment/basket succeeded.
Exactly one EUR20 payment exists; purchases4/bookings3. Resource basket expiry
remained exactly10 minutes, active reservation false after success. Callback
replay200 left totals/counts unchanged. This route captures immediately; an
independent authorization-hold-only oracle remains NOT RUN.

Recovery prerequisites ...008 through ...011 were staged (EUR2/3/4/5), with no
payments/outcomes. Fault arming was NOT successful: first mongosh optional-array
call failed (corrected); the application DB account then denied collMod, and the
container's configured root credentials failed authentication. No validator was
installed. Read-only comparison confirmed all three collections' validators{};
clear-unarmed-revenue-fault removed only the unused harness marker. Runtime fault
steps(a)-(d) are BLOCKED by unavailable authorized collMod access, not PASS.
Normal UI capture of ...008 occurred after the first failed arming; it is NOT
fault-test evidence. ...009/010/011 remain unpaid, with no attempt made.

The EUR2 control ...008 was instead used for a supported FULL refund. Normal
visitor Request refund and owner Approve refund produced gateway success and
refundStatus=full, refundedAmount2. Primary payment6ab43550de5ce0e8f4b54ec8;
gateway1e385ba2-4202-422e-8e12-1f80e11b53a0. Replay returned200 without duplicate
amount/counts. Partner now purchases5/eventBookings4, EUR gross132/refunded27/net105,
HUF gross/net5000/refunded0. Full refund retains historical counts. This does not
substitute for the still-unsupported remaining75 refund on the partial control.

Read-only authenticated API checks using the managed VISITOR session:
/integrations/settings?userId=OWNER still returns visitor revenue0, not owner
aggregates. /auth/me?userId=OWNER and /auth/me/profile-ext?userId=OWNER both200;
recursive response-key inspection finds no revenue, contribution, ledger,
purchaser or affiliateOwner fields. No session credential was printed.

## Payment-history currency strip correction — 22:30 CEST

User reported the four total pills wrapping. Shared payment-history strip now
keeps nowrap, nonshrinking pills and horizontal scrolling; first-pill auto margin
retains right alignment only when they fit. Keyboard-focusable named region.
Actual360px UI: container347px/content374px, all four pills share y64.97, page has
no horizontal overflow. Native ArrowRight scrolls the strip. At1000px all pills
fit on one right-aligned row. Existing frontend-sync build PASS20:28:54Z.
User clarified scrollbar must not require hover: use scroll overflow plus visible
track/thumb colors and the established shared scrollbar styling. Final no-hover
visual retest follows. No extra build/test runner started.

Final currency-strip retest22:32CEST: frontend-sync PASS20:32:00Z, sync20:32:02Z.
At360px, mouse moved to y650 and focus cleared; after1.7s idle, hover=false,
focus=false, overflow-x=scroll. Screenshot /tmp/qa-payment-history-no-hover.png
visually confirms track/thumb remain visible. All four pills on same y64.97;
strip51px high including10px scrollbar. No hover-only behavior.

## Correction: hover means movement, not scrollbar visibility — 22:36 CEST

User clarified the complaint: hovering a total pill lifted/scaled the ENTIRE
strip. The previous permanent-scrollbar interpretation was incorrect and is
superseded. Reproduced on desktop: transform matrix(1.01,0,0,1.01,0,-1), strip top
84.156 -> 82.900. Cause: newly added tabindex=0 matches the global interactive
hover selector. Added the existing motion-static opt-out to this strip only;
kept keyboard scrolling. Removed only the mistaken overflow-x:scroll and custom
permanent track/thumb rules, restoring overflow-x:auto. One-row layout remains.
No financial, checkout, fixture or other feature changes were reverted.

Existing frontend-sync build PASS20:35:34Z, sync20:35:37Z. Actual pointer hover
on EACH of four desktop pills: hover=true, transform=none, top84.156 unchanged.
Desktop content955px fits container955px; mobile347px/content374px still scrolls,
all pill tops64.969, transform none. This supersedes the previous no-hover-bar
acceptance interpretation, not the previously verified financial QA results.

### 22:55 — exchange-rate feature and currency-selection scope added (IN PROGRESS)

User requested persisted daily FX observations behind `@Cacheable`, a scheduled/manual admin job, configurable operator Payments source, local-only dev simulation, and per-payment conversion snapshots. Summary layout now uses EUR by default rather than currency-by-currency breakdown; payment rows retain original currency. Follow-up adds clickable `>` amount badges, shared currency picker with header confirmation tick/standard route delay, and persistent per-user selection shared by both surfaces. Added acceptance checks above; implementation and runtime verification remain in progress, not PASS.

Concurrency prerequisites have been staged without manufacturing payment results: second payer `6aff10000000000000000002`, event `6aff20000000000000000012`, EUR 7 each. Versioned launcher prepared `AFFILIATE-REVENUE-CONCURRENCY-001` while preserving the original owner/visitor sessions. Neither concurrent purchase has been performed yet. Existing financial baseline remains purchases 5 / event bookings 4, EUR gross 132 / refunded 27 / net 105 plus HUF 5000. Injected validator failures remain unproven because runtime Mongo admin credentials are unavailable; no fault validator is active.

## FX UI corrections and continuation — 2026-09-24 00:22 CEST

Existing frontend-sync watcher passed the changes (22:10 and 22:17 UTC); no separate build/test runner. Desktop 900x850 and mobile 360x780 screenshots inspected: currency dropdown uses the existing select/auto panel behavior, extends outside the compact popup, and retains the dim/blurred background. All seven options visible on mobile with no horizontal overflow. Both payment-header buttons tested using actual mouse move/press: hover matrix(1.01,0,0,1.01,0,-1), press matrix(.97,0,0,.97,0,0); parent strip transform none. Removed motion-static only from the buttons. Removed the unsolicited payment-header explanation.

Affiliate currency action moved into the header using the existing compact app-menu custom trigger with chevron_right. Zero-value amounts show 0.00 EUR; purchase/booking counts remain unitless. Verified visitor zero-revenue mobile screenshot and opening the picker from the header. User accepted the affiliate selector. Screenshots: /tmp/qa-currency-dropdown-desktop.png, /tmp/qa-currency-dropdown-mobile.png, /tmp/qa-affiliate-zero-header.png.

Earlier FX runtime observations in this session: admin normal UI manual job completed 64 local-simulator observations; no external source used. Visitor summary EUR -144.50/+27 changed to HUF -57,800/+10,800 after confirmation. Owner selection USD changed both signs and affiliate gross/refund/net to158.95/29.70/129.25. Cancelled EUR draft left USD; confirmed EUR restored144.50/27/117.50. Original payment row currencies stayed unchanged. These amounts are the BEFORE-concurrency baseline, not current totals. Backend restart after Mongo MessageSource migration succeeded; properties contents were preserved in all three Mongo seed sets before deletion. New unit-test sources have NOT been executed separately. Operator URL save/reload and restart-retention runtime checks remain unproven.

Concurrency attempt at22:14:29.933Z submitted both normal UI confirmations in the same millisecond. Both EUR7 payments captured: ...53a1 and ...53a2 (full IDs6ab44f46de5ce0e8f4b553a1/6ab44f46de5ce0e8f4b553a2), event...012. However the second actor's fixture affiliateRegistration used a String _id although Spring maps this hex ID to ObjectId, so its payment correctly resolved no attribution. Result: only one affiliate increment. This is an INVALID fixture test, not a concurrency PASS or a product counter defect. Existing financial records were retained.

Versioned repair-concurrency-registration corrects only that prerequisite and creates fresh event6aff20000000000000000013 (QA Affiliate Concurrent Replay), preserving prior outcomes and recording the baseline. Canonical stage now uses ObjectId for the registration. Fresh captures6ab450b4de5ce0e8f4b553b2 and6ab450e9de5ce0e8f4b553b6 both have the intended affiliateOwnerUserId, affiliateRevenuePending=false, and immutable EUR snapshot source exchange-rate-simulator/date2026-09-23/rate1/amount700minor. The replay confirmations did NOT overlap (second actor card-selection preparation was incomplete); count this as two-referee attribution/snapshot PASS, not concurrency PASS.

Current partner totals: purchases8/eventBookings7; native EUR153 gross/27 refunded/126 net plus HUF5000. Converted EUR165.50/27/138.50. First attempt's unattributed second payment remains a documented fixture artifact; do not rewrite its frozen attribution. Recovery controls...009/010/011 remain unpaid; no fault validator active. Remaining concurrency, lower-version runtime and unavailable collMod fault cases are not passed.

### 00:24 CEST — corrected concurrent capture PASS

Fresh versioned stage-concurrency-retest created event6aff20000000000000000014 (QA Affiliate Concurrent Verified), after checking the corrected second attribution prerequisite. Both final confirmation dialogs were checked ready BEFORE either submission. Actual normal UI confirmations22:23:51.660Z/22:23:51.662Z. Captures6ab45177de5ce0e8f4b553c5(second)/6ab45177de5ce0e8f4b553c6(visitor): both EUR7 captured, intended affiliateOwnerUserId, stored EUR observation2026-09-23/sourceexchange-rate-simulator, pending=false. Partner increased exactly purchases8→10, bookings7→9, EURgross153→167; refunds27 unchanged. No partner pending intent remains. This establishes the capture concurrency case; simultaneous refunds/lower-version runtime remain separate, unproven cases.

Owner browser reload preserved the selected CZK. Actual Revenue popup shows10 purchases/9 bookings, gross4487.50CZK, refunded675CZK, net3812.50CZK; inspected /tmp/qa-affiliate-concurrent-summary.png. These equal EUR179.50/27/152.50 at stored25CZK/EUR. Native ledger is EUR167/27/140 plusHUF5000. Original failed-fixture attempt and sequential replay remain in evidence; no paid outcome was reset or rewritten.


### 2026-09-24 00:42 CEST — concurrent full refunds PASS

Both event...014 buyers requested EUR7 refunds through normal UI at22:39:57.266Z; request-only state left revenue unchanged. Versioned AFFILIATE-REFUND-CONCURRENCY-001 prepared two owner sessions. Both final approval dialogs were checked ready before submission; normal confirmations22:41:51.411Z/.415Z (4ms gap). Payments6ab45177de5ce0e8f4b553c5 and...53c6 reached full refund7 each, primaryversion8, refundedMinor700, pending=false. Their original EURrate1/date2026-09-23/sourceexchange-rate-simulator snapshots remained unchanged. Both refund audit records approved/refunded atversion3. Gateway refunds476220fa-3edc-3016-aec1-d054e8aebf58 and42c7b281-420c-3591-b0c7-778fc273e9a1.

Independent Mongo oracle01:00CEST: partner purchases10/bookings9; EURgross167/refunded41/net126, HUFgross/net5000. ConvertedEUR179.50/41/138.50, selectedCZK4487.50/1025/3462.50. Both refunds contributed exactly once; historical counts retained. Lower-version and injected-fault runtime cases remain unproven. Old owner/buyer windows and second refund owner were closed to release memory; first refund owner remains available.

### 01:02 CEST — unified FX source and production configuration

User requires one dev/production Explore implementation, with no HTTP-to-local fallback. Found two deployment defects: empty development-host configuration incorrectly became a set containing an empty string and rejected real HTTPS sources; the standalone Python FX service was present only in dev. Filtered empty host entries. Added the same deterministic XML endpoint to the already-packaged payment-simulator: /exchange-rates/eurofxref.xml. Configured simulator origin is allowed internally only in DEMO sessions; REAL production still requires public HTTPS. Dev continues to prohibit external FX calls. Removed the standalone dev service/script; stopped only that retired container. Existing Java/frontend watchers remain the only compilation owners.

Payment-simulator image3c27d1ee129e0fedacbe8a08b6065b22302721aa6c476e9d023f3528ef9f9aff built, old payment-simulator stopped before replacement, persistent volume retained. Runtime endpoint independently parsed:64 weekday observations, latest2026-09-23, fixture HUF400/USD1.10/GBP.85/CZK25/PLN4.25/CHF.95. No market lookup. Same service/baseURL exists in all three Compose files.

Operator Payments previously had no independent way to save the source when provider registration was disabled. Shared app-menu Save exchange-rate source now invokes the existing configuration save path. Normal managed UI save/reload retained the new URL. Admin normal UI run22:58:02Z completed64 in40ms. Changed URL through the same UI to missing.xml: run23:00:43Z failed in12ms;64stored observations retained; both paid/refunded controls stayedversion8 with original snapshots/pendingfalse. Restored correct source by UI; run23:02:02Z completed64 in23ms. Partner remainedrevision62/purchases10/bookings9/EUR167/41/126+HUF5000. Historical source strings intentionally remain the original stored value.

Canonical demo/E2E seed now points to payment-simulator; new REAL configuration defaults to the configurable ECB90-day XML URL. Shared Mongo importer performs additive migration for missing source and exact retired demo default, preserving explicit blank/custom values and unrelated operator state. packaging/tests/exchange-rate-configuration-test.py PASS against an isolated, subsequently dropped QA collection: all three Compose targets, source defaults, idempotence, credentials/custom/disabled preservation and no manufactured singleton. This is source/configuration verification, NOT a freshly installed production artifact qualification.

Frontend-local uses shared fixed-rate seed + summary mapper for history/affiliate; HTTP adapter resolver unchanged. Existing frontend watcher PASS23:00:06Z/sync23:00:09Z. Java watcher PASS/start00:56:59CEST. New Java/Go unit-test sources are NOT RUN separately. Frontend-local browser coverage, packaged production installation, delayed lower-version and injected-fault cases remain explicitly unproven. Dev financial QA already passed is retained; no broad replay/reset.


### 01:11 CEST — replay, stale version and focused recovery verification

After simulator replacement, both previously completed event...014 gateway callback replays returned200 with delivery200 (attempt3). Independent Mongo oracle: partnerrevision62 and EUR167/41/126+HUF5000 unchanged; both primary and contribution versions8, refunded700minor, pendingfalse. Normal owner browser reload and Revenue popup matched10/9 and CZK4487.50/1025/3462.50.

New UTC/weekend simulator unit test passed (`go test -vet=off -p=1 ./internal/simulator -run ^TestExchangeRatesUseUTCWeekdaysAndFixedDemoValues$ -count=1`, capped768MiB/oneCPU). The initial command's test passed but overall command failed because vet on modernc/sqlite exceeded its memory cap; second focused run exited0 with vet explicitly disabled. This is not a full Go vet/suite PASS.

Versioned `server/docker/scripts/manual-qa-checkpoints/FinanceVersionProbe.java` uses the existing watcher's compiled product classes and real demo Mongo; single-file QA launcher only, no second Gradle/Spring pipeline. REAL validation accepts public HTTPS with empty host config; DEMO accepts only configured internal origin; wrong host/port/credentials rejected; dev external source rejected without making HTTP requests. All PASS.

Compiled AffiliateRevenueRepository produced capturev7 then full-refundv8 on a disposable owner, then rejected stalev7/repeatedv8 without changing persisted counters/ledger. Four further cases used uniquely prefixed isolated Mongo collections and a one-shot write-boundary fault wrapper: before counter write, after durable partner intent, after contribution write, after counter commit before payment acknowledgement. Each interrupted state was checked, then fresh service/repository instances recovered once and replay remained unchanged; primary pending cleared without advancing its original version. Initial harness assertion assumed insert retained version7; Spring correctly initialized it to0. Fixed the harness to compare the observed pre-recovery version; no product change. All four final cases PASS, all temporary documents/collections cleaned.

These are actual compiled service/repository + Mongo integration tests with harness-injected faults, not full provider/HTTP/process-kill tests. The earlier collMod-based full-flow injection remains NOT RUN; do not relabel it. Frontend-local browser and installed production artifact remain unproven. Latest frontend watcher PASS23:05:35Z/sync23:05:37Z. Continue Calendar last, retaining financial fixture/evidence rather than resetting paid outcomes.


### 01:16 CEST — resume full-flow fault coverage; first interruption PASS

User requires remaining full-flow cases before Calendar. Calendar had only fixture/browser startup; no checklist action. Its unused gallery fixture was reset through the versioned harness and windows closed. Financial fixture/outcomes retained. Existing server/.env.secrets contains the valid configured Mongo admin credential, differing from the stale dev-container environment. Read-only authentication succeeded. Fixture now accepts explicit QA_MONGO_ADMIN_ENV_FILE for arm/disarm, passing credentials over stdin without logging; ordinary actions retain application credentials. This resolves the earlier collMod blocker without changing accounts, privileges or Mongo runtime.

Actual normal second-buyer UI payment on event...008 while owner-scoped intent validator armed: payment6ab45d96de5ce0e8f4b553f0/gatewaycc078151-0ddf-49ef-8dc8-e96b81802154 capturedEUR2, version3, affiliateRevenuePending=true; purchases10/bookings9/EURgross167 unchanged. Removed validator using recorded original options. Existing30s worker recovered automatically: same paymentversion3/pendingfalse, partnerrevision64, purchases11/bookings10/EURgross169/refunded41/net128 +HUF5000. No replayed payment or manufactured counter outcome. Intent failure full-flow PASS. Remaining ledger/commit/ack in progress.


### 01:22 CEST — all four full-flow interruption recoveries PASS

Following the intent case, the second buyer paid the existing isolated controls through normal UI/provider checkout. The owner/event-scoped validators interrupted actual application writes; original validators were restored after each observation, and the existing 30-second worker completed recovery without replaying the payment.

| Boundary | Primary payment / gateway ID | Interrupted state | Recovered state |
| --- | --- | --- | --- |
| ledger | 6ab45dd3de5ce0e8f4b553fa / 489eeaa6-2426-44e8-8b93-6ffa059507f3 | captured EUR3, v3, pending=true; durable partner intent revision65, ledger blocked, EUR169/41/128 unchanged | v3, pending=false; revision67, purchases12/bookings11, EUR172/41/131 |
| commit | 6ab45ea1de5ce0e8f4b55403 / fa8d2e1e-4913-41e5-8082-c4847b59d06a | captured EUR4, v3, pending=true; partner intent revision68; contribution v1/gross400 exists, totals172/41/131 unchanged | v3, pending=false; revision70, purchases13/bookings12, EUR176/41/135 |
| ack | 6ab45ee5de5ce0e8f4b5540c / ad26b092-8f00-4536-8af4-2d185fc21e40 | captured EUR5, v3, pending=true; counters already committed revision74, no partner intent, EUR181/41/140 | v3, pending=false; SAME revision74/counts/totals |

All three collections' validators restored to {} and no activeRevenueFault remains. Final native totals: purchases14/eventBookings13, EUR181 gross/41 refunded/140 net plus HUF5000 gross/net. Converted EUR193.50/41/152.50; persisted CZK selection should display4837.50/1025/3812.50 (final UI read pending). All earlier outcomes retained. This supersedes the earlier unavailable-collMod boundary: all FOUR actual UI/provider/Mongo/worker fault cases now passed, in addition to the isolated compiled-code probes.

User-reported payment? title corrected through central EN/HU translations: Would you like to proceed with payment? / Szeretnéd elindítani a fizetést? Existing frontend watcher build/sync passed23:19:29Z/23:19:31Z. The English question was observed in actual commit/ack payment confirmation dialogs; Hungarian runtime UI check remains pending. No payment transition changed.

### Refund acceptance clarification — 2026-09-24

User confirmed that a25% cancellation policy means25% returned,75% retained. The earlier checklist requirement to refund the remaining75 without a separate cause was wrong and is removed. User also explicitly distinguishes cancellation of the event: the full amount must be returned in that case. This separate organizer-cancellation path is under diagnosis and is NOT passed by the ordinary full-policy refund controls. No refund outcome or policy was rewritten.


### Final summary, callback replay and Hungarian confirmation — 01:30–01:37 CEST

Owner's actual Revenue popup matches14 purchases/13 event bookings and CZK4837.50 gross/1025.00 refunded/3812.50 net. Screenshot /tmp/qa-affiliate-final-recovery-summary.png inspected; shared compact currency menu and blurred background visible.

All four recovered gateway callbacks replayed through the simulator's audit endpoint; each returned200/delivery200, attempt2. Independent Mongo read: amounts/counts unchanged, no partner intent and no active fault. Normal callback processing advanced each payment version3→6 and partner revision74→86; this is distinct from the earlier acknowledgement-only recovery, which did not advance payment versions. All four primary pending markers remainfalse. No duplicate revenue. Original partial payment6ab41748de5ce0e8f4b54e52 remains100 paid/25 returned, refundStatuspartial and unchanged25% policy.

Hungarian browser-language emulation loaded the central HU bundle. Through normal second-buyer UI, opened an unpaid QA Affiliate Callback Control checkout and reached the actual final dialog: Szeretnéd elindítani a fizetést? / A kiválasztott tételt fogod kifizetni. Screenshot /tmp/qa-payment-confirmation-hu.png inspected. Back clicked; no payment submitted. This leaves a fixture-owned unpaid checkout draft for the second buyer on event...006. Two initial automation attempts reached empty lists before proper UI readiness; no payment result was produced. Reopening Explore loaded the real server records; the successful run waited for actual cards. No production code changed for this check.

Actual frontend-local LocalPaymentSummaryMapper executed with Node24 native TypeScript stripping (no Angular build/server, no network). MixedEUR181/HUF5000/refundEUR41 producedEUR193.50/41/152.50, selectedCZK4837.50/1025/3812.50; both incoming/outgoing signs, user-scoped selection, monetary zero and unknown-currency missingRates flag all PASS. This is focused mapper evidence, not a browser-local deployment PASS.

Cancellation boundary: source inspection found organizer Delete Event uses reversible trash/status suppression and Restore, not a distinct terminal cancellation. It skips the owner's leave-refund path and has no full-refund call. No event was trashed and no lifecycle/refund behavior changed. Asked the user whether the requested full-refund cancellation should be attached to this existing reversible action or a separate cancellation. This material financial behavior decision remains pending; do not infer an answer or report cancellation PASS. Both configured card processors advertise immediate capture, not delayed authorization/capture; an end-to-end hold-only checkout is not available through their current capability contract. Existing authorization-zero unit source is not full-flow hold evidence.

Remaining explicit boundaries: organizer cancellation decision/implementation and full-flow proof; live no-rate payment/incomplete UI case; frontend-local browser deployment (current running frontend is HTTP); installed production artifact qualification is not performed by source/config parity checks. Calendar remains queued, phone connected, no Calendar action taken.


### 2026-09-24 01:56 CEST — default FX in every deployment mode

User correction replaces the former normal missing-rate test: first payment and source outages use an immutable seeded default. Added identical `default-v1` observations to demo/e2e/production seeds; frontend-local already has the same seven values. Production package allow-list, upgrade allow-list migration and development import allow-list include the collection. The common importer uses `$setOnInsert`; replace-import and empty seeds cannot clear exchange-rate history.

Verification: shared configuration/default import integration test PASS against an isolated collection in the existing Mongo; fresh insert, repeat import, changed seed cannot overwrite historical default, daily rows survive. Common entrypoint continuation test PASS. All 41 classified seed baselines/parity PASS (also synchronized existing i18n bundle timestamps and declared the already-intended REAL ECB / DEMO simulator source difference). Existing backend watcher compiled the exchange changes and restarted successfully at 01:47:04.

`run-finance-version-probe.sh default-fx` PASS with the watcher's actual compiled classes and Mongo: persisted default 5000 HUF -> 12.50 EUR; new cold store reads persisted data; daily quote wins when applicable; old daily quote falls back to default during outage; refund keeps original default snapshot; CZK summary resolves default observation with zero missing rates. No FX HTTP or second application build. Probe-only initial accessor typo and HALF_EVEN aggregation oracle were corrected; final probe passed, temporary collections removed. The existing 14/13 paid QA results were untouched. This proves source/import and cold read, not a newly built/installed production artifact or an additional real provider payment under default-only configuration.

Campaign remains IN PROGRESS: organizer Cancel/Delete batch refund and changed-paid-terms participant cancellation implementation/full-flow QA remain, plus frontend-local browser coverage. Calendar stays queued. The old live missing-rate/incomplete-UI next action is superseded.


### 2026-09-24 02:03 CEST — separate refund operations, partial then cancellation

User explicitly confirmed each refund operation is a separate payment record. Corrected the in-progress refund implementation: original payment keeps cumulative 100, first audit remains25/provider receipt1, later cancellation creates a distinct75/provider receipt2. Same cumulative target replays the same operation and row; a stale25 request never lowers the primary total. A completed prior audit is materialized before persisting the next intent. Removed the service-wide synchronized lock; version fences and operation-scoped receipt checks protect concurrent calls without blocking unrelated refunds.

Existing watcher build/restart PASS at02:01:31. `run-finance-version-probe.sh refund-intent` PASS against actual compiled PaymentService + Spring Data versioned repository/Mongo, with an explicitly modeled provider double: normal25->100, lost response after provider commit plus fresh service instance, and delayed25 receipt concurrent with another service completing100. All produce exactly two provider operations25+75 and two refund rows25+75; stale/full replay makes no additional provider call. Temporary probe collections removed; retained campaign payments unchanged. Initial probe attempted a package-private test constructor; changed to public production constructor before successful execution. This is focused concurrency/recovery proof, not the outstanding organizer/participant browser/provider cancellation journey.

Follow-up at02:04: added legacy partial refunds without the new intent fields and cash-path cases. All five compiled service/Mongo scenarios PASS. For already completed first refunds, the probe additionally compares the entire stored first audit document before/after cancellation: it remains identical. Cash operations also create separate25/75 rows. No additional normal refund entitlement or arbitrary second refund was introduced; the full-refund caller still belongs to the pending cancellation implementation.

### 2026-09-24 02:33 CEST — cancellation partial-to-full provider boundary

Owner used the normal event-card Cancel event action and confirmation on retained
`6aff20000000000000000001` (EUR100, prior policy refund25). Initial scheduled work
persisted the75 intent but failed provider lookup: dev shares REAL/DEMO database,
and scheduler mode had selected REAL. Fixed by persisting the authenticated
request's session mode on the cancellation intent; retries retain that provider
context. After existing watcher rebuild, replayed the same authorized Cancel HTTP
request (200/already-applied), without resetting fixture or fabricating a receipt.

Independent Mongo and simulator audit: provider refunds25+75, primary cumulative100,
booking cancelled, two separate refund history records. Prior25 document is exactly
unchanged; event title/subtitle/dates/location/pricing/policies/images/capacity/status
are unchanged, status A (not Trash), cancellationRefundsComplete=true. HUF and two
concurrency control payments remain unchanged. One cancellation outbox operation
sent. Provider-double checks are not used as substitutes for this result.

This proves the financial boundary only; membership/ticket projections, participant
terms-change choice, organizer multi-booking/Delete, admin removal, authority,
replay and frontend-local checks remain in progress. Admin removal full remaining
refund is now an explicit checklist case per user instruction.

### 2026-09-24 02:35 CEST — admin removes paid member, provider/UI boundary

Owner opened QA Affiliate HUF5000 -> Members -> Affiliate QA Visitor -> Remove
member -> Remove. UI count2->1 and Visitor removed, owner remains. Mongo membership
status deleted; primary `6ab42e95de5ce0e8f4b54ea2` booking cancelled/refunded5000,
no pending refund request marker. Simulator payment
`b6d1fa42-ee97-46b3-8e2c-95cc4abbc278` has one successful HUF5000 refund
`bc1a33f9-1f2b-3001-b4f3-afef1f79b769`. Separate history amount5000. This exercises
the actual menu/confirmation, Java queue, background processor and provider;
member-list replacement and fault/retry/local variations remain unverified.

### 2026-09-24 02:44 CEST — changed programme and individual cancellation

Owner Unpublish -> Drafts -> Manage Event -> Edit changed the description of
`6aff20000000000000000013` to an updated acoustic programme and saved/republished.
Both existing7EUR payers received eligibility and a sent changed-terms notification;
no refund occurred from editing alone. The modifying owner is absent from recipients;
producer now explicitly excludes the modifier even if they also have a payment.

The real list menu initially omitted the refund entitlement (outer popup menu
subject omitted the DTO field). Fixed that mapping and rebuilt via frontend-sync.
Second buyer then used Cancel with full refund -> confirm. Own payment
`6ab450e9de5ce0e8f4b553b6`: refunded7, booking cancelled, separate7 history, queue
cleared, membership suppressed. Other buyer payment `6ab450b4de5ce0e8f4b553b2`
remains joined/unrefunded and membership accepted. Dialog closed successfully.

A noneligible cancellation on event12 initially returned misleading200/no mutation
because dev policy bypass entered the organizer branch. Added explicit event-admin
role check before that branch; replay now409. This is a domain-role check in the
shared implementation, not production-auth qualification; the dev stack does not
prove protection against caller identity spoofing under production security.


### 2026-09-24 02:57 CEST — explicit rule corrections, implementation in progress

- Participant **Cancel with full refund** must create a pending refund request for the organizer; only approval may call the provider. The earlier 02:44 automatic participant-refund test is **SUPERSEDED**, not proof of this corrected flow. Retain its already-completed financial records; no rollback or seeded replacement.
- Organizer Cancel → Unpublish → Publish reactivates the event, with fresh Join required for prior participants. Old payment/refund audit remains unchanged; old approvals/tickets must not restore admission. Repeated Publish must preserve newly joined participants.
- Implementing and verifying these two branches. Previously recorded FX, aggregation, recovery and organizer/admin refund evidence remains valid. Overall checkpoint remains **IN PROGRESS**.


### 2026-09-24 03:12 CEST — targeted revised branches

- **PASS, organizer UI Cancelled → Unpublish → Publish** on retained EUR100 event `...000001`: active status A, cancellation marker cleared, only organizer remains accepted; previous visitor membership is `removed`. The original100 payment and separate25/75 refund documents/provider IDs remain unchanged. Fresh Join and replay preservation still under test.
- **PASS, participant request → organizer approval**, actual browser actions on `QA Revenue Recovery ledger` (`...000009`), second attendee. Owner unpublishes/changes description/saves/republishes; second chooses Cancel with full refund. Primary `6ab45dd3de5ce0e8f4b553fa` remains captured3, no refunded amount, provider refund list empty; one pending refund history, organizer counter1, participant suppressed. Owner Payment history Approve refund creates exactly one provider refund3 (`799f825a-575f-3dd5-9221-f474ed532def`), primary cancelled/refunded3, request approved, counter0. Authenticated approval replay200 retains approved/counter0. Independent provider snapshots retained privately under `/tmp/affiliate-approval-{before,after}-provider.json`.
- Frontend-local focused unit suite **4/4 PASS**, direct Vitest single worker (existing watcher does not run unit tests; resource checked; no second application build). New case persists partial25 + pending75 through serialized state, rejects unrelated approver, approves once, retains separate25/75 and unchanged other payment.
- Payment history showed missing CZK conversion because retained primary snapshots referenced daily2026-09-23 but only default-v1 observation was present. Corrected summary lookup to use the persisted default when the dated observation is absent; no payment snapshot or historical amounts were rewritten. Approval replay summary now missingRates0 and CZK outgoing3987.50/incoming5012.50. Removed unsolicited header explanation. Browser reload check pending.
- Publish/Unpublish titles now use existing EN/HU i18n keys with full questions; browser Publish dialog verified `Do you want to publish this event?`. Source/Mongo i18n audit passed. Overall **IN PROGRESS**, not complete.


### 2026-09-24 03:23 CEST — header and fresh admission replay

- **PASS, two payment summary badges** in the existing managed browser: normal/hover/press have identical bounds and `transform:none`; hover brightness0.96/shadow and press brightness0.90/inset shadow provide feedback. Container width487=scrollWidth487 at desktop, and347=347 at360px; no horizontal scrollbar or page overflow. Both badges stay on one line; no explanatory header line. Existing frontend watcher compiled/synced03:15:50; no separate application build.
- **PASS, fresh admission after Cancel → Unpublish → Publish**, event `...000012`. Found and fixed stale paid baskets restoring Continue: republish retires old reservation results; Explore clears their saved continuation. Actual second-buyer browser now opens Book Event → Join → confirmation → fresh EUR7 payment review. New basket `6ab47b5bde5ce0e8f4b554cc` is confirmed/pending with an active reservation and no old checkout session. Membership is pending; prior visitor stays removed. Four old baskets retain their history/status/session IDs but have result deleted and inactive reservations. No new payment was submitted.
- Repeated authenticated organizer Publish returns200/changedfalse, accepted1/pending1; new basket/reservation and member pending state remain unchanged. Both old7 primary payments remain fully refunded and their two separate audit records remain.
- Default-FX compiled Java/Mongo probe **PASS**, including an absent historical daily observation: CZK conversion uses the persisted default with missingRates0 while preserving the primary snapshot. Overall checkpoint remains **IN PROGRESS**; partial25→pending75→approval backend/provider branch and remaining checklist boundaries are not claimed complete.

03:29 user-directed visual adjustment: Waiting for payment badge bottom offset5.2rem→3.6rem (25.6px lower, closer to profile-eye). No new visual test or QA replay for this cosmetic adjustment, as explicitly requested. Existing refund flow continues.


### 2026-09-24 03:34 CEST — partial refund then changed-terms approval PASS

Actual owner/second-buyer browser flow on republished EUR100 event `...000001`: new Join requires a fresh admin approval. After approval membership remains pending/Waiting for payment; Continue opens payment directly without a new Join confirmation. Real simulator-backed payment `6ab47c96de5ce0e8f4b554d6`, gateway `803fed66-0e24-4ff7-86d7-85eeb94b8038`, captures100 and then admits the member. Ordinary Request refund → owner Approve refunds25 under the stored25% policy.

Owner Unpublish → edit description/programme → Save → Publish grants changed-terms eligibility without a further refund. Participant Cancel with full refund creates pending audit `refund:6ab47c96de5ce0e8f4b554d6:10000` for75, owner pending counter1. Primary remains refunded25; independent provider audit still contains exactly one25 operation. Owner confirmation displays Refund75/Retained0 and changed-terms basis. Owner Approve refunds75, primary cumulative100, request approved, counter0. Separate operation IDs:25 `02115b14-7139-3932-99a3-acb37f31259d`,75 `ae1df272-0cb6-333e-9243-4c2c60c4bb34`. Authenticated approval replay200 adds no operation. Exact JSON comparison proves the first25 audit and provider receipt unchanged. Private before/after evidence `/tmp/affiliate-partial25-audit-{before,after}.json`, `/tmp/affiliate-partial75-{pending,approved}-provider.json`. The old visitor100 and its separate25/75 records were retained, never reset.

Final independent provider oracle for prior organizer batch Cancel12 and Delete13: all four primary payments `6ab44f46de5ce0e8f4b553a1`, `...3a2`, `6ab450b4de5ce0e8f4b553b2`, `6ab450e9de5ce0e8f4b553b6` have cumulative7 and exactly one successful7 provider refund each. Event12 is republishedA with the new unpaid second-buyer reservation; event13 remainsTrashT. No duplicate from the repeat Cancel/republication boundary.

Remaining checklist boundaries are still tracked separately: interrupted cancellation batch/provider failure, member-list replacement and local/browser parity; Calendar remains last. No full-checkpoint PASS claimed.
