#!/usr/bin/env python3
"""Provision/reset the QA target's normal update settings and public trust key.

Run on the designated VMware guest as root. Retains only configuration inputs;
never copies database/media data or writes successful jobs/installed versions.
The caller restarts the existing deployment after stage/reset.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess

ENV = Path('/etc/myscoutee/myscoutee.env')
KEY = Path('/etc/myscoutee/update/release-public-key.pem')
STATE = Path('/var/lib/myscoutee/qa-fixtures/update/configuration.json')
VALUES = {'MYSCOUTEE_UPDATE_ENABLED': 'true',
          'MYSCOUTEE_UPDATE_INCLUDE_PRERELEASES': 'true',
          'MYSCOUTEE_UPDATE_GITHUB_REPOSITORY': 'fssrepository/myscoutee'}


def atomic(path, data, mode=0o600, group=0):
    temporary = path.with_name(path.name + '.qa-tmp')
    with temporary.open('xb') as output:
        output.write(data)
        output.flush()
        os.fsync(output.fileno())
    os.chown(temporary, 0, group)
    os.chmod(temporary, mode)
    temporary.replace(path)


def lines(text, key):
    return re.findall(r'^' + re.escape(key) + r'=.*$', text, flags=re.M)


def replace(text, key, value):
    text = re.sub(r'^' + re.escape(key) + r'=.*\n?', '', text, flags=re.M)
    return text.rstrip('\n') + ('\n' + value if value else '') + '\n'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('action', choices=['stage', 'status', 'reset'])
    parser.add_argument('--public-key', type=Path)
    parser.add_argument('--fingerprint')
    args = parser.parse_args()
    os.umask(0o077)
    if os.geteuid() != 0:
        parser.error('Run as root on the designated VMware QA target.')
    version = subprocess.check_output(['dpkg-query', '-W', '-f=${Version}', 'myscoutee'], text=True)
    if not re.fullmatch(r'\d+\.\d+\.\d+~qa\.[1-9]\d*', version):
        parser.error('A QA prerelease installation is required.')
    if ENV.is_symlink() or not ENV.is_file() or KEY.is_symlink() or STATE.is_symlink():
        parser.error('Unsafe or missing configuration path.')
    current = ENV.read_text()
    if args.action == 'status':
        print(json.dumps({'installedVersion': version,
                          'phase': json.loads(STATE.read_text())['phase'] if STATE.exists() else 'not-staged',
                          'settings': {key: lines(current, key) for key in VALUES},
                          'publicKeyPresent': KEY.is_file()}))
        return
    if args.action == 'stage':
        if STATE.exists() or not args.public_key or not args.fingerprint:
            parser.error('New fixture state, --public-key and --fingerprint are required.')
        public = args.public_key.read_bytes()
        if b'PRIVATE' in public:
            parser.error('Only a public key may be provisioned.')
        der = subprocess.check_output(['openssl', 'pkey', '-pubin', '-outform', 'DER'], input=public)
        fingerprint = 'sha256:' + hashlib.sha256(der).hexdigest()
        if fingerprint != args.fingerprint:
            parser.error('Public key does not match the independently retained fingerprint.')
        if KEY.exists() and KEY.read_bytes() != public:
            parser.error('Existing different trust key must not be overwritten.')
        previous = {key: lines(current, key) for key in VALUES}
        if any(len(value) > 1 for value in previous.values()):
            parser.error('Duplicate update configuration keys.')
        record = {'phase': 'preparing', 'previousLines': previous,
                  'createdKey': not KEY.exists(), 'keySha256': hashlib.sha256(public).hexdigest()}
        STATE.parent.mkdir(parents=True, exist_ok=True)
        atomic(STATE, (json.dumps(record, indent=2) + '\n').encode())
        KEY.parent.mkdir(mode=0o750, parents=True, exist_ok=True)
        if not KEY.exists():
            atomic(KEY, public, 0o640, 10001)
        for key, value in VALUES.items():
            current = replace(current, key, f'{key}={value}')
        atomic(ENV, current.encode(), ENV.stat().st_mode & 0o777, ENV.stat().st_gid)
        record['phase'] = 'staged'
    else:
        record = json.loads(STATE.read_text())
        if record['phase'] != 'staged' or any(lines(current, key) != [f'{key}={value}'] for key, value in VALUES.items()):
            parser.error('Fixture-owned settings changed; inspect before resetting.')
        if not KEY.is_file() or hashlib.sha256(KEY.read_bytes()).hexdigest() != record['keySha256']:
            parser.error('Trust key changed; inspect before resetting.')
        for key in VALUES:
            current = replace(current, key, '\n'.join(record['previousLines'][key]))
        atomic(ENV, current.encode(), ENV.stat().st_mode & 0o777, ENV.stat().st_gid)
        if record['createdKey']:
            KEY.unlink()
        record['phase'] = 'reset'
    atomic(STATE, (json.dumps(record, indent=2) + '\n').encode())
    print('Update configuration ' + record['phase'] + '; restart the existing deployment to apply it.')


if __name__ == '__main__':
    main()
