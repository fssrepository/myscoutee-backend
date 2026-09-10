# Film prompts

The numbered folders contain each block's storyboard, video prompt and narration. Image-generation prompts remain in `02_library`; their view geometry, material states and appearance rules belong there. Camera travel, timed actions and sound belong in the corresponding video prompt.

[Optional reference motion](reference_motion_options.txt) preserves the character-pair and MR021 score-change video instructions extracted from image prompts. These are selectable inserts, not newly scheduled film events. Copy only a selected transition into its actual video beat with its bound references. The numbered video prompts already retain the active world movement, weather/sound, rating continuity and scene-specific actions.

The image grids, output settings, Element names and import lists are unchanged by this separation. Image prompt lengths must still be checked against the UI limit; separating video instructions alone does not guarantee that a prompt fits.
