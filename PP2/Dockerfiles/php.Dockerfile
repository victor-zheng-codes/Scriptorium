# Dockerfile for PHP 8.2
FROM php:8.2-cli

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the user's code into the container
COPY . .

# Command to run the PHP file
CMD ["php", "main.php"]
