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
* Production nginx image: `docker build -f ./server/docker/images/nginx/prod/Dockerfile --build-arg NGINX_BASE_IMAGE=myscoutee-nginx:${MYSCOUTEE_VERSION}-base -t myscoutee-nginx:${MYSCOUTEE_VERSION} ./server/docker`
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
* Prod one-time sync (from frontend docs build):
* `./server/docker/scripts/sync_frontend_assets.sh prod`

Production Compose
------------------
* Build frontend production assets in the frontend submodule:
* `cd frontend && npm run build:prod:http`
* Sync assets into backend nginx app folder:
* `cd .. && ./server/docker/scripts/sync_frontend_assets.sh prod`
* Run dockerized production stack:
* `cd server && docker compose -f docker-compose-prod.yml up --build`

Full Integration E2E Collections
--------------------------------
* Postman-like server/API and UI collections live under `./e2e`.
* Safe contract checks against the normal dev stack: `node e2e/server/run.mjs`
* Disposable mutation/stress checks use `e2e_db`: `cd server && docker compose -f docker-compose.yml -f docker-compose.e2e.yml up --build`
* Details: `./e2e/README.md`
