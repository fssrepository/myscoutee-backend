# MyScoutee product pitch deck

Audience: pilot communities, venue and experience partners, strategic investors,
product collaborators, and operators evaluating the underlying product.

Core pitch:

> MyScoutee replaces binary swipes with 1–10 ranked priorities, converts
> reciprocal and contextual evidence into a weighted social graph, forms
> group candidates, and connects those groups directly to chat, events,
> real-world coordination and structured feedback.

The product is designed around a different success event: a completed, mutually
welcomed real-world meeting. The deck does not claim users, revenue, retention,
product-market fit, or proven matching superiority.

## Founder story and code-size wording

Peter Pal Szabo, MSc describes the product as a ten-year concept that became
materially implementable during the AI-assisted development wave, backed by more
than twenty years of full-stack engineering experience. The current reproducible
scope is approximately 350,000 physical source lines:

```text
frontend/src/app
server/projects/profile/src/main/java
frontend/src/assets/admin/affinity-graph/app.js
```

At the time of deck creation, those paths contain approximately 349,887 physical
lines. `cloc` reports roughly 318,000 logical code lines depending on exact
inclusion rules. The older LinkedIn article body referenced roughly 240,000
Angular lines; use the current scoped method when quoting the updated 350k figure.
Code volume demonstrates implementation breadth, not traction or defensibility.

## Eight-slide narrative

1. **Designed for the meeting. Not the swipe.**
   - Ten-year product thesis, AI-assisted construction, and the shift to
     senior-engineer-led hardening and validation.
   - Product definition: ranked intent → mutual graph → group → event.

2. **The category stops at a match. MyScoutee is designed for the meeting.**
   - Binary input discards preference strength.
   - Pair-first interaction can create pressure.
   - Match/message metrics do not prove a real-world outcome.
   - Initial wedge: lower-pressure, activity-led social and dating contexts.

3. **One richer input becomes a weighted mutual graph.**
   - Users rate individuals or pairs on a 1–10 scale.
   - Reciprocal ratings, profile evidence, distance and context feed weighted
     affinity.
   - The backend group planner uses graph components, constraints and local swap
     refinement to form groups.
   - Priorities remain editable. Structured post-event feedback adds reputation
     evidence; do not claim every answer directly changes future matching.

4. **The whole path from signal to shared experience.**
   - Prioritize → form group → chat → plan event → meet/check in → feedback.
   - Product north star: completed, mutually welcomed meetings.

5. **The built operating surface.**
   - Match intelligence, group planning, chat, event operations, resources,
     checkout/tickets, feedback, moderation and administration are implemented.
   - Checkout, pricing, promo, payment-session and provider-adapter code exists,
     but production payment charging is disabled.
   - Debian-packaged Docker deployment exists.
   - Repository benchmark evidence validates 500 simultaneous WebSocket room
     clients delivering 10,000 frames. The founder-stated 10,000-connection
     per-deployment ceiling remains an external validation item; it is not the
     repository benchmark and is not MAU.

6. **Why it is different.**
   - Graded rather than binary input.
   - Group rather than pair as the matching unit.
   - Match as the start of a meeting workflow.
   - Editable graph and meeting-linked evidence.
   - Planned meeting-aligned monetization.
   - Raw AI-generated code is not presented as the moat.

7. **Planned revenue begins with real-world action.**
   - Primary hypothesis: affiliate/referral commission from attributable venue,
     festival, activity, travel or experience bookings.
   - Expansion hypotheses: event commerce fees and B2B branded deployment/support.
   - No take rate, revenue, forecast or affiliate conversion is claimed.
   - This product revenue model is separate from the proposed network-level
     exit-participation and 5% fallback model.

8. **Prove the meeting loop, then scale distribution.**
   - Harden performance, mobile efficiency, safety and testing.
   - Pilot in one dense community.
   - Measure group proposal → acceptance → chat → event → attendance → feedback.
   - Validate partner attribution and contribution margin.
   - Build a repeatable community/city/operator launch playbook.

## Repository evidence

- 1–10 rating UI and rate sync:
  `frontend/src/app/home/components/home/home.component.ts`,
  `frontend/src/app/shared/core/http/services/rates.service.ts`,
  `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/service/UserRatesService.java`.
- Reciprocal/context affinity:
  `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/service/AffinityCalculationService.java`,
  `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/service/UserAffinityEdgeService.java`.
- Group planning:
  `server/projects/profile/src/main/java/com/raxim/myscoutee/algo/StableGroupPlanner.java`,
  `server/projects/profile/src/e2eTest/java/com/raxim/myscoutee/e2e/BackendAlgorithmsE2ETest.java`.
- Chat:
  `server/projects/profile/src/main/java/com/raxim/myscoutee/common/config/ChatWebSocketConfig.java`,
  `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/controller/activities/ChatsController.java`.
- Events and feedback:
  `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/controller/activities/ActivitiesEventsController.java`,
  `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/service/ActivitiesEventFeedbackService.java`.
- Resources and tickets:
  `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/service/ActivitiesResourcesService.java`,
  `frontend/src/app/asset/components/asset-ticket-scanner-popup/`.
- Checkout/payment scaffolding:
  `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/controller/payment/PaymentRestController.java`,
  `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/service/EventCheckoutPricingService.java`,
  `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/service/PaymentService.java`.
- Moderation/admin:
  `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/controller/admin/AdminController.java`,
  `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/service/AdminModerationService.java`.
- Packaging:
  `packaging/README.md`, `packaging/scripts/package-production.sh`,
  `packaging/dist/myscoutee_1.0.0_amd64.deb`.

## Claims to avoid

- Proven MAU, retention, revenue, affiliate conversion or product-market fit.
- Proven improvement in safety, matching quality or real-world meeting rates.
- Patented or proprietary algorithm unless corresponding rights are documented.
- Live card charging or a working affiliate commission ledger.
- 10,000 concurrent connections as repository-tested capacity.
- A claim that every feedback answer automatically changes the matching graph.
- Presenting the GitHub Pages demo as proof of the production backend; it is an
  experimental UI prototype using local seeded data.
