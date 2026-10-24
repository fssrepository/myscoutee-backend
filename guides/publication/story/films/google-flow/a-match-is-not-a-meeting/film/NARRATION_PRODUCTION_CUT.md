# The Product — ElevenLabs Jon narration

Raw source target: `00:56.000`, seven exact 8-second shots.
Expected picture lock: `00:54.250` after removing seven repeated frames at
each of the six joins.

Voice: **Jon — Warm & Grounded Storyteller**
Model: `Eleven Multilingual v2`
Speed: `0.98`
Stability: `58`
Similarity: `60`
Style exaggeration: `10`
Speaker boost: `Off`

This is the product-film lock: slightly freer and more conversational than the
story-edition read, with less style exaggeration so it stays credible rather
than sounding like a trailer. The modest similarity increase helps hold Jon's
identity through one continuous generation. Before paid generation, record the
live ElevenLabs voice ID and exact model version in
`NARRATION_MIX_MANIFEST.json`; the display name alone is not a reproducible
identifier.

## Performance direction

Warm, grounded, intelligent and direct. Speak to one tired person, not to an
arena. This is an explanation, not a hard-sell commercial. Keep the pace brisk,
with small clean thought boundaries at `00:07.708`, `00:15.417`, `00:23.125`,
`00:30.833`, `00:38.542` and `00:46.250`. Give “Then the plan becomes a real
meeting.” a short pause afterwards. Stress **private, editable priority list**,
**a signal**, **a real chance to meet**, **meeting**, **shared context** and
**the right person**. End open and credible, not victorious.

Generate speech only: no ElevenLabs music, sound effects or enhancement. Prefer
48 kHz WAV; high-quality MP3 is acceptable if it is decoded once to PCM.

## Preferred production generation — one continuous read

Generate the complete narration in one request and export it as
`PR_JON_FULL.wav`. If WAV export is unavailable, use the same basename with the
highest-quality MP3 option. Keep the seven paragraphs as natural thought
boundaries; do not change the voice settings between paragraphs.

```text
A match is only a yes. Reaching a real meeting still needs people, timing, a place, and a shared plan.

MyScoutee starts with your private, editable priority list. Your choices are a signal, not the final answer.

Everyone arranges their own list independently. Profile fit, context, distance, and mutual interest help shape what comes next.

Together, those signals can form balanced groups, so more people get a real chance to meet.

The group stays full when plans change, while everyone organizes people, transport, place, and supplies.

Then the plan becomes a real meeting. Profiles gain voices. Shared experience creates context. Private priorities stay private.

You do not have to meet everyone to reach the right person. MyScoutee is designed for the meeting.
```

The four sections below are fallback regeneration blocks only. Use them if one
passage in the continuous read is defective; they are not the preferred first
generation for this short film.

## JON-01 — target 00:00.000–00:15.417

Export as `PR_JON_01.wav`.

```text
A match is only a yes. Reaching a real meeting still needs people, timing, a place, and a shared plan. MyScoutee starts with your private, editable priority list. Your choices are a signal, not the final answer.
```

Timing intent:

- the missing-plan sentence finishes by approximately `00:07.55`;
- “MyScoutee starts” begins near `00:07.708` and “not the final answer” lands
  before `00:15.30`.

## JON-02 — target 00:15.417–00:30.833

Export as `PR_JON_02.wav`.

```text
Everyone arranges their own list independently. Profile fit, context, distance, and mutual interest help shape what comes next. Together, those signals can form balanced groups, so more people get a real chance to meet.
```

Timing intent:

- the context sentence finishes before `00:23.0`;
- “a real chance to meet” lands before `00:30.70`.

## JON-03 — target 00:30.833–00:46.250

Export as `PR_JON_03.wav`.

```text
The group stays full when plans change, while everyone organizes people, transport, place, and supplies. Then the plan becomes a real meeting. Profiles gain voices. Shared experience creates context. Private priorities stay private.
```

Timing intent:

- keep the four resources clear rather than rattled off;
- start “Then the plan becomes a real meeting” near `00:38.542`, followed by a
  short breath;
- finish “Private priorities stay private” before `00:46.15`.

## JON-04 — target 00:46.250–00:54.250

Export as `PR_JON_04.wav`.

```text
You do not have to meet everyone to reach the right person. MyScoutee is designed for the meeting.
```

Timing intent:

- “You do not have to meet everyone” starts near `00:46.250`;
- finish by `00:54.05` so the final branded frame can breathe.

## Fit rule

First trim only excess leading/trailing silence from the continuous master and
check its natural phrase positions against the picture. Edit pauses before
changing words. If one passage is defective, regenerate only its fallback
block and replace it at a breath. Any final transparent time adjustment stays
within approximately `±2%`; do not make Jon sound hurried or stretched.

The Flow-generated music, ambience and effects remain underneath. Duck them
under Jon; do not replace the accepted source soundtracks during the narration
pass.
