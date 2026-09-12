"""Replace P00 'presents' locally, then carry it into the retained v3 edit.

Run from the repository root. Reuses the lossless title-patch and four-frame
assembly recipes; never overwrites source clips or previously delivered films.
"""
from pathlib import Path
import argparse, hashlib, json, subprocess
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from p03_edit import ffmpeg, frame_hashes, audio_hashes, check_equal, transport
from p03_transition import COMPAT_HEADERS

parser = argparse.ArgumentParser()
parser.add_argument('--media-dir', type=Path, default=Path('/home/raxim/Downloads'))
parser.add_argument('--movie', default='myscoutee_directors_cut_v3_retimed.mp4')
args = parser.parse_args()
M = args.media_dir
W = M / '.p00-film-subtitle'
W.mkdir(exist_ok=True)
source = M / 'p00_final_fixed.mp4'
movie = M / args.movie
out = M / 'p00_film_title_fixed.mp4'
delivery = movie.with_name(movie.stem + '_title.mp4')
assert not out.exists() and not delivery.exists(), 'Keep prior outputs; use a fresh version.'
cv2.setNumThreads(2)
B = 1920 * 1080 * 3
original_hashes = {str(p): hashlib.sha256(p.read_bytes()).hexdigest()
                   for p in (source, movie, M / 'p01.mp4')}

def decode(path, frames, target):
    ffmpeg('-threads', '2', '-i', path, '-map', '0:v:0', '-frames:v', frames,
           '-vsync', '0', '-pix_fmt', 'yuv420p10le', '-f', 'rawvideo', '-y', target)
    assert target.stat().st_size == frames * B
    return np.memmap(target, dtype='<u2', mode='r', shape=(frames, B // 2))

def planes(frame):
    offset = 0
    for h, w in ((1080, 1920), (540, 960), (540, 960)):
        yield frame[offset:offset + h*w].reshape(h, w)
        offset += h*w

def encode(target, data, audio_source=None):
    command = ['ffmpeg', '-v', 'error', '-f', 'rawvideo', '-pixel_format',
               'yuv420p10le', '-video_size', '1920x1080', '-framerate', '24',
               '-i', 'pipe:0']
    command += ['-i', str(audio_source), '-map', '0:v:0', '-map', '1:a:0'] if audio_source else ['-an']
    command += ['-c:v', 'libx265', '-preset', 'fast', '-x265-params',
                'lossless=1:pools=2:frame-threads=2:log-level=error:open-gop=0:keyint=120:min-keyint=120:scenecut=0',
                '-pix_fmt', 'yuv420p10le', '-color_range', 'tv', '-colorspace',
                'bt709', '-color_trc', 'bt709', '-color_primaries', 'bt709',
                '-bsf:v', COMPAT_HEADERS, '-tag:v', 'hev1', '-c:a', 'copy',
                '-movflags', '+faststart', '-n', str(target)]
    p = subprocess.Popen(command, stdin=subprocess.PIPE)
    try:
        for f in data:
            p.stdin.write(f.tobytes())
        p.stdin.close()
        assert p.wait() == 0
    finally:
        if p.poll() is None:
            p.terminate(); p.wait()

print('Reading approved P00 and retained movie opening.', flush=True)
orig = decode(source, 97, W / 'p00.yuv')
incoming = decode(M / 'p01.mp4', 27, W / 'p01_head.yuv')
before = decode(movie, 120, W / 'movie_head.yuv')
patched = np.memmap(W / 'p00_title.yuv', dtype='<u2', mode='w+', shape=orig.shape)

# Restrict repair to the existing subtitle row, below the MyScoutee lettering.
x0, y0, x1, y1 = 680, 922, 1240, 970
ref = list(planes(orig[80]))
ref_y = ref[0][y0:y1, x0:x1]
mask = (ref_y > 400).astype('uint8') * 255
core = cv2.erode(mask, np.ones((2, 2), np.uint8)) > 0
assert int(core.sum()) > 100
mask = cv2.dilate(mask, np.ones((7, 7), np.uint8))
font_path = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
font = ImageFont.truetype(font_path, 34 * 3)
layer = Image.new('L', ((x1-x0)*3, (y1-y0)*3))
d = ImageDraw.Draw(layer)
title = 'THE PATH BETWEEN PEOPLE'
box = d.textbbox((0, 0), title, font=font)
d.text((((x1-x0)*3 - (box[2]-box[0]))/2 - box[0], 5*3-box[1]),
       title, font=font, fill=255)
alpha = np.array(layer.resize((x1-x0, y1-y0), Image.LANCZOS), dtype=np.float32)/255
ref_fg = float(np.median(ref_y[core]))
ref_bg = float(np.median(ref_y[mask == 0]))
strengths = []
for k in range(97):
    f = orig[k].copy()
    roi_y = list(planes(orig[k]))[0][y0:y1, x0:x1]
    bg = float(np.median(roi_y[mask == 0]))
    strength = float(np.clip((np.median(roi_y[core])-bg)/(ref_fg-ref_bg), 0, 1)) if k >= 53 else 0
    strengths.append(strength)
    if k >= 53:
        for j, plane in enumerate(planes(f)):
            scale = 1 if j == 0 else 2
            roi = plane[y0//scale:y1//scale, x0//scale:x1//scale]
            pmask = mask if scale == 1 else cv2.resize(mask, (roi.shape[1], roi.shape[0]), interpolation=cv2.INTER_NEAREST)
            a = alpha if scale == 1 else cv2.resize(alpha, (roi.shape[1], roi.shape[0]), interpolation=cv2.INTER_AREA)
            clean = cv2.inpaint(roi.astype(np.float32), pmask, 5/scale, cv2.INPAINT_NS)
            fg = ref_fg if j == 0 else float(np.median(ref[j][y0//scale:y1//scale, x0//scale:x1//scale][pmask > 0]))
            roi[:] = np.rint(clean*(1-a*strength) + fg*a*strength).clip(0, 1023).astype('<u2')
    patched[k] = f
patched.flush()
outside = np.ones(B//2, dtype=bool)
for j, plane in enumerate(planes(outside)):
    s = 1 if j == 0 else 2
    plane[y0//s:y1//s, x0//s:x1//s] = False
assert all(np.array_equal(orig[k][outside], patched[k][outside]) for k in range(97))
assert np.array_equal(orig[:53], patched[:53])
print('Encoding standalone subtitle repair losslessly.', flush=True)
encode(out, patched, source)
check_equal(frame_hashes(out), [hashlib.md5(f.tobytes()).hexdigest() for f in patched], 'P00 lossless title pixels')
check_equal(audio_hashes(out), audio_hashes(source), 'P00 native audio')
ffmpeg('-ss', '3', '-i', out, '-frames:v', '1', '-y', W / 'title_preview.png')

def opening_frame(g, p00):
    f = p00[g] if g < 93 else incoming[g-93]
    if 93 <= g < 97:
        a = (g-93+1)/5
        f = np.rint((1-a)*p00[g].astype(np.float64) + a*incoming[g-93].astype(np.float64)).clip(0, 1023).astype('<u2')
    t = g-93
    if -5 < t < 12:
        q = (t+5)/6.5 if t <= 1.5 else (12-t)/10.5
        q = max(0, min(1, q)); sigma = 14*q*q*(3-2*q)
        if sigma > .02:
            f = np.concatenate([np.rint(cv2.GaussianBlur(p.astype(np.float32), (0, 0),
                                sigmaX=sigma/(1 if j == 0 else 2), borderType=cv2.BORDER_REFLECT_101))
                                .clip(0, 1023).astype('<u2').reshape(-1)
                                for j, p in enumerate(planes(f))])
    return f

head = np.memmap(W / 'new_movie_head.yuv', dtype='<u2', mode='w+', shape=before.shape)
changed = []
for g in range(120):
    assert np.array_equal(opening_frame(g, orig), before[g]), f'Retained opening recipe differs at {g}'
    head[g] = opening_frame(g, patched)
    if not np.array_equal(head[g], before[g]):
        changed.append(g)
assert all(53 <= g <= 96 for g in changed)
head.flush()
prefix = W / 'prefix.mp4'
print('Encoding the first 5 seconds losslessly; copying the remaining film.', flush=True)
encode(prefix, head)
check_equal(frame_hashes(prefix), [hashlib.md5(f.tobytes()).hexdigest() for f in head], 'movie prefix lossless pixels')
suffix = W / 'suffix.mp4'
ffmpeg('-ss', '5', '-i', movie, '-map', '0:v:0', '-c', 'copy', '-n', suffix)
transport(prefix, W / 'prefix.ts'); transport(suffix, W / 'suffix.ts')
manifest = W / 'parts.txt'
manifest.write_text(f"file '{W / 'prefix.ts'}'\nduration 5.000000000\nfile '{W / 'suffix.ts'}'\nduration {4741/24:.9f}\n")
ffmpeg('-f', 'concat', '-safe', '0', '-i', manifest, '-i', movie,
       '-map', '0:v:0', '-map', '1:a:0', '-map_metadata', '1', '-map_chapters', '1',
       '-c', 'copy', '-bsf:v', COMPAT_HEADERS, '-tag:v', 'hev1', '-movflags', '+faststart', '-n', delivery)

def packets(path):
    return json.loads(ffmpeg_probe(path))['packets']

def ffmpeg_probe(path):
    return subprocess.check_output(['ffprobe', '-v', 'error', '-select_streams', 'v:0',
        '-show_packets', '-show_data_hash', 'sha256', '-show_entries', 'packet=pts_time,data_hash', '-of', 'json', str(path)])

print('Checking copied movie packets, audio, timestamps and repaired opening.', flush=True)
old_packets, new_packets = packets(movie), packets(delivery)
old_tail = [p['data_hash'] for p in old_packets if float(p['pts_time']) >= 5]
new_tail = [p['data_hash'] for p in new_packets if float(p['pts_time']) >= 5]
check_equal(new_tail, old_tail, 'all 4741 untouched coded picture packets')
pts = sorted(float(p['pts_time']) for p in new_packets)
assert len(pts) == 4861 and abs(pts[0]) < .00002
assert all(abs(b-a-1/24) < .00002 for a,b in zip(pts, pts[1:]))
check_equal(audio_hashes(delivery), audio_hashes(movie), 'complete unchanged movie audio packets')
final_head = decode(delivery, 120, W / 'delivered_head.yuv')
assert np.array_equal(final_head, head)
for p, sha in original_hashes.items():
    assert hashlib.sha256(Path(p).read_bytes()).hexdigest() == sha
report = {'source_hashes': original_hashes, 'standalone': str(out), 'movie': str(delivery),
          'title': title, 'font': 'DejaVu Sans regular 34 px, supersampled; matched to the existing presents style',
          'p00_changed_rectangle_xyxy': [x0, y0, x1, y1], 'p00_unchanged': 'all pixels outside rectangle and all frames 0–52 identical',
          'movie_changed_frames': changed, 'movie_picture_frames': 4861, 'duration': 4861/24,
          'movie_encoding': 'first 120 frames lossless; remaining 4741 coded picture packets identical to source movie',
          'audio': 'standalone native audio and entire movie audio packet hashes unchanged',
          'opening_transition': 'retained v3 blur and four-frame overlap recipe, with new subtitle propagated through it',
          'sources': 'unchanged', 'subtitle_strengths': strengths}
(W / 'validation.json').write_text(json.dumps(report, indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k != 'subtitle_strengths'}, indent=2), flush=True)
