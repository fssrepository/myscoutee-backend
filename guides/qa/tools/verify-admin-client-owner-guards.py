#!/usr/bin/env python3
"""Prepare only owned disposable authorization states, exercise HTTP, restore in finally."""
import base64,hashlib,json,secrets,subprocess,urllib.request,urllib.error
from datetime import datetime,timezone,timedelta
owner='6ac102000000000000000003';token_id='admin-client-qa-guards-20260923'
key='msc_'+secrets.token_urlsafe(32)
def mongo(code):
 return json.loads(subprocess.check_output(['docker','exec','mongodb','sh','-c','exec mongosh --quiet --username "$MONGO_APP_USERNAME" --password "$MONGO_APP_PASSWORD" --authenticationDatabase demo_db demo_db --eval "$1"','owned-admin-guard',code],text=True))
def query(code):return mongo(code+";print(JSON.stringify({ok:true}));")
def status(path='/admin-client/v1/overview',headers=None,method='GET'):
 req=urllib.request.Request('http://localhost/api'+path,method=method,headers=headers or {'Authorization':'Bearer '+key,'X-MyScoutee-Client-Id':'b703c020-2a76-4277-b633-9854e5efaedd','X-App-Session-Kind':'demo'})
 try:
  with urllib.request.urlopen(req,timeout=10) as r:return r.status
 except urllib.error.HTTPError as e:return e.code
before=mongo("const s=db.manualQaCheckpointSnapshots.findOne({_id:'ADMIN-CLIENT-API-001'});if(!s||!s.users.includes("+json.dumps(owner)+"))throw Error('Not owned');if(db.integrationTokens.findOne({_id:"+json.dumps(token_id)+"}))throw Error('Guard token exists');print(EJSON.stringify(db.users.findOne({userId:"+json.dumps(owner)+"}))); ")
selector=json.dumps({'userId':owner});token_selector=json.dumps({'_id':token_id})
future=(datetime.now(timezone.utc)+timedelta(days=1)).isoformat().replace('+00:00','Z')
doc={'_id':token_id,'ownerUserId':owner,'name':'QA owner guards','scope':'admin-client','tokenHash':base64.urlsafe_b64encode(hashlib.sha256(key.encode()).digest()).decode().rstrip('='),'tokenPrefix':key[:12],'createdAtIso':datetime.now(timezone.utc).isoformat().replace('+00:00','Z'),'expiresAtIso':future}
evidence={}
try:
 query('db.users.updateOne('+selector+',{$set:{hostTier:"Admin",profileStatus:"public"},$unset:{statusText:"",status:"",deletedAtIso:""}});db.integrationTokens.insertOne('+json.dumps(doc)+')')
 initial=status();assert initial==200,f'Active disposable admin status: {initial}';evidence['activeAdmin']=200
 actors=json.load(open('/tmp/myscoutee-qa-browser-sessions/ADMIN-CLIENT-API-001.json'))['sessions'];ava=actors[0]
 h={'X-App-Session-Kind':'demo','X-App-Session-Id':ava['sessionId'],'X-Demo-User-Id':ava['userId']}
 assert status('/admin/client-api/tokens/'+token_id,h,'DELETE')==404;evidence['otherAdminsTokenNotRevokable']=404
 for profile in ['inactive','blocked','deleted']:
  query('db.users.updateOne('+selector+',{$set:{profileStatus:'+json.dumps(profile)+'}})');assert status()==403;evidence[profile]=403
 query('db.users.updateOne('+selector+',{$set:{profileStatus:"public",hostTier:"Attendee"}})');assert status()==403;evidence['removedRole']=403
 query('db.users.updateOne('+selector+',{$set:{hostTier:"Admin"}});db.integrationTokens.updateOne('+token_selector+',{$set:{expiresAtIso:"2000-01-01T00:00:00Z"}})');assert status()==401;evidence['expired']=401
 query('db.integrationTokens.updateOne('+token_selector+',{$set:{expiresAtIso:'+json.dumps(future)+',revokedAtIso:"2026-09-23T00:00:00Z"}})');assert status()==401;evidence['revoked']=401
 query('db.integrationTokens.updateOne('+token_selector+',{$unset:{revokedAtIso:""}});db.users.deleteOne('+selector+')');assert status()==403;evidence['removedOwner']=403
finally:
 query('db.users.replaceOne('+selector+',EJSON.parse('+json.dumps(json.dumps(before))+'),{upsert:true});db.integrationTokens.deleteOne('+token_selector+')')
print(json.dumps({'result':'PASS','evidence':evidence,'fixtureOwnerRestored':True,'guardTokenRemoved':True}))
