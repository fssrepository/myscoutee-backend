# FEEDBACK-UI-001 — central Feedback domain

Active checkpoint: consolidate Feedback, then verify the changed behavior.
Events and Community use the same Feedback owner. This is the existing Feedback
checkpoint, renamed and updated; it is not a new application-wide QA campaign.

Use the existing managed Alex and Maya sessions and the approved completed-case
fixture. Retain previous form, guide, language and viewport evidence. Do not
repeat the full historical Feedback checklist. Finish this checkpoint before
continuing the remaining MSC-116 work.

## A. Implementation and source checks

- [x] 1. One Feedback domain owns its controllers, contracts, services,
  repositories and documents. Events and Community call its API; neither reads
  or writes its collections directly. Co-location in one microservice does not
  relax ownership.
- [x] 2. Rename all affected components, selectors, files, imports, stores,
  converters, seed builders, tests, help/i18n keys and runtime references.
  Use `feedbackStates`, `feedbackAnswers` and `feedbackEvaluations` for persisted
  collections. Local mode owns its Feedback state separately from Community
  cases. No compatibility branch for the retired names is required.
- [x] 3. The Feedback list uses one service operation and one HTTP request.
  The response contains the complete requested page, its total and bucket
  counts. Local mode applies one request delay. Pagination across source types
  does not trigger a second page request or per-card metadata request.
- [x] 4. Carry the contracts through monolith and microservice transport,
  routing, seed/import policy and relevant template code. Record template-only
  verification as NOT RUN; do not start a template stack.

## B. Focused automated verification

- [x] 5. Compile using the existing watchers. Run focused JUnit checks for
  combined pagination, authorization policies and feedback counter transitions.
  Preserve lost-reply/replay behavior. Record actual results; a source rename
  alone does not prove the behavior.
- [x] 6. Review the application code for the same structural problem: split
  ownership of one feature, direct access to another domain's collections, or
  one screen assembled through avoidable repeated service/HTTP calls. Fix
  confirmed cases without starting an application-wide QA rerun.

## C. Focused screen checks

- [x] 7. In HTTP mode, open Feedback from the existing menu. Confirm the list,
  buckets and cards render, and capture that the page load makes one Feedback
  request. Open one completed-case evaluation and one event-related detail;
  confirm the correct context and existing image visibility rules.
- [x] 8. Submit one pending evaluation through the real form using its fixed
  labelled choices. Confirm their internal encoding and stored average, green submitted badge,
  read-only reopening and relevant counter change. Do not inject arbitrary
  numeric answers as a substitute for the form.
- [x] 9. Repeat the changed page/save/reload path in local mode. Confirm one
  simulated request delay, central Feedback persistence and the same visible
  result. Preserve unrelated fixture state. Reuse automated boundary-pagination
  evidence instead of replaying every list and filter.

## D. Close this checkpoint

- [x] 10. Record final evidence and remaining limitations in this checklist and
  its existing QA matrix row. Update the architecture PDF for the new Feedback
  domain. Restore temporary runtime/fixture changes, then continue the remaining
  MSC-116 checkpoints without repeating completed checks.

## Result

PASS — focused monolith and frontend-local verification completed on 2026-10-15.
This closes the Feedback UI checkpoint; it does not claim KVM or template runtime
qualification. Those deployment boundaries remain in their already scheduled campaigns.

### A. Implementation and source checks — PASS

1. Feedback owns the three canonical collections and API/service/repository layers.
   Events and Community use the Feedback API. The source ownership audit found no
   remaining direct cross-domain Feedback collection access.
2. Canonical backend, frontend, local storage, seed, component and transport names
   use Feedback. Empty local tables are initialized by the shared schema; the
   general IndexedDB writer deliberately omits empty tables. No insert-time repair
   or synthetic evaluation was added.
3. The HTTP page includes both event and completed-case entries, metadata, totals
   and both count groups in one POST. Local loadPage has one route-delay call.
   The local save/reload sequence made zero Feedback HTTP requests.
4. Feedback transport bindings/contracts include directory, preparation,
   eligibility, measurement and privacy. Missing measurement/privacy configuration
   pairs were added; their schema checks passed. Their compiled/runtime KVM result
   is not claimed here. Feedback product surfaces are absent from the minimal
   template, so no equivalent product implementation needs copying.

### B. Focused automated verification — PASS

5. Existing frontend watcher compiled the changes and restored HTTP mode.
   Standard JUnit: FeedbackService 19, BoundaryPolicyAnnotation 9,
   UserActivityCountersService 13: 41 passed. Embedded JUnit:
   FeedbackEvaluationCounter 1 and FeedbackCounterRecovery 1: 2 passed.
   Zero failures/errors/skips. No full application test suite was rerun.
6. Structural source review covered domain imports and frontend service read
   sequences. The confirmed Feedback composition defect was removed. Unrelated
   calls with distinct mutation/read or deployment-status/release-catalog purposes
   are not counted as duplicated Feedback queries; their screens were not replayed.

### C. Focused screen checks — PASS

7. HTTP combined page showed the Mingle event and completed case. Event detail
   retained its host/context; the case retained provider, title and image context.
   The retained image-hidden/deleted/missing checks remain prior evidence.
8. Maya submitted Good, Mostly reliable, Clear and Excellent value using the real
   form. Submit returned 200; one page refresh followed. Pending 2 became 1,
   evaluation pending 1 became 0 and feedbacked 0 became 1. Reopening was read-only
   with the same answers. Submitted badge used the shared green palette. No /10
   score appeared on the card. The internal average was 8.5; it is not a UI scale.
9. Alex's local case was completed through its existing action and accepted
   quotation. The real worker created three eligible evaluations. A real form
   submission moved Alex pending 1 to feedbacked 1; after reload all four selected
   choices remained read-only. The central feedbackEvaluations case row retained
   answers and counter buckets independently from serviceCases. An unchanged local
   i18n version exposed old cached keys; advancing the packaged EN/HU revision fixed
   it through normal reload, without clearing translation storage. This was local
   mode, not offline qualification.

### D. Closure — PASS

10. The five captured local tables were restored with writers stopped and verified:
    the case is open again, and previously absent empty Feedback tables are absent.
    activitiesDataSource is HTTP again. The HTTP campaign fixture remains retained
    for its owning end-of-campaign reset. The architecture PDF is version 0.1.2,
    with central Feedback ownership and 22-domain composition; changed pages were
    rendered and inspected. CSV/XLSX were reconciled. Remaining work is MSC-116,
    including its one serial KVM sample, without repeating this UI checkpoint.

Retained form/guide evidence is labelled as retained in the evidence directory.
The rejected synthetic odd-score example is explicitly excluded. EN/HU guide and
viewport checks were not replayed during this focused refactor verification.
