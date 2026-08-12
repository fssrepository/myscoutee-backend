# Part I frame sources

This directory keeps the durable source assets for the Part I opening and
ending frames. Canonical delivery frames remain under `assets/frames/`.

- `M1_P00.svg` and `M1_P00-background.png` are the editable sources for
  `assets/frames/M1_P00.png`.
- `M1_E01-source.png` is the full-resolution approved source for the current
  `assets/frames/M1_E01.png`.
- `M1_E01-legacy.svg` is the earlier title-card layout retained from the
  original production commit. It does not reconstruct the current approved
  `M1_E01.png`, which replaced that layout later in the production session.

SVG references are repository-relative and therefore expect reconstruction
tools to be invoked from the repository root.
