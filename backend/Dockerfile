# Build stage
FROM maven:3.9.8-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and build jar (skipping unit tests for fast image builds)
COPY src ./src
RUN mvn clean package -DskipTests -B

# Runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create non-root user
RUN addgroup -S opsflow && adduser -S opsflow -G opsflow

# Copy built artifact
COPY --from=build /app/target/opsflow-backend-0.0.1-SNAPSHOT.jar app.jar
RUN chown opsflow:opsflow app.jar

USER opsflow

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "-Djava.security.egd=file:/dev/./urandom", "app.jar"]
