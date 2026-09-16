#!/usr/bin/env python3
"""Compare seed implementations in one isolated, uniquely owned bucket.
No user bucket, production scripts, image or running service is changed.
"""
import hashlib,json,subprocess,time,uuid,sys
from pathlib import Path
p=Path(sys.argv[1]);before=sys.argv[2];after=sys.argv[3]
if p.exists():raise SystemExit('Use a new evidence file')
def run(*args,data=None):return subprocess.check_output(args,input=data,stderr=subprocess.PIPE)
bucket='qualification-seed-'+uuid.uuid4().hex[:12]
def mc(*args,data=None):return run('docker','exec','-i','minio','mc',*args,data=data)
def inv():
    rows=[json.loads(x) for x in mc('ls','--recursive','--json','myscoutee/'+bucket).decode().splitlines()]
    return {x['key']:{k:x.get(k) for k in ('size','etag')} for x in rows}
def mime(key):
    j=json.loads(mc('stat','--json','myscoutee/'+bucket+'/'+key));return j.get('metadata',{}).get('Content-Type')
r={'bucket':bucket,'scope':'Isolated bucket only; existing container and packaged seed. No app restart.','timings':{}}
mc('mb','myscoutee/'+bucket)
try:
    canary=b'User owned control survives seed refresh\n';mc('pipe','myscoutee/'+bucket+'/user-upload-control.txt',data=canary)
    for phase,script in [('before',before),('after',after)]:
        start=time.monotonic();run('docker','exec','-e','MEDIA_BUCKET='+bucket,'minio','sh',script);r['timings'][phase]=round(time.monotonic()-start,3)
        current=inv()
        samples={ext:next(k for k in current if k.endswith(ext)) for ext in ('.webp','.svg','.png')}
        metadata={k:mime(v) for k,v in samples.items()}
        if phase=='before':baseline=current;baseline_metadata=metadata
        else:
            assert baseline==current,'Key/size/content ETag changed'
            assert baseline_metadata==metadata,'Content-Type changed'
        assert mc('cat','myscoutee/'+bucket+'/user-upload-control.txt')==canary,'Unrelated user data changed'
    r.update(status='PASS',objects=len(current)-1,contentTypes=metadata,inventorySha256=hashlib.sha256(json.dumps(current,sort_keys=True).encode()).hexdigest())
except Exception:
    r['status']='FAIL';raise
finally:
    # Exact generated bucket only, never production bucket.
    mc('rb','--force','myscoutee/'+bucket);r['cleanup']='Owned bucket removed';p.write_text(json.dumps(r,indent=2)+'\n')
print(json.dumps(r))
