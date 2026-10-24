#!/usr/bin/env python3
"""Append original P04 to the recorded P00–P03 assembly, retaining prior TS parts.

Only 43 video frames and 36 AAC packets are newly encoded. Keep both work
directories for reproducibility; do not remux the mixed-parameter MP4 into TS.
"""
import argparse
import hashlib
import json
from pathlib import Path
import sys

sys.dont_write_bytecode = True
from p03_transition import COMPAT_HEADERS, adts_frames, render_bridge
from p03_edit import (audio_hashes, check_equal, ffmpeg, frame_hashes,
                      require_video, run, transport)


def append(media):
    old = media / '.p03-all-joins'
    work = media / '.p04-assembly'
    work.mkdir(exist_ok=True)
    previous = media / 'p00_p03_transition.mp4'
    outgoing, incoming = media / 'p03.mp4', media / 'p04.mp4'
    require_video(previous, 1168)
    require_video(outgoing, 361)
    require_video(incoming, 361)
    names = ['prefix0', 'bridge0', 'middle1', 'bridge1', 'middle2', 'bridge2']
    counts = [92, 251, 104, 253, 104, 179]
    for name in names:
        if not (old / f'{name}.ts').is_file():
            raise FileNotFoundError(old / f'{name}.ts')
    ffmpeg('-i', outgoing, '-map', '0:v:0', '-frames:v', '354', '-c:v', 'copy',
           '-y', work / 'prefix.mp4')
    ffmpeg('-ss', '7.333333333', '-i', work / 'prefix.mp4', '-map', '0:v:0',
           '-c:v', 'copy', '-y', work / 'middle3.mp4')
    ffmpeg('-ss', '1.666666667', '-i', incoming, '-map', '0:v:0', '-c:v', 'copy',
           '-y', work / 'suffix4.mp4')
    original3, original4 = frame_hashes(outgoing), frame_hashes(incoming)
    check_equal(frame_hashes(work / 'middle3.mp4'), original3[176:354], 'P03 copied middle')
    check_equal(frame_hashes(work / 'suffix4.mp4'), original4[40:], 'P04 copied suffix')
    bridge = work / 'bridge.mp4'
    if not bridge.exists():
        render_bridge(media, bridge, 'p03.mp4', 'p04.mp4', 354, 361, 40)
    require_video(bridge, 43)

    for source, name in ((previous, 'previous'), (incoming, 'incoming')):
        ffmpeg('-i', source, '-vn', '-c:a', 'copy', '-f', 'adts', '-y', work / f'{name}.aac')
    a, b = [adts_frames(work / f'{name}.aac') for name in ('previous', 'incoming')]
    check_equal((len(a), len(b)), (1522, 472), 'input AAC packet counts')
    filters = ('[0:a]atrim=end_sample=1557504,asetpts=PTS-STARTPTS[a];'
               '[1:a]atrim=end_sample=481280,asetpts=PTS-STARTPTS[b];'
               '[a][b]acrossfade=ns=5120:c1=qsin:c2=qsin,'
               'atrim=start_sample=1531904:end_sample=1576960,asetpts=PTS-STARTPTS[out]')
    ffmpeg('-i', previous, '-i', incoming, '-filter_complex', filters,
           '-map', '[out]', '-c:a', 'aac', '-b:a', '288k', '-f', 'adts',
           '-y', work / 'encoded.aac')
    replacement = adts_frames(work / 'encoded.aac')[5:41]
    check_equal(len(replacement), 36, 'local audio replacement')
    packets = a[:1501] + replacement + b[21:471]
    check_equal(len(packets), 1987, 'output AAC packet count')
    expected_audio = ['SHA256:' + hashlib.sha256(f[7:]).hexdigest() for f in packets]
    (work / 'audio.aac').write_bytes(b''.join(packets))
    parts = [(old / f'{name}.ts', count) for name, count in zip(names, counts)]
    for name, count in (('middle3', 178), ('bridge', 43), ('suffix4', 321)):
        transport(work / f'{name}.mp4', work / f'{name}.ts')
        parts.append((work / f'{name}.ts', count))
    manifest = work / 'all_joins.txt'
    # FFmpeg concat quoting: escape a literal apostrophe outside the quoted path.
    manifest.write_text(''.join("file '" + str(path).replace("'", "'\\''") +
                                f"'\nduration {count / 24:.9f}\n" for path, count in parts))
    output = work / 'verified.mp4'
    ffmpeg('-f', 'concat', '-safe', '0', '-i', manifest, '-itsoffset', '-0.032',
           '-i', work / 'audio.aac', '-map', '0:v:0', '-map', '1:a:0', '-c', 'copy',
           '-bsf:v', COMPAT_HEADERS, '-bsf:a', 'aac_adtstoasc', '-tag:v', 'hev1',
           '-movflags', '+faststart', '-y', output)
    print('Checking full decode, retained pictures, AAC payloads and timestamps...', flush=True)
    expected = frame_hashes(previous)[:1161] + frame_hashes(bridge) + original4[40:]
    check_equal(frame_hashes(output), expected, 'all 1525 decoded frames')
    check_equal(audio_hashes(output), expected_audio, 'all 1987 AAC packets')
    data = json.loads(run(['ffprobe', '-v', 'error', '-select_streams', 'v:0',
                          '-show_packets', '-show_entries', 'packet=pts_time',
                          '-of', 'json', output]).stdout)['packets']
    times = sorted(float(p['pts_time']) for p in data)
    if abs(times[0]) > 0.001 or any(abs(b-a-1/24) > 0.0011 for a, b in zip(times, times[1:])):
        raise RuntimeError('Non-continuous picture timestamps')
    require_video(output, 1525)
    target = media / 'p00_p04_transition.mp4'
    output.replace(target)
    ffmpeg('-sseof', '-0.1', '-i', incoming, '-map', '0:v:0', '-update', '1',
           '-y', media / 'p04_last_frame.png')
    print(f'Saved {target} ({target.stat().st_size} bytes) and p04_last_frame.png', flush=True)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--media-dir', type=Path, required=True)
    append(parser.parse_args().media_dir.resolve())
