# Dockerfile for Ruby 3.3
FROM ruby:3.3

# Set the working directory inside the container
WORKDIR /usr/src/app/tmp

# Copy the user's code into the container
COPY . .

# Install any Ruby dependencies (optional)
# RUN bundle install

# Command to run the Ruby file
CMD ruby main.rb < input.txt
