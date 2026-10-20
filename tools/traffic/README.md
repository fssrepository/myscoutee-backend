# Access-log journey inference — MSC-124

`analyze-access-log.py` reads the existing nginx combined access log and emits a
Hungarian timeline of **observed requests**, **probable actions**, and **possible
surface loads**. It adds no application telemetry and performs no browser actions.
It does not identify people or prove clicks, rendering, reading or authentication
outcomes from HTTP status alone.

## Run against Netcup

From the repository root, with the existing stamped assets for the observed build:

```sh
python3 tools/traffic/analyze-access-log.py --netcup \
  --since 2026-10-20T05:03:00Z --assets frontend/prod
```

This runs the analyzer locally against Netcup's live nginx logs. Its only remote
command is `docker logs --timestamps --since … --tail … nginx`. It installs
nothing, changes no production data/configuration and creates no login session.
Remote input uses the existing gitignored
`packaging/client-tools/netcup.local.env` (`SSH_*` keys), checks its private file
permissions and verifies the saved SHA256 host fingerprint before password
authentication. Paramiko must already be installed for this option; no dependency
is needed for offline input. The release transport's `REMOTE_*`/OpenSSH
`known_hosts` interface does not consume this retained fingerprint configuration.

Use `--client 35cc0a --client 34ba5d` to select previously reported IP hashes.
The default snapshot is limited to 50,000 lines over six hours; `--since` and
`--max-lines` control it. A limit warning means the snapshot may be incomplete.
The current container's logs cannot recover logs lost when it was replaced.

## Offline / machine-readable output

```sh
python3 tools/traffic/analyze-access-log.py \
  packaging/dist/traffic-review-20261020/nginx.log --assets frontend/prod

python3 tools/traffic/analyze-access-log.py access.log.gz \
  --assets frontend/prod --format json

ssh root@your-host 'docker logs --timestamps --since 6h nginx 2>&1' |
  python3 tools/traffic/analyze-access-log.py - --assets frontend/prod
```

`--timezone` defaults to `Europe/Prague`; reports include the full date and local
time. `--gap-minutes` defaults to 30 minutes of inactivity. IP hashes are stable
six-character SHA256 prefixes, matching the earlier traffic review. They group
network addresses, not individual visitors. Full IPs, raw user agents, forwarded
addresses, arbitrary paths/query values, profile IDs and tokens are not emitted.
Raw input remains private. Do not commit raw logs or visitor timelines.

## How to interpret the result

The catalog reads the **existing** `app-version.json`, `index.html`, `app-sw.js`
and emitted JavaScript. It follows static imports to identify initial dependencies
and uses dynamic import targets and emitted Angular selectors to label possible
lazy surfaces. No build or source map is needed. The outermost compiled selector
is a heuristic label; a shared chunk does not establish an exact button. Unknown
chunk hashes receive no surface label; the catalog build ID is always reported.
Use assets from the deployed build, especially when examining historical logs.

The production worker precaches all build chunks, including lazy modules
(`frontend/scripts/stamp-prod-build.js`, `frontend/src/app-sw.js`). Bursts with at
least 20 different manifest resources within 45 seconds are marked as probable
precache. Module/HTML guesses within that burst (including a five-second lead-in
and two-second tail) are suppressed; API evidence is retained. This conservative
heuristic can also hide genuine early navigation. Isolated module loads remain
**possible**, since the log lacks request initiator/fetch-destination headers.

Instagram's service-worker requests may omit its Instagram suffix while retaining
the Android `wv` / `Version/4.0` UA. They are grouped with the same WebView engine,
not treated as external Chrome. A subsequent external-browser document request
on the same IP within five minutes is only a **possible** handoff: shared IPs and
IP changes prevent reliable identity matching. Cache-only handoffs can be absent.

The timeline and its coverage appendix explicitly distinguish these landing actions:

| Action | Existing evidence / limit |
| --- | --- |
| More article | `GET /api/landing/articles`: probable list opening/paging in HTTP mode; not proof of reading. |
| Individual article | `eagerDetail` is already in memory; no unique request is required. |
| About, Partners, Countries, Bug report | Local popup state in the loaded landing component; not observable. |
| Login button / Firebase popup | Popup code is in the entry chunk; configuration also loads at startup. Neither proves a Login click. |
| Session login | `POST /api/auth/session/login`: request and HTTP status observed; response body and provider are absent. |
| Explore / demo selector | `/api/auth/demo-users` is probable selector use; a lazy module alone is weaker. |
| Privacy / Terms / explanation | Content requests can occur automatically or from a cache; not an exact footer-button signal. |

Source owners: `entry-landing.component.ts` (`openIdeasPopup`,
`loadIdeaCardsPage`, footer popup handlers), `entry-page.component.html/.ts`,
`HttpIdeaPostsService.loadPublishedPostsPage`, `DemoBootstrapSelectorStore`,
`HttpUsersService`, `FirebaseAppService` and the existing production worker.
The nginx log only sees requests reaching this deployment. Direct Firebase/Google
traffic is outside it; this tool neither queries Firebase statistics nor claims
those statistics contain button events.

## Focused regression checks

```sh
python3 -m unittest discover -s tools/traffic -p 'test_*.py' -v
```

These use synthetic logs/assets only, including the observed Instagram/WebView
precache pattern, article API requests during precache, failed login requests,
unknown builds and report redaction. They start no server, watcher or browser.
