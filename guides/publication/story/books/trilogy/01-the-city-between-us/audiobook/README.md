# The City Between Us — English audiobook

This package is the complete speech-ready English adaptation of the locked
Part I public edition. It includes the cover/front matter, the full memoir,
end notes and colophon. It is not a summary or a replacement manuscript.

## Repository contents

- `source/`: one continuous spoken master derived from the locked English
  manuscript;
- `chunks/`: ordered ElevenLabs copy/paste inputs, each no more than 4,950
  characters;
- `tracking/AUDIOBOOK_MANIFEST.json`: source hashes, voice lock and totals;
- `tracking/CHUNK_MANIFEST.csv`: generation order, expected MP3 names and
  progress status;
- `cover/`: the first page of the locked public PDF, rasterized for the final
  static-cover video.

All generated MP3, WAV and MP4 files stay under `~/Downloads/audiobook/` and
are never copied into this repository.

Part I is production priority 2. Generate it only after the complete Part II
audiobook, beginning with `TCBU_1_EN_001.txt` and saving the accepted result as
`TCBU_1_EN_001.mp3`. Continue in numeric order without changing Jon's settings.
The shared settings and credit-safe procedure are in
[`AUDIOBOOK_PRODUCTION.md`](../../../audiobook-production.md).

Rebuild both packages from the repository root with:

```bash
python3 guides/publication/story/books/build-audiobooks.py
```

Do not edit the generated master or chunk text directly. A conversion defect
belongs in the shared builder; a book-text correction requires a new published
book edition rather than a silent audiobook-only rewrite.
