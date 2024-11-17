# Dockerfile for Perl 5.36
FROM perl:5.36

# Set the working directory inside the container
WORKDIR /usr/src/app/tmp

# Copy the user's code into the container
COPY . .

# Command to run the Perl file
CMD ["perl", "main.pl", "<", "input.txt"]
