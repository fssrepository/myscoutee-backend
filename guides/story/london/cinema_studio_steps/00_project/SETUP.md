# Current setup — 2026-09-11

Use the existing MyScoutee project and confirm the displayed destination before each job. The creator operates its UI. The assistant prepares local files, performs authorized read-only binding after import and later uses FFmpeg locally; no automatic generation or upload through MCP.

## Inputs and order

Import [FILM_PRODUCTION_IMPORT.md](elements/additions/FILM_PRODUCTION_IMPORT.md) once for the missing production containers. Reuse the attached library images. Assign the existing uploaded logo to LOGO_MYS. Generate in [film order](../03_film/README.md), accepting each predecessor and extracting its exact final frame before the next portion's storyboard/video. Verify attached media separately from the existence of an Element handle.

| Output | Target controls | Planning basis |
|---|---|---|
| Eight storyboards | Nano Banana Pro, 4K, 16:9, one output | Earlier 4 credits each; check quote |
| Eight story portions | Cinema Studio / Seedance 2.5, 1080p target, 16:9, one output, audio ON | 30 s for 01–05; 15 s each for 06A/B; 20 s for 07; actual availability/quote governs |
| V00 ident | 4 s, 16:9, 1080p target, one output; silent | Existing logo reference; quote pending |
| Full narration | MiniMax Speech 2.8 HD / Grady, one clean recording | [Voice plan](VOICE.md); actual full-script quote pending |

If a Single Shot tempo control is offered, use it for continuous portions. Camera/light instructions are in the prompt; do not select conflicting automatic cuts. Block 07 retains its prescribed clinical/title cuts. No narration reference is attached to story video jobs. Prompt budget: below observed 15,000 characters and at most 50 references, including storyboard and final frame; recount after real binding.

## Continuation and final assembly

The last frame establishes a composition; it cannot supply motion direction/velocity or audio history. Review the actual preceding clip before replacing the planned opening motion description. Use a dedicated first-frame control if available; an Element alone is not a proven exact-opening lock. Retain all assigned identity/location inputs as well as the end frame. Generate a new portion, not a cumulative master; avoid assumptions about native Extend internals.

Download originals and assemble locally. Keep narration separate until final mixing. Stream-copy compatible picture where possible; document and save any frame/spatial repair as a new output. No dissolve or universal seven-frame cut is assumed. The test upload used Update project film, which the creator reports added watermarking; its embedded soft subtitle did not display. Confirm final duration, branding and published playback in the actual final UI. No festival eligibility or submission status is established by these local files.

[Budget](BUDGET.md): 1979 reported remaining, 1882 planned, 97 reserve, all unverified jobs priced before generation. No automatic top-up or retry.

End-frame export finding: the tested Higgsfield JPG matched source frame 94 rather than final frame 96. Extract the actual final decoded frame locally and compare it to the source before assigning an EF Element. The subsequent generated opening also differed from the exported image; extraction alone does not solve that separate pipeline mismatch.
