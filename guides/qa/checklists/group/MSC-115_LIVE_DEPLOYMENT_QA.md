# MSC-115 — separate live-deployment qualification

Status: NOT RUN. These checks require an actual configured deployment, external
identity/provider account or installed client. They do not block closure of the
separately proven development scope. This document does not authorize production
mutation, publication, real invitations or money movement.

Run top to bottom when that environment is available. Each item records its
deployment/version, account/device prerequisites, expected/observed result and
evidence separately. No local PASS is copied into this table.

| ID | Prerequisites and ordered action | Completion evidence | Status |
| --- | --- | --- | --- |
| MSC115-LIVE-01 | Published candidate with real configured identity provider and disposable consenting test account. Open an actual Work invite, sign in/register through that provider, claim it and verify private/base workspace membership. Repeat with an independent Community invite/account. | Actual redirect/provider/account/profile and saved membership; no publisher-account reuse. Local invitation/claim/denial tests remain in development QA. | NOT RUN |
| MSC115-LIVE-02 | Configured Firebase deployment and physical browser/device with notification permission. Cause one authorized test Campaign/Case notification and verify foreground, background and reopened destination in the intended workspace. | Actual device delivery and permissions; persisted outbox alone is insufficient. Disabled 204, misconfigured 503 and in-app notification/counter behavior stay in development QA. | NOT RUN |
| MSC115-LIVE-03 | Published GitHub Pages/local build and deployed HTTP build at their real URLs. Open fresh and warmed clients, verify mode articles/images/social links, then repeat offline and reconnect. | Actual deployed asset/cache/service-worker behavior, with cold/warmed/offline outcomes distinguished. Local public-catalog/no-write/override/retry tests stay in development QA. | NOT RUN |
| MSC115-LIVE-04 | Installed supported PWA/mobile client and the published candidate. Open Work/Community child popup, guide and nested menu; use native Back, background/resume and reopen. | Device/OS/browser/version and exact navigation/guide/state behavior. Responsive desktop/mobile CDP checks stay in development QA. | NOT RUN |

MSC-116/119 third-party MCP hosting, Events, publication and marketplace review
are independent tasks, not additional MSC-115 closure requirements. Manual
cash/transfer history is tested without executing a real bank transaction.

Development closure must name these four open follow-ups and retain their
status. Any product defect found here reopens its owning implementation scope;
separation is not permission to hide a known development defect.
