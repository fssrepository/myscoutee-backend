# OpenArt workflow

Scope: shared platform playbook for every volume. The named Sxx shots, prompts
and assets below are Volume I's worked example; later volumes substitute their
own locked storyboard inputs without copying them into this shared directory.

Checked against OpenArt's public product/help pages on 2026-08-04. The UI is
actively changing. Labels below are the current public names; if an item moves,
follow the capability name rather than guessing a different workflow.

## Why use OpenArt here

OpenArt is the fastest route to a complete story-level rough cut. Its current
Director workflow accepts an idea, saved characters/worlds and media, develops a
story with the Ori assistant, exposes a scene-by-scene storyboard and can create
coherent work up to five minutes. That makes it suitable for the 02:48 structure.

Use OpenArt for:

- character/world development and visual bible;
- full-film storyboard and animatic;
- first coherent rough cut;
- selected final clips when its character consistency is strong;
- testing multiple video models inside one asset library.

Do not trust one automatic pass as a final film. Story-level consistency does
not replace shot, claims, face, hand, continuity and typography review.

## 1. Prepare local files

Create a working asset directory outside this source folder and collect:

- creator-authorized founder photos: 10–15 diverse, sharp references is
  OpenArt's current help guidance for difficult character consistency; use front,
  three-quarter, profile, neutral/expression and full-body views;
- approved Maya/supporting character references or original character sheets;
- repository logo files:
  `frontend/src/assets/logo/heart.png` and/or `heart.webp`;
- one clean image for each world and prop generated from
  [Volume I's PROMPT_PACK.md](../../../trilogy/01-the-city-between-us/prompts/PROMPT_PACK.md);
- no founder travel photos survive, so create and label the approved destination
  plates as illustrated reconstructions; never present unrelated stock as a
  personal archive;
- locked English rough voice-over WAV;
- optional temp music for rhythm only; do not upload unlicensed commercial music;
- this directory's script and storyboard as reference PDFs or plain text.

Never train a character on a person's images without documented permission.

## 2. Create the visual assets

### Founder

1. Open **Character Builder** or **Create Character**.
2. If building from authorized images, upload the founder reference set. If the
   current flow asks for guided fields such as Look/Vibe, Gender, Ethnicity and
   Age, enter them from the real reference rather than “improving” the person.
3. In the main character description/prompt box, paste the **Founder identity
   sheet** prompt from [PROMPT_PACK.md](../../../trilogy/01-the-city-between-us/prompts/PROMPT_PACK.md).
4. Generate the reference sheet first. Reject face/age/proportion drift.
5. Save the approved character as exactly `Founder`.

### Maya and supporting characters

Repeat the flow and save:

- `Maya`
- `DanceStudent`
- `DancePartner`
- `DateCafe`
- `DateBar`
- `DateRestaurant`
- `LocalOperator`

Do not create all supporting roles from one prompt if OpenArt merges identities.

### Worlds and prop

1. Open the image-generation/editor area.
2. Paste one world prompt at a time from [PROMPT_PACK.md](../../../trilogy/01-the-city-between-us/prompts/PROMPT_PACK.md).
3. Keep the same selected image model and style reference for all sheets. Use a
   current high-quality image model rather than a video model.
4. Save the approved assets/worlds with these exact names:

   - `BudapestWorld`
   - `LondonWorld`
   - `SohoOffice`
   - `TottenhamHMO`
   - `DanceStudio`
   - `CafeBadDate`
   - `BarBadDate`
   - `RestaurantBadDate`
   - `EventVenue`
   - `Notebook`
   - `Travel_Tatras`, `Travel_Schonbrunn`, `Travel_Neuschwanstein`
   - `Travel_AngkorWat`, `Travel_GoldenTriangle_SelectedCity`
   - `Travel_Norway`, `Travel_Mediterranean_SelectedPlace`
   - `Travel_USWater_SelectedPlace`

5. Generate empty location plates. They are useful for repairing a background
   without changing faces.

## 3. Create the Director project — exact paste map

| OpenArt location | Paste/attach | Purpose |
| --- | --- | --- |
| **Director → New project → Describe your idea** prompt box | entire [prompts/openart-director-master.txt](../../../trilogy/01-the-city-between-us/prompts/openart-director-master.txt) | locks story, runtime, claims, act structure and look |
| media/asset attachment area beside the Director prompt | rough English VO, optional temp music, approved world sheets | gives Director timing and visual references |
| inside the prompt or asset picker using saved tags | tag `@Founder`, `@Maya`, `@DanceStudent`, `@DancePartner`, `@LocalOperator`, `@BudapestWorld`, `@LondonWorld`, `@SohoOffice`, `@TottenhamHMO`, `@DanceStudio`, `@EventVenue`, `@Notebook`; attach travel plates only to S08 | binds saved assets to names used in the brief |
| Ori/Director chat after its first response | `Use the supplied narration verbatim. Show me the 23 scene cards with exact S01–S23 IDs and timings before generating motion. Do not add product claims.` | prevents silent rewrite |
| Director chat after storyboard appears | paste the relevant correction block below | fixes structure without regenerating the whole story |
| an individual storyboard scene/shot prompt | [prompts/continuity-prefix.txt](../../../trilogy/01-the-city-between-us/prompts/continuity-prefix.txt) + the matching Sxx block from [prompts/shot-prompts.txt](../../../trilogy/01-the-city-between-us/prompts/shot-prompts.txt) | precise shot regeneration |

Current OpenArt guidance says saved characters/worlds can be tagged in Director.
If `@` autocomplete does not find an item, select it through the adjacent asset
picker and retain the same descriptive name in the prompt.

## 4. First Director response: approve only a plan

Do not click a large all-scenes generation immediately.

Verify:

- exactly 23 cards, S01–S23;
- total 02:48;
- S03 is software work in Soho and S04 is the Victoria line home to Tottenham;
- the thirteen-person Victorian HMO is crowded and personal, not destitution;
- S08 has exactly a three-second illustrated burst and no fake archive;
- Budapest return is hopeful and precedes apps/events/dance/dates;
- Maya is not paired with the founder;
- the dance partner arrival is a neutral boundary, not a confrontation;
- bad-date partners are sympathetic and the locations create friction;
- the priority is private/editable, not a public attractiveness rating;
- people can accept and decline groups;
- the film says “designed,” never “proven”;
- operator ending is an invitation from a built core, not a rescue appeal;
- last scene is a clean plate, not an AI-rendered wordmark.

If Director changes the script, paste:

```text
Restore the exact supplied narration and timings. Do not paraphrase, add claims,
add romance between named characters, add a failure backstory, or change the
operator invitation. Rebuild only the storyboard text; do not spend video
credits yet.
```

## 5. Generate an animatic

1. Generate one still frame per scene at draft quality.
2. Export or screen-review the 23-frame storyboard.
3. Place the stills against the rough voice track in an editor at their locked
   durations.
4. Correct story and continuity in the stills.
5. Only then ask Director to create the rough moving version.

Useful Ori correction messages:

### Founder too sad

```text
Revise S05–S09 only. The Founder is tired but composed and observant. Remove
slumped posture, tears, self-pity and rejection imagery. Preserve forward motion
and the quiet moment of pattern recognition.
```

### Dance scene reads as blame

```text
Revise S12–S14 only. Keep the dance class warm and worthwhile. The student and
her partner are friendly adults with an existing relationship. The Founder's
expression is simply context understood. Do not imply that attendance at dance
class creates romantic obligation.
```

### Bad dates mock the partners

```text
Revise S15 only. Make every date humane and mutually well-intentioned. The
espresso noise, bar acoustics and formal table create the failure. Both people
share mild recognition or humor. No contempt, phone rejection or appearance gag.
```

### Product becomes magic

```text
Revise S17–S21 only. Follow the relationship lifecycle: private editable 1–10
priority for unknown people/pairs; reciprocal/context evidence; a balanced group
of strangers; calm accept/decline; contextual group chat; managed first event;
former strangers becoming known contacts; later direct invitations and optional
Auto Inviter for available places; community through repetition; and a later
priority decrease making future shared paths less likely after conflict. Keep
people and real meetings more important than UI. Remove giant affinity graphs,
public punishment, soulmate imagery, safety claims and success statistics.
```

### Ending becomes pleading

```text
Revise S21–S22 only. Close the relationship lifecycle, then show one accountable
technical handoff at a real workstation. A capable local operator verifies the
install package and runs an own-brand independent server. Reveal culturally
distinct local community tests connected voluntarily around one shared core as
a server network/virtual enterprise, with a credible opt-out branch. Remove
anonymous copies, current-deployment/proven-efficiency claims, rescue,
desperation, crowdfunding and lone-hero imagery.
```

## 6. Select models for individual OpenArt video shots

OpenArt currently exposes several third-party/current models. Availability and
credits can change. Use this selection logic rather than assuming one model wins
every shot.

| Need | Preferred current choice | Use on | Reason |
| --- | --- | --- | --- |
| full story plan/rough cut | **OpenArt Director** | all shots | long-form story, saved characters/worlds, scene review |
| structured character/multi-shot motion | **Kling 3.0** | S02–S07, S12–S15, S19–S22 | controlled motion and stable subject representation |
| long atmospheric or reference-rich clip | **Seedance 2.0**; use 2.5 only when the account model picker shows it as active | S03, S05–S08, S11 | the public 2.5 page was Coming Soon at the 2026-08-04 check; assemble S08 from stills in post |
| cinematic environment/native sound | **Veo 3.1** | S05–S09, S15, S21 | strong atmosphere; use external final voice |
| inexpensive iteration | **Gemini Omni Flash** or current fast model | composition tests | speed; do not final a face before comparison |
| exact start/end transition | model offering **first/last frame** or Smart Shot | S01→S02, S04→S05, S08→S09 | locks visual handoff |

The named models are a dated recommendation, not a permanent requirement. In
the OpenArt video panel, inspect the current model card for duration, aspect,
reference, audio and credit cost before generation.

## 7. Individual shot — exact paste sequence

1. Open the shot's scene in Director, or open **Video → Image to Video** for a
   replacement shot.
2. Attach the approved first frame and all identity-critical saved characters.
   Use no more references than the current model can follow cleanly.
3. In the prompt field paste:

   - the full continuity prefix;
   - one blank line;
   - only the matching Sxx block.

4. If a separate negative field exists, paste the Negative/avoid block from
   [PROMPT_PACK.md](../../../trilogy/01-the-city-between-us/prompts/PROMPT_PACK.md). Otherwise it is already summarized in
   the continuity prefix.
5. Set **9:16**, the cheapest draft tier, the duration closest to the shot
   manifest and one output. Ask for a second only after naming the first result's
   defect.
6. Generate. Compare identity, acting and camera before visual spectacle.
7. Regenerate one variable at a time. Example: `Keep everything unchanged.
   Reduce the camera arc by half and keep both faces in equal focus.`
8. Download the approved clip and rename it immediately:
   `TCBU_S04_openart_kling3_v03_approved.mp4`.

Do not automatically run a second final pass at 1080p. Put the approved 720p
clip into the 720×1280 timeline, export a phone test and upgrade only a shot with
visible face/detail damage after platform-like playback.

## 8. Dialogue and lip sync

Recommended:

- generate almost all scenes without final spoken audio;
- record or generate the English voice-over externally;
- use OpenArt Lip Sync only for tested supported-language dialogue;
- keep S14/S15 mouth movement minimal enough that an audio cutaway or alternate
  angle can hide a failed sync.

## 9. Export and handoff

Download:

- every approved shot separately at 720p unless target-phone QA requires more;
- OpenArt's full rough cut for comparison only;
- still first/last frames used for transitions;
- textless versions;
- any generated audio as isolated reference, not mixed into the only master.

OpenArt's help pages have carried changing descriptions of direct video editing
versus new Director/VFX capabilities. Plan the final conform, typography, sound
mix and delivery in a dedicated editor regardless of what the current UI can do.

## OpenArt-only fallback

If Director is unavailable on the account:

1. Open **Story → Build Storyboard → Create from scratch**.
2. Create 23 cards named S01–S23.
3. Paste the continuity prefix plus one matching shot prompt into each card.
4. Attach the saved characters/worlds to every relevant card.
5. Generate 5–10 second clips; trim to `SHOT_MANIFEST.csv` timing externally.
6. Use Extend Video only for a shot whose identity remains stable; do not use it
   merely to reach the overall runtime.
