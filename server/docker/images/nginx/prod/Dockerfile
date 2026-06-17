ARG NGINX_BASE_IMAGE=myscoutee-nginx:1.0.0-base
FROM ${NGINX_BASE_IMAGE}

COPY conf/nginx/nginx.conf /etc/nginx/nginx.conf
COPY conf/nginx/conf/http/spring.conf /etc/nginx/conf.d/spring.conf
COPY conf/nginx/conf/http/routing.conf /etc/nginx/conf.d/routing.conf
COPY conf/nginx/conf/stream/mongodb.conf /etc/nginx/stream_conf.d/mongodb.conf
COPY --from=frontend-prod . /usr/share/nginx/html
