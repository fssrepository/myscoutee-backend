# EVENT-ACTIVITY-RATING-001 — rating across event formats

Status: QUEUED / NOT RUN. Requested on 2026-09-22. Registration only;
the fixture and executable checklist have not been implemented or staged.
This is a separate Event-domain manual QA, not a replay of the completed
EVENT-MODE-REGRESSION-001 browser/API run.

## Requested scope

1. Prepare versioned, resettable fixtures with distinct Standard, Tournament
   and Speed meeting events and identified participants.
2. Supply a documented baseline and checkpoints so the tester can inspect
   activity rating without waiting through production-length event intervals.
3. Before implementation, trace the user's agreed rating rules and the existing
   rating/feedback flows. Write numbered actions and explicit expected results
   for each format; do not infer new eligibility or rating rules from current code.
4. The user performs the rating journey and checks the offered people, event
   context, answers, save/reopen behavior and resulting activity ratings.
5. For Speed meeting, cover the agreed event-level feedback over distinct
   co-participants from completed tables, rather than a separate wizard per table.
6. Record fixture preparation separately from observed behavior. Do not seed
   ratings, submitted feedback or expected outcome records to manufacture a PASS.
7. Include scoped cleanup/reset instructions and preserve unrelated data.

The current instruction only queues this work. No browser launch or automatic
execution is authorized by this registration; prepare it when the user resumes
this testcase.
