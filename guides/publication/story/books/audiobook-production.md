# Parts I–II English audiobook production

This workflow creates two complete English audiobook editions, one for each
published Story book. Each finished book becomes a separate static-cover MP4
for YouTube and Facebook. The published PDFs and manuscripts remain locked;
the audiobook packages are derived delivery material.

## Content boundary

The spoken masters preserve the complete English reading text:

- title, subtitle, edition and publication information;
- Part II dedication;
- each Note to the Reader, prologue, part, chapter and epilogue;
- the closing invitation, evidence/context notes and colophon.

The conversion removes only page-break and illustration anchors, Markdown
syntax and raw URL strings. Named statutes, papers and repositories remain in
the reading text. A raw `Sources:` list becomes the spoken sentence `Source
links are listed in the accompanying print edition.` The URLs remain available
in the locked PDF.

## Jon audiobook lock

Use one voice and one setting set across both books:

| Setting | Value |
| --- | --- |
| voice | **Jon — Warm & Grounded Storyteller** |
| model | `Eleven Multilingual v2` |
| model ID | `eleven_multilingual_v2` |
| speed | `0.96` |
| stability | `65` |
| similarity | `60` |
| style exaggeration | `0` |
| speaker boost | `Off` |

This is deliberately calmer and more stable than the short films while
preserving Jon's accepted timbre. Style remains zero because ElevenLabs warns
that style exaggeration can increase instability, inconsistent speed and
mispronunciation over long-form generation. Record the live voice ID and model
version in each `AUDIOBOOK_MANIFEST.json` when they become visible.

Performance direction: warm, grounded and attentive, as if reading to one
person. Do not perform it as a trailer, advertisement or legal recital. Let
chapter headings breathe. Keep the same settings between every chunk; use the
text, punctuation and paragraph breaks for emotional movement.

## Generated package size

The package builder reserves a small safety margin under the paid website's
5,000-character generation limit.

| Book | Chunks | Generation characters | Approximate read at 150 wpm |
| --- | ---: | ---: | ---: |
| Part I — *The City Between Us* | 21 | 96,807 | 1 h 46 min |
| Part II — *The System Between Us* | 35 | 159,937 | 2 h 50 min |
| **Total** | **56** | **256,744** | **4 h 36 min** |

The 30,607-credit balance reported on 15 August 2026 is reserved for Part II,
because its existing film covers only part of the book. With Multilingual v2 at
a normal `1×` voice rate, Part II chunks `TSBU_2_EN_001` through `TSBU_2_EN_007`
use 30,565 characters and leave only 42 credits. Chunk 7 has a deliberate
natural paragraph-boundary split for this first credit window; chunk 8 resumes
the same chapter. Part I follows only after the complete Part II audiobook.
The total project therefore needs later monthly credits or top-up.
Check the credit amount shown by ElevenLabs before every generation because a
shared Voice Library voice may carry its own multiplier.

Flash v2.5 would normally charge half a credit per character, but even then the
complete pair would need about 128,372 credits. It is not the production lock:
Multilingual v2 is ElevenLabs' long-form audiobook/content-creation model and
matches the already accepted Jon voice.

## Credit-safe generation

1. Start with `TSBU_2_EN_001.txt`. It includes the actual title/front matter and
   beginning of the book, so an accepted test is also the first deliverable.
2. Paste one chunk without adding directions to the spoken text.
3. Confirm Jon, Multilingual v2 and the locked sliders before selecting
   **Generate**.
4. Listen to the opening, proper names, paragraph transitions and last sentence.
   If only the sliders need adjustment, keep the page open: ElevenLabs currently
   permits two free regenerations in Speech Synthesis when text, voice and model
   stay unchanged.
5. Download the accepted result with the exact manifest filename, for example
   `TSBU_2_EN_001.mp3`. Prefer the highest-quality export offered by the plan.
6. Update only the row's `status` in `CHUNK_MANIFEST.csv`; do not edit generated
   speech text by hand or normalize separate chunks.

Downloaded audio and final MP4 files remain together under
`~/Downloads/audiobook/`, outside Git. The repository stores only the
deterministic spoken masters, chunks, manifests, workflow and cover images.

Official references checked 15 August 2026:

- <https://elevenlabs.io/docs/help-center/product/speech-synthesis/text-to-speech/whats-the-maximum-amount-of-characters-and-text-i-can-generate>
- <https://help.elevenlabs.io/hc/en-us/articles/27562020846481-What-are-credits>
- <https://elevenlabs.io/docs/overview/models>
- <https://elevenlabs.io/docs/resources>
- <https://help.elevenlabs.io/hc/en-us/articles/13313564601361-Can-I-publish-the-content-I-generate-on-the-platform>

## Final assembly

After every chunk of one part is accepted:

1. verify filenames, order, sample rate, duration and audible defects;
2. decode once to PCM, join only at natural paragraph/chapter boundaries and
   use short transparent fades so there are no clicks or hard tonal jumps;
3. keep short pauses between ordinary chunks and longer pauses at chapters and
   parts;
4. master the continuous voice once, without background music;
5. create a chapter/timestamp list from final measured durations;
6. encode one MP4 with that part's committed cover image and the final audio.

The exact assembly command and loudness values are locked only after the first
accepted Jon chunks can be measured. Do not re-encode the downloaded chunks
individually.

The committed covers are direct 150 dpi first-page renders of the locked PDFs.
Recreate one by running `pdftoppm` with `-f 1 -l 1 -singlefile -png -r 150`,
using the published PDF as input and the cover filename without its `.png`
suffix as output prefix.
