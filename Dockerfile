# Base image for Node.js
FROM node:lts-alpine AS base

# Set the working directory inside the container
WORKDIR /app

# Copy over the package files for the application
COPY ./package*.json ./turbo.json ./tsconfig.json ./

# Install dependencies for the entire monorepo
RUN npm install

# Copy over the package files for all workspaces
COPY . .

# Run the Prisma setup (migrate, generate client, and seed)
RUN npm run db:setup

# Build all apps in the monorepo
RUN npm run build

# Expose necessary ports for all apps
EXPOSE 5173 4004 4008 4000

# Command to start all apps using Turbo
CMD ["npm", "run", "dev"]
