# Past badge regression — 2026-09-30

Status: **PASS / CLOSED for the requested server-side expiry and recount scope**.
This supersedes the pending regression recorded in the earlier guide session.
The user requested the focused check after clarifying that it concerns the
stored badge, the existing expiry worker and a subsequent normal counter write.

## Verified results

- Existing `event-counter-expiry` Admin Job fixture, `start-fallback-future-control`:
  one past start-only source expired; the future control remained unchanged.
  Its second real scheduled pass processed zero sources and retained the event,
  control and complete stored activity counters.
- The same fixture now supports `end-boundary`, with an event ending 90 seconds
  after preparation, a future hosted control and an isolated public watch target.
  Real HTTP watch/unwatch writes before the deadline stored **All=2, Hosting=2**.
- After the actual deadline, the existing dev scheduler expired exactly one
  event and stored **All=1, Hosting=1** at **09:43:53Z**. The job total was 2:
  one expired source plus the existing friendship projection for that completed
  source. No second event expired; no feedback source or ticket was processed.
- Another real watch/unwatch pair (`changed=true` on both requests) invoked
  `UserActivityCountersService` after expiry. Both stored counters and the HTTP
  response stayed **1**; the ended event did not reappear in the badge.
- A repeated scheduled pass processed **0**, preserving the event, future
  control and all stored activity counters against the pre-repeat snapshot.
- **20/20 focused Java tests PASS**, zero failures/errors/skips:
  `UserActivityCountersServiceTest` 13 and `EventCounterExpiryServiceTest` 7.
  The existing Past exclusion test now runs with both `expired=false` and
  `expired=true`, retaining its active, pending, invitation and hosting controls.

Structured worker, HTTP, cleanup and unit-test receipts:
[`EVENT-PAST-BADGES-001-20260930.json`](EVENT-PAST-BADGES-001-20260930.json).

## Isolation and execution

The existing development stack and MongoDB were used. No pre-existing due
event needed quarantine. All 12 retained manual-QA checkpoint markers remained;
no unrelated checkpoint was reset or browser operated. The fixture's exact
reset restored the snapshotted documents and original five-minute rule state.
A database scan found zero remaining fixture-owned records, including sessions,
login audits, notifications and watch subscriptions.

For the unit run the existing `myscoutee` container was stopped first. A one-off
test container reused its image, mounted workspace and Gradle cache; it ran no
server. Main compilation/resources/classes and the unrelated JaCoCo report were
excluded. Only test compilation and the two selected test classes ran. The
test container exited and was removed before the original backend restarted.
The Gradle test task completed successfully in 17 seconds.

```sh
./gradlew :projects:profile:test \
  --tests com.raxim.myscoutee.profile.service.UserActivityCountersServiceTest \
  --tests com.raxim.myscoutee.profile.service.EventCounterExpiryServiceTest \
  -x :projects:profile:compileJava -x :projects:profile:processResources \
  -x :projects:profile:classes -x :projects:profile:jacocoTestReport --console=plain
```

Replay uses the existing [Admin Job fixture instructions](../../../../server/docker/scripts/admin-job-fixtures/README.md#event-counter-expiry)
and the [HTTP oracle](../../tools/verify-event-past-badges-http.py).

## Diagnostic corrections and limits

An initial unwatch of a nonexistent subscription was a no-op; it is excluded
from recount evidence. The final helper requires genuine watch and unwatch
mutations. The initial end-boundary oracle expected a job total of 1; source
inspection confirmed that the existing job also counts friendship projection,
so the final clean replay requires exactly 2. An initial repeat comparison
included a new login notification from the intervening HTTP check. The final
repeat baseline is captured after those user actions, before the repeated
worker executes; event counters themselves remained 1 throughout.

Production code, including `EventCounterExpiryService`, is unchanged. No new
Past job, UI fix or deployment was needed. This closes the agreed server
regression; it is not a new browser, frontend-local persistence, Ticket/Followed
end-to-end or application-wide counter certification. Earlier independent QA
results remain unchanged.
