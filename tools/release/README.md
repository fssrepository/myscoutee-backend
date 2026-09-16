# Prepare signed historical QA releases

These checkout-only tools prepare existing GitHub artifacts for QA. They do not
upload releases, move Git tags, install packages, build application images, or
touch the development nginx frontend output.

## Reversion the downloaded artifacts

Retain the original downloads. Obtain their SHA-256 values from the intended
GitHub release assets and verify the download before preparing a separate output:

```bash
python3 tools/release/reversion-qa-artifacts.py \
  --deb /downloads/qa1/myscoutee_1.0.0_amd64.deb \
  --deb-sha256 <original-deb-sha256> \
  --client-tools /downloads/qa1/myscoutee-client-tools_1.0.0.tar.gz \
  --client-tools-sha256 <original-client-tools-sha256> \
  --version 1.0.0-qa.1 \
  --output-dir packaging/dist/prepared/v1.0.0-qa.1
```

Repeat with the QA2 inputs and `1.0.0-qa.2`. Existing output directories are
rejected. The tool records the original and resulting hashes in `REVERSION.json`.

The Debian control version uses `1.0.0~qa.1`; release metadata, filenames,
packaged VERSION and image tags use `1.0.0-qa.1`. Thus Debian orders QA1 before
QA2 before stable `1.0.0`. Image config and layer bytes remain identical and
are checked after retagging. The packaged environment and image manifest agree
with the new tags. The historical post-install, startup, host qualifier and client installer
version guards are broadened to accept the QA form; the client signature verifier
is replaced with the current prerelease-aware verifier.

**This does not backport application fixes.** The original Java/frontend images
retain their original build identity and behavior, including old update
limitations. Historical frontend `app-version.json` remains original build
provenance. Signed/reversioned artifacts do not prove that the baseline supports
Registry-independent updates, QA prereleases in its worker, or UI rollback.
Qualify those separately before using them for an update lifecycle PASS.

## Sign and verify

Use one retained Ed25519 QA key for both releases. It must remain outside the
repository and outside any release/upload directory. The directory must have
mode 0700 and its private key mode 0600. First use explicitly creates the key:

```bash
python3 tools/release/sign-qa-release.py \
  --deb packaging/dist/prepared/v1.0.0-qa.1/myscoutee_1.0.0-qa.1_amd64.deb \
  --client-tools packaging/dist/prepared/v1.0.0-qa.1/myscoutee-client-tools_1.0.0-qa.1.tar.gz \
  --tag v1.0.0-qa.1 \
  --minimum-version 1.0.0-qa.1 --maximum-version 1.0.0-qa.1 \
  --key-directory "$HOME/.local/share/myscoutee/release-signing/qa" \
  --create-qa-key
```

For QA2, use its files/tag and retain the compatibility range QA1–QA1 for the
intended forward upgrade. Omit `--create-qa-key` to require the existing key.
Compatibility bounds are signed declarations, not proof of runtime compatibility.

The script reuses `packaging/release/sign-release-artifacts.sh` and
`packaging/release/sign-update-manifest.py`, then verifies both artifact
signatures, sizes/hashes and the full update manifest signature. It writes fresh
`.sha256` files. `QA-RELEASE.json` lists the exact six upload assets and the public
SPKI fingerprint. The private key is never copied into the output. Back it up
securely; existing QA installations need the same trusted key for later updates.

The public key is a **QA trust root**, not an existing production vendor key.
Provision its independently checked fingerprint on the QA target. A public key
downloaded beside a package is not independently trusted merely because the
package was downloaded from the same release.

## Publish boundary

Review the matching package, client tools, checksums and both signed manifests
together. Keep the original release assets before replacement. Publish only the
`upload` list in `QA-RELEASE.json`; local evidence/source metadata is not an upload
manifest. Do not move the Git tag merely to replace release assets. Mutable
releases and suitable GitHub write access are required; these scripts do not
establish those permissions or perform publication.

## Tests

```bash
bash packaging/tests/release-signing-test.sh
python3 tools/release/test_qa_release.py
```

The disposable artifact test covers reversion, preserved image payloads, version
ordering, checksum mismatch rejection, output overwrite rejection, complete
signing/verification, and rejection of a tampered DEB. It needs no Docker or VM.
