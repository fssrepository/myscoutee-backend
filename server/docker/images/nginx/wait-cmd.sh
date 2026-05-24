#! /bin/bash

# Configuration
DOMAIN=${DOMAIN:-myscoutee.com}
LETSENCRYPT_ENABLED=${LETSENCRYPT_ENABLED:-false}

echo "Starting Nginx with LETSENCRYPT_ENABLED=$LETSENCRYPT_ENABLED for DOMAIN=$DOMAIN"

ensure_default_certificate() {
    local cert_path="/etc/nginx/keys/nginx.crt"
    local key_path="/etc/nginx/keys/nginx-nopass.key"

    if [ -f "$cert_path" ] && [ -f "$key_path" ]; then
        return
    fi

    mkdir -p /etc/nginx/keys
    openssl req -x509 -nodes -newkey rsa:2048 \
        -keyout "$key_path" \
        -out "$cert_path" \
        -days 365 \
        -subj "/CN=localhost" >/dev/null 2>&1
    chmod 600 "$key_path"
}

ensure_default_certificate

# Replace ${DOMAIN} in all config files
find /etc/nginx/conf.d -type f -name "*.conf" -exec sed -i "s/\${DOMAIN}/$DOMAIN/g" {} +

if [ "$LETSENCRYPT_ENABLED" = "true" ]; then
    echo "Configuring Let's Encrypt..."
    
    if [ ! -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
        echo "Certificates not found. Obtaining from Let's Encrypt..."
        
        # We need Nginx running for certbot --nginx to work
        # At this point, LE SSL block is still commented out, so Nginx will start fine with Default SSL
        nginx -g 'daemon on;'
        
        # Run certbot. Using --nginx as requested by user.
        certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m "admin@$DOMAIN"
        
        nginx -s stop
        sleep 2
    fi

    # Now that we have certs (either just obtained or existing), enable LE SSL config
    # Enable LE SSL block and disable Default SSL block
    find /etc/nginx/conf.d -type f -name "*.conf" -exec sed -i '/#SSL_LE_START/,/#SSL_LE_END/ s/^#//' {} +
    find /etc/nginx/conf.d -type f -name "*.conf" -exec sed -i '/#SSL_DEFAULT_START/,/#SSL_DEFAULT_END/ { /^#/! s/^/#/ }' {} +

    # Add cron job for renewal
    echo "0 0 * * * certbot renew --quiet" > /etc/cron.d/certbot-renew
    chmod 0644 /etc/cron.d/certbot-renew
    service cron start
else
    echo "Using default/localhost configuration."
    find /etc/nginx/conf.d -type f -name "*.conf" -exec sed -i "s/$DOMAIN/localhost/g" {} +
fi

# Background reload loop
while true; do
    inotifywait -qq -r -e modify,create,delete /etc/nginx >/dev/null 2>&1
    nginx -s reload
done &

if [[ -z "$WAIT_FOR" ]]; then 
    nginx -g 'daemon off;'; 
else 
    /scripts/wait-for-it.sh -t 0 $WAIT_FOR -- nginx -g 'daemon off;';
fi
