# Dockerfile for GCC 12 (C++)
FROM gcc:12

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the user's code into the container
COPY . .

# Compile the C++ code (assuming the main file is named `main.cpp`)
RUN g++ -o main main.cpp

# Command to run the C++ executable
CMD ["./main"]
