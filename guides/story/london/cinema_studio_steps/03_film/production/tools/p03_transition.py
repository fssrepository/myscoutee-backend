#!/usr/bin/env python3
"""Join original P00–P03 with a four-frame P02/P03 dissolve; copy the rest.

Requires FFmpeg, ffprobe and NumPy. No geometry or colour correction is applied.
Run with --media-dir pointing to the four original p00.mp4–p03.mp4 files.
"""

import argparse
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile

sys.dont_write_bytecode = True

from p03_edit import (audio_hashes, check_equal, ffmpeg, frame_hashes,
                      probe, require_video, run, transport)

COMPAT_HEADERS = "hevc_metadata=level=4.1:chroma_sample_loc_type=0:aud=insert"


def normalize_headers(media, work):
    """Prevent VLC decoder restarts on level changes, without encoding pixels."""
    source = media / "p00_p03_transition.mp4"
    output = work / "compatible.mp4"
    ffmpeg("-i", source, "-map", "0:v:0", "-map", "0:a:0", "-c", "copy",
           "-bsf:v", COMPAT_HEADERS, "-tag:v", "hev1", "-movflags", "+faststart",
           "-y", output)
    check_equal(frame_hashes(output), frame_hashes(source), "header-only picture preservation")
    check_equal(audio_hashes(output), audio_hashes(source), "header-only audio preservation")
    output.replace(source)
    print(f"Updated {source}: headers only; no video or audio encoding.", flush=True)


def render_bridge(media, output, outgoing="p02.mp4", incoming="p03.mp4",
                  cut_frame=354, source_frames=361, head_frames=176):
    import numpy as np

    video = next(s for s in probe(media / incoming)["streams"] if s["codec_type"] == "video")
    bitrate = str(int(video["bit_rate"]))
    size = 1920 * 1080 * 3  # planar 10-bit YUV420, stored as uint16
    tail_frames = source_frames - cut_frame
    raw = ffmpeg("-threads", "2", "-ss", f"{cut_frame / 24:.9f}", "-i", media / outgoing,
                 "-frames:v", str(tail_frames), "-vsync", "0", "-f", "rawvideo",
                 "-pix_fmt", "yuv420p10le", "pipe:1").stdout
    check_equal(len(raw), tail_frames * size, "outgoing tail frames")
    tail = [np.frombuffer(raw[i * size:(i + 1) * size], dtype="<u2") for i in range(tail_frames)]
    lead = tail_frames - 4
    decoder = subprocess.Popen([
        "ffmpeg", "-v", "error", "-threads", "2", "-i", str(media / incoming),
        "-frames:v", str(head_frames), "-vsync", "0", "-f", "rawvideo",
        "-pix_fmt", "yuv420p10le", "pipe:1"], stdout=subprocess.PIPE)
    encoder = None
    try:
        encoder = subprocess.Popen([
            "ffmpeg", "-v", "error", "-f", "rawvideo", "-pixel_format", "yuv420p10le",
            "-video_size", "1920x1080", "-framerate", "24", "-i", "pipe:0", "-an",
            "-c:v", "libx265", "-preset", "medium", "-x265-params",
            "pools=2:frame-threads=2:log-level=error:sao=0:strong-intra-smoothing=0:"
            "open-gop=0:keyint=120:min-keyint=120:scenecut=0",
            "-b:v", bitrate, "-pix_fmt", "yuv420p10le", "-tag:v", "hvc1",
            "-color_range", "tv", "-colorspace", "bt709", "-color_trc", "bt709",
            "-color_primaries", "bt709", "-y", str(output)], stdin=subprocess.PIPE)
        for frame in tail[:lead]:
            encoder.stdin.write(frame.tobytes())
        for n in range(head_frames):
            frame = decoder.stdout.read(size)
            check_equal(len(frame), size, f"P03 frame {n}")
            if n < 4:
                weight = (n + 1) / 5
                frame = np.rint((1 - weight) * tail[n + lead].astype(np.float64)
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


def all_audio(media, work):
    """Three equal short joins; preserve AAC payloads outside their small windows."""
    packets = []
    for i in range(4):
        source, target = media / f"p0{i}.mp4", work / f"source{i}.aac"
        ffmpeg("-i", source, "-vn", "-c:a", "copy", "-f", "adts", "-y", target)
        frames = adts_frames(target)
        check_equal(len(frames), 128 if i == 0 else 472, "original AAC packet count")
        hashes = ["SHA256:" + hashlib.sha256(f[7:]).hexdigest() for f in frames]
        check_equal(hashes, audio_hashes(source), "original AAC extraction")
        packets.append(frames)
    replacements = []
    for i, full_frames in enumerate((126, 470, 470)):
        filters = (f"[0:a]atrim=end_sample={full_frames * 1024},asetpts=PTS-STARTPTS[a];"
                   "[1:a]atrim=end_sample=481280,asetpts=PTS-STARTPTS[b];"
                   "[a][b]acrossfade=ns=5120:c1=qsin:c2=qsin,"
                   f"atrim=start_sample={(full_frames - 25) * 1024}:"
                   f"end_sample={(full_frames + 19) * 1024},asetpts=PTS-STARTPTS[out]")
        encoded = work / f"audio_join{i}.aac"
        ffmpeg("-i", media / f"p0{i}.mp4", "-i", media / f"p0{i+1}.mp4",
               "-filter_complex", filters, "-map", "[out]", "-c:a", "aac", "-b:a", "288k",
               "-f", "adts", "-y", encoded)
        replacement = adts_frames(encoded)[5:41]
        check_equal(len(replacement), 36, "36 AAC packets per transition")
        replacements.append(replacement)
    result = (packets[0][:106] + replacements[0] + packets[1][21:450] + replacements[1]
              + packets[2][21:450] + replacements[2] + packets[3][21:471])
    check_equal(len(result), 1522, "complete joined soundtrack")
    (work / "all_audio.aac").write_bytes(b"".join(result))
    return ["SHA256:" + hashlib.sha256(f[7:]).hexdigest() for f in result]


def all_transitions(media, work):
    """The recorded four-clip recipe: identical moving dissolves at all three joins."""
    sources = [media / f"p0{i}.mp4" for i in range(4)]
    for path, count in zip(sources, (97, 361, 361, 361)):
        require_video(path, count)
    original = [frame_hashes(path) for path in sources]
    prefix, suffix = work / "prefix0.mp4", work / "suffix3.mp4"
    ffmpeg("-i", sources[0], "-map", "0:v:0", "-frames:v", "92", "-c:v", "copy",
           "-y", prefix)
    ffmpeg("-ss", "7.333333333", "-i", sources[3], "-map", "0:v:0", "-c:v", "copy",
           "-y", suffix)
    check_equal(frame_hashes(prefix), original[0][:92], "copied P00 prefix")
    check_equal(frame_hashes(suffix), original[3][176:], "copied P03 suffix")
    for i in (1, 2):
        end_cut, middle = work / f"p0{i}_prefix.mp4", work / f"middle{i}.mp4"
        ffmpeg("-i", sources[i], "-map", "0:v:0", "-frames:v", "354", "-c:v", "copy",
               "-y", end_cut)
        # CRA at display frame 250 precedes four RASL pictures in packet order.
        # Those leading pictures belong before this cut and must not reappear.
        ffmpeg("-ss", "10.416666667", "-i", end_cut, "-map", "0:v:0", "-c:v", "copy",
               "-bsf:v", "filter_units=remove_types=8|9", "-y", middle)
        check_equal(frame_hashes(middle), original[i][250:354], f"copied P0{i} middle")
    for i, cut, count, head in ((0, 92, 97, 250), (1, 354, 361, 250), (2, 354, 361, 176)):
        bridge = work / f"bridge{i}.mp4"
        if not bridge.exists():
            print(f"Rendering only P0{i}/P0{i+1} boundary from originals...", flush=True)
            render_bridge(media, bridge, f"p0{i}.mp4", f"p0{i+1}.mp4", cut, count, head)
        else:
            print(f"Reusing completed boundary {i}; no picture encoding.", flush=True)
        require_video(bridge, count - cut + head - 4)
    expected_audio = all_audio(media, work)
    names = ["prefix0", "bridge0", "middle1", "bridge1", "middle2", "bridge2", "suffix3"]
    counts = [92, 251, 104, 253, 104, 179, 185]
    for name in names:
        transport(work / f"{name}.mp4", work / f"{name}.ts")
    manifest = work / "all_joins.txt"
    manifest.write_text("".join(f"file '{name}.ts'\nduration {count / 24:.9f}\n"
                               for name, count in zip(names, counts)))
    output = work / "all_joins_verified.mp4"
    ffmpeg("-f", "concat", "-safe", "0", "-i", manifest, "-itsoffset", "-0.032",
           "-i", work / "all_audio.aac", "-map", "0:v:0", "-map", "1:a:0", "-c", "copy",
           "-bsf:v", COMPAT_HEADERS, "-bsf:a", "aac_adtstoasc", "-tag:v", "hev1",
           "-movflags", "+faststart", "-y", output)
    expected = (original[0][:92] + frame_hashes(work / "bridge0.mp4") + original[1][250:354]
                + frame_hashes(work / "bridge1.mp4") + original[2][250:354]
                + frame_hashes(work / "bridge2.mp4") + original[3][176:])
    print("Checking complete decode, copied pictures/audio and timestamps...", flush=True)
    check_equal(frame_hashes(output), expected, "all 1168 picture frames")
    check_equal(audio_hashes(output), expected_audio, "all 1522 audio packets")
    data = json.loads(run(["ffprobe", "-v", "error", "-select_streams", "v:0",
                          "-show_packets", "-show_entries", "packet=pts_time",
                          "-of", "json", output]).stdout)["packets"]
    times = sorted(float(p["pts_time"]) for p in data)
    if any(abs(b - a - 1 / 24) > 0.0011 for a, b in zip(times, times[1:])):
        raise RuntimeError("Non-continuous video presentation timestamps")
    require_video(output, 1168)
    output.replace(media / "p00_p03_transition.mp4")
    print("Saved p00_p03_transition.mp4: all three joins use the same four-frame dissolve.",
          flush=True)


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
           "-c", "copy", "-bsf:a", "aac_adtstoasc", "-bsf:v", COMPAT_HEADERS,
           "-tag:v", "hev1",
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
    parser.add_argument("--all-joins", action="store_true",
                        help="Use the four-frame dissolve at P00/P01, P01/P02 and P02/P03")
    parser.add_argument("--normalize-only", action="store_true",
                        help="Normalize the existing assembly's HEVC headers, without any encoding")
    parser.add_argument("--resume-work", type=Path,
                        help="Reuse the private work directory printed after a failed validation")
    args = parser.parse_args()
    if args.all_joins and args.normalize_only:
        parser.error("--all-joins and --normalize-only are separate operations")
    media = args.media_dir.resolve(strict=True)
    work = (args.resume_work.resolve(strict=True) if args.resume_work else
            Path(tempfile.mkdtemp(prefix=".p03-transition-", dir=media)))
    try:
        if args.normalize_only:
            normalize_headers(media, work)
        elif args.all_joins:
            all_transitions(media, work)
        else:
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
