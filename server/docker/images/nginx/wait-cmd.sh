#! /bin/bash

while true; do
    inotifywait -qq -r -e modify,create,delete /etc/nginx >/dev/null 2>&1
    nginx -s reload
done &

if [[ -z "$WAIT_FOR" ]]; then 
    nginx -g 'daemon off;'; 
else 
    /scripts/wait-for-it.sh -t 0 $WAIT_FOR -- nginx -g 'daemon off;';
fi
