# Reproducible tools

- `build_brand_frames.py`: builds deterministic transparent brand layers and
  branded first/last PNG references from the approved checkpoints. It only
  replaces checkpoint PNGs when called explicitly with
  `--rebuild-checkpoints`.
- `build_mini_book.py`: converts the canonical English Markdown and controlled
  Hungarian translation to illustrated HTML/PDF editions, then writes each
  checksum and publication record.
- `assemble_the_product.sh`: assembles the accepted S01 source, standalone S02
  and S03 renders, and S04–S07 from the accepted 48-second source; removes the
  repeated seven-frame seams and preserves the Flow audio with short boundary
  fades.
- `mix_the_product_narration.sh`: aligns one continuous Jon read at natural
  paragraph gaps, ducks the preserved Flow soundtrack, loudness-normalizes the
  result and stream-copies the accepted picture lock.
- `brand_the_product.sh`: fades the deterministic opening and closing brand
  layers over the moving narrated master while stream-copying its final audio.

Run from the repository root:

```bash
python3 guides/story/product-demo/scripts/build_brand_frames.py
python3 guides/story/product-demo/scripts/build_mini_book.py
```

After the replacement S02 and S03 renders are accepted:

```bash
guides/story/product-demo/scripts/assemble_the_product.sh \
  SHORT_24S.mp4 S02.mp4 S03.mp4 LONG_48S.mp4 OUTPUT.mp4
```

After exporting the complete ElevenLabs read:

```bash
guides/story/product-demo/scripts/mix_the_product_narration.sh \
  PICTURE_LOCK.mp4 JON_NARRATION.mp3 OUTPUT.mp4
```

Apply the final brand overlays only after the narration mix is accepted:

```bash
guides/story/product-demo/scripts/brand_the_product.sh \
  NARRATED_MASTER.mp4 BRANDED_MASTER.mp4
```
