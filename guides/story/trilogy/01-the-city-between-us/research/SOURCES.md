# Sources and evidence map

Checked: **2026-08-07**. Platform UI, model availability, credit cost and terms
change quickly; the account screen at generation time is authoritative. External
research supports the story framing, not MyScoutee performance claims.

## 1. MyScoutee source of truth

- [Repository README](../../../../../README.md): product north star — “platform behind
  meetings, not swipes,” completed mutually welcomed real-world meeting.
- [Project context](../../../../plans/roadmap/PROJECT_CONTEXT.md): scope, current state and
  product boundaries.
- [Product deck notes](../../../../pitches/PRODUCT_DECK_NOTES.md): priority, affinity,
  group/event workflow and claim discipline.
- [Network deck notes](../../../../pitches/DECK_NOTES.md): operator/network framing.
- [Operator roadmap](../../../../plans/roadmap/OPERATOR_NETWORK_ROADMAP.md): independent local
  operation and phased qualification.
- [StableGroupPlanner.java](../../../../../server/projects/profile/src/main/java/com/raxim/myscoutee/algo/StableGroupPlanner.java):
  graph group-candidate construction and local improvement.
- [AffinityCalculationService.java](../../../../../server/projects/profile/src/main/java/com/raxim/myscoutee/profile/service/AffinityCalculationService.java):
  weighted affinity implementation.
- [ActivitiesEventsController.java](../../../../../server/projects/profile/src/main/java/com/raxim/myscoutee/profile/controller/activities/ActivitiesEventsController.java),
  [ChatsController.java](../../../../../server/projects/profile/src/main/java/com/raxim/myscoutee/profile/controller/activities/ChatsController.java),
  [ActivitiesResourcesController.java](../../../../../server/projects/profile/src/main/java/com/raxim/myscoutee/profile/controller/activities/ActivitiesResourcesController.java):
  event/chat/resource operating surface.
- [DeploymentConfigurationController.java](../../../../../server/projects/profile/src/main/java/com/raxim/myscoutee/profile/controller/deployment/DeploymentConfigurationController.java)
  and operator controllers: branding/configuration/operator surface.
- [explanation-popup.component.ts](../../../../../frontend/src/app/shared/ui/components/explanation-popup/explanation-popup.component.ts)
  and [home.component.ts](../../../../../frontend/src/app/home/components/home/home.component.ts):
  current interface categories include Friends in Common, Inside Network and
  Outside Network. They support context wording, not endorsement or trust claims.
- [activity-invite-candidates.repository.ts](../../../../../frontend/src/app/shared/core/local/source/repositories/events/activity-invite-candidates.repository.ts)
  and [activity-members-seed.repository.ts](../../../../../frontend/src/app/shared/core/local/seed/repositories/events/activity-members-seed.repository.ts):
  retain meeting time/context for known contacts and invite candidates. The film
  may show “met at an event” context without inventing a reputation system.
- Original brand asset:
  [heart.png](../../../../../frontend/src/assets/logo/heart.png). The video must use
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
- [The Royal Parks — gardens in The Regent's Park & Primrose
  Hill](https://www.royalparks.org.uk/visit/parks/regents-park-primrose-hill/gardens):
  confirms the park's several public gardens. The Founder has confirmed
  Regent's Park as the outing location; the source does not verify the personal
  pizza memory or identify the exact garden/venue.
- [GoodGym](https://www.goodgym.org/): repeated activity/community example in
  the UK; not a dating service.
- [BAIS / We Move Budapest](https://www.wemovebudapest.com/join-our-team):
  community sport/volunteering example.
- [International Socializing in Budapest — Meetup](https://www.meetup.com/international-socializing-in-budapest/):
  example of accessible international social activity.

These sources show that doors into meeting exist. They do not prove why one
person's encounters succeeded or failed, and they are not listed in the VO.

### Unnamed friendship-centred event community

At the Founder's request, public story material does not name or brand this
Hungarian community and this evidence map omits its direct URL. Its public
introduction was reviewed on 7 August 2026. It describes a purpose broader than
dating: creating an open, friendly community through varied events, including
social gatherings, cultural clubs, excursions and formats that deliberately
mix strangers rather than preserve existing cliques. Its public material also
describes expansion beyond Budapest. These are the community's own statements,
not independent evidence of friendship, dating or inclusion outcomes.

Founder testimony supplies the personal connection: a former date first told
him about the community. After returning alone from London, he began attending
its events occasionally, though never regularly, and the community eased that
loneliness. He also attended hoping to find a partner. In the events he attended,
people arrived as singles, yet his own outcome was programs,
somewhere not to be alone, a few people he came to know, familiar faces,
acquaintances and friendship rather than a partner. Crowd size,
social caution and concern about group gossip are his possible explanations,
not verified causes. Public wording may preserve that path and the value of
friendship, but must omit the service name, marks, event titles, locations,
founding date, audience figures and any implied endorsement.

The Founder considers the community one source of inspiration but not the
origin of MyScoutee. He distinguishes its organizer-led local event culture
from MyScoutee's intended shared technical core and independently owned local
operator identities. This is a product-design distinction and scaling ambition,
not evidence that the unnamed community cannot expand or that MyScoutee will
scale successfully.

### Return and re-entry context

- [Szilasi, Fülöp and Nguyen Luu — Returning home: the decision to come home and
  the reintegration experiences of Hungarian adults
  (2025)](https://link.springer.com/article/10.1007/s12144-025-07924-7):
  qualitative interviews with Hungarian returnees and close contacts describe
  reintegration as a psychological and relational process, including continued
  cross-country comparison and nostalgia for the former host country.
- [Lados and Hegedűs — Return migration and identity change: A Hungarian case
  study
  (2019)](https://publicatio.bibl.u-szeged.hu/16218/1/Lados_Hegedus_2019_Return_migration_and_identity_change_a_Hungarian_case_study_Regional_Statistics_090109.pdf):
  places post-return stress, identity change and possible re-emigration inside
  Hungarian return-migration research.

These sources support the bounded use of `re-entry` or `reverse culture shock`
for the Founder's felt mismatch after returning. They do not verify his
nightlife memories and do not support a comparison of Hungarian and foreign
women, venues or national character.

### Budapest visual and foreign-currency-loan context

- [UNESCO — Budapest, including the Banks of the Danube, the Buda Castle
  Quarter and Andrássy Avenue](https://whc.unesco.org/en/list/400/): supports
  the film's presentation of Budapest as an outstanding, culturally layered
  urban landscape rather than a grey departure cliché.
- [Visit Hungary — Visegrád
  Citadel](https://visithungary.com/articles/visegrad-citadel): supports the
  Danube Bend and citadel view used as a nearby Budapest memory anchor.
- [Visit Hungary — Greater Budapest for
  explorers](https://visithungary.com/trip/greater-budapest-for-explorers---1-day):
  supports Gödöllő and other bounded Greater Budapest day-trip context.
- [Magyar Nemzeti Bank — debt-cap press release](https://www.mnb.hu/en/pressroom/press-releases/press-releases-2014/upper-limit-on-the-payment-to-income-ratio-protects-households-as-a-debt-cap):
  records the broader household debt-trap context associated with the buildup
  of foreign-currency loans from 2003 to 2008. It does not prove which loan the
  Founder would have taken; that avoided path remains personal counterfactual
  testimony.

### Pre-London United States assignment recognition

- [Destination DC — Adams
  Morgan](https://washington.org/dc-neighborhoods/adams-morgan): supports a
  culturally diverse, locally active and nightlife-oriented neighbourhood
  setting. It does not verify who approached the Founder or establish any
  general claim about women; that remains personal memory.
- [National Park Service — parks near
  cities](https://www.nps.gov/planyourvisit/cities.htm): places the Appalachian
  National Scenic Trail west of Washington, DC, and documents the close
  relationship between the eastern urban corridor and mountain/park routes.
- [National Park Service — mountain
  parks](https://www.nps.gov/subjects/mountains/explore.htm): supports the
  wooded Appalachian-ridge visual language. It does not prove which park the
  Founder visited.
- [Visit Maryland — amusement
  parks](https://www.visitmaryland.org/list/roller-coasters): confirms Ocean
  City amusement settings and Six Flags America as Maryland locations. The
  Founder confirms the Six Flags visit.
- [National Park Service — Appalachian Trail corridor
  map](https://www.nps.gov/appa/planyourvisit/upload/APPA_Map.pdf): shows the
  Appalachian corridor relative to New York, Pennsylvania, Maryland and
  Washington. It supports geography only, not a reconstructed itinerary.
- [National Park Service — Catoctin National Recreation
  Trail](https://home.nps.gov/cato/planyourvisit/catoctin-national-recreation-trail.htm):
  documents the mountain-ridge landscape west of Washington and Baltimore. It
  supplies geographic context only; the memoir does not assign the Indian
  Trail to a specific park.

The roughly four-to-five-month assignment, Baltimore-area hotel base,
company-rented car, Greyhound travel, Ocean City in Maryland, Virginia,
Philadelphia, Washington, New York, Niagara Falls, Amish country, Six Flags to
the east of the Washington–Baltimore corridor, a mountain-top Indian Trail
farther inland to the west and the New York-to-Baltimore “going home” feeling
are Founder testimony. The precise park, Amish settlement and hotel are not
needed by the story. Public
materials do not state visa or work-authorization details without documentary
and legal review.

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
- [Greenspace Information for Greater London — Mansfield
  Park](https://www.gigl.org.uk/sinc/wfbii01/): the park descends toward the Lea
  Valley and opens a wide view over the Chingford reservoirs; its grassland,
  scrub and trees support a varied bird population.
- [Lee Valley Regional Park Authority —
  environment](https://www.leevalleypark.org.uk/environment): the valley's
  reservoir and wetland mosaic includes SSSI, SPA and Ramsar protections and is
  especially important for breeding and wintering birds.
- [Waltham Forest — blue
  infrastructure](https://www.walthamforest.gov.uk/planning-and-building-control/green-and-blue-infrastructure-vision-and-strategy/rivers-waterways-and-flood-risk-mitigation/blue-infrastructure-how-it-helps-people-and-nature):
  the River Lea, reservoirs and wetlands form the water landscape along the
  borough's western edge.
- [David Morley Architects — Lee Valley Athletics
  Centre](https://davidmorleyarchitects.co.uk/projects/lee-valley-athletics-centre/):
  the nearby centre was a key London 2012 training facility. It may appear only
  as distant floodlights or an athletics horizon, never as an Olympic-ring logo
  or a false claim that the former home stood inside Olympic Park.
- [UK Government — 2012 Olympic press-conference
  transcript](https://www.gov.uk/government/news/transcript-international-olympic-committee-press-conference):
  official contemporary context for the Diamond Jubilee and Olympic summer as
  an extended national celebration. It belongs to the year after the Founder's
  2011 arrival and does not prove his personal experience.
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

### Return migration and age

- [Eurofound — Labour mobility within the EU: The impact of return
  migration](https://a.storyblok.com/f/279033/86106655bd/ef1243en.pdf): records
  mixed employer perceptions of returnees, including both valued foreign
  experience/language and stereotypes about expectations, failure or leaving
  again. It does not prove why any employer treated the Founder in a particular
  way.
- [OECD — Sustainable reintegration of returning
  migrants](https://www.oecd.org/content/dam/oecd/en/publications/reports/2020/10/sustainable-reintegration-of-returning-migrants_86be9bc5/5fee55b3-en.pdf):
  describes possible skill mismatch, overqualification, reservation-wage and
  weakened-social-capital barriers. These are possible mechanisms, not the
  Founder's diagnosed case.
- [Hungarian Geographical Bulletin — Returning home: An evaluation of Hungarian
  return migration](https://ojs.mtak.hu/index.php/hungeobull/article/view/595):
  supports a mixed Hungarian picture; highly skilled interviewees did not all
  report the same barriers. The film must not generalize exclusion.
- [European Commission — older people in the EU labour
  market](https://op.europa.eu/webpub/empl/lmwd-annual-review-report-2024/chapter3/the-labour-force-participation-and-employment.html):
  identifies age discrimination and stereotypes about adaptability, technical
  skills and trainability as labour-market barriers across the EU.
- [UOC — digital ageism on dating
  apps](https://www.uoc.edu/en/news/2024/digital-ageism-on-dating-apps): supports
  cautious depiction of age filtering and visibility in online dating, while
  warning that technology alone is not a simple solution.
- [Eurofound — keeping older workers engaged: Hungary](https://www.eurofound.europa.eu/en/publications/all/keeping-older-workers-engaged-country-report-hungary):
  country context only; it does not justify saying that ageism is uniquely
  Hungarian or absent abroad.

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
- [Visit Wales — Barmouth
  Beach](https://www.visitwales.com/attraction/beach/barmouth-beach-528111):
  supports the Founder-confirmed Barmouth location, low-tide walking, views
  toward Tremadog Bay and the route beside the Mawddach Estuary.
- [Barmouth Town Council — Water
  Safety](https://www.barmouthtowncouncil.gov.uk/water-safety): supports the
  harbour at the mouth of the Mawddach, the Cader Idris mountain view and the
  exposed low-tide sandbar. It does not verify the Founder's exact viewpoint.
- [VisitScotland — The Clyde
  Ride](https://www.visitscotland.com/info/tours/the-clyde-ride-4dd49b48):
  confirms Glasgow powerboat sightseeing on the River Clyde past bridges and
  industrial waterfront. It supports place identification, not the historical
  details of the Founder's trip.

### One-day organized-bus candidates from Budapest

- [LilaBusz — High Tatras Ice Dome and Štrbské
  Pleso](https://lilabus.hu/jegtemplom/): current example of a bounded Budapest
  day trip through Starý Smokovec/Hrebienok and Štrbské Pleso.
- [Alfa Tours — High Tatras hiking day](https://alfatours.hu/products/magas_tatra_bakancsos_tura):
  current example using Starý Smokovec/Tatranská Lomnica as departure-area
  anchors. It does not establish the Founder's exact historic route.
- [Advent Bécsben — one-day Vienna bus](https://www.adventbecsben.hu/): current
  example of Budapest–Vienna day-bus structure.
- [Rolitúra — one-day Semmering](https://rolitura.hu/utazas/semmering-egynapos-sieles-es-szankozas-ausztriaban/):
  current Budapest departure example. It remains a separate candidate and must
  not be merged with the confirmed Vienna, Klagenfurt or Mixnitz memories.
- [Schönbrunn Palace — official
  site](https://www.schoenbrunn.at/en/): confirms the Vienna palace and garden
  anchor without implying that every other Austrian memory occurred there.
- [Minimundus — official
  site](https://www.minimundus.at/en/): identifies the 1:25 miniature park.
- [Minimundus — location and
  arrival](https://www.minimundus.at/en/location-how-to-get-here/): places the
  park in Klagenfurt near Lake Wörthersee, not Vienna.
- [Styria tourism — Bärenschützklamm from
  Mixnitz](https://www.steiermark.com/en/Oststeiermark/Plan-your-holiday/Tours/Through-the-Barenschutzklamm-from-Mixnitz_tour_30999545):
  official route context for the separate gorge journey, including its wooden
  ladders, bridges and demanding climb.
- [Mai Szállás — Vintgar and Bled day trip](https://maiszallas.hu/akciok/orszagos/lelegzetelallito-tura-a-vintgar-szurdokban-es-romantikus-kiruccanas-bledre-termeszet-tortenelem-es-elmenyek-egyetlen-napba-suritve-buszos-utazas-tobb-idopontban-29-490-ft-ert):
  current bounded Slovenia example with a Budapest departure. The Founder has
  confirmed both Bled and Vintgar, remembers them as part of a circular walk and
  explicitly excluded Ljubljana.
- [Zagreb in a day — route example](https://valamerre.blog.hu/2019/08/30/zagrab_892):
  non-official recognition aid for Tomislav Square, Zrinjevac, Jelačić Square
  and blue trams. It is not proof of the Founder's trip and must not be used to
  imply a Zagreb city visit; he saw Zagreb only from the coach while in transit.
- [Ikarosz — Plitvice non-stop](https://www.ikarosz.hu/hu/1-napos-programok?tr=plitvice-non-stop4):
  evidence that a one-day Plitvice coach format exists, but the displayed
  departure context is not strong enough to prove the historic departure point.
  The Founder has independently confirmed Plitvice as the destination and Zagreb
  only as coach-window transit on the way there.

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
- [Earth Trekkers — driving between Aswan and
  Luxor](https://www.earthtrekkers.com/driving-between-aswan-and-luxor-how-to-visit-kom-ombo-edfu-esna/):
  estimates a little over three hours for the direct drive and roughly 245 km,
  5.75 hours of driving and 9.5 hours overall when Kom Ombo, Edfu and Esna are
  visited. This supports one long sightseeing day, not four days in transit.
- [Experience Egypt — Nubian
  culture](https://www.experienceegypt.eg/en/attraction-details/209/nubian-culture):
  locates Nubian villages on Elephantine Island and along the Nile, making
  Elephantine the strongest current candidate for the Founder's island view.
- [Experience Egypt — Abu Simbel and downstream Nubian
  temples](https://www.experienceegypt.eg/en/attraction-details/208/abu-simbel-the-nubian-temples-downstream):
  distinguishes the Great Temple of Ramesses II and the smaller Hathor/Nefertari
  temple. Confirm the exact visited views before use.

### First professional stay in Thiruvananthapuram / Trivandrum

- [Thiruvananthapuram District Administration — About
  District](https://trivandrum.nic.in/en/about-district/): identifies
  Thiruvananthapuram as also known as Trivandrum, Kerala's capital near the
  extreme south of India's west coast, with low coastal hills and the Arabian
  Sea along the district's western boundary. Its technology-sector description
  supplies period-compatible city context but does not identify the Founder's
  employer or workplace.
- [Kerala Tourism — Thiruvananthapuram
  district](https://www.keralatourism.org/districts/thiruvananthapuram/):
  supports the broad visual geography of the Arabian Sea to the west, the
  Western Ghats/highlands to the east and northeast, coastline, backwaters and
  varied beaches. Tourism material is a recognition source, not proof of the
  exact shoreline in the Founder's memory.
- [Thiruvananthapuram District Administration — Places of
  Interest](https://trivandrum.nic.in/en/places-of-interest/): confirms that
  coastal environments within the district range from prominent visitor sites
  to quieter beach and lake/sea settings. Do not default the personal memory to
  Kovalam, Shankumugham, Veli, Poovar or any other named place without visual or
  documentary confirmation.
- [Kerala State Planning Board — Economic Review
  2012](https://spb.kerala.gov.in/economic-review/ER2012/Chapter5/chapter05.html):
  provides period context for Trivandrum's established technology ecosystem.
  It does not establish that the Founder's anonymous Indian employer was based
  in Technopark.

The roughly six-week assignment, mixed Irish–Hungarian team, cornfield hiring
moment, practical English development and nearly tourist-free visited beach are
Founder testimony. “Practically no tourists” applies to one personal shoreline
experience, not to Thiruvananthapuram district or Kerala as a whole.

### India November 2016 and Golden Triangle

- [Travelmath's city-distance calculation](https://www.travelmath.com/distance/from/Thiruvananthapuram%2C%2BIndia/to/Agra%2C%2BIndia)
  and [MakeMyTrip's route summary](https://www.makemytrip.com/flights/trivandrum-agra-distance.html)
  place Thiruvananthapuram and Agra at roughly `2,070 km` apart in straight-line
  distance and roughly `2,600 km` by road. The public
  manuscript therefore uses the conservative phrase “more than two thousand
  kilometres,” not the Founder's approximate remembered figure of `1,000 km`.
  This supports geographic separation only; the five-day itinerary and motive
  to return as a tourist remain Founder testimony.

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

The exact Soho job, low-rise canal-side home near Mansfield Park, roughly
four-and-a-half-room layout, maximum of ten residents, one full bathroom, one
separate WC, flat roof with a Lee Valley view and shared bedroom remain
first-person founder testimony. The
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

- countryside small-producer ancestry and movement toward Budapest for work;
- loving running before university and entering races; the Founder's personal
  lesson that breathing, rhythm and endurance usually mattered more than
  natural genetic advantage; and one secondary-school race in which classmates
  caught his arms and tried to pull him back, yet he still finished first;
- completion of university in 2004 after studies combining economics,
  programming and mathematics; a delayed dissertation made 2005 the earliest
  possible diploma year, but one missing intermediate-level language
  certificate delayed actual receipt considerably longer;
- the first unsuccessful Budapest attempt after university: about one month in
  relatives' large house, the Founder's private feeling of being an imposition,
  work that did not match what he believed had been represented, return to his
  parents, and later one-day interview trips reimbursed by the employment
  centre;
- joining an anonymous Indian company in October 2005 after being hired while
  hoeing corn, then travelling almost immediately to Trivandrum for
  roughly a month and a half with an Irish and Hungarian team;
- beginning to learn practical English in Trivandrum, while English also formed
  the outstanding formal gate to collecting the diploma; the later examination
  and actual diploma-receipt dates remain unconfirmed, and this practical
  beginning is not a fluency claim;
- the Founder's memory of practically no tourists on the particular Trivandrum-
  area beach he visited; the exact shoreline remains unidentified;
- professional employment in Budapest alongside the Founder's feeling that work
  did not become a stable professional or social future;
- initial workers'-hostel residence in Budapest, late lockout and corridor
  sleep, an undisclosed summer-substitute private room, and return to the
  hostel's more predictable impersonal rules;
- a later ordinary shared flat with three separate, non-passage bedrooms and
  adequate personal space before the parents' help with a permanent flat;
- four pre-London Budapest relationship memories: a mutually warm but
  mistimed encounter with a woman from Debrecen while the Founder could not
  host her from the workers' hostel and while even a few-hour date required
  coordinating the Debrecen–Budapest journey, meeting place and return window;
  a spontaneous shopping-centre introduction
  that began with Chinese and Western astrology, whose lack of private space
  left Margaret Island as an available shared setting and whose later private
  health/family crisis is deliberately generalized; and a later online-dating
  single-night encounter in the three-bedroom flat that began with the
  Founder's feeling of being stereotyped; and another online introduction in
  which the woman wanted to continue getting to know him while he withdrew from
  fear of commitment. These remain anonymized first-person
  memories and do not establish the other people's intentions, diagnoses or
  inner accounts;
- during some visits home from London, the Founder used online dating in
  Budapest while concealing that he lived in London. He also met a former woman
  colleague whose sudden language of love and wish for a child felt to him more
  connected to motherhood than to knowing him. The concealment is the Founder's
  admitted action; the colleague's motive remains his interpretation and must
  never be narrated as her established inner truth;
- parents' help acquiring a flat and the Founder's personal interpretation that
  this kept him from taking a foreign-currency mortgage;
- working in the United States through an anonymous pre-London employer, the
  Founder's account that promised overtime followed extreme workload but the
  overtime payment did not arrive, and his decision to leave around September
  2010;
- blood in the Founder's stool first appearing during that period of extreme
  work pressure, which he personally associated with the pressure without a
  published medical diagnosis or independent causation finding;
- the roughly four-to-five-month United States stay, employer-arranged hotel on
  Baltimore's outskirts, company-rented car, Ocean City, Washington and Adams
  Morgan, Baltimore–New York Greyhound journey, Niagara Falls, Amish country,
  an amusement park, wooded western ridges/park landscapes and the return from
  New York toward Baltimore that first made the temporary base feel like home;
- the Adams Morgan memory that women smiled and sometimes initiated contact,
  preserved only as subjective social openness and never generalized;
- six and a half months without work, followed by a final Hungarian application
  at a small company that reached a fourth round with psychological testing but
  did not produce an offer; no employer or test is identified or judged here;
- move to London and work as a programmer in Soho;
- finding London work within two weeks despite weak English, then being able to
  converse only minimally with colleagues for almost three years;
- working at the same single London workplace throughout all five London years;
- home in north-east London reached by the Victoria line and onward travel,
  beside a Lee Valley canal near Mansfield Park;
- five years in a low-rise, flat-roofed, roughly four-and-a-half-room shared
  home with no more than ten adults at once: the Founder and up to nine other
  Hungarian flatmates, mostly men aged roughly 23–55;
- one full bathroom plus one separate WC, described by the founder as 1.5
  bathrooms, and a shared bedroom;
- a flatmate who had lost his gambling money swapped his bed/place with an
  acquaintance; a different snore revealed the unannounced resident change;
- the Founder's rough memory that many people around this Hungarian London
  household — perhaps roughly one in three — no longer wanted to return home,
  and that some felt happier in London despite crowded material conditions;
  this is not a measured percentage and must not be published as one;
- Soho group and farewell lunches being too expensive; the Founder still
  attending, studying the prices and watching colleagues eat while presenting
  “not hungry” as if it were a Hungarian habit; colleagues' surprise when he
  finally ordered food once or twice in the fourth or fifth year; reliance away
  from the table on muesli and two-litre milk bottles; and the direct connection
  between each avoided meal, his rising financial-independence chart and his
  fear of an early return;
- shared-bedroom rent savings paying for travel and accumulating until the
  Founder's December 2015 diagram showed financial independence at Budapest's
  much lower cost base; the parent-assisted Budapest flat stood empty throughout
  the five London years;
- the Founder never being financially independent in London: normal private
  London housing would erode the Budapest position, while permanent room-sharing
  was no longer a viable life; housing therefore becoming his “stop-loss” and a
  reason to return; no claim that the savings bought another home;
- London arrival in 2011 while the symptom remained present, inactive Hungarian
  public-health-insurance coverage and subsequent medical care in London; all
  clinical details remain private and no health-system verdict is made;
- the 2012 Diamond Jubilee and Olympic summer entering the London story in the
  following year; three early years of London wonder followed by a five-year
  realization about time and belonging;
- the December 2015 return with little explanation, the employer's offer to hear
  a complaint and the Founder's answer that the real reason was not the company;
- no Hungarian public-health-insurance re-registration from the December 2015
  return until 10 November 2018, longer travel, partner-seeking and private
  creative work during that interval, then re-registration and a renewed job
  search on 10 November 2018;
- the three-year interval was not a single settled withdrawal: the Founder
  considered returning to London after a short break, questioned whether coming
  home had been the right choice, tried to discover whether he could make life
  work differently in his homeland and blamed himself for having been unable to
  remain there before. The self-blame is testimony about his inner experience,
  not a finding that the earlier departure was his fault;
- the wider arc from the employer departure around September 2010 to 10 November
  2018 lasting roughly eight years. It was not continuous physical absence from
  Hungary: the Founder was there before London, during visits and after December
  2015. His statement that he “disappeared” describes institutional invisibility,
  not proven legal untraceability;
- Brexit intensifying the Founder's subjective sense of administrative distance;
  this does not establish that his location was impossible to verify;
- the office search for a farewell gift for a departing Polish man colleague,
  the Indian woman colleague's idea of what the Founder remembers as an
  artificial penis, something like a vibrator, and her shared purchase with the
  Founder in a Soho sex shop; the gift affectionately called the departing man
  “a fucking dick,” while the colleagues liked him and he understood the joke;
- a company pizza outing in the gardens of Regent's Park; and, in a separate
  Soho terrace memory, trying sushi, rushing into the women's lavatory to spit
  it out, then emerging relieved to see a beautiful woman smile and feeling for
  one comic instant that he could have married her immediately;
- a different Indian woman colleague in that London workplace once telling the
  Founder that he should write a novel; she is not the colleague from the
  farewell-gift memory;
- the one-pound overnight coach to Edinburgh, other passengers' sock smell,
  Loch Ness, Glasgow/Clyde powerboat and almost paying for a German tourist's
  child's ticket;
- the precisely completed but over-compressed five-person London–Manchester–
  Liverpool–Barmouth–Cardiff–London route in a rented car; two couples and the
  Founder travelled, the Founder organized the route but cannot drive, one
  travelling acquaintance drove as a companion rather than a hired driver,
  budget hotels supplied the accommodation, and the three-day route needed a
  fourth day to avoid the exhausting pace;
- the North Wales low-tide place, now identified by the Founder as Barmouth;
- most longer journeys being made alone and self-organized, with local drivers,
  hotels, agencies or organized excursions supplying bounded parts rather than
  owning the entire route;
- a six-day Egypt trip after the London homecoming, with the southern Nile
  itinerary self-organized through WhatsApp, one driver and local hotels; the
  earlier four-day memory refers, if retained, to the broader supported program,
  not four days driving from Aswan to Luxor;
- Cairo chronology beginning with an airport arrival around midnight, followed
  by arrival at Giza well before its 08:00 opening; while waiting outside, the
  Founder remembers police carrying steel shields ahead of him and stray dogs
  wandering behind;
- a night flight from Cairo to Aswan after Giza; Aswan airport some distance
  from the city; a stern guard high on what the Founder remembers as a tank or
  armoured vehicle beside a mounted gun at the city edge before dawn; and a
  police vehicle leading a convoy through the desert toward Abu Simbel;
- an Aswan hotel beside the Nile, a room experienced as a honeymoon suite
  without a partner and a view toward a beautiful Nubian island whose exact
  identity remains unconfirmed;
- one long sightseeing day by car from Aswan to Luxor with one driver, visiting
  Kom Ombo, Edfu and Esna in that geographic order; the Founder has confirmed
  all three stops;
- Cairo/Giza camel dispute: a price negotiated before the ride, followed by
  three camel handlers surrounding the Founder and demanding more afterward.
  He says a higher opening price would not itself have caused a complaint; the
  broken agreement and pressure were the problem. He did not know at the time
  that the total also exceeded posted guidance. A site manager and armed
  tourism-security officers initiated photo-based identification and a police-
  vehicle return rather than the Founder independently pursuing repayment.
  Asked for a figure, he named an amount by instinct; the remainder only later
  appeared roughly consistent with the guidance, and he mainly wanted the
  episode to end;
- Luxor West Bank hotel view toward the western necropolis landscape and across
  the Nile to Luxor's lights, with serious security nearby;
- Luxor balloon landing in a vegetable plot, some passengers leaving through a
  private home, and residents/crew/passengers cooperating around a fence;
- final-day Egyptian-pound constraint and a vase for the Founder's mother. The
  Founder—not the taxi driver—proposed that the purchase come from his remaining
  cash and that everything left become the airport fare. The driver accompanied
  him on foot between shops to help him bargain; damaged vases prompted them to
  leave the first shop. At a better shop, the driver helped negotiate, then held
  his head in his hands. The Founder told the vendor that he was bargaining at
  the driver's expense; the vendor laughed and ended the negotiation. Currency
  fear and the European comparison remain personal memory until trip-date
  confirmation;
- two separate security gates remembered at Luxor airport, followed by the
  two-connection Luxor → Cairo → Athens → Budapest flight home; the comparison
  with European airport experience remains personal observation;
- Cairo, Luxor, Aswan and Abu Simbel as confirmed journey stops; Edfu, Kom Ombo,
  Philae, Elephantine and the other specific monuments remain candidate visited
  places until the Founder confirms them;
- the earlier Cairo airport taxi shared with a Sudanese married couple, a playful
  mutually amused conversation and the couple's roof-stacked suitcases falling
  as the vehicle pulled away;
- a self-organized five-day November 2016 tourist trip via Dubai to see India's
  Golden Triangle, with one outbound-flight day, three days in a car with a
  WhatsApp-arranged driver and one return-flight day,
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
  and return to the airport around 16:00–17:00 are Founder-confirmed as one
  continuous sequence; only the exact Cambodian entry point and any unverified
  transport labels remain unnamed;
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
- the flat-roofed shared home's confirmed Mansfield Park/Lee Valley setting,
  roof access, canal-side position and view over reservoirs, wetlands and birds;
- nearly fifty visited countries and the named destination memories;
- the personal global/local interpretation that different environments became
  meaningful through local people and revealed different parts of the Founder;
- repeated one-day organized bus journeys from Budapest into the Slovak Tatras,
  Austria, Croatia and Slovenia; the High Tatras visit is Founder-confirmed,
  while Starý Smokovec, Hrebienok, Štrbské Pleso and Tatranská Lomnica remain
  recognition candidates rather than asserted stops;
- Croatia/Slovenia correction: Zagreb was only a coach-window transit view on
  the way to the Founder-confirmed Plitvice Lakes visit; Bled is
  Founder-confirmed together with Vintgar as a remembered circular walk;
  Ljubljana was not visited;
- separate family roots and cousins in the Slovak Ore Mountains; the cousins did
  not speak Hungarian, and the Founder met them once as a small child. This is
  not part of the later High Tatras coach-trip memory;
- separate Austrian memories include Vienna with Schönbrunn, Klagenfurt with
  Minimundus near Lake Wörthersee, and Bärenschützklamm from the Mixnitz area;
  exact historical coach itineraries and any additional Austrian trips remain
  `CONFIRM` rather than being combined into one route;
- return home to seek a partner;
- one of the first post-return Thursday nights in a public Budapest venue: a
  woman grimaced when the Founder approached; by Saturday he was organizing
  Thailand and left within days. Separate public-room memories include one
  separate woman exclaiming "Well, not you!" before he could speak, another
  contact leading to a meeting where the
  Founder felt no attraction, and a good dance after which he left without
  asking for contact and later wondered whether he had become frightened. These
  all happened in Budapest after the return. The first woman's reaction was one
  of the reasons he fled into travel so quickly and organized the Thailand
  journey. These are individual memories and self-reflection, not
  a national comparison;
- a recurring group forming through shared-interest events and remaining a
  friendship rather than becoming romance; the Founder considers that
  friendship an equally important human result, not failed dating;
- the unnamed friendship-centred event community was first mentioned by a
  former date; after returning alone from London, the Founder began attending
  occasionally, not regularly, and it eased that loneliness; he also sought a
  partner there, but personally found programs, acquaintances and friendship
  instead; it provided some inspiration but differs from his intended MyScoutee
  concept and scaling model; its name, founding date and identifying program
  details remain outside public materials;
- roughly three years of withdrawn creative work after returning, during which
  larger journeys continued and a possible return to London remained unresolved;
  Film 1 does not mention administrative status;
- Budapest-cost financial independence providing the sustained time needed for
  MyScoutee, which the Founder says could not have been built alongside ordinary
  full-time employment; the long calendar span is not ten continuous development
  years, and later AI assistance accelerated implementation;
- personal experience that age became a stronger early filter in work and
  partner-seeking and felt less pronounced abroad; this is testimony, not a
  comparative labour-market statistic;
- personal experiences with apps, events, dance and date locations;
- the MyScoutee idea originating in 2016, later AI assistance accelerating
  implementation, and the current need for product hardening, real-world pilots,
  distribution and partners;
- decision to focus on and build MyScoutee.

Film 1 contains no reference or foreshadowing concerning the Founder's later
legal, tax or court matter. That is a scope decision, not an omission to be
filled from external research. A future Film 2 may begin at the exact final
frame and will be reconstructed separately from primary documents and legal
review.

Before release the founder owns the final wording and should preserve evidence
for any identifiable or legally sensitive autobiographical statement.
