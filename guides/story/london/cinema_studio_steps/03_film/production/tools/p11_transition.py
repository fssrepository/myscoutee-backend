#!/usr/bin/env python3
"""P11-only four moving frame transition; source verified before all processing."""
import sys,json,hashlib,subprocess,argparse,tempfile
from pathlib import Path
import numpy as np
sys.path.insert(0,str(Path(__file__).resolve().parent))
from p03_edit import ffmpeg, frame_hashes, audio_hashes, transport, require_video, check_equal, probe
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--media-dir',type=Path,default=Path('/home/raxim/Downloads'))
args=parser.parse_args()
S=args.media_dir/'p11.mp4'; OUT=args.media_dir/'p11_fixed.mp4'
W=Path(tempfile.mkdtemp(prefix='p11-statue-fix-'))
HASH='f815add0524ae502e75ac159bb44109631868bf610af08171eb77a10db5628ce'
assert hashlib.sha256(S.read_bytes()).hexdigest()==HASH
assert not OUT.exists()
original=frame_hashes(S)
ffmpeg('-i',S,'-map','0:v:0','-frames:v','142','-c','copy','-y',W/'prefix.mp4')
check_equal(frame_hashes(W/'prefix.mp4'),original[:142],'copied prefix')
# Exactly 99 frames, planar original 10-bit YUV, no RGB conversion or geometry filter.
raw=W/'suffix.yuv'
if not raw.exists():
    ffmpeg('-threads','2','-i',S,'-map','0:v:0','-vf','trim=start_frame=142,setpts=PTS-STARTPTS','-vsync','0','-pix_fmt','yuv420p10le','-f','rawvideo','-y',raw)
B=1920*1080*3
assert raw.stat().st_size==99*B
src=np.memmap(raw,dtype='<u2',mode='r',shape=(99,B//2))
# Center the existing four-frame moving blend on the cut without shortening the clip.
# Only output frames 206..209 change: outgoing 204..207 + incoming 208..211.
# The two-frame timing overlap is confined to this 1/6-second repair window.
enc=W/'suffix_lossless.mp4'
cmd=['ffmpeg','-v','error','-f','rawvideo','-pixel_format','yuv420p10le','-video_size','1920x1080','-framerate','24','-i','pipe:0','-an','-c:v','libx265','-preset','fast','-x265-params','lossless=1:pools=2:frame-threads=2:log-level=error:open-gop=0:keyint=120:min-keyint=120:scenecut=0','-pix_fmt','yuv420p10le','-color_range','tv','-colorspace','bt709','-color_trc','bt709','-color_primaries','bt709','-tag:v','hvc1','-y',str(enc)]
expected=original.copy()
print('Encoding 99-frame lossless block; only frames 206–209 change visually.',flush=True)
p=subprocess.Popen(cmd,stdin=subprocess.PIPE,stderr=open(W/'encoder.log','w'))
try:
    for n in range(142,241):
        if 206<=n<=209:
            j=n-206; a=(j+1)/5
            frame=np.rint((1-a)*src[204+j-142].astype(np.float64)+a*src[208+j-142].astype(np.float64)).clip(0,1023).astype('<u2').tobytes()
            expected[n]=hashlib.md5(frame).hexdigest()
        else: frame=src[n-142].tobytes()
        p.stdin.write(frame)
    p.stdin.close()
    if p.wait()!=0: raise RuntimeError((W/'encoder.log').read_text())
finally:
    if p.poll() is None: p.terminate(); p.wait()
check_equal(frame_hashes(enc),expected[142:],'lossless decoded suffix')
transport(W/'prefix.mp4',W/'prefix.ts'); transport(enc,W/'suffix.ts')
(W/'parts.txt').write_text("file 'prefix.ts'\nduration 5.916666667\nfile 'suffix.ts'\nduration 4.125\n")
ffmpeg('-f','concat','-safe','0','-i',W/'parts.txt','-i',S,'-map','0:v:0','-map','1:a:0','-c','copy','-bsf:v','hevc_metadata=level=4.1:chroma_sample_loc_type=0:aud=insert','-tag:v','hev1','-movflags','+faststart','-y',W/'candidate.mp4')
check_equal(frame_hashes(W/'candidate.mp4'),expected,'all output frame hashes')
check_equal(audio_hashes(W/'candidate.mp4'),audio_hashes(S),'all original AAC payloads')
require_video(W/'candidate.mp4',241)
for file in [S,W/'candidate.mp4']:
    r=subprocess.run(['ffprobe','-v','error','-show_packets','-show_entries','packet=stream_index,pts_time,duration_time','-of','json',str(file)],check=True,capture_output=True)
    (W/(file.stem+'_timestamps.json')).write_bytes(r.stdout)
a=json.loads((W/'p11_timestamps.json').read_text())['packets']; b=json.loads((W/'candidate_timestamps.json').read_text())['packets']
for stream in [0,1]:
    x=sorted((v['pts_time'],v['duration_time']) for v in a if v['stream_index']==stream)
    y=sorted((v['pts_time'],v['duration_time']) for v in b if v['stream_index']==stream)
    check_equal(y,x,f'stream {stream} PTS and durations')
check_equal(hashlib.sha256(S.read_bytes()).hexdigest(),HASH,'original file unchanged')
(W/'expected_hashes.json').write_text(json.dumps(expected))
(W/'validation.json').write_text(json.dumps({'source_sha256':HASH,'frames':241,'unchanged_frames':237,'changed_frames':[206,207,208,209],'copied_prefix_frames':142,'lossless_block_frames':99,'audio_payloads_and_pts':'identical','video_pts':'identical','last_frame':'identical','candidate_bytes':(W/'candidate.mp4').stat().st_size},indent=2))
(W/'candidate.mp4').rename(OUT)
print(f'Saved {OUT}; verified original audio, timing and 237 unchanged frames. Evidence: {W}',flush=True)
