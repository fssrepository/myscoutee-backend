#!/usr/bin/env python3
"""Reproduce the recorded P03 opening correction, or concatenate clips by copy.

Requires ffmpeg/ffprobe; the fix command additionally requires NumPy and OpenCV.
Original p00.mp4 through p03.mp4 are never overwritten. See the production README.
"""

import argparse
import json
from pathlib import Path
import subprocess
import tempfile


WIDTH, HEIGHT, FPS = 1920, 1080, 24
HEAD_FRAMES, TOTAL_FRAMES = 168, 361
MATRIX = [[1.014711517037021, -0.001650698165160679, 2.7279979513516137],
          [0.001650698165160679, 1.014711517037021, 1.6022900500953343]]
CHROMA = [[1.014711517037021, -0.001650698165160679, 1.367264180393772],
          [0.001650698165160679, 1.014711517037021, 0.8052355788482126]]
GRADE = [(1.0501197581387722, -41.15201880260138),
         (1.0179209131189408, -6.4400212624719915),
         (1.0302460501176716, -16.614469773527233)]
VERTICAL = [1.4818956852313931, -0.13057386495533302, 0.5193748248418675,
            2.0751024531865476, 1.1500932541149118, 1.2769783780670259,
            1.3839332077478386, 2.046457979083374, 0.673420906273547,
            0.6073183908659585, 0.058070323235499544, 0.1383465873203633, 0.0]


def run(args):
    return subprocess.run([str(a) for a in args], check=True, capture_output=True)


def ffmpeg(*args):
    return run(["ffmpeg", "-v", "error", *args])


def probe(path):
    return json.loads(run(["ffprobe", "-v", "error", "-show_streams",
                           "-show_format", "-of", "json", path]).stdout)


def require_video(path, frames=None):
    data = probe(path)
    video = next(s for s in data["streams"] if s["codec_type"] == "video")
    actual = (video["width"], video["height"], video["pix_fmt"], video["r_frame_rate"])
    if actual != (WIDTH, HEIGHT, "yuv420p10le", "24/1"):
        raise ValueError(f"Unexpected video format in {path}: {actual}")
    if frames is not None and int(video.get("nb_frames", -1)) != frames:
        raise ValueError(f"Expected {frames} frames in {path}")


def frame_hashes(path):
    result = ffmpeg("-threads", "2", "-i", path, "-map", "0:v:0", "-vsync", "0",
                    "-f", "framemd5", "pipe:1")
    if result.stderr:
        raise RuntimeError(result.stderr.decode(errors="replace"))
    return [line.rsplit(",", 1)[1].strip() for line in result.stdout.decode().splitlines()
            if line and not line.startswith("#")]


def audio_hashes(path):
    data = json.loads(run(["ffprobe", "-v", "error", "-select_streams", "a:0",
                           "-show_packets", "-show_data_hash", "sha256",
                           "-show_entries", "packet=data_hash", "-of", "json", path]).stdout)
    return [p["data_hash"] for p in data["packets"]]


def check_equal(actual, expected, description):
    if actual != expected:
        raise RuntimeError(f"Verification failed: {description}")


def transport(source, target, audio=False):
    args = ["-i", source, "-map", "0:v:0"]
    if audio:
        args += ["-map", "0:a:0"]
    ffmpeg(*args, "-c", "copy", "-bsf:v", "hevc_mp4toannexb", "-f", "mpegts", "-y", target)


def render_head(source, target):
    # Only the first 168 original frames enter the encoder. No frame-sized subprocesses.
    import cv2
    import numpy as np

    cv2.setNumThreads(2)
    plane_size = WIDTH * HEIGHT
    chroma_size = plane_size // 4
    frame_bytes = plane_size * 3
    decoder = subprocess.Popen(["ffmpeg", "-v", "error", "-threads", "2", "-i", str(source),
                                "-frames:v", str(HEAD_FRAMES), "-map", "0:v:0", "-vsync", "0",
                                "-f", "rawvideo", "-pix_fmt", "yuv420p10le", "pipe:1"],
                               stdout=subprocess.PIPE)
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
            "-color_primaries", "bt709", "-y", str(target)], stdin=subprocess.PIPE)
        for n in range(HEAD_FRAMES):
            raw = decoder.stdout.read(frame_bytes)
            if len(raw) != frame_bytes:
                raise RuntimeError(f"Incomplete source frame {n}")
            dy = VERTICAL[n] if n < len(VERTICAL) else 0.0
            y_matrix, uv_matrix = np.array(MATRIX), np.array(CHROMA)
            y_matrix[1, 2] += dy
            uv_matrix[1, 2] += dy / 2
            samples = np.frombuffer(raw, dtype="<u2")
            planes = [samples[:plane_size].reshape(HEIGHT, WIDTH),
                      samples[plane_size:plane_size + chroma_size].reshape(HEIGHT // 2, WIDTH // 2),
                      samples[plane_size + chroma_size:].reshape(HEIGHT // 2, WIDTH // 2)]
            planes = [cv2.warpAffine(p, y_matrix if i == 0 else uv_matrix,
                                    (p.shape[1], p.shape[0]), flags=cv2.INTER_CUBIC,
                                    borderMode=cv2.BORDER_REFLECT_101).clip(0, 1023)
                      for i, p in enumerate(planes)]
            if n < 48:
                u = n / 47
                weight = 1 - (3 * u * u - 2 * u * u * u)
                planes = [np.rint(np.clip(p.astype(np.float64) * (1 + weight * (gain - 1))
                                         + weight * offset, 0, 1023)).astype("<u2")
                          for p, (gain, offset) in zip(planes, GRADE)]
            encoder.stdin.write(b"".join(p.astype("<u2").tobytes() for p in planes))
        if decoder.wait() != 0:
            raise RuntimeError("Source decoding failed")
        encoder.stdin.close()
        if encoder.wait() != 0:
            raise RuntimeError("Opening encoding failed")
    finally:
        # An interruption or broken pipe must not leave an encoder running.
        for process in (decoder, encoder):
            if process is not None and process.poll() is None:
                process.terminate()
                try:
                    process.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    process.kill()
                    process.wait()


def finish_fix(media, work):
    """Mux and verify a prepared head.mp4 and suffix.mp4, then publish atomically."""
    head, suffix = work / "head.mp4", work / "suffix.mp4"
    transport(head, work / "head.ts")
    transport(suffix, work / "suffix.ts")
    manifest = work / "parts.txt"
    manifest.write_text("file 'head.ts'\nduration 7.0\nfile 'suffix.ts'\nduration 8.041666667\n")
    output = work / "verified_fixed.mp4"
    ffmpeg("-f", "concat", "-safe", "0", "-i", manifest, "-i", media / "p03.mp4",
           "-map", "0:v:0", "-map", "1:a:0", "-c", "copy", "-tag:v", "hev1",
           "-movflags", "+faststart", "-y", output)
    expected = frame_hashes(head) + frame_hashes(suffix)
    check_equal(len(expected), TOTAL_FRAMES, "361 frames")
    check_equal(frame_hashes(output), expected, "head/suffix decoded frames")
    check_equal(audio_hashes(output), audio_hashes(media / "p03.mp4"), "original audio")
    require_video(output, TOTAL_FRAMES)
    output.replace(media / "p03_fixed.mp4")
    print("Saved p03_fixed.mp4; only the first 168 frames were encoded.", flush=True)


def fix(media, work):
    source, previous = media / "p03.mp4", media / "p03_fixed.mp4"
    require_video(source, TOTAL_FRAMES)
    require_video(previous, TOTAL_FRAMES)
    keys = json.loads(run(["ffprobe", "-v", "error", "-select_streams", "v:0",
                           "-show_packets", "-show_entries", "packet=pts_time,flags",
                           "-of", "json", previous]).stdout)["packets"]
    if not any("K" in p["flags"] and abs(float(p["pts_time"]) - 7) < 0.0001 for p in keys):
        raise ValueError("The existing fixed clip has no random-access boundary at 7 s")
    ffmpeg("-ss", "7", "-i", previous, "-map", "0:v:0", "-an", "-c:v", "copy",
           "-y", work / "suffix.mp4")
    # Prove the cut before encoding anything. Preserve the already corrected suffix.
    check_equal(frame_hashes(work / "suffix.mp4"), frame_hashes(previous)[HEAD_FRAMES:],
                "copied suffix")
    print("Encoding only the 7-second opening from original p03.mp4...", flush=True)
    render_head(source, work / "head.mp4")
    finish_fix(media, work)


def join(media, work):
    names = ["p00.mp4", "p01.mp4", "p02.mp4", "p03_fixed.mp4"]
    inputs = [media / n for n in names]
    for i, path in enumerate(inputs):
        require_video(path)
        transport(path, work / f"clip{i}.ts", audio=True)
    manifest = work / "join.txt"
    manifest.write_text("".join(f"file 'clip{i}.ts'\n" for i in range(len(inputs))))
    output = work / "verified_joined.mp4"
    ffmpeg("-f", "concat", "-safe", "0", "-i", manifest, "-map", "0:v:0", "-map", "0:a:0",
           "-c", "copy", "-bsf:a", "aac_adtstoasc", "-tag:v", "hev1",
           "-movflags", "+faststart", "-y", output)
    expected_frames, expected_audio = [], []
    for path in inputs:
        expected_frames.extend(frame_hashes(path))
        expected_audio.extend(audio_hashes(path))
    check_equal(frame_hashes(output), expected_frames, "all copied frames")
    check_equal(audio_hashes(output), expected_audio, "all copied audio packets")
    size = output.stat().st_size
    output.replace(media / "p00_p03_fixed_joined.mp4")
    print(f"Saved p00_p03_fixed_joined.mp4 ({size:,} bytes); no encoding.", flush=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=["fix", "join"])
    parser.add_argument("--media-dir", type=Path, required=True,
                        help="Directory containing the original clips and existing p03_fixed.mp4")
    args = parser.parse_args()
    media = args.media_dir.resolve(strict=True)
    if not media.is_dir():
        parser.error("--media-dir must be a directory")
    # Same filesystem permits atomic publication. Failed work never replaces an input.
    with tempfile.TemporaryDirectory(prefix=".p03-edit-", dir=media) as temp:
        {"fix": fix, "join": join}[args.command](media, Path(temp))


if __name__ == "__main__":
    try:
        main()
    except subprocess.CalledProcessError as exc:
        raise SystemExit(exc.stderr.decode(errors="replace") if exc.stderr else str(exc)) from exc
