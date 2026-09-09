# First test — 8 seconds, 480p

**Purpose:** test fast camera movement, physically transforming architecture, a living city and moving memory inside glass in one short shot. This is a technical excerpt, not the entire first block compressed into eight seconds.

Budget: [at most 100 credits](../00_project/BUDGET.md) for the whole pilot, including paid preparation. This is included in the complete-film 2200-credit working ceiling, not added on top; protect the other 800 credits and the cost of all unfinished production. One opening test, then one short continuation only if usable. No automatic rerolls.

## 1. Existing project and references

Continue in the existing **MyScoutee** project shown in the supplied screenshot. Its visible Elements are already imported and show **Add element image** rather than rendered thumbnails. Use those existing containers; do not repeat their import. Check C01, C02 and W01 specifically and reuse any accepted images already available. The screenshot does not establish the state of off-screen entries.

If Elements are missing, [00_pilot.md](../00_project/elements/00_pilot.md) starts with three definitions. This is metadata, not rendered imagery. If all 48 Elements were imported earlier, **do not import them again**. See the [import guide](../00_project/elements/README.md).

## 2. Generate only missing images

One row is one image request. The planned image model is **Nano Banana Pro in the stated seven-day unlimited window**, once the selected project operation is confirmed covered. Paste the linked `.txt` in the image prompt field. Use 16:9 and one output. Keep reference images detailed; 480p is the video setting. Use each matching existing Element's **Add element image** control to associate its accepted render, following the actual options offered by the interface.

| Order | Prompt | Existing image inputs | Output name |
| --- | --- | --- | --- |
| 1 | [C01 — protagonist](../02_library/characters/C01_PROTAGONIST.txt) | None | `C01_PROTAGONIST.png` |
| 2 | [C02 — Soho woman](../02_library/characters/C02_SOHO_WOMAN.txt) | None | `C02_SOHO_WOMAN.png` |
| 3 | [W01 — city](../02_library/worlds/W01_MAIN_WORLD.txt) | None | `W01_MAIN_WORLD.png` |
| 4 | [T01 — single memory still](test_memory_image.txt) | C01 + C02 | `T01_SOHO_MEMORY.png` |

For T01, the prompt now uses the displayed C01/C02 Element IDs verified in the guided session. The creator confirms that pasting these @ identifiers automatically loads their Elements and accepted images in the composer. Use that autoload behavior; no separate manual selection, duplicate upload or binding screenshot is required unless an actual missing/wrong-reference symptom appears. A suitable existing Soho-memory source can replace this extra still when project provenance permits. T01 needs a verified persistent reference mention before the video can autoload it. It is currently a raw project image. Do not guess a handle or attach it to an unrelated canonical memory bank; establish the actual media-mention route or a distinct pilot reference container using the existing image. C01/C02/W01 carry forward into the film; T01 is a pilot source and does not replace the final film's complete MW01 bank.

## 3. Generate the 8-second video

Cinema Studio 4.0 → Seedance 2.5 → References; **8 s, 480p, 16:9, audio ON, one output**. If any setting is unavailable, follow the [setup guide](../00_project/SETUP.md) before paying.

[test_video_8s.txt](test_video_8s.txt) explicitly names C01, C02, W01 and T01 through reference mentions. The assistant binds each actual identifier once for the whole pack; paste the full file after its reference setup notice has cleared. See [reference binding](../00_project/REFERENCES.md). Check the quote for one output. Save as `T01_CITY_8S_480P.mp4`.

## 4. Watch once and check the visual and audio mechanisms

- Does the same protagonist walk at human speed while the camera moves fast?
- Does the **visible facade itself transform**, with readable material change? A different building revealed behind a wipe is insufficient.
- Is traffic alive, and does the woman actually turn/smile inside the taxi glass? The memory must not become a full-screen cutaway or still photograph.
- Does the fast move land on a readable human moment, with cards above heads and no clinical reveal?

Also listen for the quiet Hungarian folk-rooted motif and material foley synchronized with the visible facade movement; neither should bury the human moment.

At 480p, tiny text and background faces are not a final-quality test. Minor coherent irregularity is acceptable. If a central mechanism fails, name it before any further spending. An 8 s success does not prove full-block story density or 1080p quality.

The accepted 2K W01 grid is a context reference for this mechanics test, not a literal opening frame. Each cell contains only a fraction of the sheet's total pixels; this pilot cannot establish final architectural sharpness. See [reference-detail guidance](../00_project/SETUP.md#reference-detail-and-contact-sheets) before preparing later nine-cell sheets or paid 1080p production.

## 5. Only after a usable visual test: 4-second extension and audio

First check that **Forward Extend accepts source video, new images and an audio reference together**. If not, do not generate the test narration for this route.

Generate the five words in [test_narration.txt](test_narration.txt) once, using the [voice to retain](../00_project/VOICE.md), naturally around 2–3 s. Save as `TA01_TEST_NARRATION.wav`. Do not attach the full A01 recording to this four-second test.

Forward Extend source: accepted `T01_CITY_8S_480P.mp4`. Added duration: **4 s**, 480p, 16:9, audio ON, one output. Images: the same C01, C02, W01 and T01. Audio: TA01. Prompt: [test_extend_4s.txt](test_extend_4s.txt), after its reference setup notice has cleared. Put the source video in the real Extend source field, not an ordinary image slot.

Check stride, camera direction, traffic, rain and ambience at the eight-second boundary. Compare the spoken result with TA01. Record whether the output contains **12 continuous seconds or only a 4-second continuation**. Name and record the actual returned media rather than assuming a cumulative chain.

## 6. Next step

After a usable pilot and a complete budget check, continue to [Film Block 01](../03_film/01/README.md) at the 30 s / 1080p target. Do not stretch the pilot into the final film or create seven draft versions. Retain the three accepted canonical images; keep the pilot video separate from the 3:20 production chain.
