#!/usr/bin/env python3
"""Read-only evidence for the staged JOB-MESSAGES variation."""
import json
import subprocess
import sys
import time
from pathlib import Path

def mongo(script):
    return json.loads(subprocess.check_output(['docker','exec','mongodb','sh','-c',
        'exec mongosh --quiet --username "$MONGO_APP_USERNAME" --password "$MONGO_APP_PASSWORD" --authenticationDatabase demo_db demo_db --eval "$1"',
        'job-messages-oracle',script],text=True))

script = '''
const s=db.manualQaCheckpointSnapshots.findOne({scenario:"job-messages"});
const f=db.adminJobFixtureSnapshots.findOne({job:"scheduled-messages"});
if(!s||!f)throw Error("JOB-MESSAGES must be staged");
const id=f.context.userId,key=f.context.taskKey;
const rule=db.notificationRuleConfigs.findOne({ruleKey:"scheduled-messages"});
print(JSON.stringify({variation:f.variation,armedAt:s.armedAtIso,phase:s.phase,
 task:db.scheduledMessageTasks.findOne({_id:f.context.taskId}),
 user:db.users.findOne({_id:id},{status:1,profileStatus:1,devices:1}),
 activityDates:db.userSessionActions.find({userId:id},{createdDate:1}).toArray().map(a=>a.createdDate),
 runs:db.scheduledMessageRuns.find({ruleKey:key}).toArray(),
 deliveries:db.scheduledMessageDeliveries.find({ruleKey:key}).toArray(),
 affinity:db.affinityRecomputeTasks.find({targetId:id}).toArray(),
 workerRuns:(rule.runHistory||[]).filter(r=>!(s.runIdsBefore||[]).includes(r.id||r._id)),
 notifications:db.userNotifications.countDocuments({recipientUserId:id}),
 monitoring:db.adminMonitoring.findOne({_id:"admin-monitoring-global"})}));
'''
state=mongo(script)
if state['phase']!='armed':
    raise SystemExit('Arm the observed baseline first')
events={}
for attempt in range(45 if '--wait' in sys.argv else 1):
    records=json.loads(subprocess.check_output(['docker','exec','redis','redis-cli','--json','XRANGE','admin:telemetry','-','+'],text=True))
    for record_id,fields in records:
        data=dict(zip(fields[::2],fields[1::2]))
        try: event=json.loads(data.get('payload','{}'))
        except ValueError: continue
        if event.get('entityId')=='scheduled-messages' and event.get('occurredAtIso','')>=state['armedAt']:
            events[record_id]=event
    state=mongo(script)
    if state['task'].get('lastRunAtIso') and state['workerRuns']:
        break
    if '--wait' not in sys.argv: break
    time.sleep(2)
state['telemetry']=events
folder=Path('/tmp/myscoutee-qa-browser-sessions/evidence/job-messages-cdp')
folder.mkdir(parents=True,exist_ok=True)
file=folder/(state['variation']+'-oracle.json')
# Preserve already-observed stream evidence after ingestion removes its Redis records.
if file.exists():
    old=json.loads(file.read_text())
    if old.get('armedAt')==state['armedAt']: state['telemetry']={**old.get('telemetry',{}),**events}
file.write_text(json.dumps(state,indent=2));file.chmod(0o600)
print(json.dumps({k:state[k] for k in ['variation','phase','task','runs','deliveries','affinity','workerRuns','notifications','telemetry']},indent=2))
print('Evidence:',file)
if not state['task'].get('lastRunAtIso'): raise SystemExit('Worker result not available yet')

if '--verify' in sys.argv:
    task=state['task']; runs=state['runs']; deliveries=state['deliveries']; worker=state['workerRuns']
    assert len(runs)==len(deliveries)==len(worker)==1, 'Expected one task audit, delivery and scheduler run'
    assert worker[0]['status']=='completed' and worker[0]['trigger']=='scheduled', 'Worker did not complete normally'
    assert runs[0]['failedCount']==runs[0]['notificationCount']==runs[0]['emailQueuedCount']==0
    assert deliveries[0]['channel']=='action' and deliveries[0]['runId']==runs[0]['runId']
    assert state['notifications']==0
    if state['variation']=='inactive-user':
        assert task['status']=='completed' and task['lastRunCount']==runs[0]['affectedCount']==1
        assert state['user']['status']=='I' and state['user']['profileStatus']=='inactive'
        assert deliveries[0]['status']=='completed' and len(state['affinity'])==1
        assert state['affinity'][0]['reasons']==['ADMIN_STATUS_CHANGED']
    else:
        from datetime import datetime, timedelta
        assert task['status']=='scheduled' and task['lastRunCount']==runs[0]['affectedCount']==0
        assert state['user']['status']=='A' and state['user']['profileStatus']=='public'
        assert deliveries[0]['status']=='rescheduled' and not state['affinity']
        dates=state['activityDates']+ [d[k] for d in state['user'].get('devices',[]) for k in ['lastSeenAtIso','lastRegisteredAtIso'] if d.get(k)]
        parse=lambda x: datetime.fromisoformat(x.replace('Z','+00:00'))
        assert abs((parse(task['dueAtIso'])-max(map(parse,dates))-timedelta(days=30)).total_seconds())<1
    print('Exact task/user/audit/delivery/affinity oracle: PASS')
