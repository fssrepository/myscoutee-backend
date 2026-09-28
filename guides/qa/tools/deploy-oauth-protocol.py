#!/usr/bin/env python3
"""Protocol negatives for this run's Inspector client, after its real UI flow.

All requests use normal deployment endpoints. The separate harness owns scoped
expiry preparation and cleanup. Tokens/code material stay in a private runtime
directory; printed evidence contains only case names and HTTP statuses.
"""
import base64
import hashlib
import json
import os
import secrets
import ssl
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

os.umask(0o077)
root = Path(sys.argv[1])
client, owner = sys.argv[2:4]
phase = sys.argv[4] if len(sys.argv) > 4 else 'run'
if phase != 'expired' and len(sys.argv) < 6:
    raise SystemExit('Pass the existing owned Event source ID as the last argument.')
origin = 'https://localhost:8443'
resource = origin + '/mcp/private'
redirect = 'http://127.0.0.1:6274/oauth/callback'
session = json.loads((root / 'machine-session.json').read_text())
evidence = []


def request(path, data=None, *, form=False, token=None, browser=False, method=None, client_id=None):
    headers = {'Content-Type': 'application/x-www-form-urlencoded' if form else 'application/json'}
    if browser:
        headers.update({'Authorization': 'Bearer ' + session['token'],
                        'X-App-Session-Id': session['sessionId']})
    elif token:
        headers.update({'Authorization': 'Bearer ' + token, 'X-MyScoutee-Client-Id': client_id or client})
    body = (urllib.parse.urlencode(data) if form else json.dumps(data)).encode() if data is not None else None
    req = urllib.request.Request(origin + '/api' + path, data=body, headers=headers, method=method)
    try:
        response = urllib.request.urlopen(req, context=ssl._create_unverified_context(), timeout=20)
    except urllib.error.HTTPError as error:
        response = error
    with response:
        raw = response.read()
        return response.status, json.loads(raw) if raw else None


def check(name, result, expected):
    status, data = result
    row = {'case': name, 'status': status, 'passed': status in expected}
    evidence.append(row)
    (root / ('oauth-protocol-' + phase + '.json')).write_text(json.dumps(evidence, indent=2))
    print(json.dumps(row), flush=True)
    if status not in expected:
        raise RuntimeError(name + ' returned unexpected status ' + str(status))
    return data


def exchange(values):
    return request('/mcp/oauth/token', {'client_id': client, 'resource': resource, **values}, form=True)


if phase == 'expired':
    saved = json.loads((root / 'oauth-expiry-code.json').read_text())
    assert saved['clientId'] == client
    check('expired-authorization-code', exchange(saved['exchange']), {400})
    sys.exit(0)

read_path = '/integrations/v1/events/' + urllib.parse.quote(sys.argv[5], safe='')
if phase in ('logout-before', 'logout-after', 'revoked'):
    oauth = json.loads((root / 'oauth-access.json').read_text())
    api = json.loads((root / 'api-logout-control.json').read_text())
    if phase == 'logout-before':
        check('claim-own-api-key', request('/integrations/v1/connect', {}, token=api['value'], client_id=api['clientId']), {200})
    allowed = {401} if phase == 'revoked' else {200}
    check('independent-oauth-read', request(read_path, token=oauth['token']), allowed)
    check('independent-api-key-read', request(read_path, token=api['value'], client_id=api['clientId']), allowed)
    if phase != 'revoked':
        check('browser-session-read', request('/auth/me', browser=True), {200} if phase == 'logout-before' else {401})
    sys.exit(0)

verifier = secrets.token_urlsafe(48)
challenge = base64.urlsafe_b64encode(hashlib.sha256(verifier.encode()).digest()).decode().rstrip('=')
auth = {'clientId': client, 'redirectUri': redirect, 'resource': resource,
        'scope': 'myscoutee:api', 'responseType': 'code', 'codeChallenge': challenge,
        'codeChallengeMethod': 'S256', 'state': 'deploy-protocol-' + secrets.token_hex(12)}
for name, change in [('wrong-redirect', {'redirectUri': 'https://example.invalid/callback'}),
                     ('wrong-resource', {'resource': origin + '/wrong-resource'}),
                     ('plain-PKCE', {'codeChallengeMethod': 'plain'}),
                     ('wrong-client', {'clientId': 'mcp_nonexistent'})]:
    check(name, request('/integrations/mcp/authorization', {**auth, **change}, browser=True), {400})
context = check('valid-authorization-context', request('/integrations/mcp/authorization', auth, browser=True), {200})
assert context['profileId'] == owner


def code():
    result = check('protocol-code-preparation', request('/integrations/mcp/consent', {
        'authorization': auth, 'profileId': owner, 'approve': True}, browser=True), {200})
    return urllib.parse.parse_qs(urllib.parse.urlparse(result['url']).query)['code'][0]


values = {'grant_type': 'authorization_code', 'code': code(),
          'redirect_uri': redirect, 'code_verifier': verifier}
check('wrong-code-verifier', exchange({**values, 'code_verifier': 'A' * 64}), {400})
check('wrong-token-resource', exchange({**values, 'resource': origin + '/wrong-resource'}), {400})
grant = check('valid-code-exchange', exchange(values), {200})
check('reused-code', exchange(values), {400})
check('issued-access-private-read', request(read_path, token=grant['access_token']), {200})
rotated = check('refresh-rotation', exchange({'grant_type': 'refresh_token', 'refresh_token': grant['refresh_token']}), {200})
check('rotated-access-private-read', request(read_path, token=rotated['access_token']), {200})
check('refresh-replay', exchange({'grant_type': 'refresh_token', 'refresh_token': grant['refresh_token']}), {400})
check('replay-revoked-access', request(read_path, token=rotated['access_token']), {401})
check('replay-revoked-refresh', exchange({'grant_type': 'refresh_token', 'refresh_token': rotated['refresh_token']}), {400})
expired_code = code()
(root / 'oauth-expiry-code.json').write_text(json.dumps({'clientId': client, 'exchange': {
    'grant_type': 'authorization_code', 'code': expired_code,
    'redirect_uri': redirect, 'code_verifier': verifier}}))
print('Prepared one scoped code for the versioned expiry fixture.', flush=True)
