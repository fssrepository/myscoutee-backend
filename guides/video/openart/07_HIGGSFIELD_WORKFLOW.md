# Higgsfield workflow

Checked against Higgsfield's public Cinema Studio 3.5, Camera Controls, Soul ID,
Kling and Academy pages on 2026-08-04.

## Why use Higgsfield here

Higgsfield is the preferred final-shot workshop because Cinema Studio combines:

- reusable **Elements** for characters, locations and props;
- `@` references inside a project;
- the **Mr. Higgs** co-director;
- explicit camera, lens, lighting, mood and color control;
- multiple current image/video models;
- camera presets and a dialogue/lip-sync path.

Use it to replace the shots where OpenArt's rough cut has good story but weak
acting, face continuity, camera intention or ensemble blocking.

## 1. Create project and Elements

1. Open **Cinema Studio 3.5** and create a new project named
   `TCBU_Master_16x9_24fps`.
2. Open the **Elements** area.
3. Create the following reusable assets using the approved sheets:

| Element type | Exact name | Input |
| --- | --- | --- |
| Character | `Founder` | authorized founder/Soul ID plus approved reference sheet |
| Character | `Maya` | approved Maya sheet |
| Character | `DanceStudent` | supporting cast sheet/crop |
| Character | `DancePartner` | supporting cast sheet/crop |
| Character | `LocalOperator` | operator sheet |
| Location | `BudapestWorld` | empty Budapest sheet |
| Location | `LondonWorld` | empty London sheet |
| Location | `DanceStudio` | empty studio plate |
| Location | `EventVenue` | identical empty venue plates |
| Prop | `Notebook` | cognac notebook sheet |

4. Add café, bar and restaurant Locations only if S07–S09 will be finalized in
   Higgsfield.
5. Confirm `@Founder` etc. autocomplete in a test prompt.

### Founder through Soul ID

If the creator wants a faithful digital double and holds all necessary rights:

1. Open **Soul ID**.
2. Upload roughly 20 or more well-lit authorized photos from different angles,
   following Higgsfield's current guidance.
3. Remove sunglasses, heavy filters, extreme focal lengths, other people and
   inconsistent facial hair unless they are intentional story states.
4. Train and save as `Founder`.
5. Generate the expression/costume sheet in Soul/Soul 2.0 and choose one locked
   navy-coat/rust-scarf design.

Do not switch between Soul ID and an unrelated generated Founder halfway through
the film.

## 2. Ask Mr. Higgs for the setup table — exact paste map

| Cinema Studio location | Paste/attach |
| --- | --- |
| project chat / **Mr. Higgs** prompt | entire [prompts/higgsfield-mr-higgs-master.txt](prompts/higgsfield-mr-higgs-master.txt) |
| same prompt via `@` references | attach/tag all ten Elements listed above |
| follow-up chat | `Use the locked 23-row shot manifest and return the setup table only. Do not generate and do not change narration.` |

Compare its returned plan with [04_STORYBOARD.md](04_STORYBOARD.md). Mr. Higgs can
populate controls, but the locked storyboard wins every disagreement.

## 3. Model selection

| Model/tool | Recommended use | Relevant current capability | Caution |
| --- | --- | --- | --- |
| **Kling 3.0** | S04–S06, S10, S17–S20, S22 | 3–15 s, 720p/1080p, audio optional, structured 2–6-scene/multi-shot generation, subject consistency | keep a film shot to one scene unless a hidden transition truly needs two |
| **Kling O1** | S01/S10 first-last-frame transitions, reference-heavy repair | start/end frame and multiple image references | current duration/mode differs by panel; inspect before spending |
| **Veo 3.1** | S07–S12 atmosphere, rain, rail, London | cinematic environment and native audio path | identity may drift; use Elements/reference and external final dialogue |
| **Seedance 2.0/current Seedance** | S08 or other sound-led tests | native audio/video option and motion | do not keep generated voice if it conflicts with locked actor voice |
| **Soul/Soul ID** | character stills/identity | persistent digital identity | consent and adequate varied source images required |
| **LipSync Studio** | S06/S08 and localized dialogue | post-generation speech sync | test English and Hungarian separately; avoid long talking heads |

Draft at 720p. When composition, performance and identity are approved, run the
same prompt/settings at 1080p/final. Do not “improve” the prompt at the same time
as changing quality, or you will not know which change caused drift.

## 4. Camera preset map

Higgsfield exposes many named Camera Controls. Use restraint.

| Shot | Preset/control | Lens | Intensity/direction |
| --- | --- | --- | --- |
| S01 | Dolly Right or custom lateral | 35 mm | slow, waist height |
| S02 | Static | 50 mm | no move |
| S03 | Dolly Right | 28 mm | slow with foreground wipes |
| S04 | Arc Right | 32 mm | about 20°, slow |
| S05 | Arc Right | 32 mm | identical path, 60% of S04 speed |
| S06 | Static | 55 mm | expression priority |
| S07 | Static | 50 mm | foreground machine depth |
| S08 | Handheld | 40 mm | very low intensity |
| S09 | Static + custom slight Dutch | 58 mm | level by final frame |
| S10 | Dolly/Through Object | 28 mm | use only with locked first/end frames |
| S11 | Dolly Right | 35 mm | architecture occlusion |
| S12 | Static then gentle Dolly In | 50–65 mm | preferably split into two clips |
| S13 | Overhead | 35 mm | 5% push only |
| S14 | Overhead/Dolly In | 45 mm | slow |
| S15 | Focus Change | 55 mm | photo to dimensional behavior |
| S16 | custom Tilt/Incline | 40 mm | gentle overhead-to-oblique |
| S17 | Arc Right | 35 mm | 20° max |
| S18 | Static/macro inserts | 50 mm | match action in edit |
| S19 | Dolly In | 32→45 mm language | split doorway/table if needed |
| S20 | Dolly In | 40 mm | keys to operator face |
| S21 | Crane Up | 28 mm | slow, no aerial pullback |
| S22 | Dolly In | 50 mm | 8% only |
| S23 | Static | n/a | better built in post |

Do not substitute Crash Zoom, FPV Drone, Bullet Time, Snorricam, Dolly Zoom or
360 Orbit. They are available but contradict the emotional grammar.

## 5. Individual shot — exact paste map

For each S01–S22:

1. Create a new shot/generation tile named with the shot ID.
2. Select the recommended **model**.
3. Add the required reusable Elements through the asset panel or by typing
   `@Founder`, `@Maya`, etc.
4. In the main **Prompt** box paste:

   - [prompts/continuity-prefix.txt](prompts/continuity-prefix.txt);
   - one blank line;
   - the matching Sxx block from
     [prompts/shot-prompts.txt](prompts/shot-prompts.txt).

5. In camera controls choose only the mapped preset.
6. In lens, lighting, mood and color controls enter the values in the shot block.
   If a control conflicts with the text, remove the duplicate from the text only
   after saving a version.
7. Set 16:9, target duration and draft resolution. For S11's 9 seconds, choose a
   supported 10/15-second setting and trim, or split at the office lift wipe.
8. Attach a first frame whenever a character or set must match a preceding shot.
   Attach a last frame when the storyboard names an exact transition.
9. Generate one or two variants. More variants before diagnosis waste credits.
10. Put the approved clip on the **Canvas**, preserving the source version.

Example for S06:

| Field | Value |
| --- | --- |
| Elements | `@Founder @DanceStudent @DancePartner @DanceStudio` |
| Model | Kling 3.0 or current best reference-capable character model |
| Camera | Static |
| Lens | 55 mm |
| Light | warm bench practical, cool rainy doorway rim |
| Prompt | continuity prefix + S06 block |
| Audio | off for first visual approval |
| Duration | 6 s |
| Output | 16:9, draft 720p |

## 6. Structured multi-shot Kling use

Kling 3.0 currently allows a clip to contain 2–6 described scenes. Use that only
for:

- S03's corridor of three events;
- S10's Budapest-to-London transition;
- S21's multi-city operator reveal.

For all other shots, a “scene” in the storyboard should remain one generation.
Complexity harms face identity and acting. Assign explicit duration inside the
Kling scene structure and retain the overall shot duration.

## 7. Dialogue and lip sync

Generate S06 and S08 first without final dialogue. When the visual is approved:

1. Export the clean clip.
2. Open **LipSync Studio**.
3. Upload the clip and the isolated 48 kHz mono dialogue stem.
4. Select/mark the correct face; do not sync both people to one line.
5. Generate and inspect frame by frame at plosives and closed-mouth consonants.
6. Repeat separately for English and Hungarian; never translate the English lip
   performance by only replacing audio.
7. If Hungarian sync is not credible, cut earlier to umbrella/glass/room detail
   and preserve the dialogue off screen.

The founder narration remains voice-over and needs no mouth sync.

## 8. Canvas and export

Use the Canvas for shot versions and simple compositions, but conform the final
film in a dedicated NLE.

Naming:

```text
TCBU_S06_higgsfield_kling3_en_v04_approved.mp4
TCBU_S06_higgsfield_kling3_hu_lipsync_v02_approved.mp4
```

Export:

- clean visual;
- English lip-sync version when applicable;
- Hungarian lip-sync version when applicable;
- generated audio separately if useful;
- first/last frame PNGs;
- prompt/settings screenshot or metadata note.

## Higgsfield-only fallback

If making the whole film in Higgsfield:

1. build all Elements and style frames;
2. let Mr. Higgs populate the approved 23-shot setup table;
3. generate a still/low-cost draft for every shot;
4. create a voice-led animatic outside Higgsfield;
5. final only the locked shots;
6. assemble clips on Canvas for review, then export individually;
7. title, subtitle, mix and master externally.
