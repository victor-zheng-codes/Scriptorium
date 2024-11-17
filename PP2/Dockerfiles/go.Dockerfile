# Dockerfile for Golang 1.21
FROM golang:1.21

# Set the working directory inside the container
WORKDIR /usr/src/app/tmp

# Copy the user's Go code into the container
COPY . .

# Build the Go code (assuming the main file is named `main.go`)
RUN go build -o main main.go

# Command to run the Go executable
CMD ./main < input.txt
