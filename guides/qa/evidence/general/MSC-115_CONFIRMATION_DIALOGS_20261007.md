# MSC-115 — confirmation dialogs, 2026-10-07

Task: https://github.com/fssrepository/myscoutee-roadmap/issues/153

The guide review exposed direct lifecycle mutations already present in the
MSC-115 frontend baseline (`93b5d02d`). The user explicitly requested confirmation
for all of these actions, with the Confirm button using the initiating menu's
color. This is a frontend behavior correction, separate from MSC-120 domain
package changes and future cross-domain work.

The existing `DialogStore` now gates:

- Case takeover, joining, declining, leaving, starting, completing, cancelling,
  reopening and moving to trash.
- Quotation acceptance, rejection, return to pending and invitation to chat.
- Board-task progress transitions and deletion.
- Scheduled-task pause, resume, trash and restore.
- Service publication, withdrawal, trash and restore; appointment cancellation.
- Announcement publication and restoration, alongside its existing withdrawal,
  trash, closing and voting confirmations.

The component passes the actual menu item/palette to its existing store. The
dialog identifies the case, task, quotation, service or appointment as applicable.
No new menu button, dialog component, API endpoint or persistence mechanism was
introduced. Existing form saves and picker confirmations retain their established
flow. Failed requests remain visible in the dialog; a stale profile, session or
surface cannot submit the delayed action. The domain service still owns status
transitions, permissions and version checks.

EN/HU dialog copy and affected guide descriptions were regenerated through the
existing versioned local/Mongo seed generators. The broader guide review covered
279 recent descriptions in 67 contexts; 195 descriptions per language were
corrected across 60 contexts. The 25 confirmation-related descriptions are a
subset of those 195, updated again to describe this final behavior. Accurate
existing descriptions were retained. MSC-118 contains the role-guide corrections;
MSC-119 contains the other contextual copy corrections.

## Verification

Production compilation used the already-running dev watcher. Serial Node checks
loaded that watcher's compiled modules with in-memory test collaborators; no
browser, live API or database was operated by these checks.

- `check-community-case-board.mjs`: existing domain checks plus real menu-handler
  → store → shared-dialog checks. No mutation before confirmation or after Cancel;
  exactly one on success; identical menu/confirmation palette; failure/retry and
  stale-session/profile checks passed.
- `check-community-schedules.mjs`: lifecycle, counters, worker timing and existing
  pause/trash dialog checks passed with the menu-item argument.
- `check-work-community-reactivity.mjs`: popup, form, guide, selection, task and
  quotation checks passed. Its stale reference to a non-exported AOT seed builder
  was replaced by the existing bootstrap repository entry point; seed behavior
  remained under test.
- Role-guide/notification and integration-guide compiled runtime checks passed.
- `sync-work-seeds.js --check` and `audit-i18n-mongo-seed.js` passed. Structured
  validation checked the 195 changed descriptions in both languages, all three
  workspaces and all three Mongo catalogs.

Browser rendering, popup stacking, pointer/keyboard actions and live HTTP mutation
flows were not exercised. Those remain manual QA checks; compiled runtime evidence
is not a browser/E2E pass. No second compiler or application server was started.
