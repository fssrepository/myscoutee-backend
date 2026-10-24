#!/usr/bin/env python3
"""Stage/reset the QA VM's normal release origin and TLS CA configuration only."""
import argparse
import hashlib
import json
import os
import grp
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
    parser.add_argument('--package', choices=['myscoutee', 'myscoutee-template'], default='myscoutee')
    parser.add_argument('--expected-stable-version', help='Explicit installed stable version on the delegated qualification guest only')
    args = parser.parse_args()
    os.umask(0o077)
    global ENV, CA, STATE
    ENV = Path(f'/etc/{args.package}/{args.package}.env')
    CA = Path(f'/etc/{args.package}/update/qa-release-source-ca.pem')
    STATE = Path(f'/var/lib/{args.package}/qa-fixtures/update/release-source.json')
    runtime_gid = grp.getgrnam(args.package + '-runtime').gr_gid
    version = subprocess.check_output(['dpkg-query', '-W', '-f=${Version}', args.package], text=True)
    qa_version = re.fullmatch(r'\d+\.\d+\.\d+~qa\.[1-9]\d*', version)
    # A successful QA-to-stable upgrade must still be able to restore the
    # original release source using the existing fixture ownership checks.
    upgraded_stable = args.action in ('status', 'reset') and re.fullmatch(r'\d+\.\d+\.\d+', version)
    delegated_stable = (args.action == 'stage' and args.expected_stable_version == version
                        and re.fullmatch(r'\d+\.\d+\.\d+', version))
    if os.geteuid() != 0 or not (qa_version or upgraded_stable or delegated_stable):
        parser.error('Run as root on a QA prerelease VM, explicitly name the installed stable qualification version, or reset/status after upgrading.')
    if any(path.is_symlink() for path in [ENV, CA, STATE]) or not ENV.is_file():
        parser.error('Unsafe fixture path.')
    text = ENV.read_text()
    if args.action == 'status':
        print(json.dumps({'phase': json.loads(STATE.read_text())['phase'] if STATE.exists() else 'not-staged',
                          'settings': {key: matches(text, key) for key in KEYS}}))
        return
    if args.action == 'stage':
        uri = urlsplit(args.origin or '')
        if STATE.exists():
            previous = json.loads(STATE.read_text())
            if previous.get('phase') != 'reset' or any(
                    matches(text, key) != previous['previousLines'][key] for key in KEYS):
                parser.error('Existing fixture is not reset or configuration changed since reset.')
        if (uri.scheme != 'https' or not uri.hostname or uri.username or uri.password or uri.query
                or uri.fragment or uri.path not in ('', '/') or not args.certificate or CA.exists()):
            parser.error('Require HTTPS origin, public CA certificate and absent fixture certificate.')
        public = args.certificate.read_bytes()
        if b'PRIVATE' in public or len(public) > 65536:
            parser.error('Expected a public CA certificate only.')
        subprocess.run(['openssl', 'x509', '-noout', '-checkend', '0'], input=public, check=True, stdout=subprocess.DEVNULL)
        saved = {key: matches(text, key) for key in KEYS}
        if any(len(lines) > 1 for lines in saved.values()):
            parser.error('Duplicate configuration key.')
        values = dict(zip(KEYS, [args.origin.rstrip('/'), args.origin.rstrip('/'), '/etc/myscoutee/update/qa-release-source-ca.pem']))
        record = {'phase': 'preparing', 'previousLines': saved, 'values': values,
                  'certificateSha256': hashlib.sha256(public).hexdigest()}
        STATE.parent.mkdir(parents=True, exist_ok=True)
        atomic(STATE, json.dumps(record).encode())
        atomic(CA, public, 0o640, runtime_gid)
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
