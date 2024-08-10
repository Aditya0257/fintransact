# Dockerfile Optimization and the Use of `start.sh`

## Issue Summary

While building the Docker images for the `postgres` and `fintransact_app` services, we encountered an issue where the images were not building in the expected order based on the `depends_on` configuration in the `docker-compose.yml` file. The sequence defined by `depends_on` controls the order in which containers are started, not the order in which images are built.

### Specific Issue with `fintransact_app`

When building the `fintransact_app` image, the `DATABASE_URL` environment variable is crucial for the build process. However, this variable was being injected only during container runtime, as specified in the `environment:` section of the `docker-compose.yml` file. Since environment variables defined in `docker-compose.yml` are only available at runtime and not during the build process, this caused issues where `fintransact_app` could not connect to the database during the build phase.

### Potential Solutions Considered

1. **Injecting `DATABASE_URL` in Dockerfile:**  
   One approach considered was to inject the `DATABASE_URL` environment variable directly in the Dockerfile using `ARG` or `ENV`. However, this method has limitations because the value of `DATABASE_URL` is often dynamic and environment-specific, making it less feasible to hard-code or pre-define during the build.

2. **Manual Environment Variable Injection:**  
   Another approach would be manually setting the `DATABASE_URL` before each build, but this adds complexity and is prone to human error, especially in collaborative environments.

### Solution Implemented: Using `start.sh`

To address the issue, we've implemented a `start.sh` script that ensures the necessary environment variables are available during both the build and runtime phases. Here's how it works:

- The `start.sh` script is responsible for checking if the required environment variables, like `DATABASE_URL`, are available.
- It ensures that the application does not start until all dependencies are ready and the environment is correctly configured.
- The script also handles the initialization steps, such as checking the connection to the database using the `pg_isready` command, ensuring that the application does not crash due to missing dependencies.

This approach allows us to maintain a clean Dockerfile while ensuring that all required environment variables are correctly set up before the application starts.

## How to Use

1. **Dockerfile Modification:**  
   The `start.sh` script is copied into the Docker image during the build process and is set as the entry point in the Dockerfile.
   - Example:
     ```Dockerfile
     COPY ./script/start.sh /usr/src/fintransact_app/start.sh
     ENTRYPOINT ["sh", "/usr/src/fintransact_app/start.sh"]
     ```

2. **Compose File Configuration:**  
   Ensure that the `docker-compose.yml` file specifies all necessary environment variables under the `environment:` section.
   These variables will be used by `start.sh` during container startup.

3. **Customizing `start.sh`:**  
   If new environment variables are added or additional checks are required, `start.sh` can be modified accordingly.
   The script is designed to be flexible and can be extended as the project evolves.

## Example of `start.sh`

Here's an example of what the `start.sh` script might look like:

```bash
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
npm run dev
```

## Why start.sh is Important ?

The start.sh script is a critical part of our Docker setup as it ensures that the application runs smoothly across different environments, whether in local development, CI/CD pipelines, or production. It also simplifies the Dockerfile and reduces the potential for errors during the build process, especially in complex multi-container setups like ours.
