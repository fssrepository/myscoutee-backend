# OPERATOR-EMAIL-WARNING-001 — Email provider configuration and deletion-warning Job

Status: **PASS — dev HTTP/Java; local runtime NOT RUN** — see [execution evidence](../../evidence/OPERATOR-EMAIL-WARNING-001-20260923-progress.md). Do not modify previous PASS evidence.
The user authorized automatic full-flow execution using a local email stub, without real provider credentials or real mail delivery.

## Baseline and stub

1. Before the user starts the dev backend, set its existing `EMAIL_SENDGRID_ENDPOINT` environment value to the reachable local stub URL ending `/v3/mail/send`. The default production URL must not be used for this case. Record the exact dev-only endpoint override. The operator UI cannot change this endpoint.
2. Start `python3 guides/qa/tools/email-provider-stub.py --host 0.0.0.0 --port 18991 --output /tmp/myscoutee-email-qa.jsonl` only for this authorized case. Use the host address reachable from the existing backend network. The stub validates the SendGrid envelope, returns 202 and an `X-Message-Id`, writes no Authorization headers and never forwards mail.
3. Run `python3 guides/qa/tools/account-email-fixture.py stage`, then `status`. The fixture snapshots configuration and both related Job rows, disables permanent purge during the case, and creates Due / Too early / Already expired / Restored actors relative to the actual configured purge window. Only Due is eligible; the five-day lead time is fixed. Email delivery remains disabled until the operator saves the stub configuration.
4. Launch `node guides/qa/tools/open-checkpoint-browser-sessions.mjs OPERATOR-EMAIL-WARNING-001`. Use the checkpoint’s Operator, Ava and normal Casey windows. Do not create an extra unmanaged browser/session.

## Reproducible checks

5. Operator Configuration: the Email block loads provider choices from the backend. Choose SendGrid, enter a stub-only key, a sender email ending `@example.invalid` and a sender name, enable and save. Reopen: sender/provider/enabled state persist, the secret input is empty and reports that a saved key exists. Inspect responses and stored configuration: no plaintext key in DTOs; persistence uses the existing AES-GCM envelope.
6. Save with the credential field empty: the previous credential remains. Unknown provider, malformed sender, enabling without a credential, and stale revision must be rejected. Disabling leaves the saved credential intact and prevents sending. Browser-only local demo reports that the connected backend is required; it must not pretend to send or store credentials in IndexedDB.
7. Admin Jobs contains Account deletion warning as a periodic, suspendable process. There is no configurable five-day lead-time field. Its interval may be shortened by the fixture; do not wait for the normal hourly interval. Allow the ordinary worker to run after enabling the stub configuration.
8. Exactly one stub request addresses `email-qa-0@example.invalid`. Its body contains the computed permanent-deletion date and warning text. Too early, Already expired and Restored receive none. The Job history records one provider acceptance; this does not prove real inbox delivery.
9. Allow the next Job run: no duplicate request for the same deletion episode. Inspect `accountDeletionWarnings` and the matching user’s `deletionWarningFor`; the persisted delivery outcome survives another run/restart. A restored account is rechecked immediately before sending.
10. Reset and restage only this fixture for the failure checkpoint. Restart only the stub with `--status 401`, using a separate evidence output file. After the ordinary Job runs, verify failure is recorded rather than success. The same episode is not blindly resent. A request interrupted after possible provider acceptance is recorded as unknown; automatic duplicate sending is suppressed. Preserve evidence of the limitation: no claim of exactly-once inbox delivery.
11. Verify EN/HU UI text and ordinary operator/admin authorization: a normal user cannot read/save email configuration. Verify configured secrets are not exposed in browser storage, responses or evidence.
12. Retry supplement: reset and stage with `account-email-fixture.py stage-retry`. This stages two due actors and an initially suspended warning Job with its ordinary one-hour discovery schedule. Start the local receiver with `--retry-scenario`: recipient 0 returns 503, 429, 503, then 202; recipient 1 always returns 503. Temporarily use dev `email.account-warning-initial-retry-delay-seconds: 5` and `email.account-warning-check-delay-ms: 2000`; normal defaults remain 60 seconds and 60000ms. Enable email through the Operator UI and unsuspend the Job in Admin Jobs. Verify initial attempt plus exactly three retries; persisted status/attemptCount/nextAttemptAtIso; minimum delays 5/10/20 seconds; no blocking sleep or retry loop in the initiating request. Due retries must run without waiting for the one-hour discovery interval. A provider Retry-After may extend the delay.
13. Suspend the Job while a retry is pending; wait past its due time and verify no send. Restart only through the existing dev hot-deploy process; persisted pending work remains intact. Unsuspend through Admin Jobs: delivery resumes from the saved attempt count. Recipient 0 ends sent on attempt 4, recipient 1 failed on attempt 4, neither has a next-attempt timestamp or sends a fifth request. Job history records the attempts and actual accepted count. Run `python3 guides/qa/tools/verify-email-retry-qa.py --stub-log /tmp/myscoutee-email-qa-retries.jsonl --base-delay-seconds 5` before resetting this phase. Disabled email, restored accounts and passed purge deadlines must prevent sending retries. Explicit permanent rejection (e.g. 401) and unknown outcome remain terminal; unknown is never automatically resent.
14. Queue guards: reset and `stage-retry-guards`. The baseline contains two due retry claims: a restored owner and an owner past the purge deadline. Keep the local stub active. Unsuspend the warning Job while email is OFF: claims remain retry/attempt 1, with no request. Enable email through the Operator UI: both claims become cancelled without a provider call. This tests delivery eligibility from prepared states; it does not replay account-restoration UI.
15. Close only these checkpoint windows; run `python3 guides/qa/tools/account-email-fixture.py reset`; stop only the stub and remove the dev endpoint and temporary retry/poll timing overrides for the next backend start. Confirm the previous email configuration, warning Job and purge Job were restored.

## Protocol and evidence

The existing SendGrid adapter uses the [Mail Send API](https://www.twilio.com/docs/sendgrid/api-reference/mail-send/mail-send), Bearer API key authentication and a verified sender for a real deployment. The stub tests request formation/provider acceptance only. No real email delivery is authorized by this case.

Save numbered PASS/FAIL/NOT RUN evidence under `guides/qa/evidence/`. Do not substitute mocked tests for the operator UI/Job run.

## Public unsubscribe and branded emails — supplement

This user-requested branch is additional to the completed provider/retry checks.
Use the same reversible email fixture and local provider stub; preserve the active
Admin-client checkpoint and its sessions. Never send real email.

1. Stage the email fixture and launch its Operator-only managed configuration
   with `node guides/qa/tools/open-email-unsubscribe-browser.mjs operator`.
   Configure the synthetic sender/key through the Email block. Use a 503 stub
   response to leave the first outgoing message pending retry; hold the Job with
   `account-email-fixture.py hold-unsubscribe` before the next attempt.
2. Inspect the captured HTML and text alternatives. Both identify the sender and
   offer unsubscribe; HTML includes the configured MyScoutee logo and usable
   formatting. The landing link targets `https://myscoutee.com`.
3. Launch the captured link with `open-email-unsubscribe-browser.mjs public`.
   The anonymous, standalone page must load without the application or login.
   Check logo, confirmation text, button, landing link and layout at desktop and
   mobile width. EN/HU labels must resolve. GET/status must not unsubscribe.
4. Confirm using the visible button. While the request is pending, show busy
   feedback and disable duplicate submission. Success survives reload; repeated
   confirmation is idempotent. No account/session is required. Tampered/missing
   capability shows an invalid-link message and cannot change subscriptions.
5. Resume the owned retry using `account-email-fixture.py resume-unsubscribe`.
   It becomes terminal `unsubscribed`, removes its next-attempt timestamp and
   makes no additional provider request. Later newly queued messages to the same
   normalized recipient are suppressed too. Suppression is independent of the
   continued existence of the original profile; DEMO cannot change REAL state.
   Run `stage-unsubscribe-new` to prepare a new episode for the suppressed
   recipient (padded uppercase address) and one message to a second recipient.
   After the second recipient's first request, `detach-unsubscribe-owner` removes
   that owned profile and suspends the Job. Launch its captured link with
   `QA_EMAIL_RECORD_INDEX=1 node guides/qa/tools/open-email-unsubscribe-browser.mjs public`.
   Repeat the browser oracle, then `verify-email-unsubscribe-state.py`. Record
   separate-database isolation as NOT RUN if dev maps both modes to one database.
6. A transient request failure leaves a retry action available. Reload after an
   ambiguous response reports persisted success rather than sending another
   email. No raw recipient/token is rendered in the page or copied to evidence.
7. Reset the versioned email fixture, close only its windows, stop its local
   stub, restore the dev endpoint/poll defaults. Preserve existing suppression
   records outside the fixture. Record actual PASS/FAIL/NOT RUN evidence.
