# Affiliate invitations

Profile → Affiliate opens the existing integration settings popup. Personal
referrals and API participant counts arrive in its one authenticated
`GET /integrations/settings` response. No separate stats request or polling was
added. The landing Partners popup describes the same feature. All new UI copy,
including titles, tooltips and accessibility labels, uses EN/HU i18n keys.
The landing Affiliate role and the profile entry action use the same pink
palette and `group_add` icon, distinct from the other partner roles.

## Personal link

- `affiliate.url`: public, opaque `/entry?affiliate=<code>` link, stable per owner.
- `affiliate.registered`: number of attributed profile registrations.
- A separate badge in the block's top-right heading shows the count, including
  zero. The copy action has no counter.
- Entry retains the first valid code in session storage across authentication.
  Onboarding sends it with the existing profile save request and clears it on
  success. No request is made merely to capture the code.
- The backend resolves the owner from the stored link. Only creation of a new
  profile accepts attribution. Existing-profile saves, self-referrals and
  unknown/deleted owners do not create new attribution.
- Attribution is stored with the profile before its insert-only audit row is
  written. A failed audit write is surfaced; repeating the profile save retries
  the same recorded attribution rather than taking a new inviter.
- The audit key is the referred user ID, so retries cannot double-count.

## API participant ratio

The Client keys heading shows `registered / imported` in one background-filled
badge before the key creation action. It counts distinct external `participantId` values scoped
to the authenticated API owner across event invite imports. Reimporting the
same person or inviting them to another event does not increase the total.
The numerator counts imported IDs linked to registered accounts through the
existing claim flow; those accounts need not have been newly created. The
translated tooltip explains that distinction. Late event claims retain their
existing identity-link behavior.

## Audit and future economics

`affiliateLinks` binds owner IDs to public codes. `affiliateRegistrations`
records the referred user ID, referrer ID, code and registration timestamp.
These records have no names, contact details or payout entitlement. The backend
summary exposes only a count to the referrer, not another member's history.

For an authorized operator audit, the referred user ID links to the existing
`activityMembers.userId` and `payments.userId` records. Those preserve event
membership/attendance and financial transaction evidence. Inspect payment
status, audit kind, currency, refund and booking fields; do not treat all
payment rows as spend or add different currencies together. Affiliate-specific
spend/event aggregates, payouts and discounts have not been defined or added.
Existing API import/claim audit remains in `integrationParticipantInvites` and
`integrationExternalIds` with owner and external/internal identity mapping.

Backend audit survives profile deletion; any future retention policy or reward
system must handle these minimal historical IDs explicitly. Local mode stores
its referral history on the inviter's IndexedDB record and preserves it across
ordinary profile edits; it has no external API participant import, so that
ratio is 0 / 0.

## Verification — 2026-09-22

- Existing frontend and backend watchers compiled the changes successfully.
- 48 focused Java tests passed (AffiliateService 4, HomeUserProfileService 40,
  IntegrationTokenService 4), including new attribution, existing-user rejection,
  original-attribution retry, invalid/self/deleted-owner and insert-only audit.
- Two focused frontend tests passed: first-code retention/clear and local
  stable link, unique count, self/invalid rejection and protected profile mapping.
- `python3 "tests/qa/categories/API test/tools/verify-affiliate-settings-http.py"` passed against the
  running dev stack: one shared response, stable URL, owner isolation, 1 / 2
  after duplicate imports, and independent personal referral count. The script
  creates reserved prerequisite records and cleans them up; it does not claim
  a real Firebase registration journey.
- The independent `AFFILIATE-INVITATION-001` CDP case passed real new-demo-user
  onboarding, personal count 0→1, API participant count 0/0→0/2→1/2, replay, full
  reload and key revocation without losing either counter. The accepted result is consolidated in the
  [affiliate-invitation case](../../../tests/qa/categories/API%20test/referrals.md).
- Firebase external-provider onboarding and clipboard interaction were not
  exercised. Earlier rating and API PASS records remain unchanged.

Focused frontend command (from `frontend`, no application build):

```bash
./node_modules/.bin/vitest run --maxWorkers 1 --no-file-parallelism src/app/shared/core/base/services/affiliate-referral.service.spec.ts src/app/shared/core/local/source/repositories/integration.repository.spec.ts
```

The dev Java verification reused the watcher-compiled main classes, excluding
`compileJava` and `processResources`. Do not run a duplicate app build alongside
the existing watchers.
