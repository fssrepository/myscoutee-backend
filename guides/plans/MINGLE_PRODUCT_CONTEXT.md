# MyScoutee Mingle — Current Product Context

## Purpose

This document records the current, simplified Mingle product decision. It is a
product-context document, not a detailed implementation specification.

- Source discussion: <https://chatgpt.com/share/6ab04d7f-3bec-83ed-b51b-d4af55a9c351>
- Updated from the follow-up discussion on 20–21 September 2026
- Language: English reconstruction of the original Hungarian discussion

## Product decision

Mingle is not a separate application. It is one optional block on an existing
MyScoutee event.

MyScoutee already provides:

- event creation and Event Explore;
- category, location, start time, approximate end time, and capacity;
- event policy;
- membership, tickets, and ticket check-in;
- profiles and priority signals;
- chat and notifications;
- payment or an external payment-provider link;
- API and webhook infrastructure.

Mingle adds only the missing live operation:

> Run timed rounds over the currently eligible participants, assign them to
> numbered tables or groups, and show each participant the current destination.

The value comes from embedding this small operation into the existing event and
priority system, not from creating another consumer product.

### What is actually missing

Compared with narrow mixer applications, MyScoutee does not need another
discovery page, profile, registration flow, ticket, check-in, chat, payment
flow, or event-membership system. Those already exist.

The actual product gap is limited to:

- generating the next live table/group assignment;
- running that assignment as a timed round with a table-change break;
- showing the result to each participant;
- retaining the actual assignment history;
- optionally exposing the same event entry through a small partner API.

## Mingle is an event operation, not an event category

The event category continues to describe what the event is about. Mingle
describes how participants are distributed while the event is running.

These are ordinary MyScoutee event concepts:

- rapid dating;
- a lock-and-key party;
- networking;
- a social dinner;
- a World Café;
- a discussion evening.

They do not require Mingle merely because of their theme. They use Mingle only
when MyScoutee must assign or reassign people during the live event.

Examples:

```text
advertised rapid-dating event             -> normal MyScoutee event
system-generated pair changes by round    -> event with Mingle enabled

advertised lock-and-key party             -> normal MyScoutee event and policy
system-generated group/table changes      -> event with Mingle enabled
```

A World Café with managed table rotation is a direct Mingle use case, not a
separate World Café mode. A World Café that does not require MyScoutee to move
people remains an ordinary event.

A Timeleft-style dinner is not another mode either. If the organizer simply
accepts a fixed table of participants, it is an ordinary event. A compulsory
system-generated physical table can be represented as a single-round Mingle
assignment, but it does not imply live rotation during the dinner.

Timeleft packages one specific format: a pre-composed small group, a dinner,
and a coordinated venue. MyScoutee generalizes the underlying parts instead:

- the event category and policy describe the purpose and real-world format;
- the existing event handles discovery, place, time, membership, and payment;
- the existing priority flow organizes the wider participant set into ordered
  chat-room choices, after which users choose what they want;
- Mingle is used only when MyScoutee must produce one or more group
  assignments for the physical event instead of leaving that choice to users.

A Timeleft-like dinner is therefore one possible configuration of MyScoutee,
not a separate feature family or a template that defines the Mingle model.
Timeleft makes one central group choice for the participant; MyScoutee normally
generalizes this into priority-organized choices with user selection.

There is no `mingleVariant` enum. The generated mockup labels such as Table
swap, Rapid pairs, Standing mixer, and Networking are not four product types.
Pairing is simply a group size of two. Networking is an event purpose. Standing
or seated is usually a venue or policy detail.

## Event editor integration

The current Tournament on/off-style control should become a format selector
similar to the adjacent category selector. The intended choices are
approximately:

- Standard;
- Tournament;
- Mingle.

The final name of Standard may change. Selecting Mingle keeps the normal event
form and shows one compact Mingle configuration block, possibly where the
strict Subevents configuration is otherwise shown.

The block should remain an editable list or a small set of inputs. The useful
parameters are expected to be limited to values such as:

- normal group size;
- planned number of rounds;
- approximate round duration;
- table-change/break duration;
- available table/group numbers or count;
- simple assignment priority and repeat avoidance.

The exact first-release fields remain an implementation decision. The model
must not grow a separate workflow language or a list of named Mingle modes.

### Relationship to Tournament

Tournament configuration is a useful UI precedent, but Mingle is not a
tournament without scores.

- Tournament stages normally progress toward later stages.
- Mingle rounds repeat horizontally over the same live participant pool.
- Several tables/groups exist in parallel in each round.
- There is no score, winner, elimination, or stage advancement.

This is why Mingle can reuse the idea of an event configuration block without
copying the Tournament stage model. It can also reuse the Tournament-style
timed progression with manual organizer controls for live exceptions.

## No special stationary-person model

There is no separate table-host, fixed-person, moving-side, or stationary-side
domain concept.

If someone should remain at the same table in the next round, the next
assignment simply gives that person the same table number while other people
receive new table numbers.

```text
round 1: Alex -> Table 3
round 2: Alex -> Table 3
```

This is an ordinary assignment result, not a special participant role.

## Policy and configuration

The existing event policy remains the human-readable place for flexible
operating information, for example:

- participants may arrive while the event is running;
- the normal round and table-change flow;
- rounds may be shorter or longer than planned;
- the advertised end time is approximate;
- venue-specific instructions and expected conduct.

The Mingle block contains only the structured values needed to create an
assignment. The application does not need to convert every real-world detail
into a switch.

There is no separate walk-in mode. If an ongoing event is still visible, has
space, and its policy allows joining, a person can join, use the existing ticket
and check-in flow, and become available for a later round.

The event is past only after its end time. An ongoing event remains available
to the existing Explore ranking and filters, including location-based
filtering.

Explore may later show a compact Mingle badge or filter if it fits the existing
surface. If the current filter row has no space, it can be placed in the
existing extended filter form. This is an extension of Event Explore, not a
separate Mingle discovery screen.

## Flexible rounds

Round planning is advisory:

```text
planned round count != maximum round count
configured round and break durations = default automatic cadence
timer transition != irreversible transition
event end time != forced Mingle shutdown
```

The organizer starts the live sequence. After that, the normal flow may be
automatic: a conversation round ends, a configurable table-change break runs
for approximately five to ten minutes, the next assignment is displayed, and
the next round begins.

The organizer can pause, delay, extend, or manually advance this flow when
something happens in the room. Automation provides the normal cadence; manual
control handles exceptions, similarly to the existing Tournament flow.

A planned four-round event may receive a fifth round. The organizer should not
have to edit the main event or pre-create normal subevents to do this.

Actual rounds may appear in the existing Subevents list as event-scoped
history, but they are lightweight runtime rounds rather than pre-authored
subevents with a strict lifecycle.

## Minimal live operation

The live flow is deliberately small:

```text
organizer starts the Mingle sequence
-> assign currently eligible/check-in participants
-> run the conversation round
-> enter the configured table-change break
-> generate and show the next table numbers
-> start the next round automatically
-> organizer intervenes only when needed
```

Ticket check-in is existing MyScoutee functionality and is not a missing
Mingle feature. Mingle only consumes the resulting eligible participant set.

A late arrival waits for the next round. The system does not need to disrupt an
active table assignment.

For later rounds, the assignment can avoid repeated co-participants. It may use
signals already available to the priority system, but it must not confuse this
with the existing priority flow itself: that flow organizes chat-room choices
and lets users choose, while Mingle produces a physical table assignment.

If a participant receives the same table again, that is valid. The assignment
engine decides which table number each participant gets; the data model does
not need to describe who physically moves.

## Organizer and participant surfaces

### Organizer

The Table surface acts as a small control desk:

- show the current round;
- show participants grouped by table number;
- show people waiting for the next round;
- start the Mingle sequence;
- pause, delay, extend, or manually advance the current phase;
- start an extra round beyond the plan;
- retain the actual round history.

### Participant

The participant surface should show only:

- current round or waiting state;
- current table/group number;
- basic information and profile pictures for the people at that table;
- approximate remaining time;
- a table-change countdown before the next round.

General movement and conduct instructions belong in the event policy. Runtime
UI only needs to show the current fact, such as `Go to Table 7` or `Next round
starts in 06:20`; it is not another instruction or policy subsystem.

An assignment does not automatically create a match, pair chat, group chat, or
new event. If two people want to continue separately, the existing MyScoutee
flow can create a two-person event; its existing chat behavior then applies.

### Navigation

The Table shortcut must be easy to reach and may display a red indicator when a
new/current assignment is available.

The current installation shortcut can move into the Settings/gear menu or into
a small icon near the notification bell. The exact placement remains a UI
decision.

## Minimal persisted shape

The product needs only:

```text
Event
|- existing event data and policy
|- optional Mingle configuration
`- actual Mingle rounds
   `- table number -> participant IDs
```

Actual saved round assignments provide the history of who was placed together.
Completed co-assignment may later feed the existing priority and rating logic.
This does not require a separate matching product or an automatically created
relationship.

Ordinary event membership or a broad event activity value must not be treated
as proof that every participant met every other participant. For Mingle, the
relevant signal comes from the actual completed table/group assignment.

## Partner API

The external API is a small additional entry path into the same MyScoutee
event, not a separate Mingle platform.

The core invite flow is:

```text
partner event + partner external user ID
-> MyScoutee returns a unique claimable URL/token
-> partner sends the URL
-> person registers or signs in
-> MyScoutee attaches the person to the event
```

Batch invite creation is useful when a partner already has a participant list.
An optional later API may import previous encounter information or expose
results through the existing watch/webhook mechanism. That is not required for
the first simple Mingle runtime.

This capability may be described commercially as matching as a service, but it
is still the same small event assignment capability exposed to partners. It
must not turn the first implementation into a general-purpose orchestration
platform.

### Profile API popup

The existing API popup in Profile needs a question-mark/help icon next to its
close control.

The help icon opens the GitHub repository README location where the
documentation table links to the Integration API documentation. The popup does
not need to reproduce the full API manual.

## External payment provider

An external payment provider is needed independently of Mingle. Mingle must
reuse the event's normal payment or external-payment path rather than introduce
its own payment flow.

An external payment URL must be validated before it is stored or opened. The
exact validation and provider rules belong to the payment implementation, not
to the Mingle configuration.

## Realtime delivery

The implementation may reuse the existing notification and realtime
infrastructure. Firebase notification versus WebSocket delivery does not need
to be settled in the product model.

The durable fact is the current saved round assignment. A notification only
tells the client to display or reload it.

## Explicit non-goals

Do not add the following to the initial model:

- a separate Mingle/Mingeva/Mingleva application;
- a second profile, event marketplace, category, or social graph;
- four named Mingle variants based on the concept image;
- separate rapid-dating, lock-party, networking, or World Café types;
- table hosts, stationary participant roles, or movement modes;
- a separate walk-in or Mingle check-in system;
- mandatory table QR codes;
- pre-created rigid rounds;
- timer transitions that cannot be paused or corrected by the organizer;
- automatic matches or chats;
- printed badges or agendas;
- a Mingle-specific payment system;
- a universal constraint/workflow engine;
- a large standalone partner platform.

## Small implementation boundary

The first coherent product slice is:

1. add Mingle to the event format selector;
2. show one compact editable Mingle configuration block;
3. add the Table shortcut and the small organizer/participant surfaces;
4. start a timed Mingle sequence from checked-in participants;
5. run round and table-change timers with manual organizer controls;
6. store and display table-number assignments;
7. allow additional rounds beyond the plan;
8. preserve completed round assignments for priority/history use;
9. add the Profile API-popup help link;
10. reuse the event's validated external-payment URL flow.

The partner invite API can use the same event and participant model without
changing this Mingle runtime.

## Compact model

```text
Existing MyScoutee Event
|- category, Explore, location, time, capacity
|- policy, membership, ticket/check-in, payment
|- operating format: Standard | Tournament | Mingle
`- Mingle block when selected
   |- small editable configuration
   |- organizer starts the timed sequence
   |- rounds and table-change breaks advance automatically
   |- organizer can pause or manually advance when needed
   |- participant receives a table number
   |- same number again means the participant stays there
   `- saved rounds can inform priority

Optional partner entry
`- external user ID -> claimable URL -> existing event membership
```

The central decision is:

> Keep Mingle small: one configurable block on an event, one timed live
> sequence with manual assistance, and one table number per participant.
