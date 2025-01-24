FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /workspace/app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src

RUN chmod +x mvnw
RUN ./mvnw -B -q clean package -Dmaven.test.skip=true -Dorg.slf4j.simpleLogger.log.org.apache.maven.cli.transfer.Slf4jMavenTransferListener=warn && \
    ls -la target/*.jar

FROM eclipse-temurin:21-jre-alpine
VOLUME /tmp
COPY --from=builder /workspace/app/target/*.jar app.jar
RUN ls -la /app.jar
EXPOSE 8450
ENTRYPOINT ["java","-jar","/app.jar"]