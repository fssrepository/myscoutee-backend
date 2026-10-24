#!/usr/bin/env python3
"""Native contact mutations using disposable, owned DEMO actors.

Reuse the lab namespace/image guards, Mongo access and native session helper.
No canonical actor is changed, no fixture baseline is reset, and REAL is never
written. Optional replication affects identity alone and is restored. A durable
fixture receipt permits explicit cleanup after interruption. This verifies the
contact flow and write routing; it does not qualify every application flow.
"""

import os as _context_os
import sys as _context_sys
from pathlib import Path as _ContextPath
_context_root = _ContextPath(__file__).resolve().parents[3]
_context_os.environ.setdefault('MYSCOUTEE_BACKEND_SOURCE', str(_context_root))
_context_sys.path.insert(0, str(_ContextPath(_context_os.environ.get('MYSCOUTEE_MICROSERVICES_SOURCE', _context_root.parent / 'myscoutee-microservices')) / 'tools'))
import argparse
from concurrent.futures import ThreadPoolExecutor
import fcntl
import importlib
import json
import re
import time
import uuid
import workloads as w
import contact_fault

session = importlib.import_module('check-session')
import runtime_probes as probes
seed = importlib.import_module('seed_mongo')


def fixture(run_id, action, namespace_uid, scaled=False):
    if not re.fullmatch(r'[a-f0-9]{32}', run_id):
        raise ValueError('Invalid fixture run ID')
    # Keep metadata and every deletion confined to this namespace and these new IDs.
    return seed.mongo((w.SHELL / 'checks/contact-fixture.js').read_text() % (json.dumps(run_id), json.dumps(action), json.dumps(namespace_uid), json.dumps(scaled)))


def request_counts():
    result = {}
    pods = w.kube_json('-n', w.NAMESPACE, 'get', 'pods', '-l', 'app.kubernetes.io/name=identity')['items']
    for pod in pods:
        if pod['metadata'].get('deletionTimestamp'):
            continue
        if not any(c['type'] == 'Ready' and c['status'] == 'True' for c in pod['status'].get('conditions', [])):
            raise RuntimeError('Identity pod not Ready')
        raw = w.kube('-n', w.NAMESPACE, 'exec', 'deployment/frontend', '--', 'wget', '-qO-',
                     'http://' + pod['status']['podIP'] + ':8081/metrics').stdout  # NOSONAR - python:S5332: read-only metrics inside the owned lab VM.
        count = sum(float(line.rsplit(' ', 1)[1]) for line in raw.splitlines()
                    if line.startswith('http_server_requests_seconds_count{')
                    and '/navigator/contacts/' in line and 'chat-access' in line
                    and 'method="PUT"' in line and 'status="200"' in line)
        result[pod['metadata']['name']] = {'writes': count,
            'restarts': sum(c['restartCount'] for c in pod['status'].get('containerStatuses', []))}
    return result


def restore_identity():
    current = probes.owned_deployment('identity')
    replicas = current['spec'].get('replicas')
    if replicas not in (1, 2):
        raise RuntimeError('Identity replica count changed outside this check; refusing to overwrite it')
    if replicas == 2:
        w.kube('-n', w.NAMESPACE, 'scale', 'deployment/identity', '--current-replicas=2', '--replicas=1')
    w.kube('-n', w.NAMESPACE, 'rollout', 'status', 'deployment/identity', '--timeout=180s', timeout=190)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--two-identity', action='store_true')
    parser.add_argument('--worker-recovery', action='store_true', help='Reject one remote command and replace the journal owner pod')
    parser.add_argument('--write-cycles', type=int, default=0, help='Additional request/reject cycles (0–50) on the owned pair')
    parser.add_argument('--cleanup', metavar='RUN_ID', help='Clean only the receipt-owned interrupted fixture')
    args = parser.parse_args()
    if not 0 <= args.write_cycles <= 50 or (args.worker_recovery and args.two_identity):
        parser.error('Use 0–50 write cycles; worker recovery requires one identity replica')
    if args.cleanup and args.two_identity:
        parser.error('Cleanup uses the saved replica ownership, not a new scale request')
    run_id = args.cleanup or uuid.uuid4().hex
    report = {'runId': run_id, 'profile': 'native-contact-request-reject-approve', 'passed': False,
              'qualification': 'Contact mutations and explicitly recorded recovery only; no payment or all-flow qualification.'}
    logins = []
    staged = scaled = False
    with (w.vm.VM / 'lock').open('a') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        if not w.namespace_owned():
            raise RuntimeError('Owned lab namespace absent')
        namespace_uid = w.kube_json('get', 'namespace', w.NAMESPACE)['metadata']['uid']
        if args.cleanup:
            contact_fault.restore(run_id, namespace_uid)
            saved = fixture(run_id, 'status', namespace_uid)
            if saved['scaled']:
                restore_identity()
            print(json.dumps(fixture(run_id, 'cleanup', namespace_uid)))
            return 0
        for name in w.SERVICES:
            deployment = probes.owned_deployment(name)
            if deployment['spec'].get('replicas') != 1 or deployment.get('status', {}).get('readyReplicas') != 1:
                raise RuntimeError('Start from one Ready replica per backend')
        if args.two_identity and probes.memory()['MemAvailable'] < 2 * 1024 * 1024:
            raise RuntimeError('Two identity pods require at least 2 GiB guest available memory')
        try:
            staged = True  # Cleanup receipt may exist even when the stage reply is lost.
            actors = fixture(run_id, 'stage', namespace_uid, args.two_identity)['ids']
            if args.two_identity:
                scaled = True
                w.kube('-n', w.NAMESPACE, 'scale', 'deployment/identity', '--current-replicas=1', '--replicas=2')
                w.kube('-n', w.NAMESPACE, 'rollout', 'status', 'deployment/identity', '--timeout=180s', timeout=190)
            before = request_counts()
            if len(before) != (2 if args.two_identity else 1):
                raise RuntimeError('Unexpected identity pod count')
            for actor in actors:
                logins.append(session.start_session(actor))
            alice, bob = actors
            a, b = (login[1] for login in logins)

            def call(path, headers, payload=None, method=None, expected=200):
                status, body = session.request(path, headers, payload, method)
                if status != expected:
                    raise RuntimeError('Unexpected HTTP ' + str(status) + ' for ' + path.split('?')[0])
                return body

            contact = {'id': bob, 'userId': bob, 'name': 'MSC121 Contact 1', 'initials': 'MC', 'methods': []}
            saved = call('/api/navigator/contacts', a, {'userId': alice, 'contacts': [contact]}, 'PUT')
            if len(saved) != 1 or saved[0]['userId'] != bob:
                raise RuntimeError('Contact save did not round trip')
            route_a = '/api/navigator/contacts/' + bob + '/chat-access'
            route_b = '/api/navigator/contacts/' + alice + '/chat-access'
            if args.worker_recovery:
                contact_fault.install(run_id, namespace_uid)
                # Flush old pooled connections to the original Service endpoint.
                w.kube('-n', w.NAMESPACE, 'rollout', 'restart', 'deployment/identity')
                w.kube('-n', w.NAMESPACE, 'rollout', 'status', 'deployment/identity', '--timeout=180s', timeout=190)
                owner = next(p for p in w.kube_json('-n', w.NAMESPACE, 'get', 'pods', '-l', 'app.kubernetes.io/name=identity')['items']
                             if not p['metadata'].get('deletionTimestamp'))
                status, _ = session.request(route_a, a, {'action': 'request'}, 'PUT')
                evidence = fixture(run_id, 'inspect', namespace_uid)
                if status < 500 or len(evidence['operations']) != 1 or evidence['operations'][0]['state'] != 'pending':
                    raise RuntimeError('Fault did not leave exactly one accepted pending command')
                w.kube('-n', w.NAMESPACE, 'delete', 'pod/' + owner['metadata']['name'], '--grace-period=0', '--force', '--wait=true')
                contact_fault.restore(run_id, namespace_uid)
                w.kube('-n', w.NAMESPACE, 'rollout', 'status', 'deployment/identity', '--timeout=180s', timeout=190)
                # Observe the journal directly; do not call an API that could retry work.
                deadline = time.monotonic() + 100
                while True:
                    evidence = fixture(run_id, 'inspect', namespace_uid)
                    if len(evidence['operations']) == 1 and evidence['operations'][0]['state'] == 'complete':
                        break
                    if time.monotonic() >= deadline:
                        raise RuntimeError('Replacement worker did not complete the persisted command')
                    time.sleep(2)
                if evidence['outboxCount'] != 1:
                    raise RuntimeError('Recovered command lost or duplicated its notification')
                before = request_counts()
                if owner['metadata']['name'] in before:
                    raise RuntimeError('Recovery did not run on a replacement pod')
                report['workerRecovery'] = {'pendingBeforeTermination': True, 'completedWithoutApiRetry': True,
                    'replacementPod': next(iter(before)), 'notificationIntents': 1}
                print('PASS: accepted command recovered after owner pod termination, without API replay', flush=True)
            else:
                with ThreadPoolExecutor(max_workers=2) as pool:
                    responses = list(pool.map(lambda _: session.request(route_a, a, {'action': 'request'}, 'PUT'), range(2)))
                if any(status not in (200, 503) for status, _ in responses):
                    raise RuntimeError('Concurrent request returned an unexpected status')
            # A live competing lease may return 503; the accepted command must still finish.
            deadline = time.monotonic() + 75
            while True:
                snapshot = call('/api/navigator/contacts/chat-access', b)
                records = snapshot.get('records', [])
                if snapshot.get('pendingCount') == 1 and len(records) == 1:
                    break
                if time.monotonic() >= deadline:
                    raise RuntimeError('Accepted contact request did not recover')
                time.sleep(1)
            version = records[0]['version']
            call(route_a, a, {'action': 'approve', 'version': version}, 'PUT', 403)
            rejected = call(route_b, b, {'action': 'reject', 'version': version}, 'PUT')
            if rejected['pendingCount'] != 0:
                raise RuntimeError('Rejected contact request left a pending counter')
            write_started = time.monotonic()
            for _ in range(args.write_cycles):
                call(route_a, a, {'action': 'request'}, 'PUT')
                pending = call('/api/navigator/contacts/chat-access', b)
                if pending['pendingCount'] != 1:
                    raise RuntimeError('Repeated request counter is not one')
                rejected = call(route_b, b, {'action': 'reject', 'version': pending['records'][0]['version']}, 'PUT')
                if rejected['pendingCount'] != 0:
                    raise RuntimeError('Repeated rejection counter is not zero')
            report['writeCycles'] = {'count': args.write_cycles, 'seconds': round(time.monotonic() - write_started, 3)}
            call(route_a, a, {'action': 'request'}, 'PUT')
            pending = call('/api/navigator/contacts/chat-access', b)
            version = pending['records'][0]['version']
            approved = call(route_b, b, {'action': 'approve', 'version': version}, 'PUT')
            # Replays must preserve version, counter, contact and outbox cardinalities.
            for _ in range(12):
                replay = call(route_b, b, {'action': 'approve', 'version': version}, 'PUT')
                if replay != approved:
                    raise RuntimeError('Accepted decision replay changed its snapshot')
            if approved['pendingCount'] != 0 or len(approved['contacts']) != 1 or approved['records'][0]['status'] != 'approved':
                raise RuntimeError('Approval did not produce exactly one contact and a cleared counter')
            evidence = fixture(run_id, 'inspect', namespace_uid)
            expected_commands = 4 + 2 * args.write_cycles
            if len(evidence['operations']) != expected_commands or any(x['state'] != 'complete' for x in evidence['operations']):
                raise RuntimeError('Unexpected durable contact command count/state')
            if evidence['outboxCount'] != expected_commands:
                raise RuntimeError('Notification intents were lost or duplicated')
            after = request_counts()
            if set(before) != set(after) or any(after[p]['restarts'] != before[p]['restarts'] for p in before):
                raise RuntimeError('Identity pods changed or restarted during the write sample')
            report['identityPods'] = {p: {'successfulWrites': after[p]['writes'] - before[p]['writes']} for p in before}
            if not all(row['successfulWrites'] > 0 for row in report['identityPods'].values()):
                raise RuntimeError('Successful writes were not observed on every identity pod')
            report.update(passed=True, durableCommands=expected_commands, notificationIntents=expected_commands, approvalReplays=12)
            print('PASS: contact request/reject/approve, receipt replay, counters and per-pod writes', flush=True)
        except Exception as error:
            report['failure'] = str(error)
            raise
        finally:
            contact_fault.restore(run_id, namespace_uid)
            revoked = []
            for login in logins:
                try:
                    revoked.append(session.end_session(*login)[1])
                except (OSError, ValueError):
                    revoked.append(False)
            report['sessionsRevoked'] = all(revoked)
            try:
                if scaled:
                    restore_identity()
                report['replicasRestored'] = True
                if staged:
                    report['fixtureCleaned'] = fixture(run_id, 'cleanup', namespace_uid)['cleaned']
            finally:
                report['passed'] = report['passed'] and report.get('sessionsRevoked', False) and report.get('fixtureCleaned', False) and report.get('replicasRestored', False)
                path = w.BUILD / 'reports/business' / (run_id + '.json')
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text(json.dumps(report, indent=2) + '\n')
                print('Report: ' + str(path), flush=True)
                if not report.get('fixtureCleaned'):
                    print('Retained owned fixture. Retry: python3 tests/e2e/microservices/check-business.py --cleanup ' + run_id, flush=True)
    return 0 if report['passed'] else 1


if __name__ == '__main__':
    raise SystemExit(main())
