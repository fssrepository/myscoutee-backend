#!/usr/bin/env python3
"""Owned two-member Mongo lab conversion, backup and idempotent initialization.

Both members vote. This demonstrates replication, not one-node-loss write
availability. Default application reads stay on the primary for consistency.
"""
import argparse
import datetime
import fcntl
import gzip
import hashlib
import json
import os
import shlex
import subprocess
import time
import uuid
import workloads as w

STATE = w.vm.VM / 'mongo-replicaset.json'
MEMBERS = [name + '.' + w.NAMESPACE + '.svc.cluster.local:27017' for name in ('mongodb', 'mongodb-secondary')]


def direct(script, deployment='mongodb'):
    prefix = "db.getSiblingDB('admin').auth(process.env.MONGO_INITDB_ROOT_USERNAME,process.env.MONGO_INITDB_ROOT_PASSWORD);\n"
    result = w.kube('-n', w.NAMESPACE, 'exec', 'deployment/' + deployment, '--', 'mongosh',
        'mongodb://localhost:27017/?directConnection=true', '--quiet', '--eval', prefix + script)
    return json.loads(result.stdout.strip().splitlines()[-1])


def configured():
    current = w.kube('-n', w.NAMESPACE, 'get', 'deployment/mongodb', '--ignore-not-found', '-o', 'json')
    if not current.stdout.strip():
        return False
    if json.loads(current.stdout).get('status', {}).get('readyReplicas', 0) < 1:
        return False
    result = direct("try {print(JSON.stringify({config:db.adminCommand({replSetGetConfig:1}).config}));} catch(e) {if(![76,94].includes(e.code))throw e;print(JSON.stringify({config:null}));}")
    config = result['config']
    if config is None:
        return False
    if config['_id'] != 'msc121' or sorted(m['host'] for m in config['members']) != sorted(MEMBERS):
        raise RuntimeError('Existing replica configuration differs; refusing reconfiguration')
    return True


def save_state(state):
    temporary = STATE.with_suffix('.tmp')
    temporary.write_text(json.dumps(state, indent=2) + '\n')
    temporary.chmod(0o600)
    os.replace(temporary, STATE)


def require_conversion_receipt():
    uid = w.kube_json('get', 'namespace', w.NAMESPACE)['metadata']['uid']
    if STATE.exists():
        state = json.loads(STATE.read_text())
        if state['namespaceUid'] != uid:
            raise RuntimeError('Mongo conversion receipt belongs to another namespace')
        if state.get('backup'):
            backup = w.vm.VM / state['backup']
            if not backup.is_file() or hashlib.sha256(backup.read_bytes()).hexdigest() != state['sha256']:
                raise RuntimeError('Mongo conversion backup is missing or changed')
        return
    existing = w.kube('-n', w.NAMESPACE, 'get', 'pvc/mongodb', '--ignore-not-found', '-o', 'json')
    if existing.stdout.strip():
        raise RuntimeError('Existing Mongo data requires: python3 microservices/tools/mongo_replica.py configure')
    save_state({'namespaceUid': uid, 'phase': 'fresh', 'createdAt': datetime.datetime.now(datetime.timezone.utc).isoformat()})


def initialize():
    if not configured():
        config = {'_id': 'msc121', 'members': [{'_id': i, 'host': host, 'priority': 2 if i == 0 else 1}
                                            for i, host in enumerate(MEMBERS)]}
        direct('print(JSON.stringify(rs.initiate(' + json.dumps(config) + ')));')
    deadline = time.monotonic() + 150
    while True:
        state = direct("const s=rs.status();print(JSON.stringify({members:s.members.map(m=>({name:m.name,state:m.stateStr,health:m.health}))}));")
        if sorted(row['state'] for row in state['members']) == ['PRIMARY', 'SECONDARY'] and all(row['health'] == 1 for row in state['members']):
            return state
        if time.monotonic() > deadline:
            raise RuntimeError('Replica initial synchronization did not complete; retain data and rerun configure')
        time.sleep(2)


def collection_counts():
    return direct("const r={};for(const n of ['msc121_real','msc121_demo']) {const d=db.getSiblingDB(n);r[n]={};for(const c of d.getCollectionNames().sort())r[n][c]=d.getCollection(c).countDocuments({});}print(JSON.stringify(r));")


def backup():
    uid = w.kube_json('get', 'namespace', w.NAMESPACE)['metadata']['uid']
    if STATE.exists():
        require_conversion_receipt()
        return json.loads(STATE.read_text())
    folder = w.vm.VM / 'backups'
    w.vm.private_directory(folder)
    archive = folder / ('mongo-before-replicaset-' + datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%SZ') + '.archive.gz')
    counts = collection_counts()
    command = shlex.join(['sudo', 'k3s', 'kubectl', '-n', w.NAMESPACE, 'exec', 'deployment/mongodb', '--',
        'sh', '-ec', 'exec mongodump --host 127.0.0.1 --username "$MONGO_INITDB_ROOT_USERNAME" --password "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase admin --archive --gzip'])
    with archive.open('xb') as output:
        result = subprocess.run(w.vm.ssh_command(command), stdout=output, stderr=subprocess.PIPE, timeout=180)
    archive.chmod(0o600)
    if result.returncode:
        raise RuntimeError('Mongo backup failed; partial archive retained, conversion not started')
    with gzip.open(archive, 'rb') as stream:
        while stream.read(1024 * 1024):
            pass  # Verify the complete compressed stream before conversion.
    if archive.stat().st_size < 1024:
        raise RuntimeError('Unexpectedly small Mongo archive')
    state = {'namespaceUid': uid, 'phase': 'backed-up', 'backup': str(archive.relative_to(w.vm.VM)),
             'sha256': hashlib.sha256(archive.read_bytes()).hexdigest(), 'counts': counts}
    save_state(state)
    return state


def replication_probe():
    marker = 'replica-check-' + uuid.uuid4().hex
    host = 'mongodb://' + ','.join(MEMBERS) + '/?replicaSet=msc121'
    # Discover the current primary; never assume the first member is still primary.
    script = "const c=new Mongo(" + json.dumps(host) + ");c.getDB('admin').auth(process.env.MONGO_INITDB_ROOT_USERNAME,process.env.MONGO_INITDB_ROOT_PASSWORD);const d=c.getDB('msc121_bootstrap');"
    direct(script + 'd.replicaChecks.insertOne({_id:' + json.dumps(marker) + '},{writeConcern:{w:"majority",wtimeout:15000}});print(JSON.stringify({written:true}));')
    try:
        secondary = next(row['name'].split('.')[0] for row in initialize()['members'] if row['state'] == 'SECONDARY')
        observed = direct('db.getMongo().setReadPref("secondary");print(JSON.stringify({found:db.getSiblingDB("msc121_bootstrap").replicaChecks.countDocuments({_id:' + json.dumps(marker) + '})}));', secondary)
        if observed['found'] != 1:
            raise RuntimeError('Replica write was not present on the second member')
    finally:
        direct(script + 'd.replicaChecks.deleteOne({_id:' + json.dumps(marker) + '},{writeConcern:{w:"majority",wtimeout:15000}});print(JSON.stringify({deleted:true}));')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('action', choices=['configure', 'status', 'tune-cpu'])
    args = parser.parse_args()
    os.umask(0o077)
    if not w.namespace_owned():
        raise RuntimeError('Start the owned lab namespace first')
    if args.action == 'tune-cpu':
        # Kubernetes in-place resize preserves the warmed database/process. The
        # next Helm apply persists the same versioned limit on its Deployment.
        cores = str(w.CONFIG.get('mongoCpuLimit', 2))
        if cores not in ('2', '3'):
            raise RuntimeError('This 4-vCPU lab permits a Mongo ceiling of 2 or 3 cores')
        with (w.vm.VM / 'lock').open('a') as lock:
            fcntl.flock(lock, fcntl.LOCK_EX)
            pods = w.kube_json('-n', w.NAMESPACE, 'get', 'pods', '-l', 'app.kubernetes.io/name=mongodb')['items']
            if len(pods) != 1:
                raise RuntimeError('Expected one original Mongo member pod')
            pod = pods[0]
            if pod['spec']['containers'][0]['image'] != w.image_lock()['mongodb']['reference']:
                raise RuntimeError('Unexpected Mongo image')
            original = pod['status']['containerStatuses'][0]
            patch = [{'op': 'test', 'path': '/metadata/uid', 'value': pod['metadata']['uid']},
                     {'op': 'replace', 'path': '/spec/containers/0/resources/limits/cpu', 'value': cores}]
            w.kube('-n', w.NAMESPACE, 'patch', 'pod/' + pod['metadata']['name'], '--subresource=resize', '--type=json', '-p', json.dumps(patch))
            deadline = time.monotonic() + 45
            while True:
                current = w.kube_json('-n', w.NAMESPACE, 'get', 'pod/' + pod['metadata']['name'])['status']['containerStatuses'][0]
                if current['containerID'] != original['containerID'] or current['restartCount'] != original['restartCount']:
                    raise RuntimeError('Mongo restarted during CPU resize; do not treat the measurement as warmed')
                if current.get('resources', {}).get('limits', {}).get('cpu') == cores:
                    print('PASS: Mongo CPU limit is ' + cores + ' cores; process and warm cache retained')
                    return
                if time.monotonic() >= deadline:
                    raise RuntimeError('CPU resize did not become effective')
                time.sleep(1)
    if args.action == 'status':
        print(json.dumps(initialize() if configured() else {'configured': False}, indent=2))
        return
    if not w.CONFIG.get('mongoReplicaSet'):
        raise RuntimeError('Set mongoReplicaSet=true in deploy/runtime.json before conversion')
    with (w.vm.VM / 'lock').open('a') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        if STATE.exists() and json.loads(STATE.read_text()).get('phase') == 'verified' and configured():
            require_conversion_receipt()
            replication_probe()
            w.deploy_chart(backends_enabled=True)
            print('PASS: existing replica set verified; no backup, initialization or coordinated stop repeated')
            return
        w.stop_backends()
        state = backup()
        w.deploy_chart(backends_enabled=False)
        result = initialize()
        if state.get('phase') == 'backed-up' and collection_counts() != state['counts']:
            raise RuntimeError('Collection counts changed during conversion; backends remain stopped')
        replication_probe()
        state['phase'] = 'verified'
        state['members'] = result['members']
        save_state(state)
        w.deploy_chart(backends_enabled=True)
        print('PASS: two Mongo members synchronized, original data retained, majority-write/secondary-read probe cleaned')
        print(json.dumps(result, indent=2))


if __name__ == '__main__':
    main()
