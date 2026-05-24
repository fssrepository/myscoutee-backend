This seed folder is for disposable e2e/stress playground runs.

The JSON files are symlinks to `../demo_db` so playground mode starts from the
same default static data without duplicating the large demo seed. Runtime writes
go to `playground_db` through `docker-compose.playground.yml`, not to `demo_db`.
