FROM mongo:8.2.5

ARG TZ=Europe/Brussels

RUN apt-get update && \
    apt-get install -y --no-install-recommends bash inotify-tools tzdata && \
    ln -snf "/usr/share/zoneinfo/${TZ}" /etc/localtime && \
    echo "${TZ}" > /etc/timezone && \
    rm -rf /var/lib/apt/lists/*
