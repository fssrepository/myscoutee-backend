#!/usr/bin/env python3
"""Verify native account selection without changing profiles or business data.

Reuses check-session's login/logout. A caller-supplied different profile must
not replace the authenticated actor on identity, chat or event reads.
"""
import argparse
import importlib.util
import json
import time
import urllib.parse
import workloads as w

spec = importlib.util.spec_from_file_location('session_check', w.SHELL / 'tools/check-session.py')
session = importlib.util.module_from_spec(spec)
spec.loader.exec_module(session)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--origin', choices=['http://localhost', 'http://127.0.0.1'])
    args = parser.parse_args()
    if args.origin:
        session.ORIGIN = args.origin
    else:
        w.namespace_owned()
    results = []

    def record(name, passed, status=200, elapsed=None):
        results.append({'check': name, 'passed': bool(passed), 'status': status, 'elapsedMs': elapsed})
        print(('PASS: ' if passed else 'FAIL: ') + name, flush=True)

    def read(path, headers):
        started = time.monotonic()
        status, value = session.request(path, headers)
        return status, value, round((time.monotonic() - started) * 1000, 2)

    user, headers = session.start_session()
    record('native DEMO login', True)
    wrong = urllib.parse.quote('msc122-not-the-authenticated-profile', safe='')
    try:
        chat_records = []
        for name, path in [('native identity', '/api/auth/me'),
                           ('communication selection', '/api/activities/chats'),
                           ('community selection', '/api/activities/events?limit=5')]:
            separator = '&' if '?' in path else '?'
            status, original, elapsed = read(path + separator + 'userId=' + urllib.parse.quote(user, safe=''), headers)
            record(name, status == 200 and isinstance(original, (dict, list)), status, elapsed)
            if name == 'communication selection' and status == 200 and isinstance(original, list):
                chat_records = original
            status, selected, elapsed = read(path + separator + 'userId=' + wrong, headers)
            if name == 'native identity':
                same = isinstance(selected, dict) and selected.get('id') == user
            else:
                # Compare stable record IDs, not clock-dependent display fields.
                def ids(value):
                    items = value if isinstance(value, list) else value.get('records') if isinstance(value, dict) else None
                    return sorted(str(row.get('id')) for row in items if isinstance(row, dict)) if isinstance(items, list) else None
                same = ids(original) is not None and ids(original) == ids(selected)
            record(name + ' ignores caller-selected profile', status == 200 and same, status, elapsed)
        for name, path, fields in [
                ('MCP client settings', '/api/integrations/mcp/settings', ('resource', 'maxClients', 'clients', 'accessMode')),
                ('MCP metadata', '/api/mcp/oauth/metadata', ('issuer', 'authorization_endpoint', 'token_endpoint'))]:
            status, value, elapsed = read(path, headers)
            record(name, status == 200 and isinstance(value, dict) and all(field in value for field in fields),
                   status, elapsed)
        chat_id = next((row.get('id') for row in chat_records if isinstance(row, dict) and row.get('id')), None)
        if chat_id is None:
            record('existing chat required for header counter check', False)
        else:
            path = '/api/activities/chats/' + urllib.parse.quote(chat_id, safe='') + '/header-sync?userId='
            for label, requested in [('chat header counters', urllib.parse.quote(user, safe='')),
                                     ('chat header counters ignore caller-selected profile', wrong)]:
                status, value, elapsed = read(path + requested, headers)
                record(label, status == 200 and isinstance(value, dict)
                       and isinstance(value.get('chats'), int) and isinstance(value.get('chatCounters'), dict),
                       status, elapsed)
    finally:
        status, revoked = session.end_session(user, headers)
        record('native session revoked', revoked, status)
        target = 'monolith' if args.origin else 'kvm'
        output = w.SHELL / ('build/reports/' + target + '-profile-selection.json')
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(json.dumps(results, indent=2) + '\n')
    return 0 if all(row['passed'] for row in results) else 1


if __name__ == '__main__':
    raise SystemExit(main())
