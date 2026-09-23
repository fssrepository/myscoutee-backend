#!/usr/bin/env python3
"""Private admin monitor's disposable profile population; never starts the stack."""
import json
import subprocess
import sys
KEY = 'ADMIN-CLIENT-API-001'
IDS = [f'6ac102{i:018x}' for i in range(1, 6)]
command = sys.argv[1] if len(sys.argv) > 1 else 'status'
if command not in ('stage', 'status', 'reset'):
    raise SystemExit('Use stage, status or reset')
base = 'const key=' + json.dumps(KEY) + ',ids=' + json.dumps(IDS) + ';'
code = {
'stage': '''
if(db.getName()!=='demo_db')throw Error('Only demo_db is allowed');
if(db.manualQaCheckpointSnapshots.findOne({_id:key})||db.users.findOne({userId:{$in:ids}}))throw Error('Already staged');
const source=db.users.findOne({userId:'650000000000000000000061'});if(!source)throw Error('Demo source missing');
const stats=db.adminStats.findOne({statsKey:'global'},{activeProfileGenders:1,generatedAtIso:1,dailyActivity:1});
if(!stats?.activeProfileGenders)throw Error('Wait for the ordinary statistics worker before staging');
db.manualQaCheckpointSnapshots.insertOne({_id:key,checkpointId:key,phase:'staging',scenario:'admin-client',users:ids,statsBefore:stats,stagedAtIso:new Date().toISOString()});
const statuses=['public','friends only','inactive','blocked','deleted'];
for(let i=0;i<ids.length;i++){
 const user={_id:ObjectId(ids[i]),userId:ids[i],syncKey:ids[i],name:'Admin API QA '+(i+1),initials:'AQ',email:'admin-api-qa-'+i+'@example.invalid',profileStatus:statuses[i],gender:i%2?'man':'woman',activities:{},devices:[]};
 for(const field of ['age','birthday','city','height','physique','languages','horoscope','completion','profileFormVersion','locationCoordinates','partitionKey','images','profileDetails'])if(source[field]!==undefined)user[field]=source[field];
 if(i===4)user.deletedAtIso=new Date().toISOString();
 db.users.insertOne(user);
}
db.manualQaCheckpointSnapshots.updateOne({_id:key},{$set:{phase:'ready'}});
print(JSON.stringify({phase:'ready',actors:ids,expectedActiveDelta:2,expectedGenderDelta:{female:1,male:1},registrationTelemetrySeeded:false}));
''',
'status': '''print(JSON.stringify({checkpoint:db.manualQaCheckpointSnapshots.findOne({_id:key}),current:db.adminStats.findOne({statsKey:'global'},{activeProfileGenders:1,generatedAtIso:1,dailyActivity:1})}));''',
'reset': '''
if(!db.manualQaCheckpointSnapshots.findOne({_id:key}))throw Error('Not staged');
for(const collection of ['userExperienceProfiles','privacyConsents','userSessionStates','userPageFilterPreferences','userLoginSessions','userLoginAudits','userSessionActions'])db.getCollection(collection).deleteMany({userId:{$in:ids}});
db.users.deleteMany({userId:{$in:ids}});db.manualQaCheckpointSnapshots.deleteOne({_id:key});
print(JSON.stringify({reset:true,statsRefresh:'ordinary worker',auditMessagesRetained:true}));
'''
}[command]
if command == 'reset':
    subprocess.run(['bash','server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh','restore','browser-sessions',KEY], check=True)
print(subprocess.check_output(['docker','exec','mongodb','sh','-c',
    'exec mongosh --quiet --username "$MONGO_APP_USERNAME" --password "$MONGO_APP_PASSWORD" --authenticationDatabase demo_db demo_db --eval "$1"',
    'admin-client-api-fixture',base+code],text=True).strip())
