# Part II English audiobook preview — chunks 001–007

This is a temporary public-preview assembly, not the final Part II audiobook.
It contains the seven accepted ElevenLabs chunks covered by the first credit
window. Generated audio and video remain outside Git under
`~/Downloads/audiobook/`.

## Inputs

- audio: `TSBU_2_EN_001.mp3` through `TSBU_2_EN_007.mp3`, in numeric order;
- base cover: `../cover/MyScoutee_The_Story_Part_II_The_System_Between_Us_Audiobook_Cover.png`;
- badge source: `../cover/Audiobook_Edition_Badge.svg`;
- badged cover: `../cover/MyScoutee_The_Story_Part_II_The_System_Between_Us_Audiobook_Cover_Badged.png`;
- voice: Jon — Warm & Grounded Storyteller, using the settings recorded in the
  audiobook manifest.

## Preview outputs

- `TSBU_2_EN_001-007.mp3`
  - duration: 1936.770612 seconds;
  - audio: original MP3 packets, 44.1 kHz mono at approximately 128 kbps;
  - embedded `AUDIOBOOK EDITION` front cover and English title/album/artist
    metadata;
  - SHA-256: `592620c987b01126c907cc1479fc457838ce6ae14d8a8b29b3df45d61b169d9d`.
- `TSBU_2_EN_001-007.mp4`
  - duration: 1936.760000 seconds;
  - video: H.264 High, 1920×1080, 25 fps, `yuv420p`;
  - audio: AAC-LC, 44.1 kHz mono at approximately 128 kbps;
  - continuous-program loudness: approximately -16.4 LUFS, -1.5 dBTP;
  - `faststart` metadata enabled for web playback;
  - SHA-256: `15b91f9093a3f55ff3de7fd183eaa39f00b52d506b89c89d09c77ae02020d539`.

The MP4 uses the dark cover itself at full frame height over a subdued,
blurred extension of the same artwork. The white PDF-page margin is cropped
from the video composition. `AUDIOBOOK EDITION` appears in a gold-outlined
badge between the MyScoutee wordmark and `MYSCOUTEE TRILOGY`; its type is
smaller than the wordmark and larger than the trilogy line. The committed base
cover is unchanged, and the same badge is embedded in the MP3 album artwork.

The final complete audiobook still requires all 35 accepted chunks, explicit
chapter pauses, boundary review and one final continuous master as specified
in the shared audiobook production guide.
