#!/usr/bin/env python3
"""Temporarily set the existing dev scheduled-message poll to 60s, with exact rollback."""
import datetime
import json
import re
import subprocess
import sys
import time
from pathlib import Path

root=Path(__file__).resolve().parents[5]
marker=root/'server/docker/.qa-mobile-runtime/job-messages-poll.before.json'
resource='/workspace/projects/profile/build/resources/main/application-dev.yaml'
action=sys.argv[1] if len(sys.argv)>1 else ''
if action not in ['enable','reset']: raise SystemExit('Use enable|reset')
def run(*args): return subprocess.check_output(args,text=True,stderr=subprocess.STDOUT)
content=run('docker','exec','myscoutee','cat',resource)
if action=='enable':
    if marker.exists(): raise SystemExit('Runtime poll snapshot already retained; reset before enabling again')
    lines=re.findall(r'^  task-poll-delay-ms:.*$',content,re.M)
    if len(lines)!=1: raise SystemExit('Expected one existing task-poll-delay-ms property')
    saved={'before':lines[0],'during':'  task-poll-delay-ms: 60000'}
    marker.parent.mkdir(parents=True,exist_ok=True)
    marker.write_text(json.dumps(saved));marker.chmod(0o600)
    updated=content.replace(saved['before'],saved['during'],1)
else:
    if not marker.exists(): print('No JOB-MESSAGES runtime override remains');raise SystemExit(0)
    saved=json.loads(marker.read_text())
    if saved['during'] in content: updated=content.replace(saved['during'],saved['before'],1)
    elif saved['before'] in content: updated=content
    else: raise SystemExit('Poll property changed externally; snapshot retained')
started=datetime.datetime.now(datetime.timezone.utc).isoformat()
subprocess.run(['docker','exec','-i','myscoutee','sh','-c','cat > "$1"','job-messages-runtime',resource],input=updated,text=True,check=True)
run('docker','exec','myscoutee','touch','/workspace/projects/profile/build/resources/main/.reloadtrigger')
for _ in range(45):
    logs=run('docker','logs','--since',started,'myscoutee')
    if 'Started Main' in logs:
        if action=='reset': marker.unlink()
        print('Existing DevTools reload complete; poll '+('60s' if action=='enable' else 'restored'))
        break
    time.sleep(1)
else: raise SystemExit('Reload not verified; runtime snapshot retained')
