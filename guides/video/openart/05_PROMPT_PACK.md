# Prompt pack

All generation prompts are in English because the three target platforms
generally follow detailed visual direction more reliably in English. Dialogue
and titles remain in [03_SCRIPT_EN_HU.md](03_SCRIPT_EN_HU.md).

## Assembly rule

For an individual shot, paste in this order:

1. the contents of [prompts/continuity-prefix.txt](prompts/continuity-prefix.txt);
2. the relevant `SHOT Sxx` block from
   [prompts/shot-prompts.txt](prompts/shot-prompts.txt);
3. only the platform-specific control line described in the platform workflow.

Do not paste the full-film Director prompt into a single-shot generator. Do not
rewrite the founder description shot by shot. Consistency comes from stable
references, Elements/Characters/Ingredients, a stable continuity prefix, the
same costume tokens and conservative motion.

## Prompt tokens

Replace bracketed tokens only once in your working copy:

| Token | Replace with |
| --- | --- |
| `[FOUNDER_REF]` | saved OpenArt Character, Higgsfield Character Element/Soul ID, or Flow `@Founder` asset |
| `[MAYA_REF]` | saved Maya character/reference |
| `[DANCE_STUDENT_REF]` | saved dance-student character |
| `[DANCE_PARTNER_REF]` | saved partner character |
| `[OPERATOR_REF]` | saved technically capable, accountable local-operator character |
| `[BUDAPEST_WORLD]` | approved Budapest style/location reference |
| `[LONDON_WORLD]` | approved lived-London style/location reference |
| `[SOHO_OFFICE]` | approved modest Soho software-office reference |
| `[TOTTENHAM_HMO]` | approved Victorian HMO, bathroom and shared-room reference |
| `[DANCE_STUDIO]` | approved empty studio reference |
| `[EVENT_VENUE]` | approved venue reference |
| `[DEPLOYMENT_PACKAGE]` | approved install-package prop and operator-workspace reference |
| `[NOTEBOOK_PROP]` | approved cognac notebook reference |

When the platform supports `@` references, use the actual saved asset name in
the text. When it uses media tiles, attach the tile and keep the descriptive
name in the prompt.

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
film style: modest Soho software office, late Victoria line carriage without TfL
branding, wet Tottenham street, Victorian terrace, corner-shop glow and warm
independent community venue. Slate blue, rain green, sodium amber, tactile brick,
timber and fogged glass. Diverse everyday city, not Big Ben, red-bus or phone-box
tourism shorthand. Empty clean plates, wide/medium/detail views, no readable text
or logos.
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

### Tottenham Victorian HMO sheet

```text
Create [TOTTENHAM_HMO], one coherent converted Victorian house in Tottenham in
the same premium 2.5D animated style. Show a narrow hall, lived-in shared kitchen,
one full bathroom, one separate tiny WC, and a compact shared bedroom with two
clearly bounded sleeping/storage and desk zones. Shoes, coats, meals and personal
photographs imply thirteen distinct adult residents without lining them up.
Maintained but genuinely crowded, financially pragmatic and humane; never dirty,
homeless, luxurious, hostile or humiliating. Consistent wide, hall, bathroom,
WC, doorway and desk plates. No address, brands or readable text.
```

### Illustrated travel-memory sheet

Generate one image at a time; never ask a model to merge these into a fake
geographic panorama.

```text
Create an illustrated travel memory plate of [CONFIRMED_PLACE] in the same
premium 2.5D painterly paper-world style as the film. Preserve the place's
recognizable architecture, terrain, weather and ordinary human scale without
tourism-poster saturation. This is a reconstructed memory, not archive footage.
No flags, national costume shorthand, labels, logos, invented event or Founder
unless explicitly attached. Compose one bold silhouette or motion shape that can
match-cut into [NEXT_CONFIRMED_PLACE]. 9:16 portrait, mobile-safe, no text.
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
the whole lifecycle of a relationship. Begin with unknown individual and pair
profile suggestions. Use amber for one private editable 1–10 priority; a high
explicit priority may outweigh weaker automated/context signals but never
another person's consent. Use aqua for reciprocal/context evidence, and coral for a balanced candidate group of
exactly six strangers, three women and three men, each with a distinct identity
and expectation. Continue through calm accept/decline, contextual group chat,
first introductions, then a managed event with four blank resource cards:
members, transport, accommodation/venue and supplies. Keep tickets, check-in and
event-linked feedback as separate secondary actions. After that first
meeting, show the former strangers as known contacts who may be directly invited
again; Auto Inviter may fill one available place from the priority plan with a
new person. Repeated events begin to form community. Close the lifecycle with a
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
accountable technical handoff and voluntary operator network. At a real small
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
No anonymous hands receiving copies, consumer gift box, cloud-company branding,
readable code/text, flags, country stereotype, sales transaction, centralized
merchant or hardware-shipping claim. Premium 2.5D animated-film style, deep navy
technical space, warm faces, restrained coral shared-core line, no logo.
```

## Negative/avoid block

If the platform has a separate negative-prompt field, paste this there. If it
does not, append it to the positive prompt under `Avoid:`.

```text
Avoid photoreal uncanny skin, plastic 3D, glossy corporate animation, Pixar or
Disney imitation, copied TSB character design, anime, influencer glamour,
beauty-filter face, changing identity, changing age, changing costume, extra
people, duplicate people, face morphing, asymmetrical eyes caused by artifacts,
extra fingers, fused hands, impossible joint motion, floating objects, lip
movement unless dialogue is explicitly requested, constant smiling,
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

## Full-film prompts

- OpenArt Director: [prompts/openart-director-master.txt](prompts/openart-director-master.txt)
- Higgsfield Mr. Higgs: [prompts/higgsfield-mr-higgs-master.txt](prompts/higgsfield-mr-higgs-master.txt)
- Google Flow Agent: [prompts/flow-agent-master.txt](prompts/flow-agent-master.txt)

These prompts create a storyboard/plan. The locked source of truth remains this
directory; reject any AI rewrite that adds product claims, romanticizes the
founder's isolation, blames a gender or turns the operator invitation into a
rescue appeal.
