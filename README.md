* Swiping (e.g.: Tinder) or traditional dating websites are very exhausting and non-fair. Intead of swipes you can rate/prioritise people 1-10 to decide, who you would like to meet first. You can rate for pairs also to help others.
* Based on mutual priority each person is being assigned to a group chat, where the participants can decide how they would like to meet with each other. (graph algorithm) They can organise event for themselves or just choose from a promoted/organised one.
* If you have met someone already, you can invite him/her to an event based on mutual priorities too. (organise or choose from promoted ones) Multi-stage/multi-slot events are also possible. (e.g.: FIFA like competition)
* Mutual priorities can be changed at any moment, hence the social graph can be improved. (similar to AI reinforced training)
* Group dating allows to shift business model towards affiliate systems (e.g.: Booking.com) from subscription.
* The algorithm can be used even on job site. (rate on jobs or ideas etc.)

Contribution:
-------------
* MVP readiness with some issues - just notify me about your website that my effort is not wasted.
* Transformed kotlin -> java, mysql/neo4j -> mongodb and ionic -> pwa to speed up the development.

Boot Up:
-------
* You need to have a firebase project and configure it properly in the repo. (cloud messaging + web app)
* cd ./server
* ./docker/scripts/bootstrap_mongodb_seed.sh
* gradle build -x test
* docker compose build --no-cache
* docker compose up
* frontend changes rebuild automatically through frontend-sync and are served on http://localhost

Dependencies
------------
* `export MYSCOUTEE_VERSION=1.0.0`
* Base nginx image: `docker build -f ./server/docker/images/nginx/base/Dockerfile -t myscoutee-nginx:${MYSCOUTEE_VERSION}-base ./server/docker`
* Dev nginx image: `docker build -f ./server/docker/images/nginx/dev/Dockerfile --build-arg NGINX_BASE_IMAGE=myscoutee-nginx:${MYSCOUTEE_VERSION}-base -t myscoutee-nginx:${MYSCOUTEE_VERSION}-dev ./server/docker`
* Production nginx image: `cd frontend && npm run build:prod && cd .. && docker build --build-context frontend-prod=./frontend/prod -f ./server/docker/images/nginx/prod/Dockerfile --build-arg NGINX_BASE_IMAGE=myscoutee-nginx:${MYSCOUTEE_VERSION}-base -t myscoutee-nginx:${MYSCOUTEE_VERSION}-prod ./server/docker`
* Dev backend image: `docker build -f ./server/docker/images/profilemanagement/dev/Dockerfile -t myscoutee-api:${MYSCOUTEE_VERSION}-dev ./server`
* Production backend image: `docker build -f ./server/docker/images/profilemanagement/prod/Dockerfile -t myscoutee-api:${MYSCOUTEE_VERSION} ./server`

Frontend Runtime Sync (optional)
--------------------------------
* `cd server && docker compose up` starts `frontend-sync` automatically and keeps watching continuously while Docker is alive (`frontend/dev` -> `server/docker/conf/nginx/app/myscoutee`)
* first run after pulling changes: `cd server && docker compose up --build`
* Dev one-time sync to nginx runtime folder:
* `./server/docker/scripts/sync_frontend_assets.sh dev`
* Dev auto-sync (watch mode):
* `./server/docker/scripts/sync_frontend_assets.sh dev watch`

Production Compose
------------------
* Standalone production compose uses the prebuilt `frontend/prod` folder as the nginx image build context.
* Build the frontend production bundle first:
* `(cd frontend && npm run build:prod)`
* Run standalone production compose:
* Before using operator-driven node initialization, create its dedicated host
  directories with owner-only permissions:
* `(cd server && install -d -m 0700 data/registry-keys data/registry)`
* `(cd server && docker compose -f docker-compose-prod.yml up --build)`
* Build standalone production images only:
* `(cd server && docker compose -f docker-compose-prod.yml build)`

Production Packaging
--------------------
* Build production artifacts/images for packaging:
* `bash packaging/scripts/build-production.sh`
* Run the packaged-style production stack:
* `bash packaging/scripts/start-production.sh`

Full Integration E2E Collections
--------------------------------
* Postman-like server/API and UI collections live under `./e2e`.
* Safe contract checks against the normal dev stack: `node e2e/server/run.mjs`
* Disposable mutation/stress checks use `e2e_db`: `cd server && docker compose -f docker-compose-dev.yml -f docker-compose.e2e.yml up --build`
* Details: `./e2e/README.md`

Local Signed Registry
---------------------
The canonical development stack includes the real Go registry sandbox. Keep
the `myscoutee-registry` repository beside this repository, then start the
normal stack:

```bash
cd server
docker compose up --build
```

The landing Explore popup can select `Operator`, then the seeded
`Demo Operator`. Frontend assets still rebuild through `frontend-sync`; the
application data comes from Mongo `demo_db`; and Operator registry actions use
the live local Go service. Node initialization and registration happen only
when the Operator performs those UI actions. Starting Compose does not create a
Java node identity or silently enroll it.

The three demo stores are deliberately separate:

- application demo data: `server/data/mongodb/demo-data-v8-0` (`demo_db`)
- registry SQLite and registry signing identity:
  `myscoutee-registry-dev-demo-data-v1` Docker volume
- demo deployment identity and verified client state:
  `server/data/registry-demo-keys` and
  `server/data/registry-demo-state`

The registry health endpoint is
`http://127.0.0.1:${LOCAL_REGISTRY_PORT:-8081}/healthz`. The default signed
scope is the generic `demo:local-registry`; set
`REGISTRY_DEMO_CANDIDATE_SCOPE` before `docker compose up` to exercise another
explicit scope. No geography or parent is built in.

Plain HTTP is enabled only for the exact Compose hostname `registry` in this
development sandbox. A production Explore session uses sample Operator state
and performs no registry network, key, or ledger mutation. An authenticated
production Operator uses the independently deployed registry's HTTPS endpoint;
that central Go deployment has its own nginx/TLS configuration and is not
bundled into the MyScoutee production stack.
