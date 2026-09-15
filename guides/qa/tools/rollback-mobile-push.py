#!/usr/bin/env python3
"""Restore the owned Push fixture. Default is read-only; --apply performs cleanup.

First unregister in the shared Permissions popup and sign out on the QA phone.
The provider helper verifies ownership and deletion; Mongo reset verifies every
retained baseline document before discarding its snapshot. Re-running is safe.
"""
import argparse
import datetime
import time
import json
import os
from pathlib import Path
import subprocess
import urllib.request

ROOT = Path(__file__).resolve().parents[3]
CHECKPOINT = 'MOBILE-PUSH-LIFECYCLE-001'
TOOLS = ROOT / 'guides/qa/tools'
RUNTIME = ROOT / 'server/docker/.qa-mobile-runtime'
PROVIDER_STATE = ROOT / 'server/projects/profile/secrets/mobile-push-provider-user.local.json'
MANIFEST = Path('/tmp/myscoutee-qa-browser-sessions') / (CHECKPOINT + '.json')
RUNTIME_REFRESH = RUNTIME / 'push-runtime-refresh.pending'
HARNESS = ROOT / 'server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh'
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--apply', action='store_true')
parser.add_argument('--check', action='store_true')
args = parser.parse_args()
if args.apply and args.check:
    parser.error('Choose --check or --apply')

def run(*command, capture=False):
    result = subprocess.run(list(map(str, command)), cwd=ROOT, check=True,
                            text=True, stdout=subprocess.PIPE if capture else None)
    return result.stdout

def status():
    return json.loads(run('bash', HARNESS, 'status', 'mobile-push', CHECKPOINT, capture=True))

oracle = status()
staged = oracle['phase'] != 'not-staged'
snapshots = [(RUNTIME / filename, action) for filename, action in [
    ('chrome-notifications.before.json', 'restore-chrome-notifications'),
    ('device-screen.before.json', 'restore-screen')]]
retained = [(path, action, json.loads(path.read_text())) for path, action in snapshots if path.exists()]
if retained:
    serial = run('adb', 'get-serialno', capture=True).strip()
    if any(saved['serial'] != serial for _, _, saved in retained):
        raise SystemExit('Retained device settings belong to another phone')
if (RUNTIME / 'device-transport.before.json').exists():
    raise SystemExit('Restore the retained offline transport boundary first')
provider = json.loads(run('python3', TOOLS / 'mobile-push-provider-user.py', 'status', capture=True))
print(json.dumps({'mode': 'apply' if args.apply else 'check', 'phase': oracle['phase'],
                  'managedBrowsersPresent': MANIFEST.exists(),
                  'providerUserPresent': provider['providerUserPresent'],
                  'deviceSettingsToRestore': [action for _, action, _ in retained]}), flush=True)
if not args.apply:
    raise SystemExit(0)
if staged and any(actor['deviceCount'] for actor in oracle['actors']):
    raise SystemExit('Remove the QA registration in Permissions, then sign out before rollback')
# Inspect only the exact QA origin. Entry is the signed-out precondition;
# never silently navigate or clear browser storage to manufacture it.
port = int(os.environ.get('QA_PHONE_CDP_PORT', '36087'))
if staged or retained:
    with urllib.request.urlopen(f'http://127.0.0.1:{port}/json/list', timeout=10) as response:
        pages = json.load(response)
    qa_pages = [p for p in pages if p.get('type') == 'page' and p.get('url', '').startswith('http://localhost:8080/')]
    if any(not p['url'].startswith('http://localhost:8080/entry') for p in qa_pages):
        raise SystemExit('Sign out of the QA phone before rollback; no browser state was cleared')
    for page in qa_pages:
        run('node', TOOLS / 'mobile-webview-device.mjs', 'close-qa-page', '--target', page['id'])
if MANIFEST.exists():
    run('node', TOOLS / 'open-checkpoint-browser-sessions.mjs', CHECKPOINT, '--close-only')
if provider['providerUserPresent'] or PROVIDER_STATE.exists():
    run('python3', TOOLS / 'mobile-push-provider-user.py', 'reset')
if staged:
    # Direct Mongo restoration bypasses Operator's Java cache refresh callback.
    # Keep a retry marker across partial cleanup; use only the existing DevTools owner.
    RUNTIME_REFRESH.write_text('Refresh Java availability after Mongo rollback\n')
    run('bash', HARNESS, 'reset', 'mobile-push', CHECKPOINT)
if RUNTIME_REFRESH.exists():
    since = datetime.datetime.now(datetime.timezone.utc).isoformat()
    run('docker', 'exec', 'myscoutee', 'touch', '/workspace/projects/profile/build/resources/main/application-dev.yaml', '/workspace/projects/profile/build/resources/main/.reloadtrigger')
    for _ in range(45):
        time.sleep(1)
        logs = subprocess.run(['docker', 'logs', '--since', since, 'myscoutee'],
                              capture_output=True, text=True, check=True)
        if 'Started Main' in logs.stdout + logs.stderr:
            RUNTIME_REFRESH.unlink()
            print('Existing backend DevTools reload completed; Firebase availability reloaded.', flush=True)
            break
    else:
        raise SystemExit('Existing backend reload not confirmed; runtime retry marker retained')
for path, action, saved in retained:
    run('node', TOOLS / 'mobile-webview-device.mjs', action)
    if action == 'restore-screen':
        for scope, key, expected in [('system', 'screen_off_timeout', saved['timeout']),
                                     ('global', 'stay_on_while_plugged_in', saved['stayOn'])]:
            actual = run('adb', 'shell', 'settings', 'get', scope, key, capture=True).strip()
            if actual != expected:
                path.write_text(json.dumps(saved)); path.chmod(0o600)
                raise SystemExit('Device setting verification failed; restore point retained')
    else:
        import re
        dump = run('adb', 'shell', 'dumpsys', 'package', 'com.android.chrome', capture=True)
        match = re.search(r'android\.permission\.POST_NOTIFICATIONS: granted=(true|false), flags=\[([^\]]*)\]', dump)
        if not match or (match[1] == 'true', 'USER_SET' in match[2], 'USER_FIXED' in match[2]) != (saved['granted'], saved['userSet'], saved['userFixed']):
            path.write_text(json.dumps(saved)); path.chmod(0o600)
            raise SystemExit('Chrome permission verification failed; restore point retained')
if RUNTIME_REFRESH.exists() or status()['phase'] != 'not-staged' or MANIFEST.exists() or PROVIDER_STATE.exists() or any(p.exists() for p, _ in snapshots):
    raise SystemExit('Rollback incomplete; retained state remains')
print(json.dumps({'checkpoint': CHECKPOINT, 'rollback': 'PASS', 'fixture': 'not-staged',
                  'providerUserPresent': False, 'deviceSettingsRestored': True}))
