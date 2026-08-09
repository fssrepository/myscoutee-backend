# Google Flow workflow

Scope: shared platform playbook for every part. The named Sxx shots, prompts
and assets below are Part I's worked example; later parts substitute their
own locked storyboard inputs without copying them into this shared directory.

Checked against official Google Flow Help on 2026-08-04. Current public model
names include Veo 3.1 variants, Gemini Omni Flash and Nano Banana image models.
Feature availability, credit cost, visible watermarking and country access can
vary by account and region; the active model/settings panel is authoritative at
generation time.

## Why use Flow here

Flow is strongest for:

- clean cinematic city/environment generations;
- named project assets and `@` references;
- Ingredients/References for recurring characters and objects;
- first/last-frame transitions;
- Veo scene extension;
- saving frames back as future ingredients;
- arranging a rough sequence in Scenebuilder.

Recommended Flow assignments: S01–S09 environments/transitions, S11, S15, S16
and S22 city plates. S08's three-second travel burst is assembled from generated
still memories in the editor. Flow can generate
the entire film, but identity- and dialogue-heavy shots require more care.

## 1. Start the project

1. Open Google Flow in a desktop Chromium browser.
2. Create a new project named `TCBU_Master_9x16_720p`.
3. Create a Collection for:

   - `01_Characters`
   - `02_Worlds`
   - `03_Frames`
   - `04_Draft_Video`
   - `05_Approved_Video`

4. Upload the approved reference sheets and rename assets clearly. Flow's asset
   search can use visual context, but explicit names prevent production errors.

## 2. Create/named project assets

### Images

1. Click the model name in the prompt area.
2. Choose **Image** and **Nano Banana Pro** for final asset sheets; use the
   current Lite/default image model for cheap drafts if needed.
3. Paste one character/world prompt from [Part I's PROMPT_PACK.md](../../../trilogy/01-the-city-between-us/prompts/PROMPT_PACK.md).
4. Attach authorized references.
5. Generate and save the approved results to the project.
6. Name them `Founder`, `Maya`, `DanceStudent`, `DancePartner`, `Operator`,
   `BudapestWorld`, `LondonWorld`, `SohoOffice`, `TottenhamHMO`, `DanceStudio`,
   `EventVenue`, `Notebook`, and the eight `Travel_*` plates listed in the
   OpenArt workflow. No founder travel photo survives; label these as
   illustrated reconstructions, never as archive footage.

Create clean, segmented character/background references. Google's current best
practice recommends plain or segmented backgrounds and removing extra subjects
from location/style references.

### Character reference syntax

In later prompts type `@` and select the named project asset. If Flow's dedicated
character system is available on the account, create/use `@Founder` and `@Maya`.
Use `@me` only when the verified account owner's avatar is the authorized founder
reference.

## 3. Ask Flow Agent for a plan — exact paste map

| Flow location | Paste/attach |
| --- | --- |
| new project prompt box with **Agent** enabled | entire [prompts/flow-agent-master.txt](../../../trilogy/01-the-city-between-us/prompts/flow-agent-master.txt) |
| ingredient/media area in the same prompt | attach all approved character/world sheets plus rough VO |
| follow-up | `Return only the exact shot plan contained in the supplied master. Preserve every ID, timing and narration line. Treat P00 and E01 as post-only cards. Do not generate yet.` |

Do not click a large generation batch until the returned plan matches the locked
storyboard.

## 4. Model and feature choice

| Need | Flow choice | Use |
| --- | --- | --- |
| quick composition draft | **Veo 3.1 Fast** or the currently displayed fast tier | first visual pass |
| approved cinematic shot | **Veo 3.1 Quality** | final S01–S09, S11, S15, S21/S22 tests |
| recurring subject/location | **Ingredients/References to Video** | identity-critical clips; Veo 3.1 currently constrains this mode to 8 s |
| exact transformation/transition | **Frames → First** or **First + last** where supported | S01→S02, S04→S05, S08→S09, S16 |
| continuing an existing Veo shot | **Extend** | only when the original is an eligible Veo 3.1 8 s clip; current help routes extension through Veo 3.1 Lite |
| video edit/custom voice | **Gemini Omni Flash** when available | test fixes and voice reference; not the default for every final |
| image/style frame | **Nano Banana Pro** | characters, worlds and exact first/last frames |

Flow's model matrix changes. Before each batch click the model name and inspect:

- Text to Video / Frames / Ingredients support;
- aspect ratio;
- permitted duration (commonly 4, 6 and 8 seconds; some current modes offer 10);
- audio support;
- outputs and credit cost.

If a chosen feature is unsupported, Flow may switch to a compatible model. Read
the final model label before confirming; do not assume the original selection
survived.

## 5. Individual shot — Ingredients mode paste map

Use for S01–S07, S09–S15 and S19–S22 when keeping a face/world consistent.

1. In the prompt box click the model name.
2. Choose **Video**.
3. Choose **Ingredients** (or References, if renamed).
4. Under the prompt click **Add Image**, or type `@`, and attach the exact assets
   needed by that shot. Do not attach the whole library.
5. Paste into the main prompt:

   - [prompts/continuity-prefix.txt](../../../trilogy/01-the-city-between-us/prompts/continuity-prefix.txt);
   - one blank line;
   - one matching Sxx block from
     [prompts/shot-prompts.txt](../../../trilogy/01-the-city-between-us/prompts/shot-prompts.txt);
   - one blank line;
   - the exact `VEO AUDIO HARD LOCK` block from the active part's
     `PROMPT_PACK.md`, repeated at the end even though the continuity prefix
     already contains the same policy.

6. Replace bracket tokens with the actual `@AssetName` references in the text.
7. Choose 9:16, one output first, 8 seconds for Ingredients when required, and
   Veo 3.1 Fast for the first pass.
8. Generate. Trim externally to the manifest duration.
9. Repeat with Quality/720p only after identity, action and composition are
   locked. Do not buy a 1080p pass unless phone QA exposes a real defect.

Example S06 asset line inside the prompt:

```text
Use @Founder as the Founder and @TottenhamHMO as the exact Victorian-house,
bathroom, WC and shared-bedroom location. Preserve the Founder's face and the
house geometry. Thirteen adults have distinct personal traces; this is a
practical saving choice and crowded real life, not destitution.
```

## 6. Individual shot — Frames mode paste map

Use for S01→S02, S04→S05, S08→S09 and S16 transitions.

1. Generate exact start and end stills first with Nano Banana Pro.
2. In the prompt box click the model name → **Video** → **Frames**.
3. Drag the start still to **+ Add start frame**.
4. If supported in the selected model/mode, drag the end still to
   **+ Add end frame**.
5. Paste the matching shot block, but keep only action/transition/camera details;
   the frames already carry appearance.
6. Add: `Preserve both boundary frames exactly. Create only the physically
   coherent motion and the specified single camera move between them.`
7. Choose duration/model, generate and compare the first/last generated frames
   with the supplied images.

For S04→S05, use the anonymous translucent-partition decision frame as the start
and a rain-lit London route/window as the end. Do not identify the former
employer or ask the model for branded geography.

## 7. Multi-part shot handling

S07 is a 12-second edit of separate seasonal plates. For S08, generate each
travel place as a still, animate only a small element (cloud, water, cloth or
light) and cut 8–12 frames from each into the exact three-second burst. For S15,
generate café, bar and restaurant separately. Splitting is preferred over
stretching or asking one model to preserve too many places/faces.

## 8. Voice and audio

Veo can generate native audio, but independent eight-second generations do not
share reliable musical memory. A request for “the same music as the previous
clip” cannot establish tempo, key, instrumentation, motif or mix continuity when
the previous audio is not an accepted input. Never use clip-generated music as
the master score.

Part I may retain only separable environmental room tone and physically
motivated foley. Part II is generated as silent production picture. In both
parts, append the active prompt pack's `VEO AUDIO HARD LOCK` block at the end of
every Veo prompt. If Veo still creates music, singing, narration or dialogue,
mute/discard the complete native clip audio rather than trying to hide a musical
restart at the edit.

Final audio order:

1. lock and join the complete picture sequence;
2. retain only approved separable ambience or rebuild synchronized foley;
3. produce one narrator consistently across the entire part;
4. produce one score against the exact assembled runtime, not per clip;
5. duck and master the score under narration in the final CPU audio mix.

Do not ask Veo to speak the full narration, and use no voice reference for a
real person without explicit permission.

Flow currently supports voice references through Gemini Omni Flash Ingredients
on eligible accounts. If testing:

1. select **Gemini Omni Flash**;
2. choose **Video → Ingredients**;
3. click **Add Image → Voices**;
4. choose or create an authorized voice and reference `@Voice` in the prompt;
5. generate only S14/S15 dialogue tests;
6. compare identity, language and timing to the external voice master.

For Hungarian, external VO plus tested lip-sync remains the safer production
route.

## 9. Scenebuilder

1. Add generated clips in the locked part-specific order: Part I S01–S22 or
   Part II S01–S38, between post-built P00 and E01.
2. Trim them to `SHOT_MANIFEST.csv` timing.
3. Review against the current continuous Jon narration reference when available;
   do not create a separate slideshow or animatic.
4. Save useful final frames from clips back into the project for subsequent
   Ingredients/Frames generations.
5. Do not use Extend for the locked endpoint chain; each interval already has
   exact first and last frames.
6. Download individual approved shots and, if available, the sequence for review.
   The dedicated editor remains the final source of truth.

## 10. Watermark/provenance and terms

Google states that Flow outputs using its image/video models contain invisible
SynthID. Some subscription tiers/regions also include a visible Veo watermark;
the current help page says Plus/Pro outputs can carry it while Ultra behavior can
depend on local rules. Do not plan to remove required provenance.

Before commercial publication:

- confirm the account's current Terms of Service and generated-content rights;
- verify visible-watermark behavior with one final-quality test;
- retain asset consent and music/voice licenses;
- disclose AI-generated visuals as required by the publishing platform and law.

## 11. Export naming

```text
TCBU_S05_flow_veo31q_frames_v03_approved.mp4
TCBU_S08_travel_burst_edit_v04_approved.mp4
TCBU_S15B_flow_veo31q_ingredients_v02_approved.mp4
```

Save the start/end frame PNGs beside each shot and keep a note of the final
model, mode, duration, aspect and prompt version.

## Flow-only fallback

1. create all characters/worlds with Nano Banana Pro;
2. plan through Agent but lock the local script/storyboard;
3. use Ingredients for every 8-second identity-critical shot;
4. use Frames for transitions and exact composition;
5. split 9+ second or multi-action shots;
6. build the rough order in Scenebuilder;
7. conform, lip-sync, title, subtitle and mix externally.
