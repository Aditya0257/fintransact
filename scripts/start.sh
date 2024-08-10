#!/bin/sh

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until pg_isready -h db -p 5432 -U postgres; do
  echo "Waiting for PostgreSQL..."
  sleep 2
done

# Run database setup if not already done
if [ ! -f /app/.setup_done ]; then
  echo "Running database setup..."
  npm run db:setup
  touch /app/.setup_done
fi

# Start the application in development mode
echo "Starting the application..."
exec "$@"
