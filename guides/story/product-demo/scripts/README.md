# Reproducible tools

- `build_brand_frames.py`: normalizes all seven product-demo-owned generated
  checkpoints and builds deterministic branded first/last PNG references using
  the untouched repository logo.
- `build_mini_book.py`: converts the canonical English Markdown and controlled
  Hungarian translation to illustrated HTML/PDF editions, then writes each
  checksum and publication record.

Run from the repository root:

```bash
python3 guides/story/product-demo/scripts/build_brand_frames.py
python3 guides/story/product-demo/scripts/build_mini_book.py
```
