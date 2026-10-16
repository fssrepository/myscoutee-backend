# User-facing QA checklists

Stable, repeatable user-facing test guides. Execution status and dated evidence
belong in the [QA matrix](../matrices/ADMIN_DYNAMIC_SURFACES_QA_MATRIX.xlsx),
its [CSV source](../matrices/ADMIN_DYNAMIC_SURFACES_QA_MATRIX.csv), and the
[evidence directory](../evidence/). Resume from the
[current QA handoff](../handoffs/CURRENT_QA_SESSION.md).

## Template regression and fix propagation — MSC-122

MSC-122 and its completed template qualification are closed. This is not a
new open task or a request to repeat the completed template regression.
MSC-115 development is closed. The rules below apply to newly found shared defects.

The MSC-116/117/119 campaigns and user-requested MSC-118 QA must assess
whether a newly found defect affects `myscoutee-template`. Each linked checklist
defines its retained scope. Queue affected checks in the existing separate
MSC115-TEMPLATE-REGRESSION checkpoint and execute them there after carrying over
the fix; they do not become test steps inside the source campaigns. Omitted product features are N/A
with a reason, not missing template functionality.

For every defect found in these cases:

1. Record whether the template is affected, with the owning code/configuration
   and a concrete reason. An unchecked impact remains pending.
2. Repair the canonical owner and carry the applicable correction into the
   template, including its selected seeds, configuration or shared component
   revision where needed. Do not copy omitted product domains.
3. Record the source and template backend/frontend/components revisions that
   changed, the template regression command or checklist step, environment,
   result and evidence. Record an unaffected decision explicitly when applicable.
4. Verify the retained counterpart in applicable local and HTTP modes. For a
   completed backend change batch, use the existing serial monolith/KVM gates;
   only one stack runs at a time. Use focused checks, not a new stress campaign
   for every defect.

Keep source and template results separate in the testcase's matrix evidence and
in the template's own qualification matrix. Source PASS does not imply template
PASS. The template follow-up remains open until propagation and targeted
verification are recorded; it does not reopen accepted source development QA.
Actual provider/physical/deployed checks remain outside development QA.
These requirements do not change existing execution
statuses or authorize starting a manual browser campaign.

## Domain directories

Folder assignment follows the matrix's **QA domain** column. A testcase's name
or implementation technology does not create another domain. API integrations
belong to `api`; externally configured authentication belongs to `identity-access`.

| QA domain | Directory |
| --- | --- |
| API test | [api](api/) |
| Identity & access | [identity-access](identity-access/) |
| Event | [event](event/) |
| Asset | [asset](asset/) |
| Group | [group](group/) |
| Content | [content](content/) |
| Notifications | [notifications](notifications/) |
| Administration | [administration](administration/) |
| General UI | [general](general/) |
| Operator | [operator](operator/) |

## API test

- [ADMIN-CLIENT-API-001](api/ADMIN-CLIENT-API-001.md) — Private admin API and Linux monitor.
- [AFFILIATE-INVITATION-001](api/AFFILIATE-INVITATION-001.md) — Referral and imported-participant counters.
- [AFFILIATE-REVENUE-001](api/AFFILIATE-REVENUE-001.md) — referral turnover and refunds.
- [INTEGRATION-ACCESS-001](api/INTEGRATION-ACCESS-001.md) — API/MCP packs, live permissions and human-decision boundaries.
- [INTEGRATION-API-001](api/INTEGRATION-API-001.md) — API resources and callback.
- [INTEGRATION-API-GROUP-001](api/INTEGRATION-API-GROUP-001.md) — Group participant links.

## Identity & access

- [DEPLOY-EXTERNAL-CONFIG-001](identity-access/DEPLOY-EXTERNAL-CONFIG-001.md) — Externally configured authentication and integrations.
- [JOB-PURGE](identity-access/JOB-PURGE.md) — JOB-PURGE user test guide.
- [ROLE-TRIAD-CORE-001](identity-access/ROLE-TRIAD-CORE-001.md) — ROLE-TRIAD-CORE-001 user test guide.

## Event

- [EVENT-ACTIVITY-RATING-001](event/EVENT-ACTIVITY-RATING-001.md) — two-person activity rating.
- [EVENT-CALENDAR-EXPORT-001](event/EVENT-CALENDAR-EXPORT-001.md) — Manual calendar download and import.
- [EVENT-CHECKOUT-001](event/EVENT-CHECKOUT-001.md) — EVENT-CHECKOUT-001 user test guide.
- [EVENT-EDIT-RUNTIME-001](event/EVENT-EDIT-RUNTIME-001.md) — EVENT-EDIT-RUNTIME-001 user test guide.
- [EVENT-FOLLOWING-001](event/EVENT-FOLLOWING-001.md) — Followed organizers.
- [EVENT-FOLLOWING-002](event/EVENT-FOLLOWING-002.md) — Event menus, confirmation and committed following.
- [EVENT-GALLERY-FEED-001](event/EVENT-GALLERY-FEED-001.md) — Gallery, Photo Feed and shared content moderation.
- [EVENT-MODE-REGRESSION-001](event/EVENT-MODE-REGRESSION-001.md) — formats, preferences and meeting feedback.
- [EVENT-SCHEDULERS-001](event/EVENT-SCHEDULERS-001.md) — EVENT-SCHEDULERS-001 user test guide.
- [PAYMENT-METHODS-HISTORY-001](event/PAYMENT-METHODS-HISTORY-001.md) — PAYMENT-METHODS-HISTORY-001 user test guide.

## Asset

- [ASSET-ASSIGNMENT-LIFECYCLE-001](asset/ASSET-ASSIGNMENT-LIFECYCLE-001.md) — ASSET-ASSIGNMENT-LIFECYCLE-001 user test guide.
- [ASSET-BORROW-001](asset/ASSET-BORROW-001.md) — ASSET-BORROW-001 user test guide.
- [ASSET-CHECKOUT-001](asset/ASSET-CHECKOUT-001.md) — ASSET-CHECKOUT-001 user test guide.
- [ASSET-LIFE-001](asset/ASSET-LIFE-001.md) — ASSET-LIFE-001 user test guide.
- [ASSET-MEMBER-001](asset/ASSET-MEMBER-001.md) — ASSET-MEMBER-001 user test guide.
- [ASSET-PRICING-001](asset/ASSET-PRICING-001.md) — Pricing.
- [ASSET-VIS-001](asset/ASSET-VIS-001.md) — ASSET-VIS-001 user test guide.

## Group

- [GROUP-ISOLATION-001](group/GROUP-ISOLATION-001.md) — Workspace isolation samples.
- [GROUP-LIFECYCLE-001](group/GROUP-LIFECYCLE-001.md) — Community group lifecycle.

## Content

- [CONTENT-ADMIN-LIFECYCLE-001](content/CONTENT-ADMIN-LIFECYCLE-001.md) — CONTENT-ADMIN-LIFECYCLE-001 user test guide.

## Notifications

- [BELL-RATING-LIFECYCLE-001](notifications/BELL-RATING-LIFECYCLE-001.md) — BELL-RATING-LIFECYCLE-001 user test guide.
- [JOB-MESSAGES](notifications/JOB-MESSAGES.md) — JOB-MESSAGES user test guide.
- [MOBILE-PUSH-LIFECYCLE-001](notifications/MOBILE-PUSH-LIFECYCLE-001.md) — MOBILE-PUSH-LIFECYCLE-001 user test guide.
- [MOBILE-WEBVIEW-LIFECYCLE-001](notifications/MOBILE-WEBVIEW-LIFECYCLE-001.md) — MOBILE-WEBVIEW-LIFECYCLE-001 user test guide.
- [NOTIFICATION-ADMIN-LIFECYCLE-001](notifications/NOTIFICATION-ADMIN-LIFECYCLE-001.md) — NOTIFICATION-ADMIN-LIFECYCLE-001 user test guide.
- [UI-POLL-JANK-001](notifications/UI-POLL-JANK-001.md) — UI-POLL-JANK-001 user test guide.

## Administration

- [ADMIN-AFFINITY-GRAPH-001](administration/ADMIN-AFFINITY-GRAPH-001.md) — Graph exploration, loading and materialization.
- [ADMIN-MONITORING-001](administration/ADMIN-MONITORING-001.md) — Monitoring, task lifecycle and configuration counters.
- [ADMIN-PARAMETERS-001](administration/ADMIN-PARAMETERS-001.md) — Section-specific persistence, effects and validation.

## General UI

- [MSC115-TEMPLATE-REGRESSION](../../../../myscoutee-template/guides/qa/checklists/general/MSC115-TEMPLATE-REGRESSION.md) — Only unverified template deltas from collected MSC-115/116/117/118/119 fixes; credit completed evidence before execution.

- [CHAT-CALL-001](general/CHAT-CALL-001.md) — Saját STUN, WebRTC hang/videó, MLS és koordinátorcsere.

- [FEEDBACK-UI-001](general/FEEDBACK-UI-001.md) — Central Feedback ownership, one list request, local parity and focused form verification.

- [EXPLANATION-GUIDE-001](general/EXPLANATION-GUIDE-001.md) — CLOSED / PASS for accepted scope; original application-wide guide checklist preserved.
- [MSC-116 consolidated automatic QA](api/MSC-116_AUTOMATIC_QA.md) — Includes the remaining MSC-119 introduction in steps 75–81 before one KVM sample; no separate MSC-119 QA or duplicate guide run.

## Operator

- [OPERATOR-CONFIGURATION-LIFECYCLE-001](operator/OPERATOR-CONFIGURATION-LIFECYCLE-001.md) — Firebase configuration and activation.
- [OPERATOR-EMAIL-WARNING-001](operator/OPERATOR-EMAIL-WARNING-001.md) — Email provider configuration and deletion-warning Job.
- [OPERATOR-REGISTRY-LIFECYCLE-001](operator/OPERATOR-REGISTRY-LIFECYCLE-001.md) — Binding, claim, community and measurement.
- [OPERATOR-REVENUE-LIFECYCLE-001](operator/OPERATOR-REVENUE-LIFECYCLE-001.md) — Revenue aggregation, report and settlement.
- [OPERATOR-UPDATE-LIFECYCLE-001](operator/OPERATOR-UPDATE-LIFECYCLE-001.md) — Verified update, rollback and managed HTTPS.
