# MyScoutee product pitch deck

Audience: pilot communities, venue and experience partners, strategic investors,
product collaborators, and operators evaluating the underlying product.

Core pitch:

> MyScoutee replaces binary swipes with 1–10 ranked priorities, converts
> reciprocal and contextual evidence into a weighted social graph, forms
> group candidates, and connects those groups directly to chat, events,
> real-world coordination and structured feedback.

Brand treatment: when the heart logo and product name form a wordmark, the
logo replaces the leading **M** in **MyScoutee**; it is not placed before the
complete product name.

The product is designed around a different success event: a completed, mutually
welcomed real-world meeting. The deck does not claim users, revenue, retention,
product-market fit, or proven matching superiority.

## Plain-language abbreviations

- **AI** = artificial intelligence.
- **MAU** = monthly active user(s).
- **VPS** = virtual private server; in the deck this means an
  operator-hosted private deployment.

## Product history and code-size wording

The core product idea originated in 2016, before the current AI-assisted
implementation phase. This is an idea-origin date, not a claim of continuous
development since 2016. The current reproducible scope is approximately 350,000
physical source lines:

```text
frontend/src/app
server/projects/profile/src/main/java
frontend/src/assets/admin/affinity-graph/app.js
```

At the time of deck creation, those paths contain approximately 349,887 physical
lines. `cloc` reports roughly 318,000 logical code lines depending on exact
inclusion rules. The older LinkedIn article body referenced roughly 240,000
Angular lines; use the current scoped method when quoting the updated 350,000 figure.
Code volume demonstrates implementation breadth, not traction or defensibility.

## Eight-slide narrative

1. **Designed for the meeting. Not the swipe.**
   - 2016 idea origin, later AI-assisted construction, and the shift to
     engineering-led hardening and validation.
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
     clients delivering 10,000 frames. The stated 10,000-connection
     per-deployment ceiling remains an external validation item; it is not the
     repository benchmark and is not monthly active users (MAU).

6. **Why it is different.**
   - Graded rather than binary input.
   - Group rather than pair as the matching unit.
   - Match as the start of a meeting workflow.
   - Editable graph and meeting-linked evidence.
   - Planned, operator-owned and meeting-aligned monetization.
   - Raw AI-generated code is not presented as the moat.

7. **Local operators earn when groups create real-world action.**
   - Every operator-hosted virtual private server (VPS) is an independent local business.
   - An operator can sign its own venue, festival, activity, travel, or
     experience partners.
   - When a group makes an attributable booking, the agreed partner commission
     belongs to that operator—not to MyScoutee or the founder.
   - The operator may also choose local ticketing, checkout, organizer-service,
     promotion, or other commercial fees.
   - The operator controls its partners, pricing, payout account, proceeds,
     refunds, tax, and customer relationship; the software executes the
     configured local payment workflow.
   - No take rate, operator revenue, forecast, or affiliate conversion is claimed.
   - This local operator economy is completely separate from the proposed
     network-level fallback: only if the verified network reaches 10 million
     monthly active users (MAU) and no
     defined exit occurs, the founder seeks 5% of the contract-defined combined
     member-contribution base.
   - The founder's 5% network share is not the operator's affiliate commission
     and must not be described as a slice of a local partner booking.

8. **Prove the meeting loop, then scale distribution.**
   - Harden performance, mobile efficiency, safety and testing.
   - Pilot in one dense community.
   - Measure group proposal → acceptance → chat → event → attendance → feedback.
   - Validate whether local partner attribution produces sustainable commission
     for the operator.
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
