#!/usr/bin/env python3
"""Stage/reset the QA VM's normal release origin and TLS CA configuration only."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
from urllib.parse import urlsplit

ENV = Path('/etc/myscoutee/myscoutee.env')
CA = Path('/etc/myscoutee/update/qa-release-source-ca.pem')
STATE = Path('/var/lib/myscoutee/qa-fixtures/update/release-source.json')
KEYS = ['MYSCOUTEE_UPDATE_RELEASE_API_ORIGIN', 'MYSCOUTEE_UPDATE_RELEASE_DOWNLOAD_ORIGIN',
        'MYSCOUTEE_UPDATE_TLS_CA_CERTIFICATE']


def atomic(path, value, mode=0o600, group=0):
    temporary = path.with_name(path.name + '.source-fixture-tmp')
    with temporary.open('xb') as output:
        output.write(value)
        output.flush()
        os.fsync(output.fileno())
    os.chown(temporary, 0, group)
    os.chmod(temporary, mode)
    temporary.replace(path)


def matches(text, key):
    return re.findall(r'^' + re.escape(key) + r'=.*$', text, re.M)


def setline(text, key, value):
    return re.sub(r'^' + re.escape(key) + r'=.*\n?', '', text, flags=re.M).rstrip('\n') + '\n' + (value + '\n' if value else '')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('action', choices=['stage', 'status', 'reset'])
    parser.add_argument('--origin')
    parser.add_argument('--certificate', type=Path)
    args = parser.parse_args()
    os.umask(0o077)
    version = subprocess.check_output(['dpkg-query', '-W', '-f=${Version}', 'myscoutee'], text=True)
    if os.geteuid() != 0 or not re.fullmatch(r'\d+\.\d+\.\d+~qa\.[1-9]\d*', version):
        parser.error('Run as root on a QA prerelease VM.')
    if any(path.is_symlink() for path in [ENV, CA, STATE]) or not ENV.is_file():
        parser.error('Unsafe fixture path.')
    text = ENV.read_text()
    if args.action == 'status':
        print(json.dumps({'phase': json.loads(STATE.read_text())['phase'] if STATE.exists() else 'not-staged',
                          'settings': {key: matches(text, key) for key in KEYS}}))
        return
    if args.action == 'stage':
        uri = urlsplit(args.origin or '')
        if (uri.scheme != 'https' or not uri.hostname or uri.username or uri.password or uri.query
                or uri.fragment or uri.path not in ('', '/') or not args.certificate or STATE.exists() or CA.exists()):
            parser.error('Require HTTPS origin, public CA certificate and unused fixture state.')
        public = args.certificate.read_bytes()
        if b'PRIVATE' in public or len(public) > 65536:
            parser.error('Expected a public CA certificate only.')
        subprocess.run(['openssl', 'x509', '-noout', '-checkend', '0'], input=public, check=True, stdout=subprocess.DEVNULL)
        saved = {key: matches(text, key) for key in KEYS}
        if any(len(lines) > 1 for lines in saved.values()):
            parser.error('Duplicate configuration key.')
        values = dict(zip(KEYS, [args.origin.rstrip('/'), args.origin.rstrip('/'), str(CA)]))
        record = {'phase': 'preparing', 'previousLines': saved, 'values': values,
                  'certificateSha256': hashlib.sha256(public).hexdigest()}
        STATE.parent.mkdir(parents=True, exist_ok=True)
        atomic(STATE, json.dumps(record).encode())
        atomic(CA, public, 0o640, 10001)
        for key, value in values.items():
            text = setline(text, key, key + '=' + value)
        atomic(ENV, text.encode(), ENV.stat().st_mode & 0o777, ENV.stat().st_gid)
        record['phase'] = 'staged'
    else:
        record = json.loads(STATE.read_text())
        if (record['phase'] != 'staged' or not CA.is_file()
                or hashlib.sha256(CA.read_bytes()).hexdigest() != record['certificateSha256']
                or any(matches(text, key) != [key + '=' + value] for key, value in record['values'].items())):
            parser.error('Fixture-owned state changed; inspect before resetting.')
        for key, value in record['previousLines'].items():
            text = setline(text, key, '\n'.join(value))
        atomic(ENV, text.encode(), ENV.stat().st_mode & 0o777, ENV.stat().st_gid)
        CA.unlink()
        record['phase'] = 'reset'
    atomic(STATE, (json.dumps(record, indent=2) + '\n').encode())
    print('Release source ' + record['phase'] + '; takes effect when the configured application starts.')


if __name__ == '__main__':
    main()
