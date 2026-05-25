ARG NGINX_BASE_IMAGE
FROM ${NGINX_BASE_IMAGE}

COPY conf/nginx/nginx.conf /etc/nginx/nginx.conf
COPY conf/nginx/conf/http /etc/nginx/conf.d
COPY conf/nginx/conf/stream /etc/nginx/stream_conf.d
COPY conf/nginx/app/myscoutee /usr/share/nginx/html
