# Base image for Node.js
FROM node:lts-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy over the package files for the application
COPY ./apps/user-app/package*.json ./apps/user-app/

# Install dependencies
RUN cd /app/apps/user-app && npm install

# Copy over the Prisma schema and related files
COPY ./packages /app/packages

# Copy over the rest of the application files
COPY ./apps/user-app /app/apps/user-app

# Expose the necessary port
EXPOSE 4004

# Command to generate Prisma client and start the application
CMD ["sh", "-c", "cd /app/packages/db && npx prisma generate --schema=./prisma/schema.prisma && cd /app/apps/user-app && npm run dev"]
