# Reference mentions for the whole pack

The creator has verified that pasting a real Element mention automatically loads its image. The assistant maintains the mapping once in `reference_bindings` in [source_manifest.json](../04_tracking/source_manifest.json), then updates every affected prompt and guide. The creator does not rewrite references file by file.

Complete mentions are verified for C01, C02, C05, C09, C10, C12–C15, C23–C25 and C28–C30. The thirteen newly identified character Elements still have empty image slots; binding their metadata does not make their images available. W01 is correctly associated with its accepted city image and its complete ID has now been supplied as copied text by the creator. T01 is an accepted restaurant image whose complete new Element ID has now been supplied by the creator, preserving uppercase MYS; association of the image with that new Element still needs checking. Other clipped character IDs and the remaining world/memory IDs remain unresolved; future storyboard and audio handles have not been established. The imported Score Cards prop ID is recorded separately in the manifest, with no image attached and no new generation task. Import definitions and filenames do not prove the generated platform IDs.

## Remaining binding work at the point of use

Treat long-ID capture as a separate metadata task when an asset is next needed. If a screenshot clips the identifier, obtain the full copied text from its Element ID field instead of requesting repeated zoomed list screenshots. Accept copied IDs with or without the leading @ and remove Markdown-only underscore escapes. Check the named asset and known prefix, record the ID once, then propagate it to every consumer. This does not add a generation job or change the production count; do not require all remaining IDs before continuing an independent task.

**Before opening a prompt for the creator to copy:** run the existing reference check for that exact file. If it reports missing identifiers, first name the actual person, location or image in chat and obtain the missing reference. Explain what it depicts and where it was last seen; never present an internal UNBOUND key as an Element name the creator should search for. Prioritize inputs blocking the current prompt before unrelated future Elements. After binding and synchronization, check again; only then open the copy-ready prompt in VS Code and give its complete settings. A file already left open from earlier work is not evidence that it is ready.

For the current pilot, T01_IMAGE means the accepted single warm Soho sushi-restaurant still: the protagonist stands by the restroom doors and the Soho woman sits at a table, turning toward him with a small smile (14:39:25 screenshot, MyScoutee / All assets). It was generated using test_memory_image.txt. Its complete Element ID is now bound as `@loc_MYS_pilot-soho-restaurant-memory_s1_v1`; it is separate from the imported Memory World 01 bank. Keep the accepted image and make sure the corresponding loaded reference shows it.

| Required input | Where the actual identifier must come from | Needed before |
| --- | --- | --- |
| W01 | Existing Location / World 01 — The City Judges First — Soho / Piccadilly / Leicester, v1, Scene 1. Complete copied ID is verified and bound: `@loc_mys_world-01-the-city-judges-first-soho-piccadilly-leicester_s1_v1`. Reuse this binding for the later 4K replacement on the same Element. | Current T01_VIDEO and every later consumer of W01 |
| T01_IMAGE | The creator has supplied `@loc_MYS_pilot-soho-restaurant-memory_s1_v1` for Location / Pilot Soho Restaurant Memory / v1. Do not reimport this Element. Ensure the accepted single restaurant still is attached and saved. See the [association instructions](../01_pilot/README.md#give-the-accepted-restaurant-still-its-own-element). Reuse the image. | Current T01_VIDEO and T01_EXTEND |
| TA01 and A01–A07 | Actual accepted clean speech output, using the platform's supported audio-reference input. Image-Element autoload does not establish that audio mentions work the same way. Verify that input route before paying for speech for it. | Matching extension or film video |
| Other characters, worlds, memories and storyboards | Existing matching Element or actual accepted output's persistent mention. Capture each available ID when that asset is handled; the pack's manifest already lists every consumer. | First dependent prompt, not after its generation |

For every accepted asset, the assistant checks the supplied Element screenshot against the intended image, Category, Name, Version, full ID and visible Description, records the verified mention once, runs the synchronization command below, and checks the next dependent prompt. Visual acceptance and reference readiness are separate: keep accepted media even when its handle is still missing. Do not mark an unresolved prompt copy-ready or make the creator replace tokens manually.

If a media type has no supported persistent mention, identify the actual input mechanism and update every affected prompt consistently before generation. Do not invent an audio or raw-image Element ID to make the local checker pass.

`@UNBOUND_TA01` and similar tokens are deliberately incomplete slots, not usable Higgsfield mentions. A prompt with unresolved slots starts with **REFERENCE SETUP INCOMPLETE**. Do not paste it for generation yet. Once its real mentions are recorded and synchronized, that notice disappears automatically. This checks local binding completeness, not the availability of media or account permissions.

For an existing Element, record its complete displayed ID with one leading `@` in its `mention` field. For raw images, storyboards and narration, record only a persistent media mention actually shown to work in the composer. Do not invent handles, reimport the 48 existing Elements, replace MW01 with the pilot restaurant still, or regenerate an accepted image merely to bind it. T01 now has a supplied complete Location Element ID. Its metadata import is no longer the next action; check the accepted image association when using it.

Assistant command, from the repository root, after updating a binding:

```sh
python3 guides/story/london/cinema_studio_steps/04_tracking/sync_references.py --write
```

This updates local `.txt`/guide mentions, incomplete-reference notices and manifest hashes. It makes no network calls and spends no credits. A changed verified ID propagates through its previous recorded mention as well as its original alias.

Check the current pilot without writing:

```sh
python3 guides/story/london/cinema_studio_steps/04_tracking/sync_references.py --check 01_pilot/test_video_8s.txt
```

Exit code 2 means missing bindings or unsynchronized local content. Supply available full IDs in a batch when possible; the assistant collects and propagates them centrally. No repeated per-file replacement is needed.

Coverage includes all nine memory/clinical source prompts, all seven storyboards, all seven film video prompts, and dependent pilot prompts. Initial character/world/map images need no reference to themselves. TTS files contain spoken words only. The previous accepted video must still be selected in the actual Forward Extend source field: an image-reference mention does not establish an extension.

The pilot remains step 6 of the 77-step production plan. Binding metadata adds no media-generation job.
