# Map studies — excluded from the current production pass

MAP01–MAP07 are retained planning studies, not generation tasks. They are absent from Element imports and have zero planned images and credits in the image ledger. Follow the 164-entry [production prompt list](../../../00_project/elements/index/FULL_PROJECT_PROMPT_MAP.csv).

## Content-based decision, 2026-09-10

The initial exclusion was based only on missing video bindings. A subsequent content comparison found:

- The maps provide a simplified 70–75-degree oblique block model, an exterior pedestrian line, an overview, and entry/transformation/exit coverage. This could help communicate overall route topology; it does not supply detailed facade geometry or the moving camera's orbit, height changes and focus timing.
- The seven corresponding world families already identify the route's principal places, approaches, public crossings, transformation sites and exits. World pages additionally specify material depth, persistent kerb/threshold anchors and oblique views. Video prompts specify continuous camera travel and inherited Extend state.
- The film expressly permits compressed and reordered dream geography. A geographically fixed city-wide itinerary is not a requirement.
- There is concrete drift: MAP05 retains Blackfriars Bridge alignment with Chain Bridge-inspired details, while W05_MAIN_WORLD_A asks for a recognizable Tower Bridge becoming the full Chain Bridge at that approach. An unchanged map sheet would add a competing geometric instruction.
- No MAP01–MAP07 Element/input is assigned to any film or pilot video. Generic references to map sheets in video/storyboard prompts were replaced with the assigned world references and continuous camera route. No scene, landmark, morph or camera action was removed.

Decision: do not generate or attach these seven existing map sheets for the current film. This is a scope decision supported by their current content, not a claim that route diagrams never help video generation. Their omission has not been experimentally validated in a rendered comparison. If a later observed continuity failure requires a route diagram, author it against the accepted world geometry and assign a specific video-reference role before adding a generation task.

The old optional-generation wording inside the retained map prompts is inactive. Production uses 164 images at 4 credits each, totaling 656 credits; the map exclusion removes 28 credits from the former 171-image estimate. See [BUDGET.md](../../../00_project/BUDGET.md).
