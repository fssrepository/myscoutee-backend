# ASSET-PRICING-001 — Pricing

Use the prepared **Casey**, **Nova** and **Riley** windows. Casey changes the price; Nova checks and pays. Riley checks that a non-member cannot open the stage's internal tools.

**Asset:** `QA ASSET-PRICING-001 Interactive Transport`

**Event:** `QA ASSET-PRICING-001 Event`

For the prepared duplicate-member fix recheck, use [Focused Borrow recheck](#focused-borrow-recheck) below. Do not repeat Blocks 1–7.

For the full journey below, after each report wait for Codex to check the saved data. If a control is missing or a result differs, report that instead of continuing. Only pay in steps **8, 9 and 10**.

## Block 1 — Fixed daily price

1. **Casey — set the price.** In the side menu, open `Assets → Transport`. Find the Asset named above. Open its card menu → `Edit` → `Pricing`.

   Set **Pricing On**, **Fixed**, **Currency: USD**, **price: 1000**, **Per booking / day**, **tax included**. Leave minimum/maximum price empty and rounding at **None**. Turn quantity, demand, time and refund rules **Off**.

   Save Pricing, then save the Asset. Reopen `Edit → Pricing` and check the saved values.

2. **Nova — check the price.** In the side menu, open `Activities → Events → Active Events`. Find **QA ASSET-PRICING-001 Event**. Open its card menu → `View Event`.

   Open **QA Pricing Variable Stage** → `Transport → Explore`. Find **QA ASSET-PRICING-001 Interactive Transport**. Open its card menu → `Borrow`.

   Keep the stage's full start/end range and **Quantity 1**. Check the final price: **USD 2000** — USD 1000 per day × two charged days. Do not refresh, confirm or pay.

   **Riley:** find the same public Event through `Explore` → card menu → `View Event`. Find **QA Pricing Variable Stage**. Its three-dot menu must be absent: Transport, Accommodation, Supplies and stage Members are internal tools. Do not join the Event.

   Report **`ASSET-PRICING-001 fixed saved`**. Leave Nova's Borrow screen open.

   **Quantity is read-only 1.** One Borrow request is one item throughout this guide.

## Block 2 — Price rules

3. **Casey — change the same Asset.** Open its card menu → `Edit → Pricing`. Set:

   - Mode: **Hybrid**. Daily price: **USD 999**. Charge: **Per item / day**. Tax: **included**.
   - Quantity rule: **1 or more → decrease USD 49**.
   - Demand rule: **33% or more → increase 10%**.
   - Time rule: **within 96 hours before start → increase 10%**.
   - In the top pricing section, below **Charge basis**, set **Minimum daily rate: 900**, **Maximum daily rate: 1200**, then **Rounding → Whole number**.
   - Refund policy: **Off**.

   When typing `1200` into Maximum daily rate, the partial values `1`, `12` and `120` must stay unchanged while the field has focus. Leaving a maximum below `900` raises it to `900`. If Save runs without a blur while maximum is below minimum, it must show an error and keep Pricing open. Finish with maximum `1200`.

   Save Pricing, then save the Asset.

4. **Nova — watch the open Borrow screen.** Without refreshing, check that the price breakdown changes after Casey saves.

   Keep **Quantity 1** and the same dates. Check **USD 2300**: daily price `999 − 49 = 950`, demand adds `95`, time adds `104.50`, rounding gives `1150`; two charged days cost `2300`. Each adjustment appears once.

   Report **`ASSET-PRICING-001 variable saved`** and the amount shown. Do not confirm or pay.

## Block 3 — Asset pricing and non-member access

5. **Casey:** reopen the Asset's `Edit → Pricing`. Check that Block 2's values were saved. Close without changing them. There is no Asset VIP or audience field to fill in.

6. **Nova:** reopen the Asset's Borrow screen under **QA Pricing Variable Stage**, as in step 2. Use the same full date range and **Quantity 1**. Check **USD 2300**. Event membership permits access to the stage's tools; it does not grant an Asset VIP price.

   **Riley:** reopen the Event's stage list through `Explore`. The stage's three-dot menu must still be absent.

   Report **`ASSET-PRICING-001 audience observed`**, Nova's amount, and whether Riley sees any internal stage menu. This report name is retained for the saved-data checkpoint. Do not confirm or pay. Event invitation pricing is a separate check.

## Block 4 — Payment with a refund policy

7. **Casey:** open the Asset's `Edit → Pricing`. Keep Block 2's Hybrid settings.

   Under **Cancellation & Reimbursement**, enable one rule: **50% refund when at least 1 day remains before the booking starts**. Save Pricing and the Asset.

   **Nova:** reopen the same Asset's Borrow screen under **QA Pricing Variable Stage**.

8. **Nova:** check that the Borrow screen shows the price breakdown, **USD 2300**, and the **1 day / 50%** refund rule.

   Click **Confirm borrow**. Check that Payment shows the same **Cancellation & Reimbursement** block as Payment summary: the **1 day / 50%** rule and **USD 1150** refundable, alongside the **USD 2300** total and price breakdown. Select the active Barion card and click **Pay once**.

   Leave the resulting request unchanged. Report **`ASSET-PRICING-001 active-policy payment captured`**.

## Block 5 — Payment without a refund policy

9. **Casey:** open the Asset's `Edit → Pricing`. Set **Fixed**, **USD 800**, **Per booking / day**, tax included. Clear minimum/maximum prices, use no rounding, and remove and disable all quantity, demand, time and refund rules. Save Pricing and the Asset.

   **Nova:** open `Activities → Events → Active Events` → **QA ASSET-PRICING-001 Event** → card menu → `View Event` → **QA Pricing No Policy Stage** → `Transport → Explore`. Find the test Asset → card menu → `Borrow`.

   Use the stage's full date range. Check **USD 800** and an explicit **no refund policy** message. Click **Confirm borrow** and check the same amount/message on Payment. Pay **once** with Barion.

   Report **`ASSET-PRICING-001 no-policy payment captured`**.

## Block 6 — Payment after the refund deadline

10. **Casey:** reopen `Edit → Pricing`. Keep step 9's settings, change the daily price to **USD 900**, and add the **1 day / 50%** refund rule again. Save Pricing and the Asset.

    **Nova:** open **QA ASSET-PRICING-001 Event** → `View Event` → **QA Pricing Cutoff Stage** → `Transport → Explore`. Find the test Asset → card menu → `Borrow`.

    Use the stage's full date range. Check **USD 900**. The stage starts in less than 24 hours, so the screen must show the refund rule **and explain that its deadline has passed**. Click **Confirm borrow**, check the same information on Payment, and pay **once** with Barion.

    Report **`ASSET-PRICING-001 cutoff payment captured`**.

## Block 7 — Earlier payments keep their original terms

Leave the Asset at its final **USD 900** price. Do not edit it during these checks.

11. **Nova:** side menu → `Payment history`. Find the **USD 2300** payment from step 8 → card menu → `Payment summary`.

    Check the same **Cancellation & Reimbursement** block seen before Pay: the original Hybrid breakdown, the **1 day / 50%** rule, and refundable **USD 1150**. The Asset's later USD 900 price must not replace the old payment details.

12. **Nova:** side menu → `Payment history`. Find the **USD 800** payment from step 9 → card menu → `Payment summary`.

    Check **no refund policy**, refundable **USD 0**, and no **Request refund** action. The refund rule added later must not appear on this payment.

13. **Nova:** in `Payment history`, open `Payment summary` for the **USD 900** payment from step 10.

    Check the **1 day / 50%** rule, a **refund deadline passed** message, refundable **USD 0**, and no **Request refund** action.

14. Close and reopen all three payment summaries once. Check that each keeps its own amount, breakdown and refund terms.

    If every block passed, report **`ASSET-PRICING-001 complete: interactive pricing and payment snapshots match`**. Otherwise, report the remaining mismatch.

## Focused Borrow recheck

Use this only after Codex prepares `restage-borrow-review`. The three earlier Cutoff rentals and payments remain. Hybrid pricing is already set; Casey does not need to edit it.

1. **Nova:** `Activities → Events → Active Events` → test Event → card menu → `View Event` → **QA Pricing Variable Stage** → `Transport → Explore` → test Asset → card menu → `Borrow`. Keep the full dates. Check **USD 2300** for two charged days, then close without confirming or paying.
2. **Nova:** return to the stage list → **QA Pricing Cutoff Stage** → `Transport → Explore` → test Asset → card menu → `Borrow`. Keep the full dates. Check **USD 1150**, then `Confirm borrow` → Barion → `Pay once`. Make only this one new Borrow.
3. **Casey:** open the same Event → `View Event` → **QA Pricing Cutoff Stage** → `Transport`. Check **4 pending** in total and **1 pending on each rental card**. Click each card's pending badge: its Members screen must contain **one Nova row**, including when switching between cards. Opening Members must not change the totals.

Report the total, each card's badge count, and whether Nova appears once per Members screen. Leave the requests pending. Refund-request actions are covered in [ASSET-CHECKOUT-001, Block 8](ASSET-CHECKOUT-001.md#8-remove-the-runtime-association-contact-the-asset-owner-and-refund); no additional payment is needed here for that menu.

## Codex preparation notes

- Use the versioned `asset-pricing` fixture and managed launcher. The focused recheck uses `restage-borrow-review` and verified `borrow-review-ready`, preserving the earlier rentals and payments. For the full journey, require `baseline-ready`; stage on the test day because Cutoff starts staging + 12 hours. Follow the user's startup instruction separately from incomplete feature checks.
- Asset pricing has no VIP field. Keep Event invitation/VIP checks separate; do not expose the shared audience model in the Asset form for this test.
- Riley stays a non-member and checks that the stage's three-dot menu is hidden. Nova makes all three payments. The same menu restriction applies to Tournament stages, including the Groups entry; there is no tournament exception.
- This restriction is only for stage cards. The main Event's Members control keeps its existing Open/Closed access rules; do not hide it based on stage resource access.
- Retain refund disclosure on Borrow, Payment and Payment summary. Historical summaries must use the price rows and policy saved with each payment, including no-policy and passed-deadline cases.
- Borrow is one item per request. This guide uses quantity threshold 1 and demand threshold 33% so both rules can be checked without changing that contract. The full Variable stage lasts 26 hours, charged as two days.
- Run the matching saved-data check after each report. The final check requires exactly three captured payments with distinct saved pricing/policy details, unchanged earlier payments, and no duplicate payment or refund transaction. Do not replay Take Over, Leave, Remove or refund approval here.
