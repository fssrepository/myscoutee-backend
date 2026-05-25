ARG NGINX_BASE_IMAGE
FROM ${NGINX_BASE_IMAGE}

ARG TZ=Europe/Brussels
ENV TZ=${TZ}

RUN apk add --no-cache dcron nano curl inotify-tools openssl tzdata &&\
    ln -snf /usr/share/zoneinfo/${TZ} /etc/localtime &&\
    echo "${TZ}" > /etc/timezone

COPY images/nginx/dev/nginx-entrypoint.sh /scripts/nginx-entrypoint.sh
RUN chmod +x /scripts/nginx-entrypoint.sh

CMD ["bash", "-c", "/scripts/nginx-entrypoint.sh"]
