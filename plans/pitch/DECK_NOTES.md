# MyScoutee Network pitch deck

Audience: independent operators, strategic partners, and investors who understand an operator-led network.

Core pitch:

> Keep your brand and community. Run a supported MyScoutee core. Prove your contribution with privacy-safe telemetry. Share the value the network creates.

The new product is deliberately narrow: every deployment sends privacy-safe,
signed aggregate telemetry to a central registry and receives a unique deployment
code. An operator claims that code and registers the company/operator identity to
attach the server's measured history to a traceable beneficiary. The dashboard
then shows its claimed network weight and indicative exit share. At an exit
record date, eligible claims and their verified weights become the actual
allocation basis.

No application, invitation, pilot cohort, or negotiation is required to install.
Telemetry is automatic; claiming is optional. An operator that leaves its code
unclaimed can keep using and monetizing the branded deployment independently,
but the telemetry remains unattributed and the operator receives no Network
Success Pool allocation. An operator that will not identify its company/operator
in the registry therefore gives up exit participation. An exit is not mandatory;
the network can continue operating indefinitely. The strategic tradeoff is that
independent deployments may eventually compete with a much larger coordinated
network.

Every operator is a commercially independent business. The local MyScoutee
software handles the checkout/payment workflow, while the operator connects and
controls its own merchant/payment account and remains responsible for pricing,
partners, customer funds, refunds, tax, and the customer relationship. The founder
does not collect end-customer payments on an operator's behalf.

If an operator recruits a venue, festival, activity, travel, or experience
partner for its VPS, the attributable affiliate/referral commission belongs to
that operator. It is local operator revenue, not MyScoutee/founder revenue and
is excluded from the founder's separate 10M/no-exit fallback base.

Each registered operator receives a share based on verified claimed network weight.
The founder starts with 100,000 contribution units, so an earlier exit can produce
a founder share above 10%. At 1 million total units, the founder share reaches and
then remains fixed at 10%; operators share the other 90%.

## Truth labels used in the deck

- **BUILT**: supported by the current repository or a built artifact.
- **PLANNED**: explicitly present in the roadmap, but not shipped.
- **PROPOSED**: an economic, legal, or operating model that still needs agreement.
- **MODEL — NOT TRACTION**: a milestone or financial sensitivity, not a current result.

## Seven-slide narrative

1. **One product engine. Many local brands. One verifiable upside.**
   - Meeting-first product and packaged self-hosting exist.
   - The central telemetry registry, claim dashboard, and Network Success Pool are the new project.

2. **The product closes the gap between matching and meeting.**
   - Preference signal → affinity graph → optimized group → event → feedback.
   - Product breadth is evidenced by the current codebase; code counts are not customer traction.
   - Current stated chat ceiling is approximately 10,000 concurrent connections per deployment. This is not the same as network MAU and must be independently validated before an external capacity claim.
   - Aggregate network scale comes from many independently hosted deployments; a single brand that exceeds this ceiling needs a documented horizontal-scaling or sharding path.

3. **Open distribution surface. Licensed, packaged core.**
   - Open AGPL frontend; proprietary/licensed backend should be described only after an EULA is added.
   - The existing Debian artifact is `myscoutee_1.0.0_amd64.deb`, 193,096,630 bytes.
   - Rebranding is a credible foundation, but the one-command brand kit is still planned.
   - The software provides the local checkout/payment workflow; every operator uses its own payment account and keeps commercial control.
   - The founder supplies the software and shared network rail, but is not the central merchant or collector of operator customer funds.

4. **Every deployment is measured; only claimed weight participates.**
   - The current repository records telemetry locally; the planned deployed architecture automatically sends signed aggregates to the registry.
   - Automatic signed aggregate delivery, deployment-code issuance, registry claims, deduplication, share history, and dispute workflow are planned.
   - A claim binds a deployment's measured history to a verified company/operator.
   - Before an exit it displays an indicative allocation; the actual allocation freezes at the agreed exit record date.
   - Unclaimed deployments still send aggregate telemetry, but have no beneficiary and receive no Network Success Pool share.
   - An unregistered operator may continue running and monetizing the deployment independently after an exit.
   - Recommended v1 weight:

     ```text
     Qualified MAU =
       distinct human users with at least two substantive actions
       on at least two days in a rolling 30-day period

     operator weight =
       average Qualified MAU over the six complete months
       before the measurement date
     ```

   - Raw profiles, chats, contacts, precise location, and payment details stay local.

5. **The founder contributes the core. Operators contribute distribution.**
   - The dashboard separates measured network scale from claimed, exit-eligible weight.
   - Recommended working interpretation:

     ```text
     B = 100,000 founder contribution units
     A = sum(all verified deployment weights)
     C = sum(claimed, eligible operator weights)
     T = B + A
     founder share F = max(10%, B / T)
     registered operator i share = (1 - F) * claimed_weight_i / C
     unclaimed deployment payout = 0
     ```

   - At 1 million total contribution units, the founder reaches a fixed 10%; operators share 90%.
   - This working rule lets unclaimed telemetry prove total scale, while reallocating the operator pool only across valid claims. Confirm that treatment in the participation agreement.
   - “Fixed at 10% after 1M” is clearer than “capped at 10%,” because the rule is economically a floor after the threshold.
   - Decide whether the founder’s 100,000 units are verified users or an economic credit. If they are a credit, do not include them in public network MAU.
   - This should be a contractual success pool, not casually described as equity or shares.
   - If venture capital is required, consider a disclosed Core/IP hurdle before the 90/10 network-uplift split.

6. **At 10M MAU with no exit, a separate 5% network share activates.**
   - This deck assumes the trigger uses verified aggregate reach from all deployments and activates only if that network reaches 10M MAU and no defined exit has occurred.
   - The founder receives 5% of the contractually defined combined member-contribution base.
   - The combined member-contribution base excludes operator-owned local partner commissions.
   - This is a network-level fallback share, not a take rate on a local venue,
     event, travel, or experience partner commission.
   - Local affiliate/referral commission belongs to the operator that acquired
     the partner for its VPS.
   - The local software handles checkout/payment logic, but each operator connects its own payment account and remains the independent merchant.
   - Customer funds do not flow through the founder; each operator retains control of its pricing, partners, billing configuration, proceeds, refunds, tax, and customer relationship.
   - MyScoutee does not prescribe an affiliate program, shared central checkout, conversion model, basket size, or method for generating revenue.
   - The software can calculate/report the separate member-contribution base without turning the founder into a payment intermediary.
   - The participation agreement still has to define what members contribute to
     the combined base, as well as exclusions, reporting, audit, and settlement timing.

7. **Install freely. Claim optionally. Let verified scale compound.**
   - Every operator can install under any brand without applying, registering, or joining a cohort.
   - Automatic aggregate telemetry starts under the unique code issued at deployment.
   - Claiming can happen later; it binds the measurable history to a named company/operator and activates traceable exit participation.
   - An unclaimed deployment remains operational and independent, while its exit allocation remains zero.
   - The value thesis is superlinear: more verified reach can create more-than-linear strategic value through distribution, usage proof, compatibility, scarcity, and network relevance.
   - `V(network) ~ verified_reach ^ alpha, alpha > 1` is a working network-effects hypothesis—not a current valuation, forecast, or guaranteed exponential price curve.

## Evidence behind “built”

- Meeting-first product thesis: `README.md`.
- Product flow and landing: `frontend/src/app/entry/components/entry-landing/entry-landing.component.html`.
- Affinity scoring: `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/service/AffinityCalculationService.java`.
- Group planning: `server/projects/profile/src/main/java/com/raxim/myscoutee/profile/algo/StableGroupPlanner.java`.
- Events, chat, resources, ticketing, pricing, moderation, and admin surfaces:
  `frontend/src/app/shared/core/contracts/` and server controllers.
- Packaging: `packaging/README.md`, `packaging/scripts/package-production.sh`,
  and `packaging/dist/myscoutee_1.0.0_amd64.deb`.
- Planned central metrics/rebrand layer: `plans/features.txt`.
- Local telemetry: `AdminTelemetryService.java`, `AdminStatsTelemetryWorkerService.java`,
  and `AdminStatsService.java`.
- Local benchmark artifacts:
  `.e2e-artifacts/stress-ramp/backend/server-events-read-2026-06-01T11-04-34-928Z/ramp-summary.md`
  and `.e2e-artifacts/stress/websocket-room-2026-05-24T06-46-40-953Z/index.md`.

## Items for the next, more precise specification version

- Founder units: real verified MAU or an economic credit.
- Deduplicated network MAU versus deployment-level activity.
- Whether the 1M and 10M milestones use all measured weight or only claimed weight; the deck currently uses all measured weight for network scale.
- Current six-month average versus vested lifetime contribution.
- Exact qualifying actions and fraud exclusions.
- Exit definition, net distributable proceeds, record date, audit, dispute, clawback, tax, and treatment of investor preferences.
- Deployment-code custody, transfer, loss, reassignment, and proof of control.
- Whether registry identity is confidential or publicly visible, and which evidence verifies the company/operator.
- Claim timing, retroactive attribution of pre-claim history, withdrawal, re-entry, and the exit record date.
- Treatment of unclaimed weight: the deck recommends that it proves total scale but has no beneficiary and does not dilute valid claims.
- Contractual reach of the 5% fallback over unclaimed operators that have no registry participation agreement.
- Independent verification of the stated 10,000 concurrent-chat-connection ceiling and the scaling path beyond it.
- The exact combined member-contribution base for the 5% fallback, exclusions,
  reporting, audit, and settlement timing.
- Explicit separation of operator-owned local partner commission from the
  founder's network-level fallback share.
- Payment-account ownership, payment-provider integration, and confirmation that each operator—not the founder—is the merchant for its customers.
- Backend EULA, trademark license, update/support terms, data roles, privacy notice, and change-of-control assignment.
- Evidence and sensitivity ranges for the proposed superlinear relationship between verified reach and strategic network value.
