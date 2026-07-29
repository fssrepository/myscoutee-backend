ARG NGINX_BASE_IMAGE=myscoutee-nginx:1.0.0-base
FROM ${NGINX_BASE_IMAGE}

COPY conf/nginx/nginx.conf /etc/nginx/nginx.conf
COPY conf/nginx/conf/http/spring.conf /etc/nginx/myscoutee-templates/spring.conf
COPY conf/nginx/conf/http/routing.conf /etc/nginx/conf.d/routing.conf
COPY conf/nginx/conf/http/http-transport-policy.prod.conf /etc/nginx/conf.d/http-transport-policy.conf
COPY conf/nginx/conf/http/https-response-policy.prod.conf /etc/nginx/conf.d/https-response-policy.conf
COPY conf/nginx/conf/stream/mongodb.conf /etc/nginx/stream_conf.d/mongodb.conf
COPY --chmod=0755 images/nginx/prod/nginx-entrypoint.sh /scripts/nginx-production-entrypoint.sh
COPY --from=frontend-prod . /usr/share/nginx/html

CMD ["/scripts/nginx-production-entrypoint.sh"]
