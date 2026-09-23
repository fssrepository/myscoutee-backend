# AFFILIATE-REVENUE-001 — referral turnover and refunds

Execution status and dated results are maintained in the QA matrix and evidence log. This case extends the API checks with affiliate revenue and payment lifecycle coverage. Use `python3 guides/qa/tools/affiliate-invitation-fixture.py stage`, then `status`, and the versioned `node guides/qa/tools/open-checkpoint-browser-sessions.mjs AFFILIATE-INVITATION-001` launcher for the disposable referrer/new invitee. Track the new identity with `affiliate-invitation-fixture.py track USER_ID` before onboarding save. Reset through `affiliate-invitation-fixture.py reset`; partner records are scoped by the disposable owner ID and contribution rows by `ownerUserId`, so the existing actor-scoped reset removes them. Never replace a currently staged baseline without its recorded reset;
 do not fabricate revenue on popup load. Record fixture ID, currency, checkout IDs and gateway callback IDs in dated evidence, excluding credentials.

1. Open the normal user's Affiliate popup at desktop and 360px width. Green Revenue/Forgalom button opens the summary; mobile compact icon keeps title/help/close visible. Admin API popup has no such button, referral link or imported counter. With content taller than the viewport (for example a short mobile viewport), the body scrolls to the last row while the header/close remain visible; no horizontal overflow.
2. With no settled payments, metrics are zero. Close/reopen must not mutate revenue. Merely registering a referral or revoking an API key must not alter financial totals.
3. Refer/register the second actor using the personal link. Save a EUR 100 event checkout through the existing payment simulator. An authorization hold alone contributes zero; successful capture contributes gross/net EUR 100, one purchase and one event checkout.
4. Replay the exact successful gateway callback and reopen the popup: amounts/counts unchanged. Check stored partner counters, contribution version and cleared payment pending marker.
5. Complete a second payment in HUF 5000. Its payment row retains HUF; the native ledger keeps HUF separate from EUR. The popup converts through persisted payment-day observations into the selected summary currency. An asset/client payment adds a purchase but no event-booking count.
6. Request a EUR 25 refund: request/pending/failure alone leaves totals unchanged. Complete it: EUR gross 100, refunded 25, net 75. Replay its completion: unchanged. Complete the remaining refund through supported payment rules: net zero, historical paid count remains one.
7. Use an isolated harness fault at (a) payment save before counter write, (b) persisted partner pending intent, (c) contribution save before counter commit, (d) counter commit before payment acknowledgement. Resume the pending write: each case converges once, with no duplicate amount and no advanced payment domain version caused by the acknowledgement. Do not terminate the user's entire stack.
8. Concurrent purchases/refunds by two referred users converge to their exact currency totals. A delayed lower payment version cannot overwrite a newer contribution. Reload from a new authenticated browser session confirms persistence.
9. Save the referrer's ordinary profile, revoke an integration key and reopen: revenue unchanged. Another user's summary exposes only their own aggregate; public profile DTO contains no revenue ledger or purchaser identities. No earned commission/5% payout is displayed or calculated.
10. Open Payment history at 360px: All and Cards collapse to their existing icons, remain accessible and functional, and allow the title space. Verify EN/HU labels. Currency-total pills stay on one line in a horizontally scrollable strip with scrolling when they overflow; hovering any pill must not lift or scale the strip. Scrolling reaches both ends, desktop keeps right alignment when all pills fit. Retain payment audit evidence and clean only disposable fixture records according to its reset contract.

Focused unit/build checks support this case but do not mark its runtime steps PASS. Actual provider acceptance/refunds, Mongo journal atomicity and mobile layout require full-flow evidence.

## Paid approval and payment deadline extension — 2026-09-23

The final user correction separates payment grace from approval. The earlier
Auto approve settings popup and the rule “Auto approve ON has no grace” are
superseded.

- Auto approve stays a direct toggle; it does not open a popup. The payment block
  contains a clock action opening the existing compact form style, with a separate
  Payment grace period ON/OFF pill and a Capacity-styled whole-hour input on the
  next row with its unit. Default configured lead time is 4 hours before the event.
  OFF disables the hours input, retains its value, and applies no pre-event lead
  offset. The event start remains the checkout boundary. Changing Auto approve
  must not change the payment grace setting.
- Verify popup close discards draft changes; header tick applies them; event Save
  persists enabled/disabled plus hours. Reopen/reload both settings with Auto
  approve ON and OFF. Verify EN/HU and desktop/mobile, including input validation.
- Manual approval: normal Join waits for the admin. After one approval, membership
  stays pending, with the amber icon and localized Waiting for payment badge above
  the profile-eye action. Approve disappears; pending count remains until payment.
  Reopen directly into payment; Back/Continue has no new Join or confirmation.
- Automatic approval: no admin action is needed, but the same enabled payment
  grace deadline applies. Approval does not replace a required payment.
- Separately for manual and automatic approval, leave the booking UNPAID. Advance
  only isolated versioned fixture timing past event start minus configured hours;
  run the real scheduled purge. Confirm inactive/deleted basket, deleted pending
  membership, released reservation/counters, and no payment, charge or affiliate
  revenue contribution. Do not seed those outcomes or use a successful-payment
  control for this test.
- An expired approval cannot authorize a fresh checkout. Once fixture timing makes
  a new Join eligible again, manual mode requires a new admin approval; automatic
  mode still follows its normal approval rule. Neither may reuse the expired basket.
- A successfully paid control remains accepted and financially unchanged when the
  purge runs. Verify the disabled-grace control does not expire at the configured
  hours offset, and verify canonical server deadlines instead of trusting a client
  expiration value.

- Gallery presentation alongside editor QA: show a compact Activity-card-style
  uploaded-count / capacity badge (for example `2 / 5`) in place of the magnifier,
  without an additional red counter or duplicate bottom-left cover index. The
  badge opens the gallery in editable and read-only views, including feed and
  Article gallery entry points. Check empty, single and multiple image states,
  save/reload, and mobile/desktop sizing. The event editor cover has no remove X;
  delete images inside the gallery, where normal upload/remove actions remain.

### Daily exchange rates and summary currency (2026-09-23 addition)

User acceptance supersedes the earlier per-currency summary layout: payment rows retain their original currencies; Payment history header and referral revenue show one selected summary currency, EUR by default.

- [ ] Operator Payments uses the shared styled URL input for the configurable ECB-compatible source; save/reload retains it. Dev points to the local simulator and makes no external FX request.
- [ ] Admin Jobs exposes scheduled daily refresh and manual execution with actual success/failure status. Successful refresh persists observations in MongoDB and invalidates the `@Cacheable` read cache; restart retains rates.
- [ ] Payment processing uses stored rates only, records rate/date/source and converted amount, and never waits for external FX HTTP. No rate does not block payment and is explicitly shown as incomplete summary.
- [ ] Mixed-currency payments produce the expected single-currency summary in both surfaces. Callback replay and concurrent payments do not duplicate sums; partial/full refunds use the original payment observation.
- [ ] Both header amount badges have a `>` affordance and open the shared currency popup. Confirm with the header tick uses the standard route delay and changes the summary currency.
- [ ] Cancel/close leaves the previous currency intact. Confirmed selection persists after popup reopening and browser reload, scoped to the current user and shared by both surfaces.
- [ ] The affiliate revenue surface provides the same selection/confirmation behavior. Original payment rows are unchanged. Unsupported/missing historical currency rates show an incomplete state instead of a misleading total.
- [ ] Mobile and desktop: compact badges, existing app menu/select/popup styling, hover/press animations on each amount button while the strip stays still, blurred backdrop, dropdown extending beyond the popup like Event Frequency, no clipped popup content. Affiliate selector belongs in the header and monetary zero values include the selected currency.

- [ ] Dev and packaged production Explore use the SAME payment-simulator FX endpoint and the same Java refresh/cache/snapshot path. Explore remains HTTP + server demo DB; no frontend-local fallback. REAL production uses the operator-configured public HTTPS source, initially ECB 90-day XML.
- [ ] Fresh seeds and existing-install upgrades supply a missing source without overwriting a custom or explicitly disabled source. Retired demo URL migrates to the common simulator. Repeated import is idempotent; payment credentials and all unrelated operator state remain unchanged.
- [ ] Frontend-local demo seeds fixed reference rates matching the simulator and converts both history totals and affiliate revenue with the shared selected currency. It never makes FX network calls and is not used by HTTP Explore.
- [ ] With a missing source path, the job fails visibly without deleting stored rates or changing payment snapshots/totals. Restore the configured URL and run again: completes; historical payment rates remain immutable.
