# EVENT-MODE-REGRESSION-001 — formats, preferences and meeting feedback

This is the stable, repeatable guide. Keep execution status and evidence in the
separate dated progress document; do not mark this guide complete during a run.

## Actors and preparation

- Casey Bridge owns the disposable events; Nova Social joins them.
- Verify the versioned integration fixture and use the managed browser launcher
  with its INTEGRATION-API-001 configuration. Do not reuse an unrelated browser.
- Use the running development stack. Do not start another compiler or server.
- Preserve the original page-filter preferences and native browser viewport.
- Prefix new titles with `QA MODE <run date>` and record each returned event ID.
- Prepare source data only. Do not write completed rounds, scores, friendships,
  scheduler results or acceptance outcomes directly to the database.
- Automatic browser actions require explicit delegated testing. Otherwise the
  tester performs the following UI steps after standardized browser startup.

## 1. First Explore open

1.1. In Casey's window, reload the application, open the user menu, then Events.
1.2. With network observation active, hold the real page-filter-preference
response without replacing its content. Select Explore once.
1.3. Confirm the Explore popup appears while preferences are still pending and
no event-list query has started with default filters.
1.4. Release the preference response. Confirm the filter controls update and the
list loads using those saved values. Record timings and request order.

## 2. Apply, cancel and retain filters

2.1. In Explore, select Event filters. Enable Open spots and select Speed meeting
from the event-format menu. Apply using the header tick.
2.2. Confirm the button badge shows two conditions and returned cards match them.
2.3. Reopen filters, change the format, and close with X. Reopen and confirm the
last applied format is retained; the cancelled edit must not change the list.
2.4. Reload the page, open Events → Explore again, and verify both values and
badge 2 survive. Retain the initial values for cleanup.

## 3. Compact controls and filter popup

3.1. In a tester-sized mobile window, open Explore. Confirm the header order is
filter, order, view; all three buttons are compact and the title remains usable.
3.2. Open filters. Confirm it fits the available width, has a dim backdrop and
its header tick/close remain accessible.
3.3. In the native desktop window, confirm labels appear and the filter popup
is compact. Record dimensions. Do not set emulation overrides on managed windows;
reuse earlier verified mobile evidence if the user requires viewport preservation.

## 4. Landing, identity and help

4.1. Open the landing page. Confirm Free to join is beside Explore and the event
format line uses the same readable text size as the line above it.
4.2. Open About repeatedly. Its identity must match the landing operator brand;
it must not display a separately hardcoded founder name or cause branding refetches.
4.3. Switch EN/HU, reopen About and inspect headings, body, controls and labels.
Restore the initial language.
4.4. In the profile API integration popup, compare help and close control sizes.
The question mark itself has no enclosing circle. Record measured dimensions.
Do not infer admin-popup coverage from this check.

## 5. Standard external event link

5.1. In Casey's Events, create `QA MODE <date> Standard`: Standard format, public,
capacity 1–8, a description and a reachable test interval. Set External event page
to `https://example.org/events/standard`, save, and reopen the editor.
5.2. Change the URL to `https://example.org/events/standard-updated`; save and reopen.
5.3. Clear the URL, blur the field, save, and reopen. Confirm it remains empty.
5.4. Restore the original URL, save, reopen and verify the stored value again.
5.5. After publication, use Nova's public Explore card menu → External Info.
Confirm it opens the saved address in a separate tab. Close only that new tab.
An intercepted target response proves the destination, not availability of the
external website. This must be checked before Nova joins the event.

## 6. Standard membership isolation

6.1. Casey publishes the Standard event from its card menu and confirms.
6.2. Nova opens Explore, locates that title, selects Request join, then completes
the ordinary Join review and confirmation.
6.3. Casey opens Members, opens Nova's menu and approves the request.
6.4. Confirm two accepted members and the usual organizer/member actions. Inspect
network evidence: Standard management must not require a Mingle state request.

## 7. Tournament stages and score persistence

7.1. Casey creates `QA MODE <date> Tournament` with capacity 1–2 and one Score
stage. Configure one group with maximum 2 members, advance 1, and an end time
that can be reached during the test. Record the exact scheduled boundary.
7.2. Repeat publication, Nova's request and Casey's approval from section 6.
7.3. Open Manage Event, the stage card menu, then Start Stage and confirm.
Open Groups and confirm Group A contains Casey and Nova.
7.4. Wait for the real scheduled end. Reopen Manage Event and select Past when
needed to inspect ended stages. Confirm the stage enters score review naturally;
do not write SR to the database or substitute a manual close for this assertion.
7.5. Open Groups, expand Group A, open its actions and add an ordinary score for
a named participant. Save and record the accepted response and standings.
7.6. Close and reopen Groups. Confirm that participant's saved score persists.
Confirm Tournament controls remain present and Mingle runtime controls are absent.

## 8. Ordinary feedback and friendship

8.1. After the normal feedback eligibility boundary, open Nova's feedback for
the disposable completed Standard/Tournament event. Confirm the ordinary attendee
source is used and submit through the usual feedback flow.
8.2. With controlled participant pairs, verify Met without both positive ratings
does not produce Friend. Record one positive direction, verify again, then record
the reciprocal positive direction and verify the combined result.
8.3. Repeat with both positive ratings recorded before Met. Only the subsequent
meeting evidence completes the condition. Supporting service tests may establish
these branches, but must not be labelled a completed browser journey.

## 9. Speed meeting runtime and saved tables

9.1. Create a public Speed meeting event with group size 2, two planned rounds,
10-minute rounds and a 1-minute break. Join/claim as the two configured actors.
Use actual organizer controls and the scheduler to create runtime state.
9.2. Start the first round if needed. Open its card menu → Tables, expand Table 1
and confirm both assigned participants are visible while the round is running.
9.3. Pause and confirm the header countdown freezes; resume and confirm it ticks.
9.4. End the round manually, then observe automatic next-round start or use the
existing assistance control as specified by the run. Record which path ran.
9.5. Inspect round 2's Tables and participants, then complete the event.
9.6. Close/reopen Manage Event. Select Past for past rounds, open each round's
Tables and compare the saved round/table identities and members with earlier
observations. Do not mistake the Upcoming filter's main-event fallback for a
completed round's table list.
9.7. Record a stale action conflict separately if a held confirmation races an
automatic transition; a 409 must preserve the newer runtime state.

## 10. Event-level meeting feedback and export

10.1. At the normal feedback boundary, open the completed Speed meeting feedback.
All unique completed-table peers belong to one event-level list; repeated peers
appear once, unrelated participants are absent, and the list is not capped at five.
10.2. Use a fixture with at least six eligible peers for the size assertion. A
two-actor organizer/participant run alone does not prove this branch.
10.3. Submit feedback, reopen/read its persisted state, and compare the actual
completed-table pair union with INTEGRATION-API-001's encounters response/callback.

## 11. Local persistence

11.1. In an isolated local-adapter browser context, save page preferences and an
event external link. Start and pause a real round through the local service.
11.2. Flush IndexedDB, clear only transient state, reload that isolated context,
and verify preferences, link, pause state and assigned members are restored.
11.3. Resume and complete two rounds through local commands; flush and reload.
Verify saved rounds and unique feedback peers, including more than five peers
and a pending outsider who must be absent.
11.4. Record whether this was a compiled adapter/IndexedDB test or a complete
visible local-app journey. Do not replace the HTTP development stack to run it.

## Evidence and cleanup

Record numbered PASS/FAIL/NOT RUN entries, actor, exact input IDs, actual actions,
responses, screenshots and persisted-read oracles in the dated progress document.
Restore preferences, disable the test watch, revoke only the generated test key,
remove only this run's disposable resources and restore the managed-session
snapshot with the versioned fixture harness. Keep historical campaign evidence.
