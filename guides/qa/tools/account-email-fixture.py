#!/usr/bin/env python3
"""Four disposable deletion-window actors and reversible Job/config snapshots, demo_db only."""
import json
import subprocess
import sys
KEY='OPERATOR-EMAIL-WARNING-001'
IDS=['6ae001000000000000000001','6ae001000000000000000002','6ae001000000000000000003','6ae001000000000000000004']
command=sys.argv[1] if len(sys.argv)>1 else 'status'
base='const key='+json.dumps(KEY)+',ids='+json.dumps(IDS)+';'
if command in ('stage', 'stage-retry', 'stage-retry-guards'):
 base+='const retryPhase='+json.dumps(command!='stage')+';const retryGuards='+json.dumps(command=='stage-retry-guards')+';'
 code='''
if(db.getName()!=='demo_db')throw Error('Only demo_db is allowed');
if(db.manualQaCheckpointSnapshots.findOne({_id:key})||db.users.findOne({userId:{$in:ids}}))throw Error('Already staged');
const source=db.users.findOne({userId:'650000000000000000000061'});if(!source)throw Error('Demo source missing');
const jobs=db.notificationRuleConfigs.find({ruleKey:{$in:['account-purge','account-deletion-warning']}}).toArray();
if(jobs.length!==2)throw Error('Both Job seeds must be installed');
const config=db.affinityConfigs.find({active:true}).sort({version:-1}).limit(1).toArray()[0]??db.affinityConfigs.find({key:'default'}).sort({version:-1}).limit(1).toArray()[0];
const grace=config?.jobs?.accountPurgeWindowDays??30;if(grace<=5)throw Error('QA needs a grace period longer than five days');
db.manualQaCheckpointSnapshots.insertOne({_id:key,checkpointId:key,phase:'staging',scenario:'account-email',users:ids,jobs,emailConfiguration:db.operatorEmailConfigurations.findOne({_id:'global'}),stagedAtIso:new Date().toISOString()});
const ages=[grace-4.99,retryPhase?grace-4.99:grace-6,grace+1,grace-4.99],names=retryPhase?['Retry succeeds','Retry exhausted','Already expired','Restored']:['Due','Too early','Already expired','Restored'];
if(retryGuards)ages[1]=grace+1;
for(let i=0;i<ids.length;i++){
 const user={_id:ObjectId(ids[i]),userId:ids[i],syncKey:ids[i],name:'Email QA '+names[i],email:'email-qa-'+i+'@example.invalid',profileStatus:(i===3||(retryGuards&&i===0))?'public':'deleted',deletedAtIso:new Date(Date.now()-ages[i]*86400000).toISOString(),activities:{}};
 for(const field of ['age','gender','city','locationCoordinates','partitionKey','hostTier','images'])if(source[field]!==undefined)user[field]=source[field];
 if(retryGuards&&i<2){
  user.deletionWarningFor=user.deletedAtIso;
  db.accountDeletionWarnings.insertOne({_id:user.userId+':'+user.deletedAtIso,userId:user.userId,deletedAtIso:user.deletedAtIso,status:'retry',attemptCount:1,nextAttemptAtIso:new Date(Date.now()-60000).toISOString()});
 }
 db.users.insertOne(user);
}
db.notificationRuleConfigs.updateOne({ruleKey:'account-purge'},{$set:{enabled:false}});
db.notificationRuleConfigs.updateOne({ruleKey:'account-deletion-warning'},{$set:{enabled:!retryPhase,runState:{},'timing.mode':'interval','timing.intervalSeconds':retryPhase?3600:1,'timing.intervalMinutes':retryPhase?60:1,'timing.intervalAmount':1,'timing.intervalUnit':retryPhase?'hours':'seconds',scheduleSlots:[]}});
// Do not deliver until the operator explicitly saves the stub configuration in the UI.
db.operatorEmailConfigurations.updateOne({_id:'global'},{$set:{enabled:false},$inc:{revision:1},$setOnInsert:{providerId:'',fromEmail:'',fromName:'',credential:null}},{upsert:true});
db.manualQaCheckpointSnapshots.updateOne({_id:key},{$set:{phase:'ready'}});
print(JSON.stringify({phase:'ready',actors:ids,expectedRecipients:retryGuards?[]:retryPhase?['email-qa-0@example.invalid','email-qa-1@example.invalid']:['email-qa-0@example.invalid'],realDeliveryDisabled:true}));
'''
elif command=='reset':
 subprocess.run(['bash','server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh','restore','browser-sessions',KEY],check=True)
 code='''const state=db.manualQaCheckpointSnapshots.findOne({_id:key});if(!state)throw Error('Not staged');
for(const job of state.jobs)db.notificationRuleConfigs.replaceOne({_id:job._id},job,{upsert:true});
if(state.emailConfiguration)db.operatorEmailConfigurations.replaceOne({_id:'global'},state.emailConfiguration,{upsert:true});else db.operatorEmailConfigurations.deleteOne({_id:'global'});
db.accountDeletionWarnings.deleteMany({userId:{$in:ids}});db.users.deleteMany({userId:{$in:ids}});db.manualQaCheckpointSnapshots.deleteOne({_id:key});print(JSON.stringify({reset:true}));'''
elif command=='status':
 code='''const config=db.operatorEmailConfigurations.findOne({_id:'global'});print(JSON.stringify({staged:!!db.manualQaCheckpointSnapshots.findOne({_id:key}),configuration:config?{enabled:config.enabled,providerId:config.providerId,credentialConfigured:!!config.credential}:null,users:db.users.find({userId:{$in:ids}},{userId:1,profileStatus:1,deletedAtIso:1,deletionWarningFor:1}).toArray(),deliveries:db.accountDeletionWarnings.find({userId:{$in:ids}}).toArray()}));'''
else: raise SystemExit('Use stage, stage-retry, stage-retry-guards, status or reset')
print(subprocess.check_output(['docker','exec','mongodb','sh','-c','exec mongosh --quiet --username "$MONGO_APP_USERNAME" --password "$MONGO_APP_PASSWORD" --authenticationDatabase demo_db demo_db --eval "$1"','account-email-fixture',base+code],text=True).strip())
