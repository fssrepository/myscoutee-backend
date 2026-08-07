# Sources and evidence map

Checked: **2026-08-07**. Platform UI, model availability, credit cost and terms
change quickly; the account screen at generation time is authoritative. External
research supports the story framing, not MyScoutee performance claims.

## 1. MyScoutee source of truth

- [Repository README](../../../README.md): product north star — “platform behind
  meetings, not swipes,” completed mutually welcomed real-world meeting.
- [Project context](../../plans/PROJECT_CONTEXT.md): scope, current state and
  product boundaries.
- [Product deck notes](../../pitches/PRODUCT_DECK_NOTES.md): priority, affinity,
  group/event workflow and claim discipline.
- [Network deck notes](../../pitches/DECK_NOTES.md): operator/network framing.
- [Operator roadmap](../../plans/OPERATOR_NETWORK_ROADMAP.md): independent local
  operation and phased qualification.
- [StableGroupPlanner.java](../../../server/projects/profile/src/main/java/com/raxim/myscoutee/algo/StableGroupPlanner.java):
  graph group-candidate construction and local improvement.
- [AffinityCalculationService.java](../../../server/projects/profile/src/main/java/com/raxim/myscoutee/profile/service/AffinityCalculationService.java):
  weighted affinity implementation.
- [ActivitiesEventsController.java](../../../server/projects/profile/src/main/java/com/raxim/myscoutee/profile/controller/activities/ActivitiesEventsController.java),
  [ChatsController.java](../../../server/projects/profile/src/main/java/com/raxim/myscoutee/profile/controller/activities/ChatsController.java),
  [ActivitiesResourcesController.java](../../../server/projects/profile/src/main/java/com/raxim/myscoutee/profile/controller/activities/ActivitiesResourcesController.java):
  event/chat/resource operating surface.
- [DeploymentConfigurationController.java](../../../server/projects/profile/src/main/java/com/raxim/myscoutee/profile/controller/deployment/DeploymentConfigurationController.java)
  and operator controllers: branding/configuration/operator surface.
- [explanation-popup.component.ts](../../../frontend/src/app/shared/ui/components/explanation-popup/explanation-popup.component.ts)
  and [home.component.ts](../../../frontend/src/app/home/components/home/home.component.ts):
  current interface categories include Friends in Common, Inside Network and
  Outside Network. They support context wording, not endorsement or trust claims.
- [activity-invite-candidates.repository.ts](../../../frontend/src/app/shared/core/local/source/repositories/activity-invite-candidates.repository.ts)
  and [activity-members-seed.repository.ts](../../../frontend/src/app/shared/core/local/seed/repositories/activity-members-seed.repository.ts):
  retain meeting time/context for known contacts and invite candidates. The film
  may show “met at an event” context without inventing a reputation system.
- Original brand asset:
  [heart.png](../../../frontend/src/assets/logo/heart.png). The video must use
  this file unmodified; the product name stays editable text in post.

The code supports “built feature” wording where the truth matrix says built. It
does not establish users, revenue, relationship outcomes, safety improvement,
operator income or product-market fit.

## 2. Dating-app and attention research

- [Pew Research Center — The Virtues and Downsides of Online Dating
  (2020)](https://www.pewresearch.org/internet/2020/02/06/users-of-online-dating-platforms-experience-both-positive-and-negative-aspects-of-courtship-on-the-web/):
  U.S. users reported contrasting message-volume experiences. The research note
  uses 57% of recent male users reporting too few messages and 30% of recent
  female users reporting too many. These are U.S. survey perceptions, not a
  universal Tinder ratio.
- [Pew Research Center — From Looking for Love to Swiping the Field
  (2023 PDF)](https://www.pewresearch.org/internet/wp-content/uploads/sites/9/2023/01/PI_2023.02.02_Onilne-Dating_FINAL.pdf):
  positive outcomes coexist with unwanted behavior and scam concerns. This
  supports consent/moderation/public-venue imagery, not a MyScoutee safety claim.
- [Tyson et al. — A First Look at User Activity on Tinder
  (2016)](https://arxiv.org/abs/1607.01952): small curated-profile experiment in
  London/New York. It supports attention asymmetry as a mechanism, not the viral
  claim that “90% of men receive no matches.”
- [Dating-app burnout longitudinal study](https://journals.sagepub.com/doi/10.1177/14614448241286788):
  supports the possibility of increasing emotional exhaustion/perceived
  inefficacy among active users over time; never generalize to everyone.
- [Choice overload in online dating](https://www.tandfonline.com/doi/full/10.1080/15213269.2015.1121827):
  experimental comparison of larger and smaller profile sets.
- [Online dating and a rejection mindset](https://journals.sagepub.com/doi/10.1177/1948550619866189):
  supports the visual of faces becoming an unreadable stream. Effects depend on
  design and person.

No statistic is spoken in the film. The visual deliberately humanizes both
scarcity and overload.

## 3. Repeated activity, friendship and social infrastructure

- [Hall — How many hours does it take to make a friend?
  (2019)](https://journals.sagepub.com/doi/pdf/10.1177/0265407518761225):
  longitudinal/student-sample estimates show that friendship develops through
  substantial time together. This is not evidence that one group date works.
- [Community Development Journal — social infrastructure and
  friendship](https://academic.oup.com/cdj/article/60/2/267/7676417): shared
  places and repeated focus can support friendship formation. It supports venue,
  repetition and shared-task design, not guaranteed chemistry.

The film therefore says “a lower-pressure first context” and “designed to give
chemistry somewhere real to happen,” never “group dates solve dating.”

## 4. London and Budapest ways to meet

- [London City Hall — Loneliness in London](https://www.london.gov.uk/programmes-strategies/communities-and-social-justice/loneliness-london):
  treats loneliness as more than individual failure and emphasizes meaningful
  connection across difference.
- [London City Hall — Volunteering](https://www.london.gov.uk/programmes-strategies/volunteering):
  evidence that real-world civic routes exist.
- [GoodGym](https://www.goodgym.org/): repeated activity/community example in
  the UK; not a dating service.
- [BAIS / We Move Budapest](https://www.wemovebudapest.com/join-our-team):
  community sport/volunteering example.
- [International Socializing in Budapest — Meetup](https://www.meetup.com/international-socializing-in-budapest/):
  example of accessible international social activity.

These sources show that doors into meeting exist. They do not prove why one
person's encounters succeeded or failed, and they are not listed in the VO.

### London migration and shared-housing context

- [ONS — International migration and the changing nature of housing in
  England](https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/articles/internationalmigrationandthechangingnatureofhousinginenglandwhatdoestheavailableevidenceshow/latest):
  recent EU-born arrivals were heavily concentrated in private renting. This
  supports the housing context, not the founder's exact household details.
- [English Housing Survey 2021–22 — private rented
  sector](https://www.gov.uk/government/statistics/english-housing-survey-2021-to-2022-private-rented-sector/english-housing-survey-2021-to-2022-private-rented-sector):
  official tenure and London-overcrowding context.
- [Migration Observatory — Migrants and housing in the
  UK](https://migrationobservatory.ox.ac.uk/resources/briefings/migrants-and-housing-in-the-uk/):
  research synthesis on recent migrants, private renting and overcrowding.
- [Haringey Council — 2014 additional HMO licensing in
  Tottenham](https://www.minutes.haringey.gov.uk/mgAi.aspx?ID=35719):
  historical local context for houses in multiple occupation in Tottenham.
- [Haringey Council — HMO licensing](https://haringey.gov.uk/housing/private-sector-renting/property-licensing/house-multiple-occupation-hmo-licensing/do-i-need-an-hmo-licence):
  current local licensing overview. Do not infer the status of the founder's
  former house without an address, dates and records.
- [Haringey HMO standards](https://www.haringey.gov.uk/sites/default/files/2023-11/hmo_standards.pdf):
  current standards reference; it must not be projected backward as a legal
  finding about a historical, unidentified household.
- [UK Government — 2012 Olympic press-conference
  transcript](https://www.gov.uk/government/news/transcript-international-olympic-committee-press-conference):
  official contemporary context for the Diamond Jubilee and Olympic summer as
  an extended national celebration. It does not prove the Founder's experience.
- [Hackney Council — history of diverse
  communities](https://www.hackney.gov.uk/council-and-elections/equality-and-diversity/hackneys-demographics/history-hackneys-diverse-communities):
  locates the Orthodox Jewish community across northern Hackney and South
  Tottenham in Haringey.
- [Haringey Council — Jewish community needs
  assessment](https://haringey.gov.uk/sites/default/files/2024-04/jsna-jewish_needs.pdf):
  places main Haringey Jewish communities in South Tottenham and Seven Sisters,
  adjoining Stamford Hill. This supports geography only, not a safety claim.
- [Hackney Council — Stamford Hill Area Action Plan
  PDF](https://consultation.hackney.gov.uk/communications-engagement/shaap-regulation-19/user_uploads/stamford-hill-aap--reg-19---february-2024.pdf):
  describes Stamford Hill as home to the UK's largest Orthodox/Charedi Jewish
  community. Religious residents must not be used as exotic visual shorthand.
- [Migration Advisory Committee — EEA migration in the
  UK](https://www.gov.uk/government/publications/migration-advisory-committee-mac-report-eea-migration):
  official 2018 review found no clear overall employment/unemployment harm to
  UK-born workers; subgroup and wage effects were smaller and uncertain. The
  film therefore treats job displacement as Brexit-era debate, not established
  fact.
- [UK Parliament — ending free movement and low
  wages](https://www.parliament.uk/business/lords/media-centre/house-of-lords-media-notices/house-of-lords-media-notices-2017/march-2017/ending-free-movement-may-not-reduce-migration-or-fix-low-wages-lords-report-says/):
  parliamentary summary says the evidence did not support a quick low-wage or
  labour-shortage fix. It is a claim-discipline source, not political narration.

### UK journey-location candidates

- [Visit Manchester — official things to see and
  do](https://www.visitmanchester.com/things-to-see-and-do/): John Rylands
  Library, Manchester Cathedral, Manchester Art Gallery, the Whitworth and
  National Football Museum are candidate visual anchors only.
- [Visit Liverpool — official waterfront
  guide](https://www.visitliverpool.com/explore/liverpool-city-centre/waterfront/):
  Pier Head, the Three Graces, Royal Albert Dock and the Mersey are candidate
  visual anchors only.
- [Visit Cardiff — official city
  guide](https://www.visitcardiff.com/discover/): Cardiff Castle, Victorian
  arcades and Cardiff Bay are candidate anchors only.
- [Visit Conwy —
  Llanfairfechan](https://www.visitconwy.org.uk/explore/towns-and-villages/llanfairfechan/):
  a small Victorian seaside village with broad low-tide sands, sea in front and
  steep hills behind. It is the strongest current match to the Founder's memory,
  but remains unconfirmed.
- [Visit Wales — North Wales Coast
  Railway](https://www.visitwales.com/destinations/north-wales/things-do-along-north-wales-coast-railway-line):
  supports the coast-and-mountain corridor and the Conwy–Llanfairfechan route.
- [VisitScotland — The Clyde
  Ride](https://www.visitscotland.com/info/tours/the-clyde-ride-4dd49b48):
  confirms Glasgow powerboat sightseeing on the River Clyde past bridges and
  industrial waterfront. It supports place identification, not the historical
  details of the Founder's trip.

### Egypt location candidates

- [Experience Egypt — Giza and ancient
  wonders](https://www.experienceegypt.eg/en/attraction-details/290/giza-ancient-wonders):
  official context for the Giza Plateau, pyramids, Sphinx and camel rides. It
  does not verify the Founder's personal dispute.
- [UNESCO — Ancient Thebes with its
  Necropolis](https://whc.unesco.org/en/list/87): locates Karnak and Luxor
  temples on the east bank and the Valley of the Kings, Valley of the Queens and
  Deir el-Bahari on the west bank.
- [Experience Egypt — Ancient
  Aswan](https://www.experienceegypt.eg/en/attraction-details/210/ancient-aswan-):
  official route candidates include Philae, the Unfinished Obelisk, Kom Ombo
  and Edfu; Edfu lies roughly between Luxor and Aswan.
- [Experience Egypt — Nubian
  culture](https://www.experienceegypt.eg/en/attraction-details/209/nubian-culture):
  locates Nubian villages on Elephantine Island and along the Nile, making
  Elephantine the strongest current candidate for the Founder's island view.
- [Experience Egypt — Abu Simbel and downstream Nubian
  temples](https://www.experienceegypt.eg/en/attraction-details/208/abu-simbel-the-nubian-temples-downstream):
  distinguishes the Great Temple of Ramesses II and the smaller Hathor/Nefertari
  temple. Confirm the exact visited views before use.

### India November 2016 and Golden Triangle

- [Reserve Bank of India — withdrawal of legal-tender status for ₹500 and
  ₹1000 notes](https://systemhealth.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx_prid%3D38520%281%29.html):
  official 8 November 2016 notice that the existing notes would cease to be
  legal tender from 9 November. This supports the period setting, not every
  personal cash or queue experience.
- [Reserve Bank of India — public notice on bank/ATM closure and
  reconfiguration](https://www.rbi.org.in/commonman/english/Scripts/Notification.aspx?Id=1938):
  supports the temporary closure/reconfiguration context. Do not translate this
  into “all Indian cash disappeared.”
- [Incredible India —
  Agra](https://www.incredibleindia.gov.in/en/uttar-pradesh/agra): identifies
  Delhi, Agra and Jaipur as India's Golden Triangle and locates the Taj Mahal in
  Agra.
- [UNESCO — Taj
  Mahal](https://whc.unesco.org/en/list/252): architectural/location reference
  for a truthful Agra plate. It does not verify the Founder's bus encounter.

### Cambodia and Siem Reap

- [UNESCO —
  Angkor](https://whc.unesco.org/en/list/668/): location and architectural
  reference for the Angkor complex in Siem Reap Province.
- [Cambodian Ministry of Tourism — access to
  Cambodia](https://www.tourismcambodia.org/public/getting-to-cambodia/access-to-cambodia-1547804904):
  confirms that visa on arrival was an established process at international
  airports and border checkpoints, including access from Thailand toward Siem
  Reap. It does not verify the Founder's exact border, additional payment or
  travel schedule.
- [Cambodian Ministry of Tourism — Siem Reap
  Province](https://www.tourismcambodia.org/provinces/47/siem-reap): distinguishes
  Siem Reap city from the Angkor complex and supports the mixed hotel,
  restaurant, café and nightlife setting.
- [Cambodian Ministry of Tourism — Pub
  Street](https://www.tourismcambodia.org/public/provinces/search/detail/1588/pub-street):
  identifies the compact restaurant/bar/vendor district used only as an
  atmosphere reference, not as a copy of Washington's Adams Morgan.

### Thailand regional and Phi Phi candidates

- [Tourism Authority of Thailand —
  Bangkok](https://www.tourismthailand.org/Destinations/Provinces/bangkok/219):
  candidate anchors include Wat Phra Kaew, Wat Pho, Wat Arun, Golden Mountain
  and Chatuchak. These are a recognition list, not a visited list.
- [Tourism Authority of Thailand — Chiang
  Mai](https://www.tourismthailand.org/Destinations/Provinces/Chiang-Mai/101?pubDate=20250802):
  supports northern atmosphere candidates including Doi Suthep, Doi Inthanon,
  Tha Phae and mountain/Lanna context.
- [Tourism Authority of Thailand — West
  Thailand](https://www.tourismthailand.org/Destinations/West/6) and
  [Kanchanaburi](https://www.tourismthailand.org/Destinations/Provinces/Kanchanaburi/222):
  support the river, forest, waterfall and historical-infrastructure contrast,
  including Erawan and the River Khwae bridge.
- [Tourism Authority of Thailand —
  Pattaya](https://www.tourismthailand.org/Destinations/Provinces/Pattaya/469)
  and [Chon Buri–Pattaya candidate
  route](https://www.tourismthailand.org/Trip-Planner/Suggestion-Detail/chon-buri-pattaya-3-days):
  support the Gulf resort/entertainment atmosphere and recognition candidates
  such as Ko Lan, Jomtien and Sanctuary of Truth. The Founder's neutral reaction
  remains personal testimony.
- [Tourism Authority of Thailand —
  Phuket](https://www.tourismthailand.org/Destinations/Provinces/Phuket/350?pubDate=20250802):
  identifies Phuket as Thailand's largest island in the Andaman Sea.
- [Tourism Authority of Thailand — Phuket–Ko Phi Phi three-day
  route](https://www.tourismthailand.org/Trip-Planner/Suggestion-Detail/phuket-ko-phi-phi-3-days)
  and [Ko Phi
  Phi](https://www.tourismthailand.org/Destinations/Provinces/Ko-Phi-Phi/359):
  support a practical Phuket/Phi Phi pairing and distinguish Phi Phi Don and Phi
  Phi Le. Because Krabi is also an access side, Phuket is `PROBABLE` and the
  exact pier remains `CONFIRM`.

### Russia, Portugal and Istanbul–Dubai candidates

- [UNESCO — Kremlin and Red Square,
  Moscow](https://whc.unesco.org/en/list/545/): supports the Moscow candidate
  geometry and landmarks; it does not establish the Founder's exact itinerary.
- [UNESCO — Historic Centre of Saint
  Petersburg](https://whc.unesco.org/en/list/540/): supports the Neva, canal,
  bridge, embankment, Winter Palace and Admiralty recognition set.
- [Visit Portugal — Lisbon and Porto, two cities and two
  rivers](https://www.visitportugal.com/en/destinos/lisboa/255867): contrasts
  Lisbon/Tagus light, hills and historic neighbourhoods with Porto/Douro,
  Ribeira and granite heritage. Individual visits still require recognition.
- [GoTürkiye — Istanbul Grand
  Bazaar](https://goturkiye.com/istanbul/grand-bazaar): official context for
  carpets, bargaining and tea as intertwined market practices. It supports the
  scene's mixed hospitality/commercial context, not the intent of one merchant.
- [Visit Dubai — architecture and city
  layers](https://www.visitdubai.com/articles/architecture-in-dubai): supports
  the visual contrast between Dubai Creek/dhows/souks and the newer Sheikh Zayed
  Road/Burj Khalifa skyline.

The Russian arrival airport, bus operator and historical ticket system remain
`CONFIRM`; personal help must not be converted into transport policy.

### European route candidates

- [Fjord Tours — Norway in a
  Nutshell](https://www.fjordtours.com/en/norway/booking/tour/norway-in-a-nutshell):
  operator description of the coordinated Bergen Railway, Flåm Railway,
  Nærøyfjord cruise and bus journey. It supports the route candidate, not proof
  that this was the Founder's booking.
- [Visit Bergen — Bergen gateway to the
  fjords](https://en.visitbergen.com/things-to-do/norway-fjords/bergen-the-gateway-to-the-fjords-of-norway):
  gives the Bergen–Myrdal–Flåm–Gudvangen–Voss–Bergen order and notes that the
  self-guided legs are coordinated through an itinerary.
- [Visit Norway — Norway in a Nutshell
  listing](https://www.visitnorway.com/listings/norway-in-a-nutshell%C2%AE-fjord-tours/233737/):
  describes it as a highly popular round trip starting from Bergen, Voss, Flåm
  or Oslo. The production notes therefore mark it `PROBABLE`, not confirmed.
- [Trenitalia — Milan to Naples by
  Frecciarossa](https://www.trenitalia.com/it/frecciarossa/collegamenti-frecciarossa/viaggia-da-milano-a-napoli-con-frecciarossa.html):
  supports the current high-speed north–south spine only. Confirm the Founder's
  historic Bergamo connection, changes and intermediate stops separately.
- [Paris je t'aime — day trips from
  Paris](https://parisjetaime.com/eng/article/10-ideas-for-daytrips-from-paris-a1047):
  official tourism context for Versailles and wider day-trip directions.
- [Paris je t'aime — Disneyland Paris transport from
  Paris](https://parisjetaime.com/eng/article/disneyland-paris-a971): locates the
  RER-A/Marne-la-Vallée direction. Use only the visited historical park identity;
  do not import 2026 attractions into an older memory.

The exact Soho job, Tottenham location, thirteen residents, one full bathroom,
one separate WC and shared bedroom remain first-person founder testimony. The
film must not imply that all EU migrants lived this way.

## 5. Creative reference

- [Studio AKA — TSB: The Story](https://studioaka.co.uk/tsb-the-story/): official
  project page.
- [Creative Bloq — making of TSB: The Story](https://www.creativebloq.com/animation/tsb-story-9134665):
  production background on its long visual journey and mixed craft.

The usable inspiration is emotional continuity and crafted 2D/3D integration.
Do not copy TSB characters, rural environments, shots, palette, score or story.

## 6. OpenArt

- [OpenArt Pricing](https://openart.ai/pricing): current plans, credits,
  watermark/commercial-use card labels, indicative maximum output counts,
  add-on credits and select-model Unlimited/fair-use conditions.
- [OpenArt AI Video Generator](https://openart.ai/ai-video-generator/): current
  model/video surface overview.
- [OpenArt Kling 3.0](https://openart.ai/ai-model/kling-3-motion-control/):
  current identity, reference and motion-control positioning.
- [OpenArt Seedance 2.5](https://openart.ai/ai-model/seedance-2-5/): public model
  status; it showed Coming Soon at the check date, so the production baseline is
  Seedance 2.0 until the account UI confirms otherwise.
- [OpenArt Gemini Omni Flash](https://openart.ai/ai-model/gemini-omni-flash/)
  and [Nano Banana 2](https://openart.ai/ai-model/nano-banana-2/): current
  low-cost draft and image-model surfaces.
- [OpenArt Director guide](https://openart.ai/blog/how-to-use-openart-director/):
  Director/Ori, saved characters/worlds and story planning.
- [OpenArt Help](https://openart.ai/help): current feature/help entry point.
- [OpenArt Story](https://openart.ai/story): storyboard alternative if Director
  is unavailable.

The public surface supports the workflow logic. Always inspect the current model
card for aspect, duration, reference support, audio, credits and watermark.

## 7. Higgsfield

- [Higgsfield Pricing](https://higgsfield.ai/pricing): live, account/region
  authoritative checkout surface.
- [Higgsfield pricing-plan explanation](https://geo.higgsfield.ai/task/blog/understanding-higgsfield-ai-pricing-plans)
  and [regional price ranges](https://geo.higgsfield.ai/task/blog/higgsfield-ai-pricing-plans-1):
  official indicative examples only; billing and credits must be verified in
  the live checkout.
- [Higgsfield Seedance 2.0 Unlimited](https://geo.higgsfield.ai/task/blog/what-creators-get-seedance-unlimited-higgsfield):
  current cohort/plan-dependent 480p/720p unlimited conditions; it must not be
  assumed available until the account model picker shows the Unlimited badge.
- [Higgsfield Unlimited plan changes](https://geo.higgsfield.ai/task/blog/higgsfield-unlimited-plan-change):
  plan-included versus separately purchased, model-specific 1/7/14-day access.
- [Higgsfield cinematic video generator](https://higgsfield.ai/cinematic-video-generator):
  Cinema Studio/model overview.
- [Higgsfield Camera Controls](https://higgsfield.ai/camera-controls): named
  camera-control surface.
- [Higgsfield Kling 3.0 user guide](https://higgsfield.ai/blog/Kling-3.0-is-on-Higgsfield-User-Guide-AI-Video-Generation):
  current model workflow/capabilities.
- [Higgsfield Soul ID character consistency](https://higgsfield.ai/blog/sould-id-best-character-consistency):
  identity reference guidance. Use only authorized images.

Model labels and credit tiers can change; the guide deliberately says “current
best reference-capable model” when no permanent choice is safe.

## 8. Google Flow

- [Flow AI credits](https://support.google.com/flow/answer/16526234?hl=en):
  official monthly/daily allocations and per-output generation costs.
- [Google AI plans](https://one.google.com/intl/en/about/google-ai-plans/):
  plan benefits and current Flow credit tiers; checkout supplies local price.
- [Google AI Plus launch/pricing](https://blog.google/products-and-platforms/products/google-one/google-ai-plus-availability/):
  U.S. reference price and limited new-subscriber promotion, not a guaranteed
  local offer.
- [Create videos in Flow](https://support.google.com/flow/answer/16352836?hl=en):
  official model/mode overview.
- [Use Ingredients in Flow](https://support.google.com/flow/answer/16353334?hl=en):
  recurring reference workflow.
- [Use Frames and extend videos in Flow](https://support.google.com/flow/answer/16353333?hl=en):
  first/last-frame and extension workflow, access and watermark notes.

Check account/region eligibility, visible watermark, SynthID/provenance and
commercial terms before publication.

## 9. Final editing

- [DaVinci Resolve official product page](https://www.blackmagicdesign.com/products/davinciresolve/):
  free editor plus Edit/Fusion/Color/Fairlight/Deliver pages.
- [DaVinci Resolve Edit and subtitles](https://www.blackmagicdesign.com/products/davinciresolve/edit):
  official support for SRT/TTML/XML import, subtitle tracks and separate/burned
  output.
- [DaVinci Resolve 21 manual](https://www.blackmagicdesign.com/welcome/en/W-DRE-03):
  current official manual entry point.

The recommended 720×1280 master is a project decision for mobile distribution,
not a platform maximum. Higher resolution is only justified by a failed target-
phone/platform QA test.

## 10. Founder-supplied facts

These are not externally researched claims. They remain first-person testimony:

- difficulty finding work at home on which to build a future;
- move to London and work as a programmer in Soho;
- home in Tottenham near the Victoria line;
- five years in a converted Victorian HMO with thirteen adults: the Founder and
  twelve other Hungarian flatmates;
- one full bathroom plus one separate WC, described by the founder as 1.5
  bathrooms, and a shared bedroom;
- a flatmate who had lost his gambling money swapped his bed/place with an
  acquaintance; a different snore revealed the unannounced resident change;
- long days and saving on food to gain financial independence and time for his
  own work; the Founder already had a home, so earlier “future home/family”
  shorthand is superseded;
- arrival during the 2012 Diamond Jubilee and Olympic summer; three early years
  of London wonder followed by a five-year realization about time and belonging;
- the Indian woman colleague's costume-tail farewell idea for a departing Polish
  man colleague, and the shared Soho purchase;
- the one-pound overnight coach to Edinburgh, other passengers' sock smell,
  Loch Ness, Glasgow/Clyde powerboat and almost paying for a German tourist's
  child's ticket;
- the precisely completed but over-compressed London–Manchester–Liverpool–North
  Wales–Cardiff–London route because companions could not take one extra day;
- the unidentified North Wales low-tide village memory, with Llanfairfechan only
  a current candidate until visual confirmation;
- a six-day Egypt trip after the London homecoming, with four southern Nile days
  self-organized through WhatsApp, driver and local hotels;
- Cairo/Giza camel overcharge, help from a site manager and armed tourism-
  security officers, photo-based identification and a police-vehicle return to
  seek partial repayment;
- Luxor West Bank hotel view toward the western necropolis landscape and across
  the Nile to Luxor's lights, with serious security nearby;
- Luxor balloon landing in a vegetable plot, some passengers leaving through a
  private home, and residents/crew/passengers cooperating around a fence;
- final-day Egyptian-pound constraint, a souvenir for the Founder's mother and a
  taxi-driver proposal linking the bargained saving to the available airport
  fare; currency fear remains personal memory until trip date confirmation;
- Cairo, Luxor, Aswan and Abu Simbel as confirmed journey stops; Edfu, Kom Ombo,
  Philae, Elephantine and the other specific monuments remain candidate visited
  places until the Founder confirms them;
- the Cairo airport taxi shared with a Sudanese married couple, a playful
  mutually amused conversation and the couple's roof-stacked suitcases falling
  as the vehicle pulled away;
- a five-day November 2016 India trip via Dubai with roughly three ground days,
  a WhatsApp-coordinated driver, cash/entrance-payment friction during the
  ₹500/₹1000-note transition, and the Delhi–Agra–Jaipur Golden Triangle;
- the reciprocal Taj Mahal bus conversation with a young woman travelling with
  her grandfather, and the Founder's choice not to pursue it across distance;
- a roughly two-and-a-half-to-three-week Thailand journey across northern,
  western, eastern/Gulf and southern regions; Pattaya was personally neutral and
  less enjoyable, Phuket is the `PROBABLE` large island, and the exact Phi Phi
  departure pier remains `CONFIRM`;
- Thailand ride offers, the unpaid ride to that pier and the Founder's
  subjective sense that the helper had noticed a risky situation;
- the compressed Cambodia/Angkor excursion inside the wider Thailand journey,
  midnight Cambodia arrival,
  visa-on-arrival payment memory, Siem Reap tuk-tuk negotiation, Angkor visit
  and return to an airport around 16:00–17:00; exact route/border remain
  `CONFIRM`;
- the Budapest Russian-tourist-visa invitation and multi-office process, then a
  local passenger using a monthly pass to help at an unidentified arrival
  airport bus; the several-day trip connected Moscow and Saint Petersburg while
  airport and ticket rules remain `CONFIRM`;
- the Bergamo-to-Naples rail journey as the Founder's most beautiful trip, with
  exact changes/stops still `CONFIRM`;
- Paris explored as a compass through different day-trip directions, including
  Versailles and Disneyland Paris;
- a Bergen fjord/rail/bus circuit whose strongest current identification is
  Norway in a Nutshell, still `PROBABLE` pending visual recognition;
- a Rotterdam-bound ferry journey with an approximately ten-berth cabin occupied
  alone, a Spanish roughly three-bed hostel/university room occupied alone, a
  four-day Porto–Lisbon trip and the Neuschwanstein visit; exact operators and
  remaining routes stay `CONFIRM` where not stated;
- a five-to-six-day Istanbul–Dubai flight circuit and an Istanbul carpet/tea
  invitation that combined hospitality, craft presentation and commercial
  intent; exact shop, price, purchase outcome and city order remain `CONFIRM`;
- subjective memory of feeling safer in the immediate South Tottenham/Stamford
  Hill area and more exposed in nearby directions; never generalize causation;
- nearly forty visited countries and the named destination memories;
- return home to seek a partner;
- personal experiences with apps, events, dance and date locations;
- decision to focus on and build MyScoutee.

Before release the founder owns the final wording and should preserve evidence
for any identifiable or legally sensitive autobiographical statement.
