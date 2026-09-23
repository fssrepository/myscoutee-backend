# OPERATOR-EMAIL-WARNING-001 — 2026-09-23 progress

Status: PASS on the dev HTTP/Java stack. Local adapter runtime and latest standalone regression tests NOT RUN. Local stub only; no real provider delivery.

## Runtime boundary

- Existing backend/frontend watchers own all builds.
- Temporary dev-only `application-dev.yaml` SendGrid endpoint: `http://172.19.0.1:18991/v3/mail/send`. Restore environment/default expression after QA.
- Receiver: `email-provider-stub.py`, port 18991, output `/tmp/myscoutee-email-qa.jsonl`, HTTP 202. It never forwards mail or writes Authorization headers.
- Versioned four-actor fixture staged; permanent purge disabled and warning interval shortened. Operator/Ava managed sessions launched by the versioned launcher. Fixture and sessions retained for continuation.

## Verified

1. Operator UI selected SendGrid and saved synthetic credentials with an `example.invalid` sender. Secret input clears after save and shows retained-key placeholder after reload.
2. API rejects unknown provider, malformed sender and enabled-without-key (400), stale revision (409), and Ava non-operator GET/PUT (403). Blank-key save preserves credential. Mongo holds encrypted envelope, not plaintext; responses exclude test key. `/tmp/qa-email-contract-result.json`.
3. Ordinary worker accepted exactly one Due request at 14:55:29Z; Too early, Already expired and Restored were not sent. Body includes exact permanent deletion date `2026-09-28T14:39:11.152Z`. Subsequent scheduled runs through 15:03Z did not duplicate it. Persisted sent outcome and deletion episode marker agree.
4. User-requested UI correction: Email moved immediately after Firebase, uses shared configuration-block/field/ON-OFF/action styles. Save is labelled and inside its block. Existing watcher compiled 15:01:26Z; CDP verified ordering, appearance and no horizontal overflow at desktop width.
5. OFF save persisted across browser reload; saved key retained. Final Save state checks PASS: absent after persisted OFF, enabled for valid changes including pending disable, disabled for invalid/unchanged/reverted drafts, disabled after successful ON save. CDP `/tmp/qa-email-save-states.js`.

6. EN/HU email labels and Save text verified in managed browser. Browser local/session storage and both IndexedDB stores contain no synthetic key.
7. At 360px, fields stack and remain inside block; no horizontal overflow. User-reported bottom clipping reproduced: flex item height was shorter than its overflowing grid contents. Configuration container now does not shrink; at maximum scroll, both ON/OFF leave 6.6–7px bottom padding at 360px and 960px. Email uses the existing cyan palette after user requested distinct contextual color.
8. Admin Jobs UI lists periodic warning, suspend/run controls and fixed five-day description. Runner history shows one affected delivery followed by zero-affected runs; OFF status explains provider disabled.

9. Re-staged failure baseline: while email OFF an eligible Due episode remained unclaimed and no stub requests were made through ordinary runs. After enabling via UI, 401 produced one `failed` delivery (15:11:36Z), null provider receipt, and matching handled episode marker; no duplicate through subsequent ordinary runs (confirmed 15:19Z).
10. Separate user timing question: managed-browser resource timing found `/operator/updates/releases` 3946ms vs `/operator/registry` 29ms and `/operator/leaderboard` 22ms. Frontend gates entire operator page on initial workspace Promise; backend release service reads GitHub list and signed release metadata. Subsequently repaired: release checking runs independently from avatar hydration, sharing one in-flight request; delayed-release CDP check proves the share list/Configuration remain available. The dev Compose simulator serves the actual signed package locally; see DEV-RELEASE-SIMULATOR-20260923.md.

11. Normal Casey user GET/PUT email configuration both return 403. Only the three versioned launcher sessions were used.
12. Lost-response failure reproduced: stub accepted one complete envelope then closed without an HTTP response; persisted outcome was incorrectly `failed`. Provider result now distinguishes unknown transport outcome from an explicit rejection. Worker persists `unknown` and keeps the episode handled, suppressing duplicate sending. Fresh-fixture replay passed; see item 14. Existing backend watcher compiled and restarted successfully at 15:31:52Z. Regression tests added for lost response and unknown/no-resend; standalone test runner NOT RUN because the dev pipeline owns compilation.
13. User side correction: Event editor now opts into shared menu's existing two-column mobile layout. Live 360×780 browser inspection confirms paired 139.5px buttons without horizontal overflow; no Event saved. Operator already used this setting, confirmed paired 154.9px buttons at 360px. Screenshots `/tmp/qa-event-two-columns.png`, `/tmp/qa-operator-two-columns.png`.

14. Fresh lost-response replay PASS: one request logged, outcome `unknown`, null receipt and handled marker. Later scheduled runs did not resend. `/tmp/qa-email-unknown-fixed-status.json` and `/tmp/myscoutee-email-qa-unknown-fixed.jsonl`.
15. User-requested retry supplement implemented: initial attempt + maximum three retries; persisted attempt/status/next time, atomic claim, retry selection independent of the regular hourly scan, existing Admin Job suspension/history retained. Connect failures, 429 and 5xx may retry; explicit permanent rejection and unknown delivery do not. Normal delays 60/120/240 seconds, honoring longer Retry-After. Indexed due/stale-claim queries on both databases.
16. Shortened dev replay (base 5 seconds, poll 1 then 2 seconds) PASS. Two due actors both reached attempt 4. Recipient 0: 503/429/503/202 => sent. Recipient 1: four 503 responses => terminal failed. Exactly eight requests, no fifth attempt. Persisted next-attempt fields removed. Delays were 5.086/80.118/20.108 seconds and 5.091/80.116/20.108 seconds; the middle delay includes deliberate admin suspension beyond the recorded ten-second due time. `verify-email-retry-qa.py --stub-log /tmp/myscoutee-email-qa-retries.jsonl --base-delay-seconds 5` PASS. Evidence captured at 15:44Z; last sends at 15:43:37Z.
17. Job remained configured for its normal one-hour scan throughout the retry replay, proving due retries independently wake it. Suspension through Ava UI held both claims at attempt 2 with only four requests, including hot-deploy restart at 15:42:51Z. Unsuspending resumed at attempt 3. Admin UI/history and Mongo record four scheduled runs; final mixed outcome correctly reports one accepted delivery and a failed run for the rejected sibling. No credentials or real mail used.

18. Queue guards PASS using the versioned `stage-retry-guards` baseline. With email OFF, two overdue retry claims stayed at attempt 1 and no requests occurred. Enabling through the Operator UI cancelled both claims: one restored owner, one past its purge deadline. No provider call; next-attempt timestamps removed. This proves eligibility from prepared states, not an account-restoration UI journey. `/tmp/qa-email-retry-disabled.json`, `/tmp/qa-email-retry-guards-status.json`.
19. Cleanup PASS: managed windows closed; exact fixture reset removed all four disposable users and delivery claims; previous email configuration and both Job settings compare exactly with retained pre-stage snapshot. Stub stopped. Temporary endpoint, retry delay and polling overrides removed. Normal retry/poll defaults remain 60/120/240 seconds and 60000ms. Persistent dev release simulator intentionally remains running.

## Verification boundaries

- Existing backend/frontend watchers compiled affected production sources. Latest standalone regression tests were added but NOT RUN alongside the running compilation pipeline.
- Browser-only local adapter: source guard verified, runtime NOT RUN; no separate local runtime started.
- No real mail or inbox delivery, exactly-once inbox guarantee, or production deployment claimed. External updates were downloaded from the local simulator only; no installation performed.
