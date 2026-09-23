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
