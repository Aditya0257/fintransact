# Base image for Node.js
FROM node:lts-alpine AS base


# Install PostgreSQL client to use pg_isready, bash and dos2unix
RUN apk --no-cache add postgresql-client bash dos2unix

# Set the working directory inside the container
WORKDIR /app

# Copy over the package files for all workspaces
COPY . .

# Ensure start.sh has the correct line endings and is executable
RUN dos2unix ./scripts/start.sh && chmod +x ./scripts/start.sh

# Install dependencies for the entire monorepo
RUN npm install

# # Run the Prisma setup (migrate, generate client, and seed)
# RUN npm run db:setup

# # Build all apps in the monorepo
# RUN npm run build

# Expose necessary ports for all apps
EXPOSE 5173 4004 4008 4000

# # Command to start all apps using Turbo
# CMD ["npm", "run", "dev"]

# CMD will only run after the container is started, so the database will be up
CMD ["sh", "./scripts/start.sh"]
