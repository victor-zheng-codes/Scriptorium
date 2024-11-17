# Assisted by docker file

# Step 1: Use an official Node.js image as the base image
FROM node:18-alpine AS builder

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy the package.json and package-lock.json (or yarn.lock) to the container
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application code to the container
COPY . .

# Step 6: Generate Prisma client
RUN npx prisma generate

# Step 7: Run Prisma migrations to set up the database schema
RUN npx prisma migrate deploy

# Step 8: Seed the database
RUN npx prisma db seed

# Step 9: Build the Next.js app
RUN npm run build

# Step 10: Create a smaller image for production
FROM node:18-alpine AS production

# Step 11: Set the working directory inside the container
WORKDIR /app

# Step 12: Copy only the necessary files from the builder image
COPY --from=builder /app /app

# Step 13: Expose the port your app will run on
EXPOSE 3000

# Step 14: Start the Next.js app in production mode
CMD ["npm", "start"]
