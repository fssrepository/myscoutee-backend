#!/usr/bin/env python3
"""Recorded Director's Cut recipe. Run from repository root; media/work files live in ~/Downloads. See production README."""
from pathlib import Path
import sys,json,subprocess,hashlib
import numpy as np,cv2
sys.path.insert(0,str(Path.cwd()/'guides/story/london/cinema_studio_steps/03_film/production/tools'))
from p03_edit import ffmpeg,frame_hashes,check_equal,transport,probe
from p03_transition import COMPAT_HEADERS
cv2.setNumThreads(2)
M=Path('/home/raxim/Downloads');W=M/'.full-film-dream';plan=json.loads((W/'plan.json').read_text());rows=plan['clips'];B=1920*1080*3
# Original decode is the pixel oracle, including the requested fixed P11.
for r in rows:
 i=r['i'];raw=W/f'source{i:02}.yuv';hs=W/f'source{i:02}_hashes.json'
 if not(raw.exists() and hs.exists()):
  print(f'Decoding original {r["file"]} ({r["frames"]} frames)',flush=True)
  p=subprocess.Popen(['ffmpeg','-v','error','-threads','2','-i',str(M/r['file']),'-map','0:v:0','-vsync','0','-pix_fmt','yuv420p10le','-f','rawvideo','pipe:1'],stdout=subprocess.PIPE)
  hashes=[]
  try:
   with raw.open('wb') as f:
    for n in range(r['frames']):
     data=p.stdout.read(B);assert len(data)==B;f.write(data);hashes.append(hashlib.md5(data).hexdigest())
   assert p.stdout.read(1)==b'';assert p.wait()==0
  finally:
   if p.poll() is None:p.terminate();p.wait()
  hs.write_text(json.dumps(hashes))
 r['hashes']=json.loads(hs.read_text());assert raw.stat().st_size==r['frames']*B
 # Prove every copied range, including CRA/RASL handling, before retaining it.
 if r['copy']:
  a,b=r['copy'];dst=W/f'copy{i:02}.mp4';ok=False
  if dst.exists():
   try:ok=frame_hashes(dst)==r['hashes'][a:b]
   except RuntimeError:pass
  if not ok:
   prefix=W/f'prefix{i:02}.mp4'
   ffmpeg('-i',M/r['file'],'-map','0:v:0','-frames:v',str(b),'-c','copy','-y',prefix)
   for remove_rasl in [False,True]:
    ffmpeg('-ss',f'{a/24:.9f}','-i',prefix,'-map','0:v:0','-c','copy',*(['-bsf:v','filter_units=remove_types=8|9'] if remove_rasl else []),'-y',dst)
    try:ok=frame_hashes(dst)==r['hashes'][a:b]
    except RuntimeError:ok=False
    if ok:r['remove_rasl']=remove_rasl;break
  if ok:print(f'  Verified stream copy {a}–{b-1}',flush=True)
  else:r['copy']=None;print('  No exact decodable copy range: retain pixels with lossless encoding.',flush=True)
# The global overlap recipe is identical to the accepted v3 trial.
raws=[np.memmap(W/f'source{r["i"]:02}.yuv',dtype='<u2',mode='r',shape=(r['frames'],B//2)) for r in rows]
boundaries=[r['start'] for r in rows[1:]]
expected=[None]*plan['frames'];modified=[]
def frame(g):
 idx=max(i for i,r in enumerate(rows) if r['start']<=g);r=rows[idx];n=g-r['start'];f=raws[idx][n]
 blend=idx>0 and n<4
 if blend:
  a=(n+1)/5;f=np.rint((1-a)*raws[idx-1][rows[idx-1]['frames']-4+n].astype(np.float64)+a*f.astype(np.float64)).clip(0,1023).astype('<u2')
 sigma=0
 for boundary in boundaries:
  t=g-boundary
  if -5<t<12:
   q=(t+5)/6.5 if t<=1.5 else (12-t)/10.5;q=max(0,min(1,q));sigma=14*q*q*(3-2*q);break
 if sigma>.02:
  off=0;parts=[]
  for k,(h,w) in enumerate([(1080,1920),(540,960),(540,960)]):
   p=f[off:off+h*w].reshape(h,w);off+=h*w
   p=cv2.GaussianBlur(p.astype(np.float32),(0,0),sigmaX=sigma/(1 if k==0 else 2),borderType=cv2.BORDER_REFLECT_101)
   parts.append(np.rint(p).clip(0,1023).astype('<u2').reshape(-1))
  f=np.concatenate(parts)
 if blend or sigma>.02:modified.append(g)
 data=f.tobytes();expected[g]=hashlib.md5(data).hexdigest()
 if not blend and sigma<=.02:check_equal(expected[g],r['hashes'][n],'unaffected source pixels')
 return data
# Copy safe middle ranges; losslessly encode only remaining prediction-dependent blocks.
copyranges=sorted((r['start']+r['copy'][0],r['start']+r['copy'][1],r) for r in rows if r['copy'])
parts=[];pos=0
for a,b,r in copyranges+[(plan['frames'],plan['frames'],None)]:
 if pos<a:
  dst=W/f'lossless_{pos}_{a}.mp4';print(f'Lossless block {pos}–{a-1} ({(a-pos)/24:.2f} s)',flush=True)
  if not dst.exists():
   log=(W/f'lossless_{pos}_{a}.log').open('w')
   enc=subprocess.Popen(['ffmpeg','-v','error','-f','rawvideo','-pixel_format','yuv420p10le','-video_size','1920x1080','-framerate','24','-i','pipe:0','-an','-c:v','libx265','-preset','fast','-x265-params','lossless=1:pools=2:frame-threads=2:log-level=error:open-gop=0:keyint=120:min-keyint=120:scenecut=0','-pix_fmt','yuv420p10le','-color_range','tv','-colorspace','bt709','-color_trc','bt709','-color_primaries','bt709','-tag:v','hvc1','-y',str(dst)],stdin=subprocess.PIPE,stderr=log)
   try:
    for g in range(pos,a):enc.stdin.write(frame(g))
    enc.stdin.close();assert enc.wait()==0
   finally:
    if enc.poll() is None:enc.terminate();enc.wait()
    log.close()
  else:
   for g in range(pos,a):frame(g)
  check_equal(frame_hashes(dst),expected[pos:a],'lossless block pixels')
  ts=dst.with_suffix('.ts');transport(dst,ts);parts.append((ts,a-pos,'lossless'))
 if r is not None:
  expected[a:b]=r['hashes'][r['copy'][0]:r['copy'][1]]
  dst=W/f'copy{r["i"]:02}.mp4';ts=dst.with_suffix('.ts');transport(dst,ts);parts.append((ts,b-a,'copy'))
 pos=b
manifest=W/'picture_parts.txt';manifest.write_text(''.join("file '"+str(p).replace("'","'\\''")+f"'\nduration {n/24:.9f}\n" for p,n,_ in parts))
ffmpeg('-f','concat','-safe','0','-i',manifest,'-map','0:v:0','-c','copy','-bsf:v',COMPAT_HEADERS,'-tag:v','hev1','-movflags','+faststart','-y',W/'picture.mp4')
print('Verifying full assembled picture against original pixels and exact calculated transitions.',flush=True)
check_equal(frame_hashes(W/'picture.mp4'),expected,'entire Director Cut pixels')
packets=json.loads(subprocess.check_output(['ffprobe','-v','error','-select_streams','v:0','-show_packets','-show_entries','packet=pts_time','-of','json',str(W/'picture.mp4')]))['packets'];times=sorted(float(p['pts_time']) for p in packets)
assert len(times)==plan['frames'] and abs(times[0])<.00001
assert all(abs(b-a-1/24)<.00002 for a,b in zip(times,times[1:]))
for r in rows:check_equal(hashlib.sha256((M/r['file']).read_bytes()).hexdigest(),r['sha256'],'original file unchanged')
(W/'expected_picture_hashes.json').write_text(json.dumps(expected))
result={'frames':plan['frames'],'duration':plan['duration'],'boundaries_seconds':[x/24 for x in boundaries],'copied_frames':sum(n for _,n,k in parts if k=='copy'),'losslessly_encoded_frames':sum(n for _,n,k in parts if k=='lossless'),'visually_modified_frames':len(set(modified)),'unaffected_pixels':'identical to selected original source frames','p11_source':'p11_fixed.mp4','parts':[{'file':p.name,'frames':n,'mode':k} for p,n,k in parts]}
(W/'picture_validation.json').write_text(json.dumps(result,indent=2));print(json.dumps(result),flush=True)
