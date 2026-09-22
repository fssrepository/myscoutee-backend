# Gallery, Photo Feed, content moderation and operator email

Implementation continuation record, 2026-09-22. This records the user's requested sequence; it is not a QA PASS report or release approval.

Calendar addition (2026-09-23): manual ICS download is implemented separately in `20260922-calendar-subscription.md`, with new `EVENT-CALENDAR-EXPORT-001` QA. Five backend and seven frontend focused checks and Angular build passed. Runtime/physical Android import remains NOT RUN pending user-started dev stack and device; this is a fifth new runtime case, not an extension of earlier PASS evidence.

## 1. Shared gallery and Photo Feed — implemented; browser QA pending

- One signal-opened configurable gallery popup: editable/read-only, arbitrary caller URLs, image limit and metadata.
- Event editor: five images, first image is cover, cover-only editor surface with upper-right expand button; arrows only inside gallery. Published/no-write event galleries are read-only.
- Common image management popup: location + short caption with remaining-character counter. Management panel button replaces copy in editable gallery. Read-only gallery shows location upper-left and caption below, without ellipsis. Current caption limit is 40 characters.
- Profile **info/view** popup only (not editor): keep the header, fit the whole image into the first visible body viewport, especially on mobile. Free scrolling remains available throughout; the lower-right arrow both signals more content below and optionally scrolls the same body to the following profile details; no expandable section or separate magnifier. Implementation added; live viewport verification remains pending.
- Admin Article image editor uses the same per-image metadata; existing image limits elsewhere remain configurable.
- Side-menu Photo Feed button between Table and Followed. Feed header has Add and Close. Add opens the same gallery editor, maximum five images.
- Feed uses SmartList and route delay, shared multi-image InfoCards, creator avatar, first-image caption, distance, expand action. Card activation advances images. Nearest 5 km group first; submission date descending within each group.
- Canonical local/HTTP save and reload, bounded paging, no post until explicit submit, retry/idempotency.
- Current verified: Angular template/type check and dev bundle build; **109 backend tests passed**, zero failures/errors/skips. Final focused frontend set: **36 passed, 26 unrelated tests skipped**. This includes repeated support-message delivery without duplicate unread counts and persisted pending-message intent. A broader existing events-service suite exposed missing counter mocks and an unrelated notification expectation; its full suite is not claimed as passing. i18n audit: 7,344 messages across EN/HU and all three Mongo seeds synchronized.
- Runtime: user dev containers stopped during implementation. No stack/browser was restarted.

## 2. Shared admin content moderation — implemented; browser QA pending

- Separate moderation menu, visually consistent with reported users, not a user-report workflow.
- Two intersecting filters: state bucket on the left (Under review / Accepted / Rejected / Blocked), category on the right (All / Event / Asset / Feed, default All), following the chat pattern and contextual icons/colors. All is a query choice, never a resource category. Totals are sums of the three stored write-side counters, not row counts.
- Shared global settings/state across admins. No take/assignment action. No admin notification.
- Write-side stored category/status counts, not counting rendered rows or constructing counts on reads. Admin moderation badge updates through polling and reflects effective moderation rules.
- Rows have three-dot actions; click opens the actual read-only Event editor / Asset editor / gallery, never a subevent view.
- Every moderation decision uses confirmation. Unblock returns Blocked to Under review. The save response carries the canonical item and stored-counter snapshot; only after success, the active state AND category determine SmartList membership (`patchVisibleItem` for matches, `removeVisibleItems` otherwise), without a full reload. Reject/Block can include a message, delivered through existing App Support chat, following the user-block/review conversation pattern.
- Settings button beside Close: automatic approval is a common AppMenu toggle with a visible switch, matching Event Explore; the delay input sits beside it. Applicable categories use the common multi-select AppMenu. Global settings, visible identically to other admins.
- Automatic approval runs periodically as a separate `content-auto-approve` admin Job. Even zero-delay submissions enter Under review until that Job runs. Suspension, due time, run history and failures use the existing Jobs registry. The global moderation settings control eligible categories and item age. Backend worker, Mongo/local Job catalog, UI, local worker and focused tests are implemented. Nonaccepted items are hidden using the existing blocked lifecycle state, preserving the previous state for acceptance; pending moderation never uses the owner-release state.

## 3. Operator email configuration — implemented; stub QA pending

- Operator configuration block for connecting an email provider, e.g. SendGrid.
- Provider catalog supplied by backend, using payment-provider configuration pattern; no frontend hardcoded provider list.
- Registered backend providers supply the catalog. SendGrid uses its existing HTTP mail adapter; the credential is encrypted with the existing AES-GCM secret envelope and never returned in configuration DTOs. Blank secret input retains the saved key; revision checks reject stale saves. Browser-only local mode explicitly requires a connected backend instead of pretending to store/send credentials.
- Initially used only to warn a deleted-account owner before permanent account purge. Send exactly five days before permanent purge, with a fixed rule (no separate configurable lead time). Add the corresponding automatic admin Job.
- All new UI strings use i18n. No unrelated email campaigns added. The warning worker records a durable claim per deletion episode, rechecks restored accounts and excludes expired accounts. Failed/uncertain delivery is recorded without blind resend; provider acceptance does not prove inbox delivery. The current email body uses the English bundle; EN/HU UI labels are present.

## Completion evidence still required

- Focused implementation checks are complete. Live save/reload, concurrent admin views, persisted Mongo counters, viewport layout and provider/Job interaction remain unproven until the two runtime cases run.
- Added [EVENT-GALLERY-FEED-001](../qa/checklists/event/EVENT-GALLERY-FEED-001.md) and [OPERATOR-EMAIL-WARNING-001](../qa/checklists/operator/OPERATOR-EMAIL-WARNING-001.md), both NOT RUN, without rewriting previous PASS checklists. Each has a versioned fixture and managed-browser checkpoint; email has a repository-local stub. Fixture syntax and checkpoint JSON were checked; no fixture has been staged yet.
- The user explicitly delegated automatic full-flow verification for two new QA cases: (1) gallery/event/feed, including moderation; (2) operator email configuration and deletion-warning Job with a local stub mail server. Live verification has not run. Finish implementation first and tell the user when to start their dev stack; do not start the stack independently.

## Verification artifacts (2026-09-22)

- Initial backend run: 109 tests, `/tmp/gallery-moderation-email-tests.log`. Gradle XML files are overwritten by later focused runs; do not infer the initial suite size from the current XML directory.
- Frontend focused Vitest: `/tmp/gallery-moderation-vitest.log`; build: `/tmp/gallery-final-build.log`; seed audit: `/tmp/gallery-i18n.log`. Temporary logs are supporting evidence, not durable browser-QA evidence.
- No dev stack, browser or SMTP stub started by Codex during this implementation. No real mail was sent.
- QA cleanup restores its settings/Jobs and removes disposable actors/domain records. Uploaded media files and admin Article/support audit records are retained; record those IDs in runtime evidence and remove the disposable Article through its normal UI. The fixture is not a full database snapshot.

## Moderation dual-filter correction — 2026-09-22

- Implemented state bucket on the left and All / Event / Asset / Feed on the right in local and HTTP paths. The default is All + Under review. Filter changes do not mutate content; moderation decisions move stored state counts independently of the currently selected category.
- Added canonical item + snapshot decision response, confirmed-save SmartList patch/remove, and Unblock → Under review. Added a status/ID index for the bounded All-category query.
- Verification: 12 focused backend tests passed (service, repository query, scheduled worker); 10 focused frontend tests passed (local repository, popup dual-filter/mutation handling). The frontend build passed after correcting the SmartList filter parameter type; backend compilation passed including the new index. i18n audit passed for 7,348 EN/HU messages across all three Mongo seeds.
- Logs: `/tmp/moderation-filters-backend.log`, `/tmp/moderation-filters-frontend.log`, `/tmp/moderation-filters-build.log`, `/tmp/moderation-filters-compile.log`, `/tmp/moderation-filters-i18n.log`. Runtime browser QA remains NOT RUN; checklist steps 12–13 include the corrected two-filter behavior.

## Queued additions: payment header and affiliate revenue

- Payment history All/Cards header triggers use the common menu's mobile `collapsible` configuration.
- Ordinary-user **Affiliate** popup gains a green **Revenue / Forgalom** icon button, compact on mobile. It opens basic aggregate metrics, with one set of gross/refund/net rows per currency, plus paid purchase and paid event-booking counts. No currency conversion, transaction table or monetary header badge. Admin **API** popup has no affiliate contents.
- Percentage commission is a future rule. **5% is illustrative, not configured or calculated.** Current amounts are referred purchase turnover after refunds, not commission or payout entitlement.
- A payment snapshots its referral owner from the saved registration. Settled primary payments contribute; authorization holds alone do not. Completed partial/full refunds reduce net amounts. Counts represent settled purchase/event-checkout records (historical counts stay after refunds), not unique event titles or open reservations. Audit refund/revision rows are not separately counted.
- Backend maintains `affiliatePartners` counters synchronously at payment save, with a separate per-payment versioned contribution ledger and one recoverable pending operation per partner. A pending flag persisted with the payment supports bounded retry after an interrupted write; summary load reads only partner totals and never projects payment rows. Counter acknowledgements preserve the payment domain version. API-key revocation does not touch attribution or revenue.
- Local adapter updates the owner's persisted summary on simulated approved checkout/refund writes. Public profile DTOs exclude private contribution/summary fields; normal profile save preserves them. Existing seeded local payment-history examples are not real financial ledger entries and do not fabricate referred revenue.
- Added new API-domain revenue QA, separate from old PASS cases. Live persistence/concurrency/mobile checks remain NOT RUN until the user starts the dev stack.

### Affiliate/payment-header focused checks (2026-09-22)

1. `./gradlew --no-daemon --max-workers=2 :projects:profile:test --tests '*AffiliateRevenue*Test' --tests '*PaymentService*Test' --tests '*IntegrationTokenServiceTest'` from `server`: **31 PASS**, no failures/skips (`/tmp/affiliate-revenue-backend-tests.log`). Includes authorization vs capture, completed refund amount, asset/event counts, durable pending acknowledgement/version and refund delta commit fencing; existing payment service cases still pass.
2. Focused local affiliate repository suite: **3 PASS** (`/tmp/affiliate-revenue-frontend-tests.log`). Repeated payment/refund, separate EUR/HUF totals, key revocation independence, public DTO privacy and clone preservation covered.
3. Angular local build: PASS (`/tmp/affiliate-revenue-frontend-build.log`). i18n audit: **7,378 messages**, EN/HU and all three Mongo seeds synchronized.
4. Cross-process Mongo atomicity, real gateway/simulator callback flow, persisted reload and mobile appearance remain NOT RUN in `AFFILIATE-REVENUE-001`. Unit tests do not establish those claims.
