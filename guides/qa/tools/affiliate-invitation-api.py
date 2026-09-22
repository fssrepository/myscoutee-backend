#!/usr/bin/env python3
"""Public API leg using a key generated in the checkpoint's browser UI."""
import datetime, json, os, sys, uuid, urllib.request, urllib.error
from pathlib import Path
root=Path(os.environ.get('AFFILIATE_QA_RUNTIME','/tmp/affiliate-invitation-001'))
client=json.loads((root/'client.json').read_text())
def call(path, body):
    req=urllib.request.Request('http://localhost/api/integrations/v1'+path,data=json.dumps(body).encode(),headers={
      'Authorization':'Bearer '+client['secret'],'X-MyScoutee-Client-Id':client['clientId'],'Content-Type':'application/json'})
    with urllib.request.urlopen(req,timeout=20) as r:return json.load(r)
def save(name,data):
    p=root/name;p.write_text(json.dumps(data,indent=2));p.chmod(0o600)
command=sys.argv[1]
if command=='create':
    connection=call('/connect',{})
    now=datetime.datetime.now(datetime.timezone.utc)
    stamp=lambda days:(now+datetime.timedelta(days=days)).isoformat().replace('+00:00','Z')
    request={'items':[{'id':str(uuid.uuid4()),'title':'QA AFFILIATE INVITATION 001','subtitle':'Disposable invitation counter test',
      'startAt':stamp(2),'endAt':stamp(3),'location':'Austin','capacityMin':1,'capacityMax':10,'visibility':'Public','status':'A','mode':'Casual','topics':[]}]}
    event=call('/events',request);save('event.json',event)
    internal=event['items'][0]['externalId']
    invites=call('/events/'+internal+'/invites',{'participantIds':['qa-affiliate-person-one','qa-affiliate-person-two']})
    save('invites.json',invites);save('event-request.json',request)
    print(json.dumps({'connected':connection,'event':event,'participants':len(invites['items'])}))
elif command=='repeat':
    event=json.loads((root/'event.json').read_text());old=json.loads((root/'invites.json').read_text())
    new=call('/events/'+event['items'][0]['externalId']+'/invites',{'participantIds':['qa-affiliate-person-one','qa-affiliate-person-two']})
    assert [(x['id'],x['inviteUrl']) for x in new['items']]==[(x['id'],x['inviteUrl']) for x in old['items']]
    print(json.dumps({'stableLinks':True,'claimed':[x['claimed'] for x in new['items']]}))
elif command=='revoked':
    try:call('/connect',{})
    except urllib.error.HTTPError as e:
        assert e.code==401,e.code;print('Revoked key rejected: HTTP 401')
    else:raise AssertionError('Revoked key accepted')
