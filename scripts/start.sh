#!/bin/sh

# Wait for Postgres to be ready
until pg_isready -h db -p 5432 -U postgres; do
  echo "Waiting for Postgres..."
  sleep 2
done

# Run the database setup only once
if [ ! -f /app/.setup_done ]; then
  echo "Running database setup..."
  npm run db:setup
  touch /app/.setup_done
fi

# Start your application
echo "Starting the application..."
npm run dev
