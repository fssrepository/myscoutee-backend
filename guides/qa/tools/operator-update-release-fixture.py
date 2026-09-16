#!/usr/bin/env python3
"""Prepare a signed QA GitHub release; never upload, install, or start an update.

The QA-only private key stays outside the repository and release directory.
Existing package signatures and hashes are produced by the normal release tools.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parents[3]


def run(*args):
    return subprocess.check_output([str(arg) for arg in args], text=True).strip()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--deb', type=Path, required=True)
    parser.add_argument('--client-tools', type=Path, required=True)
    parser.add_argument('--tag', required=True)
    parser.add_argument('--minimum-version', required=True)
    parser.add_argument('--maximum-version', required=True)
    parser.add_argument('--key-directory', type=Path, required=True)
    parser.add_argument('--create-qa-key', action='store_true')
    args = parser.parse_args()
    os.umask(0o077)
    key_dir = args.key_directory.resolve()
    if key_dir.is_relative_to(ROOT) or not re.fullmatch(r'v[0-9.]+-qa\.[0-9]+', args.tag):
        parser.error('Use an external QA key directory and a versioned QA tag')
    version = run('dpkg-deb', '-f', args.deb, 'Version')
    if args.tag != f'v{version}-qa.{args.tag.rsplit(".", 1)[-1]}':
        parser.error('Tag core must match the actual Debian version')
    key_dir.mkdir(mode=0o700, parents=True, exist_ok=True)
    if key_dir.stat().st_mode & 0o077:
        parser.error('QA key directory must have mode 0700')
    key = key_dir / 'qa-release-private.pem'
    if not key.exists():
        if not args.create_qa_key:
            parser.error('No retained QA key; explicitly use --create-qa-key for first preparation')
        subprocess.run(['openssl', 'genpkey', '-algorithm', 'Ed25519', '-out', str(key)], check=True)
        key.chmod(0o600)
    if key.is_symlink() or key.stat().st_mode & 0o077:
        parser.error('QA private key must be a regular protected file')
    output = args.deb.resolve().parent
    run('bash', ROOT / 'packaging/release/sign-release-artifacts.sh',
        '--private-key', key, '--deb', args.deb.resolve(),
        '--client-tools', args.client_tools.resolve(), '--channel', 'qa', '--output-dir', output)
    package_manifest = json.loads((output / f'myscoutee-release_{version}.json').read_text())
    artifact = next(item for item in package_manifest['artifacts'] if item['purpose'] == 'debian-package')
    public_key = output / 'qa-release-public.pem'
    run('openssl', 'pkey', '-in', key, '-pubout', '-out', public_key)
    public_der = subprocess.check_output(['openssl', 'pkey', '-pubin', '-in', str(public_key), '-outform', 'DER'])
    manifest = {
        'manifest_version': '1', 'release_version': version, 'channel': 'qa',
        'published_at': datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'),
        'minimum_compatible_version': args.minimum_version,
        'maximum_compatible_version': args.maximum_version,
        'artifact_url': f'https://github.com/fssrepository/myscoutee/releases/download/{args.tag}/{artifact["filename"]}',
        'artifact_size_bytes': artifact['sizeBytes'], 'artifact_sha256': artifact['sha256'],
        'package_signing_key_id': package_manifest['signingKeyId'],
        'package_signature': artifact['signature'],
        'release_notes_url': f'https://github.com/fssrepository/myscoutee/releases/tag/{args.tag}',
        'backup_required': True, 'expected_downtime_seconds': 300, 'status': 'AVAILABLE',
        'supersedes_version': args.maximum_version if version != args.maximum_version else '', 'superseded_by_version': '', 'revocation_reason': ''
    }
    source = output / 'update-manifest.source.json'
    source.write_text(json.dumps(manifest, indent=2) + '\n')
    run('python3', ROOT / 'packaging/release/sign-update-manifest.py', '--private-key', key,
        '--manifest', source, '--output', output / 'myscoutee-update.json')
    fingerprint = 'sha256:' + hashlib.sha256(public_der).hexdigest()
    record = {'purpose': 'QA only; not a production vendor trust root', 'tag': args.tag,
              'version': version, 'artifactSha256': artifact['sha256'],
              'trustedPublicKeySpkiSha256': fingerprint,
              'upload': [artifact['filename'], args.client_tools.name, f'myscoutee-release_{version}.json',
                         'myscoutee-update.json'], 'privateKeyPublished': False}
    (output / 'QA-RELEASE.json').write_text(json.dumps(record, indent=2) + '\n')
    public_key.chmod(0o644)
    print(json.dumps(record, indent=2))


if __name__ == '__main__':
    main()
