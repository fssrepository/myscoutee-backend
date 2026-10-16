#!/usr/bin/env python3
"""Paired local-dev Registry rollback. Never creates a container or a key.

The existing Go owner is briefly stopped for a consistent SQLite archive, then
restarted. Retained archives contain secrets and stay in a private /tmp folder.
Use this wrapper, not the Mongo-only fixture, for stage/reset.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import tarfile
import tempfile

ROOT = Path(__file__).resolve().parents[3]
HARNESS = ROOT / 'server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh'
CHECKPOINT = 'OPERATOR-REGISTRY-LIFECYCLE-001'
SCENARIO = 'operator-registry'
RETAINED = Path(tempfile.gettempdir()) / 'myscoutee-qa-operator-registry'
LOCAL_DIRS = ('registry-demo-keys', 'registry-demo-state')
MONGO_ACTIONS = {}


def run(*args, **kwargs):
    return subprocess.run(args, check=True, **kwargs)


def inspect(name):
    return json.loads(subprocess.check_output(['docker', 'inspect', name]))[0]


def guard():
    expected = str(ROOT / 'server/docker-compose-dev.yml')
    for name in ('myscoutee', 'registry', 'mongodb'):
        item = inspect(name)
        if item['Config']['Labels'].get('com.docker.compose.project.config_files') != expected:
            raise RuntimeError(f'{name} is not the repository dev Compose service')
        if not item['State']['Running']:
            raise RuntimeError(f'{name} must already be running')
    registry = inspect('registry')
    if registry['Config']['Cmd'] != ['start-demo']:
        raise RuntimeError('Requires the isolated Go demo Registry')
    env = dict(x.split('=', 1) for x in registry['Config']['Env'] if '=' in x)
    if env.get('REGISTRY_SCOPE') != 'demo:myscoutee':
        raise RuntimeError('Unexpected Registry scope')


def mongo(action):
    command = MONGO_ACTIONS.get(action, action)
    return json.loads(subprocess.check_output([
        'bash', str(HARNESS), command, SCENARIO, CHECKPOINT
    ])) if action != 'reset' else run(
        'bash', str(HARNESS), command, SCENARIO, CHECKPOINT)


def archive_go(destination):
    with destination.open('wb') as out:
        run('docker', 'cp', 'registry:/data/.', '-', stdout=out)


def archive_hashes(archive):
    result = {}
    with tarfile.open(archive) as source:
        for member in source:
            if member.isdir():
                continue
            if not member.isfile():
                raise RuntimeError('Registry archive contains a non-regular file')
            # A clean SQLite shutdown must remove its live sidecars.
            if member.name.endswith(('-wal', '-shm')):
                raise RuntimeError('SQLite sidecars remain after shutdown; retain snapshot and investigate')
            result[member.name] = hashlib.sha256(source.extractfile(member).read()).hexdigest()
    return result


def local_hashes(directory):
    result = {}
    if directory.exists():
        for item in directory.rglob('*'):
            if item.is_symlink():
                raise RuntimeError('Refusing a symlink in Registry local state')
            if item.is_file():
                result[str(item.relative_to(directory))] = hashlib.sha256(item.read_bytes()).hexdigest()
    return result


def with_stopped_registry(action):
    run('docker', 'stop', '--time', '20', 'registry', stdout=subprocess.DEVNULL)
    try:
        action()
    finally:
        run('docker', 'start', 'registry', stdout=subprocess.DEVNULL)


def stage():
    if RETAINED.exists():
        raise RuntimeError('A retained Registry backup already exists; do not overwrite it')
    baseline = mongo('status')
    if baseline['phase'] != 'not-staged':
        raise RuntimeError('Mongo Registry fixture is already staged')
    RETAINED.mkdir(mode=0o700)
    manifest = {'checkpoint': CHECKPOINT, 'phase': 'snapshot-preparing', 'local': {}}
    for name in LOCAL_DIRS:
        source = ROOT / 'server/data' / name
        manifest['local'][name] = {'exists': source.exists(), 'hashes': local_hashes(source)}
        if source.exists():
            shutil.copytree(source, RETAINED / name)
    archive = RETAINED / 'go-data.tar'
    with_stopped_registry(lambda: (archive_go(archive), archive_hashes(archive)))
    manifest['goHashes'] = archive_hashes(archive)
    manifest['phase'] = 'external-snapshot-ready'
    (RETAINED / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
    print(json.dumps(mongo('stage'), indent=2))
    manifest['phase'] = 'baseline-ready'
    (RETAINED / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
    print('Registry SQLite, signing material, local node state and Mongo baseline retained; no registration performed.')


def reset():
    manifest = json.loads((RETAINED / 'manifest.json').read_text())
    if manifest['checkpoint'] != CHECKPOINT or manifest['phase'] != 'baseline-ready':
        raise RuntimeError('Incomplete or foreign baseline; investigate before reset')
    if mongo('status')['phase'] == 'not-staged':
        raise RuntimeError('Mongo baseline is absent; preserve external backup')
    if archive_hashes(RETAINED / 'go-data.tar') != manifest['goHashes']:
        raise RuntimeError('Retained Go archive hash mismatch')

    def restore():
        current = RETAINED / 'go-before-reset.tar'
        archive_go(current)
        if set(archive_hashes(current)) != set(manifest['goHashes']):
            raise RuntimeError('Go file set changed; retain both archives for explicit recovery')
        with (RETAINED / 'go-data.tar').open('rb') as source:
            run('docker', 'cp', '-a', '-', 'registry:/data', stdin=source)
        archive_go(RETAINED / 'go-restored.tar')
        if archive_hashes(RETAINED / 'go-restored.tar') != manifest['goHashes']:
            raise RuntimeError('Go archive restoration comparison failed')
        for name, baseline in manifest['local'].items():
            destination = ROOT / 'server/data' / name
            local_hashes(destination)  # Reject symlinks before deleting fixture-owned state.
            if destination.exists():
                # The Compose init owns the parent directory. Application-owned
                # contents are removable by the current user; only removing the
                # now-empty provisioned directory needs the init's authority.
                for child in destination.iterdir():
                    if child.is_dir():
                        shutil.rmtree(child)
                    else:
                        child.unlink()
                if not baseline['exists']:
                    run('docker', 'exec', '--user', '0', 'myscoutee',
                        'rmdir', '--', '/workspace/data/' + name)
            if baseline['exists']:
                shutil.copytree(RETAINED / name, destination, dirs_exist_ok=True)
            if local_hashes(destination) != baseline['hashes']:
                raise RuntimeError('Local Registry restoration comparison failed')
        mongo('reset')

    with_stopped_registry(restore)
    manifest['phase'] = 'restored'
    (RETAINED / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
    print('PASS: Go archive bytes, local node state and Mongo/session baseline restored. Private recovery archive retained.')


if __name__ == '__main__':
    os.umask(0o077)
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('action', choices=('stage', 'status', 'reset'))
    parser.add_argument('--checkpoint', choices=('registry', 'revenue', 'mcp-events', 'role-guides'), default='registry')
    args = parser.parse_args()
    if args.checkpoint == 'revenue':
        CHECKPOINT = 'OPERATOR-REVENUE-LIFECYCLE-001'
        SCENARIO = 'operator-revenue'
        RETAINED = Path(tempfile.gettempdir()) / 'myscoutee-qa-operator-revenue'
    elif args.checkpoint == 'mcp-events':
        CHECKPOINT = 'MSC115-WORK-COMMUNITY'
        SCENARIO = 'work-community'
        RETAINED = Path(tempfile.gettempdir()) / 'myscoutee-qa-mcp-events-registry'
        MONGO_ACTIONS = {'stage': 'capture-integration-registry',
                         'status': 'integration-registry-status',
                         'reset': 'restore-integration-registry'}
    elif args.checkpoint == 'role-guides':
        CHECKPOINT = 'ROLE-GUIDES-NOTIFICATIONS-001'
        SCENARIO = 'role-triad'
        RETAINED = Path(tempfile.gettempdir()) / 'myscoutee-qa-role-guides-registry'
        MONGO_ACTIONS = {'stage': 'capture-integration-registry',
                         'status': 'integration-registry-status',
                         'reset': 'restore-integration-registry'}
    guard()
    if args.action == 'stage':
        stage()
    elif args.action == 'reset':
        reset()
    else:
        print(json.dumps(mongo('status'), indent=2))
        print('External snapshot retained:', (RETAINED / 'manifest.json').exists())
