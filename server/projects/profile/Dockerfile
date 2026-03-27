FROM eclipse-temurin:17-jre-alpine

ARG TZ=Europe/Brussels
ENV TZ=${TZ}

RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/${TZ} /etc/localtime && \
    echo "${TZ}" > /etc/timezone

EXPOSE 8080

RUN mkdir /app

COPY build/libs/*.jar /app/spring-boot-application.jar

ENTRYPOINT ["java", "-XX:+UnlockExperimentalVMOptions","-Djava.security.egd=file:/dev/./urandom","-jar","/app/spring-boot-application.jar"]
