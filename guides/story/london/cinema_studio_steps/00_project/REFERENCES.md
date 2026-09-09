# Reference mentions for the whole pack

The creator has verified that pasting a real Element mention automatically loads its image. The assistant maintains the mapping once in `reference_bindings` in [source_manifest.json](../04_tracking/source_manifest.json), then updates every affected prompt and guide. The creator does not rewrite references file by file.

Only C01 and C02 currently have verified complete mentions. W01 is correctly associated with its accepted city image, but its ID is clipped in the supplied screenshots. T01 is an accepted raw restaurant image without a verified persistent mention. Future storyboard and audio handles have not been established. Import definitions and filenames do not prove the generated platform IDs.

`@UNBOUND_W01` and similar tokens are deliberately incomplete slots, not usable Higgsfield mentions. A prompt with unresolved slots starts with **REFERENCE SETUP INCOMPLETE**. Do not paste it for generation yet. Once its real mentions are recorded and synchronized, that notice disappears automatically. This checks local binding completeness, not the availability of media or account permissions.

For an existing Element, record its complete displayed ID with one leading `@` in its `mention` field. For raw images, storyboards and narration, record only a persistent media mention actually shown to work in the composer. Do not invent handles, reimport the 48 existing Elements, replace MW01 with the pilot restaurant still, or regenerate an accepted image merely to bind it. If the UI requires a separate pilot reference container for T01, associate the existing image with that distinct container.

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

The pilot remains step 6 of the 76-step production plan. Binding metadata adds no media-generation job.
