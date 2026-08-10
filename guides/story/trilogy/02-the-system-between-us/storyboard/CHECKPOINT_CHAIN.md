# Part II continuous-video checkpoint chain

The 05:20 film uses one continuous production chain. `CP00–CP38` are the 39
motion endpoints for thirty-eight eight-second Veo 3.1 Lite intervals. `P00`
and `E01` are deterministic post-production plates and consume no video-model
credit.

```text
P00    CP00 -> CP01 -> CP02 -> ... -> CP38    E01
post          thirty-eight intervals          post
```

Rules:

- Canonical generated endpoints live only in `assets/frames/`.
- Keep `CP00–CP38` filenames stable; do not create numbered variants.
- Every interior checkpoint is the exact last frame of one interval and exact
  first frame of the next.
- Generate no midpoint stills, slideshow or four-second split frames.
- All checkpoints are 720×1280 PNG files.
- `CP00` is a lossless copy of Part I `CP22`.
- `CP38` is the last generated-motion endpoint; `E01` is assembled in post.

Current generation progress:

| ID | Boundary | Asset | Status |
| --- | --- | --- | --- |
| CP00 | Lossless Part I handoff | `assets/frames/CP00.png` | canonical |
| CP01 | The network line becomes the ruled line of a blank form | `assets/frames/CP01.png` | generated |
| CP02 | The whole life before the institutional file | `assets/frames/CP02.png` | generated |
| CP03–CP38 | Remaining chronological Part II boundaries | `assets/frames/` | pending |

The older files under `assets/checkpoints/` are superseded composition studies,
not inputs to the new production chain.
