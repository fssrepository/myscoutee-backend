# Facebook and YouTube captions

The English narration is canonical. Hungarian caption meaning is translated
from the locked English script under `book/TRANSLATION_LOCK.md`; it is not an
independent rewrite.

## Files

- `MyScoutee_The_Product.en_US.srt`: single English upload file for Facebook
  and YouTube;
- `MyScoutee_The_Product.hu_HU.srt`: single Hungarian upload file for Facebook
  and YouTube;
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

Upload `MyScoutee_The_Product.hu_HU.srt` under **Hungarian** in YouTube Studio.
The same file is used for Facebook; YouTube does not require a separate copy or
generic filename. SRT must remain plain UTF-8 text. See
<https://support.google.com/youtube/answer/2734698?hl=en> and
<https://support.google.com/youtube/answer/2734796?hl=en>.

English automatic captions may be used as a first pass, but compare every word
against the committed transcript—especially `MyScoutee`, `priority list`, and
`profile fit`. Automatic captions are not the Hungarian translation.

## Timing status

These cues are locked to the final `00:54.250` narrated master and the actual
continuous Jon waveform. The four spoken blocks begin at `00:00.250`,
`00:15.417`, `00:30.833` and `00:46.250`; no speech was time-stretched. Every
cue uses at most two lines, and the final cue clears at `00:52.950` so the last
branded beat can breathe.
