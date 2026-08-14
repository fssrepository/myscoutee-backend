# Facebook and YouTube captions

The English narration is canonical. Hungarian caption meaning is translated
from the locked English script under `book/TRANSLATION_LOCK.md`; it is not an
independent rewrite.

## Files

- `MYSCOUTEE_THE_PRODUCT_EN.srt` and `.vtt`: English correction/upload files;
- `MYSCOUTEE_THE_PRODUCT_HU.srt` and `.vtt`: Hungarian YouTube upload files;
- `MyScoutee_The_Product.en_US.srt`: optional Facebook English copy;
- `MyScoutee_The_Product.hu_HU.srt`: **Facebook Hungarian upload file**;
- `MYSCOUTEE_THE_PRODUCT_EN_TRANSCRIPT.txt`: clean English text for
  ElevenLabs, auto-sync and auto-caption correction.

## Facebook language filename

Facebook requires `filename.[language code]_[country code].srt`, with lower-case
language, upper-case country and case-sensitive naming. For Hungarian use:

```text
MyScoutee_The_Product.hu_HU.srt
```

Do not upload a Hungarian file named `.en_US.srt`; Facebook will interpret the
filename as US English. The rule is documented at
<https://www.facebook.com/help/www/1528795707381162> and the upload workflow at
<https://www.facebook.com/help/www/261764017354370>.

## YouTube

Upload the SRT or WebVTT under **Hungarian** in YouTube Studio. SRT must remain
plain UTF-8 text. YouTube accepts basic `.srt` and `.vtt`; the language is chosen
in Studio rather than encoded in the generic filename. See
<https://support.google.com/youtube/answer/2734698?hl=en> and
<https://support.google.com/youtube/answer/2734796?hl=en>.

English automatic captions may be used as a first pass, but compare every word
against the committed transcript—especially `MyScoutee`, `priority list`, and
`profile fit`. Automatic captions are not the Hungarian translation.

## Timing status

These cues target the expected `00:54.250` picture lock. Micro-retime them after
the final Jon waveform and final picture are locked. Keep at most two lines and
avoid the bottom slogan during approximately 00:51.75–00:54.25.
