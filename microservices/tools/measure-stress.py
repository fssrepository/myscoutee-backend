#!/usr/bin/env python3
"""Run an unchanged repository stress scenario with guest cgroup evidence."""
import argparse
import datetime
import json
import os
import shlex
import subprocess
import workloads as w


def snapshot():
    code = (w.SHELL / 'infra/guest/resource-snapshot.py').read_text()
    return json.loads(w.vm.ssh('sudo python3 -c ' + shlex.quote(code)).stdout)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('scenario', choices=['server-events-read', 'server-read-sweep'])
    args = parser.parse_args()
    if not w.namespace_owned():
        raise RuntimeError('Owned running lab required')
    root = w.SHELL / 'build/reports/comparison'
    root.mkdir(parents=True, exist_ok=True)
    stamp = datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%SZ')
    before = snapshot()
    result = subprocess.run(['node', str(w.SHELL.parent / 'e2e/stress/backend/run.mjs'),
        '--scenario', args.scenario, '--record', '--artifacts-dir', str(root)],
        env={**os.environ, 'E2E_STRESS_BASE_URL': 'http://localhost:' + str(w.CONFIG['localPort']),
             'E2E_NATIVE_DEMO_SESSIONS': 'true', 'E2E_SKIP_E2E_RESET': 'true'})
    after = snapshot()
    old = {row['id']: row for row in before['containers']}
    deltas = []
    for row in after['containers']:
        previous = old.get(row['id'])
        if previous is None:
            deltas.append({'pod': row['pod'], 'replacedDuringRun': True})
            continue
        seconds = row['at'] - previous['at']
        deltas.append({'pod': row['pod'], 'container': row['container'], 'seconds': seconds,
            'cpuCores': (row['cpu']['usage_usec'] - previous['cpu']['usage_usec']) / 1e6 / seconds,
            'throttledSeconds': (row['cpu'].get('throttled_usec', 0) - previous['cpu'].get('throttled_usec', 0)) / 1e6,
            'cpuMax': row['cpuMax'], 'memoryMiB': row['memoryBytes'] / 1024 ** 2})
    report = {'scenario': args.scenario, 'exitCode': result.returncode, 'before': before, 'after': after, 'deltas': deltas}
    output = root / (args.scenario + '-resources-' + stamp + '.json')
    output.write_text(json.dumps(report, indent=2) + '\n')
    print('Guest CPU/quota evidence: ' + str(output))
    print(json.dumps(deltas, indent=2))
    return result.returncode


if __name__ == '__main__':
    raise SystemExit(main())
