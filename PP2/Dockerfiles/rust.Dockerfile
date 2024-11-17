# Dockerfile for Rust 1.73
FROM rust:1.73

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the user's code into the container
COPY tmp .

# Build the Rust project
RUN cargo build --release

# Command to run the Rust binary
CMD ["cargo", "run"]
