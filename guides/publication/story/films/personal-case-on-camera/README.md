# Personal case on camera: local recording setup

**Status:** current setup on the author's Ubuntu workstation, 28 October 2026.
This folder records how the on-camera account of the author's case was prepared.
It does not supply case facts or a script for the account. The existing
[Part II source and publication boundary](../google-flow/the-system-between-us/overview/START_HERE.md)
remain the authority for the story.

## Apply the same local setup

Close OBS, then run from this directory:

```bash
bash setup_recording.sh
```

This **changes the local host**: it adds the current user to `/home`'s access
ACL if necessary (through a graphical `pkexec` prompt), selects the laptop
headphone sink for playback, and edits the current user's OBS `Untitled`
profile and scene collection. The OBS files are backed up alongside the
originals before any changed file is written. The script expects the DJI
Pocket 3, the named Intel GPU render node, and this workstation's existing
OBS scene. It does not install VLC or create an OBS scene from scratch.

The wrapper calls [configure_obs.py](configure_obs.py), which can also target a
copy of the OBS configuration with `--config-dir` for a safe trial. It creates
three matched OBS profiles and scene collections:

| Choice | Camera input | OBS canvas/output |
| --- | --- | --- |
| `4k` | 3840 × 2160 MJPEG | 3840 × 2160, 16:9 |
| `1080p-landscape` | 1920 × 1080 MJPEG | 1920 × 1080, 16:9 |
| `1080p-portrait` | 1080 × 1920 MJPEG | 1080 × 1920, 9:16 |

Close OBS before switching choices. For example, run
`bash start_obs.sh 1080p-portrait` from this directory. The
[start_obs.sh](start_obs.sh) launcher selects both the matching OBS **Profile**
and **Scene Collection**. Changing only the Profile in an open OBS window does
not change the camera source's USB video format; select the identically named
Scene Collection too. The existing `Untitled` profile and collection are
retained as the original 4K setup. Restart OBS after applying the setup. If
VLC was already open, restart it to pick up the default playback sink.

## What the scripts reproduce

| Area | Setting or fix |
| --- | --- |
| VLC Snap startup | Grant the current user `r-x` access to `/home` if missing; the Snap launcher previously failed without it. |
| VLC playback | Select the laptop headphone output instead of the DJI USB audio output. |
| OBS camera input | DJI Pocket 3 USB webcam, `/dev/video2`, MJPEG; 3840 × 2160, 1920 × 1080, or 1080 × 1920 at 30 fps according to the chosen preset. |
| OBS scene | Matching canvas and output at 30 fps; camera at 100% scale, top left, no crop. |
| OBS recording | Advanced mode, hardware FFmpeg VAAPI H.264 on the Intel render node, CBR 20 Mb/s, MP4. |
| OBS audio | DJI USB microphone as the unmuted `Mic/Aux` source, AAC recording, 48 kHz. |
| Colour | NV12, Rec. 709, partial range; no colour filter was added. |

The camera's H.264 **input** mode failed with a V4L2 buffer error on this
machine; the working MJPEG input is decoded by OBS. The recording is still
encoded in H.264 by the GPU. The previous Quick Sync recording encoder failed
with `MFX_ERR_DEVICE_FAILED`, so the setup uses VAAPI.

The `Aspect Ratio 16:9` text in OBS **Settings → Video** is calculated from
the canvas resolution; it is not a separate switch. Rotating the Pocket 3 or
its screen did not change the OBS webcam picture to portrait on this machine.
The `1080p-portrait` preset explicitly requests the camera's advertised
1080 × 1920 MJPEG mode and sets the canvas/output to 9:16. The USB device
advertised 3840 × 2160 only in landscape, so there is no native 4K portrait
webcam preset; upscaling 1080 × 1920 would not add detail.

## Pair the clipped DJI Mic 2 with Pocket 3

The setup script selects Pocket 3's USB audio input in OBS. Pairing the separate
Mic 2 transmitter is done on the camera, not by connecting the transmitter's
USB-C port to the computer. A Creator Combo transmitter may already be paired:
turn it on by holding its power button for two seconds, then check for a solid
blue status LED and the camera's input level bar.

If it is not paired:

1. Unplug the Pocket 3's USB cable from the computer so it leaves Webcam mode.
   On the camera's own touchscreen, swipe down from the top, tap the
   gear-shaped **Settings** icon, then open **Wireless Mic → TX1** (or TX2).
   This was necessary here because the pairing menu could not be selected
   while the camera was connected in Webcam mode.
2. Hold the transmitter's power button for two seconds. If its status LED is
   green, hold the round record button for three seconds to switch to Bluetooth
   mode.
3. Hold the transmitter's linking button for two seconds. Its status LED should
   flash blue quickly while pairing, then stay blue when connected.
4. Check the camera's input level bar. Reconnect the USB cable and select
   **Webcam** on the Pocket 3 again. In OBS, speak into the clipped mic and
   make a short recording; play it back to confirm that webcam mode actually
   passes the Mic 2 voice through Pocket 3's USB audio input. The OBS meter
   moving by itself does not identify which microphone supplied the sound.

If the USB cable was disconnected while OBS was open, reconnecting it may
restore the picture without restoring OBS's microphone stream. Restart OBS,
then check that `Mic/Aux` responds to speech before recording again. This
happened during the pairing attempt on this workstation.

The system's **Output Device** (`Headphones - sof-hda-dsp`) controls where VLC
plays sound. OBS's `Mic/Aux` source is separately configured to capture the
DJI input (`Analog Input - DJIPocket3`), which is also selected as the system
input. Selecting headphones for playback does not disable recording from the
DJI input. If OBS meters move but a recording seems silent in VLC,
check that VLC's playback volume is up and that it uses the headphone output;
then record and listen to a fresh 10–15 second speech test. An AAC track or a
moving meter alone does not prove that the clipped Mic 2 was recorded.

The [DJI Pocket 3 manual](https://dl.djicdn.com/downloads/DJI_Osmo_Pocket_3/UM/20250826/DJI_Osmo_Pocket_3_User_Manual_v1.0_en.pdf)
documents the pairing sequence and LED states.

## Verification and remaining checks

OBS was restarted with a 3840 × 2160/30 canvas and a 3840 × 2160/30 MJPEG
camera source. A separate VAAPI test recording contained 3840 × 2160/30 H.264
video and an AAC audio stream. A later four-second MP4 from the actual scene
also measured 3840 × 2160/30, about 20.3 Mb/s H.264 and 160 kb/s AAC. Its
audio signal was nonzero, but headphone playback and speech quality still
require listening.

The OBS window displays that 4K canvas at a much smaller preview size. The
actual MP4 frame also shows some grain in the dark curtain, so the effect is
not confined to the preview. The dim subject and darker background make camera
gain in low light a plausible cause; the saved file alone cannot separate
camera noise from compression. Add soft light in front of the face and compare
a new short take before changing OBS bitrate or adding noise reduction. In
webcam mode, the Pocket 3 exposes its Exposure controls by swiping left from
the right edge of its screen, as described in the
[DJI user manual](https://dl.djicdn.com/downloads/DJI_Osmo_Pocket_3/UM/20250826/DJI_Osmo_Pocket_3_User_Manual_v1.0_en.pdf).

Before an important take, record 10–15 seconds of speech, then play the file
in VLC through the intended headphones. Check the picture framing, audible
voice, 3840 × 2160 resolution, and 30 fps. The OBS `Mic/Aux` meter alone does
not prove that playback is audible. At 20 Mb/s, video uses roughly 9 GB per
hour, excluding audio and container overhead.

The DJI's small display looked more vivid than the OBS preview and earlier
MP4. No same-frame comparison has been provided, so the colour difference is
still unresolved; the scripts do not guess at a correction. Camera pan was
tested and restored, so it is not part of the reproducible setup.
