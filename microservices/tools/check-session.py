#!/usr/bin/env python3
"""Exercise one native DEMO login and the retained domain read routes.

Uses the same login DTO/headers as the versioned browser launcher. Creates only
its own session ID, never clears another session, and revokes it on completion.
No fixture reset, business mutation, payment or browser action is performed.
"""
import argparse
import json
import uuid
import urllib.error
import urllib.parse
import urllib.request
import workloads as w

ORIGIN = 'http://127.0.0.1:' + str(w.CONFIG['localPort'])


def request(path, headers, payload=None, method=None):
    data = None if payload is None else json.dumps(payload).encode()
    req = urllib.request.Request(ORIGIN + path,
            data=data, method=method, headers={'Accept': 'application/json', 'Content-Type': 'application/json', **headers})
    try:
        response = urllib.request.urlopen(req, timeout=15)
    except urllib.error.HTTPError as error:
        response = error
    with response:
        raw = response.read(8 * 1024 * 1024)
        try:
            body = json.loads(raw)
        except ValueError:
            body = None
        return response.status, body


def start_session(user_id=None):
    if not user_id:
        status, users = request('/api/auth/demo-users', {})
        if status != 200 or not isinstance(users, list) or not users:
            raise RuntimeError('Canonical demo actors unavailable')
        user_id = users[0]['id']
    session_id = 'session:' + str(uuid.uuid4())
    headers = {'X-App-Session-Kind': 'demo', 'X-Demo-User-Id': user_id, 'X-App-Session-Id': session_id}
    status, login = request('/api/auth/session/login', headers,
                             {'attemptId': 'attempt:' + str(uuid.uuid4()), 'provider': 'demo'})
    if status != 200 or not isinstance(login, dict) or not login.get('accepted'):
        raise RuntimeError('Native login rejected: HTTP ' + str(status) + ' / ' + str((login or {}).get('outcome')))
    return user_id, headers


def end_session(user_id, headers):
    status, body = request('/api/auth/me/logout', headers, {'userId': user_id})
    return status, status == 200 and isinstance(body, dict) and body.get('submitted') is True


def main():
    global ORIGIN
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--user-id', help='Existing canonical DEMO actor; defaults to the first public demo actor')
    parser.add_argument('--origin', choices=['http://localhost', 'http://127.0.0.1'],
                        help='Use the already-running local monolith instead of the owned KVM ingress')
    args = parser.parse_args()
    if args.origin:
        ORIGIN = args.origin
    else:
        w.namespace_owned()
    user_id, headers = start_session(args.user_id)
    print('PASS: native DEMO session login', flush=True)
    results = []
    try:
        user = urllib.parse.quote(user_id, safe='')
        for assembly, path in [
            ('identity', '/api/auth/me'),
            ('identity', '/api/auth/me/profile-ext?userId=' + user),
            ('community', '/api/activities/events?limit=5&userId=' + user),
            ('communication', '/api/notifications?limit=5&userId=' + user),
            ('assets', '/api/assets?userId=' + user),
            ('payments', '/api/payment-methods?userId=' + user),
            ('affinity', '/api/activities/rates?userId=' + user),
        ]:
            status, value = request(path, headers)
            valid = status == 200 and isinstance(value, (dict, list))
            results.append({'assembly': assembly, 'path': path.split('?')[0], 'status': status, 'passed': valid,
                            'responseShape': list(value) if isinstance(value, dict) else 'list' if isinstance(value, list) else 'other',
                            'code': value.get('code') if isinstance(value, dict) else None})
            print(('PASS' if valid else 'FAIL') + ': ' + assembly + ' ' + path.split('?')[0] + ' HTTP ' + str(status), flush=True)
    finally:
        status, revoked = end_session(user_id, headers)
        results.append({'path': '/api/auth/me/logout', 'status': status, 'passed': revoked})
        print(('PASS' if revoked else 'FAIL') + ': native logout of this check session', flush=True)
        path = w.SHELL / ('build/reports/monolith-session-smoke.json' if args.origin else 'build/reports/session-smoke.json')
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(results, indent=2) + '\n')
    return 0 if all(row['passed'] for row in results) else 1


if __name__ == '__main__':
    raise SystemExit(main())
