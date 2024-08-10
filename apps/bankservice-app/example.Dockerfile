# Base image for Node.js
FROM node:lts-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy over the package files for the application
COPY ./apps/bankservice-app/package*.json ./apps/bankservice-app/

# Install dependencies
RUN cd /app/apps/bankservice-app && npm install

# Copy over the Prisma schema and related files
COPY ./packages /app/packages

# Copy over the rest of the application files
COPY ./apps/bankservice-app /app/apps/bankservice-app

# Expose the necessary port
EXPOSE 5173

# Command to generate Prisma client and start the application
CMD ["sh", "-c", "cd /app/packages/db && npx prisma generate --schema=./prisma/schema.prisma && cd /app/apps/bankservice-app && npm run dev"]
