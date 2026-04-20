FROM eclipse-temurin:25.0.2_10-jre-alpine

EXPOSE 8080

RUN mkdir /app

COPY build/libs/*.jar /app/spring-boot-application.jar

ENTRYPOINT ["java", "-XX:+UnlockExperimentalVMOptions","-Djava.security.egd=file:/dev/./urandom","-jar","/app/spring-boot-application.jar"]
