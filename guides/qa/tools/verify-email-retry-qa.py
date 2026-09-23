#!/usr/bin/env python3
"""Read-only oracle for account-email stage-retry and the non-delivering stub."""
import argparse
import json
import subprocess
from datetime import datetime
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('--stub-log', type=Path, required=True)
parser.add_argument('--base-delay-seconds', type=int, default=60)
args = parser.parse_args()
state = json.loads(subprocess.check_output(
    ['python3', 'guides/qa/tools/account-email-fixture.py', 'status'], text=True))
assert state['staged'] and state['configuration']['enabled']
rows = [json.loads(line) for line in args.stub_log.read_text().splitlines() if line.strip()]
assert len(rows) == 8, 'Expected initial send plus three retries for exactly two actors'
deliveries = {row['userId']: row for row in state['deliveries']}
assert len(deliveries) == 2
results = []
for suffix, expected, statuses in [('1', 'sent', [503, 429, 503, 202]), ('2', 'failed', [503] * 4)]:
    user_id = '6ae00100000000000000000' + suffix
    recipient = 'email-qa-' + str(int(suffix) - 1) + '@example.invalid'
    messages = [row for row in rows if row['payload']['personalizations'][0]['to'][0]['email'] == recipient]
    assert [row['status'] for row in messages] == statuses
    delivery = deliveries[user_id]
    assert delivery['status'] == expected and delivery['attemptCount'] == 4
    assert 'nextAttemptAtIso' not in delivery
    assert bool(delivery.get('providerMessageId')) == (expected == 'sent')
    timestamps = [datetime.fromisoformat(row['at']) for row in messages]
    delays = [(timestamps[index + 1] - timestamps[index]).total_seconds() for index in range(3)]
    for index, delay in enumerate(delays):
        assert delay >= args.base_delay_seconds * (2 ** index), 'Retry was sent too early'
    user = next(user for user in state['users'] if user['userId'] == user_id)
    assert user['deletionWarningFor'] == user['deletedAtIso']
    results.append({'recipient': recipient, 'status': expected, 'attempts': 4, 'delaysSeconds': delays})
print(json.dumps({'result': 'PASS', 'requests': len(rows), 'deliveries': results}))
