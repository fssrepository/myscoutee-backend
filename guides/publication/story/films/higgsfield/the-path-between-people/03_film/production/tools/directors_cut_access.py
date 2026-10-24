#!/usr/bin/env python3
"""HEVC copied-range splice headers. Requires PyAV; coded image coefficients are retained."""
import av, argparse
from pathlib import Path
W=Path('/home/raxim/Downloads/.full-film-dream')
parser=argparse.ArgumentParser();parser.add_argument('--source',type=Path);parser.add_argument('--output',type=Path);args=parser.parse_args()
for source in ([args.source] if args.source else sorted(W.glob('copy[0-9][0-9].mp4'))):
 dst=args.output or W/(source.stem+'_bla.mp4');first=True;removed=0
 with av.open(str(source)) as inp,av.open(str(dst),'w') as out:
  st=inp.streams.video[0];ost=out.add_stream_from_template(st)
  for p in inp.demux(st):
   if not p.size:continue
   if p.pts is not None and p.pts<0:removed+=1;continue
   if first:
    data=bytearray(bytes(p));at=0;changed=False
    while at+4<=len(data):
     n=int.from_bytes(data[at:at+4],'big');at+=4;t=(data[at]>>1)&63
     if t==21:data[at]=(data[at]&0x81)|(18<<1);changed=True
     at+=n
    assert changed
    q=av.Packet(bytes(data));q.pts=p.pts;q.dts=p.dts;q.duration=p.duration;q.time_base=p.time_base;q.is_keyframe=p.is_keyframe;p=q;first=False
   p.stream=ost;out.mux(p)
 print(source.name,'first CRA -> BLA_N_LP; negative preroll removed:',removed,flush=True)
