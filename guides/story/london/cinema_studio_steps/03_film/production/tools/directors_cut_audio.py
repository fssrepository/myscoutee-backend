#!/usr/bin/env python3
"""Recorded Director's Cut recipe. Run from repository root; media/work files live in ~/Downloads. See production README."""
from pathlib import Path
import json,subprocess,hashlib
import numpy as np
M=Path('/home/raxim/Downloads');W=M/'.full-film-dream';P=json.loads((W/'plan.json').read_text())
rate=44100;N=round(P['frames']/24*rate)
def decode(path):
 data=subprocess.check_output(['ffmpeg','-v','error','-threads','2','-i',str(path),'-map','0:a:0','-af','aresample=44100:resampler=soxr:precision=28','-ac','2','-f','f32le','pipe:1'])
 return np.frombuffer(data,dtype='<f4').reshape(-1,2)
def wav(path,data):
 subprocess.run(['ffmpeg','-v','error','-f','f32le','-ar',str(rate),'-ac','2','-i','pipe:0','-c:a','pcm_f32le','-y',str(path)],input=data.astype('<f4').tobytes(),check=True)
bg=np.zeros((N,2),np.float32)
for i,r in enumerate(P['clips']):
 a=round(r['start']/24*rate);end=round((r['start']+r['frames'])/24*rate);count=end-a
 data=decode(M/r['file']);assert len(data)>=count;data=data[:count].copy()
 overlap=round(4/24*rate)
 if i:
  f=np.linspace(0,1,overlap,dtype=np.float32)[:,None]
  bg[a:a+overlap]*=1-f;data[:overlap]*=f
 bg[a:end]+=data
voice=decode(M/'narration.mp3');cuts=[0,16.81,35.46,56.88,80.19,104.27,134.0,len(voice)/rate]
starts=[97/24,807/24,1521/24,93.83,123.125,150.9,180.7]
narr=np.zeros((N,2),np.float32);segments=[];last=0;preserved=0
for i,(a,b,start) in enumerate(zip(cuts,cuts[1:],starts)):
 lo=round(a*rate);hi=round(b*rate);at=round(start*rate)
 assert at>=last and at+hi-lo<=N
 narr[at:at+hi-lo]=voice[lo:hi];assert np.array_equal(narr[at:at+hi-lo],voice[lo:hi])
 last=at+hi-lo;preserved+=hi-lo
 segments.append({'passage':f'A{i+1:02}','source_start':lo/rate,'source_end':hi/rate,'timeline_start':at/rate,'timeline_end':last/rate})
assert preserved==len(voice)
clinical=4380/24+349/24
assert last/rate<clinical,(last/rate,clinical)
# Preserve raw aligned stems; duck only the listening mix, with a short hold and smooth recovery.
hop=441;pad=(-N)%hop
mono=np.mean(narr,axis=1);rms=np.sqrt(np.mean(np.pad(mono,(0,pad)).reshape(-1,hop)**2,axis=1))
active=rms>10**(-42/20);held=np.zeros(len(active),bool);remaining=0
for i,on in enumerate(active):
 remaining=25 if on else max(0,remaining-1);held[i]=on or remaining>0
level=0.;env=[]
for on in held:
 target=float(on);coef=np.exp(-.01/(.035 if target>level else .35));level=target+(level-target)*coef;env.append(level)
envelope=np.interp(np.arange(N),np.arange(len(env))*hop,np.array(env)).astype(np.float32)
mix=narr*np.float32(10**(-3/20))+bg*(.8*(1-.70*envelope))[:,None]
peak=float(np.max(np.abs(mix)));gain=min(1.,.95/max(peak,1e-10));mix*=gain
wav(M/'myscoutee_directors_cut_narration.wav',narr)
wav(W/'background.wav',bg)
wav(W/'mix.wav',mix)
result={'sample_rate':rate,'channels':2,'samples':N,'duration':N/rate,'narration_source':'narration.mp3','narration_source_sha256':hashlib.sha256((M/'narration.mp3').read_bytes()).hexdigest(),'source_decoded_samples_retained':preserved,'narration_speed_pitch':'unchanged; every decoded source sample retained in order','segments':segments,'actual_p12_clinical_cut':clinical,'narration_end':last/rate,'background':'original clip audio resampled once to 44100 Hz; 4-frame linear crossfades; raw aligned stem retained','mix':{'narration_gain_db':-3,'background_gain':.8,'voice_duck_multiplier':.3,'attack_seconds':.035,'hold_seconds':.25,'release_seconds':.35,'global_headroom_gain':gain,'sample_peak':float(np.max(np.abs(mix)))},'stems':'32-bit float WAV; narration/background independently editable; original files untouched'}
(W/'audio_validation.json').write_text(json.dumps(result,indent=2));print(json.dumps(result),flush=True)
