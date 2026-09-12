from pathlib import Path
import subprocess,json,hashlib,sys
import numpy as np,cv2
from PIL import Image,ImageFont,ImageDraw
sys.path.insert(0,str(Path.cwd()/'guides/story/london/cinema_studio_steps/03_film/production/tools'))
from p03_edit import frame_hashes,audio_hashes,check_equal
cv2.setNumThreads(2)
M=Path('/home/raxim/Downloads'); W=M/'.full-film-dream'
src=M/'p00_orig.mp4';out=M/'p00_fixed.mp4'
assert not out.exists()
original_sha=hashlib.sha256(src.read_bytes()).hexdigest()
ref=np.array(Image.open(W/'p00_reference.png').convert('RGB'))[820:936,700:1220]
g=cv2.cvtColor(ref,cv2.COLOR_RGB2GRAY)
count,labels,stats,_=cv2.connectedComponentsWithStats((g>80).astype('uint8'))
mask=np.zeros(g.shape,np.uint8)
for i in range(1,count):
 x,y,w,h,area=stats[i]
 if y<80 and area>10:mask[labels==i]=255
core=cv2.erode(mask,np.ones((5,5),np.uint8))>0
mask=cv2.dilate(mask,np.ones((11,11),np.uint8))
font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',79*3)
layer=Image.new('L',(520*3,116*3));draw=ImageDraw.Draw(layer)
b=draw.textbbox((0,0),'MyScoutee',font=font)
draw.text(((520*3-(b[2]-b[0]))/2,24*3-b[1]),'MyScoutee',font=font,fill=255)
alpha=np.array(layer.resize((520,116),Image.LANCZOS)).astype(np.float32)/255
fg_ref=np.median(ref[core],axis=0).astype(np.float32)/255
bg_ref=np.array([.065,.07,.13],np.float32)
rgb=np.memmap(W/'p00_original.rgb',dtype='<u2',mode='r',shape=(97,1080,1920,3))
with (W/'p00_patched.rgb').open('wb') as f:
 for k in range(97):
  frame=rgb[k].copy()
  if k>=53:
   roi=frame[820:936,700:1220].astype(np.float32)/65535
   fg=np.median(roi[core],axis=0);bg=np.median(roi[mask==0],axis=0)
   strength=float(np.clip(np.mean((fg-bg)/(fg_ref-bg_ref)),0,1))
   clean=np.stack([cv2.inpaint(roi[:,:,j].copy(),mask,7,cv2.INPAINT_NS) for j in range(3)],axis=2)
   a=alpha[:,:,None]*strength
   frame[820:936,700:1220]=np.clip((clean*(1-a)+fg_ref*a)*65535+.5,0,65535).astype('<u2')
  f.write(frame.tobytes())
subprocess.run(['ffmpeg','-v','error','-threads','2','-f','rawvideo','-pixel_format','rgb48le','-video_size','1920x1080','-framerate','24','-i',str(W/'p00_patched.rgb'),'-vf','scale=in_range=full:out_range=tv:out_color_matrix=bt709','-pix_fmt','yuv420p10le','-f','rawvideo','-y',str(W/'p00_patch.yuv')],check=True)
B=1920*1080*3//2
orig=np.memmap(W/'p00_original.yuv',dtype='<u2',mode='r',shape=(97,B))
patch=np.memmap(W/'p00_patch.yuv',dtype='<u2',mode='r',shape=(97,B))
enc=subprocess.Popen(['ffmpeg','-v','error','-f','rawvideo','-pixel_format','yuv420p10le','-video_size','1920x1080','-framerate','24','-i','pipe:0','-i',str(src),'-map','0:v:0','-map','1:a:0','-c:v','libx265','-preset','fast','-x265-params','lossless=1:pools=2:frame-threads=2:log-level=error:open-gop=0:keyint=48:min-keyint=48:scenecut=0','-pix_fmt','yuv420p10le','-color_range','tv','-colorspace','bt709','-color_trc','bt709','-color_primaries','bt709','-bsf:v','hevc_metadata=level=4.1:chroma_sample_loc_type=0:aud=insert','-tag:v','hev1','-c:a','copy','-movflags','+faststart','-n',str(out)],stdin=subprocess.PIPE)
expected=[];outside=np.ones(B,bool)
off=0
for h,w,scale in [(1080,1920,1),(540,960,2),(540,960,2)]:
 outside[off:off+h*w].reshape(h,w)[820//scale:936//scale,700//scale:1220//scale]=False;off+=h*w
for k in range(97):
 frame=orig[k].copy()
 if k>=53:frame[~outside]=patch[k][~outside]
 assert np.array_equal(frame[outside],orig[k][outside])
 data=frame.tobytes();expected.append(hashlib.md5(data).hexdigest());enc.stdin.write(data)
enc.stdin.close();assert enc.wait()==0
check_equal(frame_hashes(out),expected,'P00 exact lossless pixels')
check_equal(audio_hashes(out),audio_hashes(src),'P00 original AAC')
assert original_sha==hashlib.sha256(src.read_bytes()).hexdigest()
result={'source':str(src),'source_sha256':original_sha,'output':str(out),'output_sha256':hashlib.sha256(out.read_bytes()).hexdigest(),'frames':97,'edited_frames':[53,96],'edited_rectangle_xyxy':[700,820,1220,936],'outside_rectangle':'all original 10-bit YUV samples identical','frames_0_52':'all original samples identical','audio':'original AAC packet hashes identical','encoding':'lossless HEVC Main10; source 1080p/24/BT.709 retained','title':'same accepted DejaVu Sans Bold 79px mask/compositing recipe rebuilt from original; no compressed preview pixels reused'}
(W/'p00_validation.json').write_text(json.dumps(result,indent=2));print(json.dumps(result),flush=True)
