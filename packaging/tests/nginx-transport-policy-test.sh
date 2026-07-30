#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/../.." && pwd)"
NGINX_ROOT="${REPO_ROOT}/server/docker"
BASE_IMAGE="${NGINX_TEST_BASE_IMAGE:-myscoutee-nginx:1.0.0-base}"
TEST_ROOT="$(mktemp -d)"
RUNNING_CONTAINERS=()

fail() {
  echo "FAIL: $1" >&2
  exit 1
}

cleanup() {
  local container

  for container in "${RUNNING_CONTAINERS[@]}"; do
    docker rm -f "${container}" >/dev/null 2>&1 || true
  done
  rm -rf "${TEST_ROOT}"
}
trap cleanup EXIT

for command_name in curl docker openssl; do
  command -v "${command_name}" >/dev/null 2>&1 \
    || fail "${command_name} is required"
done
docker image inspect "${BASE_IMAGE}" >/dev/null 2>&1 \
  || fail "local Nginx base image is missing: ${BASE_IMAGE}"

ENTRYPOINT="${NGINX_ROOT}/images/nginx/prod/nginx-entrypoint.sh"
DOCKERFILE="${NGINX_ROOT}/images/nginx/prod/Dockerfile"
SPRING_TEMPLATE="${NGINX_ROOT}/conf/nginx/conf/http/spring.conf"
PROD_HTTP_POLICY="${NGINX_ROOT}/conf/nginx/conf/http/http-transport-policy.prod.conf"
PROD_HTTPS_POLICY="${NGINX_ROOT}/conf/nginx/conf/http/https-response-policy.prod.conf"
DEV_HTTP_POLICY="${NGINX_ROOT}/conf/nginx/conf/http/http-transport-policy.conf"
DEV_HTTPS_POLICY="${NGINX_ROOT}/conf/nginx/conf/http/https-response-policy.conf"

grep -Fq 'COPY --chmod=0755 images/nginx/prod/nginx-entrypoint.sh' "${DOCKERFILE}" \
  || fail "production image does not install its TLS-aware entrypoint"
grep -Fq 'CMD ["/scripts/nginx-production-entrypoint.sh"]' "${DOCKERFILE}" \
  || fail "production image does not execute its TLS-aware entrypoint"

mkdir -p \
  "${TEST_ROOT}/keys" \
  "${TEST_ROOT}/letsencrypt/live/transport.test" \
  "${TEST_ROOT}/acme/.well-known/acme-challenge" \
  "${TEST_ROOT}/html/assets" \
  "${TEST_ROOT}/stream"

openssl req -x509 -nodes -newkey rsa:2048 \
  -keyout "${TEST_ROOT}/keys/custom.key" \
  -out "${TEST_ROOT}/keys/custom.crt" \
  -days 1 \
  -subj "/CN=transport.test" >/dev/null 2>&1
cp "${TEST_ROOT}/keys/custom.crt" \
  "${TEST_ROOT}/letsencrypt/live/transport.test/fullchain.pem"
cp "${TEST_ROOT}/keys/custom.key" \
  "${TEST_ROOT}/letsencrypt/live/transport.test/privkey.pem"
printf 'console.log("transport-policy");\n' > "${TEST_ROOT}/html/app-TRANSPORT.js"
printf 'transport-policy\n' > "${TEST_ROOT}/html/index.html"
printf 'acme-token\n' \
  > "${TEST_ROOT}/acme/.well-known/acme-challenge/test-token"
cp "${NGINX_ROOT}/conf/nginx/conf/stream/mongodb.conf" \
  "${TEST_ROOT}/stream/mongodb.conf"

docker_args() {
  local config_dir="$1"

  printf '%s\n' \
    --add-host profilemanagement:127.0.0.1 \
    --add-host mongodb:127.0.0.1 \
    -e DOMAIN=transport.test \
    -v "${NGINX_ROOT}/conf/nginx/nginx.conf:/etc/nginx/nginx.conf:ro" \
    -v "${SPRING_TEMPLATE}:/etc/nginx/myscoutee-templates/spring.conf:ro" \
    -v "${ENTRYPOINT}:/scripts/nginx-production-entrypoint.sh:ro" \
    -v "${config_dir}:/etc/nginx/conf.d" \
    -v "${TEST_ROOT}/stream:/etc/nginx/stream_conf.d:ro" \
    -v "${TEST_ROOT}/html:/usr/share/nginx/html:ro" \
    -v "${TEST_ROOT}/keys:/etc/nginx/keys:ro" \
    -v "${TEST_ROOT}/letsencrypt:/etc/letsencrypt:ro" \
    -v "${TEST_ROOT}/acme:/var/www/certbot:ro"
}

prepare_config_dir() {
  local name="$1"
  local http_policy="$2"
  local https_policy="$3"
  local config_dir="${TEST_ROOT}/${name}-conf"

  mkdir -p "${config_dir}"
  cp "${NGINX_ROOT}/conf/nginx/conf/http/routing.conf" \
    "${config_dir}/routing.conf"
  cp "${http_policy}" "${config_dir}/http-transport-policy.conf"
  cp "${https_policy}" "${config_dir}/https-response-policy.conf"
  printf '%s' "${config_dir}"
}

start_nginx() {
  local name="$1"
  local http_policy="$2"
  local https_policy="$3"
  local config_dir container http_binding https_binding
  local -a args=()

  config_dir="$(prepare_config_dir "${name}" "${http_policy}" "${https_policy}")"
  container="myscoutee-nginx-${name}-$$"
  mapfile -t args < <(docker_args "${config_dir}")
  RUNNING_CONTAINERS+=("${container}")

  docker run --rm -d \
    --name "${container}" \
    -p 127.0.0.1::80 \
    -p 127.0.0.1::443 \
    "${args[@]}" \
    -e LETSENCRYPT_ENABLED=false \
    -e NGINX_TLS_CERTIFICATE_PATH=/etc/nginx/keys/custom.crt \
    -e NGINX_TLS_CERTIFICATE_KEY_PATH=/etc/nginx/keys/custom.key \
    "${BASE_IMAGE}" \
    bash /scripts/nginx-production-entrypoint.sh >/dev/null

  http_binding="$(docker port "${container}" 80/tcp)"
  https_binding="$(docker port "${container}" 443/tcp)"
  STARTED_CONTAINER="${container}"
  STARTED_HTTP_PORT="${http_binding##*:}"
  STARTED_HTTPS_PORT="${https_binding##*:}"
  STARTED_CONFIG_DIR="${config_dir}"
}

wait_for_health() {
  local port="$1"
  local attempt

  for attempt in {1..50}; do
    if [[ "$(curl -sS -o /dev/null -w '%{http_code}' \
      "http://127.0.0.1:${port}/nginx-health" 2>/dev/null || true)" == "200" ]]; then
      return 0
    fi
    sleep 0.1
  done
  fail "isolated Nginx did not become healthy"
}

assert_header() {
  local headers="$1"
  local expected="$2"

  grep -Eiq "${expected}" "${headers}" \
    || fail "expected response header was missing: ${expected}"
}

assert_no_header() {
  local headers="$1"
  local unexpected="$2"

  if grep -Eiq "${unexpected}" "${headers}"; then
    fail "unexpected response header was present: ${unexpected}"
  fi
}

start_nginx prod "${PROD_HTTP_POLICY}" "${PROD_HTTPS_POLICY}"
prod_container="${STARTED_CONTAINER}"
prod_http_port="${STARTED_HTTP_PORT}"
prod_https_port="${STARTED_HTTPS_PORT}"
prod_config_dir="${STARTED_CONFIG_DIR}"
wait_for_health "${prod_http_port}"

[[ "$(curl -sS "http://127.0.0.1:${prod_http_port}/nginx-health")" == "UP" ]] \
  || fail "production health endpoint is not available over HTTP"
[[ "$(curl -sS "http://127.0.0.1:${prod_http_port}/.well-known/acme-challenge/test-token")" == "acme-token" ]] \
  || fail "production ACME challenge path is redirected or unavailable"

prod_redirect_headers="${TEST_ROOT}/prod-redirect.headers"
prod_redirect_status="$(curl -sS -o /dev/null -D "${prod_redirect_headers}" \
  -H 'Host: transport.test' -w '%{http_code}' \
  "http://127.0.0.1:${prod_http_port}/api/auth/me")"
[[ "${prod_redirect_status}" == "308" ]] \
  || fail "production application HTTP request was not redirected"
assert_header "${prod_redirect_headers}" '^Location: https://transport\.test/api/auth/me'

prod_forged_host_headers="${TEST_ROOT}/prod-forged-host.headers"
prod_forged_host_status="$(curl -sS -o /dev/null -D "${prod_forged_host_headers}" \
  -H 'Host: forged-host.invalid' -w '%{http_code}' \
  "http://127.0.0.1:${prod_http_port}/api/auth/me")"
[[ "${prod_forged_host_status}" == "308" ]] \
  || fail "production request with a forged Host header was not safely redirected"
assert_header "${prod_forged_host_headers}" '^Location: https://transport\.test/api/auth/me'
assert_no_header "${prod_forged_host_headers}" '^Location: https://forged-host\.invalid'

prod_asset_headers="${TEST_ROOT}/prod-asset.headers"
curl -skS -o /dev/null -D "${prod_asset_headers}" \
  -H 'Host: transport.test' \
  "https://127.0.0.1:${prod_https_port}/app-TRANSPORT.js"
assert_header "${prod_asset_headers}" '^Strict-Transport-Security: max-age=31536000'
assert_header "${prod_asset_headers}" '^Cache-Control: public, max-age=31536000, immutable'

prod_root_headers="${TEST_ROOT}/prod-root.headers"
curl -skS -o /dev/null -D "${prod_root_headers}" \
  -H 'Host: transport.test' \
  "https://127.0.0.1:${prod_https_port}/"
assert_header "${prod_root_headers}" '^Strict-Transport-Security: max-age=31536000'

grep -Fq 'server_name transport.test;' "${prod_config_dir}/spring.conf" \
  || fail "DOMAIN was not rendered into production Nginx"
grep -Fq 'ssl_certificate /etc/nginx/keys/custom.crt;' "${prod_config_dir}/spring.conf" \
  || fail "operator-managed certificate path was not selected"
grep -Fq 'ssl_certificate_key /etc/nginx/keys/custom.key;' "${prod_config_dir}/spring.conf" \
  || fail "operator-managed private-key path was not selected"

start_nginx dev "${DEV_HTTP_POLICY}" "${DEV_HTTPS_POLICY}"
dev_container="${STARTED_CONTAINER}"
dev_http_port="${STARTED_HTTP_PORT}"
dev_https_port="${STARTED_HTTPS_PORT}"
dev_config_dir="${STARTED_CONFIG_DIR}"
wait_for_health "${dev_http_port}"

dev_http_headers="${TEST_ROOT}/dev-http.headers"
dev_http_status="$(curl -sS -o /dev/null -D "${dev_http_headers}" \
  -H 'Host: transport.test' -w '%{http_code}' \
  "http://127.0.0.1:${dev_http_port}/app-TRANSPORT.js")"
[[ "${dev_http_status}" == "200" ]] \
  || fail "development policy unexpectedly redirected HTTP"
assert_no_header "${dev_http_headers}" '^Strict-Transport-Security:'

dev_https_headers="${TEST_ROOT}/dev-https.headers"
curl -skS -o /dev/null -D "${dev_https_headers}" \
  -H 'Host: transport.test' \
  "https://127.0.0.1:${dev_https_port}/app-TRANSPORT.js"
assert_no_header "${dev_https_headers}" '^Strict-Transport-Security:'
assert_header "${dev_https_headers}" '^Cache-Control: public, max-age=31536000, immutable'

le_config_dir="$(prepare_config_dir letsencrypt "${PROD_HTTP_POLICY}" "${PROD_HTTPS_POLICY}")"
mapfile -t le_args < <(docker_args "${le_config_dir}")
docker run --rm \
  "${le_args[@]}" \
  -e LETSENCRYPT_ENABLED=true \
  -e NGINX_CONFIG_TEST_ONLY=true \
  "${BASE_IMAGE}" \
  bash /scripts/nginx-production-entrypoint.sh >/dev/null

grep -Fq \
  'ssl_certificate /etc/letsencrypt/live/transport.test/fullchain.pem;' \
  "${le_config_dir}/spring.conf" \
  || fail "LETSENCRYPT_ENABLED did not select the domain certificate"
grep -Fq \
  'ssl_certificate_key /etc/letsencrypt/live/transport.test/privkey.pem;' \
  "${le_config_dir}/spring.conf" \
  || fail "LETSENCRYPT_ENABLED did not select the domain private key"

echo "Nginx transport policy tests passed."
