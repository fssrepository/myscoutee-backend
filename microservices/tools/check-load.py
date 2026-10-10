#!/usr/bin/env python3
"""Bounded authenticated read load, optionally with two assets replicas.

Reuses the native session smoke helper. Business records are never mutated.
The extra replica and this check's session are removed even after failures.
This qualifies read routing/load only, not mutation recovery or worker failover.
"""
import argparse
from concurrent.futures import ThreadPoolExecutor
import fcntl
import importlib
import json
import math
from pathlib import Path
import time
import urllib.parse
import workloads as w

session = importlib.import_module('check-session')
resources = importlib.import_module('measure-stress')


def owned_deployment(name):
    deployment = w.kube_json('-n', w.NAMESPACE, 'get', 'deployment', name)
    if any(deployment['metadata'].get('labels', {}).get(key) != value for key, value in w.LABEL.items()):
        raise RuntimeError('Refusing to scale an unowned deployment')
    if deployment['spec']['template']['spec']['containers'][0]['image'] != w.image_lock()[name]['reference']:
        raise RuntimeError(name + ' image differs from the versioned lock')
    return deployment


def owned_assets():
    return owned_deployment('assets')

def asset_request_counts():
    result = {}
    for pod in w.kube_json('-n', w.NAMESPACE, 'get', 'pods', '-l', 'app.kubernetes.io/name=assets')['items']:
        if pod['metadata'].get('deletionTimestamp'):
            continue
        if not any(c['type'] == 'Ready' and c['status'] == 'True' for c in pod['status'].get('conditions', [])):
            raise RuntimeError('Assets pod is not Ready')
        url = 'http://' + pod['status']['podIP'] + ':8081/metrics'
        raw = w.kube('-n', w.NAMESPACE, 'exec', 'deployment/frontend', '--', 'wget', '-qO-', url).stdout
        count = sum(float(line.rsplit(' ', 1)[1]) for line in raw.splitlines()
                    if line.startswith('http_server_requests_seconds_count{') and 'uri="/assets"' in line
                    and 'method="GET"' in line and 'status="200"' in line)
        result[pod['metadata']['name']] = {'count': count,
            'restarts': sum(c['restartCount'] for c in pod['status'].get('containerStatuses', []))}
    return result


def memory():
    raw = w.vm.ssh('cat /proc/meminfo').stdout
    values = dict((line.split(':', 1)[0], int(line.split()[1])) for line in raw.splitlines())
    return {key: values[key] for key in ('MemTotal', 'MemAvailable', 'SwapTotal', 'SwapFree')}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--two-assets', action='store_true', help='Temporarily scale only assets from one to two pods')
    parser.add_argument('--seconds', type=int, default=30)
    parser.add_argument('--concurrency', type=int, default=4)
    parser.add_argument('--profile', choices=['member', 'admin-identity'], default='member')
    parser.add_argument('--warmup-seconds', type=int, default=0)
    parser.add_argument('--idle-seconds', type=int, default=10)
    parser.add_argument('--output', type=Path, help='Retain this sample separately instead of replacing read-load.json')
    args = parser.parse_args()
    if not 5 <= args.seconds <= 120 or not 1 <= args.concurrency <= 8:
        parser.error('Bounded lab profile: 5–120 seconds, 1–8 concurrent reads')
    if not 0 <= args.warmup_seconds <= 120 or not 5 <= args.idle_seconds <= 30:
        parser.error('Warmup must be 0–120 seconds; idle measurement 5–30 seconds')
    if args.two_assets and args.profile != 'member':
        parser.error('Two-assets routing requires the member read profile')
    report = {'profile': 'native-demo-six-assembly-reads' if args.profile == 'member' else 'native-demo-admin-identity', 'seconds': args.seconds,
              'concurrency': args.concurrency, 'twoAssets': args.two_assets,
              'warmupSeconds': args.warmup_seconds, 'idleSeconds': args.idle_seconds,
              'sourceRevision': w.vm.run('git', '-C', w.SHELL.parent, 'rev-parse', 'HEAD').stdout.strip(),
              'images': {name: entry['id'] for name, entry in w.image_lock().items()},
              'qualification': 'Read load/routing only; no business mutations or worker failover tested.'}
    with (w.vm.VM / 'lock').open('a') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        if not w.namespace_owned():
            raise RuntimeError('Owned namespace absent')
        for name in w.SERVICES:
            deployment = owned_deployment(name)
            if deployment['spec'].get('replicas') != 1 or deployment.get('status', {}).get('readyReplicas') != 1:
                raise RuntimeError('Start one Ready replica of every backend before the check')
        assets = owned_assets()
        report['guestMemoryBeforeKiB'] = memory()
        if report['guestMemoryBeforeKiB']['MemAvailable'] < 2 * 1024 * 1024:
            raise RuntimeError('At least 2 GiB guest available memory required')
        scaled = False
        login = None
        try:
            if args.two_assets:
                # Record cleanup responsibility before a possibly lost scale acknowledgement.
                scaled = True
                w.kube('-n', w.NAMESPACE, 'scale', 'deployment/assets', '--current-replicas=1', '--replicas=2')
                w.kube('-n', w.NAMESPACE, 'rollout', 'status', 'deployment/assets', '--timeout=180s', timeout=190)
            before = asset_request_counts() if args.profile == 'member' else {}
            expected = 2 if args.two_assets else 1
            if args.profile == 'member' and len(before) != expected:
                raise RuntimeError('Unexpected assets pod count')
            login = session.start_session('admin-demo-ava' if args.profile == 'admin-identity' else None)
            user_id, headers = login
            user = urllib.parse.quote(user_id, safe='')
            paths = ['/api/auth/me', '/api/activities/events?limit=5&userId=' + user,
                     '/api/notifications?limit=5&userId=' + user, '/api/assets?userId=' + user,
                     '/api/payment-methods?userId=' + user, '/api/activities/rates?userId=' + user]
            if args.profile == 'admin-identity':
                admin = importlib.import_module('check-admin-identity')
                paths = ['/api/admin/' + route + '?adminUserId=' + user + '&lang=en' for route in admin.ROUTES]

            def valid_body(path, body):
                if args.profile == 'admin-identity':
                    return admin.valid_admin_read(path.split('?')[0].rsplit('/', 1)[1], body, user_id)
                return isinstance(body, (dict, list))
            # Warm every path before measuring the defined profile.
            for path in paths:
                status, body = session.request(path, headers)
                if status != 200 or not valid_body(path, body):
                    raise RuntimeError('Read profile warmup failed: ' + path.split('?')[0])
            deadline = time.monotonic() + args.warmup_seconds

            def worker(index):
                rows = []
                while time.monotonic() < deadline:
                    path = paths[index % len(paths)]
                    began = time.monotonic()
                    status = 0
                    try:
                        status, body = session.request(path, headers)
                        valid = status == 200 and valid_body(path, body)
                    except (OSError, ValueError):
                        valid = False
                    rows.append({'path': path.split('?')[0], 'status': status, 'passed': valid,
                                 'milliseconds': round((time.monotonic() - began) * 1000, 2)})
                    index += 1
                return rows

            if args.warmup_seconds:
                print('Warming the selected read profile for ' + str(args.warmup_seconds) + ' seconds.', flush=True)
                with ThreadPoolExecutor(max_workers=args.concurrency) as executor:
                    warmup = [row for batch in executor.map(worker, range(args.concurrency)) for row in batch]
                if any(not row['passed'] for row in warmup):
                    raise RuntimeError('Read profile warmup failed')
            idle_before = resources.snapshot()
            time.sleep(args.idle_seconds)
            load_before = resources.snapshot()
            report['idleResources'] = {'before': idle_before, 'after': load_before,
                                      'deltas': resources.resource_deltas(idle_before, load_before),
                                      'host': resources.host_delta(idle_before, load_before)}
            start = time.monotonic()
            deadline = start + args.seconds
            print('Running bounded native session read load: ' + str(args.concurrency) + ' clients / '
                  + str(args.seconds) + ' seconds / assets replicas ' + str(expected), flush=True)
            with ThreadPoolExecutor(max_workers=args.concurrency) as executor:
                rows = [row for batch in executor.map(worker, range(args.concurrency)) for row in batch]
            elapsed = time.monotonic() - start
            load_after = resources.snapshot()
            report['loadResources'] = {'before': load_before, 'after': load_after,
                                      'deltas': resources.resource_deltas(load_before, load_after),
                                      'host': resources.host_delta(load_before, load_after)}
            report['containersStable'] = all(not row.get('replacedDuringRun')
                for phase in ('idleResources', 'loadResources') for row in report[phase]['deltas'])
            after = asset_request_counts() if args.profile == 'member' else {}
            report['assetsPods'] = {name: {'successfulReads': after[name]['count'] - before[name]['count'],
                                          'restartsAdded': after[name]['restarts'] - before[name]['restarts']}
                                    for name in before if name in after}
            report['routingPassed'] = (set(before) == set(after) and
                all(row['successfulReads'] > 0 and row['restartsAdded'] == 0 for row in report['assetsPods'].values()))
            report['guestMemoryAfterKiB'] = memory()
            report['elapsedSeconds'] = round(elapsed, 2)
            report['requests'] = len(rows)
            report['errors'] = sum(not row['passed'] for row in rows)
            report['requestsPerSecond'] = round(len(rows) / elapsed, 2)
            all_latency = sorted(row['milliseconds'] for row in rows)
            report['latency'] = {'p50Ms': all_latency[math.ceil(len(all_latency) * .5) - 1],
                                 'p95Ms': all_latency[math.ceil(len(all_latency) * .95) - 1]}
            report['routes'] = {}
            for path in sorted({row['path'] for row in rows}):
                values = [row for row in rows if row['path'] == path]
                latency = sorted(row['milliseconds'] for row in values)
                report['routes'][path] = {'requests': len(values), 'errors': sum(not row['passed'] for row in values),
                    'p50Ms': latency[math.ceil(len(latency) * .5) - 1],
                    'p95Ms': latency[math.ceil(len(latency) * .95) - 1], 'maxMs': max(latency)}
            report['passed'] = bool(rows) and report['errors'] == 0 and report['routingPassed'] and report['containersStable']
        except Exception as error:
            report['passed'] = False
            report['failure'] = type(error).__name__
            raise
        finally:
            try:
                if login:
                    status, revoked = session.end_session(*login)
                    report['sessionRevoked'] = revoked
                    if not revoked:
                        report['passed'] = False
            finally:
                try:
                    if scaled:
                        current = owned_assets()
                        if current['metadata']['uid'] != assets['metadata']['uid']:
                            raise RuntimeError('Assets deployment replaced; refusing cleanup of a different resource')
                        if current['spec']['replicas'] == 2:
                            w.kube('-n', w.NAMESPACE, 'scale', 'deployment/assets', '--current-replicas=2', '--replicas=1')
                        elif current['spec']['replicas'] != 1:
                            raise RuntimeError('Replica count changed by another owner; refusing cleanup')
                        w.kube('-n', w.NAMESPACE, 'rollout', 'status', 'deployment/assets', '--timeout=120s', timeout=130)
                        report['replicasRestored'] = True
                finally:
                    path = args.output or w.SHELL / 'build/reports/read-load.json'
                    path.parent.mkdir(parents=True, exist_ok=True)
                    path.write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps(report, indent=2))
    return 0 if report.get('passed') else 1


if __name__ == '__main__':
    raise SystemExit(main())
