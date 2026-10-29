# MyScoutee product reel — start here

This package owns one **56-second source-cut, 9:16 product reel** with an
expected **54.25-second picture lock**, and the short English-first companion
book **A Match Is Not a Meeting**, with a controlled Hungarian
translation. It is the marketing continuation of the MyScoutee story
publications and deliberately shares their visual and editorial family. The
product explanation stands on its own; it is not the biographical Part III.

The hook is intentionally product-first: many dating routes are good at
discovery, profiles, matching or a first brief encounter, but the handoff to a
concrete, mutually accepted real meeting remains long and fragile. MyScoutee is
designed around that handoff: private editable priorities considered with
profile fit and context, one possible group, one contextual chat, event
resources, the meeting itself, and
a later invitation that is no longer cold.

The public story stays experiential and user-facing. Internal research keeps
claims precise; the reel and book let the familiar friction and the product
workflow become clear through the same user's journey.

## Locked deliverable

- source runtime: **00:56** from seven 8-second shots; expected picture lock:
  **00:54.250** after removal of seven repeated frames at each join;
- generation: **7 × 8 s**, Google Flow, Veo 3.1 Lite, first and last frames;
- composition: portrait `9:16`, `720×1280`, `24 fps`;
- voice: English primary narration with the approved ElevenLabs **Jon — Warm &
  Grounded Storyteller** voice, recorded in post;
- sound: retain each accepted Flow clip's generated music/atmosphere and mix it
  beneath Jon, following the delivered-film method;
- captions: Hungarian manual SRT/VTT, English correction files;
- brand: exact `myscoutee-frontend/src/assets/logo/heart.png` plus editable `yScoutee`;
- final MP4: deliberately outside Git; prompts, sources, frames, captions and
  the PDF are versioned here.

All eight Flow checkpoints are generated or recovered from owned source renders
inside this package;
the production chain has no frame or character dependency on a trilogy part.

The opening brand and `MATCH ≠ MEETING` hook are post overlays on S01. The
closing brand and `DESIGNED FOR THE MEETING.` line are post overlays on S07's
human, post-meeting street image—never on a server or operator scene.
They do not consume a separate title or end card. Contextual grouping and the
practical plan are already visible before the observed Facebook drop around
00:37; the real meeting then occupies S06.

## Package map

- [research](research/DATING_FRICTION_RESEARCH.md): evidence and complaint map;
- [film script](film/SCRIPT.md): locked narration and captions by time;
- [creative bible](film/CREATIVE_BIBLE.md): message and claim boundaries;
- [storyboard](storyboard/STORYBOARD.md): seven-shot visual route;
- [Flow prompts](prompts/README.md): exact copy/paste prompt pack;
- [shot manifest](production/FLOW_SHOT_MANIFEST.csv): inputs and outputs;
- [subtitle guide](film/subtitles/README.md): Facebook and YouTube upload files;
- [mini-book](../../../books/a-match-is-not-a-meeting/A_MATCH_IS_NOT_A_MEETING_EN.md): canonical English source;
- [published PDF](../../../books/a-match-is-not-a-meeting/README.md): versioned companion artifact;
- [build scripts](scripts/README.md): deterministic frames and PDF build.
