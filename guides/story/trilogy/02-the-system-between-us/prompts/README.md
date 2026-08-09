# Part II prompt package

Status: **synchronized generation baseline; visual lock in progress**.

The reusable prompt system is split into four files:

- [PROMPT_PACK.md](PROMPT_PACK.md) — workflow, tokens and truth controls;
- [continuity-prefix.txt](continuity-prefix.txt) — paste before every shot;
- [shot-prompts.txt](shot-prompts.txt) — one eight-second prompt per scene;
- [flow-agent-master.txt](flow-agent-master.txt) — active Veo 3.1 Lite handoff.

`openart-director-master.txt` is retained only as inactive remaster history. It
is not part of the present production route.

For a single clip, paste the continuity prefix, the relevant `SHOT Sxx` block
and the Flow control line. Upload only the exact approved first and last
checkpoint for that interval. The next phase starts directly with the next
numbered endpoint pair and one eight-second Veo 3.1 Lite result. No model
comparison, slideshow or animatic is built.
