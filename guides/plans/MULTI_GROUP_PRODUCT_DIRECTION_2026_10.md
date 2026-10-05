# Reusing MyScoutee for different group types

Tracking: [MSC-115](https://github.com/fssrepository/myscoutee-roadmap/issues/153). Branch in both repositories: `plan/multi-group-product-experiment`.

This document records the product discussion of 1–5 October 2026. **Last design update: 5 October 2026, after the Community, Cases, scheduling, payment-history and Campaign-chat decisions.** The aim is to reuse MyScoutee's existing groups, priorities, events, and connections with limited development effort.

The Work and Community checkpoints below describe implemented code, without browser-QA sign-off. The original Work checkpoint is historical; the final Community/shared checkpoint records the subsequent delivery. The agreed Community sections supersede earlier exploratory statements about a separate service recommender, Services scoped only to one private group, or an undecided Community home screen. The [shared follow-up discussion](https://chatgpt.com/share/6ac31fae-bd80-83ed-8a2b-d7fbe31df614) provided intermediate ideas; subsequent user decisions recorded here take precedence over suggestions in that conversation.

## Current direction at a glance

| Surface | Agreed behavior |
| --- | --- |
| Work base group | Campaign InfoCards and person priorities. New follow-up: rate the campaign author through the campaign before starting a direct Campaign chat. |
| Community base group | Location-based service discovery and prioritization through InfoCards, using the familiar Home rating interaction. |
| A specific community workspace | Admin-maintained announcements in a newest-first SingleRow SmartList. Optional apartment-weighted voting and aggregate results use their own behavior. |
| Cases / Issues menu | A flattened, role-aware SmartList aggregating authorized cases across communities in the base-group context. It appears beside Groups and can be opened from a private group's menu too. |
| Service details and appointments | Service sheets, availability, pricing and terms; reuse the event slot editor and full customer slot-picker interaction. Services remain outside the existing Tools/Assets menu for this delivery. |
| Payment history, all group types | Own transactions in the active group, optionally filtered to one counterparty. Manual receipts support cash and bank transfer. |
| App administration | Preserve menus and extend the selected-base-group data, job and counter isolation to Community. |

Detailed current requirements: [Community and Cases](#community-services-cases-and-voting--next-delivery), [shared payment changes](#payment-history--shared-follow-up-for-every-group-type), [Campaign and Case chat](#campaign-and-case-chat--shared-follow-up), and [implementation boundaries](#implementation-boundaries-and-reuse-references).

## Work foundation and original delivery scope

### Campaign roles and application administration

Every Work member can organize campaigns and participate in other people's campaigns at the same time. Organizer/admin authority belongs to the individual campaign (currently its creator/owner); it is not a separate account type and does not require group administration. Creating a campaign must never grant the app-admin role. The separate app-admin role handles moderation, support, configuration and monitoring; its Dating/Work selector changes that administrative data scope only.


The original Work delivery added Work alongside the existing Dating experience. Community was excluded from that delivery and is now specified separately below.

- Reuse the member workspace selector for app admins. Add the Work base group, preserve the admin menu, and scope every admin function to the selected group. Selector badges aggregate the actionable menu badges using the existing counter ownership and refresh path.
- Place the landing AppMenu immediately after the logo on desktop, with the shared compact icon presentation on mobile. Dating remains the default; shared links can select the initial mode. Work changes bundled hero copy and lazily loaded, group-assigned articles and image slides.
- Campaign discovery and participant selection use distances between the campaign owner's and interested people's profile coordinates through the existing location pipeline. Seed nearby and more distant participants inside supported territories.
- Work home filters describe the opportunity: work, business, or both, plus category and a small set of practical filters. Campaign editors define relevant candidate requirements using the existing form controls.
- Add Campaigns beside Groups. Reuse SmartList, the header create action, event-style draft/publish/trash buckets, and FormFlow editing/read-only presentation. Any Work member may create a campaign. A campaign has capacity and optional images, and initially has no mandatory dates or invitation/pending lifecycle.
- Work home uses InfoCards with meaningful campaign information and the existing rating control. The card's three-dot menu opens campaign details or its author's public profile. Both views expose only appropriate user-facing data.
- Ratings remain person-to-person, optionally attributed to a campaign. A campaign card is the context through which someone rates its author; organizers rate the interested people. Both sides still see people in the existing Ratings list. The write model adds an optional `campaignId` column and permits multiple rows for the same person pair, one per campaign. Queries filter by campaign when selected and aggregate those rows into one person row; the UI must not show duplicates. Unfiltered events use the aggregate person rating. Working aggregation rule: take the latest positive score per campaign and direction, then use an equally weighted arithmetic mean across contexts (including the general context), rounded to two decimals. A missing score does not count as zero. Campaign selection is applied before aggregation. This keeps the score on its existing scale and avoids rewarding authors simply for publishing more campaigns. The latest picker design supersedes the earlier inline AppMenu list: a basket-style header control opens the existing campaign SmartList in single-selection mode; a row-level `+` selects one campaign. Reuse paging/search so large campaign lists remain usable. Show the selected campaign's name in the header's second row (not a generic 'Filtered by campaign' label), with a clear return to the aggregate view. A counter may use the existing basket selection convention; do not invent a separate unread metric. The event editor receives the same campaign selection, following its existing topic selector pattern.
- Events also offer the same campaign SmartList filter as Ratings and show the selected campaign name in their header. Event feedback uses the same selector, filtering through the associated event campaign and showing the campaign name in its header. The new Campaign chat channel/bucket is specified below; filtering the whole chat list to one particular campaign remains a separate, deferred convenience.
- Work events are deliberately created. An optional campaign selects the corresponding person-rating/priority pool and capacity context; without a campaign, the existing general sympathy-rating flow applies. Disable automatic random event generation for Work groups.
- Add a group-type AppMenu to the existing group editor. This delivery enables Dating and Work; Community remains deferred.
- A private workspace invitation carries its Dating/Work type into the existing login redirect and selects the corresponding landing content. With no influencing shared-link context, Dating is the default. The validated invitation claim associates the account with the invited workspace and its matching base group; a public landing hint grants no membership.
- Future group discovery: lead with cards promoting the other two base contexts, with direct joining that does not require approval. For Work, the eventual cards are Dating and Community. Generate suitable group-card images when that discovery block is implemented. Community remains outside this commit.
- Demo accounts can belong to both base groups; selection and its existing query include Dating/Work membership and open the requested context.
- Local service/repository behavior must stay aligned with HTTP. Audit seed/read/counter consistency beyond the reported examples (Alex chat badges and the missing UK country). Seed accepted coordinates inside supported territories for most demo users; reserve two active profiles for location acquisition. Preserve recorded locations and changes across reloads.
- Work is always campaign-led: one author publishes an idea or opportunity and multiple people express interest through it. There is no horizontal member-discovery flow in this Work delivery, including business-idea campaigns.
- Work articles cover professional networking, work-opportunity introductions, idea/partner/team formation and team building. The four-panel slideshow depicts publishing a campaign, person priorities through it, event invitations and a meeting. Localized captions remain outside the image.

Reuse references: `GroupWorkspaceStore` and `profileMenuBadgeCount` for switching and attention; `AppMenu` for selectors; `CommunityGroupsPopup` and the activity event list for SmartList lifecycle; `FormFlow` and the event editor for editing/read-only controls; the existing landing content service for lazy content; existing rate outbox and services for ratings. Campaign is a separate domain model with its own collection, repository, service and API routes in both the local and backend implementations. Reuse the existing HTTP client/adapter infrastructure, not event persistence or event routes. Reuse event UI patterns for the popup, editor and draft/publish/trash controls. A campaign has no mandatory schedule or attendee invitations; events reference it through an optional `campaignId`. List mutations should use `upsertConvertedVisibleItem`, `patchConvertedVisibleItem`, and `removeVisibleItemByIdentity` as appropriate; changing the selected group/campaign changes the query scope.

### Implementation checkpoint — 5 October 2026

The following code is implemented on `plan/multi-group-product-experiment` in the frontend and backend. This is an implementation checkpoint, not a completed browser-QA sign-off.

| Area | Implemented behavior |
| --- | --- |
| Campaign domain | Independent model/collection, repositories and local/HTTP services; owner-controlled draft, publish, unpublish, trash and restore with version checks. Campaign authors remain ordinary Work members. |
| Work UI | Lazy Campaign SmartList and FormFlow editor/read-only view, home InfoCards, opportunity/category/distance filters, and public author/campaign views through the existing three-dot menu. |
| Ratings | Campaign-aware write identity and backend index, shared person aggregation, scoped HTTP cache and existing rate editor/outbox. Only published campaigns accept new ratings. |
| Events | Campaign picker and filters for events, ratings and event feedback; selected campaign title in the header; campaign candidate pool and existing capacity/invitation lifecycle. New campaign-event associations require that campaign's organizer; existing events survive campaign unpublishing. Work automatic random grouping is disabled. Candidate invitation scope is enforced for Dating as well as Work. |
| Landing | One layout, Dating default, compact Dating/Work menu, shared/invite context, bundled EN/HU copy, eight Work articles and four slideshow panels. The final generated artwork depicts one campaign author and interested participants. |
| Demo/local parity | Base-membership demo selection and Work profiles, campaign/rating/event/roster fixtures, two location-acquisition profiles and seeded supported-area coordinates for the others, UK coverage, persisted chat state and counters from actual threads. Work seeds have one source and a synchronization check for Mongo demo/e2e/content data. |
| App administration | Existing workspace selector and menu retained. Work base profile, scoped reports/feedback, support cases and assignments, moderation, article content, parameters, monitoring/statistics and graph query paths. Campaign organizing does not confer app-admin authority. |

Verification at this checkpoint:

- `npm run build:local` succeeded after the final editor changes (18.4 seconds). Frontend checkpoint commit: `4ac7c76ae`.
- 54 focused frontend tests passed across local campaigns, admin scope, groups, invitations, chat seeds, content moderation, user/article seeds and HTTP landing/rate adapters. The additional campaign-event ownership case also passed (7 campaign cases total).
- Demo bootstrap and operator mapper suites passed: 26 cases. The audit exposed a real pre-existing missing integration configuration field during operator reseeding; the mapper now preserves it. Stale bootstrap expectations were updated to the current payment seed version and 50-profile graph.
- Targeted backend suites passed for campaign ownership/lifecycle, campaign rating aggregation, event scheduling, group/profile isolation, support, app-admin scope and affinity configuration. The latest combined run passed 179 tests across eight suites (campaigns, ratings, events, scheduling, support, moderation and affinity).
- `node frontend/scripts/sync-work-seeds.js --check` passed.
- `node frontend/scripts/audit-i18n-mongo-seed.js` passed: 11,702 messages, two bundles, three Mongo seed sets.
- No browser checklist has been run. The planned pair QA still needs to verify desktop/mobile presentation and real HTTP/Mongo round trips.

The follow-up group-isolation correction is implemented in
[Work administration and Campaign integration](WORK_ADMIN_GROUP_ISOLATION_2026_10.md).
That checkpoint records the 23/22 Dating/Work job inventory, scoped runtime and
content, local snapshots and counters, payment approval filtering, external
Campaign creation, and verification boundaries. Browser pair QA remains pending.

Community implementation, promotional Community group cards, the new Campaign/Case chat channels, and the shared payment-history extensions remain outside this completed Work code checkpoint. Their current design is recorded below. A per-campaign chat-list filter is still distinct from the newly requested Campaign channel bucket.

## Shared foundation and group model

- Three entry directions emerged: **traditional/local communities**, **priority-based dating**, and **professional connections**. The earlier “HR” label for the professional direction is too narrow: the goal is not a complete job board or HR system.
- Every group is an independent, switchable workspace. A “main login group” only describes the initial context; there is no automatic parent/subgroup inheritance. A user may join groups of different types, such as a residential community and a separate priority-based dating group.
- Group type and configuration determine which menus and behaviors are available. Priority can be enabled for one group even when the user's other groups do not use it; for example, a residential-community member could also join a separate priority-based dating group. Group type, in-group role, and app-level administration are separate concepts.
- A group admin manages that community; member is the general participant. **Support** is the working name for limited case participation, such as a contractor or helper. An external Support participant belongs to the base group and does not gain private-community membership from a case invitation. A resident can also provide a service, retaining their ordinary membership alongside case-specific authority. An app admin is a separate platform role.
- According to the discussion, invitation-only groups hidden from other users already exist. Invitation links and inactive or featured groups were also raised. Joining another suggested group should be an explicit choice, never an automatic side effect of an invitation.
- The location functionality remains unchanged for now.

## One configurable landing page and administration

There is **one landing page** with three configurable usage modes, not three separate landing sites. Its structure and content slots stay the same. The operator could configure the modes from a list; when the page loads, backend-provided values select different articles, slideshow content, labels, and other content within those slots. Small mode-specific design accents are possible, but a mode does not replace the layout. The MyScoutee logo remains the common brand. An operator/admin entry view was also raised as a separate question. The traditional-community mode should cover more than residential buildings: gyms, clubs, associations, and membership communities also belong here, without separate landing implementations for those variants.

The operator surface is expected to remain unified. The existing app-admin menus and popups may all be relevant in Work, Dating, and Community. The selected base group should primarily scope the data that each popup reads or edits, including content, statistics, graph, and payment-related functions. Their common structure can remain; labels or presentation need only small changes where the group-specific data calls for them. Test-only payment controls remain test tools. Most group-specific choices should remain with that group's leader. A broad operator or app-admin redesign is outside the initial experiment.

The mobile header uses a compact app menu between the MyScoutee logo and the login button. Its choices select the corresponding configured content and may add a small visual accent next to the logo. For example, **MyScoutee logo + Work + Login** reads as **MyScoutee Work** while retaining the MyScoutee logo and the same page structure. The selected mode does not itself join a group, change a user's role, or grant access. The existing landing already has a shared menu component in its hero, so the header control should reuse that component in this implementation.

Login remains one shared flow across the three landing modes. For a real account, the existing login and account/group context determines which user profile loads after authentication; the landing mode is not a separate profile type or authentication path. The demo entry should present users who belong to the selected base group, while the app-admin demo entry remains available. Demo accounts need not be partitioned into exclusive mode-specific sets: the same user could appear from both Dating and Community if they belong to both base groups. The chosen demo entry should start in the corresponding base-group context, with the user's other groups still available through normal group switching. This does not change the real-account login rules.

The recommended working names are **MyScoutee Work**, **MyScoutee Dating**, and **MyScoutee Community**; the compact menu itself can show only **Work**, **Dating**, and **Community** beside the shared MyScoutee logo. *Work* includes professionals, companies, and business-idea teams, while *Business* would suggest a narrower company or entrepreneur audience. *Community* includes residential buildings, gyms, clubs, and associations, while *Home* would suggest housing alone.

Dating is the default landing mode on an ordinary visit. A shared link may select Work or Community as the initial landing mode, while the header menu lets the visitor switch modes on the same page. The link selects presentation only; it does not grant group access or change authentication. Validated group invitations use the existing share/integration route. An ordinary fresh visit defaults to Dating.

## App admin contexts and report routing

The app admin uses the existing profile/workspace selector for Dating, Work and Community. Switching changes the administrative profile, closes stale workspace views and refreshes data. It does not enroll the app admin in every independent workspace. A campaign's organizer/admin is a separate, campaign-local authority.

Reports are routed by the source profile's base context: the reporter's workspace/type for a report and the sender's for feedback. A report originating inside a Work workspace reaches the Work base admin; Dating reports reach the Dating base admin. The target person, action, event and source group remain case context. Support threads carry their base-group scope, and support-case queries, assignments and counters enforce it. The existing explicitly shared-workspace support flow remains the route to inspect private workspace activity.

Base-profile statistics exclude independent workspace profiles; independent-group statistics remain a later reuse task. Implementation and verification coverage is recorded in the linked Work administration checkpoint. Community requires the same selected-base-group scope throughout. Its priority-based public surface does not require an app-admin menu redesign. The group admin, rather than the app admin, operates residential announcements and voting.

## Community, services, cases and voting — next delivery

### Public discovery and private community workspaces

Community remains the third base group and landing mode, covering local services, residential communities, gyms, clubs and associations. Its base-group Home presents service InfoCards with useful details, optional images, category selection, location-based ordering and service-based priorities. Ratings keep the familiar person-oriented interaction through the service context. Service providers and customers are not mutually exclusive account types: anyone may act as either in different matters. Use the Work campaign flow as the reference for contextual priority rows and aggregation; a service is its own domain context.

A specific community workspace uses announcements and ordinary voting instead of that priority-based Home. Residential workspaces can remain invisible and invitation-only. A club may be discoverable but closed to nonmembers, using the existing visibility/admission model. These remain independent workspaces; access to a service or case does not expose a private community.

### Community Home: announcements and voting

- Home is a SingleRow SmartList ordered by announcement date descending. It is not an image-card rating deck. Voting availability can affect the contextual color and appears as an action in the row's three-dot menu.
- Only the group admin creates and maintains Home announcements. Use a minimal editor with title/text and file attachments; uploading an image is not a prerequisite. The admin edits, publishes and soft-deletes through the existing three-dot/lifecycle patterns, with draft, published and deleted/trash buckets.
- An announcement can be informational, request opinions/recommendations, or carry a vote. Members can recommend a service within an admin-opened request. There is no separate service-recommender menu and no unrestricted member posting to Home.
- An announcement's feedback action opens a chat with the group admin, preserving the announcement context. Feedback is not a vote. A member can use the existing admin-chat route to propose a new Home topic.
- Voting is a distinct feature/menu with results, rather than a renamed Ratings bucket. Both admins and members see aggregate results. Do not inherit person-rating updates or affinity behavior for ballots.
- For residential votes, the apartment/asset carries the voting weight and its owner normally votes. The group admin administers apartment/member associations and decides whether a tenant is admitted/involved. Asset association must not block ordinary account registration. Do not introduce a separate complex ownership, tenancy or proxy-registration workflow.
- Earlier intent was that a cast ballot is a committed decision, rather than repeatedly changing a priority score. Keep one authoritative voting entitlement per apartment/asset; multiple associated profiles must not multiply its weight automatically.
- The admin sets a deadline. A registered Community job closes voting automatically. Editing a published deadline can extend or reopen voting; the process must recognize the new deadline and retain existing ballots. Manual closing is a supplementary control if automatic processing has not closed it.
- Responsibility for editing published announcement content remains with the admin. No additional forced ballot invalidation, version-approval or automatic re-voting workflow was requested.

### Flattened Cases / Issues menu

The earlier Services menu containing nested cases has evolved into a directly accessible **Cases / Issues** SmartList. The working Hungarian name is **Ügyek**. Keep service details/management reachable through the associated service sheet; a case does not have to be opened through a provider card first.

- Place the entry beside Groups in the Community navigation block. Reuse the Groups menu's account-level opening and attention-badge pattern. The Cases list has cards, a participant/member badge and a `+` create action below the close control, following the existing popup layout.
- Cases belong to the base-group service context and aggregate the viewer's authorized matters across communities. The same person may manage several communities, live in others and provide services elsewhere.
- A private group's menu can expose the same entry for convenience. Opening it there does not silently replace the aggregate with a list restricted to that workspace. Preserve each case's own community and access scope.
- Use a Case type AppMenu, such as fault report, maintenance or meter replacement. The same type is a header filter. Use existing SmartList and bucket patterns for the lifecycle; final lifecycle labels should follow the case flow rather than borrowing event invitation states indiscriminately.
- Community admins see cases they administer; residents/customers see matters involving them; providers/Support see their invitations and assigned matters. Combine these permissions without duplicating one case because a person has several roles.
- The red menu badge uses the same authoritative case attention state as the list and its buckets. Convenience entries share that state; do not count one update multiple times in aggregate profile/workspace badges.

### Case creation, audience, recommendations and access

- An admitted community member can open a case as a customer, for example a fault report. It reaches the community admin, who can involve another apartment owner and invite a contractor. This is separate from admin-only Home publishing.
- A provider does not gain permission to create unsolicited cases inside an invisible community. Someone who is also an admitted resident may use their resident/customer authority.
- The admin can create shared work such as a chimney-sweep visit, renovation or meter replacement. Select specific members with the existing basket-style member popup and row `+`, or choose **All** for that community. All does not mean the entire base-group population.
- A resident can recommend a provider; the admin can accept the recommendation and assign/invite that provider. Invite the provider to the case for an offer. Do not create a service event as a proxy for a case.
- A case has its own participant chat. Case membership and material visibility follow the authorized audience and assignments. A shared case can have multiple residents and service participants.
- **Support** is a limited case role. An external provider stays in their base-group profile and sees assigned cases in the aggregate list without seeing or joining the invisible communities. Case invitations grant case access, not private-group membership.
- If a provider is also a resident, ordinary community membership and case-specific Support authority coexist. A service owner may do the work themselves; otherwise the relevant technician/provider is assigned to the case.

### Scheduled tasks and automatic shared cases

**Latest correction:** scheduling belongs to Cases, not the apartment/asset editor. Do not add heating, insurance, meter-count or other utility parameters to Assets. Keep the existing asset editor unchanged. The earlier asset-utility proposal is superseded.

Add a header action to the Cases popup for managing scheduled tasks, using the existing editor, date/schedule controls and member basket patterns. A task describes the work, its case type, schedule/due date, community and affected members (or All). It can represent a coordinated meter replacement, chimney sweep, inspection or other recurring/shared obligation without modeling the apartment's equipment.

Show the number of affected people on each scheduled task's SingleRow SmartList row using the existing member-count badge. Explicit selections count unique selected members; All counts the affected members of that task's community, never the whole base-group population. Preserve the same audience interpretation when the task creates its shared case.

A registered Community job creates a case **45 days (approximately one and a half months) before the scheduled due date**, leaving time to obtain offers and coordinate visits. A task created within that lead window is eligible on the next job run. Related participants belong to **one shared case** for that task occurrence, with the community admin and the configured audience. Different appointment times and payment records remain possible within the case. Keep the task's due date distinct from the case's creation date.

Use the task identity and scheduled occurrence as an idempotency key: retries must discover the same case instead of creating duplicates. Separate communities remain separate case scopes even when the same provider serves both. Reuse the established group-scoped job configuration, execution, history and local-demo patterns. Define scheduling independently of the Home/announcement screen; a scheduled task does not require an asset record or change asset registration.

Creating the case automatically also creates a contextual reminder notification for its affected audience and responsible administrator. Use the task occurrence/case identity for notification deduplication as well, so retrying a job cannot resend the reminder. The actor is the system job; this reminder may reach the human who configured the task.

Previously discussed use cases that this model must retain:

| Use case | Relevant behavior |
| --- | --- |
| Coordinated water-meter replacement | Schedule the replacement, gather affected residents, request an offer, coordinate individual appointments and potentially obtain a shared discount. |
| Renovation or common maintenance | Admin-created shared case, selected residents or All, provider offers, an optional linked community decision, work tracking and chat. |
| Individual or shared fault report | Resident initiation, admin handling, affected-party/provider assignment and completion tracking. |
| Chimney sweep or technician visit | One shared case with relevant residents; different visits/time slots can occur within it. |
| Provider recommendations | A member recommends a service within an opened request/case; the admin accepts and involves the provider. Also relevant to helpers such as gym trainers. |
| Scheduled maintenance obligations | A Cases header action manages due tasks and their affected audience; no equipment fields in the asset editor. |

### Service availability, case appointments and pricing

The service is conceptually a bookable resource, but remains outside the existing Tools/Assets menu in this delivery. Preserve its own service identity and sheet. Reuse the existing resource/event building blocks instead of creating a different booking interaction.

- **Provider configuration:** reuse the event editor's `app-slots-input`, including recurring times and date-specific overrides/closures. Reuse the existing pricing and policy form controls for amounts and terms.
- **Customer appointment selection:** use the full existing event checkout slot-picker surface: date input, monthly calendar with availability, slot cards, capacity/price badges, row `+`/selected state, basket/count, price summary and tick confirmation. The user explicitly requested this existing UI, not a custom date form.
- Extend the existing owner/component's loading and saving integration to the service/case context. A Case remains its own domain and does not become an ActivityEvent merely to reuse a picker.
- Reuse the availability SmartList's day/week/month presentation for case/provider schedule views. Distinguish that schedule view from the customer's existing date/month-and-slot picker.
- Availability and conflicts must follow the technician/provider assigned to the case, across that provider's cases. Multiple technicians at a business or multiple involved providers are personnel/case assignments, not an asset quantity field renamed as a workforce model.
- The customer selects an available appointment for the case; no separate customer-facing technician choice is required. A provider can also complete the work personally.
- One shared case can contain separate resident appointments and payment records. The case chat remains shared among authorized participants.
- Pricing and policy display can accompany the case/slot flow. Manual payments are specified below; this plan does not activate live card payments or add a separate deposit/accounting engine.

### Other community functions

Community programs and meetings continue to use Events, while following/feed functionality can follow those activities. Document decisions belong to announcements/Voting. Earlier ideas about read/seen status and independent-group statistics remain later refinements, not reasons to add more top-level modules.

When priority is disabled for a group, priority-specific event controls should be hidden. Tournament and Mingle assignments must not use an affinity graph in that case; they should mix participants randomly. This is a separate behavior to check or fix, not part of residential voting.

## Payment history — shared follow-up for every group type

The following changes apply to **every user in every group type and workspace**, including Dating, Work and Community. They are not a community-admin-only surface.

### Counterparty selection

- Add a clickable AppMenu-style member label in the history popup's second row. It displays the selected person's name or **All**.
- Open the existing member picker using the current group's member source, basket-style row `+`, and a single-selection limit. The tick must also accept an empty selection, including when it was empty on opening.
- Return the selection through the shared signal store and reload the history because its query changed. Preserve the established lazy loading, paging, direction filter and refresh behavior.
- The filter selects **my transactions with that person, in the current group**: both what I paid them and what they paid me. It never switches the viewer to the selected member's full financial history.
- All means all of my transactions in the active group. Group selection still bounds the query, and the counterparty must be valid for that scope.
- Keep filtered list summaries separate from the complete profile payment totals and pending-refund counters. Loading a narrow history must not overwrite global/profile badge state with a filtered subtotal. Apply the same contract to local and backend reads and mutation results.

### Manual payment recording

Extend the existing Cash Received form with a choice between **cash** and **bank transfer received/completed**. Reuse its existing receiver/payer selection and recording flow. Show the selected method with an appropriate contextual badge in the history SingleRow.

These entries record historical payments rather than initiating a bank transfer. An advance and a later payment can be recorded as separate transactions. Preserve the current live-payment activation setting. Membership fees, subscription dues, balances/due dates and integration with external accounting were discussed earlier; they do not authorize building a new accounting system or an automatic instalment ledger in this slice.

## Campaign and Case chat — shared follow-up

Add **Campaign** and **Cases** channel buckets to the existing Chats context selector, using the same query, unread-counter, badge and read-state machinery in local and backend implementations.

| Channel | Participants and context |
| --- | --- |
| Campaign | Direct conversation between an interested person and the campaign owner, associated with that specific campaign. |
| Case | Authorized participants of one case, including customer/residents, relevant community admin and invited Support/provider. |
| Event | The existing event group chat, created through the normal event lifecycle for its participants. |

### Rate first, then ask about a Campaign

The latest requested direction is **rate through the campaign first, then ask its owner**. An inquiry without a rating would not establish the person's campaign-context entry in Ratings, making the opportunity difficult to find again there.

- Campaigns remain visible as Home InfoCards. The question/chat action belongs to the existing three-dot interaction or the campaign-aware Ratings popup, subject to the rate-first sequence.
- A Home entry must not open an unrated Campaign inquiry as a shortcut around that sequence. Use an explicit saved rating; do not manufacture a default score merely because the person asked a question.
- Once rated, the person can open the direct Campaign conversation and later revise their rating through the Ratings popup. The query must keep the established campaign context and person aggregation.
- The conversation carries the campaign identity; asking the same owner about different campaigns must not lose which opportunity is being discussed. Reopening the same conversation preserves messages/read state.
- A Campaign does not itself create a group discussion of all interested people. When the organizer later creates an event, the normal event participant group chat provides that shared conversation. Preserve the earlier direct inquiries separately.

The existing app-admin `supportCase` chat is a different concept from a service Case. Keep its routing and authority intact. Case-channel access follows case participation even for a provider who has no membership in the private community. Announcement feedback continues to target the community admin; it does not automatically become a public case conversation.

## Implementation boundaries and reuse references

Code inspection on 5 October found reusable UI/state/service patterns, but no implemented Community mode, service-case domain, or standalone residential Voting feature. The following is an implementation map, not completed work:

| Area | Existing owner/reference | Required extension |
| --- | --- | --- |
| Aggregate navigation and badges | [CommunityGroupsStore](../../frontend/src/app/shared/ui/context/stores/community-groups.store.ts), [GroupWorkspaceStore](../../frontend/src/app/shared/ui/context/stores/group-workspace.store.ts) | Base-context Cases list, per-case role/access union and authoritative counters across convenience entry points. |
| InfoCards and lifecycle editor | [CampaignsPopup](../../frontend/src/app/shared/ui/components/campaigns-popup/campaigns-popup.component.ts), [WorkHome](../../frontend/src/app/home/components/work-home/work-home.component.ts) | Service discovery/management and Case cards through the established SmartList, FormFlow and three-dot patterns. |
| Provider slot setup | [SlotsInput](../../frontend/src/app/shared/ui/components/core/form/inputs/slots-input/slots-input.component.ts) | Service/case schedule integration using its current configuration and form controls. |
| Customer slot selection | [EventCheckoutSlotPickerPopup](../../frontend/src/app/activity/components/event-checkout-slot-picker-popup/event-checkout-slot-picker-popup.component.ts), [picker store](../../frontend/src/app/shared/ui/context/stores/event-checkout-slot-picker.store.ts) | Extend source-context reads/save callbacks while preserving the full existing interaction and booking correctness. |
| Schedule day/week/month | [AssetAvailabilityPopup](../../frontend/src/app/asset/components/asset-availability-popup/asset-availability-popup.component.ts) | Case/provider appointment data and personnel availability/conflict checks. |
| Pricing, policies and scheduled work | Existing pricing/policy inputs, schedule controls and FormFlow editors | Reuse controls in Services/Cases. Scheduled tasks are managed from the Cases header; the asset editor remains unchanged. |
| Member selection | [AssetMemberPickerPopup](../../frontend/src/app/asset/components/asset-member-picker-popup/asset-member-picker-popup.component.ts), [ActivityInvitePopupStore](../../frontend/src/app/shared/ui/context/stores/activity-invite-popup.store.ts) | Reuse the basket and selection-limit pattern; support empty confirmation for the payment filter and selected-member/All case audience. |
| Payments | [PaymentMethodsPopupStore](../../frontend/src/app/shared/ui/context/stores/payment-methods-popup.store.ts), [SavedPaymentMethodsService](../../server/projects/profile/src/main/java/com/raxim/myscoutee/profile/service/SavedPaymentMethodsService.java) | Authenticated counterparty filtering, summary ownership, manual method and consistent transaction identities. |
| Chats | [chat contracts](../../frontend/src/app/shared/core/contracts/chat.interface.ts), [ChatService](../../server/projects/profile/src/main/java/com/raxim/myscoutee/profile/service/ChatService.java) | Campaign/Case identity, authorized creation/access, channel filters, counters and navigation through existing chat infrastructure. |
| Community job scope | [JobGroupScopeService](../../server/projects/profile/src/main/java/com/raxim/myscoutee/profile/service/JobGroupScopeService.java) | Replace the current Work-versus-other partition with explicit third-base-group resolution before introducing Community data. |

The existing chat poll is an editable message attachment. It is a UI reference, not a substitute for apartment-weighted, authoritative votes and deadline processing. The current asset calendar represents bookings; it does not by itself supply a provider work schedule. Some local payment-history rows are generated samples and need stable real demo payer/payee relationships for counterparty filtering.

Implement each new domain through contracts, shared signal stores, base services, existing local/HTTP adapters, repositories/mappers and backend services. Use the existing HTTP infrastructure. Preserve lazy loading; reuse the named component owners/extension points instead of copying their behavior into custom popups. SmartList mutations use its existing patch/upsert/remove operations; query/scope changes justify a reload.

Seed coherent services, cases, participants/roles, apartment voting weights, scheduled tasks, announcements/votes, appointments, payments and chats for demo users in both local and backend modes. Badge counts must follow those records. Keep the established mostly seeded coordinates and limited location-acquisition profiles.

App-admin menus stay unchanged. Add Community to the existing selector, content, landing/demo and query scopes. Every applicable job gets its own seeded Community instance and independent configuration, execution and history; absence of a seed means no execution. Add automatic Voting closure/reopening and scheduled-task case creation in that scope. Shared algorithms may be reused, while Community-specific processing must not change existing Dating behavior. Do not create event/random-room jobs merely to implement service appointments.

Focused verification must cover cross-community case access, external Support without community membership, aggregate list/badge consistency, weighted ballots and deadline edits, job retry deduplication, slot conflicts, payment counterparty scope, Campaign rate-before-chat gating, and local/HTTP persistence parity. Runtime/browser verification is still future work for this delivery.

### Work and Community notifications

Audit notification coverage across the new Work and Community transitions and connect the relevant recipient actions/reminders through the existing notification templates, durable delivery, in-app feeds, unread counters and contextual opening routes. Extend the same behavior in frontend local and its seeds. Do not create a second notification mechanism.

Follow existing recipient rules: a human does not receive a notification for their own action; notify the other authorized people affected by it. Automatic reminders are system actions. In particular, cover scheduled case creation, provider invitations/offers and decisions, relevant case/appointment changes, announcement/voting publication and closure, and Campaign inquiries/event transitions using existing chat/event notification owners where applicable. Do not send duplicate notifications where the current message, event or membership flow already owns delivery. Notification links must preserve the target context and permissions, including case-only Support without private-group access.

## Two paths for professional connections

The professional direction centers on quick browsing, expressing priorities and making relevant connections. The current Work flow is campaign-led for both work opportunities and business ideas: any member publishes a campaign, other people rate its author through that campaign, and the author rates interested people. Organizing one campaign and participating in another are compatible roles, with no app-admin privilege involved.

A campaign does not require dates. Its organizer can later create an event and select the campaign to use its priority pool. The existing capacity, invitations and event lifecycle then apply. Without a selected campaign, person ratings are aggregated across campaigns. Specialized groups remain independent workspaces. Horizontal discovery was explored earlier but is superseded by this campaign-led design for the current Work delivery.

Concrete job postings and application tracking are not the core product; an external link can point to a posting or a meeting tool.

A video introduction could be useful in business partner search, but the initial choice is an **external call link**. Building a WebRTC/streaming platform or a collaboration suite is outside the experiment. Campaign creation is now exposed through the existing API/MCP integration; MyScoutee would remain the source of priorities and permissions. A broader MCP/API interface for items such as invoices and notices, and access through ChatGPT or Claude, were also mentioned without a defined scope. Deeper LinkedIn integration requires separate investigation.

## Cross-cutting requirements and deferred refinements

- **Feedback/report:** app-level reports retain their existing base-admin routing. Community announcement feedback opens a conversation with the community admin, as specified above. Independent-group statistics may later reuse existing data-scoped views with group-leader permissions; compact app-admin popups should not grow another navigation hierarchy for them.
- Demo entry choices need selection by base-group membership, including users with cross-group membership, rather than separate users for every landing mode. Existing app-admin and other demo surfaces contain dating-oriented assumptions; their copy, example data, and presentation need a focused review for Work and Community. Do not assume that a menu is irrelevant merely because its current contents are dating-specific.
- Community Home/Voting, the flattened Cases menu, case-limited Support, shared automatic cases from scheduled tasks and the event slot-picker reference are now specified above. The earlier standalone helper-recommender and workspace-only Services directions are superseded.
- Extend the existing parameterized landing and app-admin selector to Community: bundled short hero text, a separate generated slideshow image, group-assigned/lazily loaded use-case articles and membership-filtered demo users. Seed the Community base group, demo memberships and coherent example data in local and backend modes. This is part of the requested implementation, not an optional later marketing task.
- Operator editing of landing-mode definitions and statistics for independent groups remain follow-up work. Base-group app-admin content is scoped in this checkpoint. Shared-link mode selection uses the same flow for Dating, Work and Community.
- The goal is a low-cost experiment and validation. A separate job board, accounting system, video platform, or full collaboration tool would exceed this scope.

Implementation of the new requirements was authorized after this document update on 5 October. Use the existing store/service/repository layers in frontend local and backend, preserve HTTP infrastructure and lazy loading, and avoid full list reloads where SmartList patch/upsert/remove operations suffice. Targeted automated checks support the implementation; the user-controlled pair QA will assess the complete flows and identify further refinements.

### Guides and final pair-QA preparation

Extend the existing contextual guide steps for the new Community, Campaign, Cases, Voting, scheduling and payment interactions. Register guide definitions for each new route/context as well as the steps themselves. Give the Home group/mode switch its own guide step, explaining what changes with the selected workspace and how to return to another one. Use the current guide targets, localization and group-scoped content pipeline.

After implementation, record the complete development's pair-QA scenarios in the existing QA spreadsheet/ledger format, with numbered actions, expected results, actors, local/HTTP environment, and pending execution status. Include the earlier Work changes and shared features as well as Community. Automated checks are separate evidence; do not mark a manual scenario passed before the pair-QA session. Prepare the checklist without starting or taking over that session.

Keep planning and verification documentation folded into the relevant MSC-115 implementation commit rather than adding a separate commit for each conversation correction.

### Community implementation checkpoint — 5 October 2026

The following code has been added; it has not received browser/pair-QA sign-off:

- Community base/private demo memberships, landing copy/articles/slides and app-admin scope extend the existing Work/Dating owners. The [Community slideshow image and generation prompt](COMMUNITY_LANDING_IMAGE_2026_10.md) are saved in the repository.
- Cases and scheduled tasks have separate backend models/repositories/services and matching frontend local, HTTP, facade, signal-store and lazy-popup layers. Cases aggregate explicit participant access and managed communities. External provider access does not create private-group membership.
- The Cases header opens scheduled tasks. Their rows show the affected member count. The Community-only seeded job creates one shared case 45 days before its due date; retry identity is task plus occurrence date. The job advances after the reminder has been enqueued. No utility fields were added to the asset editor.
- Case creation/changes, provider invitation/response, quotations and decisions use the existing notification outbox/inbox. Manual actions exclude their actor; scheduled reminders include the affected creator. Case notification targets select Community and open the case through its permission-checked service. The existing menu/realtime counters now expose case attention.
- Work rating notifications now carry Campaign context. The local rate-sync path emits the same notification as the backend and suppresses unchanged retries. Notification actions open ratings with the corresponding campaign filter. Campaign publication alone has no recipient notification; event/chat owners retain delivery for their own transitions.
- Campaign and Case chats use independent buckets in the existing chat service. A Campaign conversation requires a persisted positive rating; case membership is derived from explicit assignment and mapped to base Community profiles. Message delivery excludes its sender and uses existing notification/read/counter owners. Declined external invitees retain case history but lose live chat access. Open websocket sessions also recheck current case membership. Resource-chat updates preserve concurrent message/unread state.
- Private Community Home now uses a newest-first SingleRow announcement list and a Voting entry instead of Ratings. Admins create/edit/publish/draft/delete announcements with optional documents and voting. Apartment voting rights are maintained separately from the asset editor: one assigned accepted member and a positive weight per registered apartment. The first publication snapshots those rights; final ballots cannot be replaced, and totals expose weights/counts without other members’ individual ballots.
- The Community-only `community-voting-close` job closes expired published votes. Its idempotent outbox operation is acknowledged only after enqueueing; a later deadline reopens voting while retaining ballots. Publish/edit/reopen, cast-to-admin and close notifications use existing delivery and exclude human actors. Withdrawn/deleted announcements produce information without an inaccessible open action.
- Announcement feedback opens the existing group-support channel with the private community manager. Opening a chat does not notify anyone; sending a message uses the existing recipient-only message notification. It does not create an app-admin support case.
- Document uploads extend the existing Media facade/local/HTTP/controller/storage and private-resource policy. Supported PDF, text and office attachments are limited to 10 files of 10 MB each. Access follows current group membership and announcement publication/admin visibility. Workspace owners can preview their own unsaved uploads using the same canonical storage-owner segment.
- Campaign list/editor, Work Home, Cases/task list/editor, Community Home/Voting/announcement/voting-right editor guide contexts and fields are registered with English/Hungarian content. The landing usage switch and Home workspace switch have dedicated guide steps. Service Home/list/editor/calendar, case appointments and the payment counterparty filter extend the same guide registry.

Focused evidence: the frontend local build passed including the new guide registrations; 37 local/converter tests passed, then 14 focused rating/case/realtime-converter tests passed including saved-rating delivery and the exact 45-day boundary. The backend case/rating suite passed 26 tests; the subsequent case/Home-profile/event-scheduler suite passed 89 tests. An additional 14 local tests cover Campaign questions and external-provider case conversations, including send retry, recipient-only notification, read counters and declined access. Affinity configuration tests also pass for the Community base scope. These are unit/build checks, not live MongoDB import, push-provider delivery or browser-flow evidence.

Further focused evidence: 161 backend tests passed for announcements, chat and access/resource policies; six local announcement tests cover immutable weighted votes, permission boundaries, publication recipients, reopen/closure retry identity, reseeding preservation and group-admin feedback. The complete frontend local build passed in 18.413 seconds. The Work/Community seed synchronization check and i18n audit passed. Five media access-policy checks passed separately. These remain code/build checks; actual Mongo aggregation/import, provider delivery, file storage and browser interactions still need runtime/pair-QA verification.

#### Final service, scheduling and shared-payment additions

- Community service discovery has its own model, repository, service and local/HTTP facade. Published service InfoCards expose relevant service/provider details and person priorities. The Your services SmartList uses draft/publish/trash/restore and the existing FormFlow, staff basket, slot editor and pricing controls. Images follow the existing media ownership rules. Demo providers, customers, services, private communities, cases, voting and scheduled tasks share canonical local/Mongo fixtures.
- Accepted case providers/staff expose availability through the existing EventCheckoutSlotPicker. A separate service-provider calendar persists appointments; no artificial event or asset is created. One worker cannot be booked in overlapping slots across services/cases; different workers have independent availability. Day/week/month views and cancellation retain the existing appointment history. Saved prices use the existing pricing/rounding owner. Booking does not trigger live card collection.
- Scheduled tasks are authored from the Cases header, with All or selected affected members and an affected-count row. The Community job creates one shared case **45 days before the due date** and sends its reminder to affected members/managers, including an affected task creator. Stable task/occurrence and outbox identities suppress duplicate creation/delivery. The task advances only after enqueueing the reminder. Monthly/quarterly/yearly dates use calendar arithmetic. Asset editors remain unchanged.
- Payment history has a single-member basket selector in the second header row; empty selection means All. The existing member popup now has a payment purpose that queries current-group members without meeting/contact prerequisites. History filters apply before paging, while profile totals and pending-refund counts retain their full scope. The same behavior applies to Dating, Work and Community profiles.
- Manual receipts reuse the existing receipt operation with a cash/bank-transfer method and contextual row label. Retry identity, counterparty, refunds and history persist through the existing payment ledger. Canonical demo cards/payments replace query-time fabricated history, use real seeded actors/resources and survive reload/deletion. Payment/card fields are stripped from public user DTOs.
- Private Community events cannot enable the priority auto-inviter; UI, local writes, backend writes and the scheduled invitation owner enforce this. Mingle skips affinity and mixes randomly while retaining its existing seating/repeat constraints. Tournament graph input contains participants without affinity edges. Dating and Work retain their existing priority behavior.

#### Notification audit and delivery ownership

| Trigger | Existing owner and recipients | Open destination / retry rule |
| --- | --- | --- |
| Changed positive person/Campaign rating | Rate synchronization and notification outbox; rated people, excluding the actor | Ratings with Campaign context where present; unchanged retries are silent |
| Campaign/service publication | No unsolicited broadcast to an undefined audience | Publication changes discovery only |
| Work event invitation/lifecycle/feedback | Existing event, membership and feedback owners | Existing event/feedback destination; preserve recipient visibility rules |
| Campaign/Case/group-admin chat message | Existing chat message, unread and notification owners; other channel participants | Matching channel; opening a channel alone sends no notification |
| Case creation/update/provider invitation/response/quotation/decision | Case service and existing outbox; active affected participants, excluding human actor | Base Community and permission-checked case; durable occurrence identity |
| Scheduled case creation | Community scheduled-case job and the same case/outbox owner | Case reminder includes affected creator; one case/reminder per task occurrence |
| Appointment selection/cancellation | Case appointment owner and the same case notification path | Shared case; operation/cancellation identity suppresses repeats |
| Announcement publish/update/reopen/withdraw/delete | Announcement owner; accepted group members excluding actor | Specific private group/announcement; inaccessible withdrawn/deleted records have no open action |
| Ballot / vote closure | Ballot notifies group admins excluding voter; automatic closure notifies accepted members | Immutable ballot and idempotent close notification; later deadline reopens existing ballot set |
| Manual cash/transfer receipt | Existing payment owner; payer only | Active-group payment history; same request ID records/notifies once |
| Refund request / approval | Existing refund owner; recipient for request, payer for approval, excluding actor | Active-group payment history; repeated request/approval is silent |

Frontend local uses its existing notification repository and persisted unread/counter owners. HTTP uses the existing group-scoped outbox, notification rules/templates and inbox/live update paths. Notification actions and shared links carry the target workspace; announcement and payment deep links were completed during the audit. These checks do not prove real push-provider delivery.

#### Final verification evidence

- Backend: `JAVA_HOME=/home/raxim/.sdkman/candidates/java/25.0.2-tem ./gradlew :projects:profile:test --tests '*PaymentRefundServiceTest' --tests '*CashReceiptTest' --tests '*SavedPaymentMethodsServiceTest' --tests '*ActivitiesInviteCandidatesServiceTest' --tests '*EventSchedulerTest' --tests '*ActivitiesMingleServiceTest' --max-workers=2` passed (17 seconds). A subsequent focused private-Community priority-invitation regression passed (9 seconds).
- Frontend: the final selected payment, integration, bootstrap, notification, Mingle and event suites cover 101 tests. The initial run exposed stale event-test mocks; after completing the mocks and aligning their unread-count fixture, the 30 local/HTTP event tests passed. The other 71 tests passed in the combined run. The separate service/appointment tests had also passed (seven cases), including double booking, staff isolation, stale writes, closed overrides and retry-safe recipient notification.
- `NG_BUILD_MAX_WORKERS=4 npx ng build --configuration local` passed after all final UI changes (18.455 seconds).
- `node frontend/scripts/sync-work-seeds.js --check` passed. `node frontend/scripts/audit-i18n-mongo-seed.js` passed for 12,192 messages, two source bundles and three Mongo seed sets. Existing Mongo translation-row order was preserved to avoid unrelated diff churn.
- `python3 guides/qa/tools/sync-qa-matrix-xlsx.py` synchronized 145 rows, including 20 new pending scenarios. Both repository whitespace checks passed.
- Earlier failed checks were repaired in their owning layer: an obsolete null mutation-result test fixture, incomplete event-service mocks, and bootstrap IndexedDB test setup/assertions. No production fallback was added to hide unavailable IndexedDB.

Review notes: case/task pages batch their group/member projections; calendar views batch related cases/services/customers; local card history reuses one ledger read for rows and totals. Scheduled batches are capped at 100 and appointment writes at 50 selections. Campaign/service discovery currently follows the existing scoped owner-snapshot query before geographic filtering and final paging; large-marketplace query cost is not benchmarked and should be reviewed before scale rollout. Save/retry, actor exclusion, weighted ballots and provider/calendar conflicts have focused tests. Real database concurrency, provider delivery and user-controlled presentation remain runtime QA work.

#### QA handoff and completion boundaries

The [20-scenario pair-QA checklist](../qa/checklists/MSC-115_WORK_COMMUNITY_PAIR_QA.md) covers the complete Work/Community/shared delivery with numbered steps. Its rows were added to the existing [CSV ledger](../qa/matrices/ADMIN_DYNAMIC_SURFACES_QA_MATRIX.csv) and [XLSX ledger](../qa/matrices/ADMIN_DYNAMIC_SURFACES_QA_MATRIX.xlsx); all new manual scenarios are **NOT RUN**. Existing ledger rows were preserved. No checkpoint or browser session was started.

The existing opt-in manual-QA launcher remains the entry point for future pair QA. Unit/build/seed evidence does not prove live MongoDB import/aggregation, Redis/push delivery, external storage, production migration or desktop/mobile interaction. Registry was unchanged; the earlier client/MCP/simulator commits retain their recorded scope. Per-campaign filtering of the whole chat list, promotional base-group cards and operator editing of landing-mode definitions remain separately recorded refinements, rather than claims of completed UI.


#### Dev-stack corrections — 5 October 2026, after the initial delivery

The first interactive checks exposed runtime defects that the earlier build/unit evidence had not covered. These are corrections to the existing delivery, not new product requirements:

- The live seed importer still created the old person-pair unique rating index. Campaign rating rows then failed with a duplicate-key error before `users.json` was imported, leaving Work/Community membership rows without their user profiles. Startup and watched imports now install the campaign-aware index before importing ratings and remove the obsolete index. Only the failed importer was stopped/restarted. The existing dev import completed; the member demo API now returns **27 Work and 9 Community** users, alongside 53 Dating users.
- Scheduled-job workspace projection selected only ID/type but instantiated the complete `CommunityGroup` record, including missing primitive fields. The existing scope owner now reads the projected BSON documents. The backend watcher compiled/restarted successfully; the subsequent observed logs contain no recurrence of the projection/scheduled-job exception. The focused projection test was updated; it was not separately run alongside the dev compiler.
- Demo cards retain their normal profile metadata. Base-group membership remains filter data and is no longer printed as overlapping labels. The Community navigation grid derives its column count from the actual visible items, keeping the visible entries in the same row. Voting now replaces Ratings in Activities; Your services has its own Community-block entry next to Cases.
- New guide registrations made from Angular effects called stateful registration inside the tracked effect. Guide context changes could reschedule parent registrations and repeatedly replace the active context. The existing `untracked` registration pattern now isolates these calls. SmartList mutation effects also isolate visible-item patch/remove/reinsert calls from internal list signals.
- New Work/Community popup, editor, filter and query bindings now use stable signal/computed models. They no longer allocate complete input models from ordinary template methods on each change-detection pass. Case revision and voting-unit queries are stable as well, and form/slot changes update their owned signals.
- The automatic DOM translator treated the raw `AT` avatar initials as English text and displayed “EKKOR”. Avatar-metric initials now use the existing `data-i18n-ignore` boundary; domain names and initials are not translation keys.
- The admin Dating selector and notification action for ratings referenced nonexistent translation keys. They now reuse `group.type.dating` and `ratings`. The existing i18n audit also checks literal UI-model labels and contract-derived Work/Community option labels, and correctly traverses Java sources for notification keys. English/Hungarian bundles and all three Mongo translation seeds pass; replaying the two old references makes the audit fail.
- The landing mode selector's `compactOnMobile` setting was overridden by the shared menu's `select-trigger` label rule. The shared rule now respects compact mode. The landing header keeps the logo, compact mode icon and login action together, with smaller mobile spacing/logo sizing. The mode menu model is a stable computed value.
- Noel's Work/Community admin memberships and scoped profiles already existed in the canonical seeds and live database. The initial workspace fetch used background polling, which could be skipped while the login popup was open and deferred until the next interval. Initial loading now uses the existing poll coordinator's foreground queue; subsequent background badge polls retain their existing popup pause behavior.

Verification used the already-running frontend/backend watchers; no parallel application build or server was started. The frontend dev watcher finished successfully at 10:52 local time after the signal conversion. The bounded [compiled-artifact reactivity check](../../frontend/scripts/check-work-community-reactivity.mjs) exercises the real AOT component models and Angular effects with isolated domain stores: four list popups and five editors preserve model/query identity across repeated reads, real form edits invalidate the expected models, nested guide open/close does not re-register parents, and a list patch does not subscribe its caller to list state. It passed against the watcher's generated output. The earlier Campaign artifact reproduces a reactive cycle and exceeds the same check's 50-execution bound.

This is not a full DOM/browser-flow test. The managed-browser inventory was empty during diagnosis, and no user browser was navigated or operated. The manual QA rows remain **NOT RUN** until the user-controlled flows are exercised. The periodic seed watcher still runs its existing reconciliation; the fixed endless failed-import retry is a separate issue from that baseline polling cost.

The compiled-artifact check additionally verifies compact mobile versus desktop/ordinary selector labels and immediate three-entry admin workspace loading with an open login popup. It also verifies that ordinary background polling remains paused. Both retained earlier artifacts fail these respective checks (mobile label remains visible; initial workspace read count is zero), while the corrected output passes. The existing frontend watcher completed at 11:19 local time. These are component/store contract checks; the mobile header's final pixel layout still requires the user-controlled browser check.


Further interactive corrections in the same MSC-115 commit:

- New SmartLists use their established grouping and sticky-header options: announcements, cases and owned service/campaign sheets group by date; tasks by due date; provider calendars by appointment date. The first row no longer duplicates the sticky group marker. Lists without a meaningful grouping disable the empty marker.
- Campaign and provider pickers use single-selection +/check toggles, a removable header basket item and explicit confirmation. Closing cancels. Selection changes patch affected cards through their existing stores.
- Cases use type-based contextual card/menu colors, lifecycle-appropriate actions, bottom-right status badges, and the established black number/chevron member button. Its read-only popup reuses EventMembersPopup with an explicit authorized snapshot, without treating the case as an event or starting event-owner polling. Status/type unread buckets aggregate the entire authorized scope before paging in local and backend queries; writes update the visible row and known counter buckets. No new lifecycle rules were added.
- The shared InfoCard bottom overlay now binds the existing contextual status tones; its old amber fallback no longer overrides an explicit tone. Completed, active, cancelled and deleted states use the shared palette.
- Your services lives in the sidebar Community block. It is absent from Cases and the Home header. The owned service list has no category selector; the editor retains category. The + control is on the second row below Close. The labeled desktop List/Week/Month selector reuses the existing provider appointment calendar for Week/Month.
- Payment history places the member selector and expense/income summaries in the same toolbar row. The member control reuses image/count/chevron presentation. Manual receipt models are computed signals and cash/transfer choices use contextual icons and colors.
- All landing modes share the deployment social links. Before local operator bootstrap, public configuration reads the same canonical social-link seed; stored operator configuration remains authoritative. The backend already returns the common links. Demo-picker rows align at the top.
- Work and Community rating Homes share Dating's frame and SmartList loading/paging configuration. Empty results retain the full panel and display the empty message without an orphaned rating dock. Community Home keeps category and Ratings controls; the provisional distance filter and Filters button are removed. Geographic ordering remains part of discovery.
- Community Home's three-dot menu contains exactly two read-only actions: the full service sheet and provider profile. The shared SmartList item-menu outlet is available alongside the rating dock; the previous conditional prevented these card menus from rendering when rating controls were visible.

The running frontend watcher compiled these corrections; the backend watcher compiled the new case counter/member contract. The bounded AOT check additionally covers selection/confirmation/cancellation, case state presentation and bucket counts, local authorized counter paging/read transitions, read-only member snapshots in both adapter modes, receipt model stability, fresh-local public social links and Home empty-state/rating contracts. The i18n audit passes with 12,196 messages and three synchronized Mongo seed sets. These checks do not establish browser-layout or complete manual-flow PASS; the updated pair-QA rows remain pending. No second compiler or browser session was started.


## Earlier explorations that are not current commitments

The discussion initially used labels such as property management and HR, considered a separate paid WebRTC interview feature, and briefly considered real-estate agents. Later messages narrowed the direction to reusable traditional groups, professional networking, external call links, and no real-estate-agent workflow for now. These earlier examples explain how the concept evolved; they are not additional modules approved for this experiment.

## Case boards, quotations and service presentation — 6 October revision

This revision supersedes the earlier service-wide availability/pricing and case-detail-form directions above.

- A Case's View action opens its task board. Reuse the existing slot TextCard, SmartList, contextual menus and member basket. Tasks have assignees, explicit prerequisites, progress and optional agreed start/end times. The date range has its own unclipped subtitle row. The native horizontal SmartList shows one full-width status column on mobile and three on desktop, with contextual label headers. Parallel tasks are supported. The case retains its main chat; tasks have no separate channels. Each quotation has a separate group conversation in the existing Cases chat channel.
- Case metadata remains separately editable. Case lifecycle and quotation actions live in the case card’s three-dot menu. The board header uses the shared Popup + control and Close; its body contains only the task columns. The case card shows its type once in a saturated category badge, its unchanged contextual status, one case name and the community/description below. The card/menu View red counter counts tasks only and patches immediately through the existing store/SmartList mutation path. The chat's context button opens this board, not an event.
- Automatic cases initially invite affected members; they may join or decline. Members may leave; the case manager may invite/remove people. Case access does not grant membership in a hidden residential group.
- Provider recommendations originate in the case chat as the existing shared attachment-card presentation, using the service image/name/description. The case admin can invite the referenced provider directly from that message menu. Requesting a quotation and inviting a provider to chat are separate decisions. Chat participation is optional. Once invited, providers use the same chat features, including the + menu, polls and sharing. Participants are responsible for what they share; no special provider chat restrictions are introduced.
- Quotations use the existing grouped FormFlow blocks for price, work policy and refund policy. Start availability is written in work-policy text. The popup has provider-avatar navigation, a provider + below Close, and three-dot row actions below a right-side status badge, with All/Pending/Accepted/Rejected buckets and no Joined row. Each offer has a distinct group chat inside the existing Cases/All list, with the residents and that provider. Only Cases receives a new contextual base color. Accepted case participants view every quotation read-only; the case admin alone edits saved quotations and may change any decision back to Pending, Accepted or Rejected. A provider submits new quotations. Competing quotation chats remain isolated. The standard structured PoliciesInput owns work/refund policy items. Pricing/refund policy and generic availability do not belong in the service profile; actual work times belong on agreed tasks.
- The service profile uses the existing image gallery on the left and name, description, the common event/asset external LinkInput and category on the right, in editing and viewing modes. Remove service radius, generic time windows, slot duration and pricing controls from this form.
- Community discovery reuses Dating's SingleCard and its loading, paging, empty state and image presentation. No three-dot menu. The eye opens the advertiser's profile. A category badge at the top left uses the same contextual color and icon as the category menu. These presentation changes do not change the person-priority model.

Implementation and manual-QA evidence for this revision must be recorded separately from the completed checks above.

The case and service card descriptions are limited to 120 characters. Cases require a residential group; there is no Personal case option. The Park Court meter-replacement seed includes Farkas Anna as an accepted provider, her pending EUR 360 quotation, four tasks across all three statuses, resident assignments and prerequisite links. Browser-local and Mongo fixtures are generated from the same source; embedded Mongo task/offer identifiers use `_id`.

The common member picker restores its provided persisted selection, retains selected members across paging/sorting, and lets the header tick commit an empty selection to unassign everyone. Assignment, quotation invitation and offer submission continue through the existing case notification pipeline. Focused verification and outstanding manual checks are recorded in [the updated pair-QA checklist](../qa/checklists/MSC-115_WORK_COMMUNITY_PAIR_QA.md#focused-implementation-evidence--2026-10-06).

Task editing uses the existing event/asset DateInput range block. Assignees and prerequisites appear in separate shared FormFlow list blocks with + actions that open the existing pickers; these supersede the compact toolbar triggers. Status is advanced through Start/Complete/Reopen on the task card menu, never through a duplicate editor selector.

Home startup keeps the shared brand header without provisional Dating actions until profile/query readiness determines its menu. The service gallery follows the right-hand form height on desktop and the existing event-gallery compact height on mobile, preserving image proportions. The native horizontal SmartList retains its end gutter on mobile so the final column does not touch the clipping edge.

Latest service/task editor correction: staff, assignees and prerequisites are visible lists in ordinary FormFlow blocks, each with a + selection action. They remain visible in read-only mode. Admin task deletion is a retained Deleted state in the Done column using the existing danger palette, available from every task state and after case completion through the three-dot menu. References and task counts remain intact; deleted work is excluded from scheduled-work calendar rows.

Latest case authority decision (2026-10-06): the manual creator immediately joins as case admin. Automatic cases invite participants with no admin; Join alone grants no editing. Explicit Take over claims the unowned case, with optimistic concurrency. Only its admin edits case/tasks or assigns people and progresses/deletes tasks; others view. Admin departure releases ownership and notifies remaining participants. The last participant leaving moves the empty case to Trash. Error notices belong below the active popup header with the existing danger palette; staff/assignee lists omit unrelated profile locations.


### Service feedback after explicit case completion (2026-10-06)

The admin explicitly completes a case; open-ended task creation cannot establish automatic case completion. Save Completed and enqueue the existing scheduled-message worker action `case.feedback.prepare`, then return without awaiting feedback creation. The worker uses the completion participant snapshot and stable case/provider/reviewer identity. The closing admin is included in both eligibility and the automatic ready notification; self-review is excluded.

The common Feedback entry offers Events and Services. Service buckets are Pending, Submitted, Removed and Received, using shared Popup, SmartList, menus and FormFlow controls. No case-card feedback shortcut or separate completion-scanning job is added. Optional review text is limited to 160 characters. Quality, reliability, communication and value are the service criteria for feedback and Home granular rating. Submitted feedback supplies the service sheet's statistics block. The existing notification outbox, worker scheduler and activity feedback aggregate own delivery and the red badge; event feedback projections preserve the service contribution.

Quotation provider navigation uses the actual service cards from Community Home. The service picker shows one title, one category badge at top left and no distance. Task assignees use name/profile pills; quotations can be assigned multiply in a separate shared form block. Gallery and details share the common media-form layout.


### Landing appearance follows the selected use mode (2026-10-06)

Landing colors are build-owned. Blend the common violet icon color with the existing Dating/Work/Community selector palette and feed the existing deployment semantic color tokens. The landing component owns the active mode marker for its lifetime, including its popups. Remove operator theme selection and the `themePreset` configuration field from both adapters/API and canonical seeds. Keep product name, logo, logo-character position, social links and the other operator branding settings editable. This does not change the application's existing contextual status/channel palettes.
