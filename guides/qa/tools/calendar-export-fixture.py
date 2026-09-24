#!/usr/bin/env python3
"""Calendar input controls only; never inserts export/import/reminder outcomes.

Requires the versioned gallery actor fixture; its reset owns these actors/events.
"""
import json
import subprocess
import sys

action = sys.argv[1] if len(sys.argv) > 1 else 'status'
if action not in ('stage', 'status', 'normalize-invited-control'):
    raise SystemExit('Use stage or status')
script = r'''
const owner='6a1100000000000000000001',viewer='6a1100000000000000000002';
const key='EVENT-GALLERY-FEED-001', prefix='6ca1';
if(db.getName()!=='demo_db')throw Error('Only demo_db');
const snapshot=db.manualQaCheckpointSnapshots.findOne({_id:key});
if(!snapshot)throw Error('Stage the gallery actors first');
if(ACTION==='stage') {
 if(snapshot.calendarControls)throw Error('Calendar controls already staged');
 const actor=db.users.findOne({userId:owner});
 const sample=db.events.findOne({status:'A',generated:{$ne:true}});
 if(!actor||!sample)throw Error('Canonical actor/event prerequisite missing');
 const controls=[
  ['standard','A','accepted','Casual'],['tournament','A','accepted','Tournament'],
  ['mingle','A','accepted','Mingle'],['ongoing','A','accepted','Casual'],
  ['pending','A','pending','Casual'],['invited','A','I','Casual'],
  ['unrelated','A',null,'Casual'],['draft','DR','accepted','Casual'],
  ['review','UR','accepted','Casual'],['blocked','B','accepted','Casual'],
  ['trash','T','accepted','Casual'],['deleted','D','accepted','Casual'],
  ['past','A','accepted','Casual'],['owned','A',null,'Casual']
 ];
 const ids=[]; const now=Date.now();
 for(let i=0;i<controls.length;i++) {
  const [name,status,membership,mode]=controls[i],id=prefix+String(i+1).padStart(20,'0');
  if(db.events.findOne({sourceId:id}))throw Error('ID collision');
  const creator=name==='owned'?viewer:owner;
  const start=new Date(now+(name==='past'?-7200000:name==='ongoing'?-600000:7200000)+i*60000).toISOString();
  const end=new Date(name==='past'?now-3600000:Date.parse(start)+3600000).toISOString();
  const e={...sample,_id:ObjectId(id),sourceId:id,syncKey:id,ownerUserId:creator,
   creatorUserId:creator,organizerUserId:creator,admins:[creator],creatorName:creator===owner?'Gallery QA Creator':'Gallery QA Viewer',
   title:'QA Calendar '+name,subtitle:'Disposable calendar export input',status,mode,
   startAtIso:start,endAtIso:end,timeframe:start+' – '+end,frequency:'One-time',
   cancelledAtIso:null,cancelledByUserId:null,cancellationRefundsComplete:false,paidTermsRefundsPending:false,
   refundEligibleUserIds:[],paidTermsChangedBy:null,paidTermsChangedAtIso:null,
   generated:false,eventType:'main',parentEventId:null,subEventsEnabled:false,subEvents:[],subEventDefinitions:[],
   slotsEnabled:false,slotTemplates:[],upcomingSlots:[],expired:false,
   moderationStatus:status==='UR'?'under-review':status==='B'?'blocked':'accepted',
   location:'Budapest, Árvíztűrő; park \\ gate\nSECOND-LINE',locationCoordinates:actor.locationCoordinates,
   pricing:{...sample.pricing,enabled:false,basePrice:0},ticketing:false,autoInviter:false,approvalRequired:true,
   acceptedMembers:membership==='accepted'?2:1,pendingMembers:membership==='pending'?1:0,
   acceptedMemberUserIds:[creator,...(membership==='accepted'&&creator!==viewer?[viewer]:[])],
   pendingMemberUserIds:membership==='pending'?[viewer]:[],pendingRequestMemberUserIds:membership==='pending'?[viewer]:[],
   invitedMemberUserIds:membership==='I'?[viewer]:[],createdDate:new Date().toISOString(),updatedDate:new Date().toISOString()};
  if(name==='standard')e.title+=' Á😀'.repeat(30)+',;\\\nBEGIN:VEVENT';
  db.events.insertOne(e);
  const members=[{userId:creator,role:'Admin',status:'accepted'}];
  if(membership&&creator!==viewer)members.push({userId:viewer,role:'Member',status:membership});
  for(const m of members)db.activityMembers.insertOne({_id:'qa-calendar:'+id+':'+m.userId,ownerType:'event',ownerId:id,...m,actionAtIso:new Date().toISOString()});
  ids.push({id,name,status,membership,mode,start,end});
 }
 db.manualQaCheckpointSnapshots.updateOne({_id:key},{$set:{calendarControls:ids}});
}
if(ACTION==='normalize-invited-control'){const control=(snapshot.calendarControls??[]).filter(x=>x.name==='invited')[0];if(!control)throw Error('Missing isolated invitation control');db.activityMembers.updateOne({_id:'qa-calendar:'+control.id+':'+viewer,status:'invited'},{$set:{status:'I'}});}
const current=db.manualQaCheckpointSnapshots.findOne({_id:key});
print(JSON.stringify({controls:current.calendarControls??[],events:db.events.find({sourceId:{$in:(current.calendarControls??[]).map(x=>x.id)}},{sourceId:1,status:1,moderationStatus:1,cancelledAtIso:1,startAtIso:1,endAtIso:1}).toArray()}));
'''.replace('ACTION', json.dumps(action))
print(subprocess.check_output(['docker', 'exec', 'mongodb', 'sh', '-c',
    'exec mongosh --quiet --username "$MONGO_APP_USERNAME" --password "$MONGO_APP_PASSWORD" --authenticationDatabase demo_db demo_db --eval "$1"',
    'calendar-export-fixture', script], text=True).strip())
