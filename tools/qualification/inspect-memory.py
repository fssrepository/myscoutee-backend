#!/usr/bin/env python3
"""Read-only memory attribution on the designated guest, no configuration writes."""
import json,subprocess,sys
from pathlib import Path
p=Path(sys.argv[1])
if p.exists():raise SystemExit('Use a new output file')
def run(*args,data=None):return subprocess.check_output(args,input=data).decode()
r={'javaSmapsRollup':run('docker','exec','myscoutee','cat','/proc/1/smaps_rollup'),
   'javaStatus':'\n'.join(x for x in run('docker','exec','myscoutee','cat','/proc/1/status').splitlines() if x.startswith(('VmRSS:','VmPeak:','VmData:','Threads:'))),
   'containerMemoryLimits':run('docker','inspect','myscoutee','mongodb','minio','--format','{{.Name}} memoryLimit={{.HostConfig.Memory}}')}
js='const c=db.serverStatus().wiredTiger.cache; print(JSON.stringify({currentBytes:Number(c["bytes currently in the cache"]),maxBytes:Number(c["maximum bytes configured"]),dirtyBytes:Number(c["tracked dirty bytes in the cache"])}));'
r['mongoCache']=json.loads(run('docker','exec','-i','mongodb','sh','-c','exec mongosh --quiet --username "$MONGO_INITDB_ROOT_USERNAME" --password "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase admin --file /dev/stdin',data=js.encode()))
p.write_text(json.dumps(r,indent=2)+'\n');print(json.dumps(r))
