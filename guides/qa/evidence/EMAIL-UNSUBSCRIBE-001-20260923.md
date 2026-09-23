# Email unsubscribe and branding — 2026-09-23

Status: PASS on dev HTTP/Java and the managed browser (see final results). Additional branch of OPERATOR-EMAIL-WARNING-001; previous
provider/retry PASS evidence remains unchanged. User explicitly authorized
managed-browser execution and requested this branch in QA.

- Existing backend/frontend watchers own compilation; no separate compiler/test process.
- Four-recipient versioned fixture staged; previous operator configuration and
  warning/purge Jobs snapshotted. Active Admin-client fixture/windows retained.
- Local SendGrid-shaped receiver at port 18991, 503 responses, no mail forwarding.
- Temporary dev endpoint `http://172.19.0.1:18991/v3/mail/send`, warning poll 2s.
- Captured message/capability kept only in private `/tmp` files, never in evidence.
- Existing watcher production compile PASS; i18n source/three Mongo-seed audit PASS.

## Final results

Status: **PASS — dev HTTP/Java and managed anonymous browser**. No external inbox
or real-provider delivery claimed. Standalone Java regression runner NOT RUN
alongside the dev compiler; separate REAL/DEMO database isolation NOT RUN because
this dev stack intentionally maps both modes to `demo_db`.

1. The actual worker's captured HTML and text include sender name/address,
   MyScoutee logo (HTML), unsubscribe capability and `https://myscoutee.com`.
   Exactly two provider requests across two disposable recipients; stub always
   returned 503 and never forwarded email.
2. Versioned launcher opened the actual captured link as an anonymous managed
   app window. Page resources: logo, public status endpoint and favicon only;
   no Angular bundle/app-root/login. Logo loaded and landing destination matched.
   Read-only GET/status left recipient subscribed.
3. `verify-email-unsubscribe-browser.mjs` PASS twice, including a second recipient
   whose profile had been removed before confirmation. Explicit confirmation,
   persisted reload, repeated POST, EN/HU, missing/tampered/oversized token and
   transient failed-request recovery all verified. QA-only 650ms connection
   latency exposed disabled/busy spinner state; normal network restored after.
4. User-requested compact button correction PASS: centered 135.875px-wide,
   42px-high control in the 460px desktop card; 360px viewport has no overflow.
   Visual screenshots inspected: `/tmp/qa-unsubscribe-compact.png`,
   `/tmp/qa-unsubscribe-mobile.png`, `/tmp/qa-unsubscribe-final-success.png`.
5. `verify-email-unsubscribe-state.py` PASS. Previously queued retry terminated
   `unsubscribed` at attempt 2 with no next-attempt timestamp or new provider call.
   A fresh deletion episode with padded uppercase recipient address terminated
   `unsubscribed` at attempt 1, proving normalized email-based future suppression.
   Second recipient's subscription persisted without any user profile.
6. Capability resides in URL fragment and JSON body, never query/access log.
   Captured valid capability absent from nginx/backend logs. Public document has
   no-store, no-referrer, nonce CSP and no-framing policies. Java regressions added
   for authenticated token/mode restoration/tamper/idempotency, common gateway
   suppression/presentation, and terminal warning outcome; runner NOT RUN.
7. Cleanup PASS: fixture reset restored prior operator email configuration (none),
   warning/purge Job snapshots and operator session snapshot. All four owned
   users, delivery claims and recipient suppressions removed; Admin-client fixture
   retained. Only supplement windows closed; local stub stopped. Temporary endpoint
   and 2-second polling override removed. Existing watcher compiled/restarted after
   restoration at 18:42:26 CEST. Production endpoint unchanged; dev public email URL
   now defaults to the stack's nginx origin `http://localhost`.

The replay tools read capabilities privately and output only assertions/counts.
The read oracle's attempted cross-database check first failed on database authority;
inspection showed this dev stack has a shared database for both modes. This boundary
is explicitly NOT RUN, not asserted from the shared-database result.
