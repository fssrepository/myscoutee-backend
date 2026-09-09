# MYSCOUTEE — Cinema Studio, step by step

**Start here: [the short 480p pilot](01_pilot/README.md).** One 8-second shot tests fast camera movement, a living London–Budapest city, transforming architecture and moving memory inside glass. If usable, one 4-second extension tests the seam and a short narration reference. One output per request; no variation campaign.

This is the **September 9, 2026 manual production edition**. Final target: **Seedance 2.5, 1080p, 16:9, six 30-second blocks plus 20 seconds = 3:20**. The pilot is a separate technical excerpt, not a shortened festival entry. Preparing this pack generated no media and spent no Higgsfield credits. The supplied screenshot shows the existing **MyScoutee** project and imported Elements with empty image slots; a complete account/media inventory and subscription entitlements remain unverified.

**Complete-film working ceiling: 2200 credits; protected reserve: 800.** Include all required finishing work before spending, not just the next clip. There is no additional funding if the original 3000 credits run out. See the [budget](00_project/BUDGET.md).

## Order of work

1. Read [setup and capability checks](00_project/SETUP.md) and the [budget](00_project/BUDGET.md). Use the price displayed for the actual operation.
2. Continue in the existing **MyScoutee** project shown in the screenshot. If needed, paste [project_brief.txt](00_project/project_brief.txt) into its brief field. Existing Elements do not need re-importing.
3. Follow the [numbered pilot steps](01_pilot/README.md). Do not build the whole asset library first.
4. After a usable pilot, follow the film blocks below. Each README lists **prompt → required existing references → output name**.
5. After V02, verify that the native 60-second result can continue and eventually export as one film before preparing the remaining blocks.

| Block | Timeline | Story |
| --- | --- | --- |
| [01](03_film/01/README.md) | 00:00–00:30 | Soho, glances, shared lives, profiles |
| [02](03_film/02/README.md) | 00:30–01:00 | Global routes and human encounters |
| [03](03_film/03/README.md) | 01:00–01:30 | Work, three screens, fragmented administration |
| [04](03_film/04/README.md) | 01:30–02:00 | Search, procedure, defence; AI acknowledgement in narration |
| [05](03_film/05/README.md) | 02:00–02:30 | Person versus file, black humour, two letters |
| [06](03_film/06/README.md) | 02:30–03:00 | Urban overload and human counter-memories |
| [07](03_film/07/README.md) | 03:00–03:20 | Last window, clinical hard cut, stillness and title |

## What to paste where

| File | Destination |
| --- | --- |
| `project_brief.txt` | Project Brief; not a generation prompt |
| `00_project/elements/*.md`, excluding README | **Import Elements** only, and only for missing definitions |
| Character, world, memory and `storyboard.txt` | Image prompt field; one file per request |
| `narration.txt`, `test_narration.txt` | TTS text field; spoken words only |
| `video.txt`, `test_video_8s.txt`, `test_extend_4s.txt` | Video prompt, after selecting actual media and replacing reference aliases |
| README, other guides, CSV, JSON | Operator documentation; never paste into a generation field |

Copy the entire `.txt` file; there are no Markdown fences to remove. `@C01_PROTAGONIST` and similar names are **aliases to replace with the actual tokens inserted by the UI**. Typing a filename does not attach an image.

## Authority and preservation

The [original master](../promt_pack/myscoutee_canonical_prompt_pack.md) and importer remain unchanged. This edition implements the current request for manual operation, a cheap pilot, fast camera movement and transformative buildings. It supersedes the old MCP-only and no-proxy workflow for this route. Story inventory, seven full narration texts, identities and the ending remain preserved.

Read the [review](00_project/REVIEW.md) for repairs and unresolved risks, or the [visual direction](00_project/LOOK.md) for the intensity progression. The [source manifest](04_tracking/source_manifest.json) maps 75 extracted prompts to their original lines. The [story checklist](04_tracking/story_beats.csv) retains all 63 main beats and their embedded secondary memories.

**Keep the first usable take.** More effects increase generation difficulty. Neither a prompt nor an 8-second success guarantees a flawless 200-second film; the pilot exposes expensive uncertainties early. All operator documentation is English. Hungarian in-world signage remains intentional story content.
