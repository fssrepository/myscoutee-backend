#!/usr/bin/env python3
"""Guest-side fixture for real UI smoke; never seeds successful journey outcomes.
Retains four generated upload images, private configuration snapshot and explicit
UI-created document IDs. seal/verify are preservation oracles, not UI verdicts.
Run as root on the designated QA guest. Cleanup is deliberately retained until
the authorized release upgrade preservation check has completed.
"""
import argparse,hashlib,json,os,secrets,struct,subprocess,zlib
from pathlib import Path
STATE=Path('/var/lib/myscoutee/qa-fixtures/deployment-smoke')
def run(*args,data=None):return subprocess.check_output(args,input=data)
def mongo(js):
    return json.loads(run('docker','exec','-i','mongodb','sh','-c','exec mongosh --quiet --username "$MONGO_INITDB_ROOT_USERNAME" --password "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase admin "${MONGO_INITDB_DATABASE:?}" --file /dev/stdin',data=js.encode()))
def save(s): (STATE/'manifest.json').write_text(json.dumps(s,indent=2)+'\n')
def png(rgb):
    def chunk(k,d):return struct.pack('!I',len(d))+k+d+struct.pack('!I',zlib.crc32(k+d)&0xffffffff)
    data=b''.join(b'\0'+b''.join(bytes(rgb if (x//40+y//40)%2 else tuple(min(255,c+45) for c in rgb)) for x in range(320)) for y in range(320))
    return b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('!2I5B',320,320,8,2,0,0,0))+chunk(b'IDAT',zlib.compress(data))+chunk(b'IEND',b'')
p=argparse.ArgumentParser(description=__doc__);p.add_argument('action',choices=['stage','status','record','seal','verify']);p.add_argument('--collection',choices=['users','profiles','events','assets']);p.add_argument('--id');a=p.parse_args();os.umask(0o077)
if os.geteuid()!=0 or STATE.is_symlink():p.error('Safe root guest execution required')
version=run('dpkg-query','-W','-f=${Version}','myscoutee').decode()
if a.action=='stage':
    if '~qa.' not in version:p.error('Stage only on QA guest')
    if STATE.exists():p.error('Fixture already retained; use status')
    config=mongo('print(JSON.stringify({document:EJSON.stringify(db.deploymentConfigurations.findOne(),{relaxed:false})}));')['document']
    STATE.mkdir(parents=True,mode=0o700)
    (STATE/'configuration-before.ejson').write_text(config)
    owner='smoke-'+secrets.token_hex(6)
    (STATE/'credentials.json').write_text(json.dumps({'email':owner+'@example.com','password':secrets.token_urlsafe(24)}))
    images={}
    for name,color in [('registration',(30,95,170)),('profile-update',(130,45,155)),('event',(180,100,20)),('asset',(20,130,90))]:
        data=png(color);(STATE/(name+'.png')).write_bytes(data);images[name]=hashlib.sha256(data).hexdigest()
    s={'runId':owner,'phase':'prepared','version':version,'records':[], 'images':images,'retention':'Keep through upcoming release update; cleanup not requested yet','configurationBeforeSha256':hashlib.sha256(config.encode()).hexdigest()};save(s)
else:s=json.loads((STATE/'manifest.json').read_text())
if a.action=='record':
    if not a.collection or not a.id or not a.id.isalnum():p.error('Explicit UI-created collection and ID required')
    if s['phase']=='sealed':p.error('Already sealed')
    query={'_id':a.id}
    record={'collection':a.collection,'id':a.id}
    if record not in s['records']:s['records'].append(record)
    save(s)
if a.action in ('seal','verify'):
    if not s['records']:p.error('No UI-created records registered')
    if a.action=='seal' and s['phase']=='sealed':p.error('Existing preservation baseline must not be overwritten')
    results={}
    for item in s['records']:
        c=json.dumps(item['collection']);i=json.dumps(item['id'])
        js='const id=ID; const q={_id:{$in: /^[a-f0-9]{24}$/i.test(id) ? [id,ObjectId(id)] : [id]}}; print(JSON.stringify({doc:EJSON.stringify(db.getCollection(COLLECTION).findOne(q),{relaxed:false})}));'
        doc=mongo(js.replace('ID',i).replace('COLLECTION',c))['doc']
        if doc=='null':raise SystemExit('Registered UI-created document missing')
        results[item['collection']+'/'+item['id']]=hashlib.sha256(doc.encode()).hexdigest()
    if a.action=='seal':s.update(phase='sealed',recordHashes=results);save(s)
    elif results!=s['recordHashes']:raise SystemExit('Retained record changed: inspect before claiming preservation')
print(json.dumps(s))
