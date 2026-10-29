# Prompt pack

All generation prompts are in English because the three target platforms
generally follow detailed visual direction more reliably in English. Dialogue
and titles remain in [SCRIPT.md](../film/SCRIPT.md).

## Assembly rule

For an individual shot, paste in this order:

1. the contents of [prompts/continuity-prefix.txt](continuity-prefix.txt);
2. the relevant `SHOT Sxx` block from
   [prompts/shot-prompts.txt](shot-prompts.txt);
3. only the platform-specific control line described in the platform workflow.

Do not paste the full-film Director prompt into a single-shot generator. Do not
rewrite the founder description shot by shot. Consistency comes from stable
references, Elements/Characters/Ingredients, a stable continuity prefix, the
same costume tokens and conservative motion.

## Veo Lite native-audio hard lock

For every Google Flow/Veo interval, repeat this block once at the very end of
the assembled shot prompt. The repetition is intentional: audio constraints
buried inside a long visual prompt are easier for a video model to ignore.

```text
VEO AUDIO HARD LOCK: Generate silent production picture only. Absolutely no
dialogue, narration, singing, background music, cinematic score, melody,
harmony, musical drone, rhythmic pulse, ambience or sound effects. Final sound
is created only after all clips are joined. Discard any native platform audio.
```

This instruction avoids treating independent Veo audio as continuous. Build
foley and ambience in post and run one separately produced score continuously
under the assembled film.

## Opening and continuation typography

P00-to-CP00 is an eight-second generated background transition: the route globe
contracts into the first soil furrow. Do not ask the video model to redraw any
public title. Composite the exact repository mark and editable `MYSCOUTEE · THE
STORY`, `PART I · THE CITY BETWEEN US`, `BASED ON A TRUE STORY` and `BOOK
AVAILABLE` typography over that plate in post, then fade it before CP00. S01
begins at `00:08` without title text.

CP22-to-E01 is an eight-second generated closing transition. The operator first
completes her own local connection with equal agency; the living network then
resolves into the exact repository mark, the invitation `TEST IT WITH ME IN
REAL COMMUNITIES` and `TO BE CONTINUED`. Stabilize the exact mark and editable
type in post. Do not repeat the film or book title or `BOOK AVAILABLE`.

## Prompt tokens

Replace bracketed tokens only once in your working copy:

| Token | Replace with |
| --- | --- |
| `[FOUNDER_REF]` | approved Founder reference saved in Flow |
| `[MAYA_REF]` | saved Maya character/reference |
| `[DANCE_STUDENT_REF]` | saved dance-student character |
| `[DANCE_PARTNER_REF]` | saved partner character |
| `[OPERATOR_REF]` | saved technically capable, accountable local-operator character |
| `[SKETCH_WOMAN_REF]` | approved G03 first-group character with sketchbook |
| `[CUP_WOMAN_REF]` | approved G04 first-group character with reusable cup |
| `[GAME_MAN_REF]` | approved G05 first-group character with tabletop-game piece |
| `[ROUTE_MAN_REF]` | approved G06 first-group character with folded transit map |
| `[BUDAPEST_WORLD]` | approved Budapest style/location reference |
| `[LONDON_WORLD]` | approved lived-London style/location reference |
| `[SOHO_OFFICE]` | approved modest Soho software-office reference |
| `[LEE_VALLEY_HOME]` | approved low-rise, flat-roofed shared-home, bathroom and shared-room reference |
| `[DANCE_STUDIO]` | approved empty studio reference |
| `[EVENT_VENUE]` | approved venue reference |
| `[DEPLOYMENT_PACKAGE]` | approved install-package prop and operator-workspace reference |
| `[NOTEBOOK_PROP]` | approved cognac notebook reference |

When the platform supports `@` references, use the actual saved asset name in
the text. When it uses media tiles, attach the tile and keep the descriptive
name in the prompt.

The complete identity contract, including the five Budapest memory characters,
the five-year Hungarian house casting pool and the exact G01–G06 ensemble, is
[`assets/characters/CHARACTER_MAP.md`](../assets/characters/CHARACTER_MAP.md).
Prepend
[`prompts/character-continuity-master.txt`](character-continuity-master.txt) to
every people-image prompt. Book-specific copy-paste baselines are in
[`prompts/book-character-illustrations.txt`](book-character-illustrations.txt).

## Character and world still prompts

Generate these before any video. Choose one result for each and never silently
switch designs halfway through.

### Founder identity sheet

```text
Create a professional cinematic character reference sheet derived faithfully
from [FOUNDER_REF], preserving real facial proportions, age, hairline, nose,
jaw, eye spacing, skin tone, body proportions and natural asymmetry. Premium
2.5D animated short-film treatment: expressive hand-drawn facial linework on a
dimensional, softly lit character, tactile wool and paper texture, humane and
recognizable, not photoreal uncanny and not a caricature. Stable costume: navy
mid-length field coat, charcoal crew-neck knit, muted rust scarf, dark trousers,
practical brown shoes, compact dark backpack, worn cognac notebook. Show front,
three-quarter left, three-quarter right, profile, back, full body and seated
views on a neutral warm-grey background. Then show eight subtle expressions:
attentive neutral, hopeful half-smile, concentrating through noise, brief social
uncertainty, tired but composed, recognition, listening within a group, calm
founder confidence. Identical identity and costume in every panel. No text,
labels, logos, glamour retouching, exaggerated sadness or giant smile.
```

### Maya identity sheet

```text
Create an original adult character called Maya from the authorized [MAYA_REF],
or from the approved original design if no real person is used. Premium 2.5D
animated short-film treatment consistent with the Founder sheet. Preserve one
stable face and body across every view. Moss-green coat, cream shirt, simple
silver stud earrings, practical city clothing, no luxury brands. Show front,
three-quarter views, profile, full body and seated views. Expressions: curious,
reading carefully, attention overload without panic, safety-conscious caution,
calm decline, calm acceptance, listening, natural group laughter. Maya is an
autonomous community member, not a romantic prize. Neutral segmented
background, no text or logos.
```

### Supporting cast sheet

```text
Create a cohesive supporting cast for a premium 2.5D animated film, all clearly
adult, visually distinct and humane. Include four recurring first-group adults
who combine with the Founder and Maya into exactly three women and three men: a
Black woman in a rust cardigan with a sketchbook, an East Asian woman in teal
with a reusable cup, a fair-skinned curly-haired man in a navy jacket holding one
tabletop-game piece, and a South Asian man in an olive jacket with a folded
transit map. Also include a dance student in a teal practice top, her friendly
partner in a rain coat carrying a folded umbrella, three diverse first-date
partners in ordinary smart-casual clothing, and a competent country operator who
is visibly comfortable at a Linux/server workstation with a hardware key and
deployment checklist. Every person has realistic body variation, subtle facial
asymmetry and an individual prop or posture. Nobody is glamorous, grotesque,
threatening, submissive or comic relief. Front and three-quarter reference views
on segmented warm-grey background. No text, brands or stereotypes.
```

Select and save the four first-group adults separately as
`[SKETCH_WOMAN_REF]`, `[CUP_WOMAN_REF]`, `[GAME_MAN_REF]` and
`[ROUTE_MAN_REF]`. A combined board alone is not sufficient for book crops or
first/last-frame video control.

### Budapest world sheet

```text
Create a location reference sheet for [BUDAPEST_WORLD] in the same premium 2.5D
animated film style: modest dawn apartment by a tram line, stylized yellow tram
reflection without official logo or route number, Danube and bridge geometry as
layered dimensional paper planes, warm terracotta and winter teal palette,
tactile wet pavement, old Budapest dance studio with timber floor, tall windows,
cream walls and radiator. Lived-in and specific, not a tourism postcard. Empty
clean plates from wide, medium and detail angles. No readable text or people.
```

### London world sheet

```text
Create a lived-London location reference sheet in the same premium 2.5D animated
film style. Begin with a restrained 2011 arrival layer, then include the public
energy of the 2012 Diamond Jubilee and Olympic summer as the following year
without official marks; a modest multicultural Soho software office;
museums, exhibitions, nightlife and mutually curious dates; one brief late
Victoria line reflection without TfL branding; then a maintained, flat-roofed,
low-rise shared flat beside a Lee Valley canal near Mansfield Park. Roof access
reveals canal water, reservoirs, wetland birds and green parkland; distant
athletics floodlights may suggest the London 2012 training summer without
official marks. Slate blue, rain green, sodium amber, tactile painted walls,
timber and fogged glass. Diverse everyday city, not Big Ben, red-bus or
phone-box tourism shorthand. Empty clean plates, wide/medium/detail views, no
readable text or logos.
```

### Soho software-office sheet

```text
Create [SOHO_OFFICE], a modest believable software office in Soho in the same
premium 2.5D animated style: several individual desks, laptops with blank screen
plates, practical cables and notebooks, warm lamps, cool monitor fill and a
rain-softened brick Soho street outside. Competent colleagues and long workdays,
not a glossy startup advertisement. No company, logo, readable code, factory,
worksite, warehouse or inspection imagery. Empty wide, desk-height and window
reflection plates with identical geometry.
```

### Lee Valley shared-home sheet

```text
Create [LEE_VALLEY_HOME], one coherent maintained, roughly four-and-a-half-room,
low-rise flat-roofed shared home beside a Lee Valley canal near Mansfield Park
in the same premium 2.5D animated style. Show a narrow inner hall, lived-in shared kitchen,
one full bathroom, one separate tiny WC, and a compact shared bedroom with two
clearly bounded sleeping/storage and desk zones. Shoes, coats, meals and personal
photographs imply exactly ten adults total—the Founder plus nine Hungarian
flatmates—without lining them up. They are a varied Hungarian microcosm inside
multicultural London: each
has an individual age, build, temperament, work rhythm and reason for leaving,
and a different relationship to Hungary: return plan, uncertainty, new local
bond or a life they no longer want to leave. Some felt happier in London despite
the constraint, but never display a percentage or call anyone rootless. No
national costume or caricature. Use the identity planning board in
`prompts/london-hmo-residents-character-board.txt`. Include one clean night and
morning shared-bedroom plate so an editor can reveal an unannounced resident
swap through a different snore and silhouette; do not depict gambling, debt or
the person as a joke.
Maintained but genuinely crowded, financially pragmatic and humane; never dirty,
homeless, luxurious, hostile or humiliating. Consistent wide, hall, bathroom,
WC, doorway and desk plates. No address, brands or readable text.
```

### Hungarian origin and Budapest housing memory board

Use [prompts/hungarian-origin-rural-budapest-memory-board.txt](hungarian-origin-rural-budapest-memory-board.txt)
to confirm the eight origin memories before regenerating S01–S02. The hero film
uses only a compressed selection; the board preserves the fuller workers'-hostel,
temporary-room and parent-assisted-flat chronology without identifying the real
private-rental location or implying unemployment.

### First Budapest attempt and interview-journey memory board

Use
[prompts/budapest-first-attempt-and-interview-journeys-memory-board.txt](budapest-first-attempt-and-interview-journeys-memory-board.txt)
for the roughly one-month relatives' house, reported work mismatch, return to
the parents and later employment-centre-reimbursed one-day interview journeys.
The feeling of being an imposition is internal testimony, not a criticism of
the relatives.

### Cornfield-to-Trivandrum first-assignment memory board

Use
[prompts/cornfield-to-trivandrum-first-assignment-memory-board.txt](cornfield-to-trivandrum-first-assignment-memory-board.txt)
for the cornfield hiring moment, anonymous Indian company, roughly six-week
Irish–Hungarian team, practical-English beginning and one nearly tourist-free
visited shoreline. Do not identify the company, campus or beach, imply fluent
English or merge this professional stay with the separate November 2016 India
journey.

### Pre-London work breakdown and exit memory board

Use
[prompts/pre-london-work-breakdown-and-exit-memory-board.txt](pre-london-work-breakdown-and-exit-memory-board.txt)
for the anonymized United States assignment, promised-but-unreceived overtime
payment, return to and continued work in the Hungarian office, later trust
friction and hearing corridor, six-and-a-half-month unemployment period,
four-round interview and London job within two weeks despite weak English. This
is first-person memory, not an adjudicated claim against any employer, lawyer
or psychological-test method.

Use the companion
[United States assignment dream-and-pressure board](united-states-assignment-dream-and-pressure-memory-board.txt)
to keep the roughly four-to-five-month stay non-binary: Baltimore-area hotel
base, company-rented car, Mid-Atlantic journeys, Adams Morgan social openness,
the New York-to-Baltimore feeling of going home, an expansive world and almost
no private life under heavy work. The non-graphic health symptom and 2011 London
care threshold remain in the companion pre-London board without diagnosis.
Exact place candidates remain `CONFIRM`, and no visa/work-authorization detail
enters public generation.

### Budapest relationship and acceptance memory board

Use
[prompts/budapest-before-london-relationship-memory-board.txt](budapest-before-london-relationship-memory-board.txt)
to lock five privacy-safe, individual women and the Debrecen-distance,
spontaneous-introduction, housing, commitment, London-home-visit,
incomplete-disclosure, premature-judgment and acceptance memories.

### 2017 photograph, date and unfinished return memory board

Use
[prompts/budapest-2017-photo-match-and-unfinished-return-memory-board.txt](budapest-2017-photo-match-and-unfinished-return-memory-board.txt)
for the almost-two-year match silence, unusually flattering Founder photograph,
subjectively compelling woman, anonymous investment-bank employment question,
evasive London-facing answer, apparently good date from the Founder's side, no
second date or conversation, and one modest nudge toward Hungarian institutional
re-entry. Do not invent her reason for declining or turn the memory into an
employment advertisement.
This board supports the public book and character development; it is not a
request to add six scenes to the 03:12 hero film.

### Budapest return, nightlife and re-entry memory board

Use
[prompts/budapest-return-nightlife-reentry-memory-board.txt](budapest-return-nightlife-reentry-memory-board.txt)
for the first Thursday-night grimace after the December 2015 return, the rapid
Saturday decision to organize Thailand, the separate short rebuff, the contact
that led to a meeting without attraction, and the good dance from which the
Founder withdrew without asking for contact. Every social encounter is in
Budapest; Thailand appears only as the journey he rapidly organizes and escapes
into afterwards. The board assigns neither national
character nor blame: it holds other people's boundaries beside the Founder's
own fear, imperfect reading of rooms and reverse-culture-shock experience.

### UK adventure and availability memory board

Use [prompts/uk-adventure-availability-memory-board.txt](uk-adventure-availability-memory-board.txt)
as a planning board only. Any place marked `CONFIRM` remains excluded from final
generation until the Founder recognizes it. The route is a contrast between a
constricted private life and a vast public world, not a tourism montage.

### Egypt six-day human-network memory board

Use [prompts/egypt-six-day-human-network-memory-board.txt](egypt-six-day-human-network-memory-board.txt)
to identify and confirm the post-London Egypt memories. Only the balloon landing
is currently preferred for the main three-second world burst; the full board is
archive and optional future-film material, not seven more shots in this film.

### Travel human-bridge memory boards

Use these as autobiographical planning/confirmation boards, primarily for the
second personal film. They are not permission to lengthen the current 2:48 cut:

- [India 2016 cash-discontinuity and Taj connection](india-2016-human-bridge-memory-board.txt);
- [Thailand/Cambodia paid handoffs and unsolicited kindness](thailand-cambodia-human-bridge-memory-board.txt);
- [Russia visa process and arrival kindness](russia-arrival-human-bridge-memory-board.txt).
- [European wonder and empty-capacity memories](europe-wonder-empty-capacity-memory-board.txt).
- [Central-European one-day bus trips and global/local event translation](central-europe-one-day-bus-localization-memory-board.txt).
- [Istanbul–Dubai hospitality and city contrast](istanbul-dubai-hospitality-memory-board.txt).

For the current S08 burst, only the reciprocal Taj Mahal bus conversation and
one Angkor tuk-tuk handoff are selected. Every `CONFIRM` field remains out of
location-labelled generation. These boards document why MyScoutee matters; they
must not claim that the product solves border, currency, transport or safety
problems.

### Illustrated travel-memory sheet

Generate one image at a time; never ask a model to merge these into a fake
geographic panorama.

```text
Create an illustrated travel memory plate of [CONFIRMED_PLACE] in the same
premium 2.5D painterly paper-world style as the film. Preserve the place's
recognizable architecture, terrain, weather and ordinary human scale without
tourism-poster saturation. This is a reconstructed memory, not archive footage.
Let one local driver, passenger, host, guide, vendor or resident open a real
human threshold, and let the environment reveal a different part of the Founder.
Global route, local encounter; no tourist conquest. No flags, national costume
shorthand, labels, logos, invented event or Founder unless explicitly attached.
Compose one bold silhouette or motion shape that can match-cut into
[NEXT_CONFIRMED_PLACE]. 9:16 portrait, mobile-safe, no text.
```

Approved production list: High Tatras, Schönbrunn, Neuschwanstein, Angkor Wat,
one separately chosen city/view from India's Golden Triangle, Norwegian
coast/mountain weather, one actual Italian/Portuguese/Spanish memory, and one
separately chosen Chesapeake/Ocean City/Niagara memory. The three-second cut can
use six to eight plates; the wider list stays available for variants.

### Event venue sheet

```text
Design [EVENT_VENUE], a credible public independent community and culture venue
that can recur in one local city, in the same premium 2.5D animated film style.
Visible entrance and easy exit, accessible route implied, quiet conversation
zone, six movable
chairs in a soft arc rather than opposing pairs, small shared tabletop map
activity, books, plants and acoustic panels, warm 3200–3500 K practical lights
with soft remaining daylight. Human scale, no luxury exclusivity, no dating-app
branding, no alcohol focus. Do not turn accessibility into a wheelchair resource
card. Provide empty wide, doorway, table, operator and detail plates with
identical geometry. No text or people.
```

### Product visual-grammar sheet

```text
Create one clean visual reference sheet for MyScoutee as a system that follows
the whole lifecycle of a relationship. Start with the human problem: flat
photo-first cards invite premature judgment before anyone meets, while an older
warm introduction carried a person, place or story in common. Do not idealize a
phone-free past; translate that missing shared context into privacy-preserving
modern design. Time is finite, so show a fast filter toward reciprocal human
context, never a fast verdict on human worth. Begin the product path with unknown individual and pair profile
suggestions. Use amber for one private editable 1–10 priority; a high explicit
priority may outweigh weaker automated/context signals but never another
person's consent. A faint people-in-common or inside/outside-network cue may add
context, but it is never a public rating, endorsement, character reference,
compatibility guarantee or safety guarantee. Use aqua for reciprocal/context
evidence, and coral for a balanced candidate group of exactly six strangers,
three women and three men, cast by plausible need rather than an age quota. The
working picture may lean toward the thirties, forties and fifties but can
naturally include an adult in their twenties or sixties. Give each a distinct
identity and expectation. Later-community background adults widen the mix of
ages and life stages organically while remaining distinct participants. Make
the group-first reason legible through several possible
conversations and one shared activity rather than one romantic winner: the
meeting can retain human value even if one pair does not continue. This is
design intent, not a measured outcome. Continue through calm accept/decline, contextual group chat,
first introductions, then a managed event with four blank resource cards:
members, transport, accommodation/venue and supplies. Keep tickets, check-in and
event-linked feedback as separate secondary actions. After that first
meeting, show the former strangers as known contacts who may be directly invited
again; Auto Inviter may fill one available place from the priority plan with a
new invited person who still decides independently. When an earlier invitee lacks
time for a planned activity, show a calm decline, an open place, then a different
adult accepting; never depict people as interchangeable tokens. Repeated events
begin to form community. The planner targets intended accepted capacity but
cannot guarantee that every place is filled. Close the lifecycle with a
later relationship change: one priority moves down privately and that pair's
future shared group/event path fades while other relationships continue. Human
faces and real meetings dominate; interface marks remain secondary, blank and
suitable for exact post-production graphics. No public scores, revenge,
punishment, soulmate graph, giant abstract affinity web, romantic pair
spotlight, readable text, logo or invented performance metric.
```

### Deployment package and voluntary local-operator network sheet

```text
Create [DEPLOYMENT_PACKAGE], a restrained prop and workspace reference for an
accountable technical handoff and voluntary operator network. Begin with a clean
blank area for an exact post-added `2016` notebook origin, three restrained
Budapest seasonal tabs for private creative work and route lines leaving and
returning. Budapest-cost financial independence opens bounded periods of
sustained attention that ordinary full-time employment would not leave. Do not
imply ten continuous development years or weekend spare-time construction.
Later AI assistance may accelerate module assembly, but must not appear
to invent or validate the product. Show no legal, tax, health-insurance or
administrative symbol. At a real small
Linux/server workstation, competent [OPERATOR_REF] verifies a compact encrypted
installation package, hardware key and deployment checklist before connecting
an independently hosted local core to an own-brand organizer workspace. Behind
that workstation, show several distinct local servers and community/cultural
test contexts cooperating around one coral shared core and the same unresolved
relationship-to-meeting problem. Each local deployment keeps its brand and
operational responsibility. One node has a clear opt-out route that remains
independently operable. Make shared leverage, local learning and voluntary
virtual-enterprise participation legible through actions, not labels. This is a
future operating model, not evidence of current deployments or proven efficiency.
Leave one exact, undistorted blank central plate at the shared network core for
post-production placement of the original repository
`myscoutee-frontend/src/assets/logo/heart.png`. Do not draw or approximate the logo. The
final composite may let its helmet-like shelter, guiding star and central heart
suggest protection, direction and human connection without claiming certified
safety.
The shared core may be globally reusable, but each local person, culture,
community and organizer shapes the actual meaning and test. Do not flatten local
palettes into one brand monoculture. Localization includes distance, place,
timing, transport, resources, language, venues and boundaries, not translation
alone. A newcomer may reuse the method after changing countries, but do not show
profiles, chats, contacts or private rate history automatically moving between
independent operators; that migration is later work.
No anonymous hands receiving copies, consumer gift box, cloud-company branding,
readable code/text, flags, country stereotype, sales transaction, centralized
merchant or hardware-shipping claim. Premium 2.5D animated-film style, deep navy
technical space, warm faces, restrained coral shared-core line, blank logo plate.
```

The exact product-sequence planning prompt is
[prompts/product-human-bridge-lifecycle-sequence.txt](product-human-bridge-lifecycle-sequence.txt).

## Negative/avoid block

If the platform has a separate negative-prompt field, paste this there. If it
does not, append it to the positive prompt under `Avoid:`.

```text
Avoid photoreal uncanny skin, plastic 3D, glossy corporate animation, Pixar or
Disney imitation, copied TSB character design, anime, influencer glamour,
beauty-filter face, changing identity, changing age, changing costume, extra
people, duplicate people, face morphing, asymmetrical eyes caused by artifacts,
extra fingers, fused hands, impossible joint motion, floating objects, lip
movement unless one short diegetic cue is explicitly requested, visible word
articulation during voice-over, several people visibly speaking at once, constant smiling,
melodramatic crying, anger toward women or men, sexualized framing, public human
ratings, app logos, transport logos, brand names, readable AI-generated text,
watermarked fake UI, identifiable employer, police raid, prison imagery,
invented travel country, flags or costumes as cultural shorthand, poverty
spectacle, oversaturated neon, extreme bokeh, frantic camera, rolling
shutter, low-shutter smear, flicker, exposure pumping and abrupt focus hunting.
```

## Motion prompting rule

Write only one primary subject action and one camera move per clip. Put micro-
expression after physical action. Example:

```text
The Founder turns from the train window, loosens his rust scarf and places the
cognac notebook on the table; his eyes remain tired but composed. Camera: a
single gentle 8% dolly in, 50 mm equivalent, locked horizon.
```

Do not write:

```text
He is lonely, sad, hopeful, frustrated, brave and inspired while the camera
orbits, zooms, cranes, rack-focuses and flies through London.
```

## Full-film prompt

- Active Google Flow/Veo 3.1 Lite handoff:
  [prompts/flow-agent-master.txt](flow-agent-master.txt)

Older OpenArt and Higgsfield masters remain inactive research artifacts. The
locked source of truth remains this directory; reject any AI rewrite that adds
product claims, romanticizes the Founder's isolation, blames a gender or turns
the operator invitation into a rescue appeal.
