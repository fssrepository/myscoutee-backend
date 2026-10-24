
if(process.env.MONGO_DEMO_DATABASE!=='msc121_demo')throw Error('Unexpected DEMO database');
const d=db.getSiblingDB('msc121_demo'), meta=db.getSiblingDB('msc121_bootstrap').businessChecks;
const run=%s, action=%s, namespaceUid=%s, scaled=%s;
let owned=meta.findOne({_id:run});
if(owned && owned.namespaceUid!==namespaceUid)throw Error('Fixture belongs to another namespace');
if(action==='stage') {
 if(owned)throw Error('Fixture already exists');
 const source=d.users.findOne({userId:'650000000000000000000061'});
 if(!source)throw Error('Canonical DEMO actor baseline missing');
 const ids=[new ObjectId().toHexString(),new ObjectId().toHexString()];
 meta.insertOne({_id:run,namespaceUid,ids,scaled,phase:'staging',createdAt:new Date()});
 for(let i=0;i<ids.length;i++) {
  const id=ids[i],user={_id:ObjectId(id),userId:id,accountUserId:id,syncKey:id,
   name:'MSC121 Contact '+i,initials:'MC',email:'msc121-'+id+'@example.invalid',
   profileStatus:'public',activities:{},contactRequestsPending:0,devices:[],
   about:'Disposable microservices contact check',headline:'MSC121 verification',msc121Check:run};
  for(const field of ['age','birthday','city','height','physique','languages','horoscope','gender',
   'hostTier','completion','profileFormVersion','locationCoordinates','partitionKey','images','profileDetails',
   'workspaceGroupId'])if(source[field]!==undefined)user[field]=source[field];
  d.users.insertOne(user);
 }
 meta.updateOne({_id:run},{$set:{phase:'ready'}});
 owned=meta.findOne({_id:run});
}
if(!owned)throw Error('Owned fixture receipt missing');
const ids=owned.ids, operations={$or:[{actor:{$in:ids}},{target:{$in:ids}}]};
const outbox={recipientUserIds:{$in:ids}};
if(action==='inspect') {
 print(JSON.stringify({ids,operations:d.contactAccessOperations.find(operations,{_id:1,state:1}).toArray(),
  users:d.users.find({userId:{$in:ids}},{userId:1,contactRequestsPending:1,'activities.contacts':1}).toArray(),
  outboxCount:d.notificationOutbox.countDocuments(outbox)}));
} else if(action==='cleanup') {
 if(d.users.countDocuments({userId:{$in:ids},msc121Check:{$ne:run}}))throw Error('Fixture actor ownership changed');
 if(d.contactAccessOperations.countDocuments({$and:[operations,{state:{$nin:['complete','conflict']}}]}))
  throw Error('Contact work still pending; retain fixture and retry cleanup after recovery');
 if(d.notificationOutbox.countDocuments({$and:[outbox,{status:'running'}]}))
  throw Error('Notification worker still owns fixture work; retry cleanup');
 // Never delete unrelated recipients even if a malformed test request touched them.
 if(d.notificationOutbox.find(outbox).toArray().some(x=>(x.recipientUserIds||[]).some(id=>!ids.includes(id))))
  throw Error('Unexpected foreign notification recipient');
 d.notificationOutbox.deleteMany({$and:[outbox,{status:{$ne:'running'}}]});
 if(d.notificationOutbox.countDocuments(outbox))throw Error('A worker claimed fixture work; retry cleanup');
 d.userNotifications.deleteMany({recipientUserId:{$in:ids}});
 d.contactAccessOperations.deleteMany(operations);
 d.contactChatAccess.deleteMany({leftUserId:{$in:ids},rightUserId:{$in:ids}});
 for(const collection of ['navigatorContacts','userSessionStates','userSessionActions'])
  d.getCollection(collection).deleteMany({userId:{$in:ids}});
 d.users.deleteMany({userId:{$in:ids},msc121Check:run});
 meta.updateOne({_id:run},{$set:{phase:'cleaned',cleanedAt:new Date()}});
 print(JSON.stringify({cleaned:true,scaled:owned.scaled}));
} else if(action!=='inspect') print(JSON.stringify({ids:owned.ids,phase:owned.phase,scaled:owned.scaled}));
