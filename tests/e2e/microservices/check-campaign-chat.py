#!/usr/bin/env python3
"""Read/rejection smoke checks for campaign chat ownership in KVM or monolith.

Uses existing canonical DEMO profiles and native session login/logout. It never
creates a campaign, rating or chat. Positive creation/persistence is covered by
the focused ChatService JUnit test, not claimed by this runtime read check.
"""

import os as _context_os
import sys as _context_sys
from pathlib import Path as _ContextPath
_context_root = _ContextPath(__file__).resolve().parents[3]
_context_os.environ.setdefault('MYSCOUTEE_BACKEND_SOURCE', str(_context_root))
_context_sys.path.insert(0, str(_ContextPath(_context_os.environ.get('MYSCOUTEE_MICROSERVICES_SOURCE', _context_root.parent / 'myscoutee-microservices')) / 'tools'))
import argparse
import importlib
import json
import time
import urllib.parse

session = importlib.import_module('check-session')
w = session.w
CAMPAIGN_CONFIG = json.loads((w.SHELL / 'checks/campaign-chat.json').read_text())
VIEWER = CAMPAIGN_CONFIG['viewer']


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--origin', choices=['http://localhost', 'http://127.0.0.1'])
    args = parser.parse_args()
    if args.origin:
        session.ORIGIN = args.origin
    elif not w.namespace_owned():
        raise RuntimeError('Owned namespace absent')
    results = []

    def record(name, status, passed, elapsed=None):
        results.append({'check': name, 'status': status, 'passed': passed, 'elapsedMs': elapsed})
        print(('PASS' if passed else 'FAIL') + ': ' + name + ' HTTP ' + str(status), flush=True)

    user, headers = session.start_session(VIEWER)
    record('native Work profile login', 200, True)
    try:
        suffix = '?userId=' + urllib.parse.quote(user, safe='')
        started = time.monotonic()
        status, chats = session.request('/api/activities/chats' + suffix, headers)
        record('existing chat list', status, status == 200 and isinstance(chats, list),
               round((time.monotonic() - started) * 1000, 2))
        for name, campaign, expected in CAMPAIGN_CONFIG['rejections']:
            started = time.monotonic()
            status, _ = session.request('/api/activities/chats/service' + suffix, headers,
                    {'serviceContext': 'campaign', 'campaignId': campaign})
            record(name, status, status == expected, round((time.monotonic() - started) * 1000, 2))
    finally:
        status, revoked = session.end_session(user, headers)
        record('native session revoked', status, revoked)
        target = 'monolith' if args.origin else 'kvm'
        report = w.BUILD / ('reports/' + target + '-campaign-chat.json')
        report.parent.mkdir(parents=True, exist_ok=True)
        report.write_text(json.dumps(results, indent=2) + '\n')
    return 0 if all(row['passed'] for row in results) else 1


if __name__ == '__main__':
    raise SystemExit(main())
