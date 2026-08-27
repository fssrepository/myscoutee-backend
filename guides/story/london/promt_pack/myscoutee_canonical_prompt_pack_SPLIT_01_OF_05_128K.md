<!-- MYSCOUTEE IMPORT ELEMENTS SPLIT METADATA
canonical_version: v2.2.46
import_elements_limit: 128 KiB
preserve_existing_scene_and_category_grouping: true
collection_path_test: true
do_not_create_duplicate_elements_from_this_header: true
collection_path rules:
CHARACTER 01 -> 01/01A Core-Recurring
CHARACTER 02,06-10 -> 01/01B London-Social-House-Dance
CHARACTER 11-21 -> 01/01C Global-Routes-Travel
CHARACTER 22-24 -> 01/01D Work-Admin
CHARACTER 03-04,25-31 -> 01/01E Police-Legal-Institutional
CHARACTER 05 -> 01/01F Final-Clinical
WORLD 01-07 -> 02/matching Present-City leaf
MEMORY WORLD 01-06 -> 03/matching Memory-World leaf
HIDDEN REALITY WORLD 07 -> 03/03F Hidden-Clinical-Reality
MEMORY PRESERVATION WORLD P01-P02 -> 04 Memory-Packs-Technical-References
SCORE CARDS -> 04/Scorecards
STORYBOARD 01-07 -> 05 Storyboards
NARRATION 01-07 -> 06 Audio-Narration
CINEMA BLOCK 01-07 -> 07 Video-Canonical-Chain
FINAL assets -> 08 Final-Delivery-Festival
END IMPORT SPLIT METADATA -->

# MYSCOUTEE — CANONICAL PROMPT PACK v2.2.46 STORY-PRESERVATION + GALA-ABSTRACTION-EXACT + AI-SURVIVAL-NARRATION + ABOVE-HEAD-SCORECARDS + NORMAL-BASELINE/GAZE-FILL + MCP/SUPERCOMPUTER-HANDOFF + EARLY-V01-LIVE-TEST + HIGGSFIELD-NATIVE-EXTENSION + NO-EXTERNAL-EDITOR + FIRST-PASS LOCKED
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

**IMPORTANT OPERATING RULE:** every code block below is a separate generation request. Never paste a WORLD prompt together with a MAP prompt. Never paste multiple CHARACTER prompts together. The pack is deliberately repetitive so every prompt is independently executable.

**HIGGSFIELD MCP PLUGIN — PRODUCTION MEDIA ONLY — NON-NEGOTIABLE:** all production image, narration/audio and video generation for this film must be executed by Higgsfield models through the Higgsfield MCP plugin / Higgsfield Cinema Studio. ChatGPT GPT-5.6 Sol acts only as the external orchestrator: it reads and maintains this prompt pack, selects the approved Higgsfield operation, submits prompts/references through the Higgsfield MCP plugin, tracks results/credits and stops at the defined manual gates. ChatGPT-native image generation, ChatGPT-native audio generation and any non-Higgsfield video generator are forbidden for this project unless the user explicitly overrides this rule in a later message. Historical Google Flow / Nano Banana / Gemini Omni Flash work is pre-production validation only; it is not the production-generation path.

**AUTOMATION BASELINE / NO MANUAL COMPENSATION — NON-NEGOTIABLE:** this project evaluates whether the official Higgsfield MCP plugin exposes enough control for an external AI orchestrator to operate the production end-to-end. The creator is NOT expected to learn or operate Cinema Studio merely to compensate for MCP endpoints that Higgsfield has not exposed. If a required project-administration action cannot be performed through the current MCP surface, record it as a **HIGGSFIELD MCP TECHNICAL LIMITATION**, stop that dependent automation path, and report the missing capability precisely. Do not silently transfer the missing operation to the human as routine labor. A manual UI workaround may be used only if the user explicitly chooses it after the limitation is disclosed, and that workaround must be counted as a human intervention / automation exception rather than presented as autonomous execution. This evaluation principle applies independently of the Film Gala; it is a baseline expectation for any end-to-end AI production workflow.

### OPERATOR NOTES — LOCKED SYSTEM — DO NOT COPY
- WORLD asset = exactly **one 16:9 widescreen canvas containing a 3×3 grid of 9 equal photographic cells**. Because the 16:9 canvas is divided equally into 3 columns and 3 rows, **each cell is also 16:9**, never square.
- WORLD image = **0 px outer margin**, image content touches all four canvas edges, only 1–2 px internal gutters.
- WORLD image = no title bar, no caption band, no legend, no decorative frame, no layout text. **In-world English/Hungarian signage is allowed and required.**
- MAP asset = **separate generation**; simple block-model production plan, not photorealistic, not Google Maps 3D, no legend/captions.
- CHARACTER asset = one image, 3 vertical panels: full-body front + full-body back + frontal headshot; seamless mid-grey studio background; no title/frame. CHARACTER 01–31 form the canonical main + memory identity library. A character sheet must exist before any MEMORY WORLD that uses it; under the EARLY V01 LIVE-TEST priority, generate only the Block-01-required character subset first, then complete the remaining character library after the first production video block has been tested.
- STORYBOARD asset = exactly **one 16:9 final canvas containing a 3×3 grid of 9 equal numbered cinematic frames**. Each individual frame is composed and cropped as a true **16:9 cinematic frame**; never square. 0 px outer margin.
- Physical present = **one uninterrupted exterior pedestrian walk** through the same impossible London–Budapest metropolis.
- The protagonist never physically enters the remembered office, shared house, police station, lawyer room, courtroom, foreign trip, or clinical room during the dream-city walk. Those are **literal memory events inside real reflective / transparent surfaces**.
- Dedicated **MEMORY WORLD references** are generated as clean visual source banks of the remembered places/events themselves. They are NOT windows and contain no present-city reflection layer. MAIN WORLD sheets establish the physical London–Budapest city and its real glass/wet surfaces; STORYBOARD / VIDEO generation then places the relevant MEMORY WORLD scene inside those existing surfaces.
- **LIVING MEMORY FRAGMENT LOCK:** although each MEMORY WORLD is a static reference sheet, the memory as seen in the FINISHED VIDEO is a short living moving fragment inside the reflective/transparent surface: natural micro-action, body movement, facial response, object motion and environmental motion continue for the brief duration of the memory. Never treat the supplied MEMORY WORLD still as a frozen photograph, poster or static projection inside the glass.
- **SEPARATE MEMORY-VIDEO OVERLAY NOTE — CONSIDERED, NOT THE CANONICAL PATH:** production considered generating every reflected memory as its own separate video clip and then placing that moving clip into the reflective surface. That would multiply paid video generations, push the 3000-credit ceiling toward/over failure, and create another assembly/compositing dependency. Therefore the canonical production path is to animate the selected MEMORY WORLD content natively inside the MAIN Seedance video/extension pass using the still reference bank. A separately pre-generated memory-video overlay is a MANUAL FALLBACK only and may not be created unless the user explicitly authorizes that exact extra-cost path after a credit preflight.
- London supplies recognizable street geometry. Budapest/Hungary is not generic “Central Europe”: **explicit recognizable Pest/Budapest anchors, Hungarian signage and transport must remain visible.**
- The city is normal to everyone inside it. No fantasy glow, no dream filter, no cyberpunk.
- Memories are not chronological. **Memory edits without asking permission. Global route. Local encounter.**
- **STORY-PRESERVATION LOCK:** a memory that has been deliberately placed in a MEMORY WORLD, character library, story bible addendum, or prior canonical storyboard must NOT silently disappear from the finished film during prompt cleanup. If it is not a dominant 3×3 keyframe, preserve it as a brief secondary reflection/micro-flash unless the user explicitly approves dropping it.
- **NO SILENT SIMPLIFICATION:** prompt shortening may change wording, never narrative inventory. Human encounters, black humour, awkwardness, kindness, travel thresholds and system/person contrasts are story content, not expendable decoration.
- Score cards are not part of WORLD assets. They are added only in STORYBOARD / video generation, always anchored ABOVE each person's head with a visible gap from the hairline; baseline cards remain normally and clearly visible in a restrained translucent state; direct gaze only gives the viewed person's existing card a slightly fuller internal light/fill temporarily, never a dramatic flare.
- Clinical imagery appears only in the final block, immediately before the hard cut.
- Final runtime target = **3:20**: six ~30 s blocks + final ~20 s block.
- Final title = **MYSCOUTEE / THE PATH BETWEEN PEOPLE**.
- **NARRATION–SYSTEM-TIME SYNC LOCK:** Blocks 05–06 voice the abstract structural echoes already present in their storyboard/video beats: a refused request for relief, two unequal people reaching toward the same distant review door, institutional speed contrasted with personal delay, and an empty chair high in the system. These are universal system/person images, not references to a named contemporary event or office.
- **GALA ABSTRACTION LOCK:** The film keeps the autobiographical STRUCTURE while removing contemporary real-world identifiers. Do not show or name real officeholders, parties, named high-state bodies, named international review bodies, named tax regimes or identifiable current public events. London and Budapest remain the dream-city geography, not a claim about current public affairs. Preserve every underlying human beat by translating it into fictional, universal institutional imagery rather than deleting it.
- **CARDBOARD-ASYLUM EXCEPTION — STORY PRESERVATION:** The anonymous ridiculous-hat cardboard public figure and asylum-request black-humour beat remain because they are fictional and non-identifiable. Remove real names, likenesses, party or campaign branding and contemporary-office identifiers — do NOT replace the asylum joke with a different generic escape joke.
- **AI-SURVIVAL NARRATION LOCK:** the film must explicitly acknowledge in the OFF-SCREEN narration that AI helped the protagonist hold the fragmented story together and, at times, simply keep going. This is a human/structural acknowledgement, not a technology advertisement. Because the visual memory field is already intentionally dense, this acknowledgement is **NARRATION ONLY**: do NOT add a new AI screen, chatbot UI, laptop micro-flash, logo, product shot or separate AI memory image merely to illustrate the line.
- **SCORE-CARD POSITION + GAZE LOCK:** every score card belongs **ABOVE the viewed person's head**, centered over the crown with visible air between card and hair. Never place a card on the forehead, across the eyes/face, inside the head, on the torso, beside the body or floating elsewhere without a person anchor. Cards remain normally and clearly visible at a restrained translucent baseline even when nobody is looking. When one person directly looks at another, the VIEWED person's above-head card briefly gains a slightly fuller internal light/fill and becomes only a little easier to read, then eases back to the same normal baseline. No flare and no dramatic brightness jump.
- **NORMAL-BASELINE / GAZE-FILL INTERPRETATION:** `normal` means the card is visibly and continuously present without being ghosted away or reduced to near-invisibility. The gaze response is not a reveal: it is only a modest increase in internal fill/light, like the same translucent card becoming slightly more luminous and full for a moment. Position, size and basic opacity stay stable.
- **MCP / HIGGSFIELD HANDOFF LOCK:** if another AI continues this project and the user explicitly grants Higgsfield MCP plugin permission, its FIRST external action is to search the connected Higgsfield workspace/project/history/media for the existing Cinema Studio project named **`AI Film Festival`**, which is the canonical Higgsfield container for the MyScoutee film, and for already-generated canonical assets. Reuse matching valid assets and generations only when they were created for this Entry inside the current Festival Generation Window and remain eligible under the Official Rules. Do not silently start a fresh Higgsfield project, duplicate the project, or regenerate an existing canonical asset before that search is complete. If the exact `AI Film Festival` project cannot be found, report that fact and STOP; creating any replacement project requires fresh explicit user authorization.
- **TARGET HIGGSFIELD PROJECT ROUTING LOCK — NON-NEGOTIABLE:** every generated production image, narration/audio asset, video generation, accepted extension and festival meta asset used for the Entry must ultimately be retained in the existing Higgsfield Cinema Studio project **`AI Film Festival`**. A Higgsfield generation may exist elsewhere in Cinema Studio before it is associated with the project; do not regenerate it merely because MCP cannot perform that association. If the current MCP surface cannot move/attach the same existing Higgsfield generation into the project, record that as a **Higgsfield MCP technical limitation**. The missing MCP action is an automation gap, not an automatic asset-disqualification rule.
- **HIGGSFIELD ASSET-ID / REFERENCE-REGISTRY LOCK — NON-NEGOTIABLE:** every accepted generated asset must be recorded immediately in a canonical ASSET REGISTRY before any later prompt depends on it. Capture the exact Higgsfield generation/job UUID returned by the Higgsfield MCP plugin, plus any returned media UUID / result URL and the logical canonical asset name. Never rely on filename, prose such as “the previous image”, generation order, or visual memory alone to identify a reference. The minimum registry fields are: `logical_asset_id`, `canonical_filename`, `asset_type`, `higgsfield_project=AI Film Festival`, `generation_job_id`, `media_id_or_result_url_if_available`, `reference_element_name_if_created`, `reference_element_id_if_created`, and `status` (`GENERATED`, `ACCEPTED_CANONICAL`, `PROJECT_ASSOCIATION_UNVERIFIED`, `REJECTED`). A reference may be used downstream only after the correct generation ID is known and the asset is accepted; if project association is required but unverified, do not mark it ready for production dependency use.
- **REFERENCE BINDING RULE — ID FIRST:** when a Higgsfield model accepts reference media, pass the exact completed Higgsfield generation/job UUID or confirmed media UUID through the MCP `medias` input with the correct role. Human-readable filenames and pack aliases remain operator labels only. In Cinema Studio UI workflows, bind the actual uploaded/selected asset and use the actual `@token` shown by Higgsfield; never invent an `@token` from a filename.
- **REFERENCE ELEMENT RULE — IMPORT-FIRST / NO DUPLICATES:** if Cinema Studio **Import Elements** has already created a named metadata-only Character, Location or Prop Element, that existing Element is the canonical container for the later rendered reference image. After the matching canonical image is generated and accepted, attach/bind that exact render to the existing imported Element; **do not create a second Element for the same character/location/prop.** Store the existing `element_name` + exact `element_id` and the generated image job/media ID in the ASSET REGISTRY. If MCP cannot attach media to an existing Element, record that missing update/attach operation as an MCP automation gap; the Cinema Studio UI's `Add element image` action is the observed manual equivalent. MCP prompts use `<<<element_id>>>` only for models documented as supporting Reference Elements; otherwise use the direct accepted generation/media UUID.
- **EXTERNAL-SUPERCOMPUTER EXECUTION CONTRACT:** this prompt pack is intentionally written so an external AI agent with explicit Higgsfield MCP/app permission can run the production from start to finish. The intended orchestration setup for this production is **ChatGPT GPT-5.6 Sol, Pro 5×, high-reasoning configuration**, acting as an external supercomputer rather than as a manual copy/paste assistant. The agent must execute the canonical dependency graph, maintain the credit ledger, create/recover assets, generate narration and video, inspect outputs against the acceptance locks and continue autonomously between the explicit MANUAL GATES defined below. Human intervention is intentionally limited to those gates and explicit keep/stop/fallback approvals. The agent is not allowed to redesign the workflow, simplify the story, switch models, add an editor, or activate a fallback merely because another route looks easier.
- **SINGLE-OUTPUT-PER-ASSET LOCK — NON-NEGOTIABLE:** every canonical production asset is generated exactly ONCE per authorized attempt and must request exactly ONE output. For Higgsfield MCP plugin calls, set `count=1` for image/video generations and audio generation; where a backend exposes `batch_size`, `num_outputs`, `samples`, `variations`, candidates or equivalent controls, set the effective value to **1**. Never request 2/4/8 alternate images, videos, narrations or seed variations for the same asset. Never run a seed sweep or parallel candidate takes for selection. A 3×3 WORLD / MEMORY WORLD / STORYBOARD is still ONE generated image containing nine planned cells, not nine alternate generations. Batch submission is permitted only as transport/scheduling for DIFFERENT canonical assets, with exactly one job/output per distinct asset; do not place the same asset into a batch more than once. If a model/UI would force multiple paid outputs, STOP and ask the user rather than spending credits. Any second attempt at the same asset is a RETRY and therefore requires the existing explicit manual retry authorization gate.
- **HIGGSFIELD-NATIVE-ONLY / NO EXTERNAL VIDEO EDITOR LOCK:** the final film must demonstrate what Higgsfield can actually deliver without an external NLE rescuing continuity. Do not use DaVinci Resolve, Premiere, After Effects, ffmpeg, external crossfades, external frame interpolation, external audio repair, external concatenation or any other outside video editor to hide seams or repair generated footage. Normal file transfer/storage is allowed; creative or technical seam repair outside Higgsfield is not. If the native Higgsfield path cannot deliver a usable continuous master, STOP and report that limitation rather than silently fixing it elsewhere.
- **NATIVE FORWARD-EXTENSION CONTINUITY LOCK:** `V01_CITY_JUDGES_FIRST.mp4` is the only independently generated opening block. Blocks 02–07 must use Seedance 2.5 `video_extension` with `extension_mode=forward` from the immediately preceding accepted canonical video/chain, while also supplying the new block's exact image references and locked narration audio reference when the current Higgsfield interface/backend accepts them. The purpose is to preserve the previous last frame, camera velocity, protagonist stride, weather, lighting, crowd flow, ambience, foley texture and restrained score across each 30-second boundary. Do not revert to seven unrelated standalone generations during normal execution.
- **MANUAL FALLBACK AUTHORIZATION LOCK — NON-NEGOTIABLE:** Seedance 2.5, the locked native-resolution plan, the seven full narration files and the native forward-extension chain are the active production path. Every deviation is CONTINGENCY DOCUMENTATION ONLY until the user explicitly authorizes that exact fallback after being told the trigger, expected credit cost and continuity/story impact. This includes: changing video model, changing final resolution, abandoning the native extension chain, using a Higgsfield-native rough-cut/Canvas assembly instead of a cumulative extension result, splitting a block into subclips, regenerating narration with changed `speech_rate`, creating PART A/B/C narration files, separate music generation, region/video editing, creating a replacement Higgsfield project, or any paid retry/regeneration after a failed take. Another AI must NEVER interpret a general instruction such as “finish the film”, “continue”, or prior MCP permission as permission to activate a fallback. When a fallback condition appears, STOP, report it, propose the smallest option, and wait for the user. Do not research, compare or test alternate video models unless the user explicitly asks for that comparison in a later turn.
- **EARLY V01 LIVE-TEST PRIORITY:** discover as early as possible whether the full production video pipeline actually works by generating **CINEMA BLOCK 01 / `V01_CITY_JUDGES_FIRST.mp4`** before bulk-producing the rest of the film. This is NOT a disposable proxy. Generate it at the intended final production settings (30 s, 16:9, 1080p only after the mandatory full-film cost preflight confirms the projected all-in production remains within the 3000-credit hard ceiling, locked narration audio reference, full Block-01 reference stack, audio generation on). If the first technically usable take preserves the mandatory story, identity, narration and physical-present logic, it becomes the canonical first 30 seconds of the final film and must NOT be discarded merely because it began as the live test. After V01 is accepted, fast-track Block 02 and test the first native forward extension before bulk-producing the rest; V01 alone cannot validate seam continuity.

### OPERATOR NOTES — HIGGSFIELD MCP SINGLE-OUTPUT PARAMETER CONTRACT — DO NOT COPY

For every production generation through the **Higgsfield MCP plugin**:
- IMAGE: `count=1`; if exposed, `batch_size=1`; one canonical result only.
- VIDEO: `count=1`; one canonical take/extension only.
- AUDIO/NARRATION: `count=1`; one canonical narration result only.
- Do not request multiple candidates, variations, seeds or samples for the same prompt/asset.
- A batch tool may group DIFFERENT assets for efficiency only when every request is a distinct canonical asset and each request creates exactly one output.
- If the same canonical asset appears twice in one batch/request set, that is an error: STOP before submission.
- Any second generation of an already-attempted asset is a retry and requires the explicit MANUAL FALLBACK / RETRY authorization already defined in this pack.
- Cost preflight must assume one output only. If Higgsfield reports a cost corresponding to multiple outputs, do not submit.

### OPERATOR NOTES — HUMAN-READABLE PROJECT STRUCTURE / PUBLIC AUDITABILITY — DO NOT COPY

**PUBLIC READABILITY PRINCIPLE — NON-NEGOTIABLE:** the Higgsfield Festival project is expected to become publicly inspectable. Machine UUIDs are necessary for deterministic MCP binding, but they are NOT a usable public production language. Every canonical asset therefore has TWO identities:

1. **Human identity:** a short logical asset ID plus a descriptive public display name and contextual collection/subfolder. This is what a human reviewer should understand.
2. **Machine identity:** exact Higgsfield generation/job UUID, media UUID/URL, and optional Element UUID. These live in the ASSET REGISTRY and are used by the orchestrator for exact binding.

Never expose a project as an undifferentiated wall of UUIDs or generic auto-generated filenames when the Cinema Studio UI permits readable naming/organization. UUIDs support the workflow; they do not replace production semantics.

**CANONICAL PUBLIC DISPLAY-NAME PATTERN:**
- Character: `C01 — Protagonist — Character Sheet`
- Main world: `W01 — City Judges First — Soho / Piccadilly / Leicester`
- Memory world: `MW01 — London Social — Memory World`
- Memory pack: `MWP01 — Routes / Rooms / Documents — Memory Pack`
- Storyboard: `SB01 — City Judges First — Storyboard`
- Narration: `A01 — City Judges First — Narration`
- Video block: `V01 — City Judges First — Opening 30s`
- Final delivery: `FINAL — MyScoutee — Watermarked Festival Master`

The compact canonical filename remains useful for dependency mapping, but when Cinema Studio exposes a display-name/title field, use the human-readable display name above or the corresponding exact descriptive name for that asset.

**CONTEXTUAL COLLECTION / SUBFOLDER TAXONOMY — CREATE INSIDE `AI Film Festival`:**

```text
00 — PROJECT / META
    Project Brief
    Poster / Cover
    Submission / Social / Watermark / Packshot

01 — CHARACTERS
    01A — Core / Recurring
    01B — London Social / House / Dance
    01C — Global Routes / Travel
    01D — Work / Admin
    01E — Police / Legal / Institutional
    01F — Final Clinical

02 — PRESENT CITY / MAIN WORLDS
    W01 — Soho / Piccadilly / Leicester
    W02 — Charing Cross / Strand / Aldwych / Embankment
    W03 — Kingsway / Holborn / Work City
    W04 — Fleet Street / Temple / Formal City
    W05 — Blackfriars / Thames / South Bank
    W06 — Waterloo / London Eye / Westminster Approach
    W07 — Westminster / Whitehall / Threshold

03 — MEMORY WORLDS
    03A — London Social / Shared Lives
    03B — Global Routes / Travel Encounters
    03C — Work / Admin / Documents
    03D — Police / Court / Institutional
    03E — Human Microflashes / Crescendo
    03F — Hidden Clinical Reality

04 — MEMORY PACKS / TECHNICAL REFERENCES

05 — STORYBOARDS
    SB01 through SB07

06 — AUDIO / NARRATION
    A01 through A07
    Approved native audio references only

07 — VIDEO / CANONICAL CHAIN
    V01 through V07 / accepted native extension chain

08 — FINAL DELIVERY / FESTIVAL
    Final master
    Official watermark + packshot version
    Social-publication record
    Submission metadata
```

Do not create meaningless folders merely to reduce item count. Context takes priority over an arbitrary maximum. If Cinema Studio supports nested subfolders, use the structure above; if only one collection level is available, flatten each leaf into a readable collection such as `01E — Characters — Police / Legal / Institutional`.

**IMPORT ELEMENTS GROUPING HINT — MACHINE-READABLE:**
When Cinema Studio **Import Elements** parses this Markdown, apply the existing Scene and Category grouping and, **if collection/grouping paths are supported by the importer**, apply the following `collection_path` to the element extracted from the matching source heading. **Do not create duplicate elements from this metadata block.**

- `CHARACTER 01` → `01 — CHARACTERS / 01A — Core / Recurring`
- `CHARACTER 02`, `CHARACTER 06–10` → `01 — CHARACTERS / 01B — London Social / House / Dance`
- `CHARACTER 11–21` → `01 — CHARACTERS / 01C — Global Routes / Travel`
- `CHARACTER 22–24` → `01 — CHARACTERS / 01D — Work / Admin`
- `CHARACTER 03–04`, `CHARACTER 25–31` → `01 — CHARACTERS / 01E — Police / Legal / Institutional`
- `CHARACTER 05` → `01 — CHARACTERS / 01F — Final Clinical`
- `WORLD 01–07` → matching leaf under `02 — PRESENT CITY / MAIN WORLDS`
- `MEMORY WORLD 01–06` → matching story-context leaf under `03 — MEMORY WORLDS`
- `HIDDEN REALITY WORLD 07` → `03 — MEMORY WORLDS / 03F — Hidden Clinical Reality`
- `MEMORY PRESERVATION WORLD P01–P02` → `04 — MEMORY PACKS / TECHNICAL REFERENCES`
- `SCORE CARDS` / score-card prop → `04 — MEMORY PACKS / TECHNICAL REFERENCES / Scorecards`
- `STORYBOARD 01–07` → `05 — STORYBOARDS`
- `NARRATION 01–07` → `06 — AUDIO / NARRATION`
- `CINEMA BLOCK 01–07` → `07 — VIDEO / CANONICAL CHAIN`
- final master / watermark / packshot / submission assets → `08 — FINAL DELIVERY / FESTIVAL`

This grouping metadata is an importer test as well as organization metadata. If Import Elements ignores `collection_path`, preserve the extracted Elements and record collection creation as an unsupported importer/MCP capability.

**ASSET REGISTRY HUMAN FIELDS — REQUIRED:** in addition to the machine IDs already required, every registry entry must contain:
- `public_display_name`
- `collection_path`
- `story_context` (one short human sentence)
- `project_ui_status` (`NOT_ADDED`, `ADDED_TO_PROJECT`, `PLACED_IN_COLLECTION`, `UI_VERIFIED`)

The registry is the bridge between public human organization and machine-precise MCP references.

### OPERATOR NOTES — HIGGSFIELD MCP AUTOMATION LIMITATIONS / MANUAL UI BOUNDARY — DO NOT COPY

This section records the **actual automation boundary observed in the current Higgsfield MCP plugin**, so a future agent does not pretend a capability exists or silently shift missing product functionality to the user. Re-check the live MCP surface before production because capabilities may improve. If a listed limitation becomes automatable later, automate it and record that change. The baseline is not Festival-specific: an end-to-end AI production interface should expose the project-state operations needed to complete its own workflow without requiring the human to become the missing API layer.

**CURRENTLY AUTOMATABLE THROUGH THE HIGGSFIELD MCP PLUGIN:**
- generate Higgsfield images, videos and narration/audio;
- force single-output generation (`count=1`, equivalent controls = 1);
- preflight generation credit cost where the exposed model tool supports it;
- receive exact generation/job UUIDs and result URLs;
- reuse completed Higgsfield generation/media UUIDs as downstream references when the selected model supports those media roles;
- browse relevant Higgsfield generation/media history exposed by the plugin;
- create and reuse Higgsfield Reference Elements for supported image/video workflows;
- list Cinema Studio-imported Elements and address their completed Element UUIDs in supported generation preflight/generation prompts;
- inspect current model capabilities/parameters and available workspaces exposed by MCP.

**NOT CURRENTLY EXPOSED AS RELIABLE MCP WRITE ACTIONS:**
- writing or updating the Cinema Studio **Project Brief** field;
- creating, renaming or moving Cinema Studio **collections/subfolders**;
- reading the Cinema Studio Import Elements **Scene grouping** through the current MCP Element object, or writing Element collection/grouping paths through MCP;
- assigning/attaching/moving a global MCP generation into the exact Cinema Studio Festival project `AI Film Festival`;
- setting the human-readable Cinema Studio asset display name when the generation tool itself exposes only the generated job;
- publishing the Festival project / Create-in-Public state;
- applying or verifying the Festival submission UI's final project-level watermark/packshot workflow;
- performing the mandatory external social-media publication and returning that public URL to the Festival submission UI;
- final Festival submission/confirmation unless a future MCP action explicitly exposes it.

**NO DEFAULT MANUAL CINEMA STUDIO COMPENSATION:**
The intended production path does **not** require the creator to perform missing Cinema Studio administration actions by hand. For every missing MCP operation, the orchestrator records: `required_action`, `expected_project_state`, `missing_MCP_capability`, `affected_asset_or_stage`, and `automation_status=BLOCKED_BY_MCP_LIMITATION`.

A one-off Cinema Studio UI experiment may be performed only when the user explicitly chooses to diagnose Higgsfield behavior (for example, testing whether a global Higgsfield generation can be associated with `AI Film Festival`). Such a diagnostic is evidence collection, not the normal production workflow. It does not convert a missing MCP endpoint into a human responsibility.

If the user explicitly authorizes a manual workaround for a particular blocked action, record it as `MANUAL_EXCEPTION_AUTHORIZED`, perform only the minimum semantic operation necessary, and keep it visible in the final automation report. Never describe that stage as autonomous. If the user does not authorize a workaround, leave the stage blocked and report the platform limitation rather than teaching the user Cinema Studio as a substitute for an incomplete MCP interface.

Do **not** invent button labels that are not visible in the current UI, and do not regenerate an asset merely to work around project administration.

**FESTIVAL-COMPLIANCE PRECEDENCE:** the current Official Rules require all used AI video/image generations to be made on Higgsfield during the Generation Window and the underlying used assets/generations to be retained in the dedicated submission project for audit. If an eligible Higgsfield generation currently sits elsewhere in Cinema Studio, retain/associate that same generation with `AI Film Festival` rather than regenerating it. If MCP does not expose that project-state operation, record the missing capability as an MCP automation gap; the MCP limitation itself does not make the Higgsfield generation ineligible.

### PROJECT-ASSOCIATION PROOF GATE — BEFORE ANY FURTHER BULK PAID PRODUCTION

Before spending on the wider asset library, characterize the project-routing capability using **one already-created in-window Higgsfield asset**. This is an optional diagnostic of the Higgsfield product boundary, not a requirement that the creator adopt Cinema Studio as a manual production tool. Use the current W01 generation if it is the intended canonical WORLD 01 candidate. If the user explicitly elects the diagnostic, inspect the `AI Film Festival` Cinema Studio UI:

1. associate/add that exact existing Higgsfield generation to the project without regenerating it;
2. set or preserve the readable name `W01 — City Judges First — Soho / Piccadilly / Leicester` where the UI supports naming;
3. place it under `02 — PRESENT CITY / MAIN WORLDS / W01 — Soho / Piccadilly / Leicester`;
4. verify that the project retains the asset/generation in `All assets` / project history and that the generation can still be identified by the same registry UUID;
5. mark `project_ui_status: UI_VERIFIED`.

Whether this succeeds or fails, record the result as part of the Higgsfield automation evaluation. If the MCP itself cannot perform the same project-routing operation, that remains an MCP coverage limitation even when the UI can do it manually. Do not turn a successful UI diagnostic into a recurring human production duty without explicit user authorization.

### OPERATOR NOTES — GENERATION ORDER / EARLY V01 LIVE-TEST — DO NOT COPY

**THIS PRIORITY OVERRIDES THE OLD “BUILD THE ENTIRE LIBRARY FIRST” ORDER.** The first goal is to reach one real, final-quality 30-second video generation as early as possible without making a disposable test asset.

#### FAST-TRACK GATE — BUILD ONLY WHAT CINEMA BLOCK 01 NEEDS

If Higgsfield MCP plugin permission is available, **search the existing Higgsfield Cinema Studio project `AI Film Festival` / workspace / history / media first** and reuse any already-valid canonical assets below only if they were newly generated for this Entry within the current Festival Generation Window and can be retained in `AI Film Festival` for audit. Generate only what is missing. A global `My generations` item is not presumed to be project-attached; verify project association before treating it as a canonical Festival asset.

1. Generate / recover the Block-01 character subset first: `C01`, `C02`, `C06`, `C07`, `C08`, `C09`, plus `C10` because `MW01_LONDON_SOCIAL.png` uses that identity in its complete preservation sheet.
2. Generate / recover `W01_MAIN_WORLD.png`. It has no default image-reference dependency and can be produced in parallel with the Block-01 character subset.
3. Generate / recover `A01_NARRATION.wav` as early as possible using the locked narrator voice. Do not wait for A02–A07.
4. Generate `MW01_LONDON_SOCIAL.png` from its complete listed character references. Do not prune its non-Block-01 cells merely to accelerate the test.
5. Generate `MWP01_ROUTES_ROOMS_DOCUMENTS.png` from `C01_PROTAGONIST.png`. Preserve its complete 3×3 inventory; Block 01 will use only the assigned micro-flashes.
6. Generate `SB01_STORYBOARD.png` from the exact Block-01 references listed in PHASE E.
7. **Immediately generate `V01_CITY_JUDGES_FIRST.mp4`** in Higgsfield Cinema Studio / Seedance 2.5 at approximately 30 s, 16:9, **1080p final-production quality only after the 3000-credit full-film budget preflight passes**, audio generation ON, with `A01_NARRATION.wav` as the authoritative audio reference and the full exact Block-01 image-reference stack.
8. Apply the FIRST-PASS acceptance rule. If V01 is technically usable and story-preserving, **KEEP IT AS THE FINAL FILM'S FIRST 30 SECONDS**. Do not regenerate it later simply because the rest of the asset library was generated afterward.
9. If V01 has a catastrophic failure, identify the smallest cause, report the exact proposed repair/regeneration and its estimated credit impact, then STOP for explicit user approval. Only after approval may the affected upstream asset or V01 itself be regenerated and the gate repeated. Do not abandon the entire pipeline and do not reroll for cosmetic perfection.

**Do not generate MAP 01 before this gate unless route troubleshooting specifically requires it. Maps are not allowed to delay the first production video test.**

### OPERATOR NOTES — 3000-CREDIT HARD PRODUCTION CEILING — DO NOT COPY

**HARD RULE:** the complete finished film — image generations that are not covered by unlimited allowances, all seven narration files, the seven logical video stages (V01 plus six native forward extensions), any separately generated music, and every catastrophic-failure retry/edit — must remain at or below **3000 Higgsfield credits total**. Never begin a paid generation merely because the current balance is sufficient for that one job. Maintain a running project ledger and preflight the projected cost of the remaining film first.

**CURRENT VERIFIED REFERENCE COSTS (HIGGSFIELD PREFLIGHT, 2026-08-26; re-check before purchase/generation because pricing can change):**
- Seedance 2.5, omni-reference, 30 s, 16:9, 1080p, audio ON = **270 credits**.
- Seedance 2.5, omni-reference, 20 s, 16:9, 1080p, audio ON = **180 credits**.
- Six 30 s blocks + one 20 s block at native 1080p = **1800 credits total video**.
- Current Seed Audio 1.0 preflights for the seven locked narration scripts total approximately **13.8 credits** (A01 1.8, A02 1.8, A03 1.8, A04 2.3, A05 2.2, A06 2.6, A07 1.3). Re-check before generation.
- Therefore the presently verified base 1080p video + narration plan is approximately **1813.8 credits**, before any non-unlimited still-image charges, separate music generation or retries.

**BUDGET ENVELOPE / DEFAULT RESERVE:**
- Base final video + locked narration: target **≤ 1820 credits**.
- Still-image assets: target **0 paid credits whenever the active plan provides an unlimited eligible image window**; otherwise preflight every paid generation (or batch of DISTINCT assets, one output each) and count it against the same 3000-credit ceiling. Unlimited usage is not a reason to generate unnecessary variants.
- Separate music: **do not generate by default.** Seedance already creates the restrained score inside each video pass. Separate music is a MANUAL FALLBACK/creative branch: report the reason and estimated cost, then create it only after the user explicitly authorizes that music path. Reserve **≤ 300 credits** for the entire path unless the user explicitly changes the budget.
- Catastrophic-failure reserve: preserve approximately **700 credits** whenever possible. At current Seedance pricing this is enough for two failed 30 s 1080p blocks plus most/all of one additional affected block. Cosmetic retries are forbidden.
- Keep an additional small safety margin rather than planning exactly to 3000.

**LIVE-TEST DECISION RULE:** V01 is still the earliest real production test, not a disposable proxy. Before generating V01, run a current cost preflight for the locked final Seedance 2.5 / native-resolution plan and calculate the projected ALL-IN remainder. If the verified projection with the above reserve stays below 3000, generate V01 directly at native 1080p and keep a successful take as final. Do **not** spend credits on a separate low-resolution V01 merely to test motion if that test would then be discarded. If current pricing or other required paid assets would push the projected all-in total over 3000, STOP before V01 and report the budget problem to the user. Do not choose, test or apply a cheaper model, lower resolution, split strategy or other production fallback without fresh explicit user authorization.

**VIDEO MODEL LOCK:** Seedance 2.5 is the production model for this canonical pack. Do not search for, compare, stress-test or substitute any alternate video model during normal execution. A model change exists only as a user-initiated future decision outside the active production path; if the user later explicitly asks to reconsider models, evaluate that request then and do not let the existence of alternatives alter current prompt interpretation or continuity.

**RUNNING LEDGER:** after every paid generation, record: asset/job name → model → duration/resolution → actual credits charged → cumulative credits used → protected reserve remaining. Another AI taking over the project must reconstruct this ledger from Higgsfield history before spending additional credits whenever MCP/app permission is available.

#### AFTER V01 PASSES — TEST THE FIRST NATIVE EXTENSION BEFORE BULK PRODUCTION

10. Build/recover only the additional Block-02 dependencies that are still missing: the required Block-02 characters, `W02_MAIN_WORLD.png`, `MW02_GLOBAL_ROUTES.png`, `SB02_STORYBOARD.png` and `A02_NARRATION.wav`; reuse MW01/MWP01 and any already-valid shared assets.
11. Preflight the actual Seedance 2.5 forward-extension job using accepted `V01_CITY_JUDGES_FIRST.mp4` as the source video and the exact Block-02 reference stack. Count the returned cost against the same 3000-credit ledger.
12. **MANUAL GATE — FIRST EXTENSION:** before spending on the first extension, report the actual extension mode/inputs/cost and obtain explicit user approval. Then generate the first forward extension.
13. Inspect the V01→Block-02 boundary specifically for a hard visual reset or obvious audio restart. The seam does not need mathematical frame identity, but it must read as the same uninterrupted walk and the same sonic world without a title-card/new-scene feeling. If the native extension is acceptable, KEEP it. If Higgsfield returns only a continuation segment instead of a cumulative/native continuous result, or if the interface rejects the required reference/audio combination, STOP and report the exact behavior; do not use an external editor and do not silently choose another assembly method.
14. **MANUAL GATE — NATIVE CONTINUITY ACCEPTANCE:** show/report the first extension result and wait once for the user's approval that the native seam strategy is acceptable. After approval, the remaining normal production may proceed autonomously.

#### AFTER THE FIRST EXTENSION PASSES — COMPLETE THE REST

15. Complete the remaining CHARACTER sheets not already generated.
16. Complete MEMORY WORLD 03–06, MEMORY PRESERVATION WORLD P02 and HIDDEN REALITY WORLD 07; preserve already-generated MW01, MW02 and MWP01.
17. Complete WORLD 03–07; preserve W01–W02.
18. Generate MAP 01–07 only as planning/continuity aids when useful; they remain optional for Cinema generation and must not delay production.
19. Complete STORYBOARD 03–07; preserve SB01–SB02.
20. Generate and duration-validate A03–A07 with the same locked narrator voice; preserve A01–A02.
21. Generate logical CINEMA BLOCKS 03–07 in order as **forward extensions of the immediately preceding accepted native chain**, using the same first-pass acceptance rule and a fresh cost preflight before every paid extension. Do not stop for routine approval after every successful block; stop only at the manual fallback/catastrophic-failure/budget gates already defined.

The canonical dependencies and exact attachment lists in PHASE A–G still control each asset. The fast-track changes only **when** assets are generated and how the seven logical blocks are linked natively; it never changes their story content or required references.

The MEMORY WORLD images are generated once and reused. They show the remembered event/place DIRECTLY, as if the camera were physically inside that remembered scene. They contain NO London–Budapest present-city layer, NO window frame from the present, NO rain/reflection composite from the present and NO score cards.

Character-reference capacity is NOT treated as a scarcity constraint. Distinct planned memory participants receive distinct character sheets. Anonymous crowd/background extras may still remain unreferenced where their identity has no narrative continuity value.

### OPERATOR NOTES — STORY-PRESERVATION AUDIT — DO NOT COPY

This v2.2 pass was created because earlier cleanup silently removed or flattened story material. **No existing dominant storyboard beat was deleted in this pass.** The restoration is additive.

**CURRENT-PACK ORPHANS RESTORED INTO THE ACTUAL FILM:**
- DIFFERENT-SNORE / overnight housemate replacement — existed in MW01 and CHARACTER 06 but had fallen out of the actual storyboard/video.
- BARMOUTH low-tide / five-person road-trip group — existed in MW02 + C18–C21 and even survived as an SFX cue, but had no visual beat.
- ANONYMOUS CARDBOARD PUBLIC FIGURE / ridiculous hat / asylum-request black humour — existed in MW05 + C31 and in an earlier storyboard, but had disappeared from the final temporal beats. In the Gala abstraction the joke remains, but no name, real likeness, party or campaign branding or identifiable contemporary office is attached to it.
- SIX PEOPLE AROUND A REAL TABLE — existed in MW06 but had disappeared from the actual late-film humanity sequence.

**STORY-BIBLE / ADDENDUM MICRO-FLASHES RESTORED AFTER BEING LEFT BEHIND DURING REBUILD:**
- workers'-hostel fluorescent corridor / closed door;
- canal-side shared house / reeds / crowded shoes at the entrance;
- rural field/corn-row → travel threshold;
- Trivandrum airport clock;
- rented-car key on a budget-hotel table;
- camel photograph on phone with ordinary security personnel in the background;
- Nile/Aswan hotel room prepared for two but occupied by one;
- health-insurance form with one blank field;
- diploma / missing language credential + later Brexit/work-coverage paper edge;
- late reveal bridge: Nile/water reflection → cold clinical light;
- late reveal bridge: different snore → monitor-like rhythm;
- late reveal bridge: balloon-helping hands → white sheet / restraint edge.

**PART-II PUBLIC-TIME / INSTITUTIONAL REVERSAL MATERIAL RESTORED INTO THE ACTUAL FILM:**
- a refused request for relief followed by revised papers deliberately held for a later institutional opening;
- TWO LETTERS TO ONE DISTANT DOOR: the protagonist's small submission from below and an anonymous senior-institution submission from above reaching the same external review body, with NO causal claim between them;
- a high review chamber unable to assemble a quorum after multiple members step aside, contrasted with one citizen, a laptop and an AI assistant trying to reach review from below;
- the earlier black-humour gesture of declaring an institution “fired” gaining later public-time irony when long-serving office-holders were publicly asked to leave — shown only as an ironic echo, never as prediction or causation;
- the EMPTY CHAIR HIGH IN THE SYSTEM after an office changes occupant, explicitly NOT a verdict in the protagonist's case and NOT presented as an outcome caused by his letter.

These restored details may be short secondary reflections rather than dominant frames, but they are **mandatory story inventory**, not disposable decoration. Future prompt cleanup must not remove them without explicit user approval.

### OPERATOR NOTES — FIRST-PASS ARTISTIC ACCEPTANCE / REGENERATION LOCK — DO NOT COPY

This film is deliberately too large, dense and generatively unstable to use a conventional “regenerate until visually perfect” workflow. **The first completed take that preserves the story and remains technically usable is the intended production take.** Do not discard a valid block merely because generative cinema leaves small irregularities.

**ACCEPT AS PART OF THE FILM — DO NOT REGENERATE FOR THESE ALONE:**
- slightly impossible but readable London–Budapest architectural fusion;
- imperfect reflection geometry, unusual glass layering or physically strange but coherent memory embedding;
- brief continuity softness in anonymous background people, crowd positions, rain, traffic or secondary objects;
- micro-flashes that land a little earlier/later or last a little shorter/longer than imagined while remaining readable;
- minor shape/texture instability, unusual perspective, transient object deformation or dreamlike spatial contradiction that does not destroy the scene;
- a reflection or transition becoming more uncanny than planned when it still supports the film's established “Memory edits without asking permission” language;
- small non-critical differences in camera path, blocking or environmental detail when the ordered story beat is still present.

These are **generative fingerprints, not automatic failures**. The dream city is already intentionally absurd and impossible. Do not “correct” it toward ordinary realism if doing so would flatten the film.

**CATASTROPHIC FAILURE — ONLY ELIGIBLE TO PROPOSE A RETRY:**
1. A mandatory story beat / required human encounter / required black-humour or preservation micro-flash is missing, replaced with unrelated content or made unreadable.
2. The protagonist or a key recurring referenced person becomes materially the wrong identity in a story-critical moment.
3. The locked narration is altered, re-voiced, paraphrased, duplicated, reordered, materially time-damaged or becomes unintelligible.
4. The clinical reality is revealed before Block 07, the final hard-cut logic is broken, or the protagonist is incorrectly shown “waking up.”
5. The core physical-present rule collapses so badly that the current London–Budapest exterior walk is no longer readable as the film's continuous present.
6. The output is technically unusable: corrupted/incomplete render, missing major video/audio section, frozen/blank output, or another defect that prevents normal viewing.

**NO AUTOMATIC RETRIES — MANUAL APPROVAL REQUIRED:** after one completed usable generation, do not automatically run another take in search of cosmetic improvement. If a catastrophic failure is detected, identify and report the exact failure, the smallest proposed retry scope and estimated credit cost, then STOP. Regenerate the affected block or any emergency subclip only after explicit user approval. Never regenerate the whole film because one local detail is imperfect.

**PRIORITY ORDER:** preserve human/story inventory → preserve narration/reveal/continuity → preserve readable world logic → accept artistic generative imperfection → optimize cosmetics last.

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


### CONTINUATION / AGENT HANDOFF — HIGGSFIELD PROJECT RECOVERY — DO NOT COPY

If a different AI/agent takes over this pack later, treat this file as the canonical continuation contract. **When and only when the user explicitly grants Higgsfield MCP plugin permission, first search the connected Higgsfield workspace/project/history/media for the exact existing Cinema Studio project `AI Film Festival` and its canonical MyScoutee assets/generations.** Prefer recovery/reuse over recreation. Do not assume the project is empty, do not create a parallel project by default, and do not regenerate canonical assets merely because they are not present in the local chat. A result in global `My generations` is not sufficient proof that it belongs to the Festival project. If search cannot locate the exact `AI Film Festival` project, or project association cannot be verified, report that result and STOP. A replacement project/workflow may begin only after fresh explicit user approval.

The current Higgsfield MCP plugin surface does not expose every Cinema Studio project-administration write action needed by this workflow. In particular, Project Brief editing, project collection/subfolder management, project assignment/placement of global generations, readable project asset naming, and Festival publication/submission controls may remain UI-only. These are recorded as **platform automation limitations**, not silently reassigned to the creator. The creator is not expected to use Cinema Studio merely to compensate for missing MCP interfaces. If an unavailable action blocks a required state, report it and stop that dependent automation path. A manual workaround is performed only if the user explicitly authorizes that specific exception, and it remains disclosed in the final human-intervention log. If a future MCP surface exposes any of these actions, automate them directly and update the registry.

### OPERATOR NOTES — LIVE MCP / CINEMA STUDIO DIAGNOSTIC — 2026-08-27 — DO NOT COPY

The external GPT-5.6 Sol orchestrator has now performed a real no-generation MCP diagnostic against the connected Higgsfield account/workspace. The Cinema Studio UI visibly contains the existing project `AI Film Festival` and exposes manual UI controls including Upload, Add folder, Edit and Submit. The same account state also reports all credits used / zero available credits, matching the MCP balance result and making a wrong-account explanation less likely.

Observed through the live MCP connection without paid generation:
- workspace/balance read succeeds;
- general-file upload succeeds; the canonical Markdown prompt pack can be uploaded to Higgsfield storage without generation;
- creation of a reusable Reference Element from an already-uploaded image succeeds without generation;
- regular generation history and Reference Elements can be read;
- no MCP action is exposed for enumerating Cinema Studio projects, writing the Project Brief, creating/moving project folders/collections, assigning a global uploaded/generated asset to `AI Film Festival`, setting project-level human display names, or submitting/publishing the Festival project.

This separates two independent questions that must not be conflated:
1. **generation entitlement / credits** — a paid balance may enable paid model generation;
2. **project-state automation coverage** — missing MCP project-management endpoints remain missing unless Higgsfield actually exposes additional actions.

The MCP already performs real read/write operations while the connected account has zero generation credits, so MCP operation itself is not simply disabled by the free/zero-credit state. If the account is upgraded or credits are added later, re-run the MCP capability inventory before the first paid generation and record any endpoint changes. Do not assume that paying for generation automatically adds project-state APIs.

### HIGGSFIELD CINEMA STUDIO PROJECT BRIEF / DESCRIPTION — COPY INTO THE PROJECT FIELD

```text
PROJECT
MYSCOUTEE — THE PATH BETWEEN PEOPLE
Cinema Studio project: AI Film Festival
Runtime: ~3:20 | 16:9 | photorealistic cinematic short
Primary video model: Seedance 2.5
Production ceiling: 3000 Higgsfield credits

PROJECT / FILM
MyScoutee is a real AI-assisted social software project. This film grew from a large real-world source archive that was first synthesized with AI into a two-volume book published on Amazon, then into a canonical production prompt pack, and finally into this Higgsfield-native short. MyScoutee can also be found by searching the name on LinkedIn, YouTube, Instagram and Facebook; no external links are required in this brief.

The film follows one apparently continuous rainy walk through an impossible London–Budapest city. Literal memories appear only inside real reflective or transparent surfaces. The visible protagonist never enters those memories. The final block hard-cuts from the city into an ordinary clinical reality. The tone is human, observational, awkward and sometimes absurd; contemporary political identities are removed while the underlying human structure is preserved.

EXTERNAL GPT-5.6 SOL VALIDATION TEST
Higgsfield currently advertises Supercomputer as **Powered by GPT-5.6 Sol**, as a superagent for the creative stack, and says it can run an entire creative project from one chat. This production independently tests that advertised agentic concept from outside Higgsfield: ChatGPT GPT-5.6 Sol, Pro 5× high reasoning, operates through Higgsfield's official MCP connection and attempts to carry the real production end-to-end — project-state recovery, dependency resolution, asset/reference handling, ID and credit tracking, generation control and the defined human decision gates.

The test is therefore not a comparison of model intelligence. It uses an external GPT-5.6 Sol to validate how much of the end-to-end workflow advertised for Higgsfield's own GPT-5.6 Sol-powered Supercomputer is machine-operable through the interfaces Higgsfield exposes. Live no-generation testing confirmed: Cinema Studio **Import Elements limit = 128 KiB per Markdown file**; the full ~488 KB pack failed, while a ~110.6 KiB split extracted 16 Elements. **Import Elements can create metadata-only Characters, Locations and Props from Markdown; it correctly classified the score-card system as a Prop, while MCP Element creation currently requires media.** Those imported Elements are visible through MCP with `name`, `category` and `description`, but no attached media (`medias=[]`), matching the UI's **Add element image** state. The canonical workflow therefore keeps each imported Element and attaches its later accepted rendered image to that same Element rather than creating a duplicate; MCP currently exposes no equivalent existing-Element media-attach/update action. The full original CHARACTER prompt is not exposed behind the Element. An MCP cost preflight accepted the imported Protagonist Element ID for Nano Banana 2 at **1.5 credits** without submitting a generation. Import Elements also created Scene groupings in the Cinema Studio UI. MCP Element reads do not expose the UI Scene grouping, and no MCP write action is exposed for collection/folder creation.

FESTIVAL CONTEXT
The current Festival rules require AI video and image generation for an Entry to occur on Higgsfield inside its dedicated Cinema Studio submission project during the Generation Window, and require the assets/generations used in the film to remain in that project for verification. The Minimal Viable Submission also requires the final Higgsfield-watermarked + packshot film to be posted from a public account on an accepted social platform and to remain publicly available through the end of the Festival. The planned primary post is the existing public MyScoutee YouTube channel, with Instagram available as an optional mirror. These requirements are treated as real project-state/publication conditions; missing automation remains a measured platform/interface limitation rather than routine hidden manual labor.

PRE-PRODUCTION / PRODUCTION BOUNDARY
Google Flow was used only for no-additional-cost pre-production validation of visual ideas and the 3×3 storyboard/reference method. No Google Flow image or video is used as final Festival production media.

All final production image, narration/audio and video generation is Higgsfield-native. Exactly one output is requested per canonical asset per authorized attempt. The first technically usable story-preserving take is kept. Paid retries or fallback paths require explicit approval. The final film is intentionally produced without an external video editor repairing Higgsfield-native continuity.
```

### FESTIVAL SOCIAL PUBLICATION COPY PACK — MANUAL FINAL STEP / DO NOT POST AUTOMATICALLY

**Primary MVS platform:** YouTube, on the existing public MyScoutee channel. Use the exact final Higgsfield-watermarked + packshot version. Keep the post public through the end of the Festival and use its public URL in the Higgsfield final submission. Instagram may carry the same final version as an optional mirror. LinkedIn/Facebook are supporting discovery channels only for this Festival workflow.

**Suggested YouTube title:**

```text
MYSCOUTEE — THE PATH BETWEEN PEOPLE | Higgsfield Global Film Festival
```

**Suggested YouTube description:**

```text
MYSCOUTEE — THE PATH BETWEEN PEOPLE is a ~3:20 AI short created for the Higgsfield Global Film Festival and produced natively inside Higgsfield.

The project began with a large real-world source archive. AI-assisted synthesis turned that material into a two-volume book published on Amazon in roughly two days; the canonical film prompt pack was then assembled in roughly one additional day. Only a few weeks before this project, the creator had no practical knowledge of AI video generation and had never made a comparable film.

The final production is driven by a ~490 KB / 6,550+ line / ~70,700-word canonical prompt pack and externally orchestrated by ChatGPT GPT-5.6 Sol, Pro 5×, high reasoning. Human intervention is intentionally limited to defined approval gates, budget decisions and keep/stop judgments.

Pre-production validation used Google Flow — Nano Banana 2, Nano Banana Pro and Gemini Omni Flash — only to test visual and workflow ideas. Those external image/video generations are not used as final Festival production footage. All final AI image/video generations used by the Entry are created and retained inside the Higgsfield festival project.

MyScoutee is a real AI-assisted social software product with existing public channels. This film is both a cinematic work and a transparent test of an end-to-end workflow: source documents → book → production prompt pack → Higgsfield-native film.

The creator does not have a suitable local GPU and cannot practically run DaVinci Resolve. Earlier minimal video experiments used Codex-assisted automated edits and crossfades. For this film, no external video editor is used to hide seams or compensate for Higgsfield limitations: the final result intentionally shows what the Higgsfield-native workflow can achieve under a fixed 3000-credit production ceiling.

Created in Higgsfield. Official Higgsfield watermark and packshot retained.
```

**Optional short description for Instagram / LinkedIn / Facebook discovery posts:**

```text
From source documents to a two-volume book, from the book to a ~70,700-word production prompt pack, and from that pack to a film. MYSCOUTEE — THE PATH BETWEEN PEOPLE is an externally orchestrated, Higgsfield-native AI short built with minimal human intervention and no external NLE used to conceal platform limitations. MyScoutee is a real AI-assisted social product; this film documents the path from product and personal archive to cinematic system.
```

### EXTERNAL SUPERCOMPUTER BOOTSTRAP / MANUAL GATES

Once the user explicitly says to start and grants Higgsfield MCP/app permission, the external AI agent should run the project end-to-end without asking for routine confirmations. Stop only at these gates:

1. **PROJECT RECOVERY / ROUTING GATE:** the exact Higgsfield Cinema Studio project `AI Film Festival` cannot be located, project association for existing assets cannot be verified through available interfaces, or the Project Brief cannot be set/read through MCP when that state is required. STOP the dependent autonomous path and log the precise MCP limitation rather than making routine Cinema Studio administration a hidden user requirement. A manual exception requires explicit authorization.
2. **VOICE GATE:** no narrator voice is already locked and the audio tool requires a user voice selection.
3. **V01 SPEND GATE:** Block-01 assets and A01 are ready; report the current all-in 3000-credit preflight and the exact V01 cost, then obtain explicit approval for the first paid 30-second production generation.
4. **V01 ACCEPTANCE GATE:** after V01 finishes, present/report the result and wait for the user's keep/repair decision. A usable first take is the canonical opening.
5. **FIRST EXTENSION SPEND + CONTINUITY GATE:** prepare Block 02, report the first native forward-extension mode/inputs/cost, obtain approval, generate it, then present/report the V01→02 seam once for approval of the native continuity strategy.
6. **FALLBACK / CATASTROPHIC / BUDGET GATE:** any deviation from the canonical Seedance 2.5 native-extension plan, any paid retry/edit, or any projected breach of the 3000-credit ceiling requires a stop and explicit user authorization.
7. **FINAL SOCIAL / SUBMISSION GATE:** after the final Higgsfield film is accepted and the official watermark + packshot version is ready, STOP. The user manually publishes that exact final version on the public MyScoutee YouTube channel (Instagram may be an optional mirror), keeps it public, and returns the public URL for the Higgsfield Festival submission. Do not claim submission is complete until this mandatory public-link step is satisfied.

**OPTIONAL CREATE-IN-PUBLIC / RACE GATE:** if the user explicitly chooses the public Race path before its deadline, the accepted V01 may become the first WIP Cut. Publishing is never automatic; obtain explicit approval before making the project public. The WIP project must also have a poster and the Project Brief above.

After Gate 5 is approved, continue Blocks 03–07 autonomously within the locked budget and first-pass rules, stopping only if Gate 6 is triggered. After the final film is accepted, stop at Gate 7.

The first production milestone remains `V01_CITY_JUDGES_FIRST.mp4`; reach it using the FAST-TRACK GATE above before bulk-generating the rest of the film. An accepted V01 is production footage, not a throwaway test.

## OPERATOR GUIDE — READ ONLY / DO NOT COPY INTO A MODEL

This section is the operating manual for the entire file. **Do not improvise between sections.** Every generation uses exactly ONE prompt code block from this file. The prose around a code block is an instruction to you; **paste only the contents inside the relevant `text` code block into the generation model.**

### ZERO-AMBIGUITY RULE — EVERY ASSET HAS INPUT → PROMPT → OUTPUT

Read every generation in this file as the same three-step pipeline:

**A. INPUT REFERENCES** — only files explicitly listed as `ATTACH` are uploaded as references. If the section says `none`, start from the text prompt only.

**B. COPY/PASTE PROMPT** — paste only the single fenced `text` code block for that asset. Never paste the filename list or this guide.

**C. GENERATED OUTPUT + ID REGISTRATION** — the Higgsfield model creates one new output. Immediately capture the exact Higgsfield generation/job UUID (and media UUID/result URL if returned), record it in the canonical ASSET REGISTRY, then save/label the result with the canonical filename shown in the guide. The filename is a human-readable alias; the generation/media ID is the machine binding used for later MCP references.

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
attach the already-generated W01 + SB01 + MW01 + MWP01 + listed Cxx files **and the locked `A01_NARRATION.wav` audio reference** → bind them as the listed `@references` → paste the Cinema Block 01 video prompt → Seedance generates picture + ambience/foley/SFX/score around the supplied narration.

### HOW TO READ EVERY LINE IN THE OPERATOR GUIDE

`ATTACH: filename.png` = this file must already exist and is an **INPUT**.

`GENERATED OUTPUT: filename.png` = this file does **not** exist yet; the current prompt will create an image/video, and you save that new result under this name.

### CANONICAL ASSET REGISTRY — REQUIRED DURING PRODUCTION

Maintain one live registry entry for every generated asset. Do not infer IDs later from chronology.

```text
logical_asset_id: W01_MAIN_WORLD
public_display_name: W01 — City Judges First — Soho / Piccadilly / Leicester
canonical_filename: W01_MAIN_WORLD.png
asset_type: image/environment
story_context: Present-city reference for the opening 00:00–00:30 block.
collection_path: 02 — PRESENT CITY / MAIN WORLDS / W01 — Soho / Piccadilly / Leicester
higgsfield_project: AI Film Festival
generation_job_id: <exact Higgsfield UUID returned by MCP>
media_id_or_result_url_if_available: <exact returned value or null>
reference_element_name_if_created: <human-readable name or null>
reference_element_id_if_created: <exact Higgsfield element UUID or null>
project_ui_status: NOT_ADDED | ADDED_TO_PROJECT | PLACED_IN_COLLECTION | UI_VERIFIED
status: GENERATED | ACCEPTED_CANONICAL | PROJECT_ASSOCIATION_UNVERIFIED | REJECTED
```

Rules:
- Record the generation/job ID immediately after every Higgsfield job returns.
- Assign the human-readable `public_display_name`, `collection_path` and one-sentence `story_context` at the same time; never leave public meaning to be reconstructed from a UUID later.
- The human-readable name is primary for public inspection and collaboration; the UUID is primary only for deterministic machine binding. Both are required.
- `ACCEPTED_CANONICAL` means this exact generated output is the one downstream assets may reference.
- Never substitute another generation with a similar filename or prompt.
- For MCP reference input, prefer exact accepted generation/media IDs.
- Create a Reference Element only for accepted reusable IMAGE assets and only when the currently selected model explicitly supports Elements.
- If a Reference Element is created, record its exact `element_id`; the readable name alone is never sufficient for MCP binding.
- If project association to `AI Film Festival` cannot be verified where required, mark `PROJECT_ASSOCIATION_UNVERIFIED` and STOP before building dependent bulk assets.

`→ @ALIAS` = only for Cinema Studio/Seedance video generation: after attaching the existing file, bind/mention that uploaded reference with the shown `@` token inside the video prompt.

### PHASE A — CHARACTER LIBRARY

Follow the EARLY V01 LIVE-TEST priority above: generate the Block-01-required character subset first, reach and validate V01, then complete CHARACTER 01 through CHARACTER 31. Do not generate a MEMORY WORLD until every character reference required by that specific MEMORY WORLD exists.

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
**GENERATED OUTPUT:** save/rename the result as `MW03_WORK_RULE_CHANGE_ADMIN.png`.

**MEMORY WORLD 04 — attach:** C01_PROTAGONIST.png, C03_POLICEWOMAN.png, C04_APPOINTED_LAWYER.png, C25_SEARCH_OFFICER_MALE.png, C26_DEFENCE_OFFICE_SUBSTITUTE.png  
**GENERATED OUTPUT:** save/rename the result as `MW04_POLICE_DEFENCE.png`.

**MEMORY WORLD 05 — attach:** C01_PROTAGONIST.png, C04_APPOINTED_LAWYER.png, C27_JUDGE.png, C28_FORENSIC_EXPERT_A.png, C29_FORENSIC_EXPERT_B.png, C30_COURT_CLERK.png, C31_ANONYMOUS_FICTIONAL_POLITICAL_FIGURE.png  
**GENERATED OUTPUT:** save/rename the result as `MW05_COURT_FILE.png`.

**MEMORY WORLD 06 — attach:** C01_PROTAGONIST.png, C02_SOHO_WOMAN.png, C03_POLICEWOMAN.png, C04_APPOINTED_LAWYER.png, C10_BEGINNER_DANCE_WOMAN.png, C11_RUSSIAN_TRANSIT_PASSENGER.png, C16_BALLOON_LOCAL_HELPER_MAN.png, C17_BALLOON_LOCAL_HELPER_WOMAN.png, C27_JUDGE.png, C28_FORENSIC_EXPERT_A.png, C29_FORENSIC_EXPERT_B.png  
**GENERATED OUTPUT:** save/rename the result as `MW06_HUMAN_COUNTERMEMORIES.png`.

**MEMORY PRESERVATION WORLD P01 — attach:** C01_PROTAGONIST.png  
**GENERATED OUTPUT:** save/rename the result as `MWP01_ROUTES_ROOMS_DOCUMENTS.png`.  
This is a deliberate preservation bank for short memories already present in the story-bible/addendum but lost from earlier rebuilt storyboard passes. It does not replace MW01–MW06.

**MEMORY PRESERVATION WORLD P02 — attach:** C01_PROTAGONIST.png  
**GENERATED OUTPUT:** save/rename the result as `MWP02_SYSTEM_TIME_REVERSALS.png`.  
This is a preservation bank for the late Part-II refused-relief / shared-review-door / unanswered-review / empty-chair arc. These cells must remain non-identifying and must never imply that the protagonist's submission caused later institutional outcomes.

**HIDDEN REALITY WORLD 07 — attach:** C01_PROTAGONIST.png, C05_FINAL_NURSE.png  
**GENERATED OUTPUT:** save/rename the result as `HRW07_CLINICAL_REALITY.png`. **Never attach this asset before STORYBOARD / VIDEO block 07.**

Canonical MEMORY filenames:

- MEMORY WORLD 01 → `MW01_LONDON_SOCIAL.png`
- MEMORY WORLD 02 → `MW02_GLOBAL_ROUTES.png`
- MEMORY WORLD 03 → `MW03_WORK_RULE_CHANGE_ADMIN.png`
- MEMORY WORLD 04 → `MW04_POLICE_DEFENCE.png`
- MEMORY WORLD 05 → `MW05_COURT_FILE.png`
- MEMORY WORLD 06 → `MW06_HUMAN_COUNTERMEMORIES.png`
- MEMORY PRESERVATION WORLD P01 → `MWP01_ROUTES_ROOMS_DOCUMENTS.png`
- MEMORY PRESERVATION WORLD P02 → `MWP02_SYSTEM_TIME_REVERSALS.png`
- HIDDEN REALITY WORLD 07 → `HRW07_CLINICAL_REALITY.png`

### PHASE C — MAIN WORLD LIBRARY

Under the EARLY V01 LIVE-TEST priority, generate `W01_MAIN_WORLD.png` as soon as possible; it does not need the MEMORY WORLD library and may be created in parallel with the Block-01 character subset. After V01 passes, complete WORLD 02 through WORLD 07. **Do not attach MEMORY WORLD images to MAIN WORLD generations.** These sheets define only the physical London–Budapest present.

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

**STORYBOARD 01 — attach:** `W01_MAIN_WORLD.png`, `MW01_LONDON_SOCIAL.png`, `MWP01_ROUTES_ROOMS_DOCUMENTS.png`, `C01_PROTAGONIST.png`, `C02_SOHO_WOMAN.png`, `C06_SHARED_HOUSE_SUBSTITUTE_SNORING_HOUSEMATE.png`, `C07_FX_MORTGAGE_HOUSEMATE.png`, `C08_FX_MORTGAGE_SPOUSE.png`, `C09_FX_MORTGAGE_CHILD.png`. **GENERATED OUTPUT:** save/rename the result as `SB01_STORYBOARD.png`.

**STORYBOARD 02 — attach:** `W02_MAIN_WORLD.png`, `MW02_GLOBAL_ROUTES.png`, `MW01_LONDON_SOCIAL.png`, `MWP01_ROUTES_ROOMS_DOCUMENTS.png`, `C01_PROTAGONIST.png`, `C10_BEGINNER_DANCE_WOMAN.png`, `C11_RUSSIAN_TRANSIT_PASSENGER.png`, `C12_AGRA_BUS_WOMAN.png`, `C13_SUDANESE_TRAVELER_MAN.png`, `C14_SUDANESE_TRAVELER_WOMAN.png`, `C15_CAIRO_TAXI_DRIVER.png`, `C16_BALLOON_LOCAL_HELPER_MAN.png`, `C17_BALLOON_LOCAL_HELPER_WOMAN.png`, `C18_BARMOUTH_ROAD_TRIP_DRIVER_COMPANION.png`, `C19_BARMOUTH_ROAD_TRIP_COMPANION_A.png`, `C20_BARMOUTH_ROAD_TRIP_COMPANION_B.png`, `C21_BARMOUTH_ROAD_TRIP_COMPANION_C.png`. **GENERATED OUTPUT:** save/rename the result as `SB02_STORYBOARD.png`.

**STORYBOARD 03 — attach:** `W03_MAIN_WORLD.png`, `MW03_WORK_RULE_CHANGE_ADMIN.png`, `MWP01_ROUTES_ROOMS_DOCUMENTS.png`, `C01_PROTAGONIST.png`, `C22_ACCOUNTANT.png`, `C23_ADMIN_COLLEAGUE_A.png`, `C24_ADMIN_COLLEAGUE_B.png`. **GENERATED OUTPUT:** save/rename the result as `SB03_STORYBOARD.png`.

**STORYBOARD 04 — attach:** `W04_MAIN_WORLD.png`, `MW04_POLICE_DEFENCE.png`, `C01_PROTAGONIST.png`, `C03_POLICEWOMAN.png`, `C04_APPOINTED_LAWYER.png`, `C25_SEARCH_OFFICER_MALE.png`, `C26_DEFENCE_OFFICE_SUBSTITUTE.png`. **GENERATED OUTPUT:** save/rename the result as `SB04_STORYBOARD.png`.

**STORYBOARD 05 — attach:** `W05_MAIN_WORLD.png`, `MW05_COURT_FILE.png`, `MWP02_SYSTEM_TIME_REVERSALS.png`, `C01_PROTAGONIST.png`, `C04_APPOINTED_LAWYER.png`, `C27_JUDGE.png`, `C28_FORENSIC_EXPERT_A.png`, `C29_FORENSIC_EXPERT_B.png`, `C30_COURT_CLERK.png`, `C31_ANONYMOUS_FICTIONAL_POLITICAL_FIGURE.png`. **GENERATED OUTPUT:** save/rename the result as `SB05_STORYBOARD.png`.

**STORYBOARD 06 — attach:** `W06_MAIN_WORLD.png`, `MW06_HUMAN_COUNTERMEMORIES.png`, `MWP02_SYSTEM_TIME_REVERSALS.png`, `C01_PROTAGONIST.png`, `C02_SOHO_WOMAN.png`, `C03_POLICEWOMAN.png`, `C04_APPOINTED_LAWYER.png`, `C10_BEGINNER_DANCE_WOMAN.png`, `C11_RUSSIAN_TRANSIT_PASSENGER.png`, `C16_BALLOON_LOCAL_HELPER_MAN.png`, `C17_BALLOON_LOCAL_HELPER_WOMAN.png`, `C27_JUDGE.png`, `C28_FORENSIC_EXPERT_A.png`, `C29_FORENSIC_EXPERT_B.png`. **GENERATED OUTPUT:** save/rename the result as `SB06_STORYBOARD.png`.

**STORYBOARD 07 — attach:** `W07_MAIN_WORLD.png`, `HRW07_CLINICAL_REALITY.png`, `MWP01_ROUTES_ROOMS_DOCUMENTS.png`, `MW01_LONDON_SOCIAL.png`, `MW02_GLOBAL_ROUTES.png`, `C01_PROTAGONIST.png`, `C05_FINAL_NURSE.png`, `C06_SHARED_HOUSE_SUBSTITUTE_SNORING_HOUSEMATE.png`, `C16_BALLOON_LOCAL_HELPER_MAN.png`, `C17_BALLOON_LOCAL_HELPER_WOMAN.png`. **GENERATED OUTPUT:** save/rename the result as `SB07_STORYBOARD.png`.

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

The narration is generated inside Higgsfield, then supplied to Seedance 2.5 as an **audio reference**. For the EARLY V01 LIVE-TEST, generate and lock `A01_NARRATION.wav` first and use it immediately for V01; A02–A07 may be generated after V01 passes. This is more reliable than asking separate Seedance video generations to invent the narrator voice again.

**IMPORTANT SEPARATION OF JOBS:**
- **Higgsfield Audio / Seed Audio 1.0 = narration only.**
- **Seedance 2.5 = picture + ambience + foley/SFX + restrained score, built around the already-generated narration reference.**
- Do NOT ask the TTS model to generate rain, traffic, music or SFX. The narration file is intentionally clean.

**VOICE LOCK — DO THIS ONCE AND KEEP IT FOR ALL 7 NARRATION FILES:**
1. Open Higgsfield Audio / Text-to-Speech and select **Seed Audio 1.0**.
2. Choose ONE English-speaking adult male voice preset and never change it between blocks.
3. Target delivery: around 40, low-to-mid register, intelligent, restrained, slightly tired, intimate, reflective, fluent English, at most a very light Hungarian/Central-European accent.
4. Avoid trailer-announcer energy, advertising delivery, melodrama, whisper-ASMR and exaggerated sadness.
5. Start every narration with the same speed / pitch / expression settings. Keep voice preset, pitch and expression locked. `speech_rate` adjustment is a manual fallback only: if a take fails the duration gate, report the measured duration and proposed minimal change, then wait for explicit user approval before generating another narration take.
6. Prefer WAV / 48 kHz if the UI offers it.

**NARRATION DURATION ACCEPTANCE GATE — MUST PASS BEFORE CINEMA STUDIO:**
- `A01_NARRATION.wav` through `A06_NARRATION.wav`: accepted duration = **23–27 seconds**.
- `A07_NARRATION.wav`: accepted duration = **15–19 seconds**.
- Measure/check the actual generated WAV duration before accepting the take.
- If a take is inside the gate: ACCEPT it and treat that exact WAV as locked for the block.
- If a take is too long: STOP and report the measured duration plus the proposed small `speech_rate` increase. Regenerate the SAME exact words with the SAME voice preset, pitch and expression only after explicit user approval.
- If a take is too short: STOP and report the measured duration plus the proposed small `speech_rate` decrease. Regenerate the SAME exact words with the SAME voice preset, pitch and expression only after explicit user approval.
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

### PHASE G — HIGGSFIELD CINEMA STUDIO / SEEDANCE 2.5 — NATIVE CONTINUOUS VIDEO + AUDIO GENERATION

The seven named CINEMA BLOCKS are **logical story blocks**, not seven unrelated clips to be stitched later. The final production path is Higgsfield-native:

- **Block 01:** one normal Seedance 2.5 omni-reference generation, 30 s.
- **Blocks 02–07:** Seedance 2.5 `video_extension`, `extension_mode=forward`, each continuing from the immediately preceding accepted canonical video/chain.
- **No external assembly or seam repair.** The native extension boundary itself must carry continuity.

As soon as the exact Block-01 references and `A01_NARRATION.wav` exist, reach the V01 spend gate; do not wait for the rest of the film library. After V01 acceptance, fast-track the Block-02 dependencies and validate the first forward extension before bulk-producing the remaining assets.

#### BLOCK 01 — OPENING GENERATION

1. Select **Seedance 2.5**.
2. Use **omni-reference / reference mode**.
3. Set **30 s, 16:9, 1080p** only after the mandatory all-in 3000-credit preflight passes.
4. Keep audio generation **ON**.
5. Attach exactly the Block-01 image references and `A01_NARRATION.wav` listed below.
6. Paste only the Block-01 fenced prompt.
7. Keep the first technically usable story-preserving result as `V01_CITY_JUDGES_FIRST.mp4`.

#### BLOCKS 02–07 — NATIVE FORWARD EXTENSION

For each later logical block:

1. Select **Seedance 2.5** with `mode=video_extension` and `extension_mode=forward` (or the exact equivalent labels exposed by the current Higgsfield UI/MCP).
2. Supply the immediately preceding accepted canonical video/chain as the **video being extended**. Do not start from a fresh blank generation.
3. Also supply the current block's exact MAIN WORLD / STORYBOARD / MEMORY WORLD / CHARACTER image references and matching `Axx_NARRATION.wav` audio reference when the current Higgsfield extension interface accepts those reference types together.
4. Request the logical added duration: Blocks 02–06 ≈ 30 s each; Block 07 ≈ 20 s.
5. Keep audio generation **ON**. The extension must continue the existing source video's sonic world rather than sounding like a new clip.
6. Paste only the matching block's fenced prompt. The copyable prompts for Blocks 02–07 contain an explicit extension-boundary continuity lock.
7. Before every paid extension, run the current cost preflight with the actual source video and update the 3000-credit ledger. Until real extension pricing is known, use the standalone 1080p block cost as the conservative budget ceiling; never assume extension is cheaper.
8. Accept the first technically usable story-preserving result. Do not regenerate to polish a small native seam.

**CRITICAL EXTENSION ASSUMPTION CHECK:** the desired no-editor master requires Higgsfield's native extension result/project to preserve the already-accepted source and its new continuation as one continuous deliverable or otherwise provide an equivalent native continuous project output. Validate this behavior on the first V01→02 extension. If the current implementation returns only a disconnected continuation segment, strips/replaces the source audio, cannot accept the required new narration/reference stack, or otherwise requires external concatenation, STOP. Report the exact Higgsfield behavior and wait for the user. Do not use DaVinci, Premiere, ffmpeg, crossfades or another external editor. A Higgsfield-native Canvas/rough-cut alternative is a fallback and also requires explicit user approval.

**BOUNDARY CONTINUITY TARGET — VISUAL:** at every extension boundary continue the exact previous end-state as naturally as the model permits: same protagonist identity and stride phase, camera height/lens/heading/velocity, street position and walking direction, rain density, wet reflections, lighting/exposure, nearby crowd/traffic flow and score-card baseline. Do not open a new block with an establishing shot, camera reset, teleport, new weather state, fade, flash or chapter-like visual punctuation. The first moments after the boundary should feel like the previous shot simply kept rolling.

**BOUNDARY CONTINUITY TARGET — AUDIO:** continue the existing rain/traffic/footstep noise floor and restrained score texture without a new intro, downbeat, sting, fade-in, fade-out or chapter reset. The new locked narration belongs inside the continuing sound world. Do not create a second narrator, re-voice the narrator, or restart the score as if a new clip began. Small native generative drift is acceptable; an obvious silence/reset/new-track event is a continuity failure eligible only for a user-approved repair.

**AUDIO PRIORITY IN SEEDANCE:**
1. Preserve the supplied narration reference and its voice/pacing.
2. Preserve/continue the source video's existing ambience and score character across extension boundaries.
3. Add physically plausible synchronized ambience.
4. Add restrained foley/SFX specified in the block prompt.
5. Add only very low-level non-lyrical score where specified, continuing rather than restarting the existing texture.

If Seedance alters, re-voices, duplicates or paraphrases the supplied narration, treat that generation as a catastrophic audio failure. Report the failure and estimated smallest repair cost, then STOP; regenerate/edit only after explicit user approval. Do not accept a different narrator just because the picture is good.

**FIRST-PASS BLOCK ACCEPTANCE:** outside the catastrophic-failure conditions defined in the FIRST-PASS ARTISTIC ACCEPTANCE rule, accept the first completed usable generation/extension. Do not spend credits rerolling for cosmetic polish, slightly strange reflections, imperfect architectural fusion, minor background continuity or a small native seam that still reads as one walk. If a catastrophic failure occurs, report the smallest proposed repair scope and cost and STOP. Any region/video edit, retry, emergency split or alternate native assembly path is a manual fallback.

Reference roles remain fixed:
- **PREVIOUS ACCEPTED VIDEO/CHAIN = continuity anchor for Blocks 02–07**
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

