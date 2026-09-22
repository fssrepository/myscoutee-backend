#!/usr/bin/env python3
"""Isolated EVENT-FOLLOWING-001 actors/events; follow relationships are created through the UI."""
import json, subprocess, sys
KEY=sys.argv[2] if len(sys.argv)>2 else 'EVENT-FOLLOWING-001'
if KEY not in ('EVENT-FOLLOWING-001','EVENT-FOLLOWING-002'): raise ValueError('Unknown following checkpoint')
IDS=['6af011000000000000000001','6af011000000000000000002','6af011000000000000000003']
def mongo(code):
 return subprocess.check_output(['docker','exec','mongodb','sh','-c',
  'exec mongosh --quiet --username "$MONGO_APP_USERNAME" --password "$MONGO_APP_PASSWORD" --authenticationDatabase demo_db demo_db --eval "$1"','following-fixture',code],text=True)
command=sys.argv[1] if len(sys.argv)>1 else 'status'
base='const key='+json.dumps(KEY)+',ids='+json.dumps(IDS)+'; '
if command=='stage':
 code='''if(db.manualQaCheckpointSnapshots.findOne({_id:key}) || db.users.findOne({userId:{$in:ids}}))throw Error('Already staged');
 const source=db.users.findOne({userId:'650000000000000000000061'});if(!source)throw Error('Demo source missing');
 const names=['Following QA Viewer','Following QA Organizer','Following QA Other'];
 const users=ids.map((id,i)=>{const user={_id:ObjectId(id),userId:id,syncKey:id,name:names[i],initials:'FQ',email:'following-'+i+'@example.invalid',profileStatus:'public',activities:{},devices:[],about:'Disposable following QA',headline:'Following QA'};
 for(const field of ['age','birthday','city','height','physique','languages','horoscope','gender','hostTier','completion','profileFormVersion','locationCoordinates','partitionKey','images','profileDetails'])if(source[field]!==undefined)user[field]=source[field];return user;});
 const now=Date.now(),iso=h=>new Date(now+h*3600000).toISOString();
 const specs=[['current',1,2,'A','Public',ids[1]],['future',24,25,'A','Public',ids[1]],['past',-2,-1,'A','Public',ids[1]],['private',1,2,'A','Invitation only',ids[1]],['draft',1,2,'DR','Public',ids[1]],['other',1,2,'A','Public',ids[2]]];
 const events=specs.map(([suffix,start,end,status,visibility,owner])=>({_id:'qa-following-'+suffix,syncKey:'qa-following-'+suffix,sourceId:'qa-following-'+suffix,ownerUserId:owner,creatorUserId:owner,creatorName:names[ids.indexOf(owner)],creatorInitials:'FQ',creatorGender:source.gender,creatorCity:source.city,title:'QA FOLLOWING '+suffix,subtitle:'Disposable organizer following regression',status,visibility,mode:'Casual',startAtIso:iso(start),endAtIso:iso(end),admins:[owner],topics:[],capacityMin:1,capacityMax:10,capacityTotal:10,acceptedMembers:0,pendingMembers:0,location:'Austin',locationCoordinates:source.locationCoordinates,subEvents:[],acceptedMemberUserIds:[],pendingRequestMemberUserIds:[],invitedMemberUserIds:[],generated:false}));
 db.manualQaCheckpointSnapshots.insertOne({_id:key,checkpointId:key,scenario:'event-following',phase:'ready',users:ids,eventIds:events.map(e=>e.sourceId),stagedAtIso:new Date().toISOString()});
 db.users.insertMany(users);db.events.insertMany(events);print(JSON.stringify({phase:'ready',actors:ids,events:events.map(e=>e.sourceId),seededFollowing:false}));'''
elif command=='menu-invitation':
 code="""if(!db.manualQaCheckpointSnapshots.findOne({_id:key}))throw Error('Not staged');
 for(const sourceId of ['qa-following-current','qa-following-future']) {
 const sourceLink=sourceId==='qa-following-current'?'http://localhost/entry?qa=event-following-menu':'';
 db.events.updateOne({sourceId,ownerUserId:ids[1]},{$set:{sourceLink,invitedMemberUserIds:[ids[0]],pendingMembers:1}});
 const copy=db.events.findOne({sourceId,ownerUserId:ids[1]});copy._id=sourceId+'-invitation';copy.syncKey=copy._id;copy.ownerUserId=ids[0];copy.status='I';
 db.events.replaceOne({_id:copy._id},copy,{upsert:true});
 db.activityMembers.replaceOne({_id:sourceId+'-member'},{_id:sourceId+'-member',ownerType:'event',ownerId:sourceId,userId:ids[0],name:'Following QA Viewer',role:'Member',status:'I',requestKind:'invite',pendingSource:'admin',invitedByUserId:ids[1],actionAtIso:new Date().toISOString()},{upsert:true});
 }
 print(JSON.stringify({invitations:2,externalLinks:1,seededFollowing:false}));"""
elif command=='shorten-current':
 # Setup only: application follow action arms the stored expiry; worker must remove it.
 code="""if(!db.manualQaCheckpointSnapshots.findOne({_id:key}))throw Error('Not staged');
 const end=new Date(Date.now()+45000).toISOString();
 db.events.updateMany({sourceId:'qa-following-current'},{$set:{startAtIso:new Date(Date.now()-60000).toISOString(),endAtIso:end}});
 print(JSON.stringify({shortenedSource:'qa-following-current',endAtIso:end,counterWritten:false}));"""
elif command=='layout-table':
 # Paused table is a UI prerequisite, not proof of matchmaking/lifecycle.
 code="""if(!db.manualQaCheckpointSnapshots.findOne({_id:key}))throw Error('Not staged');
 const eventId='qa-following-future',groupId=eventId+':mingle-round-1:table:1',now=new Date().toISOString();
 db.events.updateMany({sourceId:eventId},{$set:{mode:'Mingle',mingleConfiguration:{groupSize:2,plannedRounds:2,roundDurationMinutes:10,breakDurationMinutes:1,requireGenderBalance:false},acceptedMemberUserIds:[ids[0],ids[2]],acceptedMembers:2}});
 for(const ownerType of ['event','group'])for(const userId of [ids[0],ids[2]]){
 const ownerId=ownerType==='event'?eventId:groupId,id='qa-following-'+ownerType+'-'+userId;
 db.activityMembers.replaceOne({_id:id},{_id:id,ownerType,ownerId,userId,name:userId===ids[0]?'Following QA Viewer':'Following QA Other',role:'Member',status:'accepted',joinedAtIso:now},{upsert:true});}
 db.activityMingleSessions.replaceOne({eventId},{_id:'qa-following-session',eventId,status:'PAUSED',currentRoundNumber:1,pausedFromStatus:'ROUND',pausedRemainingSeconds:600,revision:1,updatedAtIso:now,createdAtIso:now,documentVersion:0},{upsert:true});
 db.activityMingleRounds.replaceOne({eventId,roundNumber:1},{_id:'qa-following-round',eventId,roundNumber:1,status:'ACTIVE',tables:[{tableNumber:1,memberUserIds:[ids[0],ids[2]]}],startedAtIso:now},{upsert:true});
 const copy=db.events.findOne({sourceId:eventId,ownerUserId:ids[1]});copy._id='qa-following-joined';copy.ownerUserId=ids[0];copy.syncKey=copy._id;db.events.replaceOne({_id:copy._id},copy,{upsert:true});
 print(JSON.stringify({layoutTable:1,joinedSource:eventId,counterWritten:false}));"""
elif command=='reset':
 subprocess.run(['bash','server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh','restore','browser-sessions',KEY],check=True)
 code='''const state=db.manualQaCheckpointSnapshots.findOne({_id:key});if(!state)throw Error('Not staged');
 for(const name of ['activityMingleSessions','activityMingleRounds','events','activityMembers','eventWatchSubscriptions','privacyConsents','chats','userSessionStates','userPageFilterPreferences','userLoginSessions','userLoginAudits','userSessionActions'])db.getCollection(name).deleteMany({$or:[{_id:{$in:ids}},{userId:{$in:ids}},{ownerUserId:{$in:ids}},{sourceId:{$in:state.eventIds}},{ownerId:{$in:state.eventIds}},{eventId:{$in:state.eventIds}}]});
 db.users.deleteMany({userId:{$in:ids}});db.manualQaCheckpointSnapshots.deleteOne({_id:key});print('Reset following QA');'''
else:
 code='''print(JSON.stringify({state:db.manualQaCheckpointSnapshots.findOne({_id:key}),users:db.users.find({userId:{$in:ids}},{userId:1,name:1,following:1,activities:1}).toArray()}));'''
print(mongo(base+code).strip())
