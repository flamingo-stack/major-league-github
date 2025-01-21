FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /workspace/app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src

RUN chmod +x mvnw
RUN ./mvnw install -DskipTests

FROM eclipse-temurin:21-jre-alpine
VOLUME /tmp
COPY --from=builder /workspace/app/target/*.jar app.jar
EXPOSE 8450
ENTRYPOINT ["java","-jar","/app.jar"] 