FROM openjdk:17-alpine
ARG JAR_FILE=/build/libs/bacation-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} app.jar
COPY src/main/resources/application.properties /config/application.properties
ENTRYPOINT ["java","-jar","/app.jar"]