This directory is the host-mounted source for operator-managed Nginx TLS.

On Debian installation, `postinst` creates `nginx.crt` and
`nginx-nopass.key` only when no pair exists. That generated pair is
self-signed for `localhost`; it is suitable for local inspection, not public
production traffic. Container startup does not generate or replace it.

With `LETSENCRYPT_ENABLED=false`, production Nginx reads the paths configured
by `NGINX_TLS_CERTIFICATE_PATH` and `NGINX_TLS_CERTIFICATE_KEY_PATH` (the
defaults name the two files above). With `LETSENCRYPT_ENABLED=true`, it ignores
this directory and requires a pre-provisioned pair under
`/etc/letsencrypt/live/<DOMAIN>/`.

Do not commit private keys or real certificates in this directory. Install
deployment-specific files on the target host and keep the private key
root-readable only. See `packaging/README.md` for the exact first-certificate
and renewal procedure.
