# Rough storyboard frames

These 9:16 checkpoint frames support the 02:48 continuous-video storyboard
preview. They are planning images, not approved production plates.

- `CP00`–`CP22` use a fictional Founder identity placeholder generated for this
  rough; they do not depict or replace the real founder reference.
- `CP23` is assembled deterministically from the repository brand asset and
  editable text; it is not AI-generated.
- Labels and action summaries are burned into the 56 review images by the
  slideshow build script, not by the image model.
- Keep only the selected rough frame for each shot. Do not commit discarded
  variants or rejected render exports.

See [`../../CHECKPOINT_CHAIN.md`](../../storyboard/CHECKPOINT_CHAIN.md). Run
`../../scripts/build_checkpoint_slideshow.sh` to rebuild the captioned
`../storyboard-3s/F00.jpg`–`F55.jpg` set and the exact 02:48 MP4.
