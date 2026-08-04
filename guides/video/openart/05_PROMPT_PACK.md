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
| `[OPERATOR_REF]` | saved local-operator character |
| `[BUDAPEST_WORLD]` | approved Budapest style/location reference |
| `[LONDON_WORLD]` | approved lived-London style/location reference |
| `[WORKSITE_WORLD]` | anonymous employer-free assignment/work-site reference |
| `[SHARED_ROOM]` | approved maintained London shared-room reference |
| `[DANCE_STUDIO]` | approved empty studio reference |
| `[EVENT_VENUE]` | approved venue reference |
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
adult, visually distinct and humane: dance student in teal practice top, her
friendly partner in rain coat carrying a folded umbrella, three diverse first-
date partners in ordinary smart-casual clothing, and a competent local community
operator with practical keys and a tablet/clipboard. Every person has realistic
body variation and subtle facial asymmetry. Nobody is glamorous, grotesque,
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
film style: wet Zone 2 or 3 Overground-like platform without TfL branding,
escalator, corner-shop glow, market queue, laundrette reflection, rainy side
street, late-night train carriage, clean compact shared bedroom with respectful
roommate boundaries, two storage/sleeping zones, suitcase under bed, packed-meal
shelf and one private notebook desk corner, plus a warm independent
community/culture venue. Slate blue, rain green, sodium amber, tactile stone and
fogged glass. Diverse everyday city, not Big Ben, red-bus or phone-box tourism
shorthand. Modest and maintained, never destitute. Empty clean plates,
wide/medium/detail views, no readable text or logos.
```

### Anonymous assignment work-site sheet

```text
Create [WORKSITE_WORLD], a deliberately unidentifiable overseas work environment
in the same premium 2.5D animated style: industrial/service corridor, locker,
translucent movable partition, anonymous loading/exterior fragments suitable for
Europe, Asia and the Americas without claiming a country. Practical believable
work equipment, fluorescent light, one quiet family-photo space. No company,
uniform logo, flag, readable safety notice, police, raid, villain or unsafe
instruction. Empty wide, medium and partition close-up plates with identical
geometry.
```

### Shared London room sheet

```text
Create [SHARED_ROOM], a compact clean London shared bedroom in the same premium
2.5D animated style: two clearly bounded sleeping or storage areas, suitcase
under one bed, packed-meal containers on a shelf, one narrow private desk corner
for a cognac notebook, overcast window, two warm bedside practicals, faded cream
walls. Financially pragmatic and cared for, with privacy boundaries; not dirty,
crowded beyond safety, homeless, luxurious or humiliating. Empty consistent
wide, doorway, desk and shelf plates. No people, brands or readable text.
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
in London, in the same premium 2.5D animated film style. Visible entrance and
easy exit, accessible route implied, quiet conversation zone, five movable
chairs in a soft arc rather than opposing pairs, small shared tabletop map
activity, books, plants and acoustic panels, warm 3200–3500 K practical lights
with soft remaining daylight. Human scale, no luxury exclusivity, no dating-app
branding, no alcohol focus. Provide empty wide, doorway, table, operator and
detail plates with identical geometry. No text or people.
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
