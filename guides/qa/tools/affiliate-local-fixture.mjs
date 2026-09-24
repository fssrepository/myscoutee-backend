#!/usr/bin/env node
// Disposable IndexedDB prerequisites only. Never seeds successful payments/refunds.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {attach} from './admin-client-qa-runtime.mjs';
const action=process.argv[2]??'status';
const root='/tmp/myscoutee-affiliate-local-qa';
const c=await attach('AFFILIATE-LOCAL-001');
const read=`async function read(){const d=await new Promise((r,j)=>{let q=indexedDB.open('myscoutee_demo_db');q.onsuccess=()=>r(q.result);q.onerror=()=>j(q.error)});const data={};for(const k of ['users','events','activityMembers'])data[k]=await new Promise((r,j)=>{let q=d.transaction('tables').objectStore('tables').get(k);q.onsuccess=()=>r(q.result);q.onerror=()=>j(q.error)});d.close();return data;}`;
try{
 if(action==='stage'){
  const baseline=await c.evaluate(`(async()=>{${read};return await read()})()`);
  if(Object.values(baseline.events.byId).some(x=>x.id.startsWith('qa-local-affiliate-')))throw Error('Baseline already staged');
  await mkdir(root,{recursive:true,mode:0o700});await writeFile(root+'/baseline.json',JSON.stringify(baseline),{mode:0o600});
  const data=structuredClone(baseline),owner=data.users.byId.u41,buyer=data.users.byId.u42;
  if(!owner||!buyer||Object.keys(buyer.affiliatePayments??{}).length)throw Error('Clean local actors required');
  owner.profileStatus='public';buyer.profileStatus='public';buyer.locationCoordinates=owner.locationCoordinates;
  owner.affiliateCode='00000000-0000-4000-8000-000000000041';owner.affiliateRegistrations=[{userId:'u42',registeredAtIso:new Date().toISOString()}];buyer.affiliateReferrerUserId='u41';
  const sample=data.events.byId[data.events.ids[0]],sampleMember=data.activityMembers.byId[data.activityMembers.ids[0]];
  for(const [suffix,title,amount,currency,manual] of [['eur','EUR 100',100,'EUR',false],['huf','HUF 5000',5000,'HUF',false],['cancel','Cancel 10',10,'EUR',false],['delete','Delete 7',7,'EUR',false],['manual','Manual 12',12,'EUR',true]]){
   const id='qa-local-affiliate-'+suffix,start=new Date(Date.now()+172800000).toISOString(),end=new Date(Date.now()+180000000).toISOString();
   const e={...structuredClone(sample),id,userId:owner.id,creatorUserId:owner.id,organizerUserId:owner.id,adminIds:[owner.id],creatorName:owner.name,creatorInitials:owner.initials,creatorGender:owner.gender,creatorCity:owner.city,title:'QA Local '+title,subtitle:'Disposable local affiliate prerequisite',visibility:'Public',blindMode:'Open Event',status:'A',moderationStatus:'accepted',startAtIso:start,endAtIso:end,location:owner.city,locationCoordinates:owner.locationCoordinates,capacityMin:1,capacityMax:10,capacityTotal:10,acceptedMembers:1,pendingMembers:0,acceptedMemberUserIds:[owner.id],pendingMemberUserIds:[],pendingRequestMemberUserIds:[],invitedMemberUserIds:[],approvalRequired:manual,paymentDeadlineEnabled:true,paymentDeadlineHours:4,autoInviter:false,subEventsEnabled:false,subEvents:[],subEventDefinitions:[],currentStage:null,checkoutBasket:null,checkoutResultState:null,inviter:null,sourceLink:'',topics:[],distanceKm:0,rating:0,boost:0,affinity:0};
   delete e.seed;
   e.pricing={...structuredClone(sample.pricing),enabled:true,basePrice:amount,currency,taxMode:'included',minPrice:null,maxPrice:null,rounding:'none',quantityRulesEnabled:false,demandRulesEnabled:false,timeRulesEnabled:false,slotPricingEnabled:false,cancellationPolicy:{enabled:true,rules:[{id:'qa-policy',offsetUnit:'hours',offsetValue:0,refundKind:'percent',refundValue:25}]},audience:{...sample.pricing.audience,enabled:false}};
   const eventKey=`${owner.id}:events:${id}`;data.events.ids.push(eventKey);data.events.byId[eventKey]=e;
   const mid='events:'+id+':'+owner.id,ownerKey='event:'+id;
   data.activityMembers.ids.push(mid);data.activityMembers.byId[mid]={...structuredClone(sampleMember),id:mid,userId:owner.id,name:owner.name,initials:owner.initials,gender:owner.gender,city:owner.city,profile:owner,avatarUrl:owner.images[0],ownerId:id,ownerKey,ownerType:'event',role:'Admin',status:'accepted'};data.activityMembers.idsByOwnerKey[ownerKey]=[mid];
  }
  await c.evaluate(`(async()=>{const data=${JSON.stringify(data)};const d=await new Promise(r=>{let q=indexedDB.open('myscoutee_demo_db');q.onsuccess=()=>r(q.result)});await new Promise((r,j)=>{let t=d.transaction('tables','readwrite');for(const [k,v]of Object.entries(data))t.objectStore('tables').put(v,k);t.oncomplete=r;t.onerror=()=>j(t.error)});d.close();})()`);
  await c.send('Page.reload');console.log('Staged five unpaid local events, organizer membership and referral prerequisite; no financial outcome seeded.');
 }else if(action==='stage-retest'){
  const data=await c.evaluate(`(async()=>{${read};return await read()})()`);
  const suffix=process.argv[3]??'retest';
  if(!/^[a-z0-9-]+$/.test(suffix))throw Error('Invalid prerequisite suffix');
  const id='qa-local-affiliate-eur-'+suffix,source=Object.values(data.events.byId).find(e=>e.id==='qa-local-affiliate-eur'&&e.userId==='u41');
  if(!source||Object.values(data.events.byId).some(e=>e.id===id))throw Error('Retest prerequisite missing or already staged');
  const event={...structuredClone(source),id,title:'QA Local EUR 100 '+suffix,acceptedMembers:1,pendingMembers:0,checkoutBasket:null,checkoutResultState:null,acceptedMemberUserIds:['u41'],pendingMemberUserIds:[],pendingRequestMemberUserIds:[],invitedMemberUserIds:[]};
  event.timeframe=new Intl.DateTimeFormat('en-GB',{dateStyle:'medium',timeStyle:'short'}).format(new Date(event.startAtIso));
  const eventKey=`u41:events:${id}`;data.events.byId[eventKey]=event;data.events.ids.push(eventKey);
  const owner=data.users.byId.u41;
  const sourceMember=data.activityMembers.byId[data.activityMembers.ids[0]];
  const mid='events:'+id+':u41',ownerKey='event:'+id;
  data.activityMembers.byId[mid]={...structuredClone(sourceMember),id:mid,ownerId:id,ownerKey,ownerType:'event',userId:owner.id,name:owner.name,initials:owner.initials,gender:owner.gender,city:owner.city,profile:owner,avatarUrl:owner.images[0],role:'Admin',status:'accepted',requestKind:null};
  data.activityMembers.ids.push(mid);data.activityMembers.idsByOwnerKey[ownerKey]=[mid];
  await c.evaluate(`(async()=>{const data=${JSON.stringify({events:data.events,activityMembers:data.activityMembers})};const d=await new Promise(r=>{const q=indexedDB.open('myscoutee_demo_db');q.onsuccess=()=>r(q.result)});await new Promise((r,j)=>{const t=d.transaction('tables','readwrite');for(const [k,v]of Object.entries(data))t.objectStore('tables').put(v,k);t.oncomplete=r;t.onerror=()=>j(t.error)});d.close()})()`);
  await c.send('Page.reload',{ignoreCache:true});console.log('Added one unpaid EUR100 retest prerequisite; previous failed booking retained.');
 }else if(action==='prepare-unpaid-controls'){
  const data=await c.evaluate(`(async()=>{${read};return await read()})()`);
  const owner=data.users.byId.u41, template=data.activityMembers.byId[data.activityMembers.ids[0]];
  const paidSources=new Set(Object.values(data.users.byId).flatMap(u=>Object.values(u.affiliatePayments??{}).map(p=>p.sourceId)));
  for(const suffix of ['huf','cancel','delete','manual']){
   const id='qa-local-affiliate-'+suffix;
   if(paidSources.has(id))throw Error('Cannot change a paid prerequisite: '+id);
   const e=Object.values(data.events.byId).find(e=>e.id===id&&e.userId==='u41');
   if(!e)throw Error('Missing control '+id);
   const ownerKey='event:'+id, old=data.activityMembers.idsByOwnerKey[ownerKey]??[];
   if(old.some(k=>data.activityMembers.byId[k]?.userId==='u42'))throw Error('Cannot replace a buyer membership');
   for(const key of old)delete data.activityMembers.byId[key];
   data.activityMembers.ids=data.activityMembers.ids.filter(k=>!old.includes(k));
   const mid='event:'+id+':u41';
   data.activityMembers.byId[mid]={...structuredClone(template),id:mid,ownerId:id,ownerKey,ownerType:'event',userId:owner.id,name:owner.name,initials:owner.initials,gender:owner.gender,city:owner.city,profile:owner,avatarUrl:owner.images[0],role:'Admin',status:'accepted',requestKind:null};
   data.activityMembers.ids.push(mid);data.activityMembers.idsByOwnerKey[ownerKey]=[mid];
   Object.assign(e,{acceptedMembers:1,pendingMembers:0,acceptedMemberUserIds:['u41'],pendingMemberUserIds:[],pendingRequestMemberUserIds:[],invitedMemberUserIds:[],slotsEnabled:false,slotTemplates:[],frequency:'One-time'});
  }
  await c.evaluate(`(async()=>{const data=${JSON.stringify({events:data.events,activityMembers:data.activityMembers})};const d=await new Promise(r=>{const q=indexedDB.open('myscoutee_demo_db');q.onsuccess=()=>r(q.result)});await new Promise((r,j)=>{const t=d.transaction('tables','readwrite');for(const [k,v]of Object.entries(data))t.objectStore('tables').put(v,k);t.oncomplete=r;t.onerror=()=>j(t.error)});d.close()})()`);
  await c.send('Page.reload',{ignoreCache:true});console.log('Prepared unpaid controls with canonical organizer membership; paid controls and all financial records retained.');
 }else if(action==='normalize-prerequisites'){
  const data=await c.evaluate(`(async()=>{${read};return await read()})()`);
  const table=data.events;
  for(const key of [...table.ids]){
   const e=table.byId[key];if(!e?.id.startsWith('qa-local-affiliate-'))continue;
   const canonical=`${e.userId}:${e.type}:${e.id}`;
   if(key===canonical)continue;
   if(!table.byId[canonical]){table.byId[canonical]=e;table.ids.push(canonical)}
   delete table.byId[key];table.ids=table.ids.filter(k=>k!==key);
  }
  await c.evaluate(`(async()=>{const d=await new Promise(r=>{const q=indexedDB.open('myscoutee_demo_db');q.onsuccess=()=>r(q.result)});await new Promise((r,j)=>{const t=d.transaction('tables','readwrite');t.objectStore('tables').put(${JSON.stringify(table)},'events');t.oncomplete=r;t.onerror=()=>j(t.error)});d.close()})()`);
  await c.send('Page.reload',{ignoreCache:true});console.log('Canonicalized fixture event storage keys; existing canonical editor records retained. Payment/refund/membership tables untouched.');
 }else if(action==='status'){
  const data=await c.evaluate(`(async()=>{${read};return await read()})()`);
  console.log(JSON.stringify({owner:data.users.byId.u41?.affiliateRevenue,payer:data.users.byId.u42?.affiliatePayments,events:data.events.ids.filter(key=>data.events.byId[key]?.id.startsWith('qa-local-affiliate-')).map(key=>{const e=data.events.byId[key];return {id:e.id,userId:e.userId,status:e.status,cancelled:e.cancelled,accepted:e.acceptedMembers,pending:e.pendingMembers}}),members:data.activityMembers.ids.filter(id=>id.includes('qa-local-affiliate-')).map(id=>{const m=data.activityMembers.byId[id];return{id,userId:m.userId,status:m.status,requestKind:m.requestKind}})}));
 }else throw Error('Use stage, stage-retest [suffix], prepare-unpaid-controls, normalize-prerequisites or status; local cleanup closes the isolated disposable browser profile.');
}finally{c.close()}
