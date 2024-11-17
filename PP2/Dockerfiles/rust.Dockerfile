# Dockerfile for Rust 1.73
FROM rust:1.73

# Set the working directory inside the container
WORKDIR /usr/src/app/tmp

# Copy the user's code into the container
COPY . .

# Build the Rust project
RUN cargo build --release

# Command to run the Rust binary
CMD cargo run < input.txt
