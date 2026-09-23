# AFFILIATE-REVENUE-001 — 2026-09-23

Status: IN PROGRESS. Full-flow user delegation active. Admin client fixture reset before entry; invitation fixture status returned no active state, no owned users/referrals/tokens. Use existing dev watchers only. Stable checklist: ../checklists/api/AFFILIATE-REVENUE-001.md.

## Initial UI and registration

Owner 6aff10000000000000000001: Revenue green header pill 83.94px desktop, 36px at 360px viewport without overflow. Summary zero purchases/bookings/net. Registered new invitee demo-profile-86b7cd0a-8f9d-4de9-9e59-7a2a56738045 through the actual personal link and normal onboarding/photo upload. Mongo attribution points to owner; registration alone did not seed payments/revenue. `stage-revenue` creates two scoped event prerequisites (6aff20000000000000000001 EUR100, ...002 HUF5000), zero financial outcomes.

## User correction: demo Cards

Explore entry -> disposable owner -> Payments -> Cards works on dev HTTP, including 360px 36px compact control and opening the empty cards list. Fresh local seed now selects simulated Stripe; local menu poll derives availability from the operator configuration instead of literal false. Explicit cash-only null is preserved by the mapper. Fresh payment-simulator SQLite state now seeds a connected simulated Stripe provider; retained cash-only state stays unchanged. Existing live simulator was already configured, so no restart/rebuild. Frontend watcher PASS. New Go regression could not run: dependency download modernc.org/sqlite remained stalled; stopped only disposable test container. No live service stopped.

## Blocking UI defect found during payment entry

New invitee has browser location permission already granted but no saved location coordinates. Existing UI correctly disables server actions; however the setup popup hid Update when both toggles were disabled, making coordinate acquisition unreachable (notifications are not configured). Narrow fix keeps Update visible while profile location is missing. Retest pending; no fixture coordinates injected to hide the defect.
