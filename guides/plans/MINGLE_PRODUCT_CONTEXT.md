# MyScoutee Mingle — Recovered Product Context

## Document purpose

This document preserves the complete Mingle product direction developed in the shared ChatGPT conversation titled **“Klikkmentes platformfejlesztés”**, together with the authoritative corrections made in the follow-up discussion on 20 September 2026.

It is a product-context and decision-recovery document, not an implementation specification. It records both the current direction and the earlier branches that led to it, so future work can recover the reasoning without reopening or decoding the shared conversation.

- Shared conversation: <https://chatgpt.com/share/6ab04d7f-3bec-83ed-b51b-d4af55a9c351>
- Primary discussion dates: 19–20 September 2026
- Language: English reconstruction of the original Hungarian discussion
- Scope: Mingle, its MyScoutee integration, event configuration, live operation, encounters, discovery, and partner API

## Read this first: authoritative corrections

The following points supersede several overcomplicated interpretations made during the conversation:

1. **Mingle is part of MyScoutee.** It is not currently planned as a separate Mingeva or Mingleva application, user base, social graph, or infrastructure stack.
2. **World Café is not a separate system type.** It is one possible real-world use of Mingle.
3. **The event category already exists.** Mingle must not duplicate or replace event categories.
4. **There is no hard-coded `mingleVariant` enum.** The four tabs shown in the generated concept image were visual invention, not an established taxonomy or a set of product requirements. Do not derive the domain model from them.
5. **Human-readable operating rules and machine parameters are separate.** Rules can be explained through the event policy. Algorithm parameters belong in a dedicated Mingle configuration panel, similar in spirit to the Tournament configuration.
6. **A Mingle plan is intentionally soft.** A planned four rounds does not mean a maximum of four rounds. The organizer may start a fifth or later round.
7. **Event and round times are guidance, not a rigid scheduler.** The advertised event start, location, and approximate end remain important, but live social events are commonly delayed or interrupted. The system must not forcibly end the event or create transitions merely because an estimated time elapsed.
8. **Rounds are normally created at runtime by an organizer action.** They should not have to be authored in advance as ordinary subevents.
9. **Runtime rounds may still be listed on the existing Subevents screen.** That is a presentation and navigation reuse, not a requirement to force Mingle rounds through the full normal subevent lifecycle.
10. **Do not automatically create matches or chats from a table assignment.** A Mingle round establishes a real encounter signal. MyScoutee’s existing relationship, rating, two-person event, and chat behavior remains separate.

## Core product idea

The original trigger was the “clique-free” event format used by HaverVagy: people are placed into small groups, talk for a period, and are redistributed into new groups. The goal was to generalize the useful mechanism without copying a single organizer’s event product.

The broader product idea became:

> MyScoutee should be able to orchestrate lightweight, real-world introductions inside an event, while retaining the resulting encounter signals in the same event and relationship system that already powers discovery and priority.

The participant experience should remain extremely simple:

```text
discover or receive an invite
→ join the event
→ arrive / check in
→ receive the current table or group
→ meet people
→ receive the next assignment
→ optionally rate or reconnect later through normal MyScoutee flows
```

The complexity belongs in the event configuration, assignment engine, organizer controls, and existing MyScoutee infrastructure—not in a second consumer application.

### Product boundary: mixing versus ordinary events

Mingle is needed when MyScoutee must actively assign or reassign participants into smaller groups during a live event. The meaningful structural choices are things such as a pair, a table-sized group, or a standing group, followed by zero or more organizer-triggered redistributions.

An event that simply gathers people, seats one fixed group for the whole occasion, or leaves participants to socialize freely is not automatically a Mingle format. MyScoutee already covers ordinary non-mixing events. Competitor labels such as social dining, networking, or dinner matching do not create new Mingle modes by themselves.

This boundary is more useful than trying to explain or reproduce every tab from a generated mockup:

```text
ordinary event: MyScoutee manages the event and its members
Mingle event: MyScoutee additionally performs live subgroup assignment or rotation
```

## Product evolution and discarded branches

### Initial generalization of table swapping

The first idea was a generalized table-rotation product usable by bars, cafés, coworking spaces, conferences, universities, festivals, private organizers, and networking events. Instead of fixing the format to four people for thirty minutes, the organizer could configure group size, timing, and how people are redistributed.

The discussion quickly expanded beyond literal tables:

- real numbered tables;
- two-person conversations;
- standing groups or zones;
- assigned standing or open groups;
- repeated rotations designed to reduce repeated encounters;
- combinations of these patterns during one event.

The term “table” remains valuable in the user experience because many events use real physical tables. The underlying grouping must nevertheless tolerate pairs and standing groups.

### City discovery and spontaneous attendance

Another explored direction was a city-level list of events or active opportunities. A person might be walking nearby, see that something is happening, enter the venue, and join without weeks of planning.

This introduced three attendance patterns:

- **Pre-booked:** participants join in advance and capacity may be reserved.
- **Walk-in:** participants can arrive while the event is running and become eligible for a later round.
- **Hybrid:** advance registration and walk-in capacity coexist.

These must be configuration dimensions, not separate products. “Venue mode” and “event mode” were explored as separate concepts but should not become a rigid top-level split. A normal MyScoutee event can express a scheduled, walk-in, or hybrid Mingle policy.

### Separate lightweight application and brand

The conversation temporarily explored a separate lightweight product under names such as Mingeva or Mingleva, potentially with a Go backend and a separate frontend served through the existing Nginx host. The attraction was a minimal profile and an extremely small interface.

This branch was later superseded. The current direction is to embed Mingle into MyScoutee because most of the difficult infrastructure already exists:

- users and authentication;
- event creation and discovery;
- location;
- membership and approval;
- QR/check-in capabilities;
- notifications;
- chat and relationship handling;
- ratings;
- priority and discovery signals;
- partner API infrastructure;
- deployment and operations.

The lightweight quality should come from the Mingle participant flow, not from maintaining a second platform.

### “Match as a Service” wording

The partner API led to the phrase “Match as a Service.” It described how a partner could submit an external user identifier, receive an invite link, and let MyScoutee handle registration, event membership, assignments, and later relationship signals.

The useful architectural idea remains, but “match” can be misleading. A Mingle assignment is not automatically a romantic or mutual match. The more precise product behavior is **event participation and encounter orchestration as a service**.

## Relationship to the existing event model

The event remains the main container. It already supplies the information Mingle does not need to reinvent:

- title and description;
- category;
- location;
- advertised start and approximate end;
- visibility and discovery behavior;
- capacity and membership;
- organizer;
- participant-facing policies;
- payment or external payment link where applicable.

The event editor should expose a format or operating-mode selector with approximately these user-facing choices:

- Standard
- Tournament
- Mingle

The exact label may change, but this must not be presented as a simple Tournament on/off or Rule on/off switch.

Selecting Mingle exposes a compact Mingle configuration block. It does not replace the entire event form. It changes the part of the form that currently describes strict subevent or tournament structure.

## Policy versus configuration

Two different concepts must not be conflated.

### Event policy

The event policy communicates human-readable rules and expectations to participants. Examples include:

- whether people move between tables or remain seated;
- whether a host remains at each table;
- how walk-ins are handled;
- whether a participant may skip a round;
- what information participants will see about one another;
- whether ratings become available after the event;
- expected conduct or venue-specific instructions.

These rules can remain editable and descriptive. The system does not need to infer every runtime parameter from prose.

### Mingle configuration panel

The configuration panel stores the structured values used by the assignment algorithm and the live organizer console. It is analogous to Tournament configuration, but its semantics are deliberately looser.

Likely dimensions include:

- planned number of rounds;
- approximate round duration;
- target or allowed group size;
- the physical grouping form required for a configured step, such as table, pair, standing group, or zone;
- available group/table identifiers and capacities where the venue has real numbered tables;
- assignment and redistribution constraints;
- repeat-avoidance strength;
- treatment of newly arrived participants;
- whether a configured role remains fixed, such as a table host;
- which participant attributes, if any, may influence assignment;
- whether an organizer starts every round manually;
- optional defaults used when the organizer creates an additional round.

The panel should be editable as a compact configuration/list block. It should not force the organizer to choose one hard-coded Mingle variant. The labels shown in the generated product image—Table swap, Rapid pairs, Standing mixer, and Networking—must not be treated as a reliable taxonomy. “Pair” versus “table/group” can describe a real algorithmic difference; “standing” can describe a physical layout; generic “networking” says nothing precise about assignment or rotation. Only concrete algorithm parameters should enter the model.

## Planned structure versus live structure

This distinction is central to the product.

### Planned configuration

The organizer may say:

- four rounds are expected;
- approximately twenty minutes per round;
- four people should normally be placed at a table;
- repeated pairings should be minimized.

These values explain the expected event and provide sensible algorithm defaults.

### Live runtime

The organizer controls what actually happens:

- the first round starts when the room is ready;
- a round may last longer or shorter than planned;
- a break or interruption may occur;
- late arrivals may be held for the next assignment;
- the organizer may close the current round manually;
- the organizer may start a fifth round even if only four were planned;
- configuration may be adjusted for future rounds if the actual attendance differs from the plan.

Therefore:

```text
plannedRoundCount != maximumRoundCount
estimatedRoundDuration != automaticCloseDeadline
eventEnd != forcedRuntimeTermination
```

An event may still display an approximate end time for discovery, calendar use, and participant expectations. It must not silently destroy or close the live session when that time passes.

## Runtime domain shape

A minimal conceptual structure is:

```text
Event
├── Event policies                  participant-facing rules
├── Mingle configuration            editable algorithm parameters
└── Mingle runtime
    ├── actual round 1
    │   ├── table/group 1
    │   ├── table/group 2
    │   └── participant assignments
    ├── actual round 2
    └── ...additional manually opened rounds
```

The precise class and collection names remain an implementation decision. The required semantics are more important:

- an actual round is created when it is started, not merely because it was planned;
- each actual round has a stable sequence, status, timestamps, and assignments;
- each group may represent a real table, pair, standing group, or another organizer-defined physical destination;
- assignments are retained as history;
- a round should retain a snapshot of the configuration used to generate it, so later edits do not rewrite history;
- an organizer can create another round beyond the plan;
- the event is not required to materialize planned rounds as ordinary subevents in advance.

## Relationship to subevents

Tournament stages fit the existing subevent model more naturally because they are usually planned and progress from one stage to another under stricter rules.

Mingle is different:

- rounds are horizontal repetitions rather than advancement stages;
- many groups/tables exist in parallel inside each round;
- there is normally no score or advancement;
- actual timing depends on the room and organizer;
- the next round is commonly created by an explicit live action;
- extra rounds are normal rather than exceptional data repair.

For that reason, the Mingle editor may use a dedicated configuration panel where the normal subevent editor currently appears. Runtime rounds should not be forced to behave like fully authored subevents.

The existing Subevents screen can still list actual rounds because it already provides a useful event-scoped list and navigation surface. It can show, for example:

```text
Round 1 — closed — 8 tables
Round 2 — active — your assignment: Table 7
Round 3 — closed — 9 groups
Round 4 — active or waiting
Round 5 — added by organizer
```

This is a read-model and navigation decision. It does not mean Mingle rounds must inherit every validation, scheduling rule, or authoring requirement of normal subevents.

## Organizer experience

The organizer needs a lightweight live control desk, reachable through the Table area. It should make the next operational action obvious and avoid requiring edits to the main event form while people are waiting.

Core capabilities discussed include:

- see expected, joined, checked-in, waiting, and currently assigned participants;
- see active groups/tables and occupancy;
- start the first or next round manually;
- close the current round manually;
- add an extra round beyond the plan;
- include walk-ins or late arrivals in a future round;
- handle no-shows and changing attendance without rebuilding the event;
- view the generated assignments before or as they are published;
- retain actual round and table history;
- optionally adjust parameters used by subsequent rounds.

The organizer’s manual action is the normal trigger. Automation or scheduled starts may be added later, but the data model must not assume they are required.

## Participant experience

The participant should not have to understand the configuration model.

The active Table screen should show only what helps the person move and recognize the group:

- current round;
- current table number, pair, or zone;
- basic information about the people assigned to the same group;
- profile pictures;
- the remaining or expected time, if useful;
- a clear waiting state when no assignment is active;
- the next instruction when the organizer opens another round.

The tables are real physical tables when the event uses tables. The table screen can behave like a temporary member screen: basic identity and profile image, without turning the assignment into a chat room or match.

An earlier standalone-product branch proposed a deliberately tiny profile: display name, image, gender, and age only when required by the organizer. Inside MyScoutee, there should not be a second Mingle profile. The Mingle surface should simply reveal the minimum appropriate subset of the existing profile.

## Navigation and UI integration

The intended integration is incremental rather than a parallel application shell.

### Event editor

- Replace the current binary Tournament-style control with a format selector comparable to the adjacent category selector.
- Standard, Tournament, and Mingle are the main operating choices.
- When Mingle is selected, display the dedicated Mingle configuration block.
- Keep normal event fields and category selection intact.
- Keep participant-facing operating rules in the event policy.

### Table shortcut

The current side-menu/header installation shortcut can move into the existing Settings/gear area. The freed location can become the Table shortcut.

The Table shortcut should take a participant directly to the current assignment or take an organizer to the live console. A red badge can signal an active/new table assignment. If a number is displayed, the UI must make clear whether it is a table number or a notification count.

### Subevents list

The existing Subevents screen can list actual Mingle rounds and open their details. This gives users a familiar route to history while the Table shortcut remains optimized for the current live assignment.

### Explore

Mingle events should remain discoverable through the existing event system. The existing event category remains the category. Mingle is an operating format and may be shown as a compact badge or filter where space permits; it does not require a second marketplace.

The original discussion included city browsing, nearby events, “active now,” tonight/this week views, and spontaneous entry. These remain valuable discovery use cases, but they should extend the existing Explore model rather than create a separate Mingle home screen by default.

## Attendance and check-in

Registration, membership, and physical presence are distinct.

- A person may be an accepted event member but not yet present.
- A walk-in may arrive after one or more rounds have already started.
- The assignment engine should use the currently eligible/present participant set rather than every accepted member.
- A late arrival can wait for the next organizer-started round instead of forcing a rebalance of an active conversation.

The shared discussion explored an event or entrance QR code. A person scans it, authenticates or registers, and becomes checked in for the event. Optional table QR codes were discussed but considered likely to create unnecessary interaction and should not be mandatory.

MyScoutee already has QR and identity-verification concepts. Mingle should reuse the appropriate existing path instead of creating a second registration system.

The attendance policy must be configurable broadly enough to support:

- advance-only participation;
- walk-in participation;
- hybrid participation;
- auto-approved partner invitations;
- organizer-controlled approval where required;
- late arrival entering a later round;
- a participant temporarily waiting instead of being assigned.

## Assignment engine

The engine receives the current eligible participant set, the current Mingle configuration, actual venue/group capacity, and encounter history. It produces assignments for one newly started round.

The most durable core constraint is repeat avoidance: where possible, a participant should meet people they have not already met, including encounters from earlier rounds and potentially earlier events.

Other dimensions explored in the conversation include:

- random distribution;
- maximum number of new encounters;
- similarity or shared interests;
- deliberate diversity;
- language;
- age bands when the event requires them;
- gender-aware pairing where the policy requires it;
- professional or event-specific attributes;
- fixed host with rotating participants;
- one side moving while another remains;
- everyone moving;
- uneven group sizes caused by actual attendance;
- pairs, small tables, larger tables, standing groups, and zones;
- imported encounter history from an external organizer.

These are configuration dimensions or constraints, not reasons to create a hard-coded event-type hierarchy. The first implementation may expose only a safe subset, while the stored configuration should be evolvable and versioned.

The engine must degrade gracefully. If every constraint cannot be satisfied, it should produce a usable assignment and record or surface the relaxation rather than block the live event.

## Encounters, ratings, relationships, and chat

Mingle is valuable to MyScoutee because a real-world event produces new relationship signals.

The important distinction is:

```text
assignment != encounter != rating != match != chat
```

- An assignment says where someone was placed for a round.
- A completed/confirmed round can establish that co-assigned people encountered one another.
- A rating is optional and may become available later.
- A mutual relationship or “match” follows its own MyScoutee rules.
- Chat is not automatically created for every table or encounter.

Mingle events should not create the normal event group chat merely because the event has members. The user explicitly preferred preventing group-chat behavior for Mingle.

MyScoutee can already support a later two-person event. If both people accept that event, the existing chat behavior can apply. This avoids forcing a swipe-style mutual-like flow into Mingle.

The encounter history can feed MyScoutee’s existing priority/noise-filter logic:

```text
Mingle participation
→ real encounters
→ relationship signals
→ priority filtering
→ more relevant future events
→ possible repeated real-world interaction
```

This is a major differentiator from a standalone table-rotation utility. The event is not the end of the data flow; it can improve future discovery while remaining privacy-conscious.

## Current activity/rating concern

The current MyScoutee event behavior should not be assumed to model Mingle encounters correctly. Ordinary accepted event membership may imply a broad event-level relationship, while Mingle needs the narrower fact that two people were assigned to the same group in an actual round.

Mingle therefore needs a canonical encounter record derived from actual runtime groups, not from every accepted event member. The exact point at which an encounter becomes durable—round close, organizer confirmation, or another explicit event—must be chosen during implementation. It must not be inferred merely from a planned assignment that never ran.

Ratings can be unlocked after a round or event according to product policy, but they remain downstream of encounters rather than defining whether an encounter occurred.

## Partner integration API

The strongest external integration discussed is intentionally small.

### Invite flow

A partner that already manages its audience sends its own internal participant identifier for a specific event:

```text
partner external_user_id
→ MyScoutee integration API
→ unique invitation URL/token
→ partner sends the URL
→ person registers or signs in to MyScoutee
→ invitation is claimed
→ MyScoutee user is attached to the event
→ event membership is automatically approved when the integration policy allows it
```

The partner does not need to send a name, email address, profile image, or other personal data. Until redemption, MyScoutee only needs the event, integration owner, partner-scoped external identifier, token state, and expiration.

Batch creation is important because an organizer may upload many identifiers and receive one URL per participant. The external identifier must be scoped to the authenticated integration client or tenant rather than treated as a global user identifier.

Tokens should be opaque, high entropy, scoped, expiring, and single-use or otherwise protected against unintended reassignment. Raw bearer credentials and internal IDs must not appear in public URLs or logs.

### Encounter and history integration

The discussion also considered external systems importing historical “who met whom” data. This can help repeat avoidance when an organizer used a previous system. If supported, it should be an explicit idempotent encounter-import operation with event/round provenance, not an ambiguous user update.

For events run by MyScoutee, the preferred direction is for MyScoutee to remain the source of truth and expose results outward. Existing webhook/watch infrastructure can notify partners about privacy-safe events such as:

- invitation claimed;
- participant joined or checked in;
- round opened or closed;
- assignment or encounter recorded;
- event completed.

The API may also expose query endpoints for durable state. Webhooks should deliver changes; they should not be the only way to recover current state.

### Existing integration UI

The API settings popup should include a question-mark/help control next to the close control. It should open the GitHub repository documentation location where the README table links to the Integration API documentation.

## Payments and external organizers

The initial Mingle scope does not require MyScoutee to replace a partner’s payment system. An organizer may continue to sell tickets or collect payment externally and link participants into MyScoutee for the live experience.

Affiliate commission and deeper payment integration were discussed as possible later commercial models. They are not prerequisites for the Mingle runtime.

## Realtime delivery

The live table assignment must be easy to reach and must recover correctly after delays or reconnects.

The durable source of truth is server-side runtime state. A foreground client can receive immediate changes through a realtime channel such as WebSocket. Firebase push notifications can wake or alert a device when the app is backgrounded, but push delivery alone should not define the active assignment because it may be delayed, duplicated, or disabled.

On resume or reconnect, the client should query the current event/round assignment and render the authoritative state. The notification is a prompt to refresh, not the state itself.

## Discovery and priority

The original standalone idea emphasized a city list: nearby sessions, active-now opportunities, upcoming events, available places, language, and approximate format. When brought into MyScoutee, this becomes an extension of Event Explore rather than a second discovery product.

The existing category remains the participant-facing subject or context of the event. Mingle describes how people are orchestrated once they attend.

Priority can use Mingle encounters as signals, but Mingle events must remain joinable even for users who are not participating in a more personalized priority mode. Discovery eligibility, event visibility, and priority ranking must remain separate concerns.

## Flexibility requirements

The Mingle configuration must be broad enough to support the explored cases without exposing a complex universal workflow language to ordinary organizers.

It should support, or be able to evolve toward:

- a scheduled event with advance registration;
- a spontaneous walk-in event;
- a hybrid event;
- a single table rotation format;
- rapid two-person conversations;
- standing groups;
- assigned networking groups without scores, when the system actually performs grouping or regrouping;
- a World Café-style rotation, without making World Café a separate product type;
- fixed table hosts with rotating guests;
- multiple group sizes;
- approximate timed rounds;
- organizer-paced untimed rounds;
- late arrivals joining only future rounds;
- extra rounds added during the event;
- repeat avoidance across the same event;
- repeat avoidance across previous events;
- partner-provided encounter history;
- rules using a small set of event-specific participant attributes;
- external participants entering through unique invitation URLs.

Flexibility should come from editable parameters, rules, and runtime control—not from continually adding top-level event types.

## Simplicity requirements

Broad configuration must not make the default path heavy.

- The event form should still require only a small number of fields for a common Mingle event.
- Advanced constraints should remain optional.
- Human policy text and algorithm parameters must remain visibly separate.
- Participants should never see the assignment configuration.
- Participants should see only their current instruction, table/group members, and relevant timing.
- Organizers should control the live event from one compact console.
- The system should choose sensible defaults and tolerate real-world deviations.
- Creating an extra round should be a normal action, not an error recovery workflow.

## Suggested implementation boundary

This section records the current conceptual boundary without fixing names prematurely.

### Persisted event configuration

- Mingle enabled through the event operating mode.
- Structured, versioned Mingle configuration.
- Participant-facing event policies remain separate.
- Planned round count and durations are advisory.

### Persisted runtime

- Mingle runtime/session state for the event.
- Actual manually started rounds.
- Groups/tables within each actual round.
- Participant assignments.
- Snapshot of the configuration used for each generated round.
- Durable encounter records when the chosen confirmation condition is met.

### Derived/read models

- current participant assignment;
- organizer console counts and table state;
- red Table indicator/current assignment shortcut;
- runtime round history presented in the Subevents list;
- partner-facing event/assignment/encounter history where authorized;
- priority signals derived from confirmed encounters.

## Current repository fit observed during the follow-up discussion

These are repository observations, not claims from the original shared chat:

- The frontend currently defines `EventMode` as `Casual | Tournament`.
- The frontend currently separates subevent enablement from its mode selector.
- Tournament-specific configuration, stages, group views, and a subevent list already exist and provide useful UI patterns.
- Existing event policy items contain a title, description, and required flag; those remain suited to human-readable policies, not algorithm configuration.
- The side menu currently has an installation/setup shortcut and an existing Settings path that can host that setup action.
- The notification area already supports alert-style counters.
- MyScoutee already has an authenticated integration API with event/asset batch synchronization and outbound watch/webhook infrastructure.
- The existing integration API does not yet provide the proposed partner participant-invite or encounter endpoints.
- Existing event feedback and relationship projection must not be assumed to represent table-level encounters accurately.
- Existing WebSocket and Firebase-related infrastructure can inform the live delivery design, but server-side round/assignment state must remain authoritative.

## Non-goals and traps

Avoid the following unless later requirements explicitly change:

- a separate Mingle application or second MyScoutee user profile;
- a World Café event type;
- a closed `mingleVariant` enum;
- treating the four visual examples as an authoritative taxonomy or as exclusive tabs that define the data model;
- pulling ordinary non-mixing social events into Mingle when the existing event model already covers them;
- duplicating the existing event category inside Mingle;
- requiring every planned round to be authored as a normal subevent;
- automatically starting or ending rounds solely from estimated timestamps;
- preventing an organizer from adding rounds beyond the plan;
- treating every accepted event member as having met every other member;
- automatically creating a group chat, pair chat, or match for an assignment;
- using push notification delivery as the source of truth;
- requiring partners to transmit personal participant data when an external ID and claimable invitation are sufficient;
- building payment replacement, affiliate accounting, or a second marketplace as a prerequisite for the first Mingle runtime.

## Open implementation decisions

The conversation intentionally leaves several details open:

- the final user-facing name of the Standard/Casual mode and the selector itself;
- the exact structure of the editable Mingle configuration list;
- which assignment constraints belong in the first release;
- whether mixed grouping patterns can change per round in the first release or only later;
- how real tables/zones are entered and reused by an organizer;
- the precise encounter confirmation event;
- when ratings become available;
- whether an active table badge displays a table identifier or an attention count;
- whether foreground updates use a dedicated event WebSocket channel or another existing realtime abstraction;
- how much Mingle filtering is added to Explore when horizontal space is limited;
- whether encounter import is part of the initial partner API or a later compatibility endpoint.

These decisions should be resolved from the simplest coherent vertical slice, without narrowing the persisted model so much that walk-in, hybrid, standing, pair, and extra-round use cases become impossible.

## Compact final model

The current direction can be summarized as follows:

```text
Existing MyScoutee Event
├── existing category, location, discovery, membership, payment link, etc.
├── operating mode: Standard | Tournament | Mingle
├── participant-facing event policies
└── Mingle configuration panel
    ├── editable algorithm parameters and grouping rules
    ├── planned counts and approximate timing
    └── defaults for organizer-created rounds

Live operation
├── organizer starts a round
├── engine assigns currently eligible participants
├── participant receives table/pair/group instruction
├── organizer closes or advances when reality permits
├── actual round appears in runtime history/Subevents list
├── organizer may create additional rounds
└── confirmed co-participation produces encounter signals

External integration
├── partner external user ID
├── unique claimable invite URL
├── MyScoutee registration/login and automatic event attachment
├── MyScoutee runs the Mingle experience
└── authorized state/history can flow back through API and webhooks
```

The central design principle is:

> Configure broadly, plan softly, run manually, record what actually happened, and reuse those real encounters inside MyScoutee.
