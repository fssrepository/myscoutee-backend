CURRENT WORKFLOW — 2026-09-10: the creator requested a full clean Element reimport, including characters. Use the [complete restart guide](elements/index/FULL_PROJECT_GUIDE.md) and its 105-entry list. Earlier incremental-import and retained-image instructions below are historical where they conflict. Four images are reported retained; previous @ bindings are not verified for the new import.

# Reference mentions for the whole pack

Prepared expansion: [22 four-state morph sheets](../02_library/morphs/README.md) and [30 memory/clinical coverage pages](../02_library/worlds/memories/README.md), alongside the existing 21 normal-world pages. Morph-image prompts are standalone text-only jobs with no required image inputs or Element mentions. The resulting sheets can later be attached to video. The indexes distinguish output containers, verified video mentions and unrendered prompts. Multiple pages can support one film block; no source-image page is an edit instruction.

The creator has verified that pasting a real Element mention automatically loads its image. The assistant maintains the mapping once in `reference_bindings` in [source_manifest.json](../04_tracking/source_manifest.json), then updates every affected prompt and guide. The creator does not rewrite references file by file.

Complete mentions are verified for C01, C02, C05, C09, C10, C12–C15, C23–C25 and C28–C30. The thirteen newly identified character Elements still have empty image slots; binding their metadata does not make their images available. W01 is correctly associated with its accepted city image and its complete ID has now been supplied as copied text by the creator. T01 is an accepted restaurant image whose complete new Element ID has now been supplied by the creator, preserving uppercase MYS; association of the image with that new Element still needs checking. Other clipped character IDs and the remaining world/memory IDs remain unresolved; future storyboard and audio handles have not been established. The imported Score Cards prop ID is recorded separately in the manifest, with no image attached and no new generation task. Import definitions and filenames do not prove the generated platform IDs.

## Remaining binding work at the point of use

Treat long-ID capture as a separate metadata task when an asset is next needed. If a screenshot clips the identifier, obtain the full copied text from its Element ID field instead of requesting repeated zoomed list screenshots. Accept copied IDs with or without the leading @ and remove Markdown-only underscore escapes. Check the named asset and known prefix, record the ID once, then propagate it to every consumer. This does not add a generation job or change the production count; do not require all remaining IDs before continuing an independent task.

**Before opening a prompt for the creator to copy:** run the existing reference check for that exact file. If it reports missing identifiers, first name the actual person, location or image in chat and obtain the missing reference. Explain what it depicts and where it was last seen; never present an internal UNBOUND key as an Element name the creator should search for. Prioritize inputs blocking the current prompt before unrelated future Elements. After binding and synchronization, check again; only then open the copy-ready prompt in VS Code and give its complete settings. A file already left open from earlier work is not evidence that it is ready.

For the current pilot, T01_IMAGE means the accepted single warm Soho sushi-restaurant still: the protagonist stands by the restroom doors and the Soho woman sits at a table, turning toward him with a small smile (14:39:25 screenshot, MyScoutee / All assets). Its original single-frame prompt has since been expanded into T01_SOHO_RESTAURANT_SOURCE_A/B/C.txt, three separate four-view coverage prompts. Its complete Element ID is now bound as `@loc_MYS_pilot-soho-restaurant-memory_s1_v1`; it is separate from the imported Memory World 01 bank. Keep the accepted image and make sure the corresponding loaded reference shows it.

| Required input | Where the actual identifier must come from | Needed before |
| --- | --- | --- |
| W01 | Existing Location / World 01 — The City Judges First — Soho / Piccadilly / Leicester, v1, Scene 1. Complete copied ID is verified and bound: `@loc_mys_world-01-the-city-judges-first-soho-piccadilly-leicester_s1_v1`. Reuse this binding for the later 4K replacement on the same Element. | Current T01_VIDEO and every later consumer of W01 |
| T01_IMAGE | The creator has supplied `@loc_MYS_pilot-soho-restaurant-memory_s1_v1` for Location / Pilot Soho Restaurant Memory / v1. Do not reimport this Element. Ensure the accepted single restaurant still is attached and saved. See the [association instructions](https://github.com/fssrepository/myscoutee-backend/blob/81ca568c3197f6caa8f8d4522dd58594eb765818/guides/story/london/cinema_studio_steps/01_pilot/README.md). Reuse the image. | Current T01_VIDEO and T01_EXTEND |
| TA01 and A01–A07 | Actual accepted clean speech output, using the platform's supported audio-reference input. Image-Element autoload does not establish that audio mentions work the same way. Verify that input route before paying for speech for it. | Matching extension or film video |
| Other characters, worlds, memories and storyboards | Existing matching Element or actual accepted output's persistent mention. Capture each available ID when that asset is handled; the pack's manifest already lists every consumer. | First dependent prompt, not after its generation |

For every accepted asset, the assistant checks the supplied Element screenshot against the intended image, Category, Name, Version, full ID and visible Description, records the verified mention once, runs the synchronization command below, and checks the next dependent prompt. Visual acceptance and reference readiness are separate: keep accepted media even when its handle is still missing. Do not mark an unresolved prompt copy-ready or make the creator replace tokens manually.

If a media type has no supported persistent mention, identify the actual input mechanism and update every affected prompt consistently before generation. Do not invent an audio or raw-image Element ID to make the local checker pass.

`@UNBOUND_TA01` and similar tokens are deliberately incomplete slots, not usable Higgsfield mentions. A prompt with unresolved slots starts with **REFERENCE SETUP INCOMPLETE**. Do not paste it for generation yet. Once its real mentions are recorded and synchronized, that notice disappears automatically. This checks local binding completeness, not the availability of media or account permissions.

For an existing Element, record its complete displayed ID with one leading `@` in its `mention` field. For raw images, storyboards and narration, record only a persistent media mention actually shown to work in the composer. Do not invent handles, reimport the 48 existing Elements, replace MW01 with the pilot restaurant still, or regenerate an accepted image merely to bind it. T01 now has a supplied complete Location Element ID. Its metadata import is no longer the next action; check the accepted image association when using it.

Assistant command, from the repository root, after updating a binding:

```sh
python3 guides/publication/story/films/higgsfield/the-path-between-people/04_tracking/sync_references.py --write
```

This updates local `.txt`/guide mentions, incomplete-reference notices and manifest hashes. It makes no network calls and spends no credits. A changed verified ID propagates through its previous recorded mention as well as its original alias.

Check the current pilot without writing:

```sh
python3 guides/publication/story/films/higgsfield/the-path-between-people/04_tracking/sync_references.py --check 01_pilot/test_video_4s.txt
```

Exit code 2 means missing bindings or unsynchronized local content. Supply available full IDs in a batch when possible; the assistant collects and propagates them centrally. No repeated per-file replacement is needed.

Coverage includes all nine memory/clinical source prompts, all seven storyboards, all seven film video prompts, and dependent pilot prompts. Initial character/world/map images need no reference to themselves. TTS files contain spoken words only. The previous accepted video must still be selected in the actual Forward Extend source field: an image-reference mention does not establish an extension.

The pilot remains step 6 of the 77-step production plan. Binding metadata adds no media-generation job.


## Object and material references for every transformation

The creator's reference expansion applies to every visible object family, not only vehicles or landmarks. Before a dependent video generation, account for each transforming object in the beat: identify its source appearance, its destination appearance, the corresponding physical parts and the camera angle that exposes those parts. Reuse detail already legible in an accepted world or memory image. Where that image does not resolve an important object or joint, prepare a dedicated detail reference. This is a reference-preparation inventory, not an instruction to launch separate video tests or to regenerate accepted characters and rooms.

| Object family | Reference evidence to prepare or reuse | What the motion description must connect |
| --- | --- | --- |
| Numerical rating cards | Exact warm-white card and bold decimal; an in-street example above an uncovered person's crown, including side-angle readability | The same card, number and owner through the camera pass; cards stay stable while their surroundings transform |
| Bus, taxi, tram and their components | Consistent vehicle identity; front three-quarter, side, windows, body corners, wheels and roof fittings where visible in the planned pass | Same panels, pillars and wheels across viewpoints; use source/target pairs only when the beat actually transforms the vehicle |
| Café window, glass, sill and brick returns | Existing café opening and its open, solid destination; visible hinges, panel thickness, mullion and sill | Return panels rotate at their own edges; attached glass rises into the canopy; sill extends into the floor edge |
| Paving, floorboards and street bench | Stone joints, timber grain, bench slats and supports; destination floor border from the accepted room | Paving seams become board seams; bench timber opens into the floor boundary without replacing the woman's occupied table or chair |
| Tables, chairs, cups and doors | Reuse the accepted restaurant's precise furniture, cup, door arrangement and occupied layout; expose backs, legs and side faces where required | The existing occupied furniture travels with its floor; its stable identity, thickness and contact shadows survive changing angles |
| Street lights, brackets, pendants and signs | Fixture shapes, stems, mounting joints and sign faces in source and destination | Brackets bend into lamp supports; attached sign slats rotate; illumination originates at the actual fixture |
| Arches, fanlights, glass roofs, railings and stairs | Arch blocks, crown seam, glazing-bar intersections, glass corners and new roof support structure | Arch segments extend into ribs; fanlight bars become roof framing; attached panes lengthen from their original corners |
| Whole historic buildings | Recognisable complete source and target buildings plus corresponding dome, tower, portico and roof details | Each named part changes into its destination counterpart while retaining the same site and traceable support |
| Later memory objects: seats, gates, awnings, baskets, clocks, keys, plants, desks, papers, folders and cabinets | Use the exact object in the assigned memory bank, supplemented by readable material/joint details wherever the planned change needs them | Apply the beat's specific source-to-target correspondence; preserve inscriptions, identity-bearing objects and human interactions where scripted |

For each missing transformation reference, prepare source and destination views, and optionally an intermediate geometry illustration with the same object orientation, comparable scale and consistent lighting. The intermediate view depicts one solid connected object partway through the change: visible side faces, supports and moving joints, not two transparent objects overlaid. Use separate reference images where available; an overview sheet is an index, not a sequence of replacement video frames. For the video, explicitly assign each image its source/target/material role and describe the uninterrupted motion between them. Object-reference camera angles explain geometry; they do not override the film's camera trajectory.

All relevant object families receive reference coverage. A reusable accepted image may cover several objects when each is clearly legible. Attach the references relevant to the current clip, with explicit roles, and retain the detailed video prompt. Never invent a saved Element ID or mark an unrendered reference as attached. Preparing these references adds no new video-test branch; their image-generation availability and cost remain whatever the user's actual web composer displays.

The [reference index](../02_library/morphs/objects/README.md) links to 53 separate complete image prompts, with a matching [short Elements import list](elements/archive/batches/08_reference_assets.md). It covers test and production transport, historic source/target buildings, glass, masonry, signs, roofs, lamps, room objects, current-person states and the street opening while its buildings also transform. Import descriptions are concise element identities. Detailed generation instructions belong only in the matching R-numbered image-prompt files. Use the per-test/per-block routing table; these 53 library entries are not 53 inputs to every video. Import, render and bind their actual accepted media before a dependent video pass. No fabricated platform bindings or completed renders are implied.

A world reference is a family of compatible views and details, not necessarily one image. Build source and destination states from the same accepted subject, then add the side/underside/roof views that expose the joints used by the actual camera route. The street may open through visible solid construction while its individual buildings and objects continue morphing. Reference sets 51–53 illustrate this with the existing London scene; a named London/Budapest street comparison is not a compulsory new location or sequence.

Current pilot preparation: five supplementary images only — R011, R001, R006, R002 and R008 — plus existing accepted references. Reuse those images in production Block 01; keep the other detailed assets mapped to full-film blocks in the reference index. The production mappings are preparation plans until the actual rendered media and Element IDs are available and bound. Native Extend reuses the accepted first result and adds R009 for the canopy. The creator reports the 53 definitions imported; image rendering and actual-ID verification remain pending.

R011 clean London opening: `@loc_MYS_mys-reference-11-clean-london-opening-reference-priority-source-image_s0_v1` — complete ID supplied by the creator, including uppercase MYS and scene s0. R001 already includes this mention with its environment-reference role; copy the complete R001 prompt rather than manually reconstructing the reference.

Landmark coverage: the full-film library includes Tower Bridge (R034), London Eye (R036), the London Palace of Westminster (R039) and Hungarian Parliament (R040), in addition to St Paul's/Basilica. R054 now separates the Big Ben/Elizabeth Tower detail from the wider palace view; R055 supplies the previously missing dedicated Westminster Abbey reference. Both support existing Block 07 content. See the landmark table in the [reference index](../02_library/morphs/objects/README.md). Their new two-entry import is separate from the already-imported batch; the five-image pilot preparation remains unchanged.

## Multiple world pages within one production video

Each full-film block now names its own world Pages A/B/C in both storyboard and video prompts. Three 4K 2×2 reference inputs preserve all nine former world views. The camera can reach several spaces and the architecture can change repeatedly within the same 30-second block; source and target images do not prescribe cuts. The [world-page index](../02_library/worlds/real/README.md) maps original view numbers to actual page/cell positions.

B/C references are explicitly unresolved until their real Element IDs arrive; their [14-definition new-only import](elements/archive/batches/10_world_reference_pages.md) is prepared, not executed. Existing W01–W07 image associations still describe their actual old images. Do not claim that an old nine-cell W01 has become a new four-cell Page A because its local prompt changed. The current pilot continues using its actual accepted inputs, with its original legacy-sheet instructions until that specific association changes. No earlier import or accepted character/memory is repeated.
