# Dev release source and independent operator list loading — 2026-09-23

User requested the existing local package-download simulator as a dev Compose
service, with configuration selecting the source and production unchanged.

- Added `release-simulator` to dev Compose using the existing
  `operator-update-release-server.py`. TLS/metadata/package verification remains
  on the normal implementation. API/download origin and trust-key paths are
  existing `OPERATOR_UPDATE_*` environment settings; no production configuration
  or Java release logic changed.
- New installations have an empty local catalog, with no fallback to GitHub.
  This workstation uses the retained `monitor-qa2-20260916-r8` package,
  version `1.0.0-qa.2`, in a portable copied catalog under ignored runtime data.
  Only fixture metadata was re-signed with its original external QA signing key;
  package bytes/signature are unchanged and the signing private key is not mounted.
- Local HTTPS full download PASS: 335128994 bytes;
  SHA-256 `29c404680876568dbd7d40fd4b85422acc8e59e4f2824feb24ff662eb4203444`.
- Backend `/operator/updates/releases` returned 200 for the local signed catalog;
  served artifact URL is on `https://release-simulator:18445`.
- Existing backend container was stopped before recreating that one service to
  apply environment settings; existing watcher/DevTools owns compilation. Backend
  ready at 15:21:29Z. Other pre-existing services were not restarted.
- Avatar/profile hydration now starts release checking independently. Initial
  workspace loading only awaits claim/community data; a shared in-flight release
  request is reused when Updates opens. Results from a changed session are ignored.
- Before: release API 3946ms; Registry status 29ms; share-list API 22ms, starting
  only after release completion. After: local release API 49ms, share-list API
  27ms. These are dev measurements, not production performance qualification.
- CDP response-hold regression PASS: while the release response was withheld,
  the share list and Configuration action were visible, no workspace spinner
  remained, and opening Updates reused the same single release request.
- Existing frontend watcher compiled successfully. Updated focused unit-test
  expectations; standalone unit runner not executed alongside the owner watcher.

The retained local version is older than the running dev version. This does not
assert a new-update badge or install/rollback PASS. Full package installation
continues to require the separate packaged QA guest.
