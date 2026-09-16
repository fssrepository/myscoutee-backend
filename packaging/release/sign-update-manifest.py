#!/usr/bin/env python3
"""Sign standalone update metadata for the mysccoutee-update.json GitHub asset.

The input uses the existing update_manifest fields (snake_case). Package
version/channel/size/hash/signature must match sign-release-artifacts.sh output.
The existing release key is supplied explicitly; no key is generated or copied.
"""
import argparse
import base64
import json
import os
from pathlib import Path
import subprocess
import tempfile


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--private-key', type=Path, required=True)
    parser.add_argument('--manifest', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    if args.output.exists():
        parser.error('Output already exists; refusing to replace published metadata')
    if args.private_key.is_symlink() or not args.private_key.is_file():
        parser.error('The existing signing key must be a regular file')
    manifest = args.manifest.read_bytes()
    if len(manifest) > 128 * 1024:
        parser.error('Update manifest is too large')
    document = json.loads(manifest)
    if document.get('manifest_version') != '1' or document.get('backup_required') is not True:
        parser.error('Expected update manifest v1 with a required backup')
    os.umask(0o077)
    with tempfile.TemporaryDirectory(prefix='myscoutee-update-sign-') as directory:
        work = Path(directory)
        message = work / 'message'
        message.write_bytes(b'myscoutee-update-catalog-v1\n' + manifest)
        signature = subprocess.check_output([
            'openssl', 'pkeyutl', '-sign', '-inkey', str(args.private_key),
            '-passin', 'pass:', '-rawin', '-in', str(message)])
        if len(signature) != 64:
            parser.error('Expected a 64-byte Ed25519 signature')
        envelope = {'schemaVersion': 1, 'manifestBase64': base64.b64encode(manifest).decode(),
                    'signature': base64.b64encode(signature).decode()}
        with args.output.open('x') as target:
            json.dump(envelope, target, indent=2)
            target.write('\n')
    args.output.chmod(0o644)


if __name__ == '__main__':
    main()
