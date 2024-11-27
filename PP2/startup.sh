#!/bin/bash

# Create a directory to store Docker image tar files
# IMAGE_DIR="docker_images"
# mkdir -p $IMAGE_DIR

# Pull Docker images
docker pull python:3.10
docker pull node:20
docker pull openjdk:20
docker pull gcc:12
docker pull lua:5.3
docker pull ruby:3.3
docker pull php:8.2-cli
docker pull rust:1.73
docker pull perl:5.36
# docker pull mcr.microsoft.com/dotnet/sdk:8.0

# Save Docker images to the specified directory
# docker save -o $IMAGE_DIR/python_3.10.tar python:3.10
# docker save -o $IMAGE_DIR/node_20.tar node:20
# docker save -o $IMAGE_DIR/openjdk_20.tar openjdk:20
# docker save -o $IMAGE_DIR/gcc_12.tar gcc:12
# docker save -o $IMAGE_DIR/dotnet_sdk_8.0.tar mcr.microsoft.com/dotnet/sdk:8.0
# docker save -o $IMAGE_DIR/golang_1.21.tar golang:1.21
# docker save -o $IMAGE_DIR/ruby_3.3.tar ruby:3.3
# docker save -o $IMAGE_DIR/php_8.2.tar php:8.2-cli
# docker save -o $IMAGE_DIR/rust_1.73.tar rust:1.73
# docker save -o $IMAGE_DIR/perl_5.36.tar perl:5.36

echo "Docker images pulled and saved successfully"

echo "Installing npm packages..."
npm install

# Reset the database and run migrations, also creating admin user
echo "Resetting database and running migrations..."
npx prisma migrate reset --force