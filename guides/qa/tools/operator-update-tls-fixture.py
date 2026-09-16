#!/usr/bin/env python3
"""Prepare/reset only the disposable QA guest's TLS test inputs and changed settings.

Does not apply TLS, submit jobs, or touch user databases/media. Apply via Operator UI.
The existing bootstrap certificate is the QA trust anchor; private inputs stay0600.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import subprocess

ROOT = Path('/var/lib/myscoutee/qa-fixtures/update/tls')
ENV = Path('/etc/myscoutee/myscoutee.env')
KEYS = Path('/opt/myscoutee/server/docker/conf/nginx/keys')
CONFIG = Path('/var/lib/myscoutee/tls/runtime/configuration.json')
DOMAIN = 'qa.localhost'
ENV_KEYS = ('DOMAIN', 'LETSENCRYPT_ENABLED', 'WEBSOCKET_ALLOWED_ORIGIN_PATTERNS',
            'EMAIL_BASE_URL', 'PAYMENT_SIMULATOR_PUBLIC_BASE_URL', 'PAYMENT_SIMULATOR_APPLICATION_BASE_URL')


def run(*args):
    return subprocess.check_output(args, stderr=subprocess.PIPE)


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('action', choices=['stage', 'status', 'reset'])
    args = parser.parse_args()
    os.umask(0o077)
    if os.geteuid() != 0 or ROOT.is_symlink():
        parser.error('Run as root on the QA guest.')
    if not re.fullmatch(r'\d+\.\d+\.\d+~qa\.\d+', run('dpkg-query', '-W', '-f=${Version}', 'myscoutee').decode()):
        parser.error('Installed QA prerelease required.')
    if args.action == 'stage':
        if ROOT.exists():
            parser.error('TLS fixture exists; inspect/reset first.')
        ROOT.mkdir(mode=0o700, parents=True)
        originals = {}
        for name, path in [('certificate', KEYS/'nginx.crt'), ('private-key', KEYS/'nginx-nopass.key'), ('configuration', CONFIG)]:
            if path.is_symlink():
                parser.error('Unexpected symlink.')
            if path.exists():
                st = path.stat()
                shutil.copyfile(path, ROOT/name)
                originals[name] = {'path': str(path), 'mode': st.st_mode & 0o777, 'uid': st.st_uid, 'gid': st.st_gid}
        env_lines = [line for line in ENV.read_text().splitlines() if line.partition('=')[0] in ENV_KEYS]
        state = {'originals': originals, 'envLines': env_lines, 'domain': DOMAIN}
        (ROOT/'state.json').write_text(json.dumps(state))
        run('openssl', 'req', '-new', '-newkey', 'rsa:2048', '-nodes', '-subj', '/CN='+DOMAIN,
            '-keyout', str(ROOT/'leaf.key'), '-out', str(ROOT/'leaf.csr'))
        (ROOT/'extensions').write_text('basicConstraints=critical,CA:FALSE\nkeyUsage=critical,digitalSignature,keyEncipherment\nextendedKeyUsage=serverAuth\nsubjectAltName=DNS:qa.localhost,DNS:localhost,IP:127.0.0.1\n')
        run('openssl', 'x509', '-req', '-in', str(ROOT/'leaf.csr'), '-CA', str(ROOT/'certificate'),
            '-CAkey', str(ROOT/'private-key'), '-set_serial', '0x'+os.urandom(16).hex(), '-days', '7',
            '-extfile', str(ROOT/'extensions'), '-out', str(ROOT/'leaf.crt'))
        run('openssl', 'verify', '-CAfile', str(ROOT/'certificate'), '-verify_hostname', DOMAIN, str(ROOT/'leaf.crt'))
        state['certificateSha256'] = sha(ROOT/'leaf.crt')
        state['keySha256'] = sha(ROOT/'leaf.key')
        (ROOT/'state.json').write_text(json.dumps(state))
    elif args.action == 'reset':
        state = json.loads((ROOT/'state.json').read_text())
        if sha(KEYS/'nginx.crt') not in (state['certificateSha256'], sha(ROOT/'certificate')):
            parser.error('Certificate changed outside this fixture; refusing reset.')
        if sha(KEYS/'nginx-nopass.key') not in (state['keySha256'], sha(ROOT/'private-key')):
            parser.error('Private key changed outside this fixture; refusing reset.')
        if CONFIG.exists() and json.loads(CONFIG.read_text()).get('domain') not in ('', DOMAIN):
            parser.error('TLS configuration changed outside this fixture.')
        for name, original in state['originals'].items():
            target = Path(original['path'])
            shutil.copyfile(ROOT/name, target)
            os.chmod(target, original['mode'])
            os.chown(target, original['uid'], original['gid'])
        if 'configuration' not in state['originals']:
            CONFIG.unlink(missing_ok=True)
        remaining = [line for line in ENV.read_text().splitlines() if line.partition('=')[0] not in ENV_KEYS]
        ENV.write_text('\n'.join(remaining + state['envLines'])+'\n')
        run('/opt/myscoutee/packaging/scripts/myscoutee-compose.sh', 'up', '-d', '--force-recreate', 'nginx')
        shutil.rmtree(ROOT)
        print('PASS TLS-only fixture reset; no database/media restored')
        return
    state = json.loads((ROOT/'state.json').read_text())
    print(json.dumps({'domain': state['domain'], 'certificateSha256': state['certificateSha256'], 'appliedByFixture': False}))


if __name__ == '__main__':
    main()
