# Product reel — ElevenLabs Jon narration

Picture target: `00:48.000`, six exact 8-second shots.

Voice: **Jon — Warm & Grounded Storyteller**
Model: `Eleven Multilingual v2`
Speed: `0.97`
Stability: `62`
Similarity: `55`
Style exaggeration: `20`
Speaker boost: `Off`

These are the approved story-edition values. Before paid generation, record the
live ElevenLabs voice ID and exact model version in
`NARRATION_MIX_MANIFEST.json`; the display name alone is not a reproducible
identifier.

## Performance direction

Warm, grounded, intelligent and direct. Speak to one tired person, not to an
arena. This is an explanation, not a hard-sell commercial. Keep the pace brisk,
with a small clean thought boundary at 00:08, 00:16, 00:24, 00:32 and 00:40.
Give “Then you meet.” a short pause afterwards. Stress **private**, **each person**,
**meet**, **shared context** and **the meeting**. End open and credible, not
victorious.

Generate speech only: no ElevenLabs music, sound effects or enhancement. Prefer
48 kHz WAV; high-quality MP3 is acceptable if it is decoded once to PCM.

## JON-01 — target 00:00.000–00:16.000

Export as `PR_JON_01.wav`.

```text
You get a match. But it has no time, place or shared plan. MyScoutee builds that missing path. Your interest becomes a private, editable one-to-ten priority, connected with mutual intent, distance and context.
```

Timing intent:

- the missing-path sentence finishes by approximately `00:07.5`;
- the second thought begins at `00:08.0` and finishes before `00:16.0`.

## JON-02 — target 00:16.000–00:32.000

Export as `PR_JON_02.wav`.

```text
A balanced group can form around one activity. Each person sees the proposal and accepts or declines for themselves. Those who accept share one contextual chat, then coordinate people, transport, place and supplies.
```

Timing intent:

- “accepts or declines” lands before `00:24.0`;
- the four resources remain clear, not rattled off.

## JON-03 — target 00:32.000–00:48.000

Export as `PR_JON_03.wav`.

```text
Then you meet. Profiles gain voices, and strangers gain real context, while every priority stays private. The next invitation begins with shared experience, not another cold opening line. MyScoutee is designed for the meeting.
```

Timing intent:

- say “Then you meet.” immediately at the visual meeting, followed by a short
  breath;
- “The next invitation” starts at approximately `00:40.0`;
- finish by `00:47.3` so the final branded frame can breathe.

## Fit rule

Assemble the three blocks at their exact 16-second boundaries. First trim excess
leading/trailing silence and edit natural breaths. If a block still misses its
window, regenerate only that block before applying time correction. Any final
transparent time adjustment stays within approximately `±2%`; do not make Jon
sound hurried or stretched.

The Flow-generated music, ambience and effects remain underneath. Duck them
under Jon; do not replace the accepted source soundtracks during the narration
pass.
