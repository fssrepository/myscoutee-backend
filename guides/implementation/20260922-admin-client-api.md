# Private admin monitor and API — 2026-09-22

Implementation and focused checks complete; runtime QA not started. Existing gallery/feed/moderation/email browser QA remains pending user-started dev stack; no previous PASS case is changed.

- Existing workspace sibling `myscoutee-client-admin` owns the small standalone Linux browser UI and private API PDF/README. No GTK/GNOME embed or new large application framework.
- URL, API key, adjustable polling interval (default 10 seconds; configurable 5–3600), Connect/Disconnect. Window close leaves the background process running. Reopening attaches to the single existing process. Key stays only in process memory; preferences and stable client identity may be saved privately.
- Same profile key-management popup: admin shows API, with no affiliate link/import counters/batch text. Separate admin-client token scope and private read-only endpoint; affiliate keys cannot read it and admin-client keys cannot use the affiliate API. Recheck current admin entitlement on each request.
- Metrics: active profile statuses follow existing statistics rules (public/friends only/host only; inactive/deleted/blocked excluded). Gender distribution applies to those active nonstaff profiles. Registrations use stored registration telemetry, last 7/30 UTC calendar days including today, not first login/activity. Explicit snapshot time/readiness prevents claiming missing telemetry is current live data.
- Attention: unread messages, unresolved reports/feedback, open support cases and failed Jobs. No message body, member identities, or moderation action exposed by the monitor. Details require normal application login. Automatic content-review queue is not a notification source.
- Release target **v1.0.2**; Debian installer and private GitHub Release workflow, short README download table and generated PDF. GitHub publication remains separate from local package verification.
- New `guides/qa/checklists/api/ADMIN-CLIENT-API-001.md`: auth/scope/expiry/revocation, metric definitions, polling/notifications, connect/disconnect and one-process reopen, localhost/dev and HTTPS remote URL. Runtime status NOT RUN until exercised.

## Desktop startup addition

The installer includes `libnotify-bin`, the application icon/desktop identity for Ubuntu's notification center, and an XDG desktop-login autostart entry using the existing singleton launcher with `--no-open`. No cron or duplicate watcher. Only Connect activates remote polling and notifications; window close preserves the connection, Disconnect stops it. Login startup is disconnected after reboot because the key is RAM-only.

## Focused verification

- Private API/auth/stats: 18 backend tests passed before the queued affiliate work (`/tmp/admin-client-backend-tests.log`).
- Client lifecycle, HTTP stub and local control security tested without the dev stack. Installer extraction/reopen checks are separate from GitHub publication.
- Admin and ordinary integration keys are separated in both adapters; ordinary popup keeps affiliate contents, admin API popup hides all affiliate sections and links to the private client repository.
- The full frontend build passed, including the shared admin-mode popup. Browser/real Mongo verification remains NOT RUN in `ADMIN-CLIENT-API-001`.
- Release target remains **v1.0.2**, with private GitHub installer/PDF assets. No tag, push or release publication performed.

### Final local checks (2026-09-22)

1. `python3 -m unittest discover -s tests -v` in `myscoutee-client-admin`: **12 PASS** (`/tmp/admin-client-python.log`). Includes notification identity, disconnected silence, HTTP stub, auth failure, late response, interval changes and process reopen.
2. `python3 tools/build_pdf.py` and `tools/build_deb.sh`: PDF and `dist/myscoutee-client-admin_1.0.2_all.deb` generated. Extracted package contains launcher, desktop entry, icon and login autostart entry. Isolated XDG startup/reopen/stop check passed; nothing installed into this user's system.
3. Full Angular local build passed after the final queued changes (`/tmp/affiliate-revenue-frontend-build.log`).
4. Fixture Python syntax and browser checkpoint JSON validated without staging data. All 3 main runtime checklists remain NOT RUN. The later affiliate-revenue requirement has a separate new API case; no previous PASS was rewritten.
5. No dev stack or desktop notification sent by these isolated checks. No release published; README download URLs become available only after private `v1.0.2` publication.
