# ASSET-PRICING-001 user test guide

This checkpoint owns Asset pricing configuration from Borrow preview through
the captured Payment summary. Refund policy is one pricing control here, not a
standalone Asset lifecycle. Do not repeat Take Over, Leave, Remove, refund
approval or the free Borrow lifecycle already owned by `ASSET-CHECKOUT-001`
and `ASSET-BORROW-001`.

Begin only after the dedicated `asset-pricing` fixture reports
`baseline-ready`. It stages three separate Public Transport items:

| Item | Pricing controls | Refund-policy case | Expected controlled total |
| --- | --- | --- | --- |
| `Hybrid active policy` | HUF 999 daily rate; per item/day; `2+` quantity rule `-49`; demand `>=67%` `+10%`; start within 96 hours `+10%`; whole rounding; quantity `2`; two billable days | 50% when at least one day remains | HUF 4,600; refundable HUF 2,300 |
| `Fixed no policy` | HUF 400 daily rate; per booking/day; HUF 750 minimum; quantity `2`; two billable days | explicitly disabled | HUF 1,500; refundable HUF 0 |
| `Cutoff passed` | HUF 900 daily rate; per item/day; start within 24 hours `+50%`; HUF 1,000 maximum; quantity `1`; one billable day | 50% only at least one day before start; staged start is inside that cutoff | HUF 1,000; refundable HUF 0 |

The fixture pre-captures the second and third payments. The first is the one
fresh Barion payment in this journey. After that capture, Codex's guarded
command snapshots its payment audit and changes only the first live Asset to a
deliberately different pricing configuration. The captured amount, pricing
summary rows and refund policy must remain the payment-time values.

## Control group 1 — list, detail and editor persistence

1. As Casey, locate the three exact fixture titles in Assets. Open each detail
   and Pricing summary. Confirm the base price, currency, charge basis,
   quantity/demand/time switches, min/max, rounding and refund-policy state
   match the table. Reopen once; values must not leak between the three items.
2. On an Asset, slot pricing must not appear as an active Asset control. Record
   any Audience/member/VIP/promo control that is exposed: this checkpoint does
   not assign it an invented Borrow rule. It is a separate product-contract gap
   until Asset-specific audience eligibility is defined.

## Control group 2 — calculated Borrow projections

3. As Nova, open the `Hybrid active policy` Borrow flow for the staged exact
   range and quantity `2`. The Current Price Review must show the ordered
   pricing effects and the final HUF 4,600 total. Changing to quantity `1`
   removes the `2+` quantity rule, changes the demand input and removes the
   final item multiplier; returning to quantity `2` restores HUF 4,600 without
   duplicated rows.
4. Open `Fixed no policy` for the same two-day range. Quantity `1` and `2`
   remain HUF 1,500 because the charge basis is per booking/day. The HUF 750
   minimum and two-day duration are visible; no refund policy is inferred.
5. Open `Cutoff passed` for its staged one-day range. The time rule and HUF
   1,000 maximum produce HUF 1,000. It must not reuse either sibling item's
   rows or policy.

## Control group 3 — Confirm, Payment and capture

6. Return to `Hybrid active policy`, exact staged range, quantity `2`. On the
   Confirm view, verify the complete price breakdown, HUF 4,600 final price and
   a visible Refund policy block with the one-day/50% rule.
7. Continue to the locked Payment screen. The same breakdown, total and Refund
   policy remain visible and read-only. Pay exactly once with the staged Barion
   card. Do not accept, reject, cancel or refund the resulting Borrow.
8. Report `ASSET-PRICING-001 payment captured` and wait. Codex runs the guarded
   capture command, proves the payment-time rows/policy, then changes only the
   current live pricing of this Asset.

## Control group 4 — immutable Payment history snapshots

9. Reopen Nova's Payment history and `Payment summary` for `Hybrid active
   policy`. It still shows HUF 4,600, the original ordered calculation rows and
   the original one-day/50% policy, with refundable HUF 2,300. None of the new
   live Asset pricing may replace or recompute the captured payment.
10. Open `Payment summary` for `Fixed no policy`. It shows the captured HUF
    1,500 calculation and an explicit no-refund-policy state; refundable is HUF
    0 and no `Request refund` action is offered.
11. Open `Payment summary` for `Cutoff passed`. It shows the captured HUF 1,000
    calculation and the stored one-day/50% rule, but also clearly states that
    the refund window has passed; refundable is HUF 0 and no `Request refund`
    action is offered.
12. Close and reopen all three summaries once. Report:

    `ASSET-PRICING-001 complete: three pricing controls and payment snapshots match`

Wait for Codex's read-only oracle. It must compare all three Asset/payment
pairs, the deliberately changed first live config, exact payment totals and
the absence of any refund, sibling mutation or duplicate payment.
