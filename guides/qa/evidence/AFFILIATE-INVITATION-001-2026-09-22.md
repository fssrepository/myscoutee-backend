# AFFILIATE-INVITATION-001 — execution record

## Result

PASS / CLOSED — 2026-09-22, independently executed over CDP on the running dev stack.

| Step | Result | Evidence |
| --- | --- | --- |
| 1 | PASS | New owner UI showed personal `0`, API `0 / 0`. |
| 2 | PASS | Exact public link captured; Login → New profile; required fields and three demo-photo uploads completed through controls; Save created a new profile and navigated to `/game`. Pending referral cleared after success. |
| 3 | PASS | Owner reopen showed `1`, `0 / 0`; one immutable registration attribution. |
| 4 | PASS | Existing visitor reopened the personal link; subsequent owner read remained `1`. |
| 5 | PASS | UI-generated key; real connect and future-event API creation; two distinct participant invite imports. |
| 6 | PASS | UI `0 / 2`; repeat import retained both exact invite URLs and `0 / 2`. |
| 7 | PASS | Browser opened first invite; normal automatic claim created one participant mapping and event invitation. UI `1 / 2`; second participant unclaimed. Claim is not attendance acceptance. |
| 8 | PASS | Replayed claim/import and full owner page reload preserved `1`, `1 / 2`. Exactly one settings GET after reload; no separate affiliate HTTP endpoint. |
| 9 | PASS | UI revoke → HTTP 401; reopened popup still `1`, `1 / 2`. Then only fixture browsers/state/media were removed and the common session snapshot restored. |

[Machine evidence](AFFILIATE-INVITATION-001-2026-09-22.json)
and [browser screenshot](AFFILIATE-INVITATION-001-2026-09-22.png).
No product change was needed. This result does not claim Firebase's external
provider flow or the local adapter was exercised.

