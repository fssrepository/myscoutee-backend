#!/usr/bin/env python3
"""Run an unchanged repository stress scenario with guest cgroup evidence."""
import argparse
import datetime
import json
import os
from pathlib import Path
import re
import shlex
import subprocess
import time
import workloads as w


def snapshot():
    code = (w.SHELL / 'infra/guest/resource-snapshot.py').read_text()
    result = json.loads(w.vm.ssh('sudo python3 -c ' + shlex.quote(code)).stdout)
    counters = [int(value) for value in Path('/proc/stat').read_text().splitlines()[0].split()[1:9]]
    qemu = w.vm.virsh('domstats', w.vm.NAME, '--cpu-total').stdout
    result['host'] = {'at': time.monotonic(), 'cpuTotal': sum(counters),
                      'cpuIdle': counters[3] + counters[4], 'logicalCpus': os.cpu_count(),
                      'qemuCpuNs': int(re.search(r'cpu.time=(\d+)', qemu).group(1))}
    return result


def resource_deltas(before, after):
    old = {row['id']: row for row in before['containers']}
    deltas = []
    for row in after['containers']:
        previous = old.pop(row['id'], None)
        if previous is None:
            deltas.append({'pod': row['pod'], 'replacedDuringRun': True})
            continue
        seconds = row['at'] - previous['at']
        if seconds <= 0 or row['cpu']['usage_usec'] < previous['cpu']['usage_usec']:
            raise ValueError('Invalid CPU counter interval')
        deltas.append({'pod': row['pod'], 'container': row['container'], 'seconds': seconds,
            'cpuCores': (row['cpu']['usage_usec'] - previous['cpu']['usage_usec']) / 1e6 / seconds,
            'throttledSeconds': (row['cpu'].get('throttled_usec', 0) - previous['cpu'].get('throttled_usec', 0)) / 1e6,
            'cpuMax': row['cpuMax'], 'memoryMiB': row['memoryBytes'] / 1024 ** 2})
    deltas.extend({'pod': row['pod'], 'replacedDuringRun': True} for row in old.values())
    return deltas


def host_delta(before, after):
    old, new = before['host'], after['host']
    seconds = new['at'] - old['at']
    total = new['cpuTotal'] - old['cpuTotal']
    if seconds <= 0 or total <= 0:
        raise ValueError('Invalid host CPU interval')
    return {'seconds': seconds, 'logicalCpus': new['logicalCpus'],
            'busyPercent': 100 * (1 - (new['cpuIdle'] - old['cpuIdle']) / total),
            'qemuCpuCores': (new['qemuCpuNs'] - old['qemuCpuNs']) / 1e9 / seconds}


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
    deltas = resource_deltas(before, after)
    report = {'scenario': args.scenario, 'exitCode': result.returncode, 'before': before, 'after': after,
              'deltas': deltas, 'host': host_delta(before, after)}
    output = root / (args.scenario + '-resources-' + stamp + '.json')
    output.write_text(json.dumps(report, indent=2) + '\n')
    print('Guest CPU/quota evidence: ' + str(output))
    print(json.dumps(deltas, indent=2))
    return result.returncode


if __name__ == '__main__':
    raise SystemExit(main())
