#!/usr/bin/env python3
"""Join original P00–P03 with a four-frame P02/P03 dissolve; copy the rest.

Requires FFmpeg, ffprobe and NumPy. No geometry or colour correction is applied.
Run with --media-dir pointing to the four original p00.mp4–p03.mp4 files.
"""

import argparse
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile

sys.dont_write_bytecode = True

from p03_edit import (audio_hashes, check_equal, ffmpeg, frame_hashes,
                      require_video, run, transport)


def render_bridge(media, output):
    import numpy as np

    size = 1920 * 1080 * 3  # planar 10-bit YUV420, stored as uint16
    raw = ffmpeg("-threads", "2", "-ss", "14.75", "-i", media / "p02.mp4",
                 "-frames:v", "7", "-vsync", "0", "-f", "rawvideo",
                 "-pix_fmt", "yuv420p10le", "pipe:1").stdout
    check_equal(len(raw), 7 * size, "seven P02 tail frames")
    tail = [np.frombuffer(raw[i * size:(i + 1) * size], dtype="<u2") for i in range(7)]
    decoder = subprocess.Popen([
        "ffmpeg", "-v", "error", "-threads", "2", "-i", str(media / "p03.mp4"),
        "-frames:v", "176", "-vsync", "0", "-f", "rawvideo",
        "-pix_fmt", "yuv420p10le", "pipe:1"], stdout=subprocess.PIPE)
    encoder = None
    try:
        encoder = subprocess.Popen([
            "ffmpeg", "-v", "error", "-f", "rawvideo", "-pixel_format", "yuv420p10le",
            "-video_size", "1920x1080", "-framerate", "24", "-i", "pipe:0", "-an",
            "-c:v", "libx265", "-preset", "medium", "-x265-params",
            "pools=2:frame-threads=2:log-level=error:sao=0:strong-intra-smoothing=0:"
            "open-gop=0:keyint=120:min-keyint=120:scenecut=0",
            "-b:v", "30342392", "-pix_fmt", "yuv420p10le", "-tag:v", "hvc1",
            "-color_range", "tv", "-colorspace", "bt709", "-color_trc", "bt709",
            "-color_primaries", "bt709", "-y", str(output)], stdin=subprocess.PIPE)
        for frame in tail[:3]:
            encoder.stdin.write(frame.tobytes())
        for n in range(176):
            frame = decoder.stdout.read(size)
            check_equal(len(frame), size, f"P03 frame {n}")
            if n < 4:
                weight = (n + 1) / 5
                frame = np.rint((1 - weight) * tail[n + 3].astype(np.float64)
                                + weight * np.frombuffer(frame, dtype="<u2").astype(np.float64)
                                ).clip(0, 1023).astype("<u2").tobytes()
            encoder.stdin.write(frame)
        check_equal(decoder.wait(), 0, "P03 decoding")
        encoder.stdin.close()
        check_equal(encoder.wait(), 0, "bridge encoding")
    finally:
        for process in (decoder, encoder):
            if process is not None and process.poll() is None:
                process.terminate()
                try:
                    process.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    process.kill()
                    process.wait()


def adts_frames(path):
    data, result, position = path.read_bytes(), [], 0
    while position < len(data):
        header = data[position:position + 7]
        if len(header) != 7 or header[0] != 255 or header[1] & 240 != 240:
            raise ValueError(f"Invalid ADTS header in {path}")
        size = ((header[3] & 3) << 11) | (header[4] << 3) | (header[5] >> 5)
        if size < 7 or position + size > len(data):
            raise ValueError(f"Invalid ADTS frame in {path}")
        result.append(data[position:position + size])
        position += size
    return result


def local_audio(media, work):
    for name in ("p02", "p03"):
        ffmpeg("-i", media / f"{name}.mp4", "-vn", "-c:a", "copy", "-f", "adts",
               "-y", work / f"{name}.aac")
    # Five AAC frames = 0.16 s, within 7 ms of the four-frame picture overlap.
    filters = ("[0:a]atrim=end_sample=481280,asetpts=PTS-STARTPTS[a];"
               "[1:a]atrim=end_sample=481280,asetpts=PTS-STARTPTS[b];"
               "[a][b]acrossfade=ns=5120:c1=qsin:c2=qsin,"
               "atrim=start_sample=455680:end_sample=500736,asetpts=PTS-STARTPTS[out]")
    ffmpeg("-i", media / "p02.mp4", "-i", media / "p03.mp4", "-filter_complex", filters,
           "-map", "[out]", "-c:a", "aac", "-b:a", "288k", "-f", "adts",
           "-y", work / "encoded.aac")
    a, b, encoded = [adts_frames(work / name) for name in ("p02.aac", "p03.aac", "encoded.aac")]
    check_equal((len(a), len(b)), (472, 472), "source AAC packet counts")
    replacement = encoded[5:41]  # omit encoder priming and four preroll packets
    check_equal(len(replacement), 36, "local AAC replacement")
    (work / "audio.aac").write_bytes(b"".join(a[:450] + replacement + b[21:471]))


def transition(media, work):
    sources = [media / f"p0{i}.mp4" for i in range(4)]
    for path, count in zip(sources, (97, 361, 361, 361)):
        require_video(path, count)
    original = [frame_hashes(path) for path in sources]
    prefix, suffix, bridge = [work / f"{name}.mp4" for name in ("prefix", "suffix", "bridge")]
    ffmpeg("-i", sources[2], "-map", "0:v:0", "-frames:v", "354", "-c:v", "copy",
           "-y", prefix)
    ffmpeg("-ss", "7.333333333", "-i", sources[3], "-map", "0:v:0", "-c:v", "copy",
           "-y", suffix)
    check_equal(frame_hashes(prefix), original[2][:354], "safe P02 copied prefix")
    check_equal(frame_hashes(suffix), original[3][176:], "safe P03 copied suffix")
    if not bridge.exists():
        print("Encoding only the 179-frame boundary block; copying 997 other frames.", flush=True)
        render_bridge(media, bridge)
    else:
        print("Reusing the rendered boundary; no new picture encoding.", flush=True)
    require_video(bridge, 179)
    local_audio(media, work)
    for name, path in (("prefix", prefix), ("bridge", bridge), ("suffix", suffix)):
        transport(path, work / f"{name}.ts")
    manifest = work / "boundary.txt"
    manifest.write_text("file 'prefix.ts'\nduration 14.75\nfile 'bridge.ts'\n"
                        "duration 7.458333333\nfile 'suffix.ts'\nduration 7.708333333\n")
    boundary = work / "boundary.mp4"
    ffmpeg("-f", "concat", "-safe", "0", "-i", manifest, "-itsoffset", "-0.032",
           "-i", work / "audio.aac", "-map", "0:v:0", "-map", "1:a:0", "-c", "copy",
           "-bsf:a", "aac_adtstoasc", "-tag:v", "hev1", "-y", boundary)
    expected = original[2][:354] + frame_hashes(bridge) + original[3][176:]
    check_equal(frame_hashes(boundary), expected, "all boundary decoded frames")
    audio = audio_hashes(boundary)
    check_equal(audio[:450], audio_hashes(sources[2])[:450], "P02 copied AAC prefix")
    check_equal(audio[-450:], audio_hashes(sources[3])[21:471], "P03 copied AAC suffix")
    parts = [sources[0], sources[1], boundary]
    for i, path in enumerate(parts[:2]):
        transport(path, work / f"video{i}.ts")
        ffmpeg("-i", path, "-map", "0:a:0", "-c", "copy", "-f", "mpegts",
               "-y", work / f"audio{i}.ts")
    # Do not pass the mixed-parameter boundary MP4 through hevc_mp4toannexb again:
    # reinjecting its initial extradata at later IDRs can overwrite the new SPS/PPS.
    # Keep each original video TS segment and concatenate it exactly once.
    ffmpeg("-i", boundary, "-map", "0:a:0", "-c", "copy", "-f", "mpegts",
           "-y", work / "audio2.ts")
    audio_manifest = work / "all_audio.txt"
    audio_manifest.write_text("file 'audio0.ts'\nduration 4.041666667\n"
                              "file 'audio1.ts'\nduration 15.041666667\n"
                              "file 'audio2.ts'\nduration 29.916666667\n")
    manifest = work / "all.txt"
    manifest.write_text("file 'video0.ts'\nduration 4.041666667\n"
                        "file 'video1.ts'\nduration 15.041666667\n"
                        "file 'prefix.ts'\nduration 14.75\n"
                        "file 'bridge.ts'\nduration 7.458333333\n"
                        "file 'suffix.ts'\nduration 7.708333333\n")
    output = work / "verified.mp4"
    ffmpeg("-f", "concat", "-safe", "0", "-i", manifest,
           "-f", "concat", "-safe", "0", "-i", audio_manifest,
           "-map", "0:v:0", "-map", "1:a:0",
           "-c", "copy", "-bsf:a", "aac_adtstoasc", "-tag:v", "hev1",
           "-movflags", "+faststart", "-y", output)
    print("Checking copied picture/audio data and presentation timestamps...", flush=True)
    check_equal(frame_hashes(output), original[0] + original[1] + expected, "1176 output frames")
    check_equal(audio_hashes(output), sum((audio_hashes(p) for p in parts), []), "assembly AAC")
    packets = json.loads(run(["ffprobe", "-v", "error", "-select_streams", "v:0",
                              "-show_packets", "-show_entries", "packet=pts_time",
                              "-of", "json", output]).stdout)["packets"]
    times = sorted(float(p["pts_time"]) for p in packets)
    if any(abs(b - a - 1 / 24) > 0.0011 for a, b in zip(times, times[1:])):
        raise RuntimeError("Non-continuous video presentation timestamps")
    require_video(output, 1176)
    target = media / "p00_p03_transition.mp4"
    size = output.stat().st_size
    output.replace(target)
    print(f"Saved {target} ({size:,} bytes); originals unchanged.", flush=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--media-dir", type=Path, required=True)
    parser.add_argument("--resume-work", type=Path,
                        help="Reuse the private work directory printed after a failed validation")
    args = parser.parse_args()
    media = args.media_dir.resolve(strict=True)
    work = (args.resume_work.resolve(strict=True) if args.resume_work else
            Path(tempfile.mkdtemp(prefix=".p03-transition-", dir=media)))
    try:
        transition(media, work)
    except BaseException:
        print(f"Unpublished work retained for remux/validation retry: {work}", file=sys.stderr)
        raise
    else:
        if not args.resume_work:
            shutil.rmtree(work)


if __name__ == "__main__":
    try:
        main()
    except subprocess.CalledProcessError as exc:
        raise SystemExit(exc.stderr.decode(errors="replace") if exc.stderr else str(exc)) from exc
