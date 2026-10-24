#!/usr/bin/env python3
"""Reversible local-dev bootstrap configuration for the live Firebase checkpoint.

Uses the existing secret override and existing DevTools restart trigger only.
No credentials, sessions or successful Firebase results are seeded into the UI.
"""
import hashlib
import json
import os
from pathlib import Path
import secrets
import subprocess
import sys
import tempfile
import yaml

ROOT = Path(__file__).resolve().parents[5]
BACKUP = Path(tempfile.gettempdir()) / 'myscoutee-qa-firebase-bootstrap'
OVERRIDE = ROOT / 'server/projects/profile/secrets/application-dev-secrets.yaml'
TRIGGER = ROOT / 'server/projects/profile/build/resources/main/.reloadtrigger'
HARNESS = ROOT / 'server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh'
EMAIL = 'operator-000000000000000000000c05@deployment.invalid'
os.umask(0o077)
action = sys.argv[1] if len(sys.argv) > 1 else 'status'
if action not in ('stage', 'status', 'restore'):
    raise SystemExit('Use stage|status|restore')
container = json.loads(subprocess.check_output(['docker', 'inspect', 'myscoutee']))[0]
env = dict(v.split('=', 1) for v in container['Config']['Env'] if '=' in v)
if (not container['State']['Running'] or env.get('SPRING_PROFILES_ACTIVE') != 'dev'
        or env.get('MONGODB_DATABASE') != 'demo_db'
        or container['Config']['Labels'].get('com.docker.compose.project.config_files') != str(ROOT / 'server/docker-compose-dev.yml')):
    raise SystemExit('Existing repository dev stack required')
def oracle(command):
    return json.loads(subprocess.check_output(['bash', str(HARNESS), command,
        'operator-domain', 'OPERATOR-FIREBASE-001']))
def digest(data):
    return hashlib.sha256(data).hexdigest()
if action == 'stage':
    if BACKUP.exists() or oracle('status')['phase'] != 'not-staged':
        raise SystemExit('Retained fixture exists; inspect instead of overwriting')
    if not TRIGGER.is_file():
        raise SystemExit('Existing DevTools trigger missing')
    original = OVERRIDE.read_bytes()
    config = yaml.safe_load(original) or {}
    if any(k.startswith('operator-bootstrap') for k in config.get('config', {})):
        raise SystemExit('Existing bootstrap override must be preserved')
    BACKUP.mkdir(mode=0o700)
    (BACKUP / 'original.yaml').write_bytes(original)
    password = secrets.token_urlsafe(32)
    config.setdefault('config', {}).update({
        'operator-user': EMAIL, 'operator-bootstrap-email': EMAIL,
        'operator-bootstrap-password-sha256': digest(password.encode())
    })
    prepared = yaml.safe_dump(config, sort_keys=False).encode()
    (BACKUP / 'credentials.json').write_text(json.dumps({'email': EMAIL, 'password': password}))
    state = {'phase': 'preparing', 'originalHash': digest(original), 'preparedHash': digest(prepared)}
    (BACKUP / 'manifest.json').write_text(json.dumps(state))
    oracle('stage')
    OVERRIDE.write_bytes(prepared)
    TRIGGER.touch()
    state['phase'] = 'staged'
    (BACKUP / 'manifest.json').write_text(json.dumps(state))
    print('Staged configuration snapshot and private bootstrap credential; existing DevTools restart requested.')
elif action == 'restore':
    state = json.loads((BACKUP / 'manifest.json').read_text())
    original = (BACKUP / 'original.yaml').read_bytes()
    if state['phase'] != 'staged' or digest(original) != state['originalHash'] or digest(OVERRIDE.read_bytes()) != state['preparedHash']:
        raise SystemExit('Unexpected secret override change; preserve and investigate')
    # Caller closes managed browsers and resets the Mongo fixture first.
    if oracle('status')['phase'] != 'not-staged':
        raise SystemExit('Reset the Mongo checkpoint before restoring runtime configuration')
    OVERRIDE.write_bytes(original)
    TRIGGER.touch()
    state['phase'] = 'restored'
    (BACKUP / 'manifest.json').write_text(json.dumps(state))
    (BACKUP / 'credentials.json').unlink()
    print('Original secret override restored byte-for-byte; bootstrap credential removed; existing DevTools restart requested.')
else:
    print(json.dumps({'runtimeFixture': json.loads((BACKUP / 'manifest.json').read_text())['phase']
        if (BACKUP / 'manifest.json').exists() else 'not-staged', 'mongo': oracle('status')}))
