# Gallery, Photo Feed, content moderation and operator email

Implementation continuation record, 2026-09-22. This records the user's requested sequence; it is not a QA PASS report or release approval.

## 1. Shared gallery and Photo Feed — verification in progress

- One signal-opened configurable gallery popup: editable/read-only, arbitrary caller URLs, image limit and metadata.
- Event editor: five images, first image is cover, cover-only editor surface with upper-right expand button; arrows only inside gallery. Published/no-write event galleries are read-only.
- Common image management popup: location + short caption with remaining-character counter. Management panel button replaces copy in editable gallery. Read-only gallery shows location upper-left and caption below, without ellipsis. Current caption limit is 40 characters.
- Profile **info/view** popup only (not editor): keep the header, fit the whole image into the first visible body viewport, especially on mobile. Free scrolling remains available throughout; the lower-right arrow both signals more content below and optionally scrolls the same body to the following profile details; no expandable section or separate magnifier. Implementation added; live viewport verification remains pending.
- Admin Article image editor uses the same per-image metadata; existing image limits elsewhere remain configurable.
- Side-menu Photo Feed button between Table and Followed. Feed header has Add and Close. Add opens the same gallery editor, maximum five images.
- Feed uses SmartList and route delay, shared multi-image InfoCards, creator avatar, first-image caption, distance, expand action. Card activation advances images. Nearest 5 km group first; submission date descending within each group.
- Canonical local/HTTP save and reload, bounded paging, no post until explicit submit, retry/idempotency.
- Current verified: Angular template/type check and dev bundle build; 88 backend tests passed. Initial focused frontend set: 28 passed. A broader existing events-service suite exposed missing counter mocks and an unrelated notification expectation; the new published-gallery guard passed its focused retest (28 selected tests passed, 17 unrelated tests skipped). Do not claim the full suite passed.
- Runtime: user dev containers stopped during implementation. No stack/browser was restarted.

## 2. Shared admin content moderation — implementation in progress

- Separate moderation menu, visually consistent with reported users, not a user-report workflow.
- Category selector on left: Asset / Event / Feed, contextual icons/colors. Status selector: Under review / Accepted / Rejected / Blocked.
- Shared global settings/state across admins. No take/assignment action. No admin notification.
- Write-side stored category/status counts, not counting rendered rows or constructing counts on reads. Admin moderation badge updates through polling and reflects effective moderation rules.
- Rows have three-dot actions; click opens the actual read-only Event editor / Asset editor / gallery, never a subevent view.
- Every moderation decision uses confirmation. Reject/Block can include a message, delivered through existing App Support chat, following the user-block/review conversation pattern.
- Settings button beside Close: automatic approval is a common AppMenu toggle with a visible switch, matching Event Explore; the delay input sits beside it. Applicable categories use the common multi-select AppMenu. Global settings, visible identically to other admins.
- Automatic approval runs periodically as a separate `content-auto-approve` admin Job. Even zero-delay submissions enter Under review until that Job runs. Suspension, due time, run history and failures use the existing Jobs registry. The global moderation settings control eligible categories and item age. Backend worker and Mongo/local Job catalog entries are implemented; UI integration and tests are still in progress.

## 3. Operator SMTP/email configuration — queued after moderation

- Operator configuration block for connecting an email provider, e.g. SendGrid.
- Provider catalog supplied by backend, using payment-provider configuration pattern; no frontend hardcoded provider list.
- Provider credentials/configuration follow actual provider protocol and existing secret-storage boundaries.
- Initially used only to warn a deleted-account owner before permanent account purge. Send exactly five days before permanent purge, with a fixed rule (no separate configurable lead time). Add the corresponding automatic admin Job.
- All new UI strings use i18n. Do not expand into unrelated email campaigns.

## Completion evidence still required

- Finish focused regression checks and review local/HTTP parity for each implemented slice.
- Document new reproducible QA cases without rewriting previous PASS checklists.
- The user explicitly delegated automatic full-flow verification for two new QA cases: (1) gallery/event/feed, including moderation; (2) operator email configuration and deletion-warning Job with a local stub mail server. Live verification has not run. Finish implementation first and tell the user when to start their dev stack; do not start the stack independently.
