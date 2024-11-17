# Dockerfile for Node.js 20
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the user's code into the container
COPY . .

# Install any Node.js dependencies (optional)
# RUN npm install

# Command to run the Node.js file
CMD ["node", "main.js"]
