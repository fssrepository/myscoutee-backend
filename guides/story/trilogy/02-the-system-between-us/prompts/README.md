# Part II prompt package

Status: **synchronized review baseline; generation is paused**.

The reusable prompt system is split into four files:

- [PROMPT_PACK.md](PROMPT_PACK.md) — workflow, tokens and truth controls;
- [continuity-prefix.txt](continuity-prefix.txt) — paste before every shot;
- [shot-prompts.txt](shot-prompts.txt) — one eight-second prompt per scene;
- [flow-agent-master.txt](flow-agent-master.txt) and
  [openart-director-master.txt](openart-director-master.txt) — platform handoffs.

For a single clip, paste the continuity prefix, the relevant `SHOT Sxx` block
and the platform control line. Upload only the exact approved first and last
checkpoint for that interval. Do not generate motion until the Founder approves
the book, script, storyboard and prompt baseline.
