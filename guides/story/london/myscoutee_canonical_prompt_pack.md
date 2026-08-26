# MYSCOUTEE — CANONICAL PROMPT PACK v2.1 FINAL
## Rebuilt from the original 3×3 storyboard workflow — dedicated MEMORY WORLD references

> # ⚠️ OPERATOR PREFACE — DO NOT COPY THIS SECTION INTO ANY MODEL
> Everything before the **COPYABLE PROMPTS START** divider is HUMAN/OPERATOR documentation only.
> **Do not paste the IMPORTANT OPERATING RULE, Flow setting note, LOCKED SYSTEM, GENERATION ORDER, CANONICAL PHYSICAL WALK, filenames, attachment lists, or operator instructions into any generation prompt.**
>
> **VERY IMPORTANT — INPUT vs OUTPUT:** a filename shown in the operator guide is usually the **name you give the GENERATED RESULT AFTER the prompt creates it**. It is not automatically an existing input image. A file is an INPUT only when the guide explicitly says **ATTACH / INPUT REFERENCES**.
>
> Example: under CHARACTER 01 you paste the CHARACTER 01 code block with no references. The model generates an image. **That generated image is then saved/renamed as `C01_PROTAGONIST.png`.** Later sections may tell you to ATTACH `C01_PROTAGONIST.png`; only then does it become an input reference.
>
> The first text you actually paste into a generation model is the fenced `text` code block under **CHARACTER 01 — PROTAGONIST**. After that, for every asset, paste **only the fenced `text` code block belonging to that asset**.

**IMPORTANT OPERATING RULE:** every code block below is a separate generation request. Never paste a WORLD prompt together with a MAP prompt. Never paste multiple CHARACTER prompts together. The pack is deliberately repetitive so every prompt is independently copyable in Google Flow / Nano Banana and Higgsfield Cinema Studio.

**CRITICAL GOOGLE FLOW OUTPUT SETTING:** for every WORLD and STORYBOARD 3×3 generation, set **Image → Aspect ratio → 16:9 in the Google Flow UI BEFORE pressing Generate**. This is an output setting, not something the text prompt can reliably override. If Flow is set to 1:1, the model may produce a square canvas even when the prompt says 16:9. Do not generate these assets with the Flow aspect-ratio selector left at 1:1.

### OPERATOR NOTES — LOCKED SYSTEM — DO NOT COPY
- WORLD asset = exactly **one 16:9 widescreen canvas containing a 3×3 grid of 9 equal photographic cells**. Because the 16:9 canvas is divided equally into 3 columns and 3 rows, **each cell is also 16:9**, never square.
- WORLD image = **0 px outer margin**, image content touches all four canvas edges, only 1–2 px internal gutters.
- WORLD image = no title bar, no caption band, no legend, no decorative frame, no layout text. **In-world English/Hungarian signage is allowed and required.**
- MAP asset = **separate generation**; simple block-model production plan, not photorealistic, not Google Maps 3D, no legend/captions.
- CHARACTER asset = one image, 3 vertical panels: full-body front + full-body back + frontal headshot; seamless mid-grey studio background; no title/frame. CHARACTER 01–31 form the canonical main + memory identity library and are generated before MEMORY WORLDS.
- STORYBOARD asset = exactly **one 16:9 final canvas containing a 3×3 grid of 9 equal numbered cinematic frames**. Each individual frame is composed and cropped as a true **16:9 cinematic frame**; never square. 0 px outer margin.
- Physical present = **one uninterrupted exterior pedestrian walk** through the same impossible London–Budapest metropolis.
- The protagonist never physically enters the remembered office, shared house, police station, lawyer room, courtroom, foreign trip, or clinical room during the dream-city walk. Those are **literal memory events inside real reflective / transparent surfaces**.
- Dedicated **MEMORY WORLD references** are generated as clean visual source banks of the remembered places/events themselves. They are NOT windows and contain no present-city reflection layer. MAIN WORLD sheets establish the physical London–Budapest city and its real glass/wet surfaces; STORYBOARD / VIDEO generation then places the relevant MEMORY WORLD scene inside those existing surfaces.
- London supplies recognizable street geometry. Budapest/Hungary is not generic “Central Europe”: **explicit recognizable Pest/Budapest anchors, Hungarian signage and transport must remain visible.**
- The city is normal to everyone inside it. No fantasy glow, no dream filter, no cyberpunk.
- Memories are not chronological. **Memory edits without asking permission. Global route. Local encounter.**
- Score cards are not part of WORLD assets. They are added only in STORYBOARD / video generation.
- Clinical imagery appears only in the final block, immediately before the hard cut.
- Final runtime target = **3:20**: six ~30 s blocks + final ~20 s block.
- Final title = **MYSCOUTEE / THE PATH BETWEEN PEOPLE**.

### OPERATOR NOTES — GENERATION ORDER — DO NOT COPY
1. **CHARACTER 01–31** — complete main + memory-character identity library. Generate these first so MEMORY WORLD identities are stable from their first generation.
2. **MEMORY WORLD 01 — LONDON / SOCIAL / HOME / DATING**
3. **MEMORY WORLD 02 — GLOBAL ROUTES / HUMAN ENCOUNTERS**
4. **MEMORY WORLD 03 — WORK / ACCOUNTING / KATA / ADMIN**
5. **MEMORY WORLD 04 — POLICE / SEARCH / DEFENCE**
6. **MEMORY WORLD 05 — COURT / FILE / ASSETS / BLACK HUMOUR**
7. **MEMORY WORLD 06 — HUMANITY BREAKS THROUGH / RECURRING POSITIVE COUNTERMEMORIES**
8. **HIDDEN REALITY WORLD 07 — CLINICAL ROOM / FINAL REVEAL ONLY**
9. **WORLD 01–07** — physical London–Budapest location/environment continuity
10. **MAP 01–07** — separate spatial aids
11. **STORYBOARD 01–07** — 3×3 temporal boards, using MAIN WORLD + relevant MEMORY WORLD + exact CHARACTER references
12. **HIGGSFIELD AUDIO / SEED AUDIO 1.0** — generate and duration-validate the seven locked clean narration WAV files first. Use the same narrator voice preset and the same voice settings for all seven blocks.
13. **VIDEO GENERATION IN SEEDANCE 2.5** — supply the matching locked narration WAV as an audio reference. Seedance generates picture + ambience + foley/SFX + restrained score around that narration in the same video pass. Use MAIN WORLD as the physical present, the relevant MEMORY WORLD as literal memory content, the exact CHARACTER references for identified people, and STORYBOARD as ordered time.

The MEMORY WORLD images are generated once and reused. They show the remembered event/place DIRECTLY, as if the camera were physically inside that remembered scene. They contain NO London–Budapest present-city layer, NO window frame from the present, NO rain/reflection composite from the present and NO score cards.

Character-reference capacity is NOT treated as a scarcity constraint. Distinct planned memory participants receive distinct character sheets. Anonymous crowd/background extras may still remain unreferenced where their identity has no narrative continuity value.

### OPERATOR NOTES — CANONICAL PHYSICAL WALK — DO NOT COPY
WORLD 01: Soho → Piccadilly Circus → Coventry Street / Leicester Square → Haymarket / Trafalgar edge  
WORLD 02: Trafalgar / Charing Cross → Strand → Aldwych / Somerset House → Temple / Embankment entrance  
WORLD 03: Aldwych / Kingsway → Holborn → professional / office façades → Fleet Street edge  
WORLD 04: Fleet Street → Temple / Royal Courts exterior district → Ludgate / Blackfriars approach  
WORLD 05: Blackfriars north bank → Blackfriars Bridge → South Bank civic riverfront  
WORLD 06: South Bank westbound → Waterloo / London Eye zone → Westminster Bridge approach  
WORLD 07: Westminster Bridge → Parliament Square / Whitehall → quieter final street → dark-glass threshold

The geography is cinematically compressed but must always feel walkable.

---


## OPERATOR GUIDE — READ ONLY / DO NOT COPY INTO A MODEL

This section is the operating manual for the entire file. **Do not improvise between sections.** Every generation uses exactly ONE prompt code block from this file. The prose around a code block is an instruction to you; **paste only the contents inside the relevant `text` code block into the generation model.**

### ZERO-AMBIGUITY RULE — EVERY ASSET HAS INPUT → PROMPT → OUTPUT

Read every generation in this file as the same three-step pipeline:

**A. INPUT REFERENCES** — only files explicitly listed as `ATTACH` are uploaded as references. If the section says `none`, start from the text prompt only.

**B. COPY/PASTE PROMPT** — paste only the single fenced `text` code block for that asset. Never paste the filename list or this guide.

**C. GENERATED OUTPUT** — the model creates a new image/video. After generation, save or rename that result to the canonical filename shown in the guide. That filename is then used as a later reference asset.

So a line such as `CHARACTER 01 → C01_PROTAGONIST.png` means: **run the CHARACTER 01 prompt → receive a generated character sheet → save that generated sheet as `C01_PROTAGONIST.png`.** It does NOT mean that `C01_PROTAGONIST.png` already exists before you run the prompt.

Never paste CHARACTER + MEMORY WORLD + MAIN WORLD + STORYBOARD prompts together. They are separate generations. A reference image is attached as an image/reference; its old text prompt is **not** pasted again.

### ONE COMPLETE EXAMPLE — WHAT THE FILENAMES MEAN

**CHARACTER 01:**
`no input image` → paste CHARACTER 01 prompt → model generates a character sheet → save generated result as `C01_PROTAGONIST.png`.

**MEMORY WORLD 01 later:**
attach `C01_PROTAGONIST.png` + the other listed Cxx character sheets → paste MEMORY WORLD 01 prompt → model generates the 3×3 memory-world image → save generated result as `MW01_LONDON_SOCIAL.png`.

**STORYBOARD 01 later:**
attach `W01_MAIN_WORLD.png` + `MW01_LONDON_SOCIAL.png` + listed Cxx character sheets → paste STORYBOARD 01 prompt → model generates the 3×3 storyboard → save generated result as `SB01_STORYBOARD.png`.

**CINEMA BLOCK 01 finally:**
attach the already-generated W01 + SB01 + MW01 + Cxx files → bind them as the listed `@references` → paste the Cinema Block 01 video prompt → Seedance generates the video block.

### HOW TO READ EVERY LINE IN THE OPERATOR GUIDE

`ATTACH: filename.png` = this file must already exist and is an **INPUT**.

`GENERATED OUTPUT: filename.png` = this file does **not** exist yet; the current prompt will create an image/video, and you save that new result under this name.

`→ @ALIAS` = only for Cinema Studio/Seedance video generation: after attaching the existing file, bind/mention that uploaded reference with the shown `@` token inside the video prompt.

### PHASE A — CHARACTER LIBRARY

Generate CHARACTER 01 through CHARACTER 31 first.

- References to attach: **none**.
- UI: normal image generation; use one generation per CHARACTER heading.
- Copy: only the code block under that CHARACTER heading.
- **GENERATED OUTPUT:** after each prompt finishes, save/rename the NEWLY GENERATED character sheet using the canonical name below.

- CHARACTER 01 prompt → generated result → `C01_PROTAGONIST.png`
- CHARACTER 02 prompt → generated result → `C02_SOHO_WOMAN.png`
- CHARACTER 03 prompt → generated result → `C03_POLICEWOMAN.png`
- CHARACTER 04 prompt → generated result → `C04_APPOINTED_LAWYER.png`
- CHARACTER 05 prompt → generated result → `C05_FINAL_NURSE.png`
- CHARACTER 06 prompt → generated result → `C06_SHARED_HOUSE_SUBSTITUTE_SNORING_HOUSEMATE.png`
- CHARACTER 07 prompt → generated result → `C07_FX_MORTGAGE_HOUSEMATE.png`
- CHARACTER 08 prompt → generated result → `C08_FX_MORTGAGE_SPOUSE.png`
- CHARACTER 09 prompt → generated result → `C09_FX_MORTGAGE_CHILD.png`
- CHARACTER 10 prompt → generated result → `C10_BEGINNER_DANCE_WOMAN.png`
- CHARACTER 11 prompt → generated result → `C11_RUSSIAN_TRANSIT_PASSENGER.png`
- CHARACTER 12 prompt → generated result → `C12_AGRA_BUS_WOMAN.png`
- CHARACTER 13 prompt → generated result → `C13_SUDANESE_TRAVELER_MAN.png`
- CHARACTER 14 prompt → generated result → `C14_SUDANESE_TRAVELER_WOMAN.png`
- CHARACTER 15 prompt → generated result → `C15_CAIRO_TAXI_DRIVER.png`
- CHARACTER 16 prompt → generated result → `C16_BALLOON_LOCAL_HELPER_MAN.png`
- CHARACTER 17 prompt → generated result → `C17_BALLOON_LOCAL_HELPER_WOMAN.png`
- CHARACTER 18 prompt → generated result → `C18_BARMOUTH_ROAD_TRIP_DRIVER_COMPANION.png`
- CHARACTER 19 prompt → generated result → `C19_BARMOUTH_ROAD_TRIP_COMPANION_A.png`
- CHARACTER 20 prompt → generated result → `C20_BARMOUTH_ROAD_TRIP_COMPANION_B.png`
- CHARACTER 21 prompt → generated result → `C21_BARMOUTH_ROAD_TRIP_COMPANION_C.png`
- CHARACTER 22 prompt → generated result → `C22_ACCOUNTANT.png`
- CHARACTER 23 prompt → generated result → `C23_ADMIN_COLLEAGUE_A.png`
- CHARACTER 24 prompt → generated result → `C24_ADMIN_COLLEAGUE_B.png`
- CHARACTER 25 prompt → generated result → `C25_SEARCH_OFFICER_MALE.png`
- CHARACTER 26 prompt → generated result → `C26_DEFENCE_OFFICE_SUBSTITUTE.png`
- CHARACTER 27 prompt → generated result → `C27_JUDGE.png`
- CHARACTER 28 prompt → generated result → `C28_FORENSIC_EXPERT_A.png`
- CHARACTER 29 prompt → generated result → `C29_FORENSIC_EXPERT_B.png`
- CHARACTER 30 prompt → generated result → `C30_COURT_CLERK.png`
- CHARACTER 31 prompt → generated result → `C31_ANONYMOUS_FICTIONAL_POLITICAL_FIGURE.png`

### PHASE B — MEMORY WORLD LIBRARY

For every MEMORY WORLD / HIDDEN REALITY WORLD generation:

- Set **Image → Aspect ratio → 16:9** before Generate.
- Attach the character sheets listed below.
- Do **not** attach a MAIN WORLD, MAP or STORYBOARD.
- Copy only the code block under the matching MEMORY WORLD heading.

**MEMORY WORLD 01 — attach:** C01_PROTAGONIST.png, C02_SOHO_WOMAN.png, C06_SHARED_HOUSE_SUBSTITUTE_SNORING_HOUSEMATE.png, C07_FX_MORTGAGE_HOUSEMATE.png, C08_FX_MORTGAGE_SPOUSE.png, C09_FX_MORTGAGE_CHILD.png, C10_BEGINNER_DANCE_WOMAN.png  
**GENERATED OUTPUT:** save/rename the result as `MW01_LONDON_SOCIAL.png`.

**MEMORY WORLD 02 — attach:** C01_PROTAGONIST.png, C11_RUSSIAN_TRANSIT_PASSENGER.png, C12_AGRA_BUS_WOMAN.png, C13_SUDANESE_TRAVELER_MAN.png, C14_SUDANESE_TRAVELER_WOMAN.png, C15_CAIRO_TAXI_DRIVER.png, C16_BALLOON_LOCAL_HELPER_MAN.png, C17_BALLOON_LOCAL_HELPER_WOMAN.png, C18_BARMOUTH_ROAD_TRIP_DRIVER_COMPANION.png, C19_BARMOUTH_ROAD_TRIP_COMPANION_A.png, C20_BARMOUTH_ROAD_TRIP_COMPANION_B.png, C21_BARMOUTH_ROAD_TRIP_COMPANION_C.png  
**GENERATED OUTPUT:** save/rename the result as `MW02_GLOBAL_ROUTES.png`.

**MEMORY WORLD 03 — attach:** C01_PROTAGONIST.png, C22_ACCOUNTANT.png, C23_ADMIN_COLLEAGUE_A.png, C24_ADMIN_COLLEAGUE_B.png  
**GENERATED OUTPUT:** save/rename the result as `MW03_WORK_KATA_ADMIN.png`.

**MEMORY WORLD 04 — attach:** C01_PROTAGONIST.png, C03_POLICEWOMAN.png, C04_APPOINTED_LAWYER.png, C25_SEARCH_OFFICER_MALE.png, C26_DEFENCE_OFFICE_SUBSTITUTE.png  
**GENERATED OUTPUT:** save/rename the result as `MW04_POLICE_DEFENCE.png`.

**MEMORY WORLD 05 — attach:** C01_PROTAGONIST.png, C04_APPOINTED_LAWYER.png, C27_JUDGE.png, C28_FORENSIC_EXPERT_A.png, C29_FORENSIC_EXPERT_B.png, C30_COURT_CLERK.png, C31_ANONYMOUS_FICTIONAL_POLITICAL_FIGURE.png  
**GENERATED OUTPUT:** save/rename the result as `MW05_COURT_FILE.png`.

**MEMORY WORLD 06 — attach:** C01_PROTAGONIST.png, C02_SOHO_WOMAN.png, C03_POLICEWOMAN.png, C04_APPOINTED_LAWYER.png, C10_BEGINNER_DANCE_WOMAN.png, C11_RUSSIAN_TRANSIT_PASSENGER.png, C16_BALLOON_LOCAL_HELPER_MAN.png, C17_BALLOON_LOCAL_HELPER_WOMAN.png, C27_JUDGE.png, C28_FORENSIC_EXPERT_A.png, C29_FORENSIC_EXPERT_B.png  
**GENERATED OUTPUT:** save/rename the result as `MW06_HUMAN_COUNTERMEMORIES.png`.

**HIDDEN REALITY WORLD 07 — attach:** C01_PROTAGONIST.png, C05_FINAL_NURSE.png  
**GENERATED OUTPUT:** save/rename the result as `HRW07_CLINICAL_REALITY.png`. **Never attach this asset before STORYBOARD / VIDEO block 07.**

Canonical MEMORY filenames:

- MEMORY WORLD 01 → `MW01_LONDON_SOCIAL.png`
- MEMORY WORLD 02 → `MW02_GLOBAL_ROUTES.png`
- MEMORY WORLD 03 → `MW03_WORK_KATA_ADMIN.png`
- MEMORY WORLD 04 → `MW04_POLICE_DEFENCE.png`
- MEMORY WORLD 05 → `MW05_COURT_FILE.png`
- MEMORY WORLD 06 → `MW06_HUMAN_COUNTERMEMORIES.png`
- HIDDEN REALITY WORLD 07 → `HRW07_CLINICAL_REALITY.png`

### PHASE C — MAIN WORLD LIBRARY

Generate WORLD 01 through WORLD 07 after the MEMORY WORLD library exists, but **do not attach MEMORY WORLD images to these generations**. These sheets define only the physical London–Budapest present.

- Set **Image → Aspect ratio → 16:9**.
- References to attach: **none by default**.
- Copy only the code block under the matching WORLD heading.
- **GENERATED OUTPUT:** save/rename each NEWLY GENERATED world sheet as:

- WORLD 01 prompt → generated result → `W01_MAIN_WORLD.png`
- WORLD 02 prompt → generated result → `W02_MAIN_WORLD.png`
- WORLD 03 prompt → generated result → `W03_MAIN_WORLD.png`
- WORLD 04 prompt → generated result → `W04_MAIN_WORLD.png`
- WORLD 05 prompt → generated result → `W05_MAIN_WORLD.png`
- WORLD 06 prompt → generated result → `W06_MAIN_WORLD.png`
- WORLD 07 prompt → generated result → `W07_MAIN_WORLD.png`

### PHASE D — MAP LIBRARY

Generate each MAP separately. A MAP is a planning asset, never part of a WORLD prompt and never a memory source.

- References to attach: none.
- Copy only the code block under the matching MAP heading.
- **GENERATED OUTPUT:** save/rename each NEWLY GENERATED map as:

- MAP 01 prompt → generated result → `MAP01_WALK_PLAN.png`
- MAP 02 prompt → generated result → `MAP02_WALK_PLAN.png`
- MAP 03 prompt → generated result → `MAP03_WALK_PLAN.png`
- MAP 04 prompt → generated result → `MAP04_WALK_PLAN.png`
- MAP 05 prompt → generated result → `MAP05_WALK_PLAN.png`
- MAP 06 prompt → generated result → `MAP06_WALK_PLAN.png`
- MAP 07 prompt → generated result → `MAP07_WALK_PLAN.png`

### PHASE E — STORYBOARD LIBRARY

For every STORYBOARD generation:

- Set **Image → Aspect ratio → 16:9**.
- Attach the exact MAIN WORLD for that block.
- Attach the listed MEMORY WORLD(s).
- Attach all listed CHARACTER references.
- MAP is optional and normally **not attached** unless you are troubleshooting route continuity.
- Copy only the code block under the matching STORYBOARD heading.

**STORYBOARD 01 — attach:** `W01_MAIN_WORLD.png`, `MW01_LONDON_SOCIAL.png`, `C01_PROTAGONIST.png`, `C02_SOHO_WOMAN.png`, `C06_SHARED_HOUSE_SUBSTITUTE_SNORING_HOUSEMATE.png`, `C07_FX_MORTGAGE_HOUSEMATE.png`, `C08_FX_MORTGAGE_SPOUSE.png`, `C09_FX_MORTGAGE_CHILD.png`. **GENERATED OUTPUT:** save/rename the result as `SB01_STORYBOARD.png`.

**STORYBOARD 02 — attach:** `W02_MAIN_WORLD.png`, `MW02_GLOBAL_ROUTES.png`, `MW01_LONDON_SOCIAL.png`, `C01_PROTAGONIST.png`, `C10_BEGINNER_DANCE_WOMAN.png`, `C11_RUSSIAN_TRANSIT_PASSENGER.png`, `C12_AGRA_BUS_WOMAN.png`, `C13_SUDANESE_TRAVELER_MAN.png`, `C14_SUDANESE_TRAVELER_WOMAN.png`, `C15_CAIRO_TAXI_DRIVER.png`, `C16_BALLOON_LOCAL_HELPER_MAN.png`, `C17_BALLOON_LOCAL_HELPER_WOMAN.png`, `C18_BARMOUTH_ROAD_TRIP_DRIVER_COMPANION.png`, `C19_BARMOUTH_ROAD_TRIP_COMPANION_A.png`, `C20_BARMOUTH_ROAD_TRIP_COMPANION_B.png`, `C21_BARMOUTH_ROAD_TRIP_COMPANION_C.png`. **GENERATED OUTPUT:** save/rename the result as `SB02_STORYBOARD.png`.

**STORYBOARD 03 — attach:** `W03_MAIN_WORLD.png`, `MW03_WORK_KATA_ADMIN.png`, `C01_PROTAGONIST.png`, `C22_ACCOUNTANT.png`, `C23_ADMIN_COLLEAGUE_A.png`, `C24_ADMIN_COLLEAGUE_B.png`. **GENERATED OUTPUT:** save/rename the result as `SB03_STORYBOARD.png`.

**STORYBOARD 04 — attach:** `W04_MAIN_WORLD.png`, `MW04_POLICE_DEFENCE.png`, `C01_PROTAGONIST.png`, `C03_POLICEWOMAN.png`, `C04_APPOINTED_LAWYER.png`, `C25_SEARCH_OFFICER_MALE.png`, `C26_DEFENCE_OFFICE_SUBSTITUTE.png`. **GENERATED OUTPUT:** save/rename the result as `SB04_STORYBOARD.png`.

**STORYBOARD 05 — attach:** `W05_MAIN_WORLD.png`, `MW05_COURT_FILE.png`, `C01_PROTAGONIST.png`, `C04_APPOINTED_LAWYER.png`, `C27_JUDGE.png`, `C28_FORENSIC_EXPERT_A.png`, `C29_FORENSIC_EXPERT_B.png`, `C30_COURT_CLERK.png`, `C31_ANONYMOUS_FICTIONAL_POLITICAL_FIGURE.png`. **GENERATED OUTPUT:** save/rename the result as `SB05_STORYBOARD.png`.

**STORYBOARD 06 — attach:** `W06_MAIN_WORLD.png`, `MW06_HUMAN_COUNTERMEMORIES.png`, `C01_PROTAGONIST.png`, `C02_SOHO_WOMAN.png`, `C03_POLICEWOMAN.png`, `C04_APPOINTED_LAWYER.png`, `C10_BEGINNER_DANCE_WOMAN.png`, `C11_RUSSIAN_TRANSIT_PASSENGER.png`, `C16_BALLOON_LOCAL_HELPER_MAN.png`, `C17_BALLOON_LOCAL_HELPER_WOMAN.png`, `C27_JUDGE.png`, `C28_FORENSIC_EXPERT_A.png`, `C29_FORENSIC_EXPERT_B.png`. **GENERATED OUTPUT:** save/rename the result as `SB06_STORYBOARD.png`.

**STORYBOARD 07 — attach:** `W07_MAIN_WORLD.png`, `HRW07_CLINICAL_REALITY.png`, `C01_PROTAGONIST.png`, `C05_FINAL_NURSE.png`. **GENERATED OUTPUT:** save/rename the result as `SB07_STORYBOARD.png`.

Canonical STORYBOARD filenames:

- STORYBOARD 01 → `SB01_STORYBOARD.png`
- STORYBOARD 02 → `SB02_STORYBOARD.png`
- STORYBOARD 03 → `SB03_STORYBOARD.png`
- STORYBOARD 04 → `SB04_STORYBOARD.png`
- STORYBOARD 05 → `SB05_STORYBOARD.png`
- STORYBOARD 06 → `SB06_STORYBOARD.png`
- STORYBOARD 07 → `SB07_STORYBOARD.png`

### PHASE F — HIGGSFIELD AUDIO — LOCKED NARRATION GENERATION

This is the **PRIMARY audio workflow** for this pack.

The narration is generated FIRST inside Higgsfield, then supplied to Seedance 2.5 as an **audio reference**. This is more reliable than asking seven separate Seedance video generations to invent the same narrator voice again.

**IMPORTANT SEPARATION OF JOBS:**
- **Higgsfield Audio / Seed Audio 1.0 = narration only.**
- **Seedance 2.5 = picture + ambience + foley/SFX + restrained score, built around the already-generated narration reference.**
- Do NOT ask the TTS model to generate rain, traffic, music or SFX. The narration file is intentionally clean.

**VOICE LOCK — DO THIS ONCE AND KEEP IT FOR ALL 7 NARRATION FILES:**
1. Open Higgsfield Audio / Text-to-Speech and select **Seed Audio 1.0**.
2. Choose ONE English-speaking adult male voice preset and never change it between blocks.
3. Target delivery: around 40, low-to-mid register, intelligent, restrained, slightly tired, intimate, reflective, fluent English, at most a very light Hungarian/Central-European accent.
4. Avoid trailer-announcer energy, advertising delivery, melodrama, whisper-ASMR and exaggerated sadness.
5. Start every narration with the same speed / pitch / expression settings. Keep voice preset, pitch and expression locked. Only `speech_rate` may be adjusted minimally for an individual block if that take fails the duration gate below.
6. Prefer WAV / 48 kHz if the UI offers it.

**NARRATION DURATION ACCEPTANCE GATE — MUST PASS BEFORE CINEMA STUDIO:**
- `A01_NARRATION.wav` through `A06_NARRATION.wav`: accepted duration = **23–27 seconds**.
- `A07_NARRATION.wav`: accepted duration = **15–19 seconds**.
- Measure/check the actual generated WAV duration before accepting the take.
- If a take is inside the gate: ACCEPT it and treat that exact WAV as locked for the block.
- If a take is too long: regenerate the SAME exact words in Seed Audio using the SAME voice preset, pitch and expression, with only a small increase in `speech_rate`.
- If a take is too short: regenerate the SAME exact words using the SAME voice preset, pitch and expression, with only a small decrease in `speech_rate`.
- Make small changes only; preserve the calm delivery. Do not solve timing by making the narration sound rushed.
- Do NOT remove/rewrite words merely to hit duration unless making an explicit editorial script change to this pack.
- Do NOT ask Seedance to aggressively time-stretch, compress or re-voice an overlong narration file.
- The unused seconds in a 30-second block are intentional breathing room for city ambience, memory surfaces and visual transitions.

**GENERATE THESE 7 CLEAN NARRATION FILES:**
- Block 01 → `A01_NARRATION.wav`
- Block 02 → `A02_NARRATION.wav`
- Block 03 → `A03_NARRATION.wav`
- Block 04 → `A04_NARRATION.wav`
- Block 05 → `A05_NARRATION.wav`
- Block 06 → `A06_NARRATION.wav`
- Block 07 → `A07_NARRATION.wav`

For each file, scroll to **HIGGSFIELD AUDIO / SEED AUDIO 1.0 — FINAL NARRATION COPY PACK** near the end of this document. Paste **only the fenced narration text** for that block into the TTS text field. The code block contains only words that should actually be spoken.

**DO NOT COPY voice instructions into the TTS text field.** If you paste instructions there, the TTS model may literally speak them.

The narration is always **OFF-SCREEN first-person voice-over**. The visible protagonist does not lip-sync to it.

### PHASE G — HIGGSFIELD CINEMA STUDIO / SEEDANCE 2.5 — VIDEO + SFX GENERATION

After all required image references and the matching clean narration file exist, generate the video block in Cinema Studio.

For each block:
1. Open Higgsfield Cinema Studio and select **Seedance 2.5**.
2. Use **omni-reference / reference mode** if the UI exposes a mode choice.
3. Set **16:9 landscape** and the block duration: Blocks 01–06 ≈ 30 s; Block 07 ≈ 20 s.
4. Keep audio generation **ON**.
5. Attach exactly the IMAGE references listed under that CINEMA BLOCK.
6. Also attach the matching narration file, e.g. `A01_NARRATION.wav`, as the block's **audio reference**.
7. Bind/verify the `@` tokens shown in the block, including `@A01_NARRATION`, `@A02_NARRATION`, etc.
8. Paste **only** that CINEMA BLOCK's fenced `text` prompt.
9. Seedance must treat the narration reference as the voice/timing backbone and generate the **ambience, foley/SFX and restrained score around it**.
10. No visible person lip-syncs to the narration. No extra intelligible dialogue is added.
11. Save the resulting MP4 with its generated soundtrack embedded.

**AUDIO PRIORITY IN SEEDANCE:**
1. Preserve the supplied narration reference and its voice/pacing.
2. Add physically plausible synchronized ambience.
3. Add restrained foley/SFX specified in the block prompt.
4. Add only very low-level non-lyrical score where specified.

If Seedance alters, re-voices, duplicates or paraphrases the supplied narration, treat that generation as a failed audio take and regenerate. Do not accept a different narrator just because the picture is good.

Reference roles are fixed:
- **MAIN WORLD = physical present**
- **MEMORY WORLD = literal remembered content**
- **CHARACTER = identity**
- **STORYBOARD = ordered visual time**
- **Axx_NARRATION = exact off-screen narrator voice + spoken-content + timing anchor**

The 3×3 references remain control assets only; they must never appear as grids in the finished video.


================================================================================
# END OF READ-ONLY OPERATOR DOCUMENTATION — DO NOT COPY ABOVE THIS LINE
================================================================================

# ⬇⬇⬇ COPYABLE PROMPTS START BELOW THIS LINE ⬇⬇⬇

**COPY RULE:** inside each asset section, copy ONLY the fenced `text` code block. Everything outside the fence remains operator guidance.

================================================================================

## BEGIN COPYABLE ASSET PROMPTS

================================================================================
# OPERATOR TEXT ENDS HERE FOR THIS LIBRARY — COPY ONLY EACH `text` CODE BLOCK BELOW
================================================================================

## CHARACTER REFERENCE LIBRARY — GENERATE BEFORE MEMORY WORLDS

> **WHAT HAPPENS HERE:** each CHARACTER code block GENERATES a new character-sheet image. After generation, save that result under the canonical Cxx filename from the Operator Guide. The Cxx filename is an OUTPUT name here, not an input.

These character sheets are generated FIRST and reused inside the MEMORY WORLD sheets, STORYBOARDS and final video generations. The large Seedance reference budget is not treated as a reason to collapse distinct people into anonymous replacements. If a person has a specific role in a planned memory, keep a dedicated identity reference.

For every MEMORY WORLD generation, attach only the character sheets explicitly listed in that MEMORY WORLD's IDENTITY ANCHORS, plus CHARACTER 01 — PROTAGONIST when required. For final Seedance work, the full library may remain available, but scene-specific prompts should still name the exact character IDs that belong in the shot.

## CHARACTER 01 — PROTAGONIST

```text
Create ONE SINGLE photorealistic technical CHARACTER IDENTITY SHEET for ONE exact fictional person.

EXACT LAYOUT:
Three vertical photographic panels filling the complete canvas:
LEFT = full-body FRONT view.
CENTER = full-body BACK view.
RIGHT = frontal CLOSE-UP HEADSHOT.

The same exact person appears in all three panels.
The studio background reaches all four physical canvas edges.
No outer frame, no title, no header, no footer, no caption bands, no labels, no extra panels.
Only hairline internal separators between the three panels.

BACKGROUND / LIGHT:
Seamless neutral MID-GREY professional casting/VFX studio background.
Soft even neutral light, minimal soft floor shadow, neutral white balance.
No city, no furniture, no story props, no cinematic environment.

CONSISTENCY:
Preserve identical age, face shape, eyes, nose, mouth, ears, hairline, hair colour, skin tone, body build, clothing and footwear across views.
Do not beautify or change age in the headshot.
Natural skin texture and asymmetry.
Accurate anatomy.

CAMERA:
Full-body panels approximately 50–70mm full-frame equivalent, complete body including shoes.
Headshot approximately 85mm, upper shoulders upward.
Technical identity asset, not a film scene.

CHARACTER:
Hungarian / Central-European man, apparent age about 38–42, average height, lean-to-average build, physically ordinary. Intelligent restrained face, observant brown/hazel eyes, slight natural fatigue, short medium-to-dark brown hair, natural hairline, very light stubble, fair/light Central-European complexion. He must look like a real educated European man who can disappear into a London crowd: not glamorous, not heroic, not a fashion model.

Wardrobe locked for the dream-city walk: dark navy or charcoal lightweight rain jacket, dark charcoal crew-neck layer, dark trousers, understated dark urban walking shoes. No visible brand logos, no hat, no scarf, no backpack, no bright colour.

Front view: neutral upright posture, arms relaxed, restrained neutral expression.
Back view: exact same clothing and proportions.
Headshot: direct eye contact, mouth naturally closed, calm observant expression, subtle fatigue, no dramatic emotion.

FINAL CHECK:
One person only.
Three panels only: front full-body / back full-body / frontal headshot.
Same exact identity and wardrobe.
Mid-grey background reaches the canvas edges.
No title or outer frame.
```


## CHARACTER 02 — SOHO WOMAN

```text
Create ONE SINGLE photorealistic technical CHARACTER IDENTITY SHEET for ONE exact fictional person.

EXACT LAYOUT:
Three vertical photographic panels filling the complete canvas:
LEFT = full-body FRONT view.
CENTER = full-body BACK view.
RIGHT = frontal CLOSE-UP HEADSHOT.

The same exact person appears in all three panels.
The studio background reaches all four physical canvas edges.
No outer frame, no title, no header, no footer, no caption bands, no labels, no extra panels.
Only hairline internal separators between the three panels.

BACKGROUND / LIGHT:
Seamless neutral MID-GREY professional casting/VFX studio background.
Soft even neutral light, minimal soft floor shadow, neutral white balance.
No city, no furniture, no story props, no cinematic environment.

CONSISTENCY:
Preserve identical age, face shape, eyes, nose, mouth, ears, hairline, hair colour, skin tone, body build, clothing and footwear across views.
Do not beautify or change age in the headshot.
Natural skin texture and asymmetry.
Accurate anatomy.

CAMERA:
Full-body panels approximately 50–70mm full-frame equivalent, complete body including shoes.
Headshot approximately 85mm, upper shoulders upward.
Technical identity asset, not a film scene.

CHARACTER:
Fictional European woman, apparent age about 32–38, average-to-slim natural build, warm intelligent eyes, distinctive but ordinary believable face, natural medium-brown or dark-blonde shoulder-length hair, light natural makeup, realistic skin texture. Capable of a small spontaneous human smile that matters emotionally without looking theatrical. Not glamorous or fashion-editorial.

Wardrobe: practical rainy-London evening clothing, dark muted mid-length coat, warm-neutral simple knit/blouse, dark trousers or understated skirt/tights, practical dark shoes or ankle boots, small ordinary shoulder bag, no luxury branding.

Front view: relaxed neutral posture with the faintest warmth.
Back view: exact same hairstyle and clothing.
Headshot: direct natural eye contact, small restrained genuine warmth, no commercial smile.

FINAL CHECK:
One person only.
Three panels only: front full-body / back full-body / frontal headshot.
Same exact identity and wardrobe.
Mid-grey background reaches the canvas edges.
No title or outer frame.
```


## CHARACTER 03 — POLICEWOMAN

```text
Create ONE SINGLE photorealistic technical CHARACTER IDENTITY SHEET for ONE exact fictional person.

EXACT LAYOUT:
Three vertical photographic panels filling the complete canvas:
LEFT = full-body FRONT view.
CENTER = full-body BACK view.
RIGHT = frontal CLOSE-UP HEADSHOT.

The same exact person appears in all three panels.
The studio background reaches all four physical canvas edges.
No outer frame, no title, no header, no footer, no caption bands, no labels, no extra panels.
Only hairline internal separators between the three panels.

BACKGROUND / LIGHT:
Seamless neutral MID-GREY professional casting/VFX studio background.
Soft even neutral light, minimal soft floor shadow, neutral white balance.
No city, no furniture, no story props, no cinematic environment.

CONSISTENCY:
Preserve identical age, face shape, eyes, nose, mouth, ears, hairline, hair colour, skin tone, body build, clothing and footwear across views.
Do not beautify or change age in the headshot.
Natural skin texture and asymmetry.
Accurate anatomy.

CAMERA:
Full-body panels approximately 50–70mm full-frame equivalent, complete body including shoes.
Headshot approximately 85mm, upper shoulders upward.
Technical identity asset, not a film scene.

CHARACTER:
Fictional British/European woman, apparent age about 35–45, average height, fit but ordinary professional build, serious practical face, intelligent eyes, natural brown/dark-blonde hair secured simply, minimal makeup, realistic skin. She must look like an ordinary working police officer, calm and procedural rather than aggressive; never an action-film or villain archetype.

Wardrobe: contemporary British police-style normal non-tactical urban duty uniform in dark navy, practical trousers and black shoes, restrained normal duty equipment. No riot gear, no helmet, no assault styling, no weapon emphasis.

Front view: neutral upright professional stance, arms relaxed.
Back view: exact same uniform and hairstyle.
Headshot: neutral procedural expression, no anger, no smile.

FINAL CHECK:
One person only.
Three panels only: front full-body / back full-body / frontal headshot.
Same exact identity and wardrobe.
Mid-grey background reaches the canvas edges.
No title or outer frame.
```


## CHARACTER 04 — APPOINTED LAWYER

```text
Create ONE SINGLE photorealistic technical CHARACTER IDENTITY SHEET for ONE exact fictional person.

EXACT LAYOUT:
Three vertical photographic panels filling the complete canvas:
LEFT = full-body FRONT view.
CENTER = full-body BACK view.
RIGHT = frontal CLOSE-UP HEADSHOT.

The same exact person appears in all three panels.
The studio background reaches all four physical canvas edges.
No outer frame, no title, no header, no footer, no caption bands, no labels, no extra panels.
Only hairline internal separators between the three panels.

BACKGROUND / LIGHT:
Seamless neutral MID-GREY professional casting/VFX studio background.
Soft even neutral light, minimal soft floor shadow, neutral white balance.
No city, no furniture, no story props, no cinematic environment.

CONSISTENCY:
Preserve identical age, face shape, eyes, nose, mouth, ears, hairline, hair colour, skin tone, body build, clothing and footwear across views.
Do not beautify or change age in the headshot.
Natural skin texture and asymmetry.
Accurate anatomy.

CAMERA:
Full-body panels approximately 50–70mm full-frame equivalent, complete body including shoes.
Headshot approximately 85mm, upper shoulders upward.
Technical identity asset, not a film scene.

CHARACTER:
Fictional British/European man, apparent age about 45–55, average height and ordinary professional build, intelligent slightly tired face, short dark or greying brown hair, natural age lines, calm restrained professional presence. Not a television-lawyer archetype, not sinister, not glamorous.

Wardrobe: conservative dark charcoal/navy suit, pale shirt, muted understated tie, dark leather shoes, simple watch if visible. Slightly lived-in rather than fashion-perfect. No wig, no robe.

Front view: neutral full-body professional posture.
Back view: exact same suit and proportions.
Headshot: direct frontal close-up, subtle tiredness, calm professional expression, natural skin texture.

FINAL CHECK:
One person only.
Three panels only: front full-body / back full-body / frontal headshot.
Same exact identity and wardrobe.
Mid-grey background reaches the canvas edges.
No title or outer frame.
```


## CHARACTER 05 — FINAL NURSE

```text
Create ONE SINGLE photorealistic technical CHARACTER IDENTITY SHEET for ONE exact fictional person.

EXACT LAYOUT:
Three vertical photographic panels filling the complete canvas:
LEFT = full-body FRONT view.
CENTER = full-body BACK view.
RIGHT = frontal CLOSE-UP HEADSHOT.

The same exact person appears in all three panels.
The studio background reaches all four physical canvas edges.
No outer frame, no title, no header, no footer, no caption bands, no labels, no extra panels.
Only hairline internal separators between the three panels.

BACKGROUND / LIGHT:
Seamless neutral MID-GREY professional casting/VFX studio background.
Soft even neutral light, minimal soft floor shadow, neutral white balance.
No city, no furniture, no story props, no cinematic environment.

CONSISTENCY:
Preserve identical age, face shape, eyes, nose, mouth, ears, hairline, hair colour, skin tone, body build, clothing and footwear across views.
Do not beautify or change age in the headshot.
Natural skin texture and asymmetry.
Accurate anatomy.

CAMERA:
Full-body panels approximately 50–70mm full-frame equivalent, complete body including shoes.
Headshot approximately 85mm, upper shoulders upward.
Technical identity asset, not a film scene.

CHARACTER:
Fictional European woman, apparent age about 38–48, average height and ordinary natural build, kind competent grounded face, calm eyes, medium-brown or dark-blonde hair secured simply, minimal makeup, realistic skin. She must look completely normal, friendly and non-sinister. The final scene works because her warmth is ordinary.

Wardrobe: contemporary ordinary European clinical nurse tunic/scrub-style uniform in neutral light professional tones, practical trousers, comfortable clinical shoes, small ordinary ID badge without readable personal data. No surgical gown, no mask, no horror styling.

Front view: relaxed professional posture with slight approachable warmth.
Back view: exact same uniform and hairstyle.
Headshot: direct eye contact with a small genuine everyday smile, never exaggerated.

FINAL CHECK:
One person only.
Three panels only: front full-body / back full-body / frontal headshot.
Same exact identity and wardrobe.
Mid-grey background reaches the canvas edges.
No title or outer frame.
```

## CHARACTER 06 — SHARED-HOUSE SUBSTITUTE / SNORING HOUSEMATE

```text
Create ONE SINGLE photorealistic technical CHARACTER IDENTITY SHEET for ONE exact fictional person.

EXACT LAYOUT:
Three vertical photographic panels filling the complete canvas:
LEFT = full-body FRONT view.
CENTER = full-body BACK view.
RIGHT = frontal CLOSE-UP HEADSHOT.

The same exact person appears in all three panels.
The studio background reaches all four physical canvas edges.
No outer frame, no title, no header, no footer, no caption bands, no labels, no extra panels.
Only hairline internal separators between the three panels.

BACKGROUND / LIGHT:
Seamless neutral MID-GREY professional casting/VFX studio background.
Soft even neutral light, minimal soft floor shadow, neutral white balance.
No city, no furniture, no story props, no cinematic environment.

CONSISTENCY:
Preserve identical age, face shape, eyes, nose, mouth, ears, hairline, hair colour, skin tone, body build, clothing and footwear across views.
Do not beautify or change age in the headshot.
Natural skin texture and asymmetry.
Accurate anatomy.
This is a FICTIONALIZED CASTING INTERPRETATION for the film and must not attempt to reproduce the real participant from the memoir.

CAMERA:
Full-body panels approximately 50–70mm full-frame equivalent, complete body including shoes.
Headshot approximately 85mm, upper shoulders upward.
Technical identity asset, not a film scene.

CHARACTER:
Fictional Hungarian / Central-European man, apparent age about 28–38, average height and ordinary build, practical slightly worn appearance, short brown hair, natural face, no glamour. He represents the replacement housemate whose arrival is first registered by a different snore; he must look like an ordinary migrant worker / young professional rather than a comic character.

Wardrobe: ordinary low-cost London shared-house clothing: dark sweatshirt or simple knit, plain T-shirt, practical jeans or dark trousers, inexpensive trainers or shoes, no visible brand logos.

Front view: neutral upright posture, arms relaxed, neutral slightly tired expression; no comic grin.
Back view: exact same clothing, hairstyle and proportions.
Headshot: direct eye contact, same exact face, neutral slightly tired expression; no comic grin.

FINAL CHECK:
One person only.
Three panels only: front full-body / back full-body / frontal headshot.
Same exact identity and wardrobe.
Mid-grey background reaches the canvas edges.
No title or outer frame.
```

## CHARACTER 07 — FX-MORTGAGE HOUSEMATE

```text
Create ONE SINGLE photorealistic technical CHARACTER IDENTITY SHEET for ONE exact fictional person.

EXACT LAYOUT:
Three vertical photographic panels filling the complete canvas:
LEFT = full-body FRONT view.
CENTER = full-body BACK view.
RIGHT = frontal CLOSE-UP HEADSHOT.

The same exact person appears in all three panels.
The studio background reaches all four physical canvas edges.
No outer frame, no title, no header, no footer, no caption bands, no labels, no extra panels.
Only hairline internal separators between the three panels.

BACKGROUND / LIGHT:
Seamless neutral MID-GREY professional casting/VFX studio background.
Soft even neutral light, minimal soft floor shadow, neutral white balance.
No city, no furniture, no story props, no cinematic environment.

CONSISTENCY:
Preserve identical age, face shape, eyes, nose, mouth, ears, hairline, hair colour, skin tone, body build, clothing and footwear across views.
Do not beautify or change age in the headshot.
Natural skin texture and asymmetry.
Accurate anatomy.
This is a FICTIONALIZED CASTING INTERPRETATION for the film and must not attempt to reproduce the real participant from the memoir.

CAMERA:
Full-body panels approximately 50–70mm full-frame equivalent, complete body including shoes.
Headshot approximately 85mm, upper shoulders upward.
Technical identity asset, not a film scene.

CHARACTER:
Fictional Hungarian / Central-European man, apparent age about 32–42, average build, grounded responsible face with visible everyday pressure rather than misery. He is the London housemate whose spouse, child and foreign-currency mortgage obligations remain connected to Hungary. Do not make him a stereotype of poverty or debt.

Wardrobe: ordinary London workday / shared-house clothing: simple dark jacket or knit, muted shirt or T-shirt, dark trousers, practical shoes, no luxury or brand emphasis.

Front view: neutral upright posture, arms relaxed, calm, slightly burdened but dignified expression.
Back view: exact same clothing, hairstyle and proportions.
Headshot: direct eye contact, same exact face, calm, slightly burdened but dignified expression.

FINAL CHECK:
One person only.
Three panels only: front full-body / back full-body / frontal headshot.
Same exact identity and wardrobe.
Mid-grey background reaches the canvas edges.
No title or outer frame.
```

## CHARACTER 08 — FX-MORTGAGE SPOUSE

```text
Create ONE SINGLE photorealistic technical CHARACTER IDENTITY SHEET for ONE exact fictional person.

EXACT LAYOUT:
Three vertical photographic panels filling the complete canvas:
LEFT = full-body FRONT view.
CENTER = full-body BACK view.
RIGHT = frontal CLOSE-UP HEADSHOT.

The same exact person appears in all three panels.
The studio background reaches all four physical canvas edges.
No outer frame, no title, no header, no footer, no caption bands, no labels, no extra panels.
Only hairline internal separators between the three panels.

BACKGROUND / LIGHT:
Seamless neutral MID-GREY professional casting/VFX studio background.
Soft even neutral light, minimal soft floor shadow, neutral white balance.
No city, no furniture, no story props, no cinematic environment.

CONSISTENCY:
Preserve identical age, face shape, eyes, nose, mouth, ears, hairline, hair colour, skin tone, body build, clothing and footwear across views.
Do not beautify or change age in the headshot.
Natural skin texture and asymmetry.
Accurate anatomy.
This is a FICTIONALIZED CASTING INTERPRETATION for the film and must not attempt to reproduce the real participant from the memoir.

CAMERA:
Full-body panels approximately 50–70mm full-frame equivalent, complete body including shoes.
Headshot approximately 85mm, upper shoulders upward.
Technical identity asset, not a film scene.

CHARACTER:
Fictional Hungarian / Central-European woman, apparent age about 30–40, ordinary natural build, calm intelligent face, practical everyday appearance. She represents the spouse remaining in Hungary within the foreign-currency-mortgage family memory. She must feel like a complete ordinary person, not a symbol of separation.

Wardrobe: modest contemporary Hungarian everyday clothing in muted neutral tones, practical coat/cardigan/blouse and trousers or skirt, ordinary shoes, no branding.

Front view: neutral upright posture, arms relaxed, neutral warm expression with restrained seriousness.
Back view: exact same clothing, hairstyle and proportions.
Headshot: direct eye contact, same exact face, neutral warm expression with restrained seriousness.

FINAL CHECK:
One person only.
Three panels only: front full-body / back full-body / frontal headshot.
Same exact identity and wardrobe.
Mid-grey background reaches the canvas edges.
No title or outer frame.
```

## CHARACTER 09 — FX-MORTGAGE CHILD

```text
Create ONE SINGLE photorealistic technical CHARACTER IDENTITY SHEET for ONE exact fictional person.

EXACT LAYOUT:
Three vertical photographic panels filling the complete canvas:
LEFT = full-body FRONT view.
CENTER = full-body BACK view.
RIGHT = frontal CLOSE-UP HEADSHOT.

The same exact person appears in all three panels.
The studio background reaches all four physical canvas edges.
No outer frame, no title, no header, no footer, no caption bands, no labels, no extra panels.
Only hairline internal separators between the three panels.

BACKGROUND / LIGHT:
Seamless neutral MID-GREY professional casting/VFX studio background.
Soft even neutral light, minimal soft floor shadow, neutral white balance.
No city, no furniture, no story props, no cinematic environment.

CONSISTENCY:
Preserve identical age, face shape, eyes, nose, mouth, ears, hairline, hair colour, skin tone, body build, clothing and footwear across views.
Do not beautify or change age in the headshot.
Natural skin texture and asymmetry.
Accurate anatomy.
This is a FICTIONALIZED CASTING INTERPRETATION for the film and must not attempt to reproduce the real participant from the memoir.

CAMERA:
Full-body panels approximately 50–70mm full-frame equivalent, complete body including shoes.
Headshot approximately 85mm, upper shoulders upward.
Technical identity asset, not a film scene.

CHARACTER:
Fictional Hungarian child, apparent age about 6–9, ordinary healthy build, natural face and age-appropriate proportions. This is a fictionalized visual identity for the family-memory child and must not resemble any real participant.

Wardrobe: age-appropriate ordinary contemporary child clothing in muted practical colors, simple jumper or hoodie, trousers, practical shoes, no school logo or branding.

Front view: neutral upright posture, arms relaxed, natural neutral child expression, calm and unposed.
Back view: exact same clothing, hairstyle and proportions.
Headshot: direct eye contact, same exact face, natural neutral child expression, calm and unposed.

FINAL CHECK:
One person only.
Three panels only: front full-body / back full-body / frontal headshot.
Same exact identity and wardrobe.
Mid-grey background reaches the canvas edges.
No title or outer frame.
```

## CHARACTER 10 — BEGINNER-DANCE WOMAN

```text
Create ONE SINGLE photorealistic technical CHARACTER IDENTITY SHEET for ONE exact fictional person.

EXACT LAYOUT:
Three vertical photographic panels filling the complete canvas:
LEFT = full-body FRONT view.
CENTER = full-body BACK view.
RIGHT = frontal CLOSE-UP HEADSHOT.

The same exact person appears in all three panels.
The studio background reaches all four physical canvas edges.
No outer frame, no title, no header, no footer, no caption bands, no labels, no extra panels.
Only hairline internal separators between the three panels.

BACKGROUND / LIGHT:
Seamless neutral MID-GREY professional casting/VFX studio background.
Soft even neutral light, minimal soft floor shadow, neutral white balance.
No city, no furniture, no story props, no cinematic environment.

CONSISTENCY:
Preserve identical age, face shape, eyes, nose, mouth, ears, hairline, hair colour, skin tone, body build, clothing and footwear across views.
Do not beautify or change age in the headshot.
Natural skin texture and asymmetry.
Accurate anatomy.
This is a FICTIONALIZED CASTING INTERPRETATION for the film and must not attempt to reproduce the real participant from the memoir.

CAMERA:
Full-body panels approximately 50–70mm full-frame equivalent, complete body including shoes.
Headshot approximately 85mm, upper shoulders upward.
Technical identity asset, not a film scene.

CHARACTER:
Fictional European woman, apparent age about 30–40, average natural build, approachable ordinary face, expressive eyes, practical hairstyle. She is a recurring visual anchor for the beginner dance-floor memory and must feel like a real participant in a social class rather than a professional dancer or romantic fantasy.

Wardrobe: simple social-evening / beginner dance clothing: understated blouse or knit top, dark trousers or modest skirt, practical low-heeled or flat shoes, no stage costume.

Front view: neutral upright posture, arms relaxed, small natural attentiveness, no glamour smile.
Back view: exact same clothing, hairstyle and proportions.
Headshot: direct eye contact, same exact face, small natural attentiveness, no glamour smile.

FINAL CHECK:
One person only.
Three panels only: front full-body / back full-body / frontal headshot.
Same exact identity and wardrobe.
Mid-grey background reaches the canvas edges.
No title or outer frame.
```

## CHARACTER 11 — RUSSIAN TRANSIT PASSENGER

```text
Create ONE SINGLE photorealistic technical CHARACTER IDENTITY SHEET for ONE exact fictional person.

EXACT LAYOUT:
Three vertical photographic panels filling the complete canvas:
LEFT = full-body FRONT view.
CENTER = full-body BACK view.
RIGHT = frontal CLOSE-UP HEADSHOT.

The same exact person appears in all three panels.
The studio background reaches all four physical canvas edges.
No outer frame, no title, no header, no footer, no caption bands, no labels, no extra panels.
Only hairline internal separators between the three panels.

BACKGROUND / LIGHT:
Seamless neutral MID-GREY professional casting/VFX studio background.
Soft even neutral light, minimal soft floor shadow, neutral white balance.
No city, no furniture, no story props, no cinematic environment.

CONSISTENCY:
Preserve identical age, face shape, eyes, nose, mouth, ears, hairline, hair colour, skin tone, body build, clothing and footwear across views.
Do not beautify or change age in the headshot.
Natural skin texture and asymmetry.
Accurate anatomy.
This is a FICTIONALIZED CASTING INTERPRETATION for the film and must not attempt to reproduce the real participant from the memoir.

CAMERA:
Full-body panels approximately 50–70mm full-frame equivalent, complete body including shoes.
Headshot approximately 85mm, upper shoulders upward.
Technical identity asset, not a film scene.

CHARACTER:
Fictional local Russian adult man, apparent age about 35–55, ordinary commuter build and believable everyday face. He is the passenger who calmly uses his monthly transit pass to help the protagonist through a gate. The visual identity must be non-stereotyped and based on ordinary urban commuter realism.

Wardrobe: practical cold-weather city clothing: dark coat or jacket, simple knit layer, trousers, commuter shoes, small everyday bag if needed, no national symbols.

Front view: neutral upright posture, arms relaxed, calm matter-of-fact helpful expression.
Back view: exact same clothing, hairstyle and proportions.
Headshot: direct eye contact, same exact face, calm matter-of-fact helpful expression.

FINAL CHECK:
One person only.
Three panels only: front full-body / back full-body / frontal headshot.
Same exact identity and wardrobe.
Mid-grey background reaches the canvas edges.
No title or outer frame.
```

## CHARACTER 12 — AGRA BUS WOMAN

```text
Create ONE SINGLE photorealistic technical CHARACTER IDENTITY SHEET for ONE exact fictional person.

EXACT LAYOUT:
Three vertical photographic panels filling the complete canvas:
LEFT = full-body FRONT view.
CENTER = full-body BACK view.
RIGHT = frontal CLOSE-UP HEADSHOT.

The same exact person appears in all three panels.
The studio background reaches all four physical canvas edges.
No outer frame, no title, no header, no footer, no caption bands, no labels, no extra panels.
Only hairline internal separators between the three panels.

BACKGROUND / LIGHT:
Seamless neutral MID-GREY professional casting/VFX studio background.
Soft even neutral light, minimal soft floor shadow, neutral white balance.
No city, no furniture, no story props, no cinematic environment.

CONSISTENCY:
Preserve identical age, face shape, eyes, nose, mouth, ears, hairline, hair colour, skin tone, body build, clothing and footwear across views.
Do not beautify or change age in the headshot.
Natural skin texture and asymmetry.
Accurate anatomy.
This is a FICTIONALIZED CASTING INTERPRETATION for the film and must not attempt to reproduce the real participant from the memoir.

CAMERA:
Full-body panels approximately 50–70mm full-frame equivalent, complete body including shoes.
Headshot approximately 85mm, upper shoulders upward.
Technical identity asset, not a film scene.

CHARACTER:
Fictional Indian woman, apparent age about 28–45, ordinary natural build, grounded intelligent face and practical everyday appearance. She is the woman whose voice/conversation is remembered from behind or across a bus seat in the Agra travel memory. Avoid exoticized styling and avoid celebrity-like beauty.

Wardrobe: ordinary contemporary travel/day clothing appropriate to North India, modest and practical, muted colors, natural fabric, no ceremonial costume and no tourist styling.

Front view: neutral upright posture, arms relaxed, neutral conversational expression with natural curiosity.
Back view: exact same clothing, hairstyle and proportions.
Headshot: direct eye contact, same exact face, neutral conversational expression with natural curiosity.

FINAL CHECK:
One person only.
Three panels only: front full-body / back full-body / frontal headshot.
Same exact identity and wardrobe.
Mid-grey background reaches the canvas edges.
No title or outer frame.
```

## CHARACTER 13 — SUDANESE TRAVELER — MAN

```text
Create ONE SINGLE photorealistic technical CHARACTER IDENTITY SHEET for ONE exact fictional person.

EXACT LAYOUT:
Three vertical photographic panels filling the complete canvas:
LEFT = full-body FRONT view.
CENTER = full-body BACK view.
RIGHT = frontal CLOSE-UP HEADSHOT.

The same exact person appears in all three panels.
The studio background reaches all four physical canvas edges.
No outer frame, no title, no header, no footer, no caption bands, no labels, no extra panels.
Only hairline internal separators between the three panels.

BACKGROUND / LIGHT:
Seamless neutral MID-GREY professional casting/VFX studio background.
Soft even neutral light, minimal soft floor shadow, neutral white balance.
No city, no furniture, no story props, no cinematic environment.

CONSISTENCY:
Preserve identical age, face shape, eyes, nose, mouth, ears, hairline, hair colour, skin tone, body build, clothing and footwear across views.
Do not beautify or change age in the headshot.
Natural skin texture and asymmetry.
Accurate anatomy.
This is a FICTIONALIZED CASTING INTERPRETATION for the film and must not attempt to reproduce the real participant from the memoir.

CAMERA:
Full-body panels approximately 50–70mm full-frame equivalent, complete body including shoes.
Headshot approximately 85mm, upper shoulders upward.
Technical identity asset, not a film scene.

CHARACTER:
Fictional Sudanese adult man, apparent age about 30–45, average natural build, grounded ordinary face, calm attentive presence. He is one half of the Sudanese couple sharing the Cairo taxi memory. Avoid stereotypes, heroic styling or refugee imagery; treat him as an ordinary traveler.

Wardrobe: practical contemporary travel clothing suitable for Cairo: simple shirt or light layer, trousers, ordinary shoes, compact travel bag if needed, no flags or political symbols.

Front view: neutral upright posture, arms relaxed, calm reserved expression with ordinary human warmth.
Back view: exact same clothing, hairstyle and proportions.
Headshot: direct eye contact, same exact face, calm reserved expression with ordinary human warmth.

FINAL CHECK:
One person only.
Three panels only: front full-body / back full-body / frontal headshot.
Same exact identity and wardrobe.
Mid-grey background reaches the canvas edges.
No title or outer frame.
```

## CHARACTER 14 — SUDANESE TRAVELER — WOMAN

```text
Create ONE SINGLE photorealistic technical CHARACTER IDENTITY SHEET for ONE exact fictional person.

EXACT LAYOUT:
Three vertical photographic panels filling the complete canvas:
LEFT = full-body FRONT view.
CENTER = full-body BACK view.
RIGHT = frontal CLOSE-UP HEADSHOT.

The same exact person appears in all three panels.
The studio background reaches all four physical canvas edges.
No outer frame, no title, no header, no footer, no caption bands, no labels, no extra panels.
Only hairline internal separators between the three panels.

BACKGROUND / LIGHT:
Seamless neutral MID-GREY professional casting/VFX studio background.
Soft even neutral light, minimal soft floor shadow, neutral white balance.
No city, no furniture, no story props, no cinematic environment.

CONSISTENCY:
Preserve identical age, face shape, eyes, nose, mouth, ears, hairline, hair colour, skin tone, body build, clothing and footwear across views.
Do not beautify or change age in the headshot.
Natural skin texture and asymmetry.
Accurate anatomy.
This is a FICTIONALIZED CASTING INTERPRETATION for the film and must not attempt to reproduce the real participant from the memoir.

CAMERA:
Full-body panels approximately 50–70mm full-frame equivalent, complete body including shoes.
Headshot approximately 85mm, upper shoulders upward.
Technical identity asset, not a film scene.

CHARACTER:
Fictional Sudanese adult woman, apparent age about 28–42, average natural build, grounded ordinary face, calm observant presence. She is the other half of the Sudanese couple sharing the Cairo taxi memory. Avoid stereotypes, exoticization, fashion-editorial styling or political symbolism.

Wardrobe: practical contemporary travel clothing suitable for Cairo, modest and ordinary, muted tones, compact travel bag if needed, no flags or political symbols.

Front view: neutral upright posture, arms relaxed, calm natural expression, subtle ordinary warmth.
Back view: exact same clothing, hairstyle and proportions.
Headshot: direct eye contact, same exact face, calm natural expression, subtle ordinary warmth.

FINAL CHECK:
One person only.
Three panels only: front full-body / back full-body / frontal headshot.
Same exact identity and wardrobe.
Mid-grey background reaches the canvas edges.
No title or outer frame.
```

## CHARACTER 15 — CAIRO TAXI DRIVER

```text
Create ONE SINGLE photorealistic technical CHARACTER IDENTITY SHEET for ONE exact fictional person.

EXACT LAYOUT:
Three vertical photographic panels filling the complete canvas:
LEFT = full-body FRONT view.
CENTER = full-body BACK view.
RIGHT = frontal CLOSE-UP HEADSHOT.

The same exact person appears in all three panels.
The studio background reaches all four physical canvas edges.
No outer frame, no title, no header, no footer, no caption bands, no labels, no extra panels.
Only hairline internal separators between the three panels.

BACKGROUND / LIGHT:
Seamless neutral MID-GREY professional casting/VFX studio background.
Soft even neutral light, minimal soft floor shadow, neutral white balance.
No city, no furniture, no story props, no cinematic environment.

CONSISTENCY:
Preserve identical age, face shape, eyes, nose, mouth, ears, hairline, hair colour, skin tone, body build, clothing and footwear across views.
Do not beautify or change age in the headshot.
Natural skin texture and asymmetry.
Accurate anatomy.
This is a FICTIONALIZED CASTING INTERPRETATION for the film and must not attempt to reproduce the real participant from the memoir.

CAMERA:
Full-body panels approximately 50–70mm full-frame equivalent, complete body including shoes.
Headshot approximately 85mm, upper shoulders upward.
Technical identity asset, not a film scene.

CHARACTER:
Fictional Egyptian man, apparent age about 35–55, ordinary working-driver build, weathered but natural face, alert eyes, grounded practical presence. He is the taxi driver within the Cairo travel memory and must feel like a real working person, not a comic or threatening archetype.

Wardrobe: ordinary contemporary Cairo taxi-driver clothing: simple shirt or polo/light jacket, practical trousers and shoes, no uniform fantasy, no tourist costume.

Front view: neutral upright posture, arms relaxed, focused neutral expression with practical attentiveness.
Back view: exact same clothing, hairstyle and proportions.
Headshot: direct eye contact, same exact face, focused neutral expression with practical attentiveness.

FINAL CHECK:
One person only.
Three panels only: front full-body / back full-body / frontal headshot.
Same exact identity and wardrobe.
Mid-grey background reaches the canvas edges.
No title or outer frame.
```

## CHARACTER 16 — BALLOON LOCAL HELPER — MAN

```text
Create ONE SINGLE photorealistic technical CHARACTER IDENTITY SHEET for ONE exact fictional person.

EXACT LAYOUT:
Three vertical photographic panels filling the complete canvas:
LEFT = full-body FRONT view.
CENTER = full-body BACK view.
RIGHT = frontal CLOSE-UP HEADSHOT.

The same exact person appears in all three panels.
The studio background reaches all four physical canvas edges.
No outer frame, no title, no header, no footer, no caption bands, no labels, no extra panels.
Only hairline internal separators between the three panels.

BACKGROUND / LIGHT:
Seamless neutral MID-GREY professional casting/VFX studio background.
Soft even neutral light, minimal soft floor shadow, neutral white balance.
No city, no furniture, no story props, no cinematic environment.

CONSISTENCY:
Preserve identical age, face shape, eyes, nose, mouth, ears, hairline, hair colour, skin tone, body build, clothing and footwear across views.
Do not beautify or change age in the headshot.
Natural skin texture and asymmetry.
Accurate anatomy.
This is a FICTIONALIZED CASTING INTERPRETATION for the film and must not attempt to reproduce the real participant from the memoir.

CAMERA:
Full-body panels approximately 50–70mm full-frame equivalent, complete body including shoes.
Headshot approximately 85mm, upper shoulders upward.
Technical identity asset, not a film scene.

CHARACTER:
Fictional local adult man, apparent age about 30–55, ordinary rural/edge-of-town build, natural weathered face and practical demeanor. He is one of the people who helps after the hot-air-balloon lands in a vegetable plot. The identity is about cooperation, not spectacle or ethnicity.

Wardrobe: ordinary practical outdoor clothing: simple long-sleeve shirt or jacket, work trousers, sturdy shoes, muted natural colors, no costume styling.

Front view: neutral upright posture, arms relaxed, focused cooperative expression, calm effort.
Back view: exact same clothing, hairstyle and proportions.
Headshot: direct eye contact, same exact face, focused cooperative expression, calm effort.

FINAL CHECK:
One person only.
Three panels only: front full-body / back full-body / frontal headshot.
Same exact identity and wardrobe.
Mid-grey background reaches the canvas edges.
No title or outer frame.
```

## CHARACTER 17 — BALLOON LOCAL HELPER — WOMAN

```text
Create ONE SINGLE photorealistic technical CHARACTER IDENTITY SHEET for ONE exact fictional person.

EXACT LAYOUT:
Three vertical photographic panels filling the complete canvas:
LEFT = full-body FRONT view.
CENTER = full-body BACK view.
RIGHT = frontal CLOSE-UP HEADSHOT.

The same exact person appears in all three panels.
The studio background reaches all four physical canvas edges.
No outer frame, no title, no header, no footer, no caption bands, no labels, no extra panels.
Only hairline internal separators between the three panels.

BACKGROUND / LIGHT:
Seamless neutral MID-GREY professional casting/VFX studio background.
Soft even neutral light, minimal soft floor shadow, neutral white balance.
No city, no furniture, no story props, no cinematic environment.

CONSISTENCY:
Preserve identical age, face shape, eyes, nose, mouth, ears, hairline, hair colour, skin tone, body build, clothing and footwear across views.
Do not beautify or change age in the headshot.
Natural skin texture and asymmetry.
Accurate anatomy.
This is a FICTIONALIZED CASTING INTERPRETATION for the film and must not attempt to reproduce the real participant from the memoir.

CAMERA:
Full-body panels approximately 50–70mm full-frame equivalent, complete body including shoes.
Headshot approximately 85mm, upper shoulders upward.
Technical identity asset, not a film scene.

CHARACTER:
Fictional local adult woman, apparent age about 30–55, ordinary natural build, grounded practical face and calm strength. She is another recurring helper in the vegetable-plot balloon landing memory. Treat her as an ordinary person solving a practical problem, not a symbolic figure.

Wardrobe: ordinary practical outdoor clothing in muted colors, simple top/layer, trousers or modest skirt as appropriate, sturdy shoes, no costume styling.

Front view: neutral upright posture, arms relaxed, focused cooperative expression with restrained warmth.
Back view: exact same clothing, hairstyle and proportions.
Headshot: direct eye contact, same exact face, focused cooperative expression with restrained warmth.

FINAL CHECK:
One person only.
Three panels only: front full-body / back full-body / frontal headshot.
Same exact identity and wardrobe.
Mid-grey background reaches the canvas edges.
No title or outer frame.
```

## CHARACTER 18 — BARMOUTH ROAD-TRIP DRIVER / COMPANION

```text
Create ONE SINGLE photorealistic technical CHARACTER IDENTITY SHEET for ONE exact fictional person.

EXACT LAYOUT:
Three vertical photographic panels filling the complete canvas:
LEFT = full-body FRONT view.
CENTER = full-body BACK view.
RIGHT = frontal CLOSE-UP HEADSHOT.

The same exact person appears in all three panels.
The studio background reaches all four physical canvas edges.
No outer frame, no title, no header, no footer, no caption bands, no labels, no extra panels.
Only hairline internal separators between the three panels.

BACKGROUND / LIGHT:
Seamless neutral MID-GREY professional casting/VFX studio background.
Soft even neutral light, minimal soft floor shadow, neutral white balance.
No city, no furniture, no story props, no cinematic environment.

CONSISTENCY:
Preserve identical age, face shape, eyes, nose, mouth, ears, hairline, hair colour, skin tone, body build, clothing and footwear across views.
Do not beautify or change age in the headshot.
Natural skin texture and asymmetry.
Accurate anatomy.
This is a FICTIONALIZED CASTING INTERPRETATION for the film and must not attempt to reproduce the real participant from the memoir.

CAMERA:
Full-body panels approximately 50–70mm full-frame equivalent, complete body including shoes.
Headshot approximately 85mm, upper shoulders upward.
Technical identity asset, not a film scene.

CHARACTER:
Fictional European adult man, apparent age about 30–45, ordinary build, practical approachable face. He is the acquaintance traveling as part of the five-person road trip who drives the rented car; he is a companion, not a hired driver.

Wardrobe: ordinary British-road-trip casual clothing: practical jacket, knit/T-shirt, jeans or trousers, walking shoes, no branding.

Front view: neutral upright posture, arms relaxed, neutral relaxed travel expression.
Back view: exact same clothing, hairstyle and proportions.
Headshot: direct eye contact, same exact face, neutral relaxed travel expression.

FINAL CHECK:
One person only.
Three panels only: front full-body / back full-body / frontal headshot.
Same exact identity and wardrobe.
Mid-grey background reaches the canvas edges.
No title or outer frame.
```

## CHARACTER 19 — BARMOUTH ROAD-TRIP COMPANION A

```text
Create ONE SINGLE photorealistic technical CHARACTER IDENTITY SHEET for ONE exact fictional person.

EXACT LAYOUT:
Three vertical photographic panels filling the complete canvas:
LEFT = full-body FRONT view.
CENTER = full-body BACK view.
RIGHT = frontal CLOSE-UP HEADSHOT.

The same exact person appears in all three panels.
The studio background reaches all four physical canvas edges.
No outer frame, no title, no header, no footer, no caption bands, no labels, no extra panels.
Only hairline internal separators between the three panels.

BACKGROUND / LIGHT:
Seamless neutral MID-GREY professional casting/VFX studio background.
Soft even neutral light, minimal soft floor shadow, neutral white balance.
No city, no furniture, no story props, no cinematic environment.

CONSISTENCY:
Preserve identical age, face shape, eyes, nose, mouth, ears, hairline, hair colour, skin tone, body build, clothing and footwear across views.
Do not beautify or change age in the headshot.
Natural skin texture and asymmetry.
Accurate anatomy.
This is a FICTIONALIZED CASTING INTERPRETATION for the film and must not attempt to reproduce the real participant from the memoir.

CAMERA:
Full-body panels approximately 50–70mm full-frame equivalent, complete body including shoes.
Headshot approximately 85mm, upper shoulders upward.
Technical identity asset, not a film scene.

CHARACTER:
Fictional European adult woman, apparent age about 28–42, ordinary natural build and believable everyday face. She is one of the four non-protagonist companions on the five-person British road circuit.

Wardrobe: ordinary practical road-trip clothing suitable for variable UK weather, muted jacket/layer, trousers, walking shoes, no tourist-brand styling.

Front view: neutral upright posture, arms relaxed, natural relaxed expression.
Back view: exact same clothing, hairstyle and proportions.
Headshot: direct eye contact, same exact face, natural relaxed expression.

FINAL CHECK:
One person only.
Three panels only: front full-body / back full-body / frontal headshot.
Same exact identity and wardrobe.
Mid-grey background reaches the canvas edges.
No title or outer frame.
```

## CHARACTER 20 — BARMOUTH ROAD-TRIP COMPANION B

```text
Create ONE SINGLE photorealistic technical CHARACTER IDENTITY SHEET for ONE exact fictional person.

EXACT LAYOUT:
Three vertical photographic panels filling the complete canvas:
LEFT = full-body FRONT view.
CENTER = full-body BACK view.
RIGHT = frontal CLOSE-UP HEADSHOT.

The same exact person appears in all three panels.
The studio background reaches all four physical canvas edges.
No outer frame, no title, no header, no footer, no caption bands, no labels, no extra panels.
Only hairline internal separators between the three panels.

BACKGROUND / LIGHT:
Seamless neutral MID-GREY professional casting/VFX studio background.
Soft even neutral light, minimal soft floor shadow, neutral white balance.
No city, no furniture, no story props, no cinematic environment.

CONSISTENCY:
Preserve identical age, face shape, eyes, nose, mouth, ears, hairline, hair colour, skin tone, body build, clothing and footwear across views.
Do not beautify or change age in the headshot.
Natural skin texture and asymmetry.
Accurate anatomy.
This is a FICTIONALIZED CASTING INTERPRETATION for the film and must not attempt to reproduce the real participant from the memoir.

CAMERA:
Full-body panels approximately 50–70mm full-frame equivalent, complete body including shoes.
Headshot approximately 85mm, upper shoulders upward.
Technical identity asset, not a film scene.

CHARACTER:
Fictional European adult man, apparent age about 28–45, ordinary build and believable everyday face. He is one of the four non-protagonist companions on the five-person British road circuit.

Wardrobe: ordinary practical road-trip clothing suitable for variable UK weather, muted jacket/layer, trousers, walking shoes, no tourist-brand styling.

Front view: neutral upright posture, arms relaxed, natural relaxed expression.
Back view: exact same clothing, hairstyle and proportions.
Headshot: direct eye contact, same exact face, natural relaxed expression.

FINAL CHECK:
One person only.
Three panels only: front full-body / back full-body / frontal headshot.
Same exact identity and wardrobe.
Mid-grey background reaches the canvas edges.
No title or outer frame.
```

## CHARACTER 21 — BARMOUTH ROAD-TRIP COMPANION C

```text
Create ONE SINGLE photorealistic technical CHARACTER IDENTITY SHEET for ONE exact fictional person.

EXACT LAYOUT:
Three vertical photographic panels filling the complete canvas:
LEFT = full-body FRONT view.
CENTER = full-body BACK view.
RIGHT = frontal CLOSE-UP HEADSHOT.

The same exact person appears in all three panels.
The studio background reaches all four physical canvas edges.
No outer frame, no title, no header, no footer, no caption bands, no labels, no extra panels.
Only hairline internal separators between the three panels.

BACKGROUND / LIGHT:
Seamless neutral MID-GREY professional casting/VFX studio background.
Soft even neutral light, minimal soft floor shadow, neutral white balance.
No city, no furniture, no story props, no cinematic environment.

CONSISTENCY:
Preserve identical age, face shape, eyes, nose, mouth, ears, hairline, hair colour, skin tone, body build, clothing and footwear across views.
Do not beautify or change age in the headshot.
Natural skin texture and asymmetry.
Accurate anatomy.
This is a FICTIONALIZED CASTING INTERPRETATION for the film and must not attempt to reproduce the real participant from the memoir.

CAMERA:
Full-body panels approximately 50–70mm full-frame equivalent, complete body including shoes.
Headshot approximately 85mm, upper shoulders upward.
Technical identity asset, not a film scene.

CHARACTER:
Fictional European adult woman, apparent age about 28–42, ordinary natural build and believable everyday face. She is one of the four non-protagonist companions on the five-person British road circuit.

Wardrobe: ordinary practical road-trip clothing suitable for variable UK weather, muted jacket/layer, trousers, walking shoes, no tourist-brand styling.

Front view: neutral upright posture, arms relaxed, natural relaxed expression.
Back view: exact same clothing, hairstyle and proportions.
Headshot: direct eye contact, same exact face, natural relaxed expression.

FINAL CHECK:
One person only.
Three panels only: front full-body / back full-body / frontal headshot.
Same exact identity and wardrobe.
Mid-grey background reaches the canvas edges.
No title or outer frame.
```

## CHARACTER 22 — ACCOUNTANT

```text
Create ONE SINGLE photorealistic technical CHARACTER IDENTITY SHEET for ONE exact fictional person.

EXACT LAYOUT:
Three vertical photographic panels filling the complete canvas:
LEFT = full-body FRONT view.
CENTER = full-body BACK view.
RIGHT = frontal CLOSE-UP HEADSHOT.

The same exact person appears in all three panels.
The studio background reaches all four physical canvas edges.
No outer frame, no title, no header, no footer, no caption bands, no labels, no extra panels.
Only hairline internal separators between the three panels.

BACKGROUND / LIGHT:
Seamless neutral MID-GREY professional casting/VFX studio background.
Soft even neutral light, minimal soft floor shadow, neutral white balance.
No city, no furniture, no story props, no cinematic environment.

CONSISTENCY:
Preserve identical age, face shape, eyes, nose, mouth, ears, hairline, hair colour, skin tone, body build, clothing and footwear across views.
Do not beautify or change age in the headshot.
Natural skin texture and asymmetry.
Accurate anatomy.
This is a FICTIONALIZED CASTING INTERPRETATION for the film and must not attempt to reproduce the real participant from the memoir.

CAMERA:
Full-body panels approximately 50–70mm full-frame equivalent, complete body including shoes.
Headshot approximately 85mm, upper shoulders upward.
Technical identity asset, not a film scene.

CHARACTER:
Fictional Hungarian / Central-European accountant, apparent age about 35–50, ordinary professional build, intelligent practical face, slightly tired from routine workload. This person anchors the accounting / delegated-administration memory and must never look villainous or incompetent by appearance.

Wardrobe: ordinary contemporary accountant / small-office professional clothing: muted blouse/shirt or knit, dark trousers or skirt, practical shoes, no luxury styling.

Front view: neutral upright posture, arms relaxed, neutral professional expression, focused and human.
Back view: exact same clothing, hairstyle and proportions.
Headshot: direct eye contact, same exact face, neutral professional expression, focused and human.

FINAL CHECK:
One person only.
Three panels only: front full-body / back full-body / frontal headshot.
Same exact identity and wardrobe.
Mid-grey background reaches the canvas edges.
No title or outer frame.
```

## CHARACTER 23 — ADMIN COLLEAGUE A

```text
Create ONE SINGLE photorealistic technical CHARACTER IDENTITY SHEET for ONE exact fictional person.

EXACT LAYOUT:
Three vertical photographic panels filling the complete canvas:
LEFT = full-body FRONT view.
CENTER = full-body BACK view.
RIGHT = frontal CLOSE-UP HEADSHOT.

The same exact person appears in all three panels.
The studio background reaches all four physical canvas edges.
No outer frame, no title, no header, no footer, no caption bands, no labels, no extra panels.
Only hairline internal separators between the three panels.

BACKGROUND / LIGHT:
Seamless neutral MID-GREY professional casting/VFX studio background.
Soft even neutral light, minimal soft floor shadow, neutral white balance.
No city, no furniture, no story props, no cinematic environment.

CONSISTENCY:
Preserve identical age, face shape, eyes, nose, mouth, ears, hairline, hair colour, skin tone, body build, clothing and footwear across views.
Do not beautify or change age in the headshot.
Natural skin texture and asymmetry.
Accurate anatomy.
This is a FICTIONALIZED CASTING INTERPRETATION for the film and must not attempt to reproduce the real participant from the memoir.

CAMERA:
Full-body panels approximately 50–70mm full-frame equivalent, complete body including shoes.
Headshot approximately 85mm, upper shoulders upward.
Technical identity asset, not a film scene.

CHARACTER:
Fictional European office professional, apparent age about 30–50, ordinary natural build and believable workplace face. This person anchors one side of the three-people / no-shared-screen triangle. No villain coding.

Wardrobe: ordinary modern office clothing in muted neutral tones, practical and non-fashionable, no branding.

Front view: neutral upright posture, arms relaxed, focused neutral professional expression.
Back view: exact same clothing, hairstyle and proportions.
Headshot: direct eye contact, same exact face, focused neutral professional expression.

FINAL CHECK:
One person only.
Three panels only: front full-body / back full-body / frontal headshot.
Same exact identity and wardrobe.
Mid-grey background reaches the canvas edges.
No title or outer frame.
```

## CHARACTER 24 — ADMIN COLLEAGUE B

```text
Create ONE SINGLE photorealistic technical CHARACTER IDENTITY SHEET for ONE exact fictional person.

EXACT LAYOUT:
Three vertical photographic panels filling the complete canvas:
LEFT = full-body FRONT view.
CENTER = full-body BACK view.
RIGHT = frontal CLOSE-UP HEADSHOT.

The same exact person appears in all three panels.
The studio background reaches all four physical canvas edges.
No outer frame, no title, no header, no footer, no caption bands, no labels, no extra panels.
Only hairline internal separators between the three panels.

BACKGROUND / LIGHT:
Seamless neutral MID-GREY professional casting/VFX studio background.
Soft even neutral light, minimal soft floor shadow, neutral white balance.
No city, no furniture, no story props, no cinematic environment.

CONSISTENCY:
Preserve identical age, face shape, eyes, nose, mouth, ears, hairline, hair colour, skin tone, body build, clothing and footwear across views.
Do not beautify or change age in the headshot.
Natural skin texture and asymmetry.
Accurate anatomy.
This is a FICTIONALIZED CASTING INTERPRETATION for the film and must not attempt to reproduce the real participant from the memoir.

CAMERA:
Full-body panels approximately 50–70mm full-frame equivalent, complete body including shoes.
Headshot approximately 85mm, upper shoulders upward.
Technical identity asset, not a film scene.

CHARACTER:
Fictional European office professional, apparent age about 30–50, ordinary natural build and believable workplace face, visually distinct from ADMIN COLLEAGUE A. This person anchors the third side of the three-people / no-shared-screen triangle. No villain coding.

Wardrobe: ordinary modern office clothing in muted neutral tones, practical and non-fashionable, no branding.

Front view: neutral upright posture, arms relaxed, focused neutral professional expression.
Back view: exact same clothing, hairstyle and proportions.
Headshot: direct eye contact, same exact face, focused neutral professional expression.

FINAL CHECK:
One person only.
Three panels only: front full-body / back full-body / frontal headshot.
Same exact identity and wardrobe.
Mid-grey background reaches the canvas edges.
No title or outer frame.
```

## CHARACTER 25 — SEARCH OFFICER — MALE

```text
Create ONE SINGLE photorealistic technical CHARACTER IDENTITY SHEET for ONE exact fictional person.

EXACT LAYOUT:
Three vertical photographic panels filling the complete canvas:
LEFT = full-body FRONT view.
CENTER = full-body BACK view.
RIGHT = frontal CLOSE-UP HEADSHOT.

The same exact person appears in all three panels.
The studio background reaches all four physical canvas edges.
No outer frame, no title, no header, no footer, no caption bands, no labels, no extra panels.
Only hairline internal separators between the three panels.

BACKGROUND / LIGHT:
Seamless neutral MID-GREY professional casting/VFX studio background.
Soft even neutral light, minimal soft floor shadow, neutral white balance.
No city, no furniture, no story props, no cinematic environment.

CONSISTENCY:
Preserve identical age, face shape, eyes, nose, mouth, ears, hairline, hair colour, skin tone, body build, clothing and footwear across views.
Do not beautify or change age in the headshot.
Natural skin texture and asymmetry.
Accurate anatomy.
This is a FICTIONALIZED CASTING INTERPRETATION for the film and must not attempt to reproduce the real participant from the memoir.

CAMERA:
Full-body panels approximately 50–70mm full-frame equivalent, complete body including shoes.
Headshot approximately 85mm, upper shoulders upward.
Technical identity asset, not a film scene.

CHARACTER:
Fictional European male police officer, apparent age about 35–50, ordinary professional build and practical face. He is a recurring search officer in the apartment memory, including the accidental step on the protagonist's recently operated foot. He must look procedural and ordinary, never brutal or action-film styled.

Wardrobe: contemporary ordinary urban police-style dark navy duty uniform, practical trousers and shoes, restrained normal equipment, no riot gear and no weapon emphasis.

Front view: neutral upright posture, arms relaxed, neutral procedural expression.
Back view: exact same clothing, hairstyle and proportions.
Headshot: direct eye contact, same exact face, neutral procedural expression.

FINAL CHECK:
One person only.
Three panels only: front full-body / back full-body / frontal headshot.
Same exact identity and wardrobe.
Mid-grey background reaches the canvas edges.
No title or outer frame.
```

## CHARACTER 26 — DEFENCE-OFFICE SUBSTITUTE

```text
Create ONE SINGLE photorealistic technical CHARACTER IDENTITY SHEET for ONE exact fictional person.

EXACT LAYOUT:
Three vertical photographic panels filling the complete canvas:
LEFT = full-body FRONT view.
CENTER = full-body BACK view.
RIGHT = frontal CLOSE-UP HEADSHOT.

The same exact person appears in all three panels.
The studio background reaches all four physical canvas edges.
No outer frame, no title, no header, no footer, no caption bands, no labels, no extra panels.
Only hairline internal separators between the three panels.

BACKGROUND / LIGHT:
Seamless neutral MID-GREY professional casting/VFX studio background.
Soft even neutral light, minimal soft floor shadow, neutral white balance.
No city, no furniture, no story props, no cinematic environment.

CONSISTENCY:
Preserve identical age, face shape, eyes, nose, mouth, ears, hairline, hair colour, skin tone, body build, clothing and footwear across views.
Do not beautify or change age in the headshot.
Natural skin texture and asymmetry.
Accurate anatomy.
This is a FICTIONALIZED CASTING INTERPRETATION for the film and must not attempt to reproduce the real participant from the memoir.

CAMERA:
Full-body panels approximately 50–70mm full-frame equivalent, complete body including shoes.
Headshot approximately 85mm, upper shoulders upward.
Technical identity asset, not a film scene.

CHARACTER:
Fictional European legal-office professional, apparent age about 35–55, ordinary professional build and slightly rushed practical face. This person anchors the memory of someone from the appointed-defence office appearing instead of the expected named lawyer. Do not imply corruption or collusion.

Wardrobe: conservative but ordinary legal-office clothing: dark jacket or suit, pale shirt/blouse, practical shoes, small document folder if needed, no courtroom costume.

Front view: neutral upright posture, arms relaxed, neutral professional expression with slight time pressure.
Back view: exact same clothing, hairstyle and proportions.
Headshot: direct eye contact, same exact face, neutral professional expression with slight time pressure.

FINAL CHECK:
One person only.
Three panels only: front full-body / back full-body / frontal headshot.
Same exact identity and wardrobe.
Mid-grey background reaches the canvas edges.
No title or outer frame.
```

## CHARACTER 27 — JUDGE

```text
Create ONE SINGLE photorealistic technical CHARACTER IDENTITY SHEET for ONE exact fictional person.

EXACT LAYOUT:
Three vertical photographic panels filling the complete canvas:
LEFT = full-body FRONT view.
CENTER = full-body BACK view.
RIGHT = frontal CLOSE-UP HEADSHOT.

The same exact person appears in all three panels.
The studio background reaches all four physical canvas edges.
No outer frame, no title, no header, no footer, no caption bands, no labels, no extra panels.
Only hairline internal separators between the three panels.

BACKGROUND / LIGHT:
Seamless neutral MID-GREY professional casting/VFX studio background.
Soft even neutral light, minimal soft floor shadow, neutral white balance.
No city, no furniture, no story props, no cinematic environment.

CONSISTENCY:
Preserve identical age, face shape, eyes, nose, mouth, ears, hairline, hair colour, skin tone, body build, clothing and footwear across views.
Do not beautify or change age in the headshot.
Natural skin texture and asymmetry.
Accurate anatomy.
This is a FICTIONALIZED CASTING INTERPRETATION for the film and must not attempt to reproduce the real participant from the memoir.

CAMERA:
Full-body panels approximately 50–70mm full-frame equivalent, complete body including shoes.
Headshot approximately 85mm, upper shoulders upward.
Technical identity asset, not a film scene.

CHARACTER:
Fictional European judge / court official, apparent age about 45–60, ordinary professional build, intelligent controlled face, natural age lines, grounded institutional presence. This is a fictionalized non-identifiable character for the hearing memory and must not resemble any real judge.

Wardrobe: formal contemporary European courtroom professional clothing in restrained dark tones; use ordinary judicial/formal attire appropriate to the scene without theatrical robes or costume exaggeration.

Front view: neutral upright posture, arms relaxed, controlled formal expression capable of a very small later shift toward ordinary human recognition.
Back view: exact same clothing, hairstyle and proportions.
Headshot: direct eye contact, same exact face, controlled formal expression capable of a very small later shift toward ordinary human recognition.

FINAL CHECK:
One person only.
Three panels only: front full-body / back full-body / frontal headshot.
Same exact identity and wardrobe.
Mid-grey background reaches the canvas edges.
No title or outer frame.
```

## CHARACTER 28 — FORENSIC EXPERT A

```text
Create ONE SINGLE photorealistic technical CHARACTER IDENTITY SHEET for ONE exact fictional person.

EXACT LAYOUT:
Three vertical photographic panels filling the complete canvas:
LEFT = full-body FRONT view.
CENTER = full-body BACK view.
RIGHT = frontal CLOSE-UP HEADSHOT.

The same exact person appears in all three panels.
The studio background reaches all four physical canvas edges.
No outer frame, no title, no header, no footer, no caption bands, no labels, no extra panels.
Only hairline internal separators between the three panels.

BACKGROUND / LIGHT:
Seamless neutral MID-GREY professional casting/VFX studio background.
Soft even neutral light, minimal soft floor shadow, neutral white balance.
No city, no furniture, no story props, no cinematic environment.

CONSISTENCY:
Preserve identical age, face shape, eyes, nose, mouth, ears, hairline, hair colour, skin tone, body build, clothing and footwear across views.
Do not beautify or change age in the headshot.
Natural skin texture and asymmetry.
Accurate anatomy.
This is a FICTIONALIZED CASTING INTERPRETATION for the film and must not attempt to reproduce the real participant from the memoir.

CAMERA:
Full-body panels approximately 50–70mm full-frame equivalent, complete body including shoes.
Headshot approximately 85mm, upper shoulders upward.
Technical identity asset, not a film scene.

CHARACTER:
Fictional European forensic expert, apparent age about 50–65, ordinary professional build, analytical face, natural age lines, restrained institutional demeanor. This expert must be visually distinct from FORENSIC EXPERT B and must not resemble any real person.

Wardrobe: ordinary professional examination-room clothing: conservative jacket/cardigan/shirt, neutral tones, practical shoes, no lab-coat stereotype unless context specifically requires it.

Front view: neutral upright posture, arms relaxed, formal evaluative expression, restrained and non-sinister.
Back view: exact same clothing, hairstyle and proportions.
Headshot: direct eye contact, same exact face, formal evaluative expression, restrained and non-sinister.

FINAL CHECK:
One person only.
Three panels only: front full-body / back full-body / frontal headshot.
Same exact identity and wardrobe.
Mid-grey background reaches the canvas edges.
No title or outer frame.
```

## CHARACTER 29 — FORENSIC EXPERT B

```text
Create ONE SINGLE photorealistic technical CHARACTER IDENTITY SHEET for ONE exact fictional person.

EXACT LAYOUT:
Three vertical photographic panels filling the complete canvas:
LEFT = full-body FRONT view.
CENTER = full-body BACK view.
RIGHT = frontal CLOSE-UP HEADSHOT.

The same exact person appears in all three panels.
The studio background reaches all four physical canvas edges.
No outer frame, no title, no header, no footer, no caption bands, no labels, no extra panels.
Only hairline internal separators between the three panels.

BACKGROUND / LIGHT:
Seamless neutral MID-GREY professional casting/VFX studio background.
Soft even neutral light, minimal soft floor shadow, neutral white balance.
No city, no furniture, no story props, no cinematic environment.

CONSISTENCY:
Preserve identical age, face shape, eyes, nose, mouth, ears, hairline, hair colour, skin tone, body build, clothing and footwear across views.
Do not beautify or change age in the headshot.
Natural skin texture and asymmetry.
Accurate anatomy.
This is a FICTIONALIZED CASTING INTERPRETATION for the film and must not attempt to reproduce the real participant from the memoir.

CAMERA:
Full-body panels approximately 50–70mm full-frame equivalent, complete body including shoes.
Headshot approximately 85mm, upper shoulders upward.
Technical identity asset, not a film scene.

CHARACTER:
Fictional European forensic expert, apparent age about 40–60, ordinary professional build, visibly different face/hair/age from FORENSIC EXPERT A, calm analytical demeanor. This expert represents the different reaction within the two-expert examination and must not resemble any real person.

Wardrobe: ordinary professional examination-room clothing in neutral conservative tones, practical shoes, no lab-coat stereotype unless context specifically requires it.

Front view: neutral upright posture, arms relaxed, calm attentive expression, slightly more open to hearing the causal sequence.
Back view: exact same clothing, hairstyle and proportions.
Headshot: direct eye contact, same exact face, calm attentive expression, slightly more open to hearing the causal sequence.

FINAL CHECK:
One person only.
Three panels only: front full-body / back full-body / frontal headshot.
Same exact identity and wardrobe.
Mid-grey background reaches the canvas edges.
No title or outer frame.
```

## CHARACTER 30 — COURT CLERK

```text
Create ONE SINGLE photorealistic technical CHARACTER IDENTITY SHEET for ONE exact fictional person.

EXACT LAYOUT:
Three vertical photographic panels filling the complete canvas:
LEFT = full-body FRONT view.
CENTER = full-body BACK view.
RIGHT = frontal CLOSE-UP HEADSHOT.

The same exact person appears in all three panels.
The studio background reaches all four physical canvas edges.
No outer frame, no title, no header, no footer, no caption bands, no labels, no extra panels.
Only hairline internal separators between the three panels.

BACKGROUND / LIGHT:
Seamless neutral MID-GREY professional casting/VFX studio background.
Soft even neutral light, minimal soft floor shadow, neutral white balance.
No city, no furniture, no story props, no cinematic environment.

CONSISTENCY:
Preserve identical age, face shape, eyes, nose, mouth, ears, hairline, hair colour, skin tone, body build, clothing and footwear across views.
Do not beautify or change age in the headshot.
Natural skin texture and asymmetry.
Accurate anatomy.
This is a FICTIONALIZED CASTING INTERPRETATION for the film and must not attempt to reproduce the real participant from the memoir.

CAMERA:
Full-body panels approximately 50–70mm full-frame equivalent, complete body including shoes.
Headshot approximately 85mm, upper shoulders upward.
Technical identity asset, not a film scene.

CHARACTER:
Fictional European court clerk / administrative employee, apparent age about 30–55, ordinary professional build and believable everyday face. This person anchors the recording/evidence-request/telephone memory. No villain coding and no comic bureaucracy stereotype.

Wardrobe: ordinary court-administration office clothing in muted professional tones, practical shoes, simple lanyard or badge without readable personal data if needed.

Front view: neutral upright posture, arms relaxed, neutral practical expression, capable of mild surprise.
Back view: exact same clothing, hairstyle and proportions.
Headshot: direct eye contact, same exact face, neutral practical expression, capable of mild surprise.

FINAL CHECK:
One person only.
Three panels only: front full-body / back full-body / frontal headshot.
Same exact identity and wardrobe.
Mid-grey background reaches the canvas edges.
No title or outer frame.
```

## CHARACTER 31 — ANONYMOUS FICTIONAL POLITICAL FIGURE

```text
Create ONE SINGLE photorealistic technical CHARACTER IDENTITY SHEET for ONE exact fictional person.

EXACT LAYOUT:
Three vertical photographic panels filling the complete canvas:
LEFT = full-body FRONT view.
CENTER = full-body BACK view.
RIGHT = frontal CLOSE-UP HEADSHOT.

The same exact person appears in all three panels.
The studio background reaches all four physical canvas edges.
No outer frame, no title, no header, no footer, no caption bands, no labels, no extra panels.
Only hairline internal separators between the three panels.

BACKGROUND / LIGHT:
Seamless neutral MID-GREY professional casting/VFX studio background.
Soft even neutral light, minimal soft floor shadow, neutral white balance.
No city, no furniture, no story props, no cinematic environment.

CONSISTENCY:
Preserve identical age, face shape, eyes, nose, mouth, ears, hairline, hair colour, skin tone, body build, clothing and footwear across views.
Do not beautify or change age in the headshot.
Natural skin texture and asymmetry.
Accurate anatomy.
This is a FICTIONALIZED CASTING INTERPRETATION for the film and must not attempt to reproduce the real participant from the memoir.

CAMERA:
Full-body panels approximately 50–70mm full-frame equivalent, complete body including shoes.
Headshot approximately 85mm, upper shoulders upward.
Technical identity asset, not a film scene.

CHARACTER:
Fictional anonymous European male political/public figure, apparent age about 45–65, ordinary suit-wearing public-person build and generic non-identifiable face. This character exists only as an absurd cardboard/election-memory source and MUST NOT resemble any real politician, party leader or identifiable public figure.

Wardrobe: conservative dark suit, pale shirt, restrained tie; for the absurd memory a separate ridiculous colorful party-style hat may be added in the scene, but the core identity sheet itself should show the same suit without campaign branding.

Front view: neutral upright posture, arms relaxed, neutral public-facing expression, deliberately generic and non-identifiable.
Back view: exact same clothing, hairstyle and proportions.
Headshot: direct eye contact, same exact face, neutral public-facing expression, deliberately generic and non-identifiable.

FINAL CHECK:
One person only.
Three panels only: front full-body / back full-body / frontal headshot.
Same exact identity and wardrobe.
Mid-grey background reaches the canvas edges.
No title or outer frame.
```

---

> **FLOW SETTING BEFORE GENERATION: Image → Aspect ratio → 16:9. Do not leave Flow at 1:1.**

================================================================================
# OPERATOR TEXT ENDS HERE FOR THIS LIBRARY — COPY ONLY EACH `text` CODE BLOCK BELOW
================================================================================

## MEMORY WORLD 01 — LONDON / SOCIAL / HOME / DATING

```text
OUTPUT GEOMETRY — NON-NEGOTIABLE:
Generate a WIDESCREEN LANDSCAPE image with a TRUE 16:9 FINAL CANVAS, equivalent to 1920×1080.
Inside that 16:9 canvas, create ONE SINGLE FULL-BLEED 3×3 grid containing EXACTLY NINE equal photographic cells.

GRID GEOMETRY:
3 equal columns × 3 equal rows across the entire 16:9 canvas.
Each cell must be a TRUE 16:9 widescreen rectangle, equivalent to 640×360 within a 1920×1080 canvas.
DO NOT create a square 1:1 canvas.
DO NOT create square cells.
DO NOT place a square contact sheet inside a wider canvas.
DO NOT add letterboxing or pillarboxing.
The grid fills the entire canvas edge-to-edge.
Outer margin: 0 pixels.
Use only hairline 1–2 pixel gutters BETWEEN cells.
No title, header, footer, caption band, legend, decorative border or layout labels.

MEMORY-WORLD FUNCTION:
This is a CLEAN VISUAL SOURCE REFERENCE for a remembered place/event.
Show the memory scene DIRECTLY, as if the camera were physically inside the remembered world.
DO NOT show the London–Budapest present city.
DO NOT place the memory inside a taxi window, bus window, tram window, shopfront, puddle or mirror.
DO NOT add rain/reflection layers from the present city.
DO NOT add score cards.
Later STORYBOARD / VIDEO generation will take the relevant memory scene from this reference and composite it into a real reflective/transparent surface that already exists in the MAIN WORLD.

VISUAL LANGUAGE:
Photorealistic live-action European feature-film realism.
Natural human proportions, realistic contemporary wardrobe and props, ordinary practical lighting, believable interiors/exteriors.
No fantasy glow, no dream haze, no collage, no split reality, no floating UI, no symbolic surrealism.
Each cell must be a usable literal location/event reference, not an illustration of an idea.

IDENTITY ANCHORS — REQUIRED:
Use CHARACTER 01 — PROTAGONIST wherever the protagonist appears.
Use CHARACTER 02 — SOHO WOMAN in Cells 3 and any direct Soho-woman recurrence.
Use CHARACTER 06 — SHARED-HOUSE SUBSTITUTE / SNORING HOUSEMATE in Cell 6.
Use CHARACTER 07 — FX-MORTGAGE HOUSEMATE, CHARACTER 08 — FX-MORTGAGE SPOUSE and CHARACTER 09 — FX-MORTGAGE CHILD in Cell 7.
Use CHARACTER 10 — BEGINNER-DANCE WOMAN in Cell 9.
Keep every referenced identity, age, hair, body proportions and context-appropriate wardrobe stable across all relevant cells.

PURPOSE:
Build the reusable literal London-life memory source bank: Soho work/social life, cramped shared housing, ordinary relationship/dating moments and the contrast between visible profile data and the whole person.

NINE CELLS:
Cell 1 — Small realistic Soho sushi/restaurant interior during an ordinary evening. Compact London layout, warm practical light, tables close together, no glamour. The protagonist is present naturally.

Cell 2 — The same restaurant / corridor zone around the wrong-lavatory memory. A believable restaurant passage with two ordinary restroom doors and the protagonist realizing he has gone toward the wrong one. Keep the moment human and mildly awkward, not comic slapstick.

Cell 3 — The SOHO WOMAN in the same Soho context giving a small genuine human smile toward the protagonist. Natural eye line, ordinary restaurant/street-adjacent environment, no romantic glamour.

Cell 4 — Soho lunch memory with colleagues at a table eating while the protagonist sits with them and quietly pretends not to be hungry. Observational, restrained, no melodrama.

Cell 5 — Crowded low-cost London shared-house communal interior with many Hungarian adult housemates, compressed furniture, coats, shoes, bags and ordinary domestic clutter. It must feel inhabited, not dirty caricature.

Cell 6 — Cramped shared bedroom from the same house at night: beds close together, limited personal space, one sleeping arrangement replaced by another adult silhouette in the same area, visually supporting the different-snore memory. No joke staging.

Cell 7 — Ordinary memory of a Hungarian housemate living in London while spouse/child/home obligations remain in Hungary. Show a modest shared-room context with a family photograph / call / small domestic cue, not explanatory text and not a melodramatic separation scene.

Cell 8 — Dating-profile memory: the SAME unchanged photograph appears while only the age field changes visibly from 37 to 33. Keep the device/profile interface small and realistic; the face itself must not change. This is the one cell where the numerals 37 and 33 may be clearly readable.

Cell 9 — Beginner dance-floor / social-room memory: ordinary adults learning or dancing imperfectly, the protagonist participating without glamour or performance-show staging. Warm human context, natural awkwardness, possibility of connection without guaranteed romance.

FINAL CHECK:
Exactly one 16:9 image.
Exactly nine 16:9 photographic cells in a 3×3 grid.
Every cell is a DIRECT memory-world scene, never a reflection.
No present London–Budapest hybrid city layer.
No score cards.
```


---

> **FLOW SETTING BEFORE GENERATION: Image → Aspect ratio → 16:9. Do not leave Flow at 1:1.**

## MEMORY WORLD 02 — GLOBAL ROUTES / HUMAN ENCOUNTERS

```text
OUTPUT GEOMETRY — NON-NEGOTIABLE:
Generate a WIDESCREEN LANDSCAPE image with a TRUE 16:9 FINAL CANVAS, equivalent to 1920×1080.
Inside that 16:9 canvas, create ONE SINGLE FULL-BLEED 3×3 grid containing EXACTLY NINE equal photographic cells.

GRID GEOMETRY:
3 equal columns × 3 equal rows across the entire 16:9 canvas.
Each cell must be a TRUE 16:9 widescreen rectangle, equivalent to 640×360 within a 1920×1080 canvas.
DO NOT create a square 1:1 canvas.
DO NOT create square cells.
DO NOT place a square contact sheet inside a wider canvas.
DO NOT add letterboxing or pillarboxing.
The grid fills the entire canvas edge-to-edge.
Outer margin: 0 pixels.
Use only hairline 1–2 pixel gutters BETWEEN cells.
No title, header, footer, caption band, legend, decorative border or layout labels.

MEMORY-WORLD FUNCTION:
This is a CLEAN VISUAL SOURCE REFERENCE for a remembered place/event.
Show the memory scene DIRECTLY, as if the camera were physically inside the remembered world.
DO NOT show the London–Budapest present city.
DO NOT place the memory inside a taxi window, bus window, tram window, shopfront, puddle or mirror.
DO NOT add rain/reflection layers from the present city.
DO NOT add score cards.
Later STORYBOARD / VIDEO generation will take the relevant memory scene from this reference and composite it into a real reflective/transparent surface that already exists in the MAIN WORLD.

VISUAL LANGUAGE:
Photorealistic live-action European feature-film realism.
Natural human proportions, realistic contemporary wardrobe and props, ordinary practical lighting, believable interiors/exteriors.
No fantasy glow, no dream haze, no collage, no split reality, no floating UI, no symbolic surrealism.
Each cell must be a usable literal location/event reference, not an illustration of an idea.

IDENTITY ANCHORS — REQUIRED:
Use CHARACTER 01 — PROTAGONIST wherever the protagonist appears.
Use CHARACTER 11 — RUSSIAN TRANSIT PASSENGER in Cell 1.
Use CHARACTER 12 — AGRA BUS WOMAN in Cell 2.
Use CHARACTER 13 — SUDANESE TRAVELER — MAN and CHARACTER 14 — SUDANESE TRAVELER — WOMAN in Cell 3 and, if they remain present, Cell 4.
Use CHARACTER 15 — CAIRO TAXI DRIVER in Cells 3–4 when the driver is visible.
Use CHARACTER 16 — BALLOON LOCAL HELPER — MAN and CHARACTER 17 — BALLOON LOCAL HELPER — WOMAN in Cell 5.
Use CHARACTER 18 — BARMOUTH ROAD-TRIP DRIVER / COMPANION plus CHARACTER 19–21 — BARMOUTH ROAD-TRIP COMPANIONS in Cell 9 when the traveling group is visible.
Background passengers/crowds may remain anonymous, but do not replace any of the named character-reference identities above.

PURPOSE:
Build the reusable literal travel-memory source bank around the principle: Global route. Local encounter. The important subject is ordinary human contact inside movement, not postcard tourism.

NINE CELLS:
Cell 1 — Moscow / Saint Petersburg metro or transit-gate memory. A local passenger calmly uses a monthly travel card/pass to help the protagonist through a gate. Ordinary station, realistic crowd, no heroic gesture.

Cell 2 — India / Agra bus interior. The protagonist sits among ordinary passengers while a woman speaks from behind or across the seat. Human proximity and voice are central; avoid iconic monument imagery and exoticized styling.

Cell 3 — Cairo taxi interior with the protagonist sharing the ride with a Sudanese couple. Tight but ordinary vehicle interior, temporary trust between strangers, warm human realism.

Cell 4 — Airport/roadside continuation of the Cairo trip: luggage unexpectedly falls from the taxi roof and people react practically. Capture surprise and immediate problem-solving, not slapstick.

Cell 5 — Hot-air-balloon landing in a vegetable plot near a low wall. Passengers/local people cooperate hand-to-hand to solve the situation. Real dirt, plants, basket, fabric and human effort; no fantasy balloon spectacle.

Cell 6 — Literal route-memory fragment: a rural field edge meeting railway track, the visual origin of a long route. Keep it grounded and photographic, not a graphic transition.

Cell 7 — Budapest tram-wire / rail-memory fragment viewed from an ordinary street perspective, emphasizing physical route lines and infrastructure rather than landmark tourism.

Cell 8 — Wet bus/coach window on a mountain or long-distance route, with real landscape beyond and a passenger reflection only if naturally produced by that remembered vehicle itself. This is still the remembered world, not the present London–Budapest city.

Cell 9 — Barmouth / North-Wales low-tide memory: broad exposed shore, town held against the slope, ordinary travelers at human scale. No postcard saturation, no tourism-ad composition.

FINAL CHECK:
Exactly one 16:9 image.
Exactly nine 16:9 photographic cells in a 3×3 grid.
Direct literal travel memories only.
No present-city reflection composite.
No score cards.
```


---

> **FLOW SETTING BEFORE GENERATION: Image → Aspect ratio → 16:9. Do not leave Flow at 1:1.**

## MEMORY WORLD 03 — WORK / ACCOUNTING / KATA / ADMIN

```text
OUTPUT GEOMETRY — NON-NEGOTIABLE:
Generate a WIDESCREEN LANDSCAPE image with a TRUE 16:9 FINAL CANVAS, equivalent to 1920×1080.
Inside that 16:9 canvas, create ONE SINGLE FULL-BLEED 3×3 grid containing EXACTLY NINE equal photographic cells.

GRID GEOMETRY:
3 equal columns × 3 equal rows across the entire 16:9 canvas.
Each cell must be a TRUE 16:9 widescreen rectangle, equivalent to 640×360 within a 1920×1080 canvas.
DO NOT create a square 1:1 canvas.
DO NOT create square cells.
DO NOT place a square contact sheet inside a wider canvas.
DO NOT add letterboxing or pillarboxing.
The grid fills the entire canvas edge-to-edge.
Outer margin: 0 pixels.
Use only hairline 1–2 pixel gutters BETWEEN cells.
No title, header, footer, caption band, legend, decorative border or layout labels.

MEMORY-WORLD FUNCTION:
This is a CLEAN VISUAL SOURCE REFERENCE for a remembered place/event.
Show the memory scene DIRECTLY, as if the camera were physically inside the remembered world.
DO NOT show the London–Budapest present city.
DO NOT place the memory inside a taxi window, bus window, tram window, shopfront, puddle or mirror.
DO NOT add rain/reflection layers from the present city.
DO NOT add score cards.
Later STORYBOARD / VIDEO generation will take the relevant memory scene from this reference and composite it into a real reflective/transparent surface that already exists in the MAIN WORLD.

VISUAL LANGUAGE:
Photorealistic live-action European feature-film realism.
Natural human proportions, realistic contemporary wardrobe and props, ordinary practical lighting, believable interiors/exteriors.
No fantasy glow, no dream haze, no collage, no split reality, no floating UI, no symbolic surrealism.
Each cell must be a usable literal location/event reference, not an illustration of an idea.

IDENTITY ANCHORS — REQUIRED:
Use CHARACTER 01 — PROTAGONIST wherever the protagonist appears.
Use CHARACTER 22 — ACCOUNTANT in accounting/delegation/repair scenes.
Use CHARACTER 23 — ADMIN COLLEAGUE A and CHARACTER 24 — ADMIN COLLEAGUE B together with the protagonist in the three-people / no-shared-screen triangle.
Do not redesign or substitute these people between cells. Other background office workers may remain anonymous. Nobody is visually coded as a villain.

PURPOSE:
Build the literal work/system memory source bank: cross-border remote work, long days, accounting delegation, forms, portal responsibility, inconsistent records and the low-trust triangle of three people without one shared screen.

NINE CELLS:
Cell 1 — Ordinary cross-border remote-work setup: protagonist on a professional call / computer task connected to an international contract. Real desk, laptop/monitor, notes, restrained workday atmosphere, no heroic tech montage.

Cell 2 — Late long-workday memory suggesting 13–15-hour pressure: same ordinary workspace later in the day, tired posture, practical desk light, unfinished task, calendar and clock cues without melodrama.

Cell 3 — Accounting/admin desk with invoice, calendar, printer, forms and ordinary paperwork while live work continues nearby. The need for professional delegation should be visible through context, not explanatory graphics.

Cell 4 — The core 'three people / no shared screen' memory. Three people physically near one administrative problem, each looking at a different screen/document version. Clear triangular or three-way composition, no one malicious.

Cell 5 — KATA / rule-change memory expressed through an ordinary calendar/date, government-style notification/letter and a return/form that suddenly needs action or correction. Keep most text unreadable; do not turn it into a political poster.

Cell 6 — Accountant / portal / delegated-action memory: hands, login screen, paperwork and responsibility passing between people. No cybersecurity holograms, no hacking visuals.

Cell 7 — Repair attempt by phone: protagonist calls for clarification while another person checks a different record. Ordinary office/home-work setting, practical frustration, no shouting.

Cell 8 — Multiple ordinary communication endpoints: desk phone, mobile, email/portal screen, printed form, different people each holding part of the process. Show fragmentation through physical objects, not abstract arrows.

Cell 9 — Correction-chain memory: a previously inconsistent return/form, marked correction, resubmission or updated record, with the protagonist still trying to keep work and administration aligned. Grounded and procedural.

FINAL CHECK:
Exactly one 16:9 image.
Exactly nine 16:9 photographic cells in a 3×3 grid.
Direct work/admin memories only.
No present-city reflection composite.
No score cards.
```


---

> **FLOW SETTING BEFORE GENERATION: Image → Aspect ratio → 16:9. Do not leave Flow at 1:1.**

## MEMORY WORLD 04 — POLICE / SEARCH / DEFENCE

```text
OUTPUT GEOMETRY — NON-NEGOTIABLE:
Generate a WIDESCREEN LANDSCAPE image with a TRUE 16:9 FINAL CANVAS, equivalent to 1920×1080.
Inside that 16:9 canvas, create ONE SINGLE FULL-BLEED 3×3 grid containing EXACTLY NINE equal photographic cells.

GRID GEOMETRY:
3 equal columns × 3 equal rows across the entire 16:9 canvas.
Each cell must be a TRUE 16:9 widescreen rectangle, equivalent to 640×360 within a 1920×1080 canvas.
DO NOT create a square 1:1 canvas.
DO NOT create square cells.
DO NOT place a square contact sheet inside a wider canvas.
DO NOT add letterboxing or pillarboxing.
The grid fills the entire canvas edge-to-edge.
Outer margin: 0 pixels.
Use only hairline 1–2 pixel gutters BETWEEN cells.
No title, header, footer, caption band, legend, decorative border or layout labels.

MEMORY-WORLD FUNCTION:
This is a CLEAN VISUAL SOURCE REFERENCE for a remembered place/event.
Show the memory scene DIRECTLY, as if the camera were physically inside the remembered world.
DO NOT show the London–Budapest present city.
DO NOT place the memory inside a taxi window, bus window, tram window, shopfront, puddle or mirror.
DO NOT add rain/reflection layers from the present city.
DO NOT add score cards.
Later STORYBOARD / VIDEO generation will take the relevant memory scene from this reference and composite it into a real reflective/transparent surface that already exists in the MAIN WORLD.

VISUAL LANGUAGE:
Photorealistic live-action European feature-film realism.
Natural human proportions, realistic contemporary wardrobe and props, ordinary practical lighting, believable interiors/exteriors.
No fantasy glow, no dream haze, no collage, no split reality, no floating UI, no symbolic surrealism.
Each cell must be a usable literal location/event reference, not an illustration of an idea.

IDENTITY ANCHORS — REQUIRED:
Use CHARACTER 01 — PROTAGONIST wherever the protagonist appears.
Use CHARACTER 03 — POLICEWOMAN for the recurring policewoman, especially Cells 6 and 9.
Use CHARACTER 04 — APPOINTED LAWYER only where that recurring lawyer is intended.
Use CHARACTER 25 — SEARCH OFFICER — MALE in the apartment-search sequence, especially the accidental-foot-step memory.
Use CHARACTER 26 — DEFENCE-OFFICE SUBSTITUTE for the discontinuous appointed-defence handoff in Cell 7.
Other background officers may remain anonymous, but do not replace or merge the fixed identities above.

PURPOSE:
Build the literal police/procedure memory source bank. The tone is ordinary institutional reality containing moments of vulnerability, confusion and humanity — not an action thriller and not a conspiracy tableau.

NINE CELLS:
Cell 1 — Apartment-entry memory before the search: ordinary residential door/intercom context, someone outside announces themselves as a postman and the door is opened. Do not render the spoken word as a caption.

Cell 2 — Immediate continuation: ordinary police officers enter the apartment after the door opens. Calm procedural movement, no tactical-raid spectacle, no weapons emphasis.

Cell 3 — Apartment search in progress. Officers inspect ordinary rooms and belongings while the protagonist is present. Real domestic space, restrained procedure, no evidence-wall aesthetic.

Cell 4 — Search moment in which one officer is visibly speaking the remembered line about looking for cocaine. Do not place dialogue text on screen; the scene remains ordinary and procedural, with no drug glamorization.

Cell 5 — Continuation in the apartment: an officer accidentally steps on the protagonist's recently operated foot. Sudden physical pain and vulnerability, no gore, no medical reveal, no exaggerated violence.

Cell 6 — Fingerprinting / formal processing with the recurring POLICEWOMAN. The procedure is ordinary. Include the awkward contradiction of attraction / embarrassed human expression without romantic staging.

Cell 7 — Appointed-defence discontinuity: a substitute/person from the defence office appears instead of the expected lawyer, or a handoff between defence contacts is visibly unclear. Show discontinuity, not villainy.

Cell 8 — Attempts to reach police/prosecution/court/defence routes by phone and in corridors/offices. Different ordinary people redirect the protagonist; no one appears sinister.

Cell 9 — Human break-through inside procedure: the POLICEWOMAN or another officer struggles not to laugh / gives a small embarrassed smile during a formal moment. Nothing procedural changes; the role and the person briefly coexist.

FINAL CHECK:
Exactly one 16:9 image.
Exactly nine 16:9 photographic cells in a 3×3 grid.
Direct literal police/defence memories only.
No present-city reflection composite.
No score cards.
```


---

> **FLOW SETTING BEFORE GENERATION: Image → Aspect ratio → 16:9. Do not leave Flow at 1:1.**

## MEMORY WORLD 05 — COURT / FILE / ASSETS / BLACK HUMOUR

```text
OUTPUT GEOMETRY — NON-NEGOTIABLE:
Generate a WIDESCREEN LANDSCAPE image with a TRUE 16:9 FINAL CANVAS, equivalent to 1920×1080.
Inside that 16:9 canvas, create ONE SINGLE FULL-BLEED 3×3 grid containing EXACTLY NINE equal photographic cells.

GRID GEOMETRY:
3 equal columns × 3 equal rows across the entire 16:9 canvas.
Each cell must be a TRUE 16:9 widescreen rectangle, equivalent to 640×360 within a 1920×1080 canvas.
DO NOT create a square 1:1 canvas.
DO NOT create square cells.
DO NOT place a square contact sheet inside a wider canvas.
DO NOT add letterboxing or pillarboxing.
The grid fills the entire canvas edge-to-edge.
Outer margin: 0 pixels.
Use only hairline 1–2 pixel gutters BETWEEN cells.
No title, header, footer, caption band, legend, decorative border or layout labels.

MEMORY-WORLD FUNCTION:
This is a CLEAN VISUAL SOURCE REFERENCE for a remembered place/event.
Show the memory scene DIRECTLY, as if the camera were physically inside the remembered world.
DO NOT show the London–Budapest present city.
DO NOT place the memory inside a taxi window, bus window, tram window, shopfront, puddle or mirror.
DO NOT add rain/reflection layers from the present city.
DO NOT add score cards.
Later STORYBOARD / VIDEO generation will take the relevant memory scene from this reference and composite it into a real reflective/transparent surface that already exists in the MAIN WORLD.

VISUAL LANGUAGE:
Photorealistic live-action European feature-film realism.
Natural human proportions, realistic contemporary wardrobe and props, ordinary practical lighting, believable interiors/exteriors.
No fantasy glow, no dream haze, no collage, no split reality, no floating UI, no symbolic surrealism.
Each cell must be a usable literal location/event reference, not an illustration of an idea.

IDENTITY ANCHORS — REQUIRED:
Use CHARACTER 01 — PROTAGONIST wherever the protagonist appears.
Use CHARACTER 04 — APPOINTED LAWYER where relevant.
Use CHARACTER 27 — JUDGE in the court-hearing memory.
Use CHARACTER 28 — FORENSIC EXPERT A and CHARACTER 29 — FORENSIC EXPERT B together in the two-expert examination memory.
Use CHARACTER 30 — COURT CLERK in the recording/evidence-request memory.
Use CHARACTER 31 — ANONYMOUS FICTIONAL POLITICAL FIGURE for the cardboard/election absurdity memory; it must remain non-identifiable and must not resemble a real politician.

PURPOSE:
Build the literal court/file/classification memory source bank: hearing, assets, retained belongings, forensic examination, documents replacing biography, complaint routes and black humour used as a human response to an absurd process.

NINE CELLS:
Cell 1 — Court-hearing memory with an anonymous judge addressing the protagonist during a debate over legal classification. The remembered prison-question moment is carried by facial/body language; do not render subtitles or dialogue text.

Cell 2 — Questions about the Budapest apartment, belongings, savings and what else the protagonist owns. Show an ordinary hearing/desk context with small visual inserts of home/property only as literal items being discussed, not a crime montage.

Cell 3 — Retained devices/belongings: phone, laptop, storage media or personal property handled in ordinary evidence/property boxes or administrative packaging. No thriller evidence wall.

Cell 4 — 'Person becomes file' reference: photograph, fingerprint sheet, signature, forms and closed folder arranged on a desk while the protagonist is physically present but visually less dominant.

Cell 5 — Forensic-examination memory with two expert chairs / two experts. The protagonist is calm and cooperative; the experts' reactions differ. Do not imply a single unified expert voice.

Cell 6 — Clerk / recording / evidence-request memory: phone, hearing paperwork, request for official recording or witnesses/evidence, and the practical response that the route is costly or deferred. Keep written text mostly unreadable.

Cell 7 — Black-humour memory source: a small self-made 'KATA's most wanted' satirical visual and/or impossible police-career CV/application joke on a desk or screen. Keep it clearly self-made satire, not official propaganda, and avoid large readable text.

Cell 8 — Political absurdity memory source: anonymous cardboard political figure / election-related scene with a deliberately ridiculous hat and the tone of an asylum-request joke. No real politician likeness, no identifiable party branding, no advocacy.

Cell 9 — Decision/appeal-route memory: ordinary posted ruling/letter, phone, folders and the sense of a future complaint/appeal/Strasbourg route replacing immediate correction. Focus on process and human scale, not readable legal exposition.

FINAL CHECK:
Exactly one 16:9 image.
Exactly nine 16:9 photographic cells in a 3×3 grid.
Direct literal court/file/black-humour memories only.
No present-city reflection composite.
No score cards.
```


---

> **FLOW SETTING BEFORE GENERATION: Image → Aspect ratio → 16:9. Do not leave Flow at 1:1.**

## MEMORY WORLD 06 — HUMANITY BREAKS THROUGH / RECURRING POSITIVE COUNTERMEMORIES

```text
OUTPUT GEOMETRY — NON-NEGOTIABLE:
Generate a WIDESCREEN LANDSCAPE image with a TRUE 16:9 FINAL CANVAS, equivalent to 1920×1080.
Inside that 16:9 canvas, create ONE SINGLE FULL-BLEED 3×3 grid containing EXACTLY NINE equal photographic cells.

GRID GEOMETRY:
3 equal columns × 3 equal rows across the entire 16:9 canvas.
Each cell must be a TRUE 16:9 widescreen rectangle, equivalent to 640×360 within a 1920×1080 canvas.
DO NOT create a square 1:1 canvas.
DO NOT create square cells.
DO NOT place a square contact sheet inside a wider canvas.
DO NOT add letterboxing or pillarboxing.
The grid fills the entire canvas edge-to-edge.
Outer margin: 0 pixels.
Use only hairline 1–2 pixel gutters BETWEEN cells.
No title, header, footer, caption band, legend, decorative border or layout labels.

MEMORY-WORLD FUNCTION:
This is a CLEAN VISUAL SOURCE REFERENCE for a remembered place/event.
Show the memory scene DIRECTLY, as if the camera were physically inside the remembered world.
DO NOT show the London–Budapest present city.
DO NOT place the memory inside a taxi window, bus window, tram window, shopfront, puddle or mirror.
DO NOT add rain/reflection layers from the present city.
DO NOT add score cards.
Later STORYBOARD / VIDEO generation will take the relevant memory scene from this reference and composite it into a real reflective/transparent surface that already exists in the MAIN WORLD.

VISUAL LANGUAGE:
Photorealistic live-action European feature-film realism.
Natural human proportions, realistic contemporary wardrobe and props, ordinary practical lighting, believable interiors/exteriors.
No fantasy glow, no dream haze, no collage, no split reality, no floating UI, no symbolic surrealism.
Each cell must be a usable literal location/event reference, not an illustration of an idea.

IDENTITY ANCHORS — REQUIRED:
Use CHARACTER 01 — PROTAGONIST.
Use CHARACTER 02 — SOHO WOMAN in Cell 1.
Use CHARACTER 11 — RUSSIAN TRANSIT PASSENGER in Cell 2.
Use CHARACTER 16 — BALLOON LOCAL HELPER — MAN and CHARACTER 17 — BALLOON LOCAL HELPER — WOMAN in Cell 3.
Use CHARACTER 03 — POLICEWOMAN in Cell 4.
Use CHARACTER 04 — APPOINTED LAWYER in Cell 5.
Use CHARACTER 27 — JUDGE and/or CHARACTER 28–29 — FORENSIC EXPERTS in Cell 6 as specified by the selected memory.
Use CHARACTER 10 — BEGINNER-DANCE WOMAN in Cell 7.
Keep every identity consistent with its original MEMORY WORLD version. Do not create replacement faces.

PURPOSE:
Create one compact reusable source bank for the late-film memory crescendo, so STORYBOARD 06 / video generation can use ONE memory reference instead of attaching many different memory-world sheets at once.
These are not new events. They are clean re-stagings of already established literal memories in which ordinary humanity briefly breaks through a role, route or system.

NINE CELLS:
Cell 1 — SOHO WOMAN's small genuine smile toward the protagonist in the established Soho context.

Cell 2 — Russian/local passenger calmly using a travel pass to help the protagonist through the transit gate.

Cell 3 — Hot-air-balloon / vegetable-plot cooperation: hands and people helping one another solve the landing problem.

Cell 4 — POLICEWOMAN or another officer giving an embarrassed small human smile / struggling not to laugh during an otherwise formal procedure.

Cell 5 — Appointed lawyer / defence-room moment showing ordinary discomfort, practical help or a request to move to another room; no hero framing.

Cell 6 — Judge/expert/official expression changing for a moment from formal role to ordinary human recognition. Anonymous official, restrained warmth.

Cell 7 — Beginner dance-floor memory: awkward real participation and brief mutual attention, no glamour.

Cell 8 — Six ordinary people around a real table / shared activity setting, faces and voices finally larger than profile cards. Natural conversation, no product-ad feeling.

Cell 9 — Quiet composite SOURCE MOMENT staged as one real room, not a collage: protagonist among several ordinary people from different contexts, each behaving as a person rather than a role. Keep it plausible, grounded and human.

FINAL CHECK:
Exactly one 16:9 image.
Exactly nine 16:9 photographic cells in a 3×3 grid.
These are direct memory scenes, not reflections and not a collage.
No present-city layer.
No score cards.
```


---

> **FLOW SETTING BEFORE GENERATION: Image → Aspect ratio → 16:9. Do not leave Flow at 1:1.**

## HIDDEN REALITY WORLD 07 — CLINICAL ROOM / FINAL REVEAL ONLY

```text
OUTPUT GEOMETRY — NON-NEGOTIABLE:
Generate a WIDESCREEN LANDSCAPE image with a TRUE 16:9 FINAL CANVAS, equivalent to 1920×1080.
Inside that 16:9 canvas, create ONE SINGLE FULL-BLEED 3×3 grid containing EXACTLY NINE equal photographic cells.

GRID GEOMETRY:
3 equal columns × 3 equal rows across the entire 16:9 canvas.
Each cell must be a TRUE 16:9 widescreen rectangle, equivalent to 640×360 within a 1920×1080 canvas.
DO NOT create a square 1:1 canvas.
DO NOT create square cells.
DO NOT place a square contact sheet inside a wider canvas.
DO NOT add letterboxing or pillarboxing.
The grid fills the entire canvas edge-to-edge.
Outer margin: 0 pixels.
Use only hairline 1–2 pixel gutters BETWEEN cells.
No title, header, footer, caption band, legend, decorative border or layout labels.

MEMORY-WORLD FUNCTION:
This is a CLEAN VISUAL SOURCE REFERENCE for a remembered place/event.
Show the memory scene DIRECTLY, as if the camera were physically inside the remembered world.
DO NOT show the London–Budapest present city.
DO NOT place the memory inside a taxi window, bus window, tram window, shopfront, puddle or mirror.
DO NOT add rain/reflection layers from the present city.
DO NOT add score cards.
Later STORYBOARD / VIDEO generation will take the relevant memory scene from this reference and composite it into a real reflective/transparent surface that already exists in the MAIN WORLD.

VISUAL LANGUAGE:
Photorealistic live-action European feature-film realism.
Natural human proportions, realistic contemporary wardrobe and props, ordinary practical lighting, believable interiors/exteriors.
No fantasy glow, no dream haze, no collage, no split reality, no floating UI, no symbolic surrealism.
Each cell must be a usable literal location/event reference, not an illustration of an idea.

CRITICAL ROLE:
This is NOT a normal memory world. It is the hidden physical reality used ONLY in STORYBOARD 07 and the final video reveal.
Do not reference or expose this world in STORYBOARD 01–06.

IDENTITY ANCHORS — REQUIRED:
Use CHARACTER 01 — PROTAGONIST as the exact patient identity.
Use CHARACTER 05 — FINAL NURSE as the exact nurse identity.
Do not substitute or redesign either person in the reveal.

CLINICAL TONE:
Ordinary contemporary European clinical room.
Cold-neutral institutional light, practical equipment, clean but not futuristic.
No horror, no gore, no sinister staff, no psychiatric-horror coding, no supernatural quality.
The protagonist is conscious; he does NOT wake up.
One leg is elevated and immobilized.
One arm is restrained.
The nurse is calm, competent and ordinary, with a small genuine everyday smile.
Any enema/endoscopy-related preparation is routine and NON-GRAPHIC; no invasive detail.

NINE CELLS:
Cell 1 — Wide establishing view of the entire ordinary clinical room, showing bed, practical furniture, cold-neutral light and enough spatial layout for later shot continuity.

Cell 2 — Medium-wide side view of the protagonist lying conscious in bed, one leg elevated/immobilized, body physically vulnerable but calm.

Cell 3 — Close physical reference of the elevated/immobilized leg and supporting equipment, non-graphic and clinically ordinary.

Cell 4 — Close physical reference of the restrained arm / metal restraint with white-sheet edge, non-graphic, no punishment aesthetic.

Cell 5 — FINAL NURSE in the room preparing routine non-graphic clinical equipment for an enema/endoscopy-related procedure. Competent, ordinary, no menace.

Cell 6 — Nurse close/medium reference with the small everyday human smile that can echo earlier institutional smiles.

Cell 7 — Clinical white-coat / cold-light fragment composition designed so only a tiny crop could plausibly appear in a pre-reveal reflection without exposing the full room.

Cell 8 — Fragment composition combining a small portion of elevated leg, white sheet and metal restraint, again suitable for a sub-second cropped pre-reveal glimpse while still originating from this real room.

Cell 9 — Final restrained two-shot / eyeline composition: protagonist looks toward the nurse; she remains ordinary and human; room tone and stillness implied. This is the basis for the final hold before black.

FINAL CHECK:
Exactly one 16:9 image.
Exactly nine 16:9 photographic cells in a 3×3 grid.
No score cards.
No dream effects.
No London–Budapest city.
This reference is forbidden before STORYBOARD 07.
```


---

================================================================================
# OPERATOR TEXT ENDS HERE FOR THIS LIBRARY — COPY ONLY EACH `text` CODE BLOCK BELOW
================================================================================

## WORLD 01 — 00:00–00:30 — THE CITY JUDGES FIRST — SOHO / PICCADILLY / LEICESTER

```text
OUTPUT GEOMETRY — NON-NEGOTIABLE:
Generate a WIDESCREEN LANDSCAPE image with a TRUE 16:9 FINAL CANVAS, equivalent to 1920×1080.
Inside that 16:9 canvas, create ONE SINGLE FULL-BLEED 3×3 grid containing EXACTLY NINE equal photographic cells.

GRID GEOMETRY:
3 equal columns × 3 equal rows across the entire 16:9 canvas.
Each photographic cell must therefore be a TRUE 16:9 widescreen rectangle, equivalent to 640×360 within a 1920×1080 canvas.
DO NOT create a square 1:1 canvas.
DO NOT create square cells.
DO NOT place a square 3×3 contact sheet inside a wider canvas.
DO NOT add letterboxing or pillarboxing.
The 3×3 grid itself must fill the entire 16:9 canvas edge-to-edge.

The nine photographic cells occupy 100% of the final canvas and touch all four physical canvas edges.
Outer margin: 0 pixels.
Use only hairline 1–2 pixel gutters BETWEEN adjacent cells.
No title area, no header, no footer, no caption bands, no legend, no decorative framing, no unused space.
Do not render cell numbers or layout labels.
In-world shop, street and transit signage is allowed and REQUIRED where specified below.

All nine cells depict the SAME continuous photorealistic London–Budapest dream metropolis at the SAME late rainy evening continuity.

PHYSICAL-PRESENT RULE:
Every camera position is outside in public pedestrian space: street, pavement, plaza, bridge, river walk, open-air or publicly open passage.
The current camera never becomes an office-room camera, bedroom camera, police-room camera, courtroom camera or clinical-room camera.
Interior depth may be visible THROUGH real street-facing glass, but only as architectural depth.
No literal memory event is visible in this WORLD asset.

CITY FUSION RULE:
London must remain immediately recognizable through street geometry, road proportions, junctions, pavements, red double-decker buses, black taxis, London street furniture and landmark relationships.
Budapest/Hungary must be equally unmistakable through EXPLICIT named architectural anchors, yellow Budapest trams, tram/trolley wires, Hungarian signage and selected Budapest buildings physically replacing or fusing with London blocks.
Do not reduce Budapest to generic Central-European façades.
Do not separate London and Budapest into different districts.
Nobody reacts to the fusion.

TRANSPORT:
Use red London double-decker buses, black London taxis and yellow Budapest trams naturally.
Tram rails share London road geometry; London road markings may cross the rails; Budapest tram/trolley wires attach directly to fused façades.
At least one of the first six cells must show a substantial side view of a red double-decker and at least one must show a substantial side view of a yellow tram so their windows are usable later.

MEMORY-COMPOSITING PREPARATION:
Include broad physically realistic vehicle windows, shopfront/cultural glass, entrance glass and wet reflective surfaces naturally where specified by the cells below.
These are only the PHYSICAL PRESENT surfaces.
This MAIN WORLD contains NO narrative memory scene and NO score cards.
The remembered content will come later from separate MEMORY WORLD references during STORYBOARD / VIDEO generation.

LIGHTING / PHOTOGRAPHY:
Rainy blue hour progressing toward night.
Cool blue-grey exterior; warm tungsten cafés/restaurants; warm-neutral public interiors; realistic vehicle practicals.
Photorealistic live-action European feature-film location photography.
Environment views: approximately 28mm full-frame equivalent, camera height about 1.6 m.
Detail views: approximately 35–50mm.
ARRI Alexa LF photographic character, natural Cooke-style rendering, soft highlight roll-off, rich shadow detail, fine organic film grain, real wet stone, real glass, real transport materials.
No fantasy glow, no psychedelic haze, no game-engine appearance, no obvious sci-fi interface.

NINE-CELL FUNCTION:
Cells 1–6 = six exterior environment views along this section of the walk.
Cell 7 = major glass / reflection-surface technical detail.
Cell 8 = moving transit-window technical detail.
Cell 9 = fused London–Budapest architecture + in-world signage technical detail.

WORLD-SPECIFIC CONTENT:
Cell 1 — Soho / Brewer Street / Old Compton Street after rain. Narrow recognizable London street geometry, pubs, cafés, bookshop and theatre frontage. A deep street-axis sightline terminates naturally in the dome and twin towers of ST STEPHEN'S BASILICA, integrated at believable urban scale rather than pasted into the background. Visible mixed signage includes KÖNYV and KÁVÉ beside normal English shop signs. 10–20 anonymous pedestrians.

Cell 2 — Same Soho world from another angle. British pub and restaurant ground floors beneath ornate Pest limestone upper floors and balconies. A black taxi is close enough for a broad wet side window; a yellow Budapest tram appears deeper in the street under trolley/tram wires. One small Hungarian BEJÁRAT sign is naturally integrated.

Cell 3 — Immediately recognizable PICCADILLY CIRCUS: very wide multi-street junction, curved classical London blocks, broad pedestrian areas and the Shaftesbury Memorial / Eros winged statue clearly present and NOT replaced. One curved Piccadilly block keeps its London footprint but carries ANDRÁSSY AVENUE / Pest palatial façade language. 25–40 pedestrians.

Cell 4 — Piccadilly transport view. A full-size red London double-decker occupies roughly 15–25% of the frame width in substantial SIDE VIEW with large clean windows; separately readable yellow Budapest tram and black taxi in the same junction. London road markings cross tram rails naturally. Hungarian tram wires span the Piccadilly geometry.

Cell 5 — Coventry Street / Leicester Square cinema-theatre district. Large cinema lobbies, marquees, restaurants, wet plaza and strong glazing. One entire theatre/cultural block uses BUDAPEST NATIONAL THEATRE-inspired architecture adapted to the London footprint. Visible in-world MOZI and SZÍNHÁZ signs sit naturally among English cinema/theatre signage. 20–35 pedestrians.

Cell 6 — Leicester / Haymarket-side public space. Keep the West End geometry, but include one KOSSUTH-STYLE HUNGARIAN CIVIC MONUMENT as a normal permanent public monument, clearly separate from Eros. Continue red bus / yellow tram / black taxi traces and reflective public glazing.

Cell 7 — Close detail of a very large cinema or shopfront pane from this exact world: fine rain droplets, cool city reflection, warm lobby depth, fragments of red bus / yellow tram / black taxi reflected simultaneously. No memory content.

Cell 8 — Close transit detail: broad red double-decker side windows, broad yellow Budapest tram side windows and black taxi glass all readable; wet rails and London road markings visible.

Cell 9 — Close architecture/signage detail of ONE coherent fused block: London pub/cinema/bookshop ground floor; Budapest limestone upper storeys, balconies and roof detail; tram-wire attachment; restrained readable Hungarian KÖNYV, KÁVÉ or BEJÁRAT beside English signage. The building must look historically native to one city.

FINAL CHECK:
Exactly one image.
Exactly nine equal photographic cells in a 3×3 grid.
0 px outer margin.
Only 1–2 px internal gutters.
No presentation title/caption/legend/frame.
All current camera positions remain exterior/public.
Budapest must be specifically recognizable through the named anchors above, not genericized.
```


> **FLOW SETTING BEFORE GENERATION: Image → Aspect ratio → 16:9. Do not leave Flow at 1:1.**

## WORLD 02 — 00:30–01:00 — ROUTES / PASSAGES — CHARING CROSS / STRAND / ALDWYCH / EMBANKMENT

```text
OUTPUT GEOMETRY — NON-NEGOTIABLE:
Generate a WIDESCREEN LANDSCAPE image with a TRUE 16:9 FINAL CANVAS, equivalent to 1920×1080.
Inside that 16:9 canvas, create ONE SINGLE FULL-BLEED 3×3 grid containing EXACTLY NINE equal photographic cells.

GRID GEOMETRY:
3 equal columns × 3 equal rows across the entire 16:9 canvas.
Each photographic cell must therefore be a TRUE 16:9 widescreen rectangle, equivalent to 640×360 within a 1920×1080 canvas.
DO NOT create a square 1:1 canvas.
DO NOT create square cells.
DO NOT place a square 3×3 contact sheet inside a wider canvas.
DO NOT add letterboxing or pillarboxing.
The 3×3 grid itself must fill the entire 16:9 canvas edge-to-edge.

The nine photographic cells occupy 100% of the final canvas and touch all four physical canvas edges.
Outer margin: 0 pixels.
Use only hairline 1–2 pixel gutters BETWEEN adjacent cells.
No title area, no header, no footer, no caption bands, no legend, no decorative framing, no unused space.
Do not render cell numbers or layout labels.
In-world shop, street and transit signage is allowed and REQUIRED where specified below.

All nine cells depict the SAME continuous photorealistic London–Budapest dream metropolis at the SAME late rainy evening continuity.

PHYSICAL-PRESENT RULE:
Every camera position is outside in public pedestrian space: street, pavement, plaza, bridge, river walk, open-air or publicly open passage.
The current camera never becomes an office-room camera, bedroom camera, police-room camera, courtroom camera or clinical-room camera.
Interior depth may be visible THROUGH real street-facing glass, but only as architectural depth.
No literal memory event is visible in this WORLD asset.

CITY FUSION RULE:
London must remain immediately recognizable through street geometry, road proportions, junctions, pavements, red double-decker buses, black taxis, London street furniture and landmark relationships.
Budapest/Hungary must be equally unmistakable through EXPLICIT named architectural anchors, yellow Budapest trams, tram/trolley wires, Hungarian signage and selected Budapest buildings physically replacing or fusing with London blocks.
Do not reduce Budapest to generic Central-European façades.
Do not separate London and Budapest into different districts.
Nobody reacts to the fusion.

TRANSPORT:
Use red London double-decker buses, black London taxis and yellow Budapest trams naturally.
Tram rails share London road geometry; London road markings may cross the rails; Budapest tram/trolley wires attach directly to fused façades.
At least one of the first six cells must show a substantial side view of a red double-decker and at least one must show a substantial side view of a yellow tram so their windows are usable later.

MEMORY-COMPOSITING PREPARATION:
Include broad physically realistic vehicle windows, shopfront/cultural glass, entrance glass and wet reflective surfaces naturally where specified by the cells below.
These are only the PHYSICAL PRESENT surfaces.
This MAIN WORLD contains NO narrative memory scene and NO score cards.
The remembered content will come later from separate MEMORY WORLD references during STORYBOARD / VIDEO generation.

LIGHTING / PHOTOGRAPHY:
Rainy blue hour progressing toward night.
Cool blue-grey exterior; warm tungsten cafés/restaurants; warm-neutral public interiors; realistic vehicle practicals.
Photorealistic live-action European feature-film location photography.
Environment views: approximately 28mm full-frame equivalent, camera height about 1.6 m.
Detail views: approximately 35–50mm.
ARRI Alexa LF photographic character, natural Cooke-style rendering, soft highlight roll-off, rich shadow detail, fine organic film grain, real wet stone, real glass, real transport materials.
No fantasy glow, no psychedelic haze, no game-engine appearance, no obvious sci-fi interface.

NINE-CELL FUNCTION:
Cells 1–6 = six exterior environment views along this section of the walk.
Cell 7 = major glass / reflection-surface technical detail.
Cell 8 = moving transit-window technical detail.
Cell 9 = fused London–Budapest architecture + in-world signage technical detail.

WORLD-SPECIFIC CONTENT:
Cell 1 — Trafalgar / Charing Cross-side public street continuing directly from the previous world. London station/street geometry remains recognizable, but the main station frontage incorporates the iron-and-glass structural language of BUDAPEST NYUGATI RAILWAY STATION inside the Charing Cross footprint. Red bus, black taxi and yellow tram coexist. 20–35 pedestrians.

Cell 2 — Strand / theatre district exterior. One prominent London theatre block keeps its street footprint but uses the façade and roof language of the HUNGARIAN STATE OPERA HOUSE. Nearby ground floors remain London cafés, theatres and shops. Visible KÁVÉ and SZÍNHÁZ signs mix with English signage.

Cell 3 — Embankment-style London Underground entrance viewed entirely from the pavement. Recognizable London roundel / street-level entrance geometry; below the opening, only as visible depth, use BUDAPEST METRO LINE 4 architecture: large concrete structural forms and deep escalator geometry. Natural Hungarian METRÓ and KIJÁRAT signage appears beside London Underground language. The camera remains outside.

Cell 4 — Aldwych / Somerset House-side public exterior. London street geometry with one corner cultural/market block carrying GREAT MARKET HALL-inspired Budapest iron, brick and glazed roof language adapted to the London footprint. Wet public pavement, restaurants, bus/taxi/tram traces.

Cell 5 — Temple-edge public passage seen from the street. A London stone passage and courtyard opening are fused with PESTI VIGADÓ-inspired decorative façade language on selected upper sections. The passage remains public exterior space, with warm depth behind large panes.

Cell 6 — Strand-to-Embankment public city view with several long glass surfaces and a glimpse toward the Thames. A Budapest yellow tram runs naturally along London road geometry; a red bus side and black taxi remain usable moving reflection surfaces. 15–30 pedestrians.

Cell 7 — Close exterior detail of large station / passage glass: rain layer, Charing Cross/Strand current-city reflection, warm public depth, yellow tram and red bus traces. No memory content.

Cell 8 — Close exterior transit detail: red bus side windows, yellow tram side windows, black taxi glass and the edge of the Underground entrance; large clean panes, no opaque advertisements.

Cell 9 — Close fused architecture/signage detail combining a London theatre/station ground floor with Hungarian State Opera / Nyugati architectural DNA. Visible restrained METRÓ, KIJÁRAT, KÁVÉ and English signs exist as real in-world signage, not presentation text.

FINAL CHECK:
Exactly one image.
Exactly nine equal photographic cells in a 3×3 grid.
0 px outer margin.
Only 1–2 px internal gutters.
No presentation title/caption/legend/frame.
All current camera positions remain exterior/public.
Budapest must be specifically recognizable through the named anchors above, not genericized.
```


> **FLOW SETTING BEFORE GENERATION: Image → Aspect ratio → 16:9. Do not leave Flow at 1:1.**

## WORLD 03 — 01:00–01:30 — WORK CITY — ALDWYCH / KINGSWAY / HOLBORN / PROFESSIONAL FACADES

```text
OUTPUT GEOMETRY — NON-NEGOTIABLE:
Generate a WIDESCREEN LANDSCAPE image with a TRUE 16:9 FINAL CANVAS, equivalent to 1920×1080.
Inside that 16:9 canvas, create ONE SINGLE FULL-BLEED 3×3 grid containing EXACTLY NINE equal photographic cells.

GRID GEOMETRY:
3 equal columns × 3 equal rows across the entire 16:9 canvas.
Each photographic cell must therefore be a TRUE 16:9 widescreen rectangle, equivalent to 640×360 within a 1920×1080 canvas.
DO NOT create a square 1:1 canvas.
DO NOT create square cells.
DO NOT place a square 3×3 contact sheet inside a wider canvas.
DO NOT add letterboxing or pillarboxing.
The 3×3 grid itself must fill the entire 16:9 canvas edge-to-edge.

The nine photographic cells occupy 100% of the final canvas and touch all four physical canvas edges.
Outer margin: 0 pixels.
Use only hairline 1–2 pixel gutters BETWEEN adjacent cells.
No title area, no header, no footer, no caption bands, no legend, no decorative framing, no unused space.
Do not render cell numbers or layout labels.
In-world shop, street and transit signage is allowed and REQUIRED where specified below.

All nine cells depict the SAME continuous photorealistic London–Budapest dream metropolis at the SAME late rainy evening continuity.

PHYSICAL-PRESENT RULE:
Every camera position is outside in public pedestrian space: street, pavement, plaza, bridge, river walk, open-air or publicly open passage.
The current camera never becomes an office-room camera, bedroom camera, police-room camera, courtroom camera or clinical-room camera.
Interior depth may be visible THROUGH real street-facing glass, but only as architectural depth.
No literal memory event is visible in this WORLD asset.

CITY FUSION RULE:
London must remain immediately recognizable through street geometry, road proportions, junctions, pavements, red double-decker buses, black taxis, London street furniture and landmark relationships.
Budapest/Hungary must be equally unmistakable through EXPLICIT named architectural anchors, yellow Budapest trams, tram/trolley wires, Hungarian signage and selected Budapest buildings physically replacing or fusing with London blocks.
Do not reduce Budapest to generic Central-European façades.
Do not separate London and Budapest into different districts.
Nobody reacts to the fusion.

TRANSPORT:
Use red London double-decker buses, black London taxis and yellow Budapest trams naturally.
Tram rails share London road geometry; London road markings may cross the rails; Budapest tram/trolley wires attach directly to fused façades.
At least one of the first six cells must show a substantial side view of a red double-decker and at least one must show a substantial side view of a yellow tram so their windows are usable later.

MEMORY-COMPOSITING PREPARATION:
Include broad physically realistic vehicle windows, shopfront/cultural glass, entrance glass and wet reflective surfaces naturally where specified by the cells below.
These are only the PHYSICAL PRESENT surfaces.
This MAIN WORLD contains NO narrative memory scene and NO score cards.
The remembered content will come later from separate MEMORY WORLD references during STORYBOARD / VIDEO generation.

LIGHTING / PHOTOGRAPHY:
Rainy blue hour progressing toward night.
Cool blue-grey exterior; warm tungsten cafés/restaurants; warm-neutral public interiors; realistic vehicle practicals.
Photorealistic live-action European feature-film location photography.
Environment views: approximately 28mm full-frame equivalent, camera height about 1.6 m.
Detail views: approximately 35–50mm.
ARRI Alexa LF photographic character, natural Cooke-style rendering, soft highlight roll-off, rich shadow detail, fine organic film grain, real wet stone, real glass, real transport materials.
No fantasy glow, no psychedelic haze, no game-engine appearance, no obvious sci-fi interface.

NINE-CELL FUNCTION:
Cells 1–6 = six exterior environment views along this section of the walk.
Cell 7 = major glass / reflection-surface technical detail.
Cell 8 = moving transit-window technical detail.
Cell 9 = fused London–Budapest architecture + in-world signage technical detail.

WORLD-SPECIFIC CONTENT:
Cell 1 — Aldwych / Kingsway commercial-work street. London street proportions, consultancies, coworking frontage, cafés and bookshop/stationery shops. One major block uses NEW YORK PALACE BUDAPEST-inspired ornate upper architecture while preserving a London commercial footprint. Visible IRODA and KÁVÉ signs. 15–30 pedestrians.

Cell 2 — Large professional office façade viewed entirely from the pavement. Modern floor-to-ceiling street glazing is inserted into a stone block inspired by the HUNGARIAN ACADEMY OF SCIENCES, adapted to London geometry. Lobby, reception and meeting-room depth are visible only through glass. Yellow tram, black taxi and distant red bus.

Cell 3 — Holborn professional street with accounting/copy/print frontage. British ground-floor business proportions beneath Andrássy-style Pest balconies and stonework. Natural KÖNYVELÉS, IRODA and BEJÁRAT signs appear beside English OFFICE / ACCOUNTING signage. The walker would remain on the public pavement.

Cell 4 — A striking public-facing office/civic block inspired by ÖDÖN LECHNER'S POSTAL SAVINGS BANK, especially its distinctive Hungarian roofline and ornament, compressed into a London block footprint. Street-level glazing remains large and contemporary. No interior scene.

Cell 5 — Mixed work-city exterior with cafés, professional entrances and long panes at multiple depths. A yellow Budapest tram passes in substantial side view; a black taxi and red bus appear separately. Wet street, wires and practical lights.

Cell 6 — Transition toward Fleet Street edge. Historic London professional façades are genetically mixed with Pest limestone, Hungarian roof details and restrained Art Nouveau / Secession accents. Dense but readable public glass. 15–25 pedestrians.

Cell 7 — Close exterior office-glass detail: rain on glass, current London–Budapest city reflection, readable lobby/corridor/meeting-room depth; no work event or person-centered memory.

Cell 8 — Close moving-transit detail in the work district: red bus side windows, yellow tram side windows, black taxi glass, wet rails and office façades behind.

Cell 9 — Close architecture/signage detail: one London professional block fused with New York Palace / Academy / Lechner-era Budapest DNA, with clear but restrained IRODA, KÖNYVELÉS and KÁVÉ signs. The result must read as specifically Budapest-in-London, not generic Central Europe.

FINAL CHECK:
Exactly one image.
Exactly nine equal photographic cells in a 3×3 grid.
0 px outer margin.
Only 1–2 px internal gutters.
No presentation title/caption/legend/frame.
All current camera positions remain exterior/public.
Budapest must be specifically recognizable through the named anchors above, not genericized.
```


> **FLOW SETTING BEFORE GENERATION: Image → Aspect ratio → 16:9. Do not leave Flow at 1:1.**

## WORLD 04 — 01:30–02:00 — FORMAL CITY — FLEET STREET / TEMPLE / CIVIC FACADES / BLACKFRIARS APPROACH

```text
OUTPUT GEOMETRY — NON-NEGOTIABLE:
Generate a WIDESCREEN LANDSCAPE image with a TRUE 16:9 FINAL CANVAS, equivalent to 1920×1080.
Inside that 16:9 canvas, create ONE SINGLE FULL-BLEED 3×3 grid containing EXACTLY NINE equal photographic cells.

GRID GEOMETRY:
3 equal columns × 3 equal rows across the entire 16:9 canvas.
Each photographic cell must therefore be a TRUE 16:9 widescreen rectangle, equivalent to 640×360 within a 1920×1080 canvas.
DO NOT create a square 1:1 canvas.
DO NOT create square cells.
DO NOT place a square 3×3 contact sheet inside a wider canvas.
DO NOT add letterboxing or pillarboxing.
The 3×3 grid itself must fill the entire 16:9 canvas edge-to-edge.

The nine photographic cells occupy 100% of the final canvas and touch all four physical canvas edges.
Outer margin: 0 pixels.
Use only hairline 1–2 pixel gutters BETWEEN adjacent cells.
No title area, no header, no footer, no caption bands, no legend, no decorative framing, no unused space.
Do not render cell numbers or layout labels.
In-world shop, street and transit signage is allowed and REQUIRED where specified below.

All nine cells depict the SAME continuous photorealistic London–Budapest dream metropolis at the SAME late rainy evening continuity.

PHYSICAL-PRESENT RULE:
Every camera position is outside in public pedestrian space: street, pavement, plaza, bridge, river walk, open-air or publicly open passage.
The current camera never becomes an office-room camera, bedroom camera, police-room camera, courtroom camera or clinical-room camera.
Interior depth may be visible THROUGH real street-facing glass, but only as architectural depth.
No literal memory event is visible in this WORLD asset.

CITY FUSION RULE:
London must remain immediately recognizable through street geometry, road proportions, junctions, pavements, red double-decker buses, black taxis, London street furniture and landmark relationships.
Budapest/Hungary must be equally unmistakable through EXPLICIT named architectural anchors, yellow Budapest trams, tram/trolley wires, Hungarian signage and selected Budapest buildings physically replacing or fusing with London blocks.
Do not reduce Budapest to generic Central-European façades.
Do not separate London and Budapest into different districts.
Nobody reacts to the fusion.

TRANSPORT:
Use red London double-decker buses, black London taxis and yellow Budapest trams naturally.
Tram rails share London road geometry; London road markings may cross the rails; Budapest tram/trolley wires attach directly to fused façades.
At least one of the first six cells must show a substantial side view of a red double-decker and at least one must show a substantial side view of a yellow tram so their windows are usable later.

MEMORY-COMPOSITING PREPARATION:
Include broad physically realistic vehicle windows, shopfront/cultural glass, entrance glass and wet reflective surfaces naturally where specified by the cells below.
These are only the PHYSICAL PRESENT surfaces.
This MAIN WORLD contains NO narrative memory scene and NO score cards.
The remembered content will come later from separate MEMORY WORLD references during STORYBOARD / VIDEO generation.

LIGHTING / PHOTOGRAPHY:
Rainy blue hour progressing toward night.
Cool blue-grey exterior; warm tungsten cafés/restaurants; warm-neutral public interiors; realistic vehicle practicals.
Photorealistic live-action European feature-film location photography.
Environment views: approximately 28mm full-frame equivalent, camera height about 1.6 m.
Detail views: approximately 35–50mm.
ARRI Alexa LF photographic character, natural Cooke-style rendering, soft highlight roll-off, rich shadow detail, fine organic film grain, real wet stone, real glass, real transport materials.
No fantasy glow, no psychedelic haze, no game-engine appearance, no obvious sci-fi interface.

NINE-CELL FUNCTION:
Cells 1–6 = six exterior environment views along this section of the walk.
Cell 7 = major glass / reflection-surface technical detail.
Cell 8 = moving transit-window technical detail.
Cell 9 = fused London–Budapest architecture + in-world signage technical detail.

WORLD-SPECIFIC CONTENT:
Cell 1 — Fleet Street exterior, recognizable London street geometry, bookshops, cafés, professional frontage and broad wet windows. One large stone block uses the historic BUDAPEST PALACE OF JUSTICE / former Kúria architectural language while remaining an ordinary street-facing London block. No courtroom or institutional event is shown.

Cell 2 — Temple-edge public stone passage and open courtyard entrance. Fuse the London passage with HUNGARIAN NATIONAL MUSEUM-style classical stone proportions on one adjoining block. Keep cafés/bookshops and large street-facing glass so the environment remains public and alive. 10–20 pedestrians.

Cell 3 — Royal Courts-side exterior geometry, but selected façade massing is replaced by the historic BUDAPEST PALACE OF JUSTICE / KOSSUTH-SQUARE civic language. The camera is on the pavement; only neutral lobby depth is visible behind broad glass. No explicit court action and no interior room.

Cell 4 — Formal public glass frontage on the same street. Long entrance glazing, warm-neutral lobby depth, red bus side, yellow tram infrastructure and black taxi. Budapest stone ornament is physically attached to London street proportions.

Cell 5 — Ludgate / Blackfriars approach exterior. One cultural/public block uses PESTI VIGADÓ-inspired façade rhythm and ornament within London geometry. Longer sightlines begin opening toward the Thames. 15–25 pedestrians.

Cell 6 — Mixed formal street at blue-hour-to-night transition. Several Hungarian architectural identities coexist without collage: Palace-of-Justice stone, National Museum classicism and restrained Pest balconies, all integrated into ordinary London blocks. Visible KÖNYV, KÁVÉ, BEJÁRAT signs mix with English signs.

Cell 7 — Close exterior institutional-looking glass detail prepared for later police/lawyer/court memories: rain + current city + ordinary lobby depth only. No memory content.

Cell 8 — Close transit detail: full red-bus side windows, yellow-tram side windows and black-taxi glass against formal London–Budapest stone façades.

Cell 9 — Close fused formal architecture detail: London public/commercial ground floor, specifically Hungarian Palace-of-Justice / National-Museum stone language above, tram-wire attachment and restrained Hungarian signage. No generic anonymous office block.

FINAL CHECK:
Exactly one image.
Exactly nine equal photographic cells in a 3×3 grid.
0 px outer margin.
Only 1–2 px internal gutters.
No presentation title/caption/legend/frame.
All current camera positions remain exterior/public.
Budapest must be specifically recognizable through the named anchors above, not genericized.
```


> **FLOW SETTING BEFORE GENERATION: Image → Aspect ratio → 16:9. Do not leave Flow at 1:1.**

## WORLD 05 — 02:00–02:30 — THE RIVER OPENS — BLACKFRIARS / THAMES / SOUTH BANK

```text
OUTPUT GEOMETRY — NON-NEGOTIABLE:
Generate a WIDESCREEN LANDSCAPE image with a TRUE 16:9 FINAL CANVAS, equivalent to 1920×1080.
Inside that 16:9 canvas, create ONE SINGLE FULL-BLEED 3×3 grid containing EXACTLY NINE equal photographic cells.

GRID GEOMETRY:
3 equal columns × 3 equal rows across the entire 16:9 canvas.
Each photographic cell must therefore be a TRUE 16:9 widescreen rectangle, equivalent to 640×360 within a 1920×1080 canvas.
DO NOT create a square 1:1 canvas.
DO NOT create square cells.
DO NOT place a square 3×3 contact sheet inside a wider canvas.
DO NOT add letterboxing or pillarboxing.
The 3×3 grid itself must fill the entire 16:9 canvas edge-to-edge.

The nine photographic cells occupy 100% of the final canvas and touch all four physical canvas edges.
Outer margin: 0 pixels.
Use only hairline 1–2 pixel gutters BETWEEN adjacent cells.
No title area, no header, no footer, no caption bands, no legend, no decorative framing, no unused space.
Do not render cell numbers or layout labels.
In-world shop, street and transit signage is allowed and REQUIRED where specified below.

All nine cells depict the SAME continuous photorealistic London–Budapest dream metropolis at the SAME late rainy evening continuity.

PHYSICAL-PRESENT RULE:
Every camera position is outside in public pedestrian space: street, pavement, plaza, bridge, river walk, open-air or publicly open passage.
The current camera never becomes an office-room camera, bedroom camera, police-room camera, courtroom camera or clinical-room camera.
Interior depth may be visible THROUGH real street-facing glass, but only as architectural depth.
No literal memory event is visible in this WORLD asset.

CITY FUSION RULE:
London must remain immediately recognizable through street geometry, road proportions, junctions, pavements, red double-decker buses, black taxis, London street furniture and landmark relationships.
Budapest/Hungary must be equally unmistakable through EXPLICIT named architectural anchors, yellow Budapest trams, tram/trolley wires, Hungarian signage and selected Budapest buildings physically replacing or fusing with London blocks.
Do not reduce Budapest to generic Central-European façades.
Do not separate London and Budapest into different districts.
Nobody reacts to the fusion.

TRANSPORT:
Use red London double-decker buses, black London taxis and yellow Budapest trams naturally.
Tram rails share London road geometry; London road markings may cross the rails; Budapest tram/trolley wires attach directly to fused façades.
At least one of the first six cells must show a substantial side view of a red double-decker and at least one must show a substantial side view of a yellow tram so their windows are usable later.

MEMORY-COMPOSITING PREPARATION:
Include broad physically realistic vehicle windows, shopfront/cultural glass, entrance glass and wet reflective surfaces naturally where specified by the cells below.
These are only the PHYSICAL PRESENT surfaces.
This MAIN WORLD contains NO narrative memory scene and NO score cards.
The remembered content will come later from separate MEMORY WORLD references during STORYBOARD / VIDEO generation.

LIGHTING / PHOTOGRAPHY:
Rainy blue hour progressing toward night.
Cool blue-grey exterior; warm tungsten cafés/restaurants; warm-neutral public interiors; realistic vehicle practicals.
Photorealistic live-action European feature-film location photography.
Environment views: approximately 28mm full-frame equivalent, camera height about 1.6 m.
Detail views: approximately 35–50mm.
ARRI Alexa LF photographic character, natural Cooke-style rendering, soft highlight roll-off, rich shadow detail, fine organic film grain, real wet stone, real glass, real transport materials.
No fantasy glow, no psychedelic haze, no game-engine appearance, no obvious sci-fi interface.

NINE-CELL FUNCTION:
Cells 1–6 = six exterior environment views along this section of the walk.
Cell 7 = major glass / reflection-surface technical detail.
Cell 8 = moving transit-window technical detail.
Cell 9 = fused London–Budapest architecture + in-world signage technical detail.

WORLD-SPECIFIC CONTENT:
Cell 1 — Blackfriars north-bank riverfront exterior. Thames geometry is unmistakably London, but across one separated sightline the HUNGARIAN PARLIAMENT stands naturally on the riverfront at believable scale. It is a mandatory recognition anchor, not a vague Gothic substitute. London structures remain elsewhere at different depths. 15–30 pedestrians.

Cell 2 — Blackfriars Bridge approach. Preserve London bridge alignment and deck geometry, but integrate restrained SZÉCHENYI CHAIN BRIDGE stone-pier / lion / iron-detail language into selected structural elements. Do not replace the whole bridge with Budapest's bridge; create one historically fused bridge.

Cell 3 — North-bank public block where the London riverfront footprint carries the unmistakable façade language of GRESHAM PALACE / FOUR SEASONS BUDAPEST. Ground-floor cafés and public glass remain London-scaled. Yellow Budapest tram runs along the riverside road like Budapest Tram 2.

Cell 4 — South Bank-side public cultural riverfront after crossing. London pedestrian promenade, restaurants and large cultural glass. One public building carries PESTI VIGADÓ-inspired façade rhythm adapted to South Bank massing. Red bus and black taxi remain on nearby road geometry.

Cell 5 — Wide river composition with HUNGARIAN PARLIAMENT and LONDON EYE visible at DIFFERENT depths and separated by architecture/occlusion. Never postcard collage. A yellow tram occupies the Embankment-side line; wet river and stone reflect city light.

Cell 6 — Strong riverside transport view: full side red double-decker, full side yellow Budapest tram and black taxi separated cleanly against Thames geometry and Hungarian Parliament/Gresham anchors. 20–35 pedestrians.

Cell 7 — Close riverside glass detail: rain droplets, Parliament/Gresham/London reflections, warm public interior depth, no memory content.

Cell 8 — Close moving-transit detail with red bus side windows, Budapest Tram-2-like yellow tram windows and black taxi glass; river reflections behind.

Cell 9 — Close riverfront architecture/signage detail: London ground-floor public frontage fused specifically with Gresham Palace / Pest Danube-side architecture. Visible VILLAMOS, KÁVÉ or BEJÁRAT signage beside English signs.

FINAL CHECK:
Exactly one image.
Exactly nine equal photographic cells in a 3×3 grid.
0 px outer margin.
Only 1–2 px internal gutters.
No presentation title/caption/legend/frame.
All current camera positions remain exterior/public.
Budapest must be specifically recognizable through the named anchors above, not genericized.
```


> **FLOW SETTING BEFORE GENERATION: Image → Aspect ratio → 16:9. Do not leave Flow at 1:1.**

## WORLD 06 — 02:30–03:00 — CITY OVERLOAD — SOUTH BANK / WATERLOO / LONDON EYE / WESTMINSTER APPROACH

```text
OUTPUT GEOMETRY — NON-NEGOTIABLE:
Generate a WIDESCREEN LANDSCAPE image with a TRUE 16:9 FINAL CANVAS, equivalent to 1920×1080.
Inside that 16:9 canvas, create ONE SINGLE FULL-BLEED 3×3 grid containing EXACTLY NINE equal photographic cells.

GRID GEOMETRY:
3 equal columns × 3 equal rows across the entire 16:9 canvas.
Each photographic cell must therefore be a TRUE 16:9 widescreen rectangle, equivalent to 640×360 within a 1920×1080 canvas.
DO NOT create a square 1:1 canvas.
DO NOT create square cells.
DO NOT place a square 3×3 contact sheet inside a wider canvas.
DO NOT add letterboxing or pillarboxing.
The 3×3 grid itself must fill the entire 16:9 canvas edge-to-edge.

The nine photographic cells occupy 100% of the final canvas and touch all four physical canvas edges.
Outer margin: 0 pixels.
Use only hairline 1–2 pixel gutters BETWEEN adjacent cells.
No title area, no header, no footer, no caption bands, no legend, no decorative framing, no unused space.
Do not render cell numbers or layout labels.
In-world shop, street and transit signage is allowed and REQUIRED where specified below.

All nine cells depict the SAME continuous photorealistic London–Budapest dream metropolis at the SAME late rainy evening continuity.

PHYSICAL-PRESENT RULE:
Every camera position is outside in public pedestrian space: street, pavement, plaza, bridge, river walk, open-air or publicly open passage.
The current camera never becomes an office-room camera, bedroom camera, police-room camera, courtroom camera or clinical-room camera.
Interior depth may be visible THROUGH real street-facing glass, but only as architectural depth.
No literal memory event is visible in this WORLD asset.

CITY FUSION RULE:
London must remain immediately recognizable through street geometry, road proportions, junctions, pavements, red double-decker buses, black taxis, London street furniture and landmark relationships.
Budapest/Hungary must be equally unmistakable through EXPLICIT named architectural anchors, yellow Budapest trams, tram/trolley wires, Hungarian signage and selected Budapest buildings physically replacing or fusing with London blocks.
Do not reduce Budapest to generic Central-European façades.
Do not separate London and Budapest into different districts.
Nobody reacts to the fusion.

TRANSPORT:
Use red London double-decker buses, black London taxis and yellow Budapest trams naturally.
Tram rails share London road geometry; London road markings may cross the rails; Budapest tram/trolley wires attach directly to fused façades.
At least one of the first six cells must show a substantial side view of a red double-decker and at least one must show a substantial side view of a yellow tram so their windows are usable later.

MEMORY-COMPOSITING PREPARATION:
Include broad physically realistic vehicle windows, shopfront/cultural glass, entrance glass and wet reflective surfaces naturally where specified by the cells below.
These are only the PHYSICAL PRESENT surfaces.
This MAIN WORLD contains NO narrative memory scene and NO score cards.
The remembered content will come later from separate MEMORY WORLD references during STORYBOARD / VIDEO generation.

LIGHTING / PHOTOGRAPHY:
Rainy blue hour progressing toward night.
Cool blue-grey exterior; warm tungsten cafés/restaurants; warm-neutral public interiors; realistic vehicle practicals.
Photorealistic live-action European feature-film location photography.
Environment views: approximately 28mm full-frame equivalent, camera height about 1.6 m.
Detail views: approximately 35–50mm.
ARRI Alexa LF photographic character, natural Cooke-style rendering, soft highlight roll-off, rich shadow detail, fine organic film grain, real wet stone, real glass, real transport materials.
No fantasy glow, no psychedelic haze, no game-engine appearance, no obvious sci-fi interface.

NINE-CELL FUNCTION:
Cells 1–6 = six exterior environment views along this section of the walk.
Cell 7 = major glass / reflection-surface technical detail.
Cell 8 = moving transit-window technical detail.
Cell 9 = fused London–Budapest architecture + in-world signage technical detail.

WORLD-SPECIFIC CONTENT:
Cell 1 — South Bank westbound public promenade. London river geometry and cultural frontage, but one major food/cultural block uses GREAT MARKET HALL Budapest iron-and-brick roof language adapted to a South Bank footprint. Dense pedestrians, wet paving, warm public interiors.

Cell 2 — Waterloo / South Bank cultural zone. One substantial building uses BUDAPEST NATIONAL THEATRE-inspired architecture integrated into London public-space geometry. Multiple broad panes, restaurants and shelters. Yellow tram, black taxi and red bus appear in layered depths.

Cell 3 — London Eye-side public city. The London Eye is clearly recognizable at one depth while HUNGARIAN PARLIAMENT remains visible across the river at another, separated by bridge/building occlusion. No landmark pile-up. 35–50 pedestrians.

Cell 4 — Westminster Bridge approach. Preserve unmistakable London bridge approach geometry but fuse selected SZÉCHENYI CHAIN BRIDGE stone/iron/lion detail into the structure. A yellow Budapest tram crosses or parallels the bridge approach in normal city operation; red bus and black taxi remain separate.

Cell 5 — Dense public-glass corridor inspired partly by BÁLNA BUDAPEST glass-and-historic-fabric fusion, but embedded into South Bank London geometry. Several large clean panes at different depths, restaurants, cultural entrances, shelters.

Cell 6 — Maximum urban layering: red double-decker side, yellow tram side, black taxi, London Eye, Parliament sightline, Budapest tram wires, dense anonymous crowd and many wet glass surfaces, all readable rather than chaotic.

Cell 7 — Close overload-glass detail: multiple current-city reflections at different depths while one broad pane remains technically clean for later memory layering. No memory content.

Cell 8 — Close dense transit detail: large side windows of red bus and yellow tram plus black taxi glass, warm vehicle interiors, wet road and wires.

Cell 9 — Close hybrid architecture/signage detail combining a London South Bank public ground floor with unmistakable Great Market Hall / National Theatre / Bálna Budapest design DNA. Visible MOZI, SZÍNHÁZ, KÁVÉ or VILLAMOS signage as real city text.

FINAL CHECK:
Exactly one image.
Exactly nine equal photographic cells in a 3×3 grid.
0 px outer margin.
Only 1–2 px internal gutters.
No presentation title/caption/legend/frame.
All current camera positions remain exterior/public.
Budapest must be specifically recognizable through the named anchors above, not genericized.
```


> **FLOW SETTING BEFORE GENERATION: Image → Aspect ratio → 16:9. Do not leave Flow at 1:1.**

## WORLD 07 — 03:00–03:20 — THE LAST CITY — WESTMINSTER / WHITEHALL / DARK GLASS THRESHOLD

```text
OUTPUT GEOMETRY — NON-NEGOTIABLE:
Generate a WIDESCREEN LANDSCAPE image with a TRUE 16:9 FINAL CANVAS, equivalent to 1920×1080.
Inside that 16:9 canvas, create ONE SINGLE FULL-BLEED 3×3 grid containing EXACTLY NINE equal photographic cells.

GRID GEOMETRY:
3 equal columns × 3 equal rows across the entire 16:9 canvas.
Each photographic cell must therefore be a TRUE 16:9 widescreen rectangle, equivalent to 640×360 within a 1920×1080 canvas.
DO NOT create a square 1:1 canvas.
DO NOT create square cells.
DO NOT place a square 3×3 contact sheet inside a wider canvas.
DO NOT add letterboxing or pillarboxing.
The 3×3 grid itself must fill the entire 16:9 canvas edge-to-edge.

The nine photographic cells occupy 100% of the final canvas and touch all four physical canvas edges.
Outer margin: 0 pixels.
Use only hairline 1–2 pixel gutters BETWEEN adjacent cells.
No title area, no header, no footer, no caption bands, no legend, no decorative framing, no unused space.
Do not render cell numbers or layout labels.
In-world shop, street and transit signage is allowed and REQUIRED where specified below.

All nine cells depict the SAME continuous photorealistic London–Budapest dream metropolis at the SAME late rainy evening continuity.

PHYSICAL-PRESENT RULE:
Every camera position is outside in public pedestrian space: street, pavement, plaza, bridge, river walk, open-air or publicly open passage.
The current camera never becomes an office-room camera, bedroom camera, police-room camera, courtroom camera or clinical-room camera.
Interior depth may be visible THROUGH real street-facing glass, but only as architectural depth.
No literal memory event is visible in this WORLD asset.

CITY FUSION RULE:
London must remain immediately recognizable through street geometry, road proportions, junctions, pavements, red double-decker buses, black taxis, London street furniture and landmark relationships.
Budapest/Hungary must be equally unmistakable through EXPLICIT named architectural anchors, yellow Budapest trams, tram/trolley wires, Hungarian signage and selected Budapest buildings physically replacing or fusing with London blocks.
Do not reduce Budapest to generic Central-European façades.
Do not separate London and Budapest into different districts.
Nobody reacts to the fusion.

TRANSPORT:
Use red London double-decker buses, black London taxis and yellow Budapest trams naturally.
Tram rails share London road geometry; London road markings may cross the rails; Budapest tram/trolley wires attach directly to fused façades.
At least one of the first six cells must show a substantial side view of a red double-decker and at least one must show a substantial side view of a yellow tram so their windows are usable later.

MEMORY-COMPOSITING PREPARATION:
Include broad physically realistic vehicle windows, shopfront/cultural glass, entrance glass and wet reflective surfaces naturally where specified by the cells below.
These are only the PHYSICAL PRESENT surfaces.
This MAIN WORLD contains NO narrative memory scene and NO score cards.
The remembered content will come later from separate MEMORY WORLD references during STORYBOARD / VIDEO generation.

LIGHTING / PHOTOGRAPHY:
Rainy blue hour progressing toward night.
Cool blue-grey exterior; warm tungsten cafés/restaurants; warm-neutral public interiors; realistic vehicle practicals.
Photorealistic live-action European feature-film location photography.
Environment views: approximately 28mm full-frame equivalent, camera height about 1.6 m.
Detail views: approximately 35–50mm.
ARRI Alexa LF photographic character, natural Cooke-style rendering, soft highlight roll-off, rich shadow detail, fine organic film grain, real wet stone, real glass, real transport materials.
No fantasy glow, no psychedelic haze, no game-engine appearance, no obvious sci-fi interface.

NINE-CELL FUNCTION:
Cells 1–6 = six exterior environment views along this section of the walk.
Cell 7 = major glass / reflection-surface technical detail.
Cell 8 = moving transit-window technical detail.
Cell 9 = fused London–Budapest architecture + in-world signage technical detail.

WORLD-SPECIFIC CONTENT:
Cell 1 — Westminster Bridge / Parliament Square-side exterior after the bridge crossing. Recognizable London geometry; HUNGARIAN PARLIAMENT remains in one riverward depth while the dome/towers of ST STEPHEN'S BASILICA reappear far down a separate street axis as a visual echo of WORLD 01. The city is calmer, not empty.

Cell 2 — Whitehall / Trafalgar-side quieter public street. London civic proportions with one selected block using HUNGARIAN STATE OPERA / Academy-style Pest stone and roof language. Restaurants/bookshop/cultural frontage remain at ground level. 15–25 pedestrians.

Cell 3 — Final active reflection street: one substantial red double-decker in side view, one yellow Budapest tram, one black taxi, broad public glazing and mixed Hungarian signage. Budapest remains unmistakable even as traffic begins to thin.

Cell 4 — Wide exterior view of the FINAL HYBRID BUILDING from the wet public pavement. Ground floor has one broad dark reflective glass entrance; upper floors combine London public-building proportions with unmistakable GRESHAM PALACE / Pest civic-stone character. It is calm, plausible and non-medical.

Cell 5 — Closer exterior approach to the SAME dark-glass entrance. Large uninterrupted panes, real handles, wet threshold, city reflections, restrained neutral-warm lobby depth only. The immediate foreground is clear enough for the protagonist to approach later.

Cell 6 — Exterior context view proving the final entrance belongs naturally to the same London–Budapest block. Visible in-world BEJÁRAT, KÁVÉ or KÖNYV signs; no medical words, no hospital symbols. A distant Basilica dome or Parliament silhouette may echo through a separate sightline.

Cell 7 — Close dark-glass material detail: rain droplets, current city reflection containing red bus / yellow tram / black taxi / Pest architecture, subtle ordinary depth behind glass. No clinical content.

Cell 8 — Close final-door detail: broad dark panes, real handles, wet threshold, strong but not opaque reflection, ordinary warm-neutral architectural depth. No person, no memory, no medical clue.

Cell 9 — Close final-building architecture/signage detail: London public ground floor + Gresham/Opera/Pest limestone upper floors + Hungarian roof ornament + tram-wire attachment + restrained BEJÁRAT / KÁVÉ / KÖNYV signage. Budapest identity must remain explicit to the final dream frame.

FINAL CHECK:
Exactly one image.
Exactly nine equal photographic cells in a 3×3 grid.
0 px outer margin.
Only 1–2 px internal gutters.
No presentation title/caption/legend/frame.
All current camera positions remain exterior/public.
Budapest must be specifically recognizable through the named anchors above, not genericized.
```


## MAP 01 — SOHO → PICCADILLY → LEICESTER → TRAFALGAR EDGE

```text
Create ONE SINGLE simplified FILM-PRODUCTION LOCATION PLAN.

Use the SAME locked graphic language for every location plan in this project:
- simple slightly oblique architectural block model, approximately 70–75 degrees downward,
- clean simplified building masses and street footprints,
- ONE continuous exterior pedestrian line as the dominant graphic element,
- transport shown only as simple street/rail geometry,
- selected Hungarian replacement blocks recognizable mainly through simplified silhouette/massing,
- no photorealistic façades,
- no Google Maps 3D look,
- no satellite look,
- no videogame city,
- no decorative city render,
- no legend box,
- no paragraph text,
- no camera labels,
- no lighting labels,
- no crowd labels,
- no explanatory captions,
- no large title band.

CANVAS:
The plan itself fills the complete final canvas edge-to-edge.
Outer margin: 0 pixels.
No surrounding grey/white/black presentation border.

WALK:
Show ONE uninterrupted pedestrian path.
The path always stays on exterior public pavement, public crossings, open pedestrian passages, bridges, plazas or river walks.
It never enters a building footprint, office, house, station platform, police room, courtroom or clinical space.
Use a small start dot and small end dot only; no arrowheads and no written start/end labels.

TEXT:
Prefer no visible text at all.
Do not label buildings, roads, transport, cameras, glass surfaces or landmarks.
The recognizable geometry and building silhouettes carry the information.

CITY LOGIC:
London provides the street/river/bridge geometry.
Budapest/Hungary appears as selected replacement blocks and transit infrastructure inside that geometry.
Keep the model simple: block massing + streets + one walk line.

LOCATION-SPECIFIC GEOMETRY:
Build a compressed but walkable Central London block structure beginning in narrow Soho / Brewer / Old Compton geometry, opening into the wide radial junction of Piccadilly Circus, continuing through Coventry Street / Leicester Square pedestrian blocks and ending at Haymarket / Trafalgar edge.
Preserve Eros as a small recognizable Piccadilly massing anchor.
Include four visually distinct Hungarian replacement masses along the London blocks: a St Stephen's Basilica dome/twin-tower sightline block, an Andrássy-style curved palatial block, a Budapest National Theatre-inspired cultural block and a Kossuth-style civic-monument plaza element.
Show a simple surface tram line, bus-capable main streets and taxi-capable roads, secondary to the walking path.
The pedestrian line follows real-feeling pavements and crossings from Soho to the Trafalgar-side exit.

FINAL CHECK:
Exactly one simple block-model location plan.
0 px outer margin.
One continuous exterior walking line.
No legend, captions, camera graphics or Google-Maps-style detail.
```


## MAP 02 — TRAFALGAR / CHARING CROSS → STRAND → ALDWYCH → TEMPLE / EMBANKMENT

```text
Create ONE SINGLE simplified FILM-PRODUCTION LOCATION PLAN.

Use the SAME locked graphic language for every location plan in this project:
- simple slightly oblique architectural block model, approximately 70–75 degrees downward,
- clean simplified building masses and street footprints,
- ONE continuous exterior pedestrian line as the dominant graphic element,
- transport shown only as simple street/rail geometry,
- selected Hungarian replacement blocks recognizable mainly through simplified silhouette/massing,
- no photorealistic façades,
- no Google Maps 3D look,
- no satellite look,
- no videogame city,
- no decorative city render,
- no legend box,
- no paragraph text,
- no camera labels,
- no lighting labels,
- no crowd labels,
- no explanatory captions,
- no large title band.

CANVAS:
The plan itself fills the complete final canvas edge-to-edge.
Outer margin: 0 pixels.
No surrounding grey/white/black presentation border.

WALK:
Show ONE uninterrupted pedestrian path.
The path always stays on exterior public pavement, public crossings, open pedestrian passages, bridges, plazas or river walks.
It never enters a building footprint, office, house, station platform, police room, courtroom or clinical space.
Use a small start dot and small end dot only; no arrowheads and no written start/end labels.

TEXT:
Prefer no visible text at all.
Do not label buildings, roads, transport, cameras, glass surfaces or landmarks.
The recognizable geometry and building silhouettes carry the information.

CITY LOGIC:
London provides the street/river/bridge geometry.
Budapest/Hungary appears as selected replacement blocks and transit infrastructure inside that geometry.
Keep the model simple: block massing + streets + one walk line.

LOCATION-SPECIFIC GEOMETRY:
Continue directly from the previous end point.
Build simplified Trafalgar / Charing Cross geometry, then a long Strand corridor, Aldwych / Somerset House blocks and the Temple / Embankment entrance area.
Use four Hungarian replacement masses recognizable by silhouette only: Nyugati Railway Station iron/glass station massing inside Charing Cross, Hungarian State Opera massing on an Aldwych theatre block, Great Market Hall roof/iron massing on a Strand corner block, and a Budapest M4-style deep entrance volume visible only at the Underground entrance footprint.
The pedestrian line remains on street/pavement/public passage and passes in front of the Underground entrance without descending.
Show simple tram rails through appropriate surface streets plus bus/taxi roads.

FINAL CHECK:
Exactly one simple block-model location plan.
0 px outer margin.
One continuous exterior walking line.
No legend, captions, camera graphics or Google-Maps-style detail.
```


## MAP 03 — ALDWYCH / KINGSWAY → HOLBORN → WORK FACADES → FLEET EDGE

```text
Create ONE SINGLE simplified FILM-PRODUCTION LOCATION PLAN.

Use the SAME locked graphic language for every location plan in this project:
- simple slightly oblique architectural block model, approximately 70–75 degrees downward,
- clean simplified building masses and street footprints,
- ONE continuous exterior pedestrian line as the dominant graphic element,
- transport shown only as simple street/rail geometry,
- selected Hungarian replacement blocks recognizable mainly through simplified silhouette/massing,
- no photorealistic façades,
- no Google Maps 3D look,
- no satellite look,
- no videogame city,
- no decorative city render,
- no legend box,
- no paragraph text,
- no camera labels,
- no lighting labels,
- no crowd labels,
- no explanatory captions,
- no large title band.

CANVAS:
The plan itself fills the complete final canvas edge-to-edge.
Outer margin: 0 pixels.
No surrounding grey/white/black presentation border.

WALK:
Show ONE uninterrupted pedestrian path.
The path always stays on exterior public pavement, public crossings, open pedestrian passages, bridges, plazas or river walks.
It never enters a building footprint, office, house, station platform, police room, courtroom or clinical space.
Use a small start dot and small end dot only; no arrowheads and no written start/end labels.

TEXT:
Prefer no visible text at all.
Do not label buildings, roads, transport, cameras, glass surfaces or landmarks.
The recognizable geometry and building silhouettes carry the information.

CITY LOGIC:
London provides the street/river/bridge geometry.
Budapest/Hungary appears as selected replacement blocks and transit infrastructure inside that geometry.
Keep the model simple: block massing + streets + one walk line.

LOCATION-SPECIFIC GEOMETRY:
Continue directly from WORLD 02.
Build simplified Aldwych / Kingsway and Holborn street blocks, then a sequence of professional/commercial façades leading toward Fleet Street edge.
Keep one continuous exterior pavement path.
Use four Hungarian replacement masses: New York Palace-inspired ornate block, Hungarian Academy of Sciences-style formal stone block, Andrássy-style professional block, and Lechner Postal Savings Bank-inspired roof/massing.
All are normal blocks inside London footprints.
Show a simple yellow-tram rail corridor, bus roads and taxi-capable streets; do not render detailed vehicles.

FINAL CHECK:
Exactly one simple block-model location plan.
0 px outer margin.
One continuous exterior walking line.
No legend, captions, camera graphics or Google-Maps-style detail.
```


## MAP 04 — FLEET STREET → TEMPLE / ROYAL COURTS EXTERIOR → BLACKFRIARS APPROACH

```text
Create ONE SINGLE simplified FILM-PRODUCTION LOCATION PLAN.

Use the SAME locked graphic language for every location plan in this project:
- simple slightly oblique architectural block model, approximately 70–75 degrees downward,
- clean simplified building masses and street footprints,
- ONE continuous exterior pedestrian line as the dominant graphic element,
- transport shown only as simple street/rail geometry,
- selected Hungarian replacement blocks recognizable mainly through simplified silhouette/massing,
- no photorealistic façades,
- no Google Maps 3D look,
- no satellite look,
- no videogame city,
- no decorative city render,
- no legend box,
- no paragraph text,
- no camera labels,
- no lighting labels,
- no crowd labels,
- no explanatory captions,
- no large title band.

CANVAS:
The plan itself fills the complete final canvas edge-to-edge.
Outer margin: 0 pixels.
No surrounding grey/white/black presentation border.

WALK:
Show ONE uninterrupted pedestrian path.
The path always stays on exterior public pavement, public crossings, open pedestrian passages, bridges, plazas or river walks.
It never enters a building footprint, office, house, station platform, police room, courtroom or clinical space.
Use a small start dot and small end dot only; no arrowheads and no written start/end labels.

TEXT:
Prefer no visible text at all.
Do not label buildings, roads, transport, cameras, glass surfaces or landmarks.
The recognizable geometry and building silhouettes carry the information.

CITY LOGIC:
London provides the street/river/bridge geometry.
Budapest/Hungary appears as selected replacement blocks and transit infrastructure inside that geometry.
Keep the model simple: block massing + streets + one walk line.

LOCATION-SPECIFIC GEOMETRY:
Continue directly from WORLD 03.
Build a recognizable simplified Fleet Street corridor, Temple-edge public passages/open courtyards, Royal Courts-side exterior street geometry and then Ludgate / Blackfriars approach.
Use four Hungarian replacement masses: Budapest Palace of Justice / former Kúria-style block, Hungarian National Museum-style classical block, a second Palace-of-Justice-derived formal block and a Pesti Vigadó-inspired cultural block toward Blackfriars.
The pedestrian line stays outside all buildings and uses only public pavement/open passage geometry.
Show simple tram, bus and taxi street geometry.

FINAL CHECK:
Exactly one simple block-model location plan.
0 px outer margin.
One continuous exterior walking line.
No legend, captions, camera graphics or Google-Maps-style detail.
```


## MAP 05 — BLACKFRIARS NORTH BANK → BRIDGE → SOUTH BANK RIVERFRONT

```text
Create ONE SINGLE simplified FILM-PRODUCTION LOCATION PLAN.

Use the SAME locked graphic language for every location plan in this project:
- simple slightly oblique architectural block model, approximately 70–75 degrees downward,
- clean simplified building masses and street footprints,
- ONE continuous exterior pedestrian line as the dominant graphic element,
- transport shown only as simple street/rail geometry,
- selected Hungarian replacement blocks recognizable mainly through simplified silhouette/massing,
- no photorealistic façades,
- no Google Maps 3D look,
- no satellite look,
- no videogame city,
- no decorative city render,
- no legend box,
- no paragraph text,
- no camera labels,
- no lighting labels,
- no crowd labels,
- no explanatory captions,
- no large title band.

CANVAS:
The plan itself fills the complete final canvas edge-to-edge.
Outer margin: 0 pixels.
No surrounding grey/white/black presentation border.

WALK:
Show ONE uninterrupted pedestrian path.
The path always stays on exterior public pavement, public crossings, open pedestrian passages, bridges, plazas or river walks.
It never enters a building footprint, office, house, station platform, police room, courtroom or clinical space.
Use a small start dot and small end dot only; no arrowheads and no written start/end labels.

TEXT:
Prefer no visible text at all.
Do not label buildings, roads, transport, cameras, glass surfaces or landmarks.
The recognizable geometry and building silhouettes carry the information.

CITY LOGIC:
London provides the street/river/bridge geometry.
Budapest/Hungary appears as selected replacement blocks and transit infrastructure inside that geometry.
Keep the model simple: block massing + streets + one walk line.

LOCATION-SPECIFIC GEOMETRY:
Continue directly from WORLD 04.
Build simplified Thames geometry at Blackfriars north bank, Blackfriars Bridge crossing and South Bank public riverfront.
Keep the London river and bridge alignment unmistakable.
Use Hungarian replacement/silhouette anchors: Hungarian Parliament across one river sightline, Gresham Palace on one north-bank block, Chain Bridge-inspired stone/iron details integrated into the London bridge massing, and a Pesti Vigadó-inspired public block on the opposite bank.
The walking path follows the river pavement, crosses the bridge on the pedestrian side and continues on South Bank.
Show a simple riverside tram line where plausible, plus bus/taxi roads.

FINAL CHECK:
Exactly one simple block-model location plan.
0 px outer margin.
One continuous exterior walking line.
No legend, captions, camera graphics or Google-Maps-style detail.
```


## MAP 06 — SOUTH BANK WESTBOUND → WATERLOO / LONDON EYE → WESTMINSTER BRIDGE APPROACH

```text
Create ONE SINGLE simplified FILM-PRODUCTION LOCATION PLAN.

Use the SAME locked graphic language for every location plan in this project:
- simple slightly oblique architectural block model, approximately 70–75 degrees downward,
- clean simplified building masses and street footprints,
- ONE continuous exterior pedestrian line as the dominant graphic element,
- transport shown only as simple street/rail geometry,
- selected Hungarian replacement blocks recognizable mainly through simplified silhouette/massing,
- no photorealistic façades,
- no Google Maps 3D look,
- no satellite look,
- no videogame city,
- no decorative city render,
- no legend box,
- no paragraph text,
- no camera labels,
- no lighting labels,
- no crowd labels,
- no explanatory captions,
- no large title band.

CANVAS:
The plan itself fills the complete final canvas edge-to-edge.
Outer margin: 0 pixels.
No surrounding grey/white/black presentation border.

WALK:
Show ONE uninterrupted pedestrian path.
The path always stays on exterior public pavement, public crossings, open pedestrian passages, bridges, plazas or river walks.
It never enters a building footprint, office, house, station platform, police room, courtroom or clinical space.
Use a small start dot and small end dot only; no arrowheads and no written start/end labels.

TEXT:
Prefer no visible text at all.
Do not label buildings, roads, transport, cameras, glass surfaces or landmarks.
The recognizable geometry and building silhouettes carry the information.

CITY LOGIC:
London provides the street/river/bridge geometry.
Budapest/Hungary appears as selected replacement blocks and transit infrastructure inside that geometry.
Keep the model simple: block massing + streets + one walk line.

LOCATION-SPECIFIC GEOMETRY:
Continue directly from WORLD 05.
Build a simplified South Bank westbound river walk, Waterloo cultural blocks, London Eye zone and Westminster Bridge approach.
Keep the London Eye as a small recognizable massing landmark.
Use Hungarian replacement masses: Great Market Hall-inspired roof block, Budapest National Theatre-inspired cultural block, Bálna Budapest-inspired glass/historic hybrid block, and a distant Hungarian Parliament silhouette across the river.
Integrate restrained Chain Bridge-inspired details into the Westminster Bridge approach while keeping London bridge geometry.
The pedestrian line remains on the public river promenade and reaches the bridge approach.
Show simple tram/bus/taxi geometry secondary to the walk.

FINAL CHECK:
Exactly one simple block-model location plan.
0 px outer margin.
One continuous exterior walking line.
No legend, captions, camera graphics or Google-Maps-style detail.
```


## MAP 07 — WESTMINSTER BRIDGE → PARLIAMENT SQUARE / WHITEHALL → FINAL DARK GLASS THRESHOLD

```text
Create ONE SINGLE simplified FILM-PRODUCTION LOCATION PLAN.

Use the SAME locked graphic language for every location plan in this project:
- simple slightly oblique architectural block model, approximately 70–75 degrees downward,
- clean simplified building masses and street footprints,
- ONE continuous exterior pedestrian line as the dominant graphic element,
- transport shown only as simple street/rail geometry,
- selected Hungarian replacement blocks recognizable mainly through simplified silhouette/massing,
- no photorealistic façades,
- no Google Maps 3D look,
- no satellite look,
- no videogame city,
- no decorative city render,
- no legend box,
- no paragraph text,
- no camera labels,
- no lighting labels,
- no crowd labels,
- no explanatory captions,
- no large title band.

CANVAS:
The plan itself fills the complete final canvas edge-to-edge.
Outer margin: 0 pixels.
No surrounding grey/white/black presentation border.

WALK:
Show ONE uninterrupted pedestrian path.
The path always stays on exterior public pavement, public crossings, open pedestrian passages, bridges, plazas or river walks.
It never enters a building footprint, office, house, station platform, police room, courtroom or clinical space.
Use a small start dot and small end dot only; no arrowheads and no written start/end labels.

TEXT:
Prefer no visible text at all.
Do not label buildings, roads, transport, cameras, glass surfaces or landmarks.
The recognizable geometry and building silhouettes carry the information.

CITY LOGIC:
London provides the street/river/bridge geometry.
Budapest/Hungary appears as selected replacement blocks and transit infrastructure inside that geometry.
Keep the model simple: block massing + streets + one walk line.

LOCATION-SPECIFIC GEOMETRY:
Continue directly from WORLD 06.
Build simplified Westminster Bridge crossing, Parliament Square / Whitehall public streets, a quieter final civic-commercial street and one final hybrid block with a broad street-facing entrance.
Use distant/simplified Budapest identity anchors: Hungarian Parliament on a separated river sightline, St Stephen's Basilica dome/towers on a distant street axis, one State-Opera/Academy-style Pest block, and the final Gresham/Pest civic-stone block.
The final block has a broad dark-glass ground-floor entrance represented only as a simple façade recess.
The pedestrian line crosses Westminster Bridge, continues through public pavements and ends immediately OUTSIDE the final entrance.
It never crosses the threshold.
Transport geometry gradually reduces near the endpoint.

FINAL CHECK:
Exactly one simple block-model location plan.
0 px outer margin.
One continuous exterior walking line.
No legend, captions, camera graphics or Google-Maps-style detail.
```


> **FLOW SETTING BEFORE GENERATION: Image → Aspect ratio → 16:9. Do not leave Flow at 1:1.**

================================================================================
# OPERATOR TEXT ENDS HERE FOR THIS LIBRARY — COPY ONLY EACH `text` CODE BLOCK BELOW
================================================================================

## STORYBOARD 01 — 00:00–00:30 — THE CITY JUDGES FIRST

```text
OUTPUT GEOMETRY — NON-NEGOTIABLE:
Generate a WIDESCREEN LANDSCAPE image with a TRUE 16:9 FINAL CANVAS, equivalent to 1920×1080.
Inside that 16:9 canvas, create ONE SINGLE FULL-BLEED 3×3 CINEMATIC STORYBOARD containing EXACTLY NINE equal frames.

GRID GEOMETRY:
3 equal columns × 3 equal rows across the entire 16:9 canvas.
Each storyboard frame must therefore be a TRUE 16:9 widescreen rectangle, equivalent to 640×360 within a 1920×1080 canvas.
DO NOT create a square 1:1 canvas.
DO NOT create square storyboard frames.
DO NOT place a square 3×3 contact sheet inside a wider canvas.
DO NOT add letterboxing or pillarboxing.
The 3×3 grid itself must fill the entire 16:9 canvas edge-to-edge.
Treat every cell as a real widescreen cinema frame intended to guide a 16:9 video shot.

The nine frames occupy 100% of the final canvas and touch every outer edge.
Outer margin: 0 pixels.
Use only hairline 1–2 pixel gutters BETWEEN frames.
No title band, no footer, no legend, no decorative frame, no explanatory text.
The ONLY layout text allowed is one tiny simple frame number 1–9 in the upper-left corner of each frame.
Normal in-world signage may appear where it belongs.

REFERENCE USE:
Use the supplied MAIN WORLD reference for the exact PHYSICAL PRESENT: current-city location, London–Budapest architecture, named Budapest anchors, lighting, weather, transport, glass/window geometry, wet surfaces and crowd continuity.

Use the following separate MEMORY CONTENT reference(s):
- MEMORY WORLD 01 — LONDON / SOCIAL / HOME / DATING

MEMORY-COMPOSITING RULE:
The MEMORY WORLD controls ONLY the remembered location/event, people, wardrobe, props and action.
Do NOT copy the MEMORY WORLD 3×3 layout into the shot.
Select only the relevant remembered scene/cell and place that literal scene INSIDE the real reflective/transparent surface already present in the MAIN WORLD.
The MAIN WORLD still controls the window/pane frame, vehicle body, rain droplets, wet surface, current-city reflection and surrounding physical street.
Keep at least some present-city reflection / rain / pane boundary readable so the viewer understands that the memory exists inside a real surface rather than replacing the current city.

Use the supplied PROTAGONIST reference as the exact protagonist identity.

CHARACTER REFERENCES FOR THIS BOARD — REQUIRED WHEN THEIR PERSON APPEARS:
- CHARACTER 01 — PROTAGONIST
- CHARACTER 02 — SOHO WOMAN
- CHARACTER 06 — SHARED-HOUSE SUBSTITUTE / SNORING HOUSEMATE
- CHARACTER 07 — FX-MORTGAGE HOUSEMATE
- CHARACTER 08 — FX-MORTGAGE SPOUSE
- CHARACTER 09 — FX-MORTGAGE CHILD
Do not replace a referenced person with a newly invented face.

Keep protagonist face, age, body and hair identical. Current-city clothing follows the protagonist reference; remembered clothing may follow the period/context established by the MEMORY WORLD.

PHYSICAL PRESENT:
The protagonist is on ONE uninterrupted exterior walk through the London–Budapest dream city.
Present-day city remains physically visible in every dream-city frame.
He does not physically enter the remembered house, office, police room, lawyer room, courtroom or foreign-trip location.
Literal memories appear only INSIDE real reflective / transparent surfaces: taxi windows, bus windows, tram windows, shopfront/cultural/entrance glass, wet polished stone or puddles.
A memory can occupy a pane strongly, but the window frame, rain or some present-city reflection remains readable around/through it.
Memory order is emotional, not chronological. Memory edits without asking permission.

SCORE-CARD LAYER:
Cards are intentionally uncomfortable SYSTEM-world classification, not a MyScoutee product interface.
They are faint rounded translucent forms near head level, physically imperfect like reflection/lens artefact, not crisp HUD.
A tiny one/two-digit trace may exist but should usually be defocused.
Everyone can judge everyone: when one person directly looks at another, the VIEWED person's card temporarily becomes clearer, asynchronously.
Do not use flags, ethnicity stereotypes or face-based nationality coding.
Do not bake cards into mirrors as floating screens; they belong near people in the current dream city.

VISUAL STYLE:
Photorealistic live-action European feature film.
Grounded rain-soaked London–Budapest realism, dynamic but controlled camera: low tracking, lateral vehicle tracking, steadicam, rack focus, occasional 180/270-degree arcs, foreground pedestrian/vehicle wipes.
No static slideshow feeling, no 2.5D, no game engine, no psychedelic dream effect, no fantasy glow, no obvious sci-fi UI.
Memories are literal events, not metaphors.

CARD INTENSITY FOR THIS BLOCK:
Cards are barely visible, about 5–8% opacity. Most are missed. The protagonist has no readable self-card yet.

NINE ORDERED KEYFRAMES:
FRAME 1 — Opening low forward tracking in wet hybrid Soho. The protagonist walks naturally through a real crowd. St Stephen's Basilica terminates a London street axis; KÖNYV/KÁVÉ signage and a yellow tram already exist inside Soho. Nobody reacts. Cards are almost invisible.

FRAME 2 — Wider Piccadilly Circus continuity with Eros clearly present. A red bus, yellow tram and black taxi move normally through the junction. Two pedestrians glance at each other; the viewed person's faint card sharpens for only a moment, then softens.

FRAME 3 — Lateral move beside a black taxi. In its rain-covered side window, a literal Soho restaurant/sushi memory appears: the wrong-lavatory moment and the SOHO WOMAN briefly visible with a small human smile. Keep current Piccadilly/Soho reflection layered on the glass.

FRAME 4 — Large shopfront glass. Literal Soho lunch memory: the protagonist sits with colleagues while they eat; he quietly pretends he is not hungry. No melodrama. Present rain and London–Budapest reflection remain visible.

FRAME 5 — Yellow tram side windows. Literal shared-London-house memory: a cramped room containing many Hungarian adult housemates, compressed domestic space, shoes and belongings. Present tram frame and city reflection remain clear.

FRAME 6 — Adjacent tram/bus pane. Literal foreign-currency-mortgage housemate memory: one Hungarian man living abroad while spouse/child/home obligations remain in Hungary. Show a small ordinary domestic/family fragment, not explanatory text.

FRAME 7 — Cinema/theatre glass in Leicester. Literal dating memory: same photograph, phone/profile age field changes visually from 37 to 33; the human face does not change. Keep the phone/profile small inside the reflected memory and avoid UI spectacle.

FRAME 8 — Camera arcs around the protagonist through the Leicester crowd. Several people look at one another; viewed cards sharpen and blur asynchronously. Nobody is the sole observer. The Kossuth-style monument and Hungarian cultural block remain in the current city.

FRAME 9 — Wide Haymarket/Trafalgar-edge continuation. Red bus, yellow tram, black taxi, Eros/West-End depth and multiple wet panes coexist. The memories dim back into normal city reflections. The protagonist keeps walking.

FINAL CHECK:
Exactly one 16:9 final canvas with exactly nine equal numbered cinematic frames arranged 3×3.
Every individual frame is a true 16:9 widescreen composition, never square or 1:1.
0 px outer margin; only 1–2 px internal gutters.
Use the nine frames as ordered temporal keyframes, not nine unrelated illustrations.
The present remains one continuous exterior walk until the hard cut in STORYBOARD 07.
```


> **FLOW SETTING BEFORE GENERATION: Image → Aspect ratio → 16:9. Do not leave Flow at 1:1.**

## STORYBOARD 02 — 00:30–01:00 — GLOBAL ROUTE / LOCAL ENCOUNTER

```text
OUTPUT GEOMETRY — NON-NEGOTIABLE:
Generate a WIDESCREEN LANDSCAPE image with a TRUE 16:9 FINAL CANVAS, equivalent to 1920×1080.
Inside that 16:9 canvas, create ONE SINGLE FULL-BLEED 3×3 CINEMATIC STORYBOARD containing EXACTLY NINE equal frames.

GRID GEOMETRY:
3 equal columns × 3 equal rows across the entire 16:9 canvas.
Each storyboard frame must therefore be a TRUE 16:9 widescreen rectangle, equivalent to 640×360 within a 1920×1080 canvas.
DO NOT create a square 1:1 canvas.
DO NOT create square storyboard frames.
DO NOT place a square 3×3 contact sheet inside a wider canvas.
DO NOT add letterboxing or pillarboxing.
The 3×3 grid itself must fill the entire 16:9 canvas edge-to-edge.
Treat every cell as a real widescreen cinema frame intended to guide a 16:9 video shot.

The nine frames occupy 100% of the final canvas and touch every outer edge.
Outer margin: 0 pixels.
Use only hairline 1–2 pixel gutters BETWEEN frames.
No title band, no footer, no legend, no decorative frame, no explanatory text.
The ONLY layout text allowed is one tiny simple frame number 1–9 in the upper-left corner of each frame.
Normal in-world signage may appear where it belongs.

REFERENCE USE:
Use the supplied MAIN WORLD reference for the exact PHYSICAL PRESENT: current-city location, London–Budapest architecture, named Budapest anchors, lighting, weather, transport, glass/window geometry, wet surfaces and crowd continuity.

Use the following separate MEMORY CONTENT reference(s):
- MEMORY WORLD 02 — GLOBAL ROUTES / HUMAN ENCOUNTERS
- MEMORY WORLD 01 — LONDON / SOCIAL / HOME / DATING (only for the beginner-dance memory)

MEMORY-COMPOSITING RULE:
The MEMORY WORLD controls ONLY the remembered location/event, people, wardrobe, props and action.
Do NOT copy the MEMORY WORLD 3×3 layout into the shot.
Select only the relevant remembered scene/cell and place that literal scene INSIDE the real reflective/transparent surface already present in the MAIN WORLD.
The MAIN WORLD still controls the window/pane frame, vehicle body, rain droplets, wet surface, current-city reflection and surrounding physical street.
Keep at least some present-city reflection / rain / pane boundary readable so the viewer understands that the memory exists inside a real surface rather than replacing the current city.

Use the supplied PROTAGONIST reference as the exact protagonist identity.

CHARACTER REFERENCES FOR THIS BOARD — REQUIRED WHEN THEIR PERSON APPEARS:
- CHARACTER 01 — PROTAGONIST
- CHARACTER 10 — BEGINNER-DANCE WOMAN
- CHARACTER 11 — RUSSIAN TRANSIT PASSENGER
- CHARACTER 12 — AGRA BUS WOMAN
- CHARACTER 13 — SUDANESE TRAVELER — MAN
- CHARACTER 14 — SUDANESE TRAVELER — WOMAN
- CHARACTER 15 — CAIRO TAXI DRIVER
- CHARACTER 16 — BALLOON LOCAL HELPER — MAN
- CHARACTER 17 — BALLOON LOCAL HELPER — WOMAN
- CHARACTER 18–21 — BARMOUTH ROAD-TRIP GROUP if that memory is selected
Do not replace a referenced person with a newly invented face.

Keep protagonist face, age, body and hair identical. Current-city clothing follows the protagonist reference; remembered clothing may follow the period/context established by the MEMORY WORLD.

PHYSICAL PRESENT:
The protagonist is on ONE uninterrupted exterior walk through the London–Budapest dream city.
Present-day city remains physically visible in every dream-city frame.
He does not physically enter the remembered house, office, police room, lawyer room, courtroom or foreign-trip location.
Literal memories appear only INSIDE real reflective / transparent surfaces: taxi windows, bus windows, tram windows, shopfront/cultural/entrance glass, wet polished stone or puddles.
A memory can occupy a pane strongly, but the window frame, rain or some present-city reflection remains readable around/through it.
Memory order is emotional, not chronological. Memory edits without asking permission.

SCORE-CARD LAYER:
Cards are intentionally uncomfortable SYSTEM-world classification, not a MyScoutee product interface.
They are faint rounded translucent forms near head level, physically imperfect like reflection/lens artefact, not crisp HUD.
A tiny one/two-digit trace may exist but should usually be defocused.
Everyone can judge everyone: when one person directly looks at another, the VIEWED person's card temporarily becomes clearer, asynchronously.
Do not use flags, ethnicity stereotypes or face-based nationality coding.
Do not bake cards into mirrors as floating screens; they belong near people in the current dream city.

VISUAL STYLE:
Photorealistic live-action European feature film.
Grounded rain-soaked London–Budapest realism, dynamic but controlled camera: low tracking, lateral vehicle tracking, steadicam, rack focus, occasional 180/270-degree arcs, foreground pedestrian/vehicle wipes.
No static slideshow feeling, no 2.5D, no game engine, no psychedelic dream effect, no fantasy glow, no obvious sci-fi UI.
Memories are literal events, not metaphors.

CARD INTENSITY FOR THIS BLOCK:
Cards remain faint and mostly peripheral, roughly 5–8%, occasionally reaching 10% during direct gaze.

NINE ORDERED KEYFRAMES:
FRAME 1 — Continue through Charing Cross / Strand with the Nyugati-hybrid station frontage and Hungarian State Opera block visible in the present. The protagonist walks; the city remains normal.

FRAME 2 — London Underground entrance glass viewed from outside. Literal Moscow/St Petersburg memory: a local passenger uses their monthly travel card/pass to let the protagonist through a gate. Keep the present METRÓ/London entrance reflection around the memory; the current walker never descends.

FRAME 3 — Full red-bus side window. Literal India / Agra memory: the protagonist sits on a bus; a woman speaks from behind or across the seat, creating a human voice/contact moment. Avoid tourist-postcard monuments and exoticizing imagery.

FRAME 4 — Black taxi window. Literal Cairo memory: protagonist sharing a taxi with a Sudanese couple, ordinary temporary trust between strangers. Current Strand reflection and rain remain layered on the taxi glass.

FRAME 5 — Another moving pane continues Cairo: luggage unexpectedly falls from the taxi roof near an airport/exit context. Capture surprise and practical reaction, not slapstick.

FRAME 6 — Large passage/cultural glass. Literal hot-air-balloon memory: balloon lands in a vegetable plot near a wall; local people and passengers cooperate hand-to-hand to solve the situation. Warm human cooperation, no fantasy.

FRAME 7 — Restaurant/shop glass. Literal beginner dance-floor memory: awkward but real social participation, ordinary people, no glamour. A direct gaze between two present pedestrians briefly sharpens one card over the current glass reflection.

FRAME 8 — Wet bus shelter / glass canopy. Very fast route montage inside separate panes: rail track → Budapest tram wire → London transport line → wet bus window, visually echoing the notebook principle. Do not make it abstract animation; each is a literal remembered transport fragment.

FRAME 9 — Wide Aldwych / Embankment-side exterior. Opera/Nyugati/M4/Hungarian signage remain unmistakable in the present city. Memory panes return to normal reflections as the protagonist continues the exterior walk.

FINAL CHECK:
Exactly one 16:9 final canvas with exactly nine equal numbered cinematic frames arranged 3×3.
Every individual frame is a true 16:9 widescreen composition, never square or 1:1.
0 px outer margin; only 1–2 px internal gutters.
Use the nine frames as ordered temporal keyframes, not nine unrelated illustrations.
The present remains one continuous exterior walk until the hard cut in STORYBOARD 07.
```


> **FLOW SETTING BEFORE GENERATION: Image → Aspect ratio → 16:9. Do not leave Flow at 1:1.**

## STORYBOARD 03 — 01:00–01:30 — WORK / KATA / THE SYSTEM ENTERS

```text
OUTPUT GEOMETRY — NON-NEGOTIABLE:
Generate a WIDESCREEN LANDSCAPE image with a TRUE 16:9 FINAL CANVAS, equivalent to 1920×1080.
Inside that 16:9 canvas, create ONE SINGLE FULL-BLEED 3×3 CINEMATIC STORYBOARD containing EXACTLY NINE equal frames.

GRID GEOMETRY:
3 equal columns × 3 equal rows across the entire 16:9 canvas.
Each storyboard frame must therefore be a TRUE 16:9 widescreen rectangle, equivalent to 640×360 within a 1920×1080 canvas.
DO NOT create a square 1:1 canvas.
DO NOT create square storyboard frames.
DO NOT place a square 3×3 contact sheet inside a wider canvas.
DO NOT add letterboxing or pillarboxing.
The 3×3 grid itself must fill the entire 16:9 canvas edge-to-edge.
Treat every cell as a real widescreen cinema frame intended to guide a 16:9 video shot.

The nine frames occupy 100% of the final canvas and touch every outer edge.
Outer margin: 0 pixels.
Use only hairline 1–2 pixel gutters BETWEEN frames.
No title band, no footer, no legend, no decorative frame, no explanatory text.
The ONLY layout text allowed is one tiny simple frame number 1–9 in the upper-left corner of each frame.
Normal in-world signage may appear where it belongs.

REFERENCE USE:
Use the supplied MAIN WORLD reference for the exact PHYSICAL PRESENT: current-city location, London–Budapest architecture, named Budapest anchors, lighting, weather, transport, glass/window geometry, wet surfaces and crowd continuity.

Use the following separate MEMORY CONTENT reference(s):
- MEMORY WORLD 03 — WORK / ACCOUNTING / KATA / ADMIN

MEMORY-COMPOSITING RULE:
The MEMORY WORLD controls ONLY the remembered location/event, people, wardrobe, props and action.
Do NOT copy the MEMORY WORLD 3×3 layout into the shot.
Select only the relevant remembered scene/cell and place that literal scene INSIDE the real reflective/transparent surface already present in the MAIN WORLD.
The MAIN WORLD still controls the window/pane frame, vehicle body, rain droplets, wet surface, current-city reflection and surrounding physical street.
Keep at least some present-city reflection / rain / pane boundary readable so the viewer understands that the memory exists inside a real surface rather than replacing the current city.

Use the supplied PROTAGONIST reference as the exact protagonist identity.

CHARACTER REFERENCES FOR THIS BOARD — REQUIRED WHEN THEIR PERSON APPEARS:
- CHARACTER 01 — PROTAGONIST
- CHARACTER 22 — ACCOUNTANT
- CHARACTER 23 — ADMIN COLLEAGUE A
- CHARACTER 24 — ADMIN COLLEAGUE B
Do not replace a referenced person with a newly invented face.

Keep protagonist face, age, body and hair identical. Current-city clothing follows the protagonist reference; remembered clothing may follow the period/context established by the MEMORY WORLD.

PHYSICAL PRESENT:
The protagonist is on ONE uninterrupted exterior walk through the London–Budapest dream city.
Present-day city remains physically visible in every dream-city frame.
He does not physically enter the remembered house, office, police room, lawyer room, courtroom or foreign-trip location.
Literal memories appear only INSIDE real reflective / transparent surfaces: taxi windows, bus windows, tram windows, shopfront/cultural/entrance glass, wet polished stone or puddles.
A memory can occupy a pane strongly, but the window frame, rain or some present-city reflection remains readable around/through it.
Memory order is emotional, not chronological. Memory edits without asking permission.

SCORE-CARD LAYER:
Cards are intentionally uncomfortable SYSTEM-world classification, not a MyScoutee product interface.
They are faint rounded translucent forms near head level, physically imperfect like reflection/lens artefact, not crisp HUD.
A tiny one/two-digit trace may exist but should usually be defocused.
Everyone can judge everyone: when one person directly looks at another, the VIEWED person's card temporarily becomes clearer, asynchronously.
Do not use flags, ethnicity stereotypes or face-based nationality coding.
Do not bake cards into mirrors as floating screens; they belong near people in the current dream city.

VISUAL STYLE:
Photorealistic live-action European feature film.
Grounded rain-soaked London–Budapest realism, dynamic but controlled camera: low tracking, lateral vehicle tracking, steadicam, rack focus, occasional 180/270-degree arcs, foreground pedestrian/vehicle wipes.
No static slideshow feeling, no 2.5D, no game engine, no psychedelic dream effect, no fantasy glow, no obvious sci-fi UI.
Memories are literal events, not metaphors.

CARD INTENSITY FOR THIS BLOCK:
Cards become somewhat clearer around people seen through professional glass, roughly 8–12%, but still not explicit UI. Direct gaze remains the trigger.

NINE ORDERED KEYFRAMES:
FRAME 1 — Continue through the work-city exterior: New York Palace / Academy / Lechner-derived Budapest blocks inside London geometry. The protagonist walks beside large office glass; IRODA/KÖNYVELÉS signs exist as normal city signage.

FRAME 2 — Large office-façade pane. Literal cross-border remote-work memory: protagonist on an international work call/computer task, ordinary long-day professional environment, not a heroic tech montage. Present rain and city reflection remain visible.

FRAME 3 — Accounting-frontage glass. Literal memory of 13–15-hour workdays, invoice/forms/calendar/printer, the need to delegate accounting while a live foreign contract continues. Show ordinary pressure, not villainy.

FRAME 4 — Three adjacent panes / one large divided façade. Literal 'three people / no shared screen' memory: three people dealing with the same administrative problem, each looking at a different document/screen version. They are physically near but informationally separated. No one is evil.

FRAME 5 — Wet civic glass. Literal KATA-change memory: calendar/date, ordinary government-style notification/letter and a return/form needing correction. Keep text mostly unreadable; show process through objects and reactions.

FRAME 6 — Taxi or tram window. Literal delegation/password/accounting memory: accountant, portal/login responsibility and correction chain implied by hands, screen and paperwork, without turning it into cybersecurity graphics.

FRAME 7 — Café/office pane. The protagonist in memory tries to repair the situation by phone while another person checks a different record. Present pedestrians cross the glass; their viewed cards sharpen briefly when they look at one another.

FRAME 8 — Dark office entrance glass. Multiple remembered voices are suggested visually by mouths/phones/people in different panes, but do not render subtitles. The current protagonist pauses, hearing the system's different versions.

FRAME 9 — Wide Holborn/Fleet-edge continuation. The current city is still exterior, wet and crowded. The protagonist keeps walking; cards are slightly clearer around professional crowds than in Soho, but the phenomenon remains unexplained.

FINAL CHECK:
Exactly one 16:9 final canvas with exactly nine equal numbered cinematic frames arranged 3×3.
Every individual frame is a true 16:9 widescreen composition, never square or 1:1.
0 px outer margin; only 1–2 px internal gutters.
Use the nine frames as ordered temporal keyframes, not nine unrelated illustrations.
The present remains one continuous exterior walk until the hard cut in STORYBOARD 07.
```


> **FLOW SETTING BEFORE GENERATION: Image → Aspect ratio → 16:9. Do not leave Flow at 1:1.**

## STORYBOARD 04 — 01:30–02:00 — POLICE / LAWYERS / PROCEDURE

```text
OUTPUT GEOMETRY — NON-NEGOTIABLE:
Generate a WIDESCREEN LANDSCAPE image with a TRUE 16:9 FINAL CANVAS, equivalent to 1920×1080.
Inside that 16:9 canvas, create ONE SINGLE FULL-BLEED 3×3 CINEMATIC STORYBOARD containing EXACTLY NINE equal frames.

GRID GEOMETRY:
3 equal columns × 3 equal rows across the entire 16:9 canvas.
Each storyboard frame must therefore be a TRUE 16:9 widescreen rectangle, equivalent to 640×360 within a 1920×1080 canvas.
DO NOT create a square 1:1 canvas.
DO NOT create square storyboard frames.
DO NOT place a square 3×3 contact sheet inside a wider canvas.
DO NOT add letterboxing or pillarboxing.
The 3×3 grid itself must fill the entire 16:9 canvas edge-to-edge.
Treat every cell as a real widescreen cinema frame intended to guide a 16:9 video shot.

The nine frames occupy 100% of the final canvas and touch every outer edge.
Outer margin: 0 pixels.
Use only hairline 1–2 pixel gutters BETWEEN frames.
No title band, no footer, no legend, no decorative frame, no explanatory text.
The ONLY layout text allowed is one tiny simple frame number 1–9 in the upper-left corner of each frame.
Normal in-world signage may appear where it belongs.

REFERENCE USE:
Use the supplied MAIN WORLD reference for the exact PHYSICAL PRESENT: current-city location, London–Budapest architecture, named Budapest anchors, lighting, weather, transport, glass/window geometry, wet surfaces and crowd continuity.

Use the following separate MEMORY CONTENT reference(s):
- MEMORY WORLD 04 — POLICE / SEARCH / DEFENCE

MEMORY-COMPOSITING RULE:
The MEMORY WORLD controls ONLY the remembered location/event, people, wardrobe, props and action.
Do NOT copy the MEMORY WORLD 3×3 layout into the shot.
Select only the relevant remembered scene/cell and place that literal scene INSIDE the real reflective/transparent surface already present in the MAIN WORLD.
The MAIN WORLD still controls the window/pane frame, vehicle body, rain droplets, wet surface, current-city reflection and surrounding physical street.
Keep at least some present-city reflection / rain / pane boundary readable so the viewer understands that the memory exists inside a real surface rather than replacing the current city.

Use the supplied PROTAGONIST reference as the exact protagonist identity.

CHARACTER REFERENCES FOR THIS BOARD — REQUIRED WHEN THEIR PERSON APPEARS:
- CHARACTER 01 — PROTAGONIST
- CHARACTER 03 — POLICEWOMAN
- CHARACTER 04 — APPOINTED LAWYER
- CHARACTER 25 — SEARCH OFFICER — MALE
- CHARACTER 26 — DEFENCE-OFFICE SUBSTITUTE
Do not replace a referenced person with a newly invented face.

Keep protagonist face, age, body and hair identical. Current-city clothing follows the protagonist reference; remembered clothing may follow the period/context established by the MEMORY WORLD.

PHYSICAL PRESENT:
The protagonist is on ONE uninterrupted exterior walk through the London–Budapest dream city.
Present-day city remains physically visible in every dream-city frame.
He does not physically enter the remembered house, office, police room, lawyer room, courtroom or foreign-trip location.
Literal memories appear only INSIDE real reflective / transparent surfaces: taxi windows, bus windows, tram windows, shopfront/cultural/entrance glass, wet polished stone or puddles.
A memory can occupy a pane strongly, but the window frame, rain or some present-city reflection remains readable around/through it.
Memory order is emotional, not chronological. Memory edits without asking permission.

SCORE-CARD LAYER:
Cards are intentionally uncomfortable SYSTEM-world classification, not a MyScoutee product interface.
They are faint rounded translucent forms near head level, physically imperfect like reflection/lens artefact, not crisp HUD.
A tiny one/two-digit trace may exist but should usually be defocused.
Everyone can judge everyone: when one person directly looks at another, the VIEWED person's card temporarily becomes clearer, asynchronously.
Do not use flags, ethnicity stereotypes or face-based nationality coding.
Do not bake cards into mirrors as floating screens; they belong near people in the current dream city.

VISUAL STYLE:
Photorealistic live-action European feature film.
Grounded rain-soaked London–Budapest realism, dynamic but controlled camera: low tracking, lateral vehicle tracking, steadicam, rack focus, occasional 180/270-degree arcs, foreground pedestrian/vehicle wipes.
No static slideshow feeling, no 2.5D, no game engine, no psychedelic dream effect, no fantasy glow, no obvious sci-fi UI.
Memories are literal events, not metaphors.

CARD INTENSITY FOR THIS BLOCK:
Cards rise to roughly 10–15% in the current formal-city crowd. They still sharpen only through gaze and remain physically imperfect.

NINE ORDERED KEYFRAMES:
FRAME 1 — Continue outside along Fleet Street / Temple formal city. Budapest Palace-of-Justice / National-Museum architecture is fused into London blocks. The protagonist remains on the pavement.

FRAME 2 — Large wet shopfront/entrance glass. Literal memory: buzzer/door-entry moment in which someone announces 'postman' and the apartment door opens, followed immediately by ordinary police entering. Do not render the word as text; show it as a spoken action.

FRAME 3 — Black taxi side window. Literal police-search memory: officers search an apartment and one officer is visibly speaking the remembered line about looking for cocaine. No action-thriller style, no drugs glamorization; ordinary procedural search.

FRAME 4 — Yellow tram window. Continuation of the same memory: one officer accidentally steps on the protagonist's recently operated foot. Show sudden pain and physical vulnerability, not a medical reveal and not gore.

FRAME 5 — Bus-shelter or broad civic glass. Literal fingerprinting memory with the recurring POLICEWOMAN present. The scene contains the awkward human contradiction of attraction / embarrassed expression during a formal procedure. No romance staging.

FRAME 6 — Red-bus side window. Literal appointed-defence memory: a substitute/person from the appointed-defence office appears instead of the expected lawyer; later defenders are difficult to contact. Use the recurring LAWYER only where appropriate, and show discontinuity rather than villainy.

FRAME 7 — Dark entrance glass. Literal phone/corridor memory of attempts to contact police, prosecution, court and defence routes. Different people redirect the protagonist. Keep all speakers anonymous and ordinary.

FRAME 8 — 180–270 degree current-city arc around the walking protagonist. Several formal glass surfaces simultaneously carry one-second procedural fragments; present pedestrians look at each other and cards sharpen asynchronously. Everyone remains human locally.

FRAME 9 — Blackfriars-approach wide exterior. The institutional memories fade, but the formal Budapest-in-London architecture remains physically present. The protagonist keeps walking outside.

FINAL CHECK:
Exactly one 16:9 final canvas with exactly nine equal numbered cinematic frames arranged 3×3.
Every individual frame is a true 16:9 widescreen composition, never square or 1:1.
0 px outer margin; only 1–2 px internal gutters.
Use the nine frames as ordered temporal keyframes, not nine unrelated illustrations.
The present remains one continuous exterior walk until the hard cut in STORYBOARD 07.
```


> **FLOW SETTING BEFORE GENERATION: Image → Aspect ratio → 16:9. Do not leave Flow at 1:1.**

## STORYBOARD 05 — 02:00–02:30 — COURT / CLASSIFICATION / THE PERSON VS THE FILE

```text
OUTPUT GEOMETRY — NON-NEGOTIABLE:
Generate a WIDESCREEN LANDSCAPE image with a TRUE 16:9 FINAL CANVAS, equivalent to 1920×1080.
Inside that 16:9 canvas, create ONE SINGLE FULL-BLEED 3×3 CINEMATIC STORYBOARD containing EXACTLY NINE equal frames.

GRID GEOMETRY:
3 equal columns × 3 equal rows across the entire 16:9 canvas.
Each storyboard frame must therefore be a TRUE 16:9 widescreen rectangle, equivalent to 640×360 within a 1920×1080 canvas.
DO NOT create a square 1:1 canvas.
DO NOT create square storyboard frames.
DO NOT place a square 3×3 contact sheet inside a wider canvas.
DO NOT add letterboxing or pillarboxing.
The 3×3 grid itself must fill the entire 16:9 canvas edge-to-edge.
Treat every cell as a real widescreen cinema frame intended to guide a 16:9 video shot.

The nine frames occupy 100% of the final canvas and touch every outer edge.
Outer margin: 0 pixels.
Use only hairline 1–2 pixel gutters BETWEEN frames.
No title band, no footer, no legend, no decorative frame, no explanatory text.
The ONLY layout text allowed is one tiny simple frame number 1–9 in the upper-left corner of each frame.
Normal in-world signage may appear where it belongs.

REFERENCE USE:
Use the supplied MAIN WORLD reference for the exact PHYSICAL PRESENT: current-city location, London–Budapest architecture, named Budapest anchors, lighting, weather, transport, glass/window geometry, wet surfaces and crowd continuity.

Use the following separate MEMORY CONTENT reference(s):
- MEMORY WORLD 05 — COURT / FILE / ASSETS / BLACK HUMOUR

MEMORY-COMPOSITING RULE:
The MEMORY WORLD controls ONLY the remembered location/event, people, wardrobe, props and action.
Do NOT copy the MEMORY WORLD 3×3 layout into the shot.
Select only the relevant remembered scene/cell and place that literal scene INSIDE the real reflective/transparent surface already present in the MAIN WORLD.
The MAIN WORLD still controls the window/pane frame, vehicle body, rain droplets, wet surface, current-city reflection and surrounding physical street.
Keep at least some present-city reflection / rain / pane boundary readable so the viewer understands that the memory exists inside a real surface rather than replacing the current city.

Use the supplied PROTAGONIST reference as the exact protagonist identity.

CHARACTER REFERENCES FOR THIS BOARD — REQUIRED WHEN THEIR PERSON APPEARS:
- CHARACTER 01 — PROTAGONIST
- CHARACTER 04 — APPOINTED LAWYER where used
- CHARACTER 27 — JUDGE
- CHARACTER 28 — FORENSIC EXPERT A
- CHARACTER 29 — FORENSIC EXPERT B
- CHARACTER 30 — COURT CLERK
- CHARACTER 31 — ANONYMOUS FICTIONAL POLITICAL FIGURE where used
Do not replace a referenced person with a newly invented face.

Keep protagonist face, age, body and hair identical. Current-city clothing follows the protagonist reference; remembered clothing may follow the period/context established by the MEMORY WORLD.

PHYSICAL PRESENT:
The protagonist is on ONE uninterrupted exterior walk through the London–Budapest dream city.
Present-day city remains physically visible in every dream-city frame.
He does not physically enter the remembered house, office, police room, lawyer room, courtroom or foreign-trip location.
Literal memories appear only INSIDE real reflective / transparent surfaces: taxi windows, bus windows, tram windows, shopfront/cultural/entrance glass, wet polished stone or puddles.
A memory can occupy a pane strongly, but the window frame, rain or some present-city reflection remains readable around/through it.
Memory order is emotional, not chronological. Memory edits without asking permission.

SCORE-CARD LAYER:
Cards are intentionally uncomfortable SYSTEM-world classification, not a MyScoutee product interface.
They are faint rounded translucent forms near head level, physically imperfect like reflection/lens artefact, not crisp HUD.
A tiny one/two-digit trace may exist but should usually be defocused.
Everyone can judge everyone: when one person directly looks at another, the VIEWED person's card temporarily becomes clearer, asynchronously.
Do not use flags, ethnicity stereotypes or face-based nationality coding.
Do not bake cards into mirrors as floating screens; they belong near people in the current dream city.

VISUAL STYLE:
Photorealistic live-action European feature film.
Grounded rain-soaked London–Budapest realism, dynamic but controlled camera: low tracking, lateral vehicle tracking, steadicam, rack focus, occasional 180/270-degree arcs, foreground pedestrian/vehicle wipes.
No static slideshow feeling, no 2.5D, no game engine, no psychedelic dream effect, no fantasy glow, no obvious sci-fi UI.
Memories are literal events, not metaphors.

CARD INTENSITY FOR THIS BLOCK:
Cards are now clearly perceptible around the current crowd, roughly 12–18%, but still translucent and non-HUD. The protagonist's own card is not yet fully readable.

NINE ORDERED KEYFRAMES:
FRAME 1 — Continue along Blackfriars riverfront with Hungarian Parliament and Gresham Palace anchors physically present in London Thames geometry. The protagonist remains outside.

FRAME 2 — Very large riverside cultural glass. Literal court-hearing memory: a judge at a hearing asks the protagonist the remembered prison question. Do not render dialogue as subtitles. Keep the judge anonymous/non-identifiable and the moment restrained, not melodramatic.

FRAME 3 — Black taxi glass. Literal memory of questions about the Budapest apartment, belongings, savings and what else he owns. Show the apartment/home and ordinary possessions becoming items of inquiry; the memory should feel like a human archive being reduced to assets.

FRAME 4 — Red-bus side windows. Literal memory of retained devices/belongings and paperwork: phone/laptop/storage/closed evidence or property boxes, ordinary administrative handling. No crime-thriller evidence wall.

FRAME 5 — Yellow tram windows. Literal file sequence: photograph, fingerprint sheet, signature, closed folder, forms. Across successive panes, the record occupies more visual space than the person's face.

FRAME 6 — Restaurant/cultural glass. Literal forensic-examination memory: two expert chairs, differing reactions, one asks what happened; the protagonist remains calm/cooperative. Do not imply a single unified expert voice.

FRAME 7 — Dark public glass. Black-humour memory: 'KATA's most wanted' / impossible police-career application tone represented as a small satirical self-made visual/poster or CV fragment inside the memory, without identifiable political figures and without large readable text.

FRAME 8 — Broad entrance glass. Literal clerk/court-route memory: request for recording/evidence, discussion of expensive official recording and future complaint/appeal routes while present correction remains unresolved. Keep text unreadable and focus on ordinary people, phone, letter, file.

FRAME 9 — Wide river city. Hungarian Parliament, London bridge geometry, yellow tram, red bus and black taxi remain in the physical present. The protagonist is visually smaller among many panes and many faint cards; the city feels like it can classify everyone.

FINAL CHECK:
Exactly one 16:9 final canvas with exactly nine equal numbered cinematic frames arranged 3×3.
Every individual frame is a true 16:9 widescreen composition, never square or 1:1.
0 px outer margin; only 1–2 px internal gutters.
Use the nine frames as ordered temporal keyframes, not nine unrelated illustrations.
The present remains one continuous exterior walk until the hard cut in STORYBOARD 07.
```


> **FLOW SETTING BEFORE GENERATION: Image → Aspect ratio → 16:9. Do not leave Flow at 1:1.**

## STORYBOARD 06 — 02:30–03:00 — OVERLOAD / HUMANITY BREAKS THROUGH

```text
OUTPUT GEOMETRY — NON-NEGOTIABLE:
Generate a WIDESCREEN LANDSCAPE image with a TRUE 16:9 FINAL CANVAS, equivalent to 1920×1080.
Inside that 16:9 canvas, create ONE SINGLE FULL-BLEED 3×3 CINEMATIC STORYBOARD containing EXACTLY NINE equal frames.

GRID GEOMETRY:
3 equal columns × 3 equal rows across the entire 16:9 canvas.
Each storyboard frame must therefore be a TRUE 16:9 widescreen rectangle, equivalent to 640×360 within a 1920×1080 canvas.
DO NOT create a square 1:1 canvas.
DO NOT create square storyboard frames.
DO NOT place a square 3×3 contact sheet inside a wider canvas.
DO NOT add letterboxing or pillarboxing.
The 3×3 grid itself must fill the entire 16:9 canvas edge-to-edge.
Treat every cell as a real widescreen cinema frame intended to guide a 16:9 video shot.

The nine frames occupy 100% of the final canvas and touch every outer edge.
Outer margin: 0 pixels.
Use only hairline 1–2 pixel gutters BETWEEN frames.
No title band, no footer, no legend, no decorative frame, no explanatory text.
The ONLY layout text allowed is one tiny simple frame number 1–9 in the upper-left corner of each frame.
Normal in-world signage may appear where it belongs.

REFERENCE USE:
Use the supplied MAIN WORLD reference for the exact PHYSICAL PRESENT: current-city location, London–Budapest architecture, named Budapest anchors, lighting, weather, transport, glass/window geometry, wet surfaces and crowd continuity.

Use the following separate MEMORY CONTENT reference(s):
- MEMORY WORLD 06 — HUMANITY BREAKS THROUGH / RECURRING POSITIVE COUNTERMEMORIES

MEMORY-COMPOSITING RULE:
The MEMORY WORLD controls ONLY the remembered location/event, people, wardrobe, props and action.
Do NOT copy the MEMORY WORLD 3×3 layout into the shot.
Select only the relevant remembered scene/cell and place that literal scene INSIDE the real reflective/transparent surface already present in the MAIN WORLD.
The MAIN WORLD still controls the window/pane frame, vehicle body, rain droplets, wet surface, current-city reflection and surrounding physical street.
Keep at least some present-city reflection / rain / pane boundary readable so the viewer understands that the memory exists inside a real surface rather than replacing the current city.

Use the supplied PROTAGONIST reference as the exact protagonist identity.

CHARACTER REFERENCES FOR THIS BOARD — REQUIRED WHEN THEIR PERSON APPEARS:
- CHARACTER 01 — PROTAGONIST
- CHARACTER 02 — SOHO WOMAN
- CHARACTER 03 — POLICEWOMAN
- CHARACTER 04 — APPOINTED LAWYER
- CHARACTER 10 — BEGINNER-DANCE WOMAN
- CHARACTER 11 — RUSSIAN TRANSIT PASSENGER
- CHARACTER 16 — BALLOON LOCAL HELPER — MAN
- CHARACTER 17 — BALLOON LOCAL HELPER — WOMAN
- CHARACTER 27 — JUDGE and/or CHARACTER 28–29 — FORENSIC EXPERTS for the selected institutional human moment
Do not replace a referenced person with a newly invented face.

Keep protagonist face, age, body and hair identical. Current-city clothing follows the protagonist reference; remembered clothing may follow the period/context established by the MEMORY WORLD.

PHYSICAL PRESENT:
The protagonist is on ONE uninterrupted exterior walk through the London–Budapest dream city.
Present-day city remains physically visible in every dream-city frame.
He does not physically enter the remembered house, office, police room, lawyer room, courtroom or foreign-trip location.
Literal memories appear only INSIDE real reflective / transparent surfaces: taxi windows, bus windows, tram windows, shopfront/cultural/entrance glass, wet polished stone or puddles.
A memory can occupy a pane strongly, but the window frame, rain or some present-city reflection remains readable around/through it.
Memory order is emotional, not chronological. Memory edits without asking permission.

SCORE-CARD LAYER:
Cards are intentionally uncomfortable SYSTEM-world classification, not a MyScoutee product interface.
They are faint rounded translucent forms near head level, physically imperfect like reflection/lens artefact, not crisp HUD.
A tiny one/two-digit trace may exist but should usually be defocused.
Everyone can judge everyone: when one person directly looks at another, the VIEWED person's card temporarily becomes clearer, asynchronously.
Do not use flags, ethnicity stereotypes or face-based nationality coding.
Do not bake cards into mirrors as floating screens; they belong near people in the current dream city.

VISUAL STYLE:
Photorealistic live-action European feature film.
Grounded rain-soaked London–Budapest realism, dynamic but controlled camera: low tracking, lateral vehicle tracking, steadicam, rack focus, occasional 180/270-degree arcs, foreground pedestrian/vehicle wipes.
No static slideshow feeling, no 2.5D, no game engine, no psychedelic dream effect, no fantasy glow, no obvious sci-fi UI.
Memories are literal events, not metaphors.

CARD INTENSITY FOR THIS BLOCK:
Cards across the current crowd are 18–25% and frequently readable during gaze. In FRAME 8 the protagonist's own card becomes clearly visible for the first time, matching the crowd.

NINE ORDERED KEYFRAMES:
FRAME 1 — Continue west along South Bank in the maximum-density hybrid city: Great Market Hall / National Theatre / Bálna elements, London Eye and separated Hungarian Parliament sightline. Many current pedestrians carry increasingly visible cards.

FRAME 2 — Lateral move along red bus + yellow tram windows. Several literal positive memories coexist across different panes: Soho woman's small smile, Russian passenger opening the gate, balloon/vegetable-plot hands helping. Keep each pane distinct and readable, not collage mush.

FRAME 3 — Large public glass. Literal police/humanity memory: the POLICEWOMAN or another officer struggles not to laugh / gives an embarrassed human smile during an otherwise formal procedure. Nothing procedural changes.

FRAME 4 — Bus window. Literal lawyer memory: a lawyer asks for another room / shows a moment of ordinary human discomfort or practical help. Avoid hero/villain framing.

FRAME 5 — Tram/cultural glass. Brief judge/expert/official expression changes, then a warm unrelated human memory such as dance-floor or stranger cooperation. The point is that roles are not whole people.

FRAME 6 — Multiple architectural panes at once: court/file/work/police fragments overlap with shared-house/travel/relationship fragments. Keep the present city frame and reflections physically readable. This is dense but not psychedelic.

FRAME 7 — Current crowd interaction becomes the focus. Many people look at other people; viewed cards sharpen at different moments, creating a living web of judgments. The protagonist is not the only observer and not the only judged person.

FRAME 8 — For the first time, the protagonist's OWN card becomes clearly visible near his head at the same sharpness as nearby cards. He notices only briefly; restrained reaction, no panic. He is visually one record among many.

FRAME 9 — Westminster Bridge approach begins to clear. Traffic and crowd density reduce slightly; the city remains wet and real. The protagonist walks toward a quieter continuation. NO clinical imagery yet.

FINAL CHECK:
Exactly one 16:9 final canvas with exactly nine equal numbered cinematic frames arranged 3×3.
Every individual frame is a true 16:9 widescreen composition, never square or 1:1.
0 px outer margin; only 1–2 px internal gutters.
Use the nine frames as ordered temporal keyframes, not nine unrelated illustrations.
The present remains one continuous exterior walk until the hard cut in STORYBOARD 07.
```


> **FLOW SETTING BEFORE GENERATION: Image → Aspect ratio → 16:9. Do not leave Flow at 1:1.**

## STORYBOARD 07 — 03:00–03:20 — THE LAST WINDOW / HARD CUT

```text
OUTPUT GEOMETRY — NON-NEGOTIABLE:
Generate a WIDESCREEN LANDSCAPE image with a TRUE 16:9 FINAL CANVAS, equivalent to 1920×1080.
Inside that 16:9 canvas, create ONE SINGLE FULL-BLEED 3×3 CINEMATIC STORYBOARD containing EXACTLY NINE equal frames.

GRID GEOMETRY:
3 equal columns × 3 equal rows across the entire 16:9 canvas.
Each storyboard frame must therefore be a TRUE 16:9 widescreen rectangle, equivalent to 640×360 within a 1920×1080 canvas.
DO NOT create a square 1:1 canvas.
DO NOT create square storyboard frames.
DO NOT place a square 3×3 contact sheet inside a wider canvas.
DO NOT add letterboxing or pillarboxing.
The 3×3 grid itself must fill the entire 16:9 canvas edge-to-edge.
Treat every cell as a real widescreen cinema frame intended to guide a 16:9 video shot.

The nine frames occupy 100% of the final canvas and touch every outer edge.
Outer margin: 0 pixels.
Use only hairline 1–2 pixel gutters BETWEEN frames.
No title band, no footer, no legend, no decorative frame, no explanatory text.
The ONLY layout text allowed is one tiny simple frame number 1–9 in the upper-left corner of each frame.
Normal in-world signage may appear where it belongs.

REFERENCE USE:
Use the supplied MAIN WORLD reference for the exact PHYSICAL PRESENT: current-city location, London–Budapest architecture, named Budapest anchors, lighting, weather, transport, glass/window geometry, wet surfaces and crowd continuity.

Use the following separate MEMORY CONTENT reference(s):
- HIDDEN REALITY WORLD 07 — CLINICAL ROOM / FINAL REVEAL ONLY

MEMORY-COMPOSITING RULE:
The MEMORY WORLD controls ONLY the remembered location/event, people, wardrobe, props and action.
Do NOT copy the MEMORY WORLD 3×3 layout into the shot.
Select only the relevant remembered scene/cell and place that literal scene INSIDE the real reflective/transparent surface already present in the MAIN WORLD.
The MAIN WORLD still controls the window/pane frame, vehicle body, rain droplets, wet surface, current-city reflection and surrounding physical street.
Keep at least some present-city reflection / rain / pane boundary readable so the viewer understands that the memory exists inside a real surface rather than replacing the current city.

Use the supplied PROTAGONIST reference as the exact protagonist identity.

CHARACTER REFERENCES FOR THIS BOARD — REQUIRED WHEN THEIR PERSON APPEARS:
- CHARACTER 01 — PROTAGONIST
- CHARACTER 05 — FINAL NURSE
Do not replace a referenced person with a newly invented face.

Keep protagonist face, age, body and hair identical. Current-city clothing follows the protagonist reference; remembered clothing may follow the period/context established by the MEMORY WORLD.

PHYSICAL PRESENT:
The protagonist is on ONE uninterrupted exterior walk through the London–Budapest dream city.
Present-day city remains physically visible in every dream-city frame.
He does not physically enter the remembered house, office, police room, lawyer room, courtroom or foreign-trip location.
Literal memories appear only INSIDE real reflective / transparent surfaces: taxi windows, bus windows, tram windows, shopfront/cultural/entrance glass, wet polished stone or puddles.
A memory can occupy a pane strongly, but the window frame, rain or some present-city reflection remains readable around/through it.
Memory order is emotional, not chronological. Memory edits without asking permission.

SCORE-CARD LAYER:
Cards are intentionally uncomfortable SYSTEM-world classification, not a MyScoutee product interface.
They are faint rounded translucent forms near head level, physically imperfect like reflection/lens artefact, not crisp HUD.
A tiny one/two-digit trace may exist but should usually be defocused.
Everyone can judge everyone: when one person directly looks at another, the VIEWED person's card temporarily becomes clearer, asynchronously.
Do not use flags, ethnicity stereotypes or face-based nationality coding.
Do not bake cards into mirrors as floating screens; they belong near people in the current dream city.

VISUAL STYLE:
Photorealistic live-action European feature film.
Grounded rain-soaked London–Budapest realism, dynamic but controlled camera: low tracking, lateral vehicle tracking, steadicam, rack focus, occasional 180/270-degree arcs, foreground pedestrian/vehicle wipes.
No static slideshow feeling, no 2.5D, no game engine, no psychedelic dream effect, no fantasy glow, no obvious sci-fi UI.
Memories are literal events, not metaphors.

CARD INTENSITY FOR THIS BLOCK:
At the start, crowd cards and the protagonist's own card are equally clear. As the final glass reflection loses the city, reflected cards fade out one by one. In the clinical reality there are NO cards, contours or numbers.

NINE ORDERED KEYFRAMES:
FRAME 1 — Quieter Westminster / Whitehall exterior. The protagonist continues the same walk. Hungarian Parliament and a distant St Stephen's Basilica echo remain possible in separated sightlines. Cards are clearer but pedestrians are now more distant.

FRAME 2 — A large dark street-facing pane briefly catches an ambiguous COLD WHITE LIGHT that does not belong to the warm-neutral lobby. Less than a second in the intended video. Immediately retain normal city reflection around it.

FRAME 3 — Another passing window reflection contains only the edge of a WHITE COAT for a fraction of a second, immediately returning to the London–Budapest city.

FRAME 4 — Final-building glass briefly contains a fragment of an IMMOBILIZED / ELEVATED LEG, less than a second, still mixed with rain and current street reflection. Do not show a complete clinical room.

FRAME 5 — Another extremely short reflection contains a METAL RESTRAINT and a white-sheet edge. The reflected pedestrians' cards begin fading one by one as the protagonist nears the final doors.

FRAME 6 — The protagonist stands immediately outside the broad dark-glass entrance. His hand approaches the real handle. The glass strongly reflects the hybrid city: red bus colour, yellow tram, black taxi, Pest stone, wet street. His own card is still faintly present.

FRAME 7 — Same glass surface, closer. Without fantasy effects, the reflected city loses information and the pane appears to show a cold ordinary clinical room directly behind him. The last reflected cards disappear. The protagonist turns. This is the last dream-city frame.

FRAME 8 — HARD CUT to the real clinical room. Same protagonist, conscious, not waking up. One leg elevated and immobilized; one arm restrained. A calm ordinary NURSE is nearby preparing routine non-graphic equipment for an enema/endoscopy-related procedure. No horror, no gore, no supernatural quality, no cards. The nurse has a small ordinary human smile.

FRAME 9 — Quiet final hold in the same real room: protagonist looks toward the nurse, breathing/room-tone feeling, ordinary clinical reality. Then intended edit cuts to black with the title added cleanly in post: MYSCOUTEE / THE PATH BETWEEN PEOPLE. Do not turn this frame into a dream wake-up or explanatory ending.

FINAL CHECK:
Exactly one 16:9 final canvas with exactly nine equal numbered cinematic frames arranged 3×3.
Every individual frame is a true 16:9 widescreen composition, never square or 1:1.
0 px outer margin; only 1–2 px internal gutters.
Use the nine frames as ordered temporal keyframes, not nine unrelated illustrations.
The present remains one continuous exterior walk until the hard cut in STORYBOARD 07.
```


================================================================================

================================================================================
================================================================================
## HIGGSFIELD AUDIO / SEED AUDIO 1.0 — FINAL NARRATION COPY PACK
================================================================================

> **OPERATOR NOTE — DO NOT COPY:** Generate these seven CLEAN narration files before Cinema Studio. Select the same Seed Audio 1.0 male voice preset for all seven. The fenced block contains ONLY text that should be spoken. Do not add SFX/music instructions to the TTS request.


### NARRATION 01 — THE CITY JUDGES FIRST

**GENERATED OUTPUT:** `A01_NARRATION.wav`

**HIGGSFIELD AUDIO SETTINGS — DO NOT COPY:** Seed Audio 1.0; use the exact same selected male voice preset and voice settings as Narration 01–07. Narration only. Prefer WAV / 48 kHz if available.

================================================================================
**⬇ COPY ONLY THE WORDS INSIDE THIS CODE BLOCK INTO THE TTS TEXT FIELD ⬇**
================================================================================

```text
I don't remember my life as a straight line. A street becomes a room, a window becomes another country, a glance becomes a verdict before anyone has time to speak. Memory edits without asking permission. Sometimes the only thing that survives the cut is a smile.
```


### NARRATION 02 — GLOBAL ROUTE / LOCAL ENCOUNTER

**GENERATED OUTPUT:** `A02_NARRATION.wav`

**HIGGSFIELD AUDIO SETTINGS — DO NOT COPY:** Seed Audio 1.0; use the exact same selected male voice preset and voice settings as Narration 01–07. Narration only. Prefer WAV / 48 kHz if available.

================================================================================
**⬇ COPY ONLY THE WORDS INSIDE THIS CODE BLOCK INTO THE TTS TEXT FIELD ⬇**
================================================================================

```text
I remember routes before dates: a card at a gate, a voice behind a bus seat, a taxi shared with strangers, luggage falling, hands lifting a balloon basket from a field. Global route. Local encounter. The world was large; the moments that stayed were human.
```


### NARRATION 03 — WORK / THREE SCREENS

**GENERATED OUTPUT:** `A03_NARRATION.wav`

**HIGGSFIELD AUDIO SETTINGS — DO NOT COPY:** Seed Audio 1.0; use the exact same selected male voice preset and voice settings as Narration 01–07. Narration only. Prefer WAV / 48 kHz if available.

================================================================================
**⬇ COPY ONLY THE WORDS INSIDE THIS CODE BLOCK INTO THE TTS TEXT FIELD ⬇**
================================================================================

```text
Work should have been simpler than travel. Three people, one problem, three screens. A form changed, a rule moved, a deadline arrived. Nobody had to be cruel. The gap between ordinary actions was enough. I kept trying to repair the record while the work kept moving.
```


### NARRATION 04 — THE SYSTEM ENTERS

**GENERATED OUTPUT:** `A04_NARRATION.wav`

**HIGGSFIELD AUDIO SETTINGS — DO NOT COPY:** Seed Audio 1.0; use the exact same selected male voice preset and voice settings as Narration 01–07. Narration only. Prefer WAV / 48 kHz if available.

================================================================================
**⬇ COPY ONLY THE WORDS INSIDE THIS CODE BLOCK INTO THE TTS TEXT FIELD ⬇**
================================================================================

```text
Then the system entered the story without ever becoming one person. A voice at the door. A search. A question. A lawyer I could not quite reach. An officer who almost laughed. The strange part was not that people stopped being human. The process could forget that they were.
```


### NARRATION 05 — THE FILE

**GENERATED OUTPUT:** `A05_NARRATION.wav`

**HIGGSFIELD AUDIO SETTINGS — DO NOT COPY:** Seed Audio 1.0; use the exact same selected male voice preset and voice settings as Narration 01–07. Narration only. Prefer WAV / 48 kHz if available.

================================================================================
**⬇ COPY ONLY THE WORDS INSIDE THIS CODE BLOCK INTO THE TTS TEXT FIELD ⬇**
================================================================================

```text
A file can hold a photograph, a fingerprint, a signature, a list of things you own. It cannot hold why you came home, what you gave up, or what you were trying to repair. The more the record grew, the less room it seemed to leave for the life that made it.
```


### NARRATION 06 — HUMANITY BREAKS THROUGH

**GENERATED OUTPUT:** `A06_NARRATION.wav`

**HIGGSFIELD AUDIO SETTINGS — DO NOT COPY:** Seed Audio 1.0; use the exact same selected male voice preset and voice settings as Narration 01–07. Narration only. Prefer WAV / 48 kHz if available.

================================================================================
**⬇ COPY ONLY THE WORDS INSIDE THIS CODE BLOCK INTO THE TTS TEXT FIELD ⬇**
================================================================================

```text
But humanity kept leaking through. A stranger opened a gate. Someone smiled in the wrong room. People pulled together when a balloon landed where it should not. A judge, an officer, a lawyer, a dancer: for a second, each role became a person again. Then the system resumed.
```


### NARRATION 07 — THE LAST CITY / REVEAL

**GENERATED OUTPUT:** `A07_NARRATION.wav`

**HIGGSFIELD AUDIO SETTINGS — DO NOT COPY:** Seed Audio 1.0; use the exact same selected male voice preset and voice settings as Narration 01–07. Narration only. Prefer WAV / 48 kHz if available.

================================================================================
**⬇ COPY ONLY THE WORDS INSIDE THIS CODE BLOCK INTO THE TTS TEXT FIELD ⬇**
================================================================================

```text
By then the city was reading me too. London, Budapest, every memory stayed in the glass until the reflections disappeared. What remained was not an answer: a room, a body, another human face.
```


## HIGGSFIELD CINEMA STUDIO / SEEDANCE 2.5 — FINAL VIDEO COPY PACK

This is the **actual video-generation section**. Everything before this section creates or organizes reference images.

**Use Higgsfield Cinema Studio with Seedance 2.5.** For every CINEMA BLOCK below:

1. Set **16:9 landscape** in Cinema Studio.
2. Attach exactly the files listed under `ATTACH EXACTLY THESE FILES`.
3. Paste only the fenced `text` block under `PASTE THIS INTO THE CINEMA STUDIO PROMPT FIELD`.
4. Do not paste headings, filenames, operator notes or any earlier image-generation prompt into the prompt field.
5. Treat STORYBOARD as ordered time, MAIN WORLD as physical present, MEMORY WORLD as remembered content, and CHARACTER sheets as identity locks.
6. Never show a 3×3 sheet, grid lines, file names or reference-board layout inside the finished video.

The prompts below are deliberately self-contained so each Cinema block can be copied independently.

### @ REFERENCE TOKEN RULE — IMPORTANT

Cinema Studio / Seedance should receive the uploaded reference images as **@ references inside the prompt**. For each block below, the pack gives a preferred `@ALIAS` for every attached file.

- Attach the file first.
- If Cinema Studio lets you select/insert that asset with the preferred alias, use that alias.
- If Cinema Studio displays a different automatic `@token`, replace the preferred alias in the prompt with the actual token shown by the UI before generation.
- The bare filename is operator information only; the COPYABLE video prompt uses `@references`.
- Do not attach all 50 assets indiscriminately. Attach only the assets listed for that block, even if more reference slots are available.

================================================================================
# CINEMA OPERATOR INFO ABOVE / COPYABLE VIDEO PROMPTS ARE INSIDE CODE BLOCKS BELOW
================================================================================


### CINEMA BLOCK 01 — 00:00–00:30 — THE CITY JUDGES FIRST

**MODEL:** Seedance 2.5  
**TARGET VIDEO:** approximately 30 seconds, 16:9 landscape, one continuous sequence.
**GENERATED OUTPUT:** save the generated clip as `V01_CITY_JUDGES_FIRST.mp4`.


**ATTACH EXACTLY THESE FILES:**

- `W01_MAIN_WORLD.png`
- `SB01_STORYBOARD.png`
- `MW01_LONDON_SOCIAL.png`
- `C01_PROTAGONIST.png`
- `C02_SOHO_WOMAN.png`
- `C06_SHARED_HOUSE_SUBSTITUTE_SNORING_HOUSEMATE.png`
- `C07_FX_MORTGAGE_HOUSEMATE.png`
- `C08_FX_MORTGAGE_SPOUSE.png`
- `C09_FX_MORTGAGE_CHILD.png`
- `A01_NARRATION.wav`  ← clean Higgsfield Audio narration reference

**REFERENCE @ MAPPING — DO NOT COPY; USE THIS TO ASSIGN/VERIFY TOKENS:**

- `W01_MAIN_WORLD.png` → `@W01_MAIN_WORLD`
- `SB01_STORYBOARD.png` → `@SB01_STORYBOARD`
- `MW01_LONDON_SOCIAL.png` → `@MW01_LONDON_SOCIAL`
- `C01_PROTAGONIST.png` → `@C01_PROTAGONIST`
- `C02_SOHO_WOMAN.png` → `@C02_SOHO_WOMAN`
- `C06_SHARED_HOUSE_SUBSTITUTE_SNORING_HOUSEMATE.png` → `@C06_SHARED_HOUSE_SUBSTITUTE_SNORING_HOUSEMATE`
- `C07_FX_MORTGAGE_HOUSEMATE.png` → `@C07_FX_MORTGAGE_HOUSEMATE`
- `C08_FX_MORTGAGE_SPOUSE.png` → `@C08_FX_MORTGAGE_SPOUSE`
- `C09_FX_MORTGAGE_CHILD.png` → `@C09_FX_MORTGAGE_CHILD`
- `A01_NARRATION.wav` → `@A01_NARRATION`

If the UI gives a different @token, substitute that actual token in the prompt below.

================================================================================
**⬇ COPY ONLY THE CODE BLOCK BELOW INTO CINEMA STUDIO ⬇**
================================================================================

**PASTE THIS INTO THE CINEMA STUDIO PROMPT FIELD:**

```text
SEEDANCE 2.5 — CINEMA STUDIO VIDEO GENERATION

ACTIVE @REFERENCES
Use the attached assets only through the @reference tokens named below. The @token is the binding between this prompt and the uploaded reference image.

TARGET OUTPUT
- Duration: approximately 30 seconds, or the closest available Cinema Studio duration without changing the story order.
- Aspect ratio: 16:9 landscape.
- One continuous photorealistic cinematic sequence, not a montage of nine disconnected stills.
- The attached files are references only; never show their grid layouts, borders, filenames or reference-sheet design in the video.

REFERENCE ROLE ASSIGNMENT

- @W01_MAIN_WORLD = PHYSICAL PRESENT. It controls the current London–Budapest city, exact architecture, named Budapest anchors, rain, transport, real window/glass geometry, wet surfaces, lighting and surrounding street.
- @SB01_STORYBOARD = TEMPORAL PLAN. Read frames 1→9 as chronological keyframes for this one block. Never reproduce the storyboard grid in the output.
- @MW01_LONDON_SOCIAL = London / social / home / dating memory source bank. Use only the relevant remembered scene; never display the whole 3×3 sheet.
- @C01_PROTAGONIST = exact protagonist identity: face, age, body proportions, hair and continuity.
- @C02_SOHO_WOMAN = exact identity anchor for the soho woman; preserve face, age, body proportions and role.
- @C06_SHARED_HOUSE_SUBSTITUTE_SNORING_HOUSEMATE = exact identity anchor for the shared house substitute snoring housemate; preserve face, age, body proportions and role.
- @C07_FX_MORTGAGE_HOUSEMATE = exact identity anchor for the fx mortgage housemate; preserve face, age, body proportions and role.
- @C08_FX_MORTGAGE_SPOUSE = exact identity anchor for the fx mortgage spouse; preserve face, age, body proportions and role.
- @C09_FX_MORTGAGE_CHILD = exact identity anchor for the fx mortgage child; preserve face, age, body proportions and role.
- Do not invent replacement identities for any named person above.

AUDIO — SUPPLIED NARRATION REFERENCE + NATIVE SEEDANCE 2.5 SFX

@A01_NARRATION = EXACT OFF-SCREEN NARRATION REFERENCE AND TIMING BACKBONE.
Use the supplied audio reference as authoritative. Preserve the same narrator voice, spoken wording, pacing and order. Do NOT re-voice, paraphrase, duplicate, summarize or replace it.
The visible protagonist does NOT speak the narration and must NOT lip-sync to it. No other visible character speaks intelligible dialogue.

Generate the remaining soundtrack natively around @A01_NARRATION: physically plausible ambience, synchronized foley/SFX and only the restrained score specified below. Keep all generated sound beneath the narration.

AMBIENCE / FOLEY / SFX EVENT TRACK
0–5s: rainy Soho / West End city bed, wet tyre hiss, distant red-bus brakes, soft tram rail noise, footsteps on wet stone.
5–10s: Piccadilly opens wider; crowd wash, one restrained tram bell, traffic moves past without a dramatic hit.
10–15s: taxi-window memory zone; very soft restaurant cutlery/glass clink and indoor room tone heard as if behind wet glass, while current rain remains audible.
15–20s: café/lunch ambience briefly joins the city bed, muffled and memory-like, never louder than narration.
20–25s: tram movement, rail squeal kept soft, a short enclosed shared-house room tone, no intelligible speech.
25–30s: return to clean wet-city ambience, bus/tram/taxi movement and footsteps continuing forward.

MUSIC / SCORE
Use a very restrained low-level non-lyrical cinematic texture only if it helps continuity. Keep it sparse and below narration; no melody-forward score, no trailer swell, no vocal music.

MIX
Narration stays clear and centered, with ambience and effects underneath rather than competing with it. Environmental sounds must feel physically recorded in real spaces, not like a trailer sound library. Memory sounds may feel slightly filtered by distance/glass, but never use magical whooshes or dream-reverb. Maintain a compatible sonic palette with the neighboring blocks so all seven clips can cut together.
Keep the narration clearly intelligible and foregrounded. Duck ambience, foley and score beneath speech. Audio transitions follow the physical reflection/memory logic; do not use magical transition sounds.
The supplied @A01_NARRATION must remain clearly intelligible and dominant. Do not create a second narrator layer. Do not time-stretch it aggressively. Let the visual action follow the narration timing when necessary.

DO NOT GENERATE
No replacement narration. No paraphrased narration. No duplicate voice-over. No subtitles. No spoken labels. No explanatory character dialogue. No announcer. No chanting. No lyrics. No horror stingers. No giant cinematic impacts. No obvious dream-transition sound. No visible lip-sync to the narration.

MEMORY COMPOSITING

Until the final hard cut, the MAIN WORLD always remains the physical present. A memory appears only inside a real reflective or transparent surface already belonging to the MAIN WORLD: taxi glass, bus glass, tram glass, shopfront/cultural/entrance glass, wet polished stone or puddles. The MAIN WORLD keeps ownership of the pane frame, vehicle body, rain droplets and current-city reflection. The MEMORY WORLD supplies only the remembered place, people, props and action.

Never paste or reproduce a full MEMORY WORLD 3×3 sheet inside a window. Isolate only the relevant remembered scene. Keep a readable trace of rain, pane boundary or present-city reflection around/through the memory so it remains physically embedded in the real surface.

Do not introduce, hint at or reveal the hidden clinical reality in this block.

PHYSICAL PRESENT
The protagonist is on ONE uninterrupted exterior walk through the London–Budapest dream city.
Present-day city remains physically visible in every dream-city frame.
He does not physically enter the remembered house, office, police room, lawyer room, courtroom or foreign-trip location.
Literal memories appear only INSIDE real reflective / transparent surfaces: taxi windows, bus windows, tram windows, shopfront/cultural/entrance glass, wet polished stone or puddles.
A memory can occupy a pane strongly, but the window frame, rain or some present-city reflection remains readable around/through it.
Memory order is emotional, not chronological. Memory edits without asking permission.

SCORE-CARD BEHAVIOR
Cards are intentionally uncomfortable SYSTEM-world classification, not a MyScoutee product interface.
They are faint rounded translucent forms near head level, physically imperfect like reflection/lens artefact, not crisp HUD.
A tiny one/two-digit trace may exist but should usually be defocused.
Everyone can judge everyone: when one person directly looks at another, the VIEWED person's card temporarily becomes clearer, asynchronously.
Do not use flags, ethnicity stereotypes or face-based nationality coding.
Do not bake cards into mirrors as floating screens; they belong near people in the current dream city.

CARD INTENSITY FOR THIS BLOCK
Cards are barely visible, about 5–8% opacity. Most are missed. The protagonist has no readable self-card yet.

CAMERA / VISUAL STYLE
Photorealistic live-action European feature film.
Grounded rain-soaked London–Budapest realism, dynamic but controlled camera: low tracking, lateral vehicle tracking, steadicam, rack focus, occasional 180/270-degree arcs, foreground pedestrian/vehicle wipes.
No static slideshow feeling, no 2.5D, no game engine, no psychedelic dream effect, no fantasy glow, no obvious sci-fi UI.
Memories are literal events, not metaphors.
Connect the ordered beats with grounded continuous cinema movement. Use forward tracking, lateral vehicle tracking, Steadicam, rack focus, foreground pedestrian/vehicle wipes and controlled arcs when appropriate. Do not stage nine static recreations or a slideshow.

ORDERED TEMPORAL BEATS — FOLLOW 1→9
FRAME 1 — Opening low forward tracking in wet hybrid Soho. The protagonist walks naturally through a real crowd. St Stephen's Basilica terminates a London street axis; KÖNYV/KÁVÉ signage and a yellow tram already exist inside Soho. Nobody reacts. Cards are almost invisible.

FRAME 2 — Wider Piccadilly Circus continuity with Eros clearly present. A red bus, yellow tram and black taxi move normally through the junction. Two pedestrians glance at each other; the viewed person's faint card sharpens for only a moment, then softens.

FRAME 3 — Lateral move beside a black taxi. In its rain-covered side window, a literal Soho restaurant/sushi memory appears: the wrong-lavatory moment and the SOHO WOMAN briefly visible with a small human smile. Keep current Piccadilly/Soho reflection layered on the glass.

FRAME 4 — Large shopfront glass. Literal Soho lunch memory: the protagonist sits with colleagues while they eat; he quietly pretends he is not hungry. No melodrama. Present rain and London–Budapest reflection remain visible.

FRAME 5 — Yellow tram side windows. Literal shared-London-house memory: a cramped room containing many Hungarian adult housemates, compressed domestic space, shoes and belongings. Present tram frame and city reflection remain clear.

FRAME 6 — Adjacent tram/bus pane. Literal foreign-currency-mortgage housemate memory: one Hungarian man living abroad while spouse/child/home obligations remain in Hungary. Show a small ordinary domestic/family fragment, not explanatory text.

FRAME 7 — Cinema/theatre glass in Leicester. Literal dating memory: same photograph, phone/profile age field changes visually from 37 to 33; the human face does not change. Keep the phone/profile small inside the reflected memory and avoid UI spectacle.

FRAME 8 — Camera arcs around the protagonist through the Leicester crowd. Several people look at one another; viewed cards sharpen and blur asynchronously. Nobody is the sole observer. The Kossuth-style monument and Hungarian cultural block remain in the current city.

FRAME 9 — Wide Haymarket/Trafalgar-edge continuation. Red bus, yellow tram, black taxi, Eros/West-End depth and multiple wet panes coexist. The memories dim back into normal city reflections. The protagonist keeps walking.

OUTPUT RULE
Create one continuous photorealistic cinematic sequence for this block. The attached reference images are control assets, not objects that appear in the film. Preserve protagonist identity and location continuity. No fantasy glow, no psychedelic dream treatment, no game-engine look, no explanatory subtitles, no visible file names and no reference-grid borders.
```


### CINEMA BLOCK 02 — 00:30–01:00 — GLOBAL ROUTE / LOCAL ENCOUNTER

**MODEL:** Seedance 2.5  
**TARGET VIDEO:** approximately 30 seconds, 16:9 landscape, one continuous sequence.
**GENERATED OUTPUT:** save the generated clip as `V02_GLOBAL_ROUTE.mp4`.


**ATTACH EXACTLY THESE FILES:**

- `W02_MAIN_WORLD.png`
- `SB02_STORYBOARD.png`
- `MW02_GLOBAL_ROUTES.png`
- `MW01_LONDON_SOCIAL.png`
- `C01_PROTAGONIST.png`
- `C10_BEGINNER_DANCE_WOMAN.png`
- `C11_RUSSIAN_TRANSIT_PASSENGER.png`
- `C12_AGRA_BUS_WOMAN.png`
- `C13_SUDANESE_TRAVELER_MAN.png`
- `C14_SUDANESE_TRAVELER_WOMAN.png`
- `C15_CAIRO_TAXI_DRIVER.png`
- `C16_BALLOON_LOCAL_HELPER_MAN.png`
- `C17_BALLOON_LOCAL_HELPER_WOMAN.png`
- `C18_BARMOUTH_ROAD_TRIP_DRIVER_COMPANION.png`
- `C19_BARMOUTH_ROAD_TRIP_COMPANION_A.png`
- `C20_BARMOUTH_ROAD_TRIP_COMPANION_B.png`
- `C21_BARMOUTH_ROAD_TRIP_COMPANION_C.png`
- `A02_NARRATION.wav`  ← clean Higgsfield Audio narration reference

**REFERENCE @ MAPPING — DO NOT COPY; USE THIS TO ASSIGN/VERIFY TOKENS:**

- `W02_MAIN_WORLD.png` → `@W02_MAIN_WORLD`
- `SB02_STORYBOARD.png` → `@SB02_STORYBOARD`
- `MW02_GLOBAL_ROUTES.png` → `@MW02_GLOBAL_ROUTES`
- `MW01_LONDON_SOCIAL.png` → `@MW01_LONDON_SOCIAL`
- `C01_PROTAGONIST.png` → `@C01_PROTAGONIST`
- `C10_BEGINNER_DANCE_WOMAN.png` → `@C10_BEGINNER_DANCE_WOMAN`
- `C11_RUSSIAN_TRANSIT_PASSENGER.png` → `@C11_RUSSIAN_TRANSIT_PASSENGER`
- `C12_AGRA_BUS_WOMAN.png` → `@C12_AGRA_BUS_WOMAN`
- `C13_SUDANESE_TRAVELER_MAN.png` → `@C13_SUDANESE_TRAVELER_MAN`
- `C14_SUDANESE_TRAVELER_WOMAN.png` → `@C14_SUDANESE_TRAVELER_WOMAN`
- `C15_CAIRO_TAXI_DRIVER.png` → `@C15_CAIRO_TAXI_DRIVER`
- `C16_BALLOON_LOCAL_HELPER_MAN.png` → `@C16_BALLOON_LOCAL_HELPER_MAN`
- `C17_BALLOON_LOCAL_HELPER_WOMAN.png` → `@C17_BALLOON_LOCAL_HELPER_WOMAN`
- `C18_BARMOUTH_ROAD_TRIP_DRIVER_COMPANION.png` → `@C18_BARMOUTH_ROAD_TRIP_DRIVER_COMPANION`
- `C19_BARMOUTH_ROAD_TRIP_COMPANION_A.png` → `@C19_BARMOUTH_ROAD_TRIP_COMPANION_A`
- `C20_BARMOUTH_ROAD_TRIP_COMPANION_B.png` → `@C20_BARMOUTH_ROAD_TRIP_COMPANION_B`
- `C21_BARMOUTH_ROAD_TRIP_COMPANION_C.png` → `@C21_BARMOUTH_ROAD_TRIP_COMPANION_C`
- `A02_NARRATION.wav` → `@A02_NARRATION`

If the UI gives a different @token, substitute that actual token in the prompt below.

================================================================================
**⬇ COPY ONLY THE CODE BLOCK BELOW INTO CINEMA STUDIO ⬇**
================================================================================

**PASTE THIS INTO THE CINEMA STUDIO PROMPT FIELD:**

```text
SEEDANCE 2.5 — CINEMA STUDIO VIDEO GENERATION

ACTIVE @REFERENCES
Use the attached assets only through the @reference tokens named below. The @token is the binding between this prompt and the uploaded reference image.

TARGET OUTPUT
- Duration: approximately 30 seconds, or the closest available Cinema Studio duration without changing the story order.
- Aspect ratio: 16:9 landscape.
- One continuous photorealistic cinematic sequence, not a montage of nine disconnected stills.
- The attached files are references only; never show their grid layouts, borders, filenames or reference-sheet design in the video.

REFERENCE ROLE ASSIGNMENT

- @W02_MAIN_WORLD = PHYSICAL PRESENT. It controls the current London–Budapest city, exact architecture, named Budapest anchors, rain, transport, real window/glass geometry, wet surfaces, lighting and surrounding street.
- @SB02_STORYBOARD = TEMPORAL PLAN. Read frames 1→9 as chronological keyframes for this one block. Never reproduce the storyboard grid in the output.
- @MW02_GLOBAL_ROUTES = global route / Russia / India / Cairo / balloon / travel memory source bank. Use only the relevant remembered scene; never display the whole 3×3 sheet.
- @MW01_LONDON_SOCIAL = London / social / home / dating memory source bank. Use only the relevant remembered scene; never display the whole 3×3 sheet.
- @C01_PROTAGONIST = exact protagonist identity: face, age, body proportions, hair and continuity.
- @C10_BEGINNER_DANCE_WOMAN = exact identity anchor for the beginner dance woman; preserve face, age, body proportions and role.
- @C11_RUSSIAN_TRANSIT_PASSENGER = exact identity anchor for the russian transit passenger; preserve face, age, body proportions and role.
- @C12_AGRA_BUS_WOMAN = exact identity anchor for the agra bus woman; preserve face, age, body proportions and role.
- @C13_SUDANESE_TRAVELER_MAN = exact identity anchor for the sudanese traveler man; preserve face, age, body proportions and role.
- @C14_SUDANESE_TRAVELER_WOMAN = exact identity anchor for the sudanese traveler woman; preserve face, age, body proportions and role.
- @C15_CAIRO_TAXI_DRIVER = exact identity anchor for the cairo taxi driver; preserve face, age, body proportions and role.
- @C16_BALLOON_LOCAL_HELPER_MAN = exact identity anchor for the balloon local helper man; preserve face, age, body proportions and role.
- @C17_BALLOON_LOCAL_HELPER_WOMAN = exact identity anchor for the balloon local helper woman; preserve face, age, body proportions and role.
- @C18_BARMOUTH_ROAD_TRIP_DRIVER_COMPANION = exact identity anchor for the barmouth road trip driver companion; preserve face, age, body proportions and role.
- @C19_BARMOUTH_ROAD_TRIP_COMPANION_A = exact identity anchor for the barmouth road trip companion a; preserve face, age, body proportions and role.
- @C20_BARMOUTH_ROAD_TRIP_COMPANION_B = exact identity anchor for the barmouth road trip companion b; preserve face, age, body proportions and role.
- @C21_BARMOUTH_ROAD_TRIP_COMPANION_C = exact identity anchor for the barmouth road trip companion c; preserve face, age, body proportions and role.
- Do not invent replacement identities for any named person above.

AUDIO — SUPPLIED NARRATION REFERENCE + NATIVE SEEDANCE 2.5 SFX

@A02_NARRATION = EXACT OFF-SCREEN NARRATION REFERENCE AND TIMING BACKBONE.
Use the supplied audio reference as authoritative. Preserve the same narrator voice, spoken wording, pacing and order. Do NOT re-voice, paraphrase, duplicate, summarize or replace it.
The visible protagonist does NOT speak the narration and must NOT lip-sync to it. No other visible character speaks intelligible dialogue.

Generate the remaining soundtrack natively around @A02_NARRATION: physically plausible ambience, synchronized foley/SFX and only the restrained score specified below. Keep all generated sound beneath the narration.

AMBIENCE / FOLEY / SFX EVENT TRACK
0–5s: continue the same rainy London–Budapest city bed; station exterior rumble and footsteps.
5–9s: one realistic transit-gate confirmation beep and gate mechanism, brief indoor station resonance under the outdoor city layer.
9–13s: bus/coach interior rumble and seat/fabric movement, no intelligible passenger dialogue.
13–18s: Cairo taxi engine, road texture and restrained distant horn; human presence without spoken lines.
18–21s: one luggage impact / slide, practical and not comedic.
21–25s: balloon fabric, rope tension, soil/vegetation movement and several people exerting effort; no shouted words.
25–30s: open coastal wind and soft waves from the Barmouth memory dissolve back into rain and city movement.

MUSIC / SCORE
Use a very restrained low-level non-lyrical cinematic texture only if it helps continuity. Keep it sparse and below narration; no melody-forward score, no trailer swell, no vocal music.

MIX
Narration stays clear and centered, with ambience and effects underneath rather than competing with it. Environmental sounds must feel physically recorded in real spaces, not like a trailer sound library. Memory sounds may feel slightly filtered by distance/glass, but never use magical whooshes or dream-reverb. Maintain a compatible sonic palette with the neighboring blocks so all seven clips can cut together.
Keep the narration clearly intelligible and foregrounded. Duck ambience, foley and score beneath speech. Audio transitions follow the physical reflection/memory logic; do not use magical transition sounds.
The supplied @A02_NARRATION must remain clearly intelligible and dominant. Do not create a second narrator layer. Do not time-stretch it aggressively. Let the visual action follow the narration timing when necessary.

DO NOT GENERATE
No replacement narration. No paraphrased narration. No duplicate voice-over. No subtitles. No spoken labels. No explanatory character dialogue. No announcer. No chanting. No lyrics. No horror stingers. No giant cinematic impacts. No obvious dream-transition sound. No visible lip-sync to the narration.

MEMORY COMPOSITING

Until the final hard cut, the MAIN WORLD always remains the physical present. A memory appears only inside a real reflective or transparent surface already belonging to the MAIN WORLD: taxi glass, bus glass, tram glass, shopfront/cultural/entrance glass, wet polished stone or puddles. The MAIN WORLD keeps ownership of the pane frame, vehicle body, rain droplets and current-city reflection. The MEMORY WORLD supplies only the remembered place, people, props and action.

Never paste or reproduce a full MEMORY WORLD 3×3 sheet inside a window. Isolate only the relevant remembered scene. Keep a readable trace of rain, pane boundary or present-city reflection around/through the memory so it remains physically embedded in the real surface.

Do not introduce, hint at or reveal the hidden clinical reality in this block.

PHYSICAL PRESENT
The protagonist is on ONE uninterrupted exterior walk through the London–Budapest dream city.
Present-day city remains physically visible in every dream-city frame.
He does not physically enter the remembered house, office, police room, lawyer room, courtroom or foreign-trip location.
Literal memories appear only INSIDE real reflective / transparent surfaces: taxi windows, bus windows, tram windows, shopfront/cultural/entrance glass, wet polished stone or puddles.
A memory can occupy a pane strongly, but the window frame, rain or some present-city reflection remains readable around/through it.
Memory order is emotional, not chronological. Memory edits without asking permission.

SCORE-CARD BEHAVIOR
Cards are intentionally uncomfortable SYSTEM-world classification, not a MyScoutee product interface.
They are faint rounded translucent forms near head level, physically imperfect like reflection/lens artefact, not crisp HUD.
A tiny one/two-digit trace may exist but should usually be defocused.
Everyone can judge everyone: when one person directly looks at another, the VIEWED person's card temporarily becomes clearer, asynchronously.
Do not use flags, ethnicity stereotypes or face-based nationality coding.
Do not bake cards into mirrors as floating screens; they belong near people in the current dream city.

CARD INTENSITY FOR THIS BLOCK
Cards remain faint and mostly peripheral, roughly 5–8%, occasionally reaching 10% during direct gaze.

CAMERA / VISUAL STYLE
Photorealistic live-action European feature film.
Grounded rain-soaked London–Budapest realism, dynamic but controlled camera: low tracking, lateral vehicle tracking, steadicam, rack focus, occasional 180/270-degree arcs, foreground pedestrian/vehicle wipes.
No static slideshow feeling, no 2.5D, no game engine, no psychedelic dream effect, no fantasy glow, no obvious sci-fi UI.
Memories are literal events, not metaphors.
Connect the ordered beats with grounded continuous cinema movement. Use forward tracking, lateral vehicle tracking, Steadicam, rack focus, foreground pedestrian/vehicle wipes and controlled arcs when appropriate. Do not stage nine static recreations or a slideshow.

ORDERED TEMPORAL BEATS — FOLLOW 1→9
FRAME 1 — Continue through Charing Cross / Strand with the Nyugati-hybrid station frontage and Hungarian State Opera block visible in the present. The protagonist walks; the city remains normal.

FRAME 2 — London Underground entrance glass viewed from outside. Literal Moscow/St Petersburg memory: a local passenger uses their monthly travel card/pass to let the protagonist through a gate. Keep the present METRÓ/London entrance reflection around the memory; the current walker never descends.

FRAME 3 — Full red-bus side window. Literal India / Agra memory: the protagonist sits on a bus; a woman speaks from behind or across the seat, creating a human voice/contact moment. Avoid tourist-postcard monuments and exoticizing imagery.

FRAME 4 — Black taxi window. Literal Cairo memory: protagonist sharing a taxi with a Sudanese couple, ordinary temporary trust between strangers. Current Strand reflection and rain remain layered on the taxi glass.

FRAME 5 — Another moving pane continues Cairo: luggage unexpectedly falls from the taxi roof near an airport/exit context. Capture surprise and practical reaction, not slapstick.

FRAME 6 — Large passage/cultural glass. Literal hot-air-balloon memory: balloon lands in a vegetable plot near a wall; local people and passengers cooperate hand-to-hand to solve the situation. Warm human cooperation, no fantasy.

FRAME 7 — Restaurant/shop glass. Literal beginner dance-floor memory: awkward but real social participation, ordinary people, no glamour. A direct gaze between two present pedestrians briefly sharpens one card over the current glass reflection.

FRAME 8 — Wet bus shelter / glass canopy. Very fast route montage inside separate panes: rail track → Budapest tram wire → London transport line → wet bus window, visually echoing the notebook principle. Do not make it abstract animation; each is a literal remembered transport fragment.

FRAME 9 — Wide Aldwych / Embankment-side exterior. Opera/Nyugati/M4/Hungarian signage remain unmistakable in the present city. Memory panes return to normal reflections as the protagonist continues the exterior walk.

OUTPUT RULE
Create one continuous photorealistic cinematic sequence for this block. The attached reference images are control assets, not objects that appear in the film. Preserve protagonist identity and location continuity. No fantasy glow, no psychedelic dream treatment, no game-engine look, no explanatory subtitles, no visible file names and no reference-grid borders.
```


### CINEMA BLOCK 03 — 01:00–01:30 — WORK / KATA / THE SYSTEM ENTERS

**MODEL:** Seedance 2.5  
**TARGET VIDEO:** approximately 30 seconds, 16:9 landscape, one continuous sequence.
**GENERATED OUTPUT:** save the generated clip as `V03_WORK_SYSTEM.mp4`.


**ATTACH EXACTLY THESE FILES:**

- `W03_MAIN_WORLD.png`
- `SB03_STORYBOARD.png`
- `MW03_WORK_KATA_ADMIN.png`
- `C01_PROTAGONIST.png`
- `C22_ACCOUNTANT.png`
- `C23_ADMIN_COLLEAGUE_A.png`
- `C24_ADMIN_COLLEAGUE_B.png`
- `A03_NARRATION.wav`  ← clean Higgsfield Audio narration reference

**REFERENCE @ MAPPING — DO NOT COPY; USE THIS TO ASSIGN/VERIFY TOKENS:**

- `W03_MAIN_WORLD.png` → `@W03_MAIN_WORLD`
- `SB03_STORYBOARD.png` → `@SB03_STORYBOARD`
- `MW03_WORK_KATA_ADMIN.png` → `@MW03_WORK_KATA_ADMIN`
- `C01_PROTAGONIST.png` → `@C01_PROTAGONIST`
- `C22_ACCOUNTANT.png` → `@C22_ACCOUNTANT`
- `C23_ADMIN_COLLEAGUE_A.png` → `@C23_ADMIN_COLLEAGUE_A`
- `C24_ADMIN_COLLEAGUE_B.png` → `@C24_ADMIN_COLLEAGUE_B`
- `A03_NARRATION.wav` → `@A03_NARRATION`

If the UI gives a different @token, substitute that actual token in the prompt below.

================================================================================
**⬇ COPY ONLY THE CODE BLOCK BELOW INTO CINEMA STUDIO ⬇**
================================================================================

**PASTE THIS INTO THE CINEMA STUDIO PROMPT FIELD:**

```text
SEEDANCE 2.5 — CINEMA STUDIO VIDEO GENERATION

ACTIVE @REFERENCES
Use the attached assets only through the @reference tokens named below. The @token is the binding between this prompt and the uploaded reference image.

TARGET OUTPUT
- Duration: approximately 30 seconds, or the closest available Cinema Studio duration without changing the story order.
- Aspect ratio: 16:9 landscape.
- One continuous photorealistic cinematic sequence, not a montage of nine disconnected stills.
- The attached files are references only; never show their grid layouts, borders, filenames or reference-sheet design in the video.

REFERENCE ROLE ASSIGNMENT

- @W03_MAIN_WORLD = PHYSICAL PRESENT. It controls the current London–Budapest city, exact architecture, named Budapest anchors, rain, transport, real window/glass geometry, wet surfaces, lighting and surrounding street.
- @SB03_STORYBOARD = TEMPORAL PLAN. Read frames 1→9 as chronological keyframes for this one block. Never reproduce the storyboard grid in the output.
- @MW03_WORK_KATA_ADMIN = work / accounting / KATA / administrative-system memory source bank. Use only the relevant remembered scene; never display the whole 3×3 sheet.
- @C01_PROTAGONIST = exact protagonist identity: face, age, body proportions, hair and continuity.
- @C22_ACCOUNTANT = exact identity anchor for the accountant; preserve face, age, body proportions and role.
- @C23_ADMIN_COLLEAGUE_A = exact identity anchor for the admin colleague a; preserve face, age, body proportions and role.
- @C24_ADMIN_COLLEAGUE_B = exact identity anchor for the admin colleague b; preserve face, age, body proportions and role.
- Do not invent replacement identities for any named person above.

AUDIO — SUPPLIED NARRATION REFERENCE + NATIVE SEEDANCE 2.5 SFX

@A03_NARRATION = EXACT OFF-SCREEN NARRATION REFERENCE AND TIMING BACKBONE.
Use the supplied audio reference as authoritative. Preserve the same narrator voice, spoken wording, pacing and order. Do NOT re-voice, paraphrase, duplicate, summarize or replace it.
The visible protagonist does NOT speak the narration and must NOT lip-sync to it. No other visible character speaks intelligible dialogue.

Generate the remaining soundtrack natively around @A03_NARRATION: physically plausible ambience, synchronized foley/SFX and only the restrained score specified below. Keep all generated sound beneath the narration.

AMBIENCE / FOLEY / SFX EVENT TRACK
0–5s: wet professional-city ambience, rain on glass, distant tram and traffic.
5–10s: keyboard taps and ordinary office ventilation appear softly behind the city, as if memories are inside windows.
10–15s: printer feed, paper handling, one subdued phone vibration / notification tone.
15–20s: three slightly separated workstations implied by alternating keyboard/paper sounds; never turn this into a sci-fi computer soundscape.
20–25s: phone call connection tone, page turn, restrained desk movement; no intelligible second speaker.
25–30s: corrected form/paper movement and one quiet confirmation tone, while the rain/city bed continues underneath.

MUSIC / SCORE
Use a very restrained low-level non-lyrical cinematic texture only if it helps continuity. Keep it sparse and below narration; no melody-forward score, no trailer swell, no vocal music.

MIX
Narration stays clear and centered, with ambience and effects underneath rather than competing with it. Environmental sounds must feel physically recorded in real spaces, not like a trailer sound library. Memory sounds may feel slightly filtered by distance/glass, but never use magical whooshes or dream-reverb. Maintain a compatible sonic palette with the neighboring blocks so all seven clips can cut together.
Keep the narration clearly intelligible and foregrounded. Duck ambience, foley and score beneath speech. Audio transitions follow the physical reflection/memory logic; do not use magical transition sounds.
The supplied @A03_NARRATION must remain clearly intelligible and dominant. Do not create a second narrator layer. Do not time-stretch it aggressively. Let the visual action follow the narration timing when necessary.

DO NOT GENERATE
No replacement narration. No paraphrased narration. No duplicate voice-over. No subtitles. No spoken labels. No explanatory character dialogue. No announcer. No chanting. No lyrics. No horror stingers. No giant cinematic impacts. No obvious dream-transition sound. No visible lip-sync to the narration.

MEMORY COMPOSITING

Until the final hard cut, the MAIN WORLD always remains the physical present. A memory appears only inside a real reflective or transparent surface already belonging to the MAIN WORLD: taxi glass, bus glass, tram glass, shopfront/cultural/entrance glass, wet polished stone or puddles. The MAIN WORLD keeps ownership of the pane frame, vehicle body, rain droplets and current-city reflection. The MEMORY WORLD supplies only the remembered place, people, props and action.

Never paste or reproduce a full MEMORY WORLD 3×3 sheet inside a window. Isolate only the relevant remembered scene. Keep a readable trace of rain, pane boundary or present-city reflection around/through the memory so it remains physically embedded in the real surface.

Do not introduce, hint at or reveal the hidden clinical reality in this block.

PHYSICAL PRESENT
The protagonist is on ONE uninterrupted exterior walk through the London–Budapest dream city.
Present-day city remains physically visible in every dream-city frame.
He does not physically enter the remembered house, office, police room, lawyer room, courtroom or foreign-trip location.
Literal memories appear only INSIDE real reflective / transparent surfaces: taxi windows, bus windows, tram windows, shopfront/cultural/entrance glass, wet polished stone or puddles.
A memory can occupy a pane strongly, but the window frame, rain or some present-city reflection remains readable around/through it.
Memory order is emotional, not chronological. Memory edits without asking permission.

SCORE-CARD BEHAVIOR
Cards are intentionally uncomfortable SYSTEM-world classification, not a MyScoutee product interface.
They are faint rounded translucent forms near head level, physically imperfect like reflection/lens artefact, not crisp HUD.
A tiny one/two-digit trace may exist but should usually be defocused.
Everyone can judge everyone: when one person directly looks at another, the VIEWED person's card temporarily becomes clearer, asynchronously.
Do not use flags, ethnicity stereotypes or face-based nationality coding.
Do not bake cards into mirrors as floating screens; they belong near people in the current dream city.

CARD INTENSITY FOR THIS BLOCK
Cards become somewhat clearer around people seen through professional glass, roughly 8–12%, but still not explicit UI. Direct gaze remains the trigger.

CAMERA / VISUAL STYLE
Photorealistic live-action European feature film.
Grounded rain-soaked London–Budapest realism, dynamic but controlled camera: low tracking, lateral vehicle tracking, steadicam, rack focus, occasional 180/270-degree arcs, foreground pedestrian/vehicle wipes.
No static slideshow feeling, no 2.5D, no game engine, no psychedelic dream effect, no fantasy glow, no obvious sci-fi UI.
Memories are literal events, not metaphors.
Connect the ordered beats with grounded continuous cinema movement. Use forward tracking, lateral vehicle tracking, Steadicam, rack focus, foreground pedestrian/vehicle wipes and controlled arcs when appropriate. Do not stage nine static recreations or a slideshow.

ORDERED TEMPORAL BEATS — FOLLOW 1→9
FRAME 1 — Continue through the work-city exterior: New York Palace / Academy / Lechner-derived Budapest blocks inside London geometry. The protagonist walks beside large office glass; IRODA/KÖNYVELÉS signs exist as normal city signage.

FRAME 2 — Large office-façade pane. Literal cross-border remote-work memory: protagonist on an international work call/computer task, ordinary long-day professional environment, not a heroic tech montage. Present rain and city reflection remain visible.

FRAME 3 — Accounting-frontage glass. Literal memory of 13–15-hour workdays, invoice/forms/calendar/printer, the need to delegate accounting while a live foreign contract continues. Show ordinary pressure, not villainy.

FRAME 4 — Three adjacent panes / one large divided façade. Literal 'three people / no shared screen' memory: three people dealing with the same administrative problem, each looking at a different document/screen version. They are physically near but informationally separated. No one is evil.

FRAME 5 — Wet civic glass. Literal KATA-change memory: calendar/date, ordinary government-style notification/letter and a return/form needing correction. Keep text mostly unreadable; show process through objects and reactions.

FRAME 6 — Taxi or tram window. Literal delegation/password/accounting memory: accountant, portal/login responsibility and correction chain implied by hands, screen and paperwork, without turning it into cybersecurity graphics.

FRAME 7 — Café/office pane. The protagonist in memory tries to repair the situation by phone while another person checks a different record. Present pedestrians cross the glass; their viewed cards sharpen briefly when they look at one another.

FRAME 8 — Dark office entrance glass. Multiple remembered voices are suggested visually by mouths/phones/people in different panes, but do not render subtitles. The current protagonist pauses, hearing the system's different versions.

FRAME 9 — Wide Holborn/Fleet-edge continuation. The current city is still exterior, wet and crowded. The protagonist keeps walking; cards are slightly clearer around professional crowds than in Soho, but the phenomenon remains unexplained.

OUTPUT RULE
Create one continuous photorealistic cinematic sequence for this block. The attached reference images are control assets, not objects that appear in the film. Preserve protagonist identity and location continuity. No fantasy glow, no psychedelic dream treatment, no game-engine look, no explanatory subtitles, no visible file names and no reference-grid borders.
```


### CINEMA BLOCK 04 — 01:30–02:00 — POLICE / LAWYERS / PROCEDURE

**MODEL:** Seedance 2.5  
**TARGET VIDEO:** approximately 30 seconds, 16:9 landscape, one continuous sequence.
**GENERATED OUTPUT:** save the generated clip as `V04_POLICE_DEFENCE.mp4`.


**ATTACH EXACTLY THESE FILES:**

- `W04_MAIN_WORLD.png`
- `SB04_STORYBOARD.png`
- `MW04_POLICE_DEFENCE.png`
- `C01_PROTAGONIST.png`
- `C03_POLICEWOMAN.png`
- `C04_APPOINTED_LAWYER.png`
- `C25_SEARCH_OFFICER_MALE.png`
- `C26_DEFENCE_OFFICE_SUBSTITUTE.png`
- `A04_NARRATION.wav`  ← clean Higgsfield Audio narration reference

**REFERENCE @ MAPPING — DO NOT COPY; USE THIS TO ASSIGN/VERIFY TOKENS:**

- `W04_MAIN_WORLD.png` → `@W04_MAIN_WORLD`
- `SB04_STORYBOARD.png` → `@SB04_STORYBOARD`
- `MW04_POLICE_DEFENCE.png` → `@MW04_POLICE_DEFENCE`
- `C01_PROTAGONIST.png` → `@C01_PROTAGONIST`
- `C03_POLICEWOMAN.png` → `@C03_POLICEWOMAN`
- `C04_APPOINTED_LAWYER.png` → `@C04_APPOINTED_LAWYER`
- `C25_SEARCH_OFFICER_MALE.png` → `@C25_SEARCH_OFFICER_MALE`
- `C26_DEFENCE_OFFICE_SUBSTITUTE.png` → `@C26_DEFENCE_OFFICE_SUBSTITUTE`
- `A04_NARRATION.wav` → `@A04_NARRATION`

If the UI gives a different @token, substitute that actual token in the prompt below.

================================================================================
**⬇ COPY ONLY THE CODE BLOCK BELOW INTO CINEMA STUDIO ⬇**
================================================================================

**PASTE THIS INTO THE CINEMA STUDIO PROMPT FIELD:**

```text
SEEDANCE 2.5 — CINEMA STUDIO VIDEO GENERATION

ACTIVE @REFERENCES
Use the attached assets only through the @reference tokens named below. The @token is the binding between this prompt and the uploaded reference image.

TARGET OUTPUT
- Duration: approximately 30 seconds, or the closest available Cinema Studio duration without changing the story order.
- Aspect ratio: 16:9 landscape.
- One continuous photorealistic cinematic sequence, not a montage of nine disconnected stills.
- The attached files are references only; never show their grid layouts, borders, filenames or reference-sheet design in the video.

REFERENCE ROLE ASSIGNMENT

- @W04_MAIN_WORLD = PHYSICAL PRESENT. It controls the current London–Budapest city, exact architecture, named Budapest anchors, rain, transport, real window/glass geometry, wet surfaces, lighting and surrounding street.
- @SB04_STORYBOARD = TEMPORAL PLAN. Read frames 1→9 as chronological keyframes for this one block. Never reproduce the storyboard grid in the output.
- @MW04_POLICE_DEFENCE = police / apartment-search / fingerprint / defence memory source bank. Use only the relevant remembered scene; never display the whole 3×3 sheet.
- @C01_PROTAGONIST = exact protagonist identity: face, age, body proportions, hair and continuity.
- @C03_POLICEWOMAN = exact identity anchor for the policewoman; preserve face, age, body proportions and role.
- @C04_APPOINTED_LAWYER = exact identity anchor for the appointed lawyer; preserve face, age, body proportions and role.
- @C25_SEARCH_OFFICER_MALE = exact identity anchor for the search officer male; preserve face, age, body proportions and role.
- @C26_DEFENCE_OFFICE_SUBSTITUTE = exact identity anchor for the defence office substitute; preserve face, age, body proportions and role.
- Do not invent replacement identities for any named person above.

AUDIO — SUPPLIED NARRATION REFERENCE + NATIVE SEEDANCE 2.5 SFX

@A04_NARRATION = EXACT OFF-SCREEN NARRATION REFERENCE AND TIMING BACKBONE.
Use the supplied audio reference as authoritative. Preserve the same narrator voice, spoken wording, pacing and order. Do NOT re-voice, paraphrase, duplicate, summarize or replace it.
The visible protagonist does NOT speak the narration and must NOT lip-sync to it. No other visible character speaks intelligible dialogue.

Generate the remaining soundtrack natively around @A04_NARRATION: physically plausible ambience, synchronized foley/SFX and only the restrained score specified below. Keep all generated sound beneath the narration.

AMBIENCE / FOLEY / SFX EVENT TRACK
0–5s: formal rainy city street, close footsteps, distant traffic; tension remains grounded.
5–9s: ordinary residential buzzer / door mechanism and approaching footsteps, no spoken 'postman' line in the audio.
9–14s: apartment room tone, drawers/objects handled carefully, paper and fabric movement; no raid spectacle, no sirens.
14–17s: one sudden shoe contact / misstep followed by a restrained involuntary breath of pain, no gore and no dramatic impact effect.
17–22s: fingerprint/processing room tone, small scanner/desk sounds, paper handling.
22–26s: telephone connection / corridor ambience suggesting defence handoff, no intelligible dialogue.
26–30s: one tiny suppressed human chuckle or breath-smile, then return to rain and forward footsteps. No comedy sting.

MUSIC / SCORE
Use a very restrained low-level non-lyrical cinematic texture only if it helps continuity. Keep it sparse and below narration; no melody-forward score, no trailer swell, no vocal music.

MIX
Narration stays clear and centered, with ambience and effects underneath rather than competing with it. Environmental sounds must feel physically recorded in real spaces, not like a trailer sound library. Memory sounds may feel slightly filtered by distance/glass, but never use magical whooshes or dream-reverb. Maintain a compatible sonic palette with the neighboring blocks so all seven clips can cut together.
Keep the narration clearly intelligible and foregrounded. Duck ambience, foley and score beneath speech. Audio transitions follow the physical reflection/memory logic; do not use magical transition sounds.
The supplied @A04_NARRATION must remain clearly intelligible and dominant. Do not create a second narrator layer. Do not time-stretch it aggressively. Let the visual action follow the narration timing when necessary.

DO NOT GENERATE
No replacement narration. No paraphrased narration. No duplicate voice-over. No subtitles. No spoken labels. No explanatory character dialogue. No announcer. No chanting. No lyrics. No horror stingers. No giant cinematic impacts. No obvious dream-transition sound. No visible lip-sync to the narration.

MEMORY COMPOSITING

Until the final hard cut, the MAIN WORLD always remains the physical present. A memory appears only inside a real reflective or transparent surface already belonging to the MAIN WORLD: taxi glass, bus glass, tram glass, shopfront/cultural/entrance glass, wet polished stone or puddles. The MAIN WORLD keeps ownership of the pane frame, vehicle body, rain droplets and current-city reflection. The MEMORY WORLD supplies only the remembered place, people, props and action.

Never paste or reproduce a full MEMORY WORLD 3×3 sheet inside a window. Isolate only the relevant remembered scene. Keep a readable trace of rain, pane boundary or present-city reflection around/through the memory so it remains physically embedded in the real surface.

Do not introduce, hint at or reveal the hidden clinical reality in this block.

PHYSICAL PRESENT
The protagonist is on ONE uninterrupted exterior walk through the London–Budapest dream city.
Present-day city remains physically visible in every dream-city frame.
He does not physically enter the remembered house, office, police room, lawyer room, courtroom or foreign-trip location.
Literal memories appear only INSIDE real reflective / transparent surfaces: taxi windows, bus windows, tram windows, shopfront/cultural/entrance glass, wet polished stone or puddles.
A memory can occupy a pane strongly, but the window frame, rain or some present-city reflection remains readable around/through it.
Memory order is emotional, not chronological. Memory edits without asking permission.

SCORE-CARD BEHAVIOR
Cards are intentionally uncomfortable SYSTEM-world classification, not a MyScoutee product interface.
They are faint rounded translucent forms near head level, physically imperfect like reflection/lens artefact, not crisp HUD.
A tiny one/two-digit trace may exist but should usually be defocused.
Everyone can judge everyone: when one person directly looks at another, the VIEWED person's card temporarily becomes clearer, asynchronously.
Do not use flags, ethnicity stereotypes or face-based nationality coding.
Do not bake cards into mirrors as floating screens; they belong near people in the current dream city.

CARD INTENSITY FOR THIS BLOCK
Cards rise to roughly 10–15% in the current formal-city crowd. They still sharpen only through gaze and remain physically imperfect.

CAMERA / VISUAL STYLE
Photorealistic live-action European feature film.
Grounded rain-soaked London–Budapest realism, dynamic but controlled camera: low tracking, lateral vehicle tracking, steadicam, rack focus, occasional 180/270-degree arcs, foreground pedestrian/vehicle wipes.
No static slideshow feeling, no 2.5D, no game engine, no psychedelic dream effect, no fantasy glow, no obvious sci-fi UI.
Memories are literal events, not metaphors.
Connect the ordered beats with grounded continuous cinema movement. Use forward tracking, lateral vehicle tracking, Steadicam, rack focus, foreground pedestrian/vehicle wipes and controlled arcs when appropriate. Do not stage nine static recreations or a slideshow.

ORDERED TEMPORAL BEATS — FOLLOW 1→9
FRAME 1 — Continue outside along Fleet Street / Temple formal city. Budapest Palace-of-Justice / National-Museum architecture is fused into London blocks. The protagonist remains on the pavement.

FRAME 2 — Large wet shopfront/entrance glass. Literal memory: buzzer/door-entry moment in which someone announces 'postman' and the apartment door opens, followed immediately by ordinary police entering. Do not render the word as text; show it as a spoken action.

FRAME 3 — Black taxi side window. Literal police-search memory: officers search an apartment and one officer is visibly speaking the remembered line about looking for cocaine. No action-thriller style, no drugs glamorization; ordinary procedural search.

FRAME 4 — Yellow tram window. Continuation of the same memory: one officer accidentally steps on the protagonist's recently operated foot. Show sudden pain and physical vulnerability, not a medical reveal and not gore.

FRAME 5 — Bus-shelter or broad civic glass. Literal fingerprinting memory with the recurring POLICEWOMAN present. The scene contains the awkward human contradiction of attraction / embarrassed expression during a formal procedure. No romance staging.

FRAME 6 — Red-bus side window. Literal appointed-defence memory: a substitute/person from the appointed-defence office appears instead of the expected lawyer; later defenders are difficult to contact. Use the recurring LAWYER only where appropriate, and show discontinuity rather than villainy.

FRAME 7 — Dark entrance glass. Literal phone/corridor memory of attempts to contact police, prosecution, court and defence routes. Different people redirect the protagonist. Keep all speakers anonymous and ordinary.

FRAME 8 — 180–270 degree current-city arc around the walking protagonist. Several formal glass surfaces simultaneously carry one-second procedural fragments; present pedestrians look at each other and cards sharpen asynchronously. Everyone remains human locally.

FRAME 9 — Blackfriars-approach wide exterior. The institutional memories fade, but the formal Budapest-in-London architecture remains physically present. The protagonist keeps walking outside.

OUTPUT RULE
Create one continuous photorealistic cinematic sequence for this block. The attached reference images are control assets, not objects that appear in the film. Preserve protagonist identity and location continuity. No fantasy glow, no psychedelic dream treatment, no game-engine look, no explanatory subtitles, no visible file names and no reference-grid borders.
```


### CINEMA BLOCK 05 — 02:00–02:30 — COURT / CLASSIFICATION / PERSON VS FILE

**MODEL:** Seedance 2.5  
**TARGET VIDEO:** approximately 30 seconds, 16:9 landscape, one continuous sequence.
**GENERATED OUTPUT:** save the generated clip as `V05_COURT_FILE.mp4`.


**ATTACH EXACTLY THESE FILES:**

- `W05_MAIN_WORLD.png`
- `SB05_STORYBOARD.png`
- `MW05_COURT_FILE.png`
- `C01_PROTAGONIST.png`
- `C04_APPOINTED_LAWYER.png`
- `C27_JUDGE.png`
- `C28_FORENSIC_EXPERT_A.png`
- `C29_FORENSIC_EXPERT_B.png`
- `C30_COURT_CLERK.png`
- `C31_ANONYMOUS_FICTIONAL_POLITICAL_FIGURE.png`
- `A05_NARRATION.wav`  ← clean Higgsfield Audio narration reference

**REFERENCE @ MAPPING — DO NOT COPY; USE THIS TO ASSIGN/VERIFY TOKENS:**

- `W05_MAIN_WORLD.png` → `@W05_MAIN_WORLD`
- `SB05_STORYBOARD.png` → `@SB05_STORYBOARD`
- `MW05_COURT_FILE.png` → `@MW05_COURT_FILE`
- `C01_PROTAGONIST.png` → `@C01_PROTAGONIST`
- `C04_APPOINTED_LAWYER.png` → `@C04_APPOINTED_LAWYER`
- `C27_JUDGE.png` → `@C27_JUDGE`
- `C28_FORENSIC_EXPERT_A.png` → `@C28_FORENSIC_EXPERT_A`
- `C29_FORENSIC_EXPERT_B.png` → `@C29_FORENSIC_EXPERT_B`
- `C30_COURT_CLERK.png` → `@C30_COURT_CLERK`
- `C31_ANONYMOUS_FICTIONAL_POLITICAL_FIGURE.png` → `@C31_ANONYMOUS_FICTIONAL_POLITICAL_FIGURE`
- `A05_NARRATION.wav` → `@A05_NARRATION`

If the UI gives a different @token, substitute that actual token in the prompt below.

================================================================================
**⬇ COPY ONLY THE CODE BLOCK BELOW INTO CINEMA STUDIO ⬇**
================================================================================

**PASTE THIS INTO THE CINEMA STUDIO PROMPT FIELD:**

```text
SEEDANCE 2.5 — CINEMA STUDIO VIDEO GENERATION

ACTIVE @REFERENCES
Use the attached assets only through the @reference tokens named below. The @token is the binding between this prompt and the uploaded reference image.

TARGET OUTPUT
- Duration: approximately 30 seconds, or the closest available Cinema Studio duration without changing the story order.
- Aspect ratio: 16:9 landscape.
- One continuous photorealistic cinematic sequence, not a montage of nine disconnected stills.
- The attached files are references only; never show their grid layouts, borders, filenames or reference-sheet design in the video.

REFERENCE ROLE ASSIGNMENT

- @W05_MAIN_WORLD = PHYSICAL PRESENT. It controls the current London–Budapest city, exact architecture, named Budapest anchors, rain, transport, real window/glass geometry, wet surfaces, lighting and surrounding street.
- @SB05_STORYBOARD = TEMPORAL PLAN. Read frames 1→9 as chronological keyframes for this one block. Never reproduce the storyboard grid in the output.
- @MW05_COURT_FILE = court / file / assets / forensic / black-humour memory source bank. Use only the relevant remembered scene; never display the whole 3×3 sheet.
- @C01_PROTAGONIST = exact protagonist identity: face, age, body proportions, hair and continuity.
- @C04_APPOINTED_LAWYER = exact identity anchor for the appointed lawyer; preserve face, age, body proportions and role.
- @C27_JUDGE = exact identity anchor for the judge; preserve face, age, body proportions and role.
- @C28_FORENSIC_EXPERT_A = exact identity anchor for the forensic expert a; preserve face, age, body proportions and role.
- @C29_FORENSIC_EXPERT_B = exact identity anchor for the forensic expert b; preserve face, age, body proportions and role.
- @C30_COURT_CLERK = exact identity anchor for the court clerk; preserve face, age, body proportions and role.
- @C31_ANONYMOUS_FICTIONAL_POLITICAL_FIGURE = exact identity anchor for the anonymous fictional political figure; preserve face, age, body proportions and role.
- Do not invent replacement identities for any named person above.

AUDIO — SUPPLIED NARRATION REFERENCE + NATIVE SEEDANCE 2.5 SFX

@A05_NARRATION = EXACT OFF-SCREEN NARRATION REFERENCE AND TIMING BACKBONE.
Use the supplied audio reference as authoritative. Preserve the same narrator voice, spoken wording, pacing and order. Do NOT re-voice, paraphrase, duplicate, summarize or replace it.
The visible protagonist does NOT speak the narration and must NOT lip-sync to it. No other visible character speaks intelligible dialogue.

Generate the remaining soundtrack natively around @A05_NARRATION: physically plausible ambience, synchronized foley/SFX and only the restrained score specified below. Keep all generated sound beneath the narration.

AMBIENCE / FOLEY / SFX EVENT TRACK
0–5s: rainy river/civic-city ambience, footsteps and distant traffic.
5–10s: quiet courtroom/administrative room tone enters through glass, paper set on a desk, chair movement, no intelligible judicial dialogue.
10–15s: folder opening, photograph/paper handling, pen/signature scratch, one soft stamp or file closure.
15–20s: evidence/property bag or box movement, phone/laptop object handling, still ordinary and non-thriller.
20–25s: forensic-room ventilation, two chairs shifting at different moments, page turn, restrained clock tick.
25–30s: posted letter/envelope, folder close, distant phone ring unanswered, then the exterior rain becomes dominant again.

MUSIC / SCORE
Use a very restrained low-level non-lyrical cinematic texture only if it helps continuity. Keep it sparse and below narration; no melody-forward score, no trailer swell, no vocal music.

MIX
Narration stays clear and centered, with ambience and effects underneath rather than competing with it. Environmental sounds must feel physically recorded in real spaces, not like a trailer sound library. Memory sounds may feel slightly filtered by distance/glass, but never use magical whooshes or dream-reverb. Maintain a compatible sonic palette with the neighboring blocks so all seven clips can cut together.
Keep the narration clearly intelligible and foregrounded. Duck ambience, foley and score beneath speech. Audio transitions follow the physical reflection/memory logic; do not use magical transition sounds.
The supplied @A05_NARRATION must remain clearly intelligible and dominant. Do not create a second narrator layer. Do not time-stretch it aggressively. Let the visual action follow the narration timing when necessary.

DO NOT GENERATE
No replacement narration. No paraphrased narration. No duplicate voice-over. No subtitles. No spoken labels. No explanatory character dialogue. No announcer. No chanting. No lyrics. No horror stingers. No giant cinematic impacts. No obvious dream-transition sound. No visible lip-sync to the narration.

MEMORY COMPOSITING

Until the final hard cut, the MAIN WORLD always remains the physical present. A memory appears only inside a real reflective or transparent surface already belonging to the MAIN WORLD: taxi glass, bus glass, tram glass, shopfront/cultural/entrance glass, wet polished stone or puddles. The MAIN WORLD keeps ownership of the pane frame, vehicle body, rain droplets and current-city reflection. The MEMORY WORLD supplies only the remembered place, people, props and action.

Never paste or reproduce a full MEMORY WORLD 3×3 sheet inside a window. Isolate only the relevant remembered scene. Keep a readable trace of rain, pane boundary or present-city reflection around/through the memory so it remains physically embedded in the real surface.

Do not introduce, hint at or reveal the hidden clinical reality in this block.

PHYSICAL PRESENT
The protagonist is on ONE uninterrupted exterior walk through the London–Budapest dream city.
Present-day city remains physically visible in every dream-city frame.
He does not physically enter the remembered house, office, police room, lawyer room, courtroom or foreign-trip location.
Literal memories appear only INSIDE real reflective / transparent surfaces: taxi windows, bus windows, tram windows, shopfront/cultural/entrance glass, wet polished stone or puddles.
A memory can occupy a pane strongly, but the window frame, rain or some present-city reflection remains readable around/through it.
Memory order is emotional, not chronological. Memory edits without asking permission.

SCORE-CARD BEHAVIOR
Cards are intentionally uncomfortable SYSTEM-world classification, not a MyScoutee product interface.
They are faint rounded translucent forms near head level, physically imperfect like reflection/lens artefact, not crisp HUD.
A tiny one/two-digit trace may exist but should usually be defocused.
Everyone can judge everyone: when one person directly looks at another, the VIEWED person's card temporarily becomes clearer, asynchronously.
Do not use flags, ethnicity stereotypes or face-based nationality coding.
Do not bake cards into mirrors as floating screens; they belong near people in the current dream city.

CARD INTENSITY FOR THIS BLOCK
Cards are now clearly perceptible around the current crowd, roughly 12–18%, but still translucent and non-HUD. The protagonist's own card is not yet fully readable.

CAMERA / VISUAL STYLE
Photorealistic live-action European feature film.
Grounded rain-soaked London–Budapest realism, dynamic but controlled camera: low tracking, lateral vehicle tracking, steadicam, rack focus, occasional 180/270-degree arcs, foreground pedestrian/vehicle wipes.
No static slideshow feeling, no 2.5D, no game engine, no psychedelic dream effect, no fantasy glow, no obvious sci-fi UI.
Memories are literal events, not metaphors.
Connect the ordered beats with grounded continuous cinema movement. Use forward tracking, lateral vehicle tracking, Steadicam, rack focus, foreground pedestrian/vehicle wipes and controlled arcs when appropriate. Do not stage nine static recreations or a slideshow.

ORDERED TEMPORAL BEATS — FOLLOW 1→9
FRAME 1 — Continue along Blackfriars riverfront with Hungarian Parliament and Gresham Palace anchors physically present in London Thames geometry. The protagonist remains outside.

FRAME 2 — Very large riverside cultural glass. Literal court-hearing memory: a judge at a hearing asks the protagonist the remembered prison question. Do not render dialogue as subtitles. Keep the judge anonymous/non-identifiable and the moment restrained, not melodramatic.

FRAME 3 — Black taxi glass. Literal memory of questions about the Budapest apartment, belongings, savings and what else he owns. Show the apartment/home and ordinary possessions becoming items of inquiry; the memory should feel like a human archive being reduced to assets.

FRAME 4 — Red-bus side windows. Literal memory of retained devices/belongings and paperwork: phone/laptop/storage/closed evidence or property boxes, ordinary administrative handling. No crime-thriller evidence wall.

FRAME 5 — Yellow tram windows. Literal file sequence: photograph, fingerprint sheet, signature, closed folder, forms. Across successive panes, the record occupies more visual space than the person's face.

FRAME 6 — Restaurant/cultural glass. Literal forensic-examination memory: two expert chairs, differing reactions, one asks what happened; the protagonist remains calm/cooperative. Do not imply a single unified expert voice.

FRAME 7 — Dark public glass. Black-humour memory: 'KATA's most wanted' / impossible police-career application tone represented as a small satirical self-made visual/poster or CV fragment inside the memory, without identifiable political figures and without large readable text.

FRAME 8 — Broad entrance glass. Literal clerk/court-route memory: request for recording/evidence, discussion of expensive official recording and future complaint/appeal routes while present correction remains unresolved. Keep text unreadable and focus on ordinary people, phone, letter, file.

FRAME 9 — Wide river city. Hungarian Parliament, London bridge geometry, yellow tram, red bus and black taxi remain in the physical present. The protagonist is visually smaller among many panes and many faint cards; the city feels like it can classify everyone.

OUTPUT RULE
Create one continuous photorealistic cinematic sequence for this block. The attached reference images are control assets, not objects that appear in the film. Preserve protagonist identity and location continuity. No fantasy glow, no psychedelic dream treatment, no game-engine look, no explanatory subtitles, no visible file names and no reference-grid borders.
```


### CINEMA BLOCK 06 — 02:30–03:00 — OVERLOAD / HUMANITY BREAKS THROUGH

**MODEL:** Seedance 2.5  
**TARGET VIDEO:** approximately 30 seconds, 16:9 landscape, one continuous sequence.
**GENERATED OUTPUT:** save the generated clip as `V06_HUMANITY_OVERLOAD.mp4`.


**ATTACH EXACTLY THESE FILES:**

- `W06_MAIN_WORLD.png`
- `SB06_STORYBOARD.png`
- `MW06_HUMAN_COUNTERMEMORIES.png`
- `C01_PROTAGONIST.png`
- `C02_SOHO_WOMAN.png`
- `C03_POLICEWOMAN.png`
- `C04_APPOINTED_LAWYER.png`
- `C10_BEGINNER_DANCE_WOMAN.png`
- `C11_RUSSIAN_TRANSIT_PASSENGER.png`
- `C16_BALLOON_LOCAL_HELPER_MAN.png`
- `C17_BALLOON_LOCAL_HELPER_WOMAN.png`
- `C27_JUDGE.png`
- `C28_FORENSIC_EXPERT_A.png`
- `C29_FORENSIC_EXPERT_B.png`
- `A06_NARRATION.wav`  ← clean Higgsfield Audio narration reference

**REFERENCE @ MAPPING — DO NOT COPY; USE THIS TO ASSIGN/VERIFY TOKENS:**

- `W06_MAIN_WORLD.png` → `@W06_MAIN_WORLD`
- `SB06_STORYBOARD.png` → `@SB06_STORYBOARD`
- `MW06_HUMAN_COUNTERMEMORIES.png` → `@MW06_HUMAN_COUNTERMEMORIES`
- `C01_PROTAGONIST.png` → `@C01_PROTAGONIST`
- `C02_SOHO_WOMAN.png` → `@C02_SOHO_WOMAN`
- `C03_POLICEWOMAN.png` → `@C03_POLICEWOMAN`
- `C04_APPOINTED_LAWYER.png` → `@C04_APPOINTED_LAWYER`
- `C10_BEGINNER_DANCE_WOMAN.png` → `@C10_BEGINNER_DANCE_WOMAN`
- `C11_RUSSIAN_TRANSIT_PASSENGER.png` → `@C11_RUSSIAN_TRANSIT_PASSENGER`
- `C16_BALLOON_LOCAL_HELPER_MAN.png` → `@C16_BALLOON_LOCAL_HELPER_MAN`
- `C17_BALLOON_LOCAL_HELPER_WOMAN.png` → `@C17_BALLOON_LOCAL_HELPER_WOMAN`
- `C27_JUDGE.png` → `@C27_JUDGE`
- `C28_FORENSIC_EXPERT_A.png` → `@C28_FORENSIC_EXPERT_A`
- `C29_FORENSIC_EXPERT_B.png` → `@C29_FORENSIC_EXPERT_B`
- `A06_NARRATION.wav` → `@A06_NARRATION`

If the UI gives a different @token, substitute that actual token in the prompt below.

================================================================================
**⬇ COPY ONLY THE CODE BLOCK BELOW INTO CINEMA STUDIO ⬇**
================================================================================

**PASTE THIS INTO THE CINEMA STUDIO PROMPT FIELD:**

```text
SEEDANCE 2.5 — CINEMA STUDIO VIDEO GENERATION

ACTIVE @REFERENCES
Use the attached assets only through the @reference tokens named below. The @token is the binding between this prompt and the uploaded reference image.

TARGET OUTPUT
- Duration: approximately 30 seconds, or the closest available Cinema Studio duration without changing the story order.
- Aspect ratio: 16:9 landscape.
- One continuous photorealistic cinematic sequence, not a montage of nine disconnected stills.
- The attached files are references only; never show their grid layouts, borders, filenames or reference-sheet design in the video.

REFERENCE ROLE ASSIGNMENT

- @W06_MAIN_WORLD = PHYSICAL PRESENT. It controls the current London–Budapest city, exact architecture, named Budapest anchors, rain, transport, real window/glass geometry, wet surfaces, lighting and surrounding street.
- @SB06_STORYBOARD = TEMPORAL PLAN. Read frames 1→9 as chronological keyframes for this one block. Never reproduce the storyboard grid in the output.
- @MW06_HUMAN_COUNTERMEMORIES = late-film recurring human counter-memory source bank. Use only the relevant remembered scene; never display the whole 3×3 sheet.
- @C01_PROTAGONIST = exact protagonist identity: face, age, body proportions, hair and continuity.
- @C02_SOHO_WOMAN = exact identity anchor for the soho woman; preserve face, age, body proportions and role.
- @C03_POLICEWOMAN = exact identity anchor for the policewoman; preserve face, age, body proportions and role.
- @C04_APPOINTED_LAWYER = exact identity anchor for the appointed lawyer; preserve face, age, body proportions and role.
- @C10_BEGINNER_DANCE_WOMAN = exact identity anchor for the beginner dance woman; preserve face, age, body proportions and role.
- @C11_RUSSIAN_TRANSIT_PASSENGER = exact identity anchor for the russian transit passenger; preserve face, age, body proportions and role.
- @C16_BALLOON_LOCAL_HELPER_MAN = exact identity anchor for the balloon local helper man; preserve face, age, body proportions and role.
- @C17_BALLOON_LOCAL_HELPER_WOMAN = exact identity anchor for the balloon local helper woman; preserve face, age, body proportions and role.
- @C27_JUDGE = exact identity anchor for the judge; preserve face, age, body proportions and role.
- @C28_FORENSIC_EXPERT_A = exact identity anchor for the forensic expert a; preserve face, age, body proportions and role.
- @C29_FORENSIC_EXPERT_B = exact identity anchor for the forensic expert b; preserve face, age, body proportions and role.
- Do not invent replacement identities for any named person above.

AUDIO — SUPPLIED NARRATION REFERENCE + NATIVE SEEDANCE 2.5 SFX

@A06_NARRATION = EXACT OFF-SCREEN NARRATION REFERENCE AND TIMING BACKBONE.
Use the supplied audio reference as authoritative. Preserve the same narrator voice, spoken wording, pacing and order. Do NOT re-voice, paraphrase, duplicate, summarize or replace it.
The visible protagonist does NOT speak the narration and must NOT lip-sync to it. No other visible character speaks intelligible dialogue.

Generate the remaining soundtrack natively around @A06_NARRATION: physically plausible ambience, synchronized foley/SFX and only the restrained score specified below. Keep all generated sound beneath the narration.

AMBIENCE / FOLEY / SFX EVENT TRACK
0–5s: denser South Bank city bed, rain, crowd, bus brakes, tram rail, taxi tyre hiss.
5–10s: brief transit-gate beep, then a soft human breath-smile; both feel like memory fragments inside separate glass surfaces.
10–15s: balloon fabric/rope/hand effort, soil and vegetation movement, immediately followed by current-city traffic.
15–20s: quiet procedural room tone with one restrained suppressed laugh / warm exhale, no words.
20–24s: lawyer/court paper movement and chair shift, then a few dance-floor shoe steps and room ambience, no music beat.
24–30s: multiple memory sound fragments overlap lightly but remain intelligible; then simplify to footsteps, rain and the city continuing toward Westminster.

MUSIC / SCORE
Use a very restrained low-level non-lyrical cinematic texture only if it helps continuity. Keep it sparse and below narration; no melody-forward score, no trailer swell, no vocal music.

MIX
Narration stays clear and centered, with ambience and effects underneath rather than competing with it. Environmental sounds must feel physically recorded in real spaces, not like a trailer sound library. Memory sounds may feel slightly filtered by distance/glass, but never use magical whooshes or dream-reverb. Maintain a compatible sonic palette with the neighboring blocks so all seven clips can cut together.
Keep the narration clearly intelligible and foregrounded. Duck ambience, foley and score beneath speech. Audio transitions follow the physical reflection/memory logic; do not use magical transition sounds.
The supplied @A06_NARRATION must remain clearly intelligible and dominant. Do not create a second narrator layer. Do not time-stretch it aggressively. Let the visual action follow the narration timing when necessary.

DO NOT GENERATE
No replacement narration. No paraphrased narration. No duplicate voice-over. No subtitles. No spoken labels. No explanatory character dialogue. No announcer. No chanting. No lyrics. No horror stingers. No giant cinematic impacts. No obvious dream-transition sound. No visible lip-sync to the narration.

MEMORY COMPOSITING

Until the final hard cut, the MAIN WORLD always remains the physical present. A memory appears only inside a real reflective or transparent surface already belonging to the MAIN WORLD: taxi glass, bus glass, tram glass, shopfront/cultural/entrance glass, wet polished stone or puddles. The MAIN WORLD keeps ownership of the pane frame, vehicle body, rain droplets and current-city reflection. The MEMORY WORLD supplies only the remembered place, people, props and action.

Never paste or reproduce a full MEMORY WORLD 3×3 sheet inside a window. Isolate only the relevant remembered scene. Keep a readable trace of rain, pane boundary or present-city reflection around/through the memory so it remains physically embedded in the real surface.

Do not introduce, hint at or reveal the hidden clinical reality in this block.

PHYSICAL PRESENT
The protagonist is on ONE uninterrupted exterior walk through the London–Budapest dream city.
Present-day city remains physically visible in every dream-city frame.
He does not physically enter the remembered house, office, police room, lawyer room, courtroom or foreign-trip location.
Literal memories appear only INSIDE real reflective / transparent surfaces: taxi windows, bus windows, tram windows, shopfront/cultural/entrance glass, wet polished stone or puddles.
A memory can occupy a pane strongly, but the window frame, rain or some present-city reflection remains readable around/through it.
Memory order is emotional, not chronological. Memory edits without asking permission.

SCORE-CARD BEHAVIOR
Cards are intentionally uncomfortable SYSTEM-world classification, not a MyScoutee product interface.
They are faint rounded translucent forms near head level, physically imperfect like reflection/lens artefact, not crisp HUD.
A tiny one/two-digit trace may exist but should usually be defocused.
Everyone can judge everyone: when one person directly looks at another, the VIEWED person's card temporarily becomes clearer, asynchronously.
Do not use flags, ethnicity stereotypes or face-based nationality coding.
Do not bake cards into mirrors as floating screens; they belong near people in the current dream city.

CARD INTENSITY FOR THIS BLOCK
Cards across the current crowd are 18–25% and frequently readable during gaze. In FRAME 8 the protagonist's own card becomes clearly visible for the first time, matching the crowd.

CAMERA / VISUAL STYLE
Photorealistic live-action European feature film.
Grounded rain-soaked London–Budapest realism, dynamic but controlled camera: low tracking, lateral vehicle tracking, steadicam, rack focus, occasional 180/270-degree arcs, foreground pedestrian/vehicle wipes.
No static slideshow feeling, no 2.5D, no game engine, no psychedelic dream effect, no fantasy glow, no obvious sci-fi UI.
Memories are literal events, not metaphors.
Connect the ordered beats with grounded continuous cinema movement. Use forward tracking, lateral vehicle tracking, Steadicam, rack focus, foreground pedestrian/vehicle wipes and controlled arcs when appropriate. Do not stage nine static recreations or a slideshow.

ORDERED TEMPORAL BEATS — FOLLOW 1→9
FRAME 1 — Continue west along South Bank in the maximum-density hybrid city: Great Market Hall / National Theatre / Bálna elements, London Eye and separated Hungarian Parliament sightline. Many current pedestrians carry increasingly visible cards.

FRAME 2 — Lateral move along red bus + yellow tram windows. Several literal positive memories coexist across different panes: Soho woman's small smile, Russian passenger opening the gate, balloon/vegetable-plot hands helping. Keep each pane distinct and readable, not collage mush.

FRAME 3 — Large public glass. Literal police/humanity memory: the POLICEWOMAN or another officer struggles not to laugh / gives an embarrassed human smile during an otherwise formal procedure. Nothing procedural changes.

FRAME 4 — Bus window. Literal lawyer memory: a lawyer asks for another room / shows a moment of ordinary human discomfort or practical help. Avoid hero/villain framing.

FRAME 5 — Tram/cultural glass. Brief judge/expert/official expression changes, then a warm unrelated human memory such as dance-floor or stranger cooperation. The point is that roles are not whole people.

FRAME 6 — Multiple architectural panes at once: court/file/work/police fragments overlap with shared-house/travel/relationship fragments. Keep the present city frame and reflections physically readable. This is dense but not psychedelic.

FRAME 7 — Current crowd interaction becomes the focus. Many people look at other people; viewed cards sharpen at different moments, creating a living web of judgments. The protagonist is not the only observer and not the only judged person.

FRAME 8 — For the first time, the protagonist's OWN card becomes clearly visible near his head at the same sharpness as nearby cards. He notices only briefly; restrained reaction, no panic. He is visually one record among many.

FRAME 9 — Westminster Bridge approach begins to clear. Traffic and crowd density reduce slightly; the city remains wet and real. The protagonist walks toward a quieter continuation. NO clinical imagery yet.

OUTPUT RULE
Create one continuous photorealistic cinematic sequence for this block. The attached reference images are control assets, not objects that appear in the film. Preserve protagonist identity and location continuity. No fantasy glow, no psychedelic dream treatment, no game-engine look, no explanatory subtitles, no visible file names and no reference-grid borders.
```


### CINEMA BLOCK 07 — 03:00–03:20 — LAST WINDOW / HARD CUT

**MODEL:** Seedance 2.5  
**TARGET VIDEO:** approximately 20 seconds, 16:9 landscape, one continuous sequence ending in the hard cut.
**GENERATED OUTPUT:** save the generated clip as `V07_LAST_WINDOW_REVEAL.mp4`.


**ATTACH EXACTLY THESE FILES:**

- `W07_MAIN_WORLD.png`
- `SB07_STORYBOARD.png`
- `HRW07_CLINICAL_REALITY.png`
- `C01_PROTAGONIST.png`
- `C05_FINAL_NURSE.png`
- `A07_NARRATION.wav`  ← clean Higgsfield Audio narration reference

**REFERENCE @ MAPPING — DO NOT COPY; USE THIS TO ASSIGN/VERIFY TOKENS:**

- `W07_MAIN_WORLD.png` → `@W07_MAIN_WORLD`
- `SB07_STORYBOARD.png` → `@SB07_STORYBOARD`
- `HRW07_CLINICAL_REALITY.png` → `@HRW07_CLINICAL_REALITY`
- `C01_PROTAGONIST.png` → `@C01_PROTAGONIST`
- `C05_FINAL_NURSE.png` → `@C05_FINAL_NURSE`
- `A07_NARRATION.wav` → `@A07_NARRATION`

If the UI gives a different @token, substitute that actual token in the prompt below.

================================================================================
**⬇ COPY ONLY THE CODE BLOCK BELOW INTO CINEMA STUDIO ⬇**
================================================================================

**PASTE THIS INTO THE CINEMA STUDIO PROMPT FIELD:**

```text
SEEDANCE 2.5 — CINEMA STUDIO VIDEO GENERATION

ACTIVE @REFERENCES
Use the attached assets only through the @reference tokens named below. The @token is the binding between this prompt and the uploaded reference image.

TARGET OUTPUT
- Duration: approximately 20 seconds, or the closest available Cinema Studio duration without changing the story order.
- Aspect ratio: 16:9 landscape.
- One continuous photorealistic cinematic sequence, not a montage of nine disconnected stills.
- The attached files are references only; never show their grid layouts, borders, filenames or reference-sheet design in the video.

REFERENCE ROLE ASSIGNMENT

- @W07_MAIN_WORLD = PHYSICAL PRESENT. It controls the current London–Budapest city, exact architecture, named Budapest anchors, rain, transport, real window/glass geometry, wet surfaces, lighting and surrounding street.
- @SB07_STORYBOARD = TEMPORAL PLAN. Read frames 1→9 as chronological keyframes for this one block. Never reproduce the storyboard grid in the output.
- @HRW07_CLINICAL_REALITY = hidden physical clinical reality. Use it only for the sub-second fragments in frames 2–5 and the actual clinical room after the hard cut in frames 8–9. Never display the whole 3×3 sheet.
- @C01_PROTAGONIST = exact protagonist identity: face, age, body proportions, hair and continuity.
- @C05_FINAL_NURSE = exact identity anchor for the final nurse; preserve face, age, body proportions and role.
- Do not invent replacement identities for any named person above.

AUDIO — SUPPLIED NARRATION REFERENCE + NATIVE SEEDANCE 2.5 SFX

@A07_NARRATION = EXACT OFF-SCREEN NARRATION REFERENCE AND TIMING BACKBONE.
Use the supplied audio reference as authoritative. Preserve the same narrator voice, spoken wording, pacing and order. Do NOT re-voice, paraphrase, duplicate, summarize or replace it.
The visible protagonist does NOT speak the narration and must NOT lip-sync to it. No other visible character speaks intelligible dialogue.

Generate the remaining soundtrack natively around @A07_NARRATION: physically plausible ambience, synchronized foley/SFX and only the restrained score specified below. Keep all generated sound beneath the narration.

AMBIENCE / FOLEY / SFX EVENT TRACK
0–5s: the city is quieter now: rain, isolated footsteps, distant tram/traffic, more empty space between sounds.
5–9s: an almost subliminal cold ventilation / fluorescent electrical hum intrudes beneath the rain during the white-light and white-coat reflection fragments.
9–13s: one faint metal contact and white-sheet/fabric movement appear only as ambiguous fragments while city ambience remains present.
13–15s: final glass approach; footsteps stop, rain and reflected traffic thin rapidly, no dream whoosh and no horror rise.
At the HARD CUT to the clinical room: city/rain stop instantly. Replace them with flat real clinical room tone, ventilation, quiet breathing, bed linen, one small ordinary metal/equipment click.
15–20s: clinical ambience only under the end of narration. No sting, no heartbeat effect, no ominous music, no supernatural sound.

MUSIC / SCORE
No music after the hard cut to the clinical room. Before the hard cut, use at most a nearly imperceptible low tonal bed. No sting, no crescendo, no heartbeat effect.

MIX
Narration stays clear and centered, with ambience and effects underneath rather than competing with it. Environmental sounds must feel physically recorded in real spaces, not like a trailer sound library. Memory sounds may feel slightly filtered by distance/glass, but never use magical whooshes or dream-reverb. Maintain a compatible sonic palette with the neighboring blocks so all seven clips can cut together.
Keep the narration clearly intelligible and foregrounded. Duck ambience, foley and score beneath speech. Audio transitions follow the physical reflection/memory logic; do not use magical transition sounds.
The supplied @A07_NARRATION must remain clearly intelligible and dominant. Do not create a second narrator layer. Do not time-stretch it aggressively. Let the visual action follow the narration timing when necessary.

DO NOT GENERATE
No replacement narration. No paraphrased narration. No duplicate voice-over. No subtitles. No spoken labels. No explanatory character dialogue. No announcer. No chanting. No lyrics. No horror stingers. No giant cinematic impacts. No obvious dream-transition sound. No visible lip-sync to the narration.

MEMORY COMPOSITING

Until the final hard cut, the MAIN WORLD always remains the physical present. A memory appears only inside a real reflective or transparent surface already belonging to the MAIN WORLD: taxi glass, bus glass, tram glass, shopfront/cultural/entrance glass, wet polished stone or puddles. The MAIN WORLD keeps ownership of the pane frame, vehicle body, rain droplets and current-city reflection. The MEMORY WORLD supplies only the remembered place, people, props and action.

Never paste or reproduce a full MEMORY WORLD 3×3 sheet inside a window. Isolate only the relevant remembered scene. Keep a readable trace of rain, pane boundary or present-city reflection around/through the memory so it remains physically embedded in the real surface.

The clinical room is forbidden until the storyboard reaches the hard cut. The protagonist does not wake up.

PHYSICAL PRESENT
The protagonist is on ONE uninterrupted exterior walk through the London–Budapest dream city.
Present-day city remains physically visible in every dream-city frame.
He does not physically enter the remembered house, office, police room, lawyer room, courtroom or foreign-trip location.
Literal memories appear only INSIDE real reflective / transparent surfaces: taxi windows, bus windows, tram windows, shopfront/cultural/entrance glass, wet polished stone or puddles.
A memory can occupy a pane strongly, but the window frame, rain or some present-city reflection remains readable around/through it.
Memory order is emotional, not chronological. Memory edits without asking permission.

SCORE-CARD BEHAVIOR
Cards are intentionally uncomfortable SYSTEM-world classification, not a MyScoutee product interface.
They are faint rounded translucent forms near head level, physically imperfect like reflection/lens artefact, not crisp HUD.
A tiny one/two-digit trace may exist but should usually be defocused.
Everyone can judge everyone: when one person directly looks at another, the VIEWED person's card temporarily becomes clearer, asynchronously.
Do not use flags, ethnicity stereotypes or face-based nationality coding.
Do not bake cards into mirrors as floating screens; they belong near people in the current dream city.

CARD INTENSITY FOR THIS BLOCK
At the start, crowd cards and the protagonist's own card are equally clear. As the final glass reflection loses the city, reflected cards fade out one by one. In the clinical reality there are NO cards, contours or numbers.

CAMERA / VISUAL STYLE
Photorealistic live-action European feature film.
Grounded rain-soaked London–Budapest realism, dynamic but controlled camera: low tracking, lateral vehicle tracking, steadicam, rack focus, occasional 180/270-degree arcs, foreground pedestrian/vehicle wipes.
No static slideshow feeling, no 2.5D, no game engine, no psychedelic dream effect, no fantasy glow, no obvious sci-fi UI.
Memories are literal events, not metaphors.
Connect the ordered beats with grounded continuous cinema movement. Use forward tracking, lateral vehicle tracking, Steadicam, rack focus, foreground pedestrian/vehicle wipes and controlled arcs when appropriate. Do not stage nine static recreations or a slideshow.

ORDERED TEMPORAL BEATS — FOLLOW 1→9
FRAME 1 — Quieter Westminster / Whitehall exterior. The protagonist continues the same walk. Hungarian Parliament and a distant St Stephen's Basilica echo remain possible in separated sightlines. Cards are clearer but pedestrians are now more distant.

FRAME 2 — A large dark street-facing pane briefly catches an ambiguous COLD WHITE LIGHT that does not belong to the warm-neutral lobby. Less than a second in the intended video. Immediately retain normal city reflection around it.

FRAME 3 — Another passing window reflection contains only the edge of a WHITE COAT for a fraction of a second, immediately returning to the London–Budapest city.

FRAME 4 — Final-building glass briefly contains a fragment of an IMMOBILIZED / ELEVATED LEG, less than a second, still mixed with rain and current street reflection. Do not show a complete clinical room.

FRAME 5 — Another extremely short reflection contains a METAL RESTRAINT and a white-sheet edge. The reflected pedestrians' cards begin fading one by one as the protagonist nears the final doors.

FRAME 6 — The protagonist stands immediately outside the broad dark-glass entrance. His hand approaches the real handle. The glass strongly reflects the hybrid city: red bus colour, yellow tram, black taxi, Pest stone, wet street. His own card is still faintly present.

FRAME 7 — Same glass surface, closer. Without fantasy effects, the reflected city loses information and the pane appears to show a cold ordinary clinical room directly behind him. The last reflected cards disappear. The protagonist turns. This is the last dream-city frame.

FRAME 8 — HARD CUT to the real clinical room. Same protagonist, conscious, not waking up. One leg elevated and immobilized; one arm restrained. A calm ordinary NURSE is nearby preparing routine non-graphic equipment for an enema/endoscopy-related procedure. No horror, no gore, no supernatural quality, no cards. The nurse has a small ordinary human smile.

FRAME 9 — Quiet final hold in the same real room: protagonist looks toward the nurse, breathing/room-tone feeling, ordinary clinical reality. Then intended edit cuts to black with the title added cleanly in post: MYSCOUTEE / THE PATH BETWEEN PEOPLE. Do not turn this frame into a dream wake-up or explanatory ending.

OUTPUT RULE
Create one continuous photorealistic cinematic sequence for this block. The attached reference images are control assets, not objects that appear in the film. Preserve protagonist identity and location continuity. No fantasy glow, no psychedelic dream treatment, no game-engine look, no explanatory subtitles, no visible file names and no reference-grid borders.
```


### SEEDANCE 2.5 SHORT-CLIP SPLIT RULE — EMERGENCY FALLBACK ONLY

Seedance 2.5 is intended to handle Blocks 01–06 as single ~30-second generations and Block 07 as one ~20-second generation. Use this fallback ONLY if Cinema Studio cannot reliably produce the full block.

**CRITICAL AUDIO RULE:** never attach the same full `Axx_NARRATION.wav` to PART A, PART B and PART C. A full 23–27 second narration file cannot be the timing reference for three separate ~10-second subclips.

For a split block, create/use three narration segments:
- `Axx_PART_A.wav` = narration belonging to storyboard frames 1→3.
- `Axx_PART_B.wav` = narration belonging to storyboard frames 4→6.
- `Axx_PART_C.wav` = narration belonging to storyboard frames 7→9.

**PREFERRED AUDIO-SPLIT METHOD:** if Higgsfield offers a simple trim/segment operation that preserves the approved `Axx_NARRATION.wav` without re-voicing it, split that LOCKED narration at natural sentence/pause boundaries and save the three parts above.

**NO-MANUAL-AUDIO-EDITOR METHOD:** if you cannot trim audio, return to Higgsfield Audio / Seed Audio 1.0 and generate PART A / B / C separately from the exact corresponding narration sentences, using the SAME locked voice preset, pitch and expression. Do not let Seedance invent or re-speak the narration. Keep each sub-narration comfortably shorter than its video subclip so there is room for ambience and transitions.

For every subclip:
1. Attach the SAME scene-specific image-reference bundle as the parent Cinema block.
2. Attach ONLY the matching narration segment (`@Axx_PART_A`, `@Axx_PART_B` or `@Axx_PART_C`) as audio reference.
3. In the copied Cinema prompt, replace the parent `@Axx_NARRATION` token with the matching PART token.
4. Keep only the storyboard beats and AUDIO-event-track cues that belong to that part.
5. Seedance generates ambience, foley/SFX and restrained score around the supplied narration segment; it must not re-voice it.
6. Preserve the same visual identity/world continuity across A → B → C.

**CLIP A — append this at the END of the matching Cinema prompt:**

```text
SHORT-CLIP OVERRIDE — PART A
Use only the supplied @Axx_PART_A narration segment as the off-screen narration/timing backbone for this subclip. Do not use the full parent narration file and do not generate replacement narration.
Generate only storyboard frames 1→3 from this block, in order. Do not advance to frame 4. Treat this as the opening segment of a longer continuous sequence. End on a natural continuation point, not a conclusion.
```

**CLIP B — append this at the END of the matching Cinema prompt:**

```text
SHORT-CLIP OVERRIDE — PART B
Use only the supplied @Axx_PART_B narration segment as the off-screen narration/timing backbone for this subclip. Do not use the full parent narration file and do not generate replacement narration.
Continue directly from the previous generated clip. Generate only storyboard frames 4→6 from this block, in order. Preserve the exact protagonist, world, lighting, weather, transport, memory-surface behavior and camera continuity from the previous clip. Do not re-establish the city and do not advance to frame 7.
```

**CLIP C — append this at the END of the matching Cinema prompt:**

```text
SHORT-CLIP OVERRIDE — PART C
Use only the supplied @Axx_PART_C narration segment as the off-screen narration/timing backbone for this subclip. Do not use the full parent narration file and do not generate replacement narration.
Continue directly from the previous generated clip. Generate only storyboard frames 7→9 from this block, in order. Preserve the exact protagonist, world, lighting, weather, transport, memory-surface behavior and camera continuity from the previous clip. Complete only the ending specified by this block.
```

`@Axx_PART_A/B/C` is a placeholder naming pattern: replace `xx` with the actual block number and use the actual @token assigned by Cinema Studio.

For STORYBOARD 07, PART C contains the actual clinical hard cut; Parts A and B must not expose the full clinical room.

### SHORT-CLIP NARRATION PART COPY PACK — USE ONLY WITH THE EMERGENCY FALLBACK

> **OPERATOR NOTE — DO NOT COPY:** If you cannot trim the approved full narration WAV, generate the following narration parts in Higgsfield Audio / Seed Audio 1.0 using the SAME locked narrator voice preset, pitch and expression. These parts are exact subsets of the approved narration scripts; no new narration is introduced. Save each result under the filename shown.

#### BLOCK 01 PARTS

`A01_PART_A.wav`
```text
I don't remember my life as a straight line. A street becomes a room, a window becomes another country.
```

`A01_PART_B.wav`
```text
A glance becomes a verdict before anyone has time to speak. Memory edits without asking permission.
```

`A01_PART_C.wav`
```text
Sometimes the only thing that survives the cut is a smile.
```

#### BLOCK 02 PARTS

`A02_PART_A.wav`
```text
I remember routes before dates: a card at a gate, a voice behind a bus seat,
```

`A02_PART_B.wav`
```text
a taxi shared with strangers, luggage falling, hands lifting a balloon basket from a field.
```

`A02_PART_C.wav`
```text
Global route. Local encounter. The world was large; the moments that stayed were human.
```

#### BLOCK 03 PARTS

`A03_PART_A.wav`
```text
Work should have been simpler than travel. Three people, one problem, three screens.
```

`A03_PART_B.wav`
```text
A form changed, a rule moved, a deadline arrived. Nobody had to be cruel.
```

`A03_PART_C.wav`
```text
The gap between ordinary actions was enough. I kept trying to repair the record while the work kept moving.
```

#### BLOCK 04 PARTS

`A04_PART_A.wav`
```text
Then the system entered the story without ever becoming one person. A voice at the door. A search.
```

`A04_PART_B.wav`
```text
A question. A lawyer I could not quite reach. An officer who almost laughed.
```

`A04_PART_C.wav`
```text
The strange part was not that people stopped being human. The process could forget that they were.
```

#### BLOCK 05 PARTS

`A05_PART_A.wav`
```text
A file can hold a photograph, a fingerprint, a signature, a list of things you own.
```

`A05_PART_B.wav`
```text
It cannot hold why you came home, what you gave up, or what you were trying to repair.
```

`A05_PART_C.wav`
```text
The more the record grew, the less room it seemed to leave for the life that made it.
```

#### BLOCK 06 PARTS

`A06_PART_A.wav`
```text
But humanity kept leaking through. A stranger opened a gate. Someone smiled in the wrong room.
```

`A06_PART_B.wav`
```text
People pulled together when a balloon landed where it should not.
```

`A06_PART_C.wav`
```text
A judge, an officer, a lawyer, a dancer: for a second, each role became a person again. Then the system resumed.
```

#### BLOCK 07 PARTS

`A07_PART_A.wav`
```text
By then the city was reading me too.
```

`A07_PART_B.wav`
```text
London, Budapest, every memory stayed in the glass until the reflections disappeared.
```

`A07_PART_C.wav`
```text
What remained was not an answer: a room, a body, another human face.
```

**PART-FILE ACCEPTANCE RULE:** each generated narration part must finish comfortably before the end of its intended subclip. If it runs too long, regenerate that part with a minimal `speech_rate` increase using the same locked voice preset; do not ask Seedance to time-compress it. Silence/ambience after a short narration part is acceptable and intentional.


================================================================================
## NO-MANUAL-EDIT FINAL ASSEMBLY — HIGGSFIELD PROJECT / SUPERCOMPUTER
================================================================================

> **OPERATOR NOTE — DO NOT COPY UNLESS YOU ARE IN A HIGGSFIELD ASSEMBLY / SUPERCOMPUTER WORKFLOW:** the seven Seedance clips already contain the locked supplied narration reference plus the ambience + foley/SFX + restrained score generated around it. The remaining task is only ordered concatenation, not creative re-editing.

**INPUT CLIPS IN EXACT ORDER:**

1. `V01_CITY_JUDGES_FIRST.mp4`
2. `V02_GLOBAL_ROUTE.mp4`
3. `V03_WORK_SYSTEM.mp4`
4. `V04_POLICE_DEFENCE.mp4`
5. `V05_COURT_FILE.mp4`
6. `V06_HUMANITY_OVERLOAD.mp4`
7. `V07_LAST_WINDOW_REVEAL.mp4`

**COPY THIS ONLY IF THE ASSEMBLY TOOL ACCEPTS A NATURAL-LANGUAGE ASSEMBLY INSTRUCTION:**

```text
Assemble the seven supplied MYSCOUTEE video blocks in the exact numerical order 01 → 07.

Do not reorder, shorten, retime, crossfade, remix, replace, regenerate or reinterpret any block.
Preserve each block's embedded narration, ambience and sound effects exactly.
Use direct cuts between blocks. No transition effects, no dissolve, no added B-roll, no extra music, no new narration and no subtitles.
The physical walk must feel like one continuous progression from Soho to the final Westminster/Whitehall glass threshold even though it is built from seven generated blocks.

After the final clinical hold, cut to black. Display exactly:
MYSCOUTEE
THE PATH BETWEEN PEOPLE

Keep the title plain, centered and restrained on black. No logo animation, no trailer sting, no extra tagline unless explicitly requested later.
End after a short silent hold.
```
