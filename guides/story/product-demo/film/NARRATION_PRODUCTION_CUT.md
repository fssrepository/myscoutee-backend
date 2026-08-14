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
Give “Then the plan becomes a meeting.” a short pause afterwards. Stress
**private, editable priority list**, **mutual priorities**, **meeting**, **shared
context** and **the meeting**. End open and credible, not victorious.

Generate speech only: no ElevenLabs music, sound effects or enhancement. Prefer
48 kHz WAV; high-quality MP3 is acceptable if it is decoded once to PCM.

## JON-01 — target 00:00.000–00:16.000

Export as `PR_JON_01.wav`.

```text
A match is only a yes. Reaching a real meeting still needs people, timing and a place. And it still needs a shared plan. MyScoutee starts differently: with a private, editable priority list. Then everyone arranges their own.
```

Timing intent:

- the missing-plan sentence finishes by approximately `00:07.7`;
- “MyScoutee starts differently” begins at `00:08.0` and finishes before
  `00:16.0`.

## JON-02 — target 00:16.000–00:32.000

Export as `PR_JON_02.wav`.

```text
Across those private choices, mutual priorities can reveal a balanced group around one shared activity. Once the group is formed, everyone can organize the practical parts: people, transport, place and supplies.
```

Timing intent:

- “one shared activity” lands before `00:24.0`;
- the four resources remain clear, not rattled off.

## JON-03 — target 00:32.000–00:48.000

Export as `PR_JON_03.wav`.

```text
Then the plan becomes a meeting. Profiles gain voices. Strangers gain real context. Private priorities stay private. The next invitation begins with shared experience, not another cold opening line. MyScoutee is designed for the meeting.
```

Timing intent:

- say “Then the plan becomes a meeting.” immediately at the visual meeting,
  followed by a short breath;
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
