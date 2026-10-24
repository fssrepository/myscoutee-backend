#!/usr/bin/env python3
"""Focused dev HTTP settings oracle; reserved fixture IDs, no browser or stack startup."""
import json, subprocess, urllib.request, uuid

ACTORS = ['6aff00000000000000000001', '6aff00000000000000000002']
PREFIX = 'qa-affiliate-settings-'

def mongo(code):
    return subprocess.check_output(['docker','exec','mongodb','sh','-c',
        'exec mongosh --quiet --username "$MONGO_APP_USERNAME" --password "$MONGO_APP_PASSWORD" --authenticationDatabase demo_db demo_db --eval "$1"',
        'affiliate-qa',code],text=True)

def call(actor,session,path,body=None):
    request=urllib.request.Request('http://localhost/api'+path,
        headers={'X-App-Session-Kind':'demo','X-Demo-User-Id':actor,'X-App-Session-Id':session,'Content-Type':'application/json'},
        data=None if body is None else json.dumps(body).encode())
    with urllib.request.urlopen(request,timeout=20) as response:
        data=response.read();return json.loads(data) if data else None

ids=json.dumps(ACTORS)
mongo(f'if(db.users.countDocuments({{userId:{{$in:{ids}}}}}))throw Error("Reserved QA actors already exist; refusing overwrite");')
sessions={}
try:
    mongo('const ids='+ids+''';
      for(const [i,id] of ids.entries()) db.users.insertOne({_id:id,userId:id,syncKey:id,name:'Affiliate QA '+i,
        email:'affiliate-qa-'+i+'@example.invalid',profileStatus:'public',status:'A',hostTier:'Member',age:30,
        profileFormVersion:1,completion:100,gender:'man',city:'Austin',languages:['English'],images:[],activities:{}});
      const owner=ids[0],other=ids[1];
      for(const [suffix,person,claimed,actor] of [['a','p1',true,owner],['b','p1',true,owner],['c','p2',false,owner],['d','p3',true,other]]) {
        const row={_id:'qa-affiliate-settings-'+suffix,ownerUserId:actor,eventId:'qa-affiliate-settings-'+suffix,
          participantId:person,tokenHash:'qa-affiliate-settings-'+suffix,createdAtIso:new Date().toISOString()};
        if(claimed)row.claimedUserId='qa-affiliate-settings-person-'+person;
        db.integrationParticipantInvites.insertOne(row);
      }
      db.affiliateRegistrations.insertOne({_id:'qa-affiliate-settings-referral',referrerUserId:owner,
        code:'fixture-only',registeredAtIso:new Date().toISOString()});
    ''')
    result={}
    for i,actor in enumerate(ACTORS):
        session=str(uuid.uuid4());sessions[actor]=session
        login=call(actor,session,'/auth/session/login',{'attemptId':str(uuid.uuid4()),'provider':'demo'})
        assert login['accepted'],login
        first=call(actor,session,'/integrations/settings')
        second=call(actor,session,'/integrations/settings?ownerUserId='+ACTORS[1-i])
        assert first['affiliate']==second['affiliate']
        assert first['affiliate']['url'].startswith('/entry?affiliate=')
        assert first['affiliate']['registered']==(1 if i==0 else 0)
        assert first['participants']=={'registered':1,'imported':2 if i==0 else 1}
        assert first['participants']==second['participants']
        assert first['tokens']==[] and first['maxActiveTokens']==3
        result[str(i)]={'registeredReferrals':first['affiliate']['registered'],'participants':first['participants'],'stableLink':True}
    print(json.dumps({'status':'PASS','actors':result,'proof':'Actual shared settings HTTP response, stable link, actor isolation, duplicate participant deduplication; fixture supplies prerequisite records.'},indent=2))
finally:
    for actor,session in sessions.items():
        try:call(actor,session,'/auth/me/logout',{'userId':actor})
        except Exception:pass
    mongo('const ids='+ids+''';
      db.integrationParticipantInvites.deleteMany({_id:{$regex:'^qa-affiliate-settings-'}});
      db.affiliateRegistrations.deleteMany({_id:{$regex:'^qa-affiliate-settings-'}});
      db.affiliateLinks.deleteMany({_id:{$in:ids}});
      for(const name of db.getCollectionNames()) {
        if(['affiliateLinks','affiliateRegistrations','integrationParticipantInvites'].includes(name))continue;
        db.getCollection(name).deleteMany({$or:[{userId:{$in:ids}},{ownerUserId:{$in:ids}},
          {recipientUserId:{$in:ids}},{actorUserId:{$in:ids}}]});
      }
      if(db.users.countDocuments({userId:{$in:ids}}))throw Error('QA cleanup failed');
    ''')
