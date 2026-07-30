# Manual deployment integrity smoke

> **MANUAL ONLY — not an automated E2E or post-install test.**

This suite checks a freshly installed, already running deployment from the
outside. It is deliberately outside `e2e/` and `packaging/tests/`; no
installer, package hook, CI task, or aggregate test runner invokes it.

The runner is read-only. It sends unauthenticated `GET` and `HEAD` requests
only, does not start a stack, does not connect over SSH, and does not seed or
reset a database.

## Run

Node.js 20 or newer is recommended.

```bash
node smoke/deployment/run.mjs --url https://deployment.example
```

The URL can also be positional or supplied through the environment:

```bash
node smoke/deployment/run.mjs https://deployment.example

DEPLOYMENT_SMOKE_BASE_URL=https://deployment.example \
node smoke/deployment/run.mjs
```

For release qualification, also pin the expected Debian package version:

```bash
node smoke/deployment/run.mjs \
  --url https://deployment.example \
  --expected-version 1.2.3
```

Useful commands:

```bash
node smoke/deployment/run.mjs --list
node smoke/deployment/run.mjs --url https://deployment.example --case backend
node smoke/deployment/run.mjs --help
```

The target is mandatory for a real run. Without it the command exits
immediately, before any network operation.

## What it checks

- HTTP `/nginx-health` remains available and application traffic receives
  the production `308` HTTPS redirect;
- the supplied target completes a normally validated TLS handshake and HTTPS
  responses carry HSTS;
- Nginx serves the Angular shell, SPA deep links, PWA metadata, matching build
  metadata, every JS/CSS file referenced by `index.html`, and the complete
  service-worker core/build precache set (including lazy chunks and fonts);
- a missing hashed asset is a real `404`, not an HTML fallback;
- Spring reports `UP`, including its configured health contributors;
- public deployment configuration has the expected public-only shape and its
  same-origin logo is readable;
- the English i18n bundle and freshly packaged landing/privacy/terms/idea
  content can be read from MongoDB;
- anonymous callers cannot access the Operator configuration or managed-TLS
  configuration endpoints.

Independent checks run concurrently, have no retries, and use a five-second
request timeout by default. This keeps the result bounded to a few seconds
when a deployment is broken.

## TLS and non-standard ports

Certificate-chain, hostname, and expiration validation are never disabled.
For a private CA, use Node's standard trust extension:

```bash
NODE_EXTRA_CA_CERTS=/path/to/private-ca.pem \
node smoke/deployment/run.mjs --url https://deployment.example
```

The runner intentionally has no `--insecure` option and refuses to run when
`NODE_TLS_REJECT_UNAUTHORIZED=0`.

For a custom HTTPS port, provide the separate public HTTP listener if the
redirect and Nginx health exceptions should also be checked. It must use the
same hostname:

```bash
node smoke/deployment/run.mjs \
  --url https://deployment.example:8443 \
  --http-url http://deployment.example:8080
```

`--allow-http` exists only for an intentional local non-production target. It
permits the final application URL to remain HTTP and skips the production HTTP
redirect/health probes. If the target does finish on HTTPS, HSTS is still
checked.

## Scope boundary

This is an external black-box check. It cannot prove `dpkg`/systemd state,
filesystem permissions, bundled image IDs, or the health of an internal
container that has no public route. In particular, the Debian package's demo
registry is intentionally internal and is not invented as a public endpoint
here. The separately deployed Go registry keeps its own black-box E2E suite
in the registry repository.
