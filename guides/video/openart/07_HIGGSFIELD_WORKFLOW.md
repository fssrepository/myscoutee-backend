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
   `TCBU_Master_9x16_720p_24fps`.
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
| Location | `SohoOffice` | modest Soho software-office sheet |
| Location | `TottenhamHMO` | Victorian HMO/bathroom/shared-room sheet |
| Location | `DanceStudio` | empty studio plate |
| Location | `EventVenue` | identical empty venue plates |
| Prop | `Notebook` | cognac notebook sheet |
| Prop/reference | `Travel_*` | eight separate illustrated memory plates; attach only to S08 |

4. Add café, bar and restaurant Locations only if S15 will be finalized in
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
| same prompt via `@` references | attach/tag the core Elements above; add only the shot-relevant travel plates later |
| follow-up chat | `Use the locked 23-row shot manifest and return the setup table only. Do not generate and do not change narration.` |

Compare its returned plan with [04_STORYBOARD.md](04_STORYBOARD.md). Mr. Higgs can
populate controls, but the locked storyboard wins every disagreement.

## 3. Model selection

| Model/tool | Recommended use | Relevant current capability | Caution |
| --- | --- | --- | --- |
| **Kling 3.0** | S02–S07, S12–S15, S19–S22 | identity, ensemble and structured movement | keep one scene per clip unless a transition needs two |
| **Kling O1** | S01/S04–S06/S09 boundary transitions and reference repair | start/end frame and multiple image references | inspect current duration/mode before spending |
| **Veo 3.1** | S05–S09, S15, S21 atmosphere | cinematic environment and native-audio path | identity may drift; external final dialogue |
| **Seedance current** | S03/S11 or sound-led tests | multi-scene motion and audio option | do not keep generated voice; S08 is better made from stills in post |
| **Soul/Soul ID** | character stills/identity | persistent digital identity | consent and adequate varied source images required |
| **LipSync Studio** | S14/S15 and localized dialogue | post-generation speech sync | test English and Hungarian separately; avoid long talking heads |

Draft at the lowest useful tier shown by the current model. When composition,
performance and identity are approved, run the same prompt/settings at **720p
9:16 final**. Do not automatically buy a 1080p pass; upgrade only a failed shot
after reviewing the 720×1280 export on the target phone. Do not change prompt
and quality together, or the cause of drift becomes unknowable.

## 4. Camera preset map

Higgsfield exposes many named Camera Controls. Use restraint.

| Shot | Preset/control | Lens | Intensity/direction |
| --- | --- | --- | --- |
| S01 | Dolly In | 45 mm | 8%, desk height |
| S02 | Dolly Right | 35 mm | slow, map to locker |
| S03 | Dolly Right | 32 mm | foreground wipes; split by region if needed |
| S04 | Static then Dolly In | 65 mm | 5%, expression priority |
| S05 | Through Object/Dolly | 40 mm | train to rental window |
| S06 | Dolly In | 28 mm | doorway to desk |
| S07 | Static | 40–55 mm | seasonal plates; final push only |
| S08 | Static | 50 mm | generate final reflection only; memory burst in post |
| S09 | Arc Left | 35 mm | follow then gentle frontal arc |
| S10 | Static | 50 mm | no move |
| S11 | Dolly Right | 28 mm | three doorway wipes |
| S12 | Arc Right | 32 mm | 18° slow |
| S13 | Arc Right | 32 mm | identical, 60% speed |
| S14 | Static | 55 mm | expression priority |
| S15 | Static / Handheld / Static | 50/40/58 mm | three separate clips |
| S16 | Overhead + Dolly In | 45 mm | 5% only |
| S17 | Focus Change | 55 mm | portrait to context |
| S18 | Tilt/Incline | 40 mm | overhead to oblique |
| S19 | Arc Right | 35 mm | 20° max |
| S20 | Static/macro inserts | 50→35 mm | build with match cuts |
| S21 | Dolly In | 32→45 mm | split doorway/table if needed |
| S22 | Dolly/Crane | 40–50 mm | handoff, then slow reveal |
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
7. Set 9:16, target duration and the cheapest useful draft resolution. For S07's 12-second editorial
   result, generate seasonal plates separately. S08's rapid memories and S15's
   three locations are also assembled in post, not forced into one generation.
8. Attach a first frame whenever a character or set must match a preceding shot.
   Attach a last frame when the storyboard names an exact transition.
9. Generate one variant first. Request a second only after writing the exact
   defect; more variants before diagnosis waste credits.
10. Put the approved clip on the **Canvas**, preserving the source version.

Example for S14:

| Field | Value |
| --- | --- |
| Elements | `@Founder @DanceStudent @DancePartner @DanceStudio` |
| Model | Kling 3.0 or current best reference-capable character model |
| Camera | Static |
| Lens | 55 mm |
| Light | warm bench practical, cool rainy doorway rim |
| Prompt | continuity prefix + S14 block |
| Audio | off for first visual approval |
| Duration | 6 s |
| Output | 9:16, cheap draft; approved final 720×1280 |

## 6. Structured multi-shot Kling use

Kling 3.0 currently allows a clip to contain 2–6 described scenes. Use that only
for:

- S03's three anonymous regional work fragments;
- S11's three event rooms;
- S22's multi-city operator reveal.

For all other shots, a “scene” in the storyboard should remain one generation.
Complexity harms face identity and acting. Assign explicit duration inside the
Kling scene structure and retain the overall shot duration.

## 7. Dialogue and lip sync

Generate S14 and the bar fragment of S15 first without final dialogue. When the
visual is approved:

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
TCBU_S14_higgsfield_kling3_en_v04_approved.mp4
TCBU_S14_higgsfield_kling3_hu_lipsync_v02_approved.mp4
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
