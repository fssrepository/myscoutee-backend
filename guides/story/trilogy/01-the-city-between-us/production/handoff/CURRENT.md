# MyScoutee Part I story package — compact session handoff

Updated: 2026-08-07

This is the resume point for a fresh **Part I narrative and production**
session. It is self-contained enough to avoid replaying the long chat. Load
detailed files only through the routes below.

## Scope

- Work only inside this part directory unless the user explicitly expands the
  task.
- Do not edit repository-level `AGENTS.md`, application code, QA handoffs,
  pitches or unrelated documentation.
- Preserve all pre-existing worktree changes. In particular, the current
  script, F45 review frame, slideshow render and slideshow build script already
  contain user-directed edits and must not be reset or overwritten blindly.

## Current film

- Working title: **The City Between Us**.
- Runtime: exactly 02:48.000; 720×1280, 9:16, constant 24 fps.
- Master language: English.
- Style: continuous mobile-first cinematic 2.5D journey, not a collection of
  unrelated scenes.
- `CP00` is the opening reference frame and `CP23` the deterministic branded end
  frame. Each interior checkpoint is both one interval's end and the next one's
  start, so a changed checkpoint normally requires only two adjacent motion
  intervals to be regenerated.
- The planned post-approval review animatic is
  `storyboard/animatics/myscoutee-storyboard-v01-checkpoint-hold-720x1280.mp4`:
  the 24 true
  CP00–CP23 boundaries, mostly held for roughly seven to eight seconds, total
  168 seconds at 720×1280 and 24 fps. It models the first/last-frame workflow
  without repeating a checkpoint every three seconds. Do not build it until the
  Founder has approved the book and synchronized prompts. The older `-3s-`
  render remains only as a superseded caption-review artifact.
- `assets/storyboard-rough/CP00.png`–`CP23.png` are planning checkpoints.
  CP00–CP22 use fictional identity placeholders; CP23 uses the real brand asset
  deterministically. `assets/storyboard-3s/F00.jpg`–`F55.jpg` are review frames,
  not additional generation checkpoints.

## Autobiographical truth lock

- The Founder comes from countryside small-producer roots and finished
  university in 2004 after studies combining economics, programming and
  mathematics. A delayed dissertation made 2005 the earliest possible diploma
  year, but one missing intermediate-level language certificate delayed actual
  receipt considerably longer; do not show an already issued diploma.
- Before university, he loved running and entered races. His personal lesson
  emphasizes breathing, rhythm and endurance over natural genetic advantage.
  In one secondary-school race, classmates caught his arms and tried to pull
  him back, yet he finished first. Keep this as an archive memory, not a universal
  sports-science claim, bullying spectacle or ninth opening panel.
- In October 2005, an anonymous Indian company hired him while he was hoeing
  corn and sent him almost immediately to Trivandrum for
  roughly six weeks with an Irish and Hungarian team. Practical English began
  there, but not fluency. The exact company, campus, later examination date and
  nearly tourist-free visited beach remain unidentified.
- While working in Budapest he first lived in a workers' hostel. Late returns
  could leave him locked out of the shared room and sleeping in the corridor.
  A later private room was an undisclosed summer substitution and became
  untenable when the previous social circle wanted it back. Anonymize the real
  street and people; show no legal accusation or identifiable antagonist.
- Before his parents helped him acquire a flat, he also lived in an ordinary
  shared flat with three separate, non-passage bedrooms. Anonymized pre-London
  relationship memories and later London-to-Budapest dating visits connect
  geography, housing, incomplete disclosure, commitment and premature judgment
  to the later product insight. Their full, privacy-safe form belongs
  in the public book and
  `prompts/budapest-before-london-relationship-memory-board.txt`, not as six
  extra beats in the 02:48 hero cut.
- He returned to the workers' hostel because impersonal, visible rules were more
  predictable than opaque personal acceptance. This is not a homelessness or
  poverty claim.
- His parents eventually helped him acquire a flat, which in his personal
  account also kept him out of the foreign-currency-mortgage path. The avoided
  loan is counterfactual context, not a claim of certain alternate history.
- Through his final pre-London employer he worked in the United States. In his
  account, promised overtime followed extreme workload but its payment did not
  arrive, so he left around September 2010. Six and a half months without work
  and a final four-round
  small-company interview with psychological testing but no offer followed.
  Keep all firms anonymous and make no legal finding.
- Blood in his stool first appeared during the American assignment's extreme
  work pressure. He associated the symptom with the pressure, but the project
  makes no diagnosis or independent causation claim. He left for London in 2011
  while still experiencing it; his Hungarian public-health-insurance coverage
  was no longer active, and he received medical care in London. Keep every
  clinical detail private and every visual non-graphic.
- The United States stay lasted roughly four or five months, based at an
  employer-arranged hotel on Baltimore's outskirts with a company-rented car.
  Preserve Ocean City, Washington/Adams Morgan, Baltimore–New York Greyhound
  travel, Niagara Falls, Amish country, an amusement park, wooded western
  ridges/park landscapes and the New York-to-Baltimore “going home” feeling as
  a non-binary dream under heavy work. Exact place candidates remain `CONFIRM`;
  public generation excludes visa/work-authorization detail pending review.
- His initial London living conditions felt better than the Budapest workers'
  hostel, and room rental felt like a more established entry route. Keep this
  distinct from the later HMO crowding and unmanageable London rental market.
- London saving was not used to buy another home. Shared-bedroom savings paid
  for travel and accumulated until a private December 2015 diagram showed
  financial independence at Budapest's much lower cost base. The flat his
  parents had helped provide before London had stood empty throughout the five
  London years. He was never financially independent in London: a normal private
  London home would erode the Budapest position, while continued room-sharing
  was no longer a viable life. Housing became his stop-loss and a reason to
  return.
- He found London work within two weeks despite weak English, worked as a
  programmer in Soho and took the Victoria line home to Tottenham. For almost
  three years he could barely converse with colleagues; professional competence
  and conversational isolation must remain visible together.
- He arrived in London in 2011. The 2012 Diamond Jubilee and Olympic summer enter
  the following year of the story. Soho's international colleagues, culture,
  nightlife and dates keep the first three years magical; the Victoria line is
  only a brief connection, not a long scene.
- Thirteen Hungarian adults — the Founder plus twelve Hungarian flatmates —
  lived in a maintained but crowded Victorian HMO: one full bathroom, one
  separate WC (the “1.5 bathrooms” shorthand), and a shared bedroom. London
  outside the house remains visibly multicultural.
- In the Founder's rough personal memory, many people around that household —
  perhaps roughly one in three — no longer wanted to return to Hungary, and some
  felt happier in London despite the material constraint. This is not a measured
  statistic: never display `30%`, universalize it or call anyone rootless.
- One flatmate who had lost his gambling money swapped his place with an
  acquaintance; a different snore revealed the unannounced resident change. The
  housing absurdity is the joke, never debt or the person.
- Personal adventure memories include the one-pound overnight coach to
  Edinburgh, Loch Ness, a Glasgow/Clyde powerboat and the exact but exhausting
  London–Manchester–Liverpool–Barmouth–Cardiff–London road circuit. Five people
  travelled: two couples and the Founder. He planned the route but cannot drive,
  so an acquaintance travelling as part of the group drove the rented car; this
  was not a hired driver. Budget hotels provided the accommodation along the
  route. The trip had three days; it needed a fourth to avoid a relentless pace.
  The Barmouth stop is locked at the Mawddach Estuary between mountains and sea.
- Soho group lunches were too expensive for his budget. He pretended not to be
  hungry, then ate muesli with milk after colleagues left, afraid costs would
  force an early return. This is hidden social and financial constraint, not a
  diet claim or criticism of colleagues.
- A different Indian woman colleague in the London office—not the colleague in
  the farewell-gift memory—once told him that he should write a novel. He worked
  at that same single London workplace throughout all five London years. The
  book may return to her advice in the epilogue: he did not write it then; he is
  writing it now.
- The company once took the team to eat pizza in the gardens of Regent's Park;
  the park is Founder-confirmed, while the exact garden/venue is unidentified.
  In a separate Soho-terrace memory, he tried sushi, rushed into the women's
  lavatory to spit it out and emerged relieved to see a beautiful woman smile;
  for one comic instant, he felt he could marry her. Keep the humour self-directed
  and do not turn the woman into a promised romance or sushi into an ethnic joke.
- Nearly forty countries did not automatically remove solitude. He returned
  home deliberately to make the achieved Budapest freedom livable and look for
  a partner.
- A former date told him about an unnamed Budapest friendship-centred event
  community whose identity is broader than dating and whose public philosophy
  uses varied programs and deliberate mixing to help strangers meet. After
  returning alone from London, he began attending occasionally, never regularly;
  the community eased that loneliness. It later expanded beyond one city. He
  also went there seeking a partner. In the events he attended,
  adults arrived as singles, yet for him it produced programs, acquaintances
  and friendship rather than a partner. It gave him somewhere to go, meant he
  did not always have to be alone and allowed him to get to know a few people;
  this is a real positive outcome. A large crowd, self-protection inside a
  recurring community and fear of gossip are possible explanations only. It
  gave some inspiration, but its organizer-led local event culture is not the
  MyScoutee concept or the same scaling model. Keep its name, branding, event
  titles, locations and scale figures out of all public material. Never claim
  nobody found a relationship there or that MyScoutee has proven superiority;
  never disclose or depict the community's founding date.
- One of his first post-return Thursday nights in a public Budapest venue
  produced a sharp re-entry-shock memory when a woman grimaced as he
  approached. By Saturday he was organizing Thailand and left within days. The
  Budapest reaction was one of the reasons for his rapid flight into travel;
  never stage the encounter in
  Thailand or generalize it to Hungarian women. Separate memories include a
  separate woman exclaiming "Well, not you!" before he could speak, a
  contact obtained from a woman surrounded by others followed by a meeting in
  which he felt no attraction, and a good dance from which he left without
  asking for contact because he may have become frightened. These memories
  preserve both external boundaries and his own missed action.
- Most journeys were made alone and self-organized. Helpers, hotels, drivers,
  agencies and organized excursions could carry bounded pieces, while the
  Founder assembled the route. This becomes MyScoutee's DIY-first, not DIY-only,
  event principle: full self-organization, partial provider help or a more fully
  organizer-managed plan. Do not claim a finished one-click agency workflow.
- From the December 2015 return until 10 November 2018, he did not re-register
  with the Hungarian public-health-insurance system, travelled on longer routes,
  looked for a partner and worked privately while feeling emotionally outside
  Hungarian society. On 10 November 2018 he re-registered and began looking for
  work, which he describes as giving Hungary a second chance. Brexit may appear
  only as part of his subjective sense of administrative separation, never as
  proof that his location could not be checked.
- The post-return three years were the final part of a wider, roughly eight-year
  experience running from the September 2010 employer departure to 10 November
  2018. He was not physically abroad throughout: he spent time in Hungary before
  London, during visits and after December 2015. “Disappeared” means felt
  institutional invisibility, never proven legal untraceability.
- Do not portray those three years as one clean decision to withdraw. He
  initially considered Budapest a short break before returning to London,
  repeatedly questioned whether coming home was right and had returned partly
  to discover whether he could make life work differently in his homeland. He
  blamed himself for having been unable to remain in his own country before;
  preserve this as inner conflict, not an objective assignment of fault.
- Budapest-cost financial independence is the time condition that made MyScoutee
  possible. The Founder says ordinary full-time employment would not have left
  enough sustained attention; without independence, even the necessary focused
  weeks would not have existed. Do not portray the long calendar span as ten
  continuous development years. Later AI accelerated implementation but did not
  originate or validate the product.
- The travel spine is **global route, local encounter**: local people make each
  environment meaningful, and the Founder recognizes different parts of himself
  through those encounters. The product mirrors this with one shared core and
  locally authored meaning; never use flags or a homogenized world map as proof.
- Repeated one-day organized bus memories from Budapest include the
  Founder-confirmed High Tatras visit, Austria, Croatia and Slovenia. The High
  Tatras visit itself is not `CONFIRM`; only its possible specific sights remain
  recognition candidates through
  `/home/raxim/workspace/myscoutee-backend/guides/story/trilogy/01-the-city-between-us/prompts/central-europe-one-day-bus-localization-memory-board.txt`.
- Keep the separate childhood family connection to the Slovak Ore Mountains out
  of the High Tatras trip: family roots and non-Hungarian-speaking cousins whom
  the Founder met only once as a small child. Do not invent continued contact.
- For Croatia and Slovenia, Zagreb is only a coach-window transit view on the
  route to the Founder-confirmed Plitvice Lakes destination. Bled is
  Founder-confirmed together with Vintgar; he remembers them as a circular walk.
  The Founder did not visit Ljubljana. Never generate a Zagreb walking tour or
  any Ljubljana imagery.
- The six-day Egypt trip happened after the London homecoming. S08 therefore
  folds thematic memory through the notebook; it must not imply false chronology.
  Only the communal Luxor balloon/vegetable-plot landing is selected for the
  main travel burst. The full Cairo–Luxor–Aswan–Abu Simbel account remains in
  `prompts/egypt-six-day-human-network-memory-board.txt`.
- In the Giza memory, the Founder negotiated the camel-ride price in advance.
  He reached Giza well before its 08:00 opening, only hours after the Cairo
  airport arrival around midnight; the airport-taxi scene must appear first in
  any chronological account. While waiting outside the closed entrance, police
  carrying steel shields stood ahead of him and stray dogs wandered behind.
  Keep this as observed atmosphere, not an invented conflict or threat.
  After the ride, three handlers surrounded him and demanded more; the broken
  agreement and pressure—not a high opening price—caused the conflict. He did
  not know the posted guidance, did not independently seek repayment and would
  not have returned without the manager and tourism-security officers taking
  the matter forward. He named a repayment figure by instinct and mainly wanted
  the episode to end.
- After Giza, he flew to Aswan at night. Before dawn, at the edge of the city,
  he remembers a stern guard high on a tank or armoured vehicle beside a mounted
  gun. A police car then led the desert convoy toward Abu Simbel. His Aswan hotel
  stood beside the Nile and looked toward a beautiful Nubian island; the room
  felt like a honeymoon suite without a partner. Keep the island unnamed until
  visually confirmed. He then travelled from Aswan to Luxor with one driver in
  one long sightseeing day, choosing the car for intermediate sights. Kom Ombo,
  Edfu and Esna are now Founder-confirmed visited stops in that geographic order.
  Do not turn the earlier four-day program memory into four days in transit.
- The Egypt route closes at Luxor airport with two separate remembered security
  gates, then two connections home: Luxor → Cairo → Athens → Budapest. Describe
  the extra layering as the Founder's experience, not a universal airport claim.
- On the last day, the Founder—not the taxi driver—proposed that a vase for his
  mother be paid from his remaining Egyptian pounds and that everything left
  become the airport fare. The driver accompanied him on foot between shops to
  help him bargain. They left the first because its vases were damaged and
  continued to a better shop. During the negotiation, the driver held his head
  in his hands. The Founder then told the vendor that he was bargaining at the
  driver's expense; the vendor laughed and ended the negotiation. Keep the
  driver's on-foot accompaniment as personal surprise, not a universal
  Europe/Egypt comparison.
- The Cairo airport-taxi encounter with the Sudanese married couple and falling
  roof luggage happens first, at around midnight, and is the first alternate
  Egypt frame. Do not add it as a ninth travel image; choose between it and the
  balloon after still testing.
- The India/Taj Mahal, Thailand/Cambodia and Russia arrival memories are now
  archived as human-bridge boards. Only the reciprocal Taj bus conversation and
  a restrained Angkor tuk-tuk handoff enter the current S08 plan. The Russia
  arrival airport and the Thai Phi Phi departure pier remain `CONFIRM`.
  Thailand was a two-and-a-half-to-three-week multi-region journey, not a brief
  stop; Pattaya was a personally neutral/less enjoyable beat, and Phuket is the
  `PROBABLE` large southern island remembered above Phi Phi. Russia was a
  several-day Moscow–Saint Petersburg journey.
- The compressed Cambodia sequence is Founder-confirmed: arrival around
  midnight, visa at an unnamed Cambodian entry point after a small payment
  request, continuation into Siem Reap, tuk-tuk negotiation, Angkor visit and
  return to the airport around 16:00–17:00. Do not mark the route itself
  `CONFIRM`; leave only the unidentified entry point and unsupported transport
  labels unnamed.
- The Italy, Paris, probable Norway in a Nutshell, Rotterdam ferry, Spanish
  hostel, four-day Porto–Lisbon, Istanbul–Dubai and Neuschwanstein memories form
  a candidate pool for the personal film. Do not expand the 2:48 hero cut for
  all of them. Test the empty
  ten-berth ferry cabin and empty beds as a visual alternative to one generic
  landscape plate.
- The flatmates and dates remain individual people, never faceless scenery or
  targets of blame.
- South Tottenham/Stamford Hill Charedi geography may be shown respectfully;
  the Founder's safety perception remains subjective and no religious community
  is credited with, blamed for or used to certify local safety.
- Brexit is temporal/emotional context about work and belonging, not a film
  claim that migrants displaced British workers or caused low wages.
- After returning, the Founder describes roughly three years of withdrawn
  creative work while larger travel continued and the possibility of returning
  to London remained unresolved. Film 1 shows only notebook, seasonal and route
  imagery; it contains no tax, health-insurance, legal or administrative detail.
- Age may appear as an early work/dating filter, but MyScoutee is not age-blind
  and does not claim to cure ageism. S18 is cast by plausible need, not an age
  quota. Its working picture may lean toward the thirties, forties and fifties,
  but adults in their twenties or sixties can fit naturally.
- The product idea dates to 2016. AI later accelerated implementation but did
  not originate or validate it. The ending asks local operators, pilot
  communities and product/venue/activity/travel/experience partners to shape and
  test the built core.

## Standalone-film boundary

Film 1 is a complete 02:48 MyScoutee product film. It contains no mention, hint,
symbol or sound connected to the Founder's later legal, tax or court matter.
Film 2 is future scope: it may inherit only Film 1's exact lossless final frame
and must be reconstructed separately from primary documents and legal review.
See `../../film/STANDALONE_FILM_AND_SEQUEL_BRIDGE.md`.

## Product lifecycle lock

Finite time requires a fast filter, but the filter narrows toward reciprocal
human context; it never issues a fast verdict on human worth. The product story
must keep this order:

1. a private, editable 1–10 priority for an unknown person or pair;
2. people-in-common or inside/outside-network cues may add grounded context but
   never public ratings, vouching, character references or guarantees;
3. reciprocal choices plus context propose a balanced group of exactly six
   distinct strangers: three women and three men; the group lowers the
   all-or-nothing pressure of one pair and leaves room for several conversations,
   a shared activity, friendship or a later invitation;
4. every invited person may accept or decline;
5. the accepted group receives contextual chat, then introduces itself in
   person and plans/manages its first real event;
6. the event uses four resource buckets — members, transport,
   accommodation/venue and supplies — while ticket, check-in and feedback stay
   separate;
7. after meeting, former strangers are known contacts who may be invited again;
8. when one person lacks time and declines, an open place may be offered through
   the priority plan, but the next invited adult decides independently; the
   design targets the intended accepted capacity and never guarantees a full
   group;
9. repeated meetings may grow a community — community is an outcome, not the
   starting state;
10. relationships can change: lowering a private priority after conflict makes
   another shared path less likely, without public punishment or reputation
   damage.

Do not reduce this to affinity graphics, matching or “community already
exists.” Do not claim measured speed, guaranteed chemistry, superior matching,
traction, revenue or solved loneliness.

The human thesis is **context before verdict**. The network can preserve a
person, place, event or acquaintance in common and make an introduction less
cold. It cannot promise that the person is safe, compatible or good. The same
six identities must visibly progress through the whole path; the old static
four-card tableau is rejected.

The acceptance thesis is equally bounded: people usually want to be seen as
whole humans rather than reduced to their first visible problem. A relationship
may continue through difficulty, but acceptance never means hiding essential
context, tolerating harm, abandoning safety or losing boundaries. MyScoutee can
create a faster real context for that free decision; it cannot manufacture the
decision or its outcome.

Localization means distance, place, timing, transport, resources, language,
culture, venues, boundaries and accountable local operation — not translation
alone. After a country change, the same group-first method can help a newcomer
build local context again. Current independent operator deployments do not
seamlessly carry profile, chat, contact or private-rate history between them;
identity migration is later roadmap work.

## Operator-model lock

Technically capable local operators may run the shared core on independent
servers under their own brands and cultural contexts. They test locally while
cooperating through a voluntary server network/virtual enterprise with real
opt-out. The point is a shared efficient path toward the same unsolved
relationship-to-meeting problem, while preserving local authorship. Present
this as an intended operator model, not a proven live deployment or revenue
claim.

The operator metaphor preserves the story's global/local truth: the shared core
is reusable, but local people, cultures, venues, boundaries and organizers
create its meaning. “Global” never means one imposed culture.

Composite the exact unmodified
`frontend/src/assets/logo/heart.png` at the common MyScoutee Network core in S22
and again in S23. Its helmet-like shelter, star and central heart may suggest
protection, direction and human connection, but are not a safety certification.

## Current editorial checkpoint

- `../../film/SCRIPT.md` is the working narrative lock for this animatic, not a
  final picture/release lock.
- The latest product passage says the app follows a relationship through its
  whole life; priority/context form strangers into a group; they accept, chat
  and manage the first event; later invitations and repetition can grow a
  community; changed priority affects future meeting chance.
- CP18–CP20 and F44–F50 now show exactly six distinct adults, three women and
  three men, moving from separate expectations through first introductions to
  a shared event plan.
- The captions now distinguish the four event resources — members, transport,
  accommodation/venue and supplies — from ticket, check-in and feedback.
- The current review should be judged for clarity and pacing before replacing
  more images. Do not regenerate the whole storyboard. If a story point fails,
  identify the smallest checkpoint and its two adjacent intervals.
- The current rendered slideshow predates the new S02–S07 London-density and
  S08 folded-time Egypt beat and S16–S22 human-context/capacity rewrite. Do not
  present it as the updated story; regenerate only the affected checkpoint
  frames after character lock, then rebuild the slideshow once.
- That eventual rebuild is endpoint-only. For every interval intended for an
  eight-second AI generation, show its approved first checkpoint for four
  seconds and its approved last checkpoint for four seconds. Do not add a still
  every three seconds and do not simulate motion with repeated crops. The video
  model supplies the movement once. Retiming against narration comes after the
  endpoint chain and character identities are approved.

## Current production decision

- Google AI Pro and OpenArt Essential are the selected monthly test entry
  points. The binding credit and upgrade gates are in
  `../../../../shared/production/planning/TWO_FILM_CREDIT_SAVER_PLAN.md`.
- In the user's Hungarian Flow UI the visible-watermark option can be disabled
  and was off by default; the already reviewed downloaded clip had no visible
  watermark. Flow may therefore supply final shots. Check the option before
  every generation and inspect every full downloaded clip before acceptance.
  Do not reopen this question from generic Google Help alone; check again only
  if the account UI, option state or an actual downloaded output changes.
- Character design now precedes the video benchmark. Run the identical
  reference-free six-person prompt from
  `../../../../shared/benchmarks/prompts/character-model-benchmark-six-person-ensemble.txt` in Codex, Flow
  and OpenArt, one output per model. The Codex control is already saved as
  `../../../../shared/benchmarks/assets/character-benchmark/character-ensemble-control-codex-v01.png`.
- Use the current 18 free OpenArt credits only when the displayed one-image cost
  is no more than 18. Record the results in
  `../../../../shared/benchmarks/tracking/CHARACTER_BENCHMARK_LOG.csv`.
- After choosing and locking all six identities, regenerate CP18 and CP19 from
  those exact character references. Only then run the 8-second Flow Lite, Fast
  and Quality video comparison for 130 credits.
- Record visible and charged cost plus the ten visual scores in
  `../../../../shared/benchmarks/tracking/MODEL_BENCHMARK_LOG.csv`.
- Final narration, one continuous score per film, foley, captions and export use
  the CPU FFmpeg route. Resolve is not required on this machine.

## Minimal context routing

Do not preload the full 2,500-line production pack.

- To review the present story and wording: read `../../film/SCRIPT.md`, then only
  the relevant Sxx section in `../../storyboard/STORYBOARD.md`.
- To verify product truth: read sections 1–2 of
  `../../../../shared/research/PRODUCT_AND_RESEARCH.md`.
- To change a checkpoint: read `CHECKPOINT_CHAIN.md`, the relevant storyboard
  section and `assets/storyboard-rough/README.md`.
- To change review captions or rebuild the slideshow: read only
  `scripts/build_checkpoint_slideshow.sh`.
- To prepare generator prompts after story approval: read the matching shot in
  `../../prompts/PROMPT_PACK.md` plus the selected platform workflow.

## Media and cleanup rule

Keep CP00–CP23, F00–F55 and the single selected 02:48 review MP4. Do not commit
discarded image variants, rejected renders, duplicate exports or backup videos.
Keep filenames stable when regenerating a checkpoint. Do not delete the current
selected asset before its replacement has been reviewed.

## Working behavior for a fresh session

- First report the loaded checkpoint briefly; do not bluff from general app
  knowledge.
- Before a long render or image generation, tell the user what is starting and
  report back regularly.
- Generate/edit checkpoint-sized units, not a large image pack.
- Do not run the slideshow builder unless content actually changed and the user
  wants a rebuilt review export.
- Do not buy/use a platform or generate production motion before the animatic
  story and identity references are approved.

## Next decision

Generation is paused by the Founder. Follow `../TODO.md`: synchronize the
English book, research boundaries and every generation prompt; rebuild the PDF;
wait for the Founder's complete read; apply corrections; and obtain explicit
narrative approval. Only then may the character benchmark, CP regeneration,
checkpoint-only slideshow, motion-model benchmark, final video, narration or
music work begin.
