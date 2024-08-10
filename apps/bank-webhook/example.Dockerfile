# Base image for Node.js
FROM node:lts-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy over the package files for the application
COPY ./apps/bank-webhook/package*.json ./apps/bank-webhook/

# Install dependencies
RUN cd /app/apps/bank-webhook && npm install

# Copy over the Prisma schema and related files
COPY ./packages /app/packages

# Copy over the rest of the application files
COPY ./apps/bank-webhook /app/apps/bank-webhook

# Expose the necessary port
EXPOSE 4000

# Command to generate Prisma client and start the application
CMD ["sh", "-c", "cd /app/packages/db && npx prisma generate --schema=./prisma/schema.prisma && cd /app/apps/bank-webhook && npm run dev"]
