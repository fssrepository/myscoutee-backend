#!/usr/bin/env python3
"""Prepare/reset exactly one disposable Firebase identity for the Push fixture.

Uses Google's documented accounts.signUp admin API. Never prints credentials.
This is fixture setup, not registration/login acceptance evidence.
"""
import base64
import json
import os
from pathlib import Path
import secrets
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding

ROOT = Path(__file__).resolve().parents[3]
SECRET_DIR = ROOT / 'server/projects/profile/secrets'
STATE = SECRET_DIR / 'mobile-push-provider-user.local.json'
UID = '650000000000000000000063'
EMAIL = 'mobile-push-riley@qa.myscoutee.test'
NAME = 'MyScoutee QA Push Riley'
ACTION = sys.argv[1] if len(sys.argv) > 1 else 'status'
if ACTION not in ('stage', 'status', 'reset'):
    raise SystemExit('Use stage|status|reset')
oracle = json.loads(subprocess.check_output([
    'bash', str(ROOT / 'server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh'),
    'status', 'mobile-push', 'MOBILE-PUSH-LIFECYCLE-001'
], text=True))
if oracle['phase'] == 'not-staged' and ACTION == 'stage':
    raise SystemExit('Stage the guarded Mongo Push fixture first')
account = json.loads((SECRET_DIR / 'firebase-service-account.json').read_text())
web = json.loads((SECRET_DIR / 'firebase-web-config.json').read_text())
if account['project_id'] != web['projectId']:
    raise SystemExit('Provider project mismatch')

def request(url, data, token=None):
    headers = {'Content-Type': 'application/json'}
    if token:
        headers['Authorization'] = 'Bearer ' + token
    try:
        with urllib.request.urlopen(urllib.request.Request(url, data=json.dumps(data).encode(), headers=headers), timeout=30) as response:
            return json.load(response)
    except urllib.error.HTTPError as error:
        # Do not print the URL, body or provider diagnostic (may contain tokens).
        raise RuntimeError(f'Provider fixture request failed: HTTP {error.code}') from None

encode = lambda value: base64.urlsafe_b64encode(value).rstrip(b'=')
now = int(time.time())
message = b'.'.join([
    encode(json.dumps({'alg': 'RS256', 'typ': 'JWT'}).encode()),
    encode(json.dumps({'iss': account['client_email'], 'scope': 'https://www.googleapis.com/auth/cloud-platform',
                       'aud': 'https://oauth2.googleapis.com/token', 'iat': now, 'exp': now + 3600}).encode())
])
key = serialization.load_pem_private_key(account['private_key'].encode(), password=None)
assertion = message + b'.' + encode(key.sign(message, padding.PKCS1v15(), hashes.SHA256()))
form = urllib.parse.urlencode({'grant_type': 'urn:ietf:params:oauth:grant-type:jwt-bearer', 'assertion': assertion.decode()}).encode()
try:
    with urllib.request.urlopen(urllib.request.Request('https://oauth2.googleapis.com/token', data=form), timeout=30) as response:
        access = json.load(response)['access_token']
except urllib.error.HTTPError as error:
    raise SystemExit(f'Provider authorization failed: HTTP {error.code}') from None
base = 'https://identitytoolkit.googleapis.com/v1/projects/' + urllib.parse.quote(web['projectId'], safe='') + '/accounts:'
users = request(base + 'lookup', {'localId': [UID]}, access).get('users', [])
saved = json.loads(STATE.read_text()) if STATE.exists() else None
if saved and (saved['uid'] != UID or saved['projectId'] != web['projectId'] or saved['email'] != EMAIL):
    raise SystemExit('Unexpected retained provider fixture')
if users and (not saved or len(users) != 1 or users[0].get('email') != EMAIL or users[0].get('displayName') != NAME):
    raise SystemExit('Existing provider identity is not owned by this fixture')
if ACTION == 'stage' and not users:
    if saved:
        raise SystemExit('Retained provider identity is missing; inspect before changing it')
    saved = {'uid': UID, 'projectId': web['projectId'], 'email': EMAIL, 'password': secrets.token_urlsafe(32), 'createdAt': now}
    fd = os.open(STATE, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    with os.fdopen(fd, 'w') as output:
        json.dump(saved, output)
    result = request('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + urllib.parse.quote(web['apiKey'], safe=''), {
        'localId': UID, 'email': EMAIL, 'password': saved['password'], 'displayName': NAME,
        'emailVerified': True, 'targetProjectId': web['projectId']
    }, access)
    if result.get('localId') != UID:
        raise SystemExit('Provider returned an unexpected fixture identity')
    users = [{'localId': UID, 'emailVerified': True}]
elif ACTION == 'reset':
    if users:
        request(base + 'delete', {'localId': UID}, access)
    users = request(base + 'lookup', {'localId': [UID]}, access).get('users', [])
    if users:
        raise SystemExit('Provider identity still present; ownership file retained')
    if STATE.exists():
        STATE.unlink()
print(json.dumps({'action': ACTION, 'uid': UID, 'providerUserPresent': len(users) == 1,
                  'emailVerified': bool(users and users[0].get('emailVerified')), 'secretFilePresent': STATE.exists()}))
