# Dockerfile for OpenJDK 20 (Java)
FROM openjdk:20

# Set the working directory inside the container
WORKDIR /usr/src/app/tmp

# Copy the user's code into the container
COPY . .

# Compile Java files (if needed)
RUN javac Main.java

# Command to run the Java file
CMD java Main < input.txt
