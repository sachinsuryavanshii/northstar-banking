# One Dockerfile for every module:  docker build --build-arg MODULE=account-service .
FROM maven:3.9-eclipse-temurin-17 AS build
ARG MODULE
WORKDIR /app
COPY . .
RUN mvn -q -pl ${MODULE} -am package -DskipTests

FROM eclipse-temurin:17-jre
ARG MODULE
WORKDIR /app
COPY --from=build /app/${MODULE}/target/*.jar app.jar
ENTRYPOINT ["java","-jar","app.jar"]
