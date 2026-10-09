#!/usr/bin/env sh
# One bounded health sample per gateway, independent of the number of browsers.
set -eu
status_dir=${MYSCOUTEE_STATUS_DIR:-/tmp/myscoutee-status}
health_urls=${MYSCOUTEE_HEALTH_URLS:-http://profilemanagement:8080/health}
mkdir -p "$status_dir"
publish() {
    printf '{"ready":%s,"checkedAt":%s}\n' "$1" "$(date +%s)" > "$status_dir/status.tmp"
    mv "$status_dir/status.tmp" "$status_dir/status.json"
}
publish false
while :; do
    pids=''
    index=0
    for url in $health_urls; do
        index=$((index + 1))
        (
            if wget -q -T 1 -O "$status_dir/health-$index" "$url" 2>/dev/null \
                && jq -e 'type == "object" and .status == "UP"' "$status_dir/health-$index" >/dev/null 2>&1; then
                echo true > "$status_dir/result-$index"
            else
                echo false > "$status_dir/result-$index"
            fi
        ) &
        pids="$pids $!"
    done
    for pid in $pids; do wait "$pid"; done
    ready=true
    [ "$index" -gt 0 ] || ready=false
    while [ "$index" -gt 0 ]; do
        [ "$(cat "$status_dir/result-$index")" = true ] || ready=false
        index=$((index - 1))
    done
    publish "$ready"
    [ "${1:-}" != --once ] || exit 0
    sleep 2
done
