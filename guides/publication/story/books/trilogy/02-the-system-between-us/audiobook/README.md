# The System Between Us — English audiobook

This package is the complete speech-ready English adaptation of the locked
Part II public edition. It includes the cover/front matter, dedication, full
memoir, end notes and Part III boundary. It is not a summary or a replacement
manuscript.

## Repository contents

- `source/`: one continuous spoken master derived from the locked English
  manuscript;
- `chunks/`: ordered ElevenLabs copy/paste inputs, each no more than 4,950
  characters;
- `tracking/AUDIOBOOK_MANIFEST.json`: source hashes, voice lock and totals;
- `tracking/CHUNK_MANIFEST.csv`: generation order, expected MP3 names and
  progress status;
- `cover/`: the first page of the locked public PDF, plus the reusable
  `AUDIOBOOK EDITION` badge and the derived badged artwork used by the MP3 and
  static-cover video.

All generated MP3, WAV and MP4 files stay under `~/Downloads/audiobook/` and
are never copied into this repository.

This is production priority 1. Begin with `TSBU_2_EN_001.txt` and save the
accepted result as `TSBU_2_EN_001.mp3`. The current 30,607-credit window covers
chunks 1–7; chunk 7 is intentionally shorter and chunk 8 resumes at the next
natural paragraph. Continue in numeric order without changing Jon's settings.
The shared settings and credit-safe procedure are in
[`AUDIOBOOK_PRODUCTION.md`](../../../audiobook-production.md).

Rebuild both packages from the repository root with:

```bash
python3 guides/publication/story/books/build-audiobooks.py
```

Do not edit the generated master or chunk text directly. A conversion defect
belongs in the shared builder; a book-text correction requires a new published
book edition rather than a silent audiobook-only rewrite.
