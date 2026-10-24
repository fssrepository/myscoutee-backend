#!/usr/bin/env python3
"""Exact HTTP actions for the Notification Admin fixture; no browser-state edits."""
import json
from pathlib import Path
import subprocess
import sys
import urllib.error
import urllib.parse
import urllib.request
ROOT = Path(__file__).resolve().parents[5]
CHECKPOINT = 'NOTIFICATION-ADMIN-LIFECYCLE-001'
MANIFEST = Path('/tmp/myscoutee-qa-browser-sessions') / (CHECKPOINT + '.json')
manifest = json.loads(MANIFEST.read_text())
action = sys.argv[1]
if manifest['checkpointId'] != CHECKPOINT or action not in ['invalid-rule', 'produce']:
    raise SystemExit('Use invalid-rule|produce with the owned Notification Admin sessions')
actor = next(s for s in manifest['sessions'] if s['actor'] == ('Ava' if action == 'invalid-rule' else 'Casey'))
headers = {'X-App-Session-Kind': 'demo', 'X-Demo-User-Id': actor['userId'], 'X-App-Session-Id': actor['sessionId'], 'Content-Type': 'application/json'}
def request(path, body=None):
    try:
        with urllib.request.urlopen(urllib.request.Request('http://localhost/api' + path, headers=headers,
                data=None if body is None else json.dumps(body).encode()), timeout=15) as r:
            return r.status, json.load(r)
    except urllib.error.HTTPError as e:
        return e.code, None

def mongo(script):
    return json.loads(subprocess.check_output(['docker', 'exec', 'mongodb', 'sh', '-c',
        'exec mongosh --quiet --username "$MONGO_APP_USERNAME" --password "$MONGO_APP_PASSWORD" --authenticationDatabase demo_db demo_db --eval "$1"',
        'notification-admin-oracle', script], text=True))
state = mongo('const s=db.manualQaCheckpointSnapshots.findOne({scenario:"notification-admin"}); print(JSON.stringify({phase:s?.phase,checkpoint:s?.checkpointId}));')
if state['checkpoint'] != CHECKPOINT:
    raise SystemExit('The Notification Admin fixture is not staged')
if action == 'invalid-rule':
    code, rule = request('/admin/notifications/notification-outbox/runtime?adminUserId=' + actor['userId'])
    if code != 200 or rule['timing']['intervalAmount'] != 2:
        raise SystemExit('Expected the verified two-minute rule')
    digest_script = '''const crypto=require("crypto");const result={};
      for(const name of ["notificationRuleConfigs","notificationOutbox","userNotifications"]){
        const docs=db.getCollection(name).find({}).sort({_id:1}).toArray();
        result[name]={count:docs.length,hash:crypto.createHash("sha256").update(EJSON.stringify(docs)).digest("hex")};
      }print(JSON.stringify(result));'''
    before = mongo(digest_script)
    rule['timing']['intervalAmount'] = 'not-a-number'
    code, _ = request('/admin/notifications', {'adminUserId': actor['userId'], 'rules': [rule]})
    after = mongo(digest_script)
    checks = {name: before[name] == after[name] for name in before}
    print(json.dumps({'action':action,'status':code,'unchanged':checks}))
    if code != 400 or not all(checks.values()):
        raise SystemExit('Invalid-save atomicity failed; inspect the retained fixture')
else:
    if state['phase'] != 'producer-ready':
        raise SystemExit('Prepare the producer boundary first; never send twice')
    chat = 'manual-qa-checkpoint:v1:notification-admin:chat'
    marker = CHECKPOINT + ' controlled Casey-to-Nova'
    existing = mongo('print(JSON.stringify({count:db.chatMessages.countDocuments({chatId:'+json.dumps(chat)+'})}));')
    if existing['count']:
        raise SystemExit('The controlled message already exists; capture it instead of resending')
    code, message = request('/activities/chats/' + urllib.parse.quote(chat,safe='') + '/messages?userId=' + actor['userId'], {'text':marker})
    if code != 200 or not message or message.get('senderId') != actor['userId'] or message.get('text') != marker:
        raise SystemExit('Producer response not verified; inspect before any retry')
    # This checkpoint isolates the scheduled consumer. The rule is held disabled
    # by producer-ready; remove only this item's optional Redis wake-up hint.
    # The durable outbox and inbox are produced by the real chat write path.
    item = mongo('const a=db.notificationOutbox.find({"payload.chatId":'+json.dumps(chat)+'}).toArray();print(JSON.stringify({ids:a.map(x=>String(x._id)),enabled:db.notificationRuleConfigs.findOne({ruleKey:"notification-outbox"}).enabled}));')
    if len(item['ids']) != 1 or item['enabled']:
        raise SystemExit('Expected one retained item and the held scheduler rule')
    records = json.loads(subprocess.check_output(['docker','exec','redis','redis-cli','--json','XRANGE','notification:outbox:wakeups','-','+'],text=True))
    owned = []
    for record_id, fields in records:
        payload = dict(zip(fields[::2], fields[1::2]))
        if payload.get('outboxId') == item['ids'][0]:
            owned.append(record_id)
    if owned:
        subprocess.check_output(['docker','exec','redis','redis-cli','XDEL','notification:outbox:wakeups',*owned],text=True)
    print(json.dumps({'action':action,'status':code,'messageId':message['id'],'text':message['text'],
                      'outboxId':item['ids'][0], 'ownedWakeupHintsRemovedForScheduledBranch':len(owned)}))
