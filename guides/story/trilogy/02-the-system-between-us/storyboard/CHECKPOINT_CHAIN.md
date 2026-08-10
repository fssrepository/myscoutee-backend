# Part II continuous-video checkpoint chain

The 05:20 film uses one continuous production chain. `P00`, `CP00–CP38` and
`E01` are the 41 motion endpoints for forty eight-second Veo 3.1 Lite
intervals. Exact logo and editable typography are stabilized in post.

```text
P00 -> CP00 -> CP01 -> CP02 -> ... -> CP38 -> E01
opening       thirty-eight story intervals      closing breath
```

Rules:

- Canonical generated endpoints live only in `assets/frames/`.
- Keep `CP00–CP38` filenames stable; do not create numbered variants.
- Every interior checkpoint is the exact last frame of one interval and exact
  first frame of the next.
- Generate no midpoint stills, slideshow or four-second split frames.
- All checkpoints are 720×1280 PNG files.
- `CP00` is a lossless copy of Part I `CP22`.
- `P00→CP00` is the generated title transition and `CP38→E01` is the generated
  reflective closing transition.

Current generation progress:

| ID | Boundary | Asset | Status |
| --- | --- | --- | --- |
| CP00 | Lossless Part I handoff | `assets/frames/CP00.png` | canonical |
| CP01 | The network line becomes the ruled line of a blank form | `assets/frames/CP01.png` | generated |
| CP02 | The whole life before the institutional file | `assets/frames/CP02.png` | generated |
| CP03–CP15 | Work, forced contracting, tax chaos and the surviving line | `assets/frames/CP03.png`–`CP15.png` | generated |
| CP16–CP27 | Surgery, investigation, expert report, hearing and delay | `assets/frames/CP16.png`–`CP27.png` | generated |
| CP28–CP38 | AI-assisted defence, continued work, public context and open ending | `assets/frames/CP28.png`–`CP38.png` | generated |

Generation verification completed on 10 August 2026: all 39 canonical files
exist, all are distinct, and every frame is a 720×1280 PNG.

The older files under `assets/checkpoints/` are superseded composition studies,
not inputs to the new production chain.
