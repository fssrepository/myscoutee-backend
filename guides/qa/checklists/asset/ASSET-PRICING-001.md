# ASSET-PRICING-001 user test guide

This is an interactive Asset-pricing journey. Casey repeatedly edits one
controlled Public Transport Asset and Nova/Riley immediately check what that
single change does in Explore, Borrow review, Payment and Payment history.
Refund policy is one field group inside pricing; it is not a separate Asset
testcase.

Do not repeat Take Over, Leave, Remove, refund approval or the generic free
Borrow lifecycle already owned by `ASSET-CHECKOUT-001` and
`ASSET-BORROW-001`.

Begin only after the dedicated `asset-pricing` fixture reports
`baseline-ready`. It provides:

- one `QA ASSET-PRICING-001 Interactive Transport`, quantity `3`, with Pricing
  initially Off;
- one Public Event with separate `Variable`, `No policy` and `Cutoff` stages;
- Casey as Asset owner, Nova as accepted Event member and Riley as the public
  non-member control;
- active Nova and Riley Barion cards;
- no staged Asset request, basket or payment.

After each report, wait for Codex's guarded read-only oracle before editing the
next pricing version.

## Interactive journey

1. As Casey, edit the controlled Asset. Turn Pricing On and save only this
   fixed configuration: HUF `1000` daily rate, `Per booking / day`, tax
   included, no min/max, no rules, no audience pricing and no refund policy.
   Reopen the editor and confirm the exact values persisted.
2. Without reload, Nova opens the Asset for the fixture's two-day `Variable`
   range. Quantity `1` and `2` both show HUF `2000`: duration is two billable
   days, while `Per booking / day` does not multiply by item count. Riley sees
   the same public amount. Report `ASSET-PRICING-001 fixed saved`.
3. Casey changes the same Asset to `Hybrid`, HUF `999`, `Per item / day`,
   quantity rule `2+ -> decrease HUF 49`, demand rule `>= 67% -> increase 10%`,
   time rule `within 96 hours -> increase 10%`, minimum HUF `900`, maximum HUF
   `1200`, whole-number rounding. Leave audience pricing and refund policy Off.
4. Nova's already-open Borrow review updates to the new config. On the exact
   two-day range, quantity `2` shows the ordered rule rows and HUF `4600`:
   `999 - 49 + 10% + 10% -> 1150`, then two days and two items. Quantity `1`
   removes the `2+` rule and final item multiplier; returning to `2` restores
   HUF `4600` without duplicate rows. Report
   `ASSET-PRICING-001 variable saved`.
5. Casey now enables Advanced Audience Pricing on the same Asset and enters:
   member price HUF `800`, VIP price HUF `600`, invite-only discount `20%`,
   promo `QA10 -> decrease 10%`. Reopen the editor and confirm all four values
   persist together.
6. Compare Nova's accepted-member view with Riley's public non-member view and
   inspect the Borrow flow for a promo-code entry point. Report exactly what
   changed and what did not. This is an intentional contract probe: the
   current repository has pricing fields for member/VIP/invite/promo, but no
   Asset-Borrow VIP classification or promo application path. Do not invent a
   VIP identity or silently pass unchanged prices. Report
   `ASSET-PRICING-001 audience observed`.
7. Casey disables Audience Pricing again, keeps the exact HUF `4600` variable
   configuration, and enables one refund rule: refund `50%` when at least `1`
   day remains. Nova reopens the exact Variable-stage Borrow review.
8. Confirm that both Confirm and the locked Payment screen show the same
   ordered price breakdown, final HUF `4600`, and visible one-day/50% Refund
   policy. Nova pays exactly once with Barion. Do not accept, reject, cancel or
   refund the resulting Borrow. Report
   `ASSET-PRICING-001 active-policy payment captured`.
9. Casey changes the same live Asset to fixed HUF `800`, `Per booking / day`,
   no dynamic rules, no audience pricing and refund policy Off. Riley borrows
   it once for the separate `No policy` stage and pays exactly HUF `800` with
   Barion. Confirm the pre-payment screens explicitly disclose that no refund
   policy applies. Report `ASSET-PRICING-001 no-policy payment captured`.
10. Casey changes the same live Asset once more to fixed HUF `900`, `Per
    booking / day`, with the one-day/50% refund rule enabled. Nova borrows it
    once for the separate `Cutoff` stage, whose start is less than 24 hours
    away, and pays exactly HUF `900`. The policy is disclosed before payment,
    but the refund window is already closed. Report
    `ASSET-PRICING-001 cutoff payment captured`.
11. Open Payment history. Nova's HUF `4600` Payment summary still contains the
    original variable calculation rows and one-day/50% policy even though the
    live Asset is now HUF `900`; its refundable amount is HUF `2300`.
12. Riley's HUF `800` Payment summary explicitly records no refund policy and
    refundable HUF `0`. The live Asset's later one-day/50% rule must not appear
    on that payment and must not add `Request refund`.
13. Nova's HUF `900` Payment summary records the one-day/50% payment-time rule,
    but states that its cutoff has passed; refundable is HUF `0` and there is
    no `Request refund` action.
14. Close and reopen the three summaries once. Report:

    `ASSET-PRICING-001 complete: interactive pricing and payment snapshots match`

The final oracle must prove exactly three primary captured payments on the one
Asset, three distinct stored calculation/policy snapshots, the final live
pricing config, unchanged historical payments, no refund write and no
duplicate payment.
