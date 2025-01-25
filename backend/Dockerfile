FROM eclipse-temurin:21-jdk-alpine as build
WORKDIR /workspace/app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src

ARG PROFILE=web-service
RUN ./mvnw clean package -P${PROFILE} -DskipTests

FROM eclipse-temurin:21-jre-alpine
VOLUME /tmp
ARG PROFILE=web-service
ENV SPRING_PROFILES_ACTIVE=${PROFILE}
COPY --from=build /workspace/app/target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]