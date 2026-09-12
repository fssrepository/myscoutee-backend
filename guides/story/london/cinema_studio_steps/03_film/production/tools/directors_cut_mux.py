from pathlib import Path
import argparse,subprocess,json,hashlib
parser=argparse.ArgumentParser()
parser.add_argument('--suffix',default='')
args=parser.parse_args()
M=Path('/home/raxim/Downloads');W=M/'.full-film-dream'
assert (W/'picture_validation.json').exists()
def run(args):return subprocess.check_output([str(x) for x in args])
def packets(p):
 d=json.loads(run(['ffprobe','-v','error','-select_streams','v:0','-show_packets','-show_data_hash','sha256','-show_entries','packet=data_hash,pts_time','-of','json',p]))['packets']
 return [x['data_hash'] for x in d],sorted(float(x['pts_time']) for x in d)
def ahash(p,stream):
 return run(['ffmpeg','-v','error','-i',p,'-map',stream,'-c:a','pcm_f32le','-f','hash','-hash','sha256','pipe:1']).decode().strip()
meta=W/'chapters.txt';plan=json.loads((W/'plan.json').read_text())
s=';FFMETADATA1\ntitle=MyScoutee — Director’s Cut\n'
for i,r in enumerate(plan['clips']):
 end=plan['clips'][i+1]['start'] if i+1<len(plan['clips']) else plan['frames']
 s+=f"[CHAPTER]\nTIMEBASE=1/24\nSTART={r['start']}\nEND={end}\ntitle=P{i:02}"+(' — ident' if i==0 else '')+'\n'
meta.write_text(s)
preview=M/f'myscoutee_directors_cut{args.suffix}.mp4';editable=M/f'myscoutee_directors_cut_editable{args.suffix}.mov'
run(['ffmpeg','-v','error','-i',W/'picture.mp4','-i',W/'background.wav','-i',M/f'myscoutee_directors_cut_narration{args.suffix}.wav','-i',meta,'-map','0:v:0','-map','1:a:0','-map','2:a:0','-map_metadata','3','-map_chapters','3','-c:v','copy','-tag:v','hev1','-c:a','pcm_f32le','-metadata:s:a:0','title=Original background — editable','-metadata:s:a:0','handler_name=Background','-metadata:s:a:1','title=Narration — editable','-metadata:s:a:1','handler_name=Narration','-metadata:s:a:1','language=eng','-disposition:a:0','default','-disposition:a:1','0','-movflags','+faststart','-n',editable])
run(['ffmpeg','-v','error','-i',W/'picture.mp4','-i',W/f'mix{args.suffix}.wav','-i',meta,'-map','0:v:0','-map','1:a:0','-map_metadata','2','-map_chapters','2','-c:v','copy','-tag:v','hev1','-c:a','aac','-b:a','384k','-metadata:s:a:0','title=Narration + background — listening mix','-metadata:s:a:0','language=eng','-movflags','+faststart','-n',preview])
reference,times=packets(W/'picture.mp4')
for p in [editable,preview]:
 actual,pts=packets(p);assert actual==reference and len(pts)==4861
 assert all(abs(a-b)<.00002 for a,b in zip(pts,times))
assert ahash(editable,'0:a:0')==ahash(W/'background.wav','0:a:0')
assert ahash(editable,'0:a:1')==ahash(M/f'myscoutee_directors_cut_narration{args.suffix}.wav','0:a:0')
run(['ffmpeg','-v','error','-i',preview,'-map','0:a:0','-f','null','-'])
result={'video':'all 4861 compressed picture packet hashes and timestamps identical to verified picture master in both files','editable_audio':'both PCM float tracks decode identically to aligned source stems','outputs':[{'file':str(p),'bytes':p.stat().st_size} for p in [preview,editable]],'preview_audio':'single AAC listening mix; editing movie retains separate un-ducked background and clean narration','originals':'untouched'}
(W/f'delivery_validation{args.suffix}.json').write_text(json.dumps(result,indent=2));print(json.dumps(result),flush=True)
