# Base image for Node.js
FROM node:lts-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy over the package files for the application
COPY ./apps/merchant-app/package*.json ./apps/merchant-app/

# Install dependencies
RUN cd /app/apps/merchant-app && npm install

# Copy over the Prisma schema and related files
COPY ./packages /app/packages

# Copy over the rest of the application files
COPY ./apps/merchant-app /app/apps/merchant-app

# Expose the necessary port
EXPOSE 4008

# Command to generate Prisma client and start the application
CMD ["sh", "-c", "cd /app/packages/db && npx prisma generate --schema=./prisma/schema.prisma && cd /app/apps/merchant-app && npm run dev"]
