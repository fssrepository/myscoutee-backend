FROM eclipse-temurin:25.0.2_10-jre-alpine

EXPOSE 8080

RUN apk add --no-cache imagemagick libwebp-tools && \
    addgroup -S -g 10001 myscoutee && \
    adduser -S -D -H -u 10001 -G myscoutee myscoutee && \
    install -d -o myscoutee -g myscoutee /app && \
    install -d -m 0700 -o myscoutee -g myscoutee \
      /var/lib/myscoutee/registry-demo/keys \
      /var/lib/myscoutee/registry-demo/state && \
    install -d -o myscoutee -g myscoutee \
      /var/lib/myscoutee/update/staging \
      /var/lib/myscoutee/update/requests \
      /var/lib/myscoutee/update/jobs

COPY --chown=myscoutee:myscoutee *.jar /app/spring-boot-application.jar

USER 10001:10001

ENTRYPOINT ["java", "-XX:+UnlockExperimentalVMOptions", "-Djava.security.egd=file:/dev/./urandom", "-jar", "/app/spring-boot-application.jar"]
