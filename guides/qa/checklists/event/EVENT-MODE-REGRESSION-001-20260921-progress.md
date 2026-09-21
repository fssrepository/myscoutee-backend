# Event mode QA — paused 2026-09-21

User requested a pause before closing the laptop. Do not resume browser actions
until requested. This is a separate delegated feature check, not the ongoing
manual-QA campaign pointer.

## Development complete

Earlier feature work, promotional images at their original paths, QA checklists
and generated PDF are present. The stale round-action revision guard is
implemented; its focused frontend/backend tests passed. The About founder is
now database metadata (`i18n_bundles.founderName`), returned and cached alongside
translations; no frontend name literal or additional endpoint is used. About
copy and accessibility text remain i18n. When editing founder metadata, increment
the corresponding bundle version, as for translation edits. Canonical real,
demo and E2E seeds contain the field. Local-only bundles have no configured name
and display the translated role without inventing a person.

Founder verification: 23 focused frontend tests passed; the existing frontend
watcher built and synced successfully, and backend hot-deploy compiled successfully.
The running HTTP bundle returned Hungarian role text and the configured founder
with version `2026.09.21.hu.132`. The i18n audit passed for both languages and
all three Mongo seeds. All 5 focused `I18nServiceTest` backend tests passed. The storage test also
passed after adding a fresh repository-instance read of the configured name.

## Browser/API evidence already obtained

- API help/close controls both measured 34 × 34 pixels.
- SDK connection, external event link create/read and invitation acceptance worked.
- Disposable event `QA MODE 20260921 Speed meeting`, ID
  `aaf92156-8ec7-46d3-a8ca-6e5fb9d0b9a6`, completed with Casey and Nova.
- Pause/resume/manual round transition exercised. An old confirmation raced
  with automatic round advance; this caused the revision-guard fix above.
- Encounters before completion returned 409. After completion, SDK returned one
  unique pair across two rounds; an `event.encounters` webhook arrived at revision 6.
  Full payload parity/privacy assertions remain outstanding.

## Remaining checklist (not yet proven)

1. Replay stale confirmation vs automatic round advance in CDP; require 409 and
   unchanged current round. Verify table popup and persisted round history.
2. Explore first-click immediate opening with delayed preferences, apply/cancel,
   reload persistence, badge count, mobile 320/390 px controls and compact popup.
3. Landing/About EN/HU rendering, database founder display/cache reload, join CTA,
   and admin help button geometry.
4. Standard and Tournament create/edit/publish/join/approval flows, external-link
   update/clear/reload, Tournament stage/group/scoring, ordinary feedback.
5. Speed meeting unique completed-table feedback and Met + mutual positive
   friendship, including ratings recorded before Met.
6. Local adapter IndexedDB persistence across reload/restart (preferences,
   external link and rounds). No duplicate dev build/server may be started.
7. API invitation re-claim idempotency, encounters/webhook exact pair parity,
   pagination/privacy and other-owner authorization. Preserve original API PASS
   as historical evidence, not a PASS for this extension.
8. Restore changed preferences; revoke only the new test key, disable its watch,
   remove only disposable resources, restore managed session snapshot via the
   versioned harness, then update checklists, CSV/XLSX ledger and review evidence.

Any defect discovered in those checks still requires repair and retest.

## Resume resources

Use `EVENT-MODE-REGRESSION-001.md` and integration `INTEGRATION-API-001.md`.
Managed browser manifest: `/tmp/myscoutee-qa-browser-sessions/INTEGRATION-API-001.json`.
Ports at pause: Casey 41225, Nova 40657. Recheck process/container state after wake;
if relaunch is required, verify the fixture baseline and use the versioned launcher.
Private temporary scripts, SDK config, responses and logs are in
`frontend/.agent/mode-qa/`; do not publish API credentials or invitation tokens.
Webhook receiver used port 18090. Confirm its process before restarting anything.
Do not reset unrelated data or overwrite the campaign's CURRENT_QA_SESSION file.
