# Dockerfile for OpenJDK 20 (Java)
FROM openjdk:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the user's code into the container
COPY tmp .

# Compile Java files (if needed)
# RUN javac Main.java

# Command to run the Java file
CMD ["java", "Main"]
