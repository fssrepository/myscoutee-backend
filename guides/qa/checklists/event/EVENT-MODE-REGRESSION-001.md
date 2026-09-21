# EVENT-MODE-REGRESSION-001 — formats, preferences and meeting feedback

Run on the existing development stack using managed Casey/Nova sessions from
the versioned browser launcher. Use disposable events prefixed
`QA MODE 20260921`; retain pre-run preferences for restoration. CDP execution
is permitted when the user delegates this flow. Do not seed passing results.

## Explore and landing

1. Open Explore once after page load. The popup must appear before a delayed
   preference response; event loading must use the returned preferences.
2. Open filters. Set a format and another condition, apply with the header tick,
   and confirm the badge counts applied conditions. Cancel a subsequent edit
   and confirm it did not apply. Reload and reopen: saved values must survive.
3. At 320/390 px confirm filter, order and view are compact and appear in that
   order. The small filter popup fits the viewport and has a dim backdrop.
4. Verify landing About, readable format line, and Free to join beside Explore.
   About copy, headings and accessibility labels must switch with the language.
   The About identity heading uses the same operator branding as the landing
   logo (`branding.productName`); it must not display a personal founder name
   or initiate another branding request.
   API help and close controls must have equal dimensions and an uncircled `?`.

## Standard and Tournament isolation

5. Create and reopen a Standard event with a source link. Update, clear and
   restore that link, checking persisted reads and the public external action.
6. Publish, join as Nova and approve as Casey. Verify ordinary membership and
   event management; no Mingle state request is required for either format.
7. Repeat the relevant create/publish/member path for Tournament. Verify its
   stage/group controls and scoring remain available; Mingle-only controls
   must not replace them.
8. For completed disposable events verify feedback uses the ordinary attendee
   source. Meeting evidence alone must not create friendship; mutual positive
   ratings plus Met must qualify, including ratings recorded before Met.

## Speed meeting and persistence

9. Configure and run an event with two rounds. Exercise pause/resume and manual
   advance, inspect table participants, then complete it. Reopen the live/history
   view and verify saved round/table identities.
10. Verify feedback lists unique completed-table peers, without unrelated
    attendees or truncation to five. Compare encounters with the API checkpoint.
11. In the local adapter, save preferences, event link and actual rounds;
    reload/restart the isolated profile and verify IndexedDB restores them.

## Evidence and cleanup

Record each step's PASS/FAIL/NOT RUN separately, requests/statuses, relevant
screenshots and persisted read oracles. Component tests alone do not prove this
journey. Restore original preferences, revoke test keys and remove only resources
created by this run. Keep historical campaign evidence separate.
