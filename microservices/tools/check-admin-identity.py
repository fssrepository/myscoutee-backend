#!/usr/bin/env python3
"""Check administrator identity across moderation, help, notifications and affinity.

Reuses the native DEMO session helper and existing canonical actors. Only reads
application routes; creates and revokes its own login sessions. Works against
the owned KVM lab or the already-running monolith, never both at once.
The monolith must enforce its admin role gate; disable its MEMBER_USER fallback
for this check instead of accepting successful requests from a member.
"""
import argparse
import importlib
import json
import time
import urllib.parse

session = importlib.import_module('check-session')
w = session.w

ROUTES = {
    'dashboard': ('activeAdmin', 'reportedUsers', 'feedback'),
    'help': ('revisions', 'availableLanguages', 'guideFields'),
    'privacy': ('revisions', 'availableLanguages'),
    'terms': ('revisions', 'availableLanguages'),
    'explanation': ('revisions', 'availableLanguages'),
    'notifications': ('rules', 'emailTemplates'),
    'params': ('sections',),
}


def valid_admin_read(route, body, actor_id):
    valid = isinstance(body, dict) and all(field in body for field in ROUTES[route])
    if route == 'dashboard' and valid:
        valid = isinstance(body['activeAdmin'], dict) and body['activeAdmin'].get('id') == actor_id
    return valid


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--origin', choices=['http://localhost', 'http://127.0.0.1'],
                        help='Use the already-running monolith instead of KVM')
    args = parser.parse_args()
    if args.origin:
        session.ORIGIN = args.origin
    elif not w.namespace_owned():
        raise RuntimeError('Owned namespace absent')
    results = []

    def record(name, status, passed, elapsed=None):
        results.append({'check': name, 'status': status, 'passed': passed,
                        'elapsedMs': elapsed})
        print(('PASS' if passed else 'FAIL') + ': ' + name + ' HTTP ' + str(status), flush=True)

    def reads(actor_id, headers, expected):
        for route, fields in ROUTES.items():
            path = '/api/admin/' + route + '?' + urllib.parse.urlencode({'adminUserId': actor_id, 'lang': 'en'})
            started = time.monotonic()
            status, body = session.request(path, headers)
            valid = status == expected
            if expected == 200:
                valid = valid and valid_admin_read(route, body, actor_id)
            record(route + (' accepted' if expected == 200 else ' denied'), status, valid,
                   round((time.monotonic() - started) * 1000, 2))

    def api_settings(headers, expected):
        started = time.monotonic()
        status, body = session.request('/api/admin/client-api/settings', headers)
        valid = status == expected
        if expected == 200:
            valid = valid and isinstance(body, dict) and body.get('baseUrl') == '/api/admin-client/v1' \
                and isinstance(body.get('tokens'), list) and isinstance(body.get('mcp'), dict) \
                and isinstance(body.get('accessRevision'), int)
        record('administrator API settings' + (' accepted' if expected == 200 else ' denied'),
               status, valid, round((time.monotonic() - started) * 1000, 2))

    try:
        admin, headers = session.start_session('admin-demo-ava')
        try:
            reads(admin, headers, 200)
            reads('msc122-missing-admin-profile', headers, 403)
            api_settings(headers, 200)
        finally:
            status, revoked = session.end_session(admin, headers)
            record('admin session revoked', status, revoked)

        member, headers = session.start_session()
        try:
            reads(admin, headers, 403)
            api_settings(headers, 403)
        finally:
            status, revoked = session.end_session(member, headers)
            record('member session revoked', status, revoked)
    finally:
        target = 'monolith' if args.origin else 'kvm'
        path = w.SHELL / ('build/reports/' + target + '-admin-identity.json')
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(results, indent=2) + '\n')
    return 0 if results and all(row['passed'] for row in results) else 1


if __name__ == '__main__':
    raise SystemExit(main())
