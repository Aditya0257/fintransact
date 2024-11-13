# FinTransact

This project aims to create a comprehensive financial transaction platform that facilitates various types of transactions, including on-ramping, peer to peer transaction with customized settings to lock certain amount of money for improved money management.

## Tech Stack

- Turborepo (Build system orchestrator) with npm workspace as Monorepo
- next.js (FinTransact app - both BE & FE)
- Express (Webhook and bankapp server)
- React + Vite (Netbanking Simulation FE)
- Postgres DB with Prisma ORM
- Recoil (Client side state management - initialized but not applied yet)

### Completed

- CI/CD pipeline for automatic integration on commit by running build tests whenever we have pull request on master branch
- Containerized the application using docker, added docker-compose.yml file for easy installation.
- Completed p2p transfer, fixed bugs, added bankservice-be service & base docker file image to reduce redundant rebuilding and downloading of dependencies in each image.
- Completed Dashboard and Login Page, used recharts with timescale db ( continous aggregates and refresh policy concept) for optimized queries to get real time updated charts.

### To be implemented

- Websockets for listening to OnRampTransaction status update in DB from webhook side, then updating it in client side.

## System Architecture

![OnRamping System Architecture & Workflow](https://github.com/Aditya0257/fintransact/blob/master/onRampTransc_lightmode_img.png)
![Peer to Peer (p2p) Workflow](https://github.com/Aditya0257/fintransact/blob/master/p2pTransferWorkflow.png)

## Installation

- Clone the repo

```jsx
git clone https://github.com/Aditya0257/fintransact.git
cd fintransact
```

## High level Manual Setup

1. **Install dependencies**:

    ```bash
    npm install
    ```

2. **Run PostgreSQL locally**:

   ```bash
    docker run -d -e POSTGRES_PASSWORD=mysecretpassword -e POSTGRES_USER=postgres -e POSTGRES_DB=postgres -p 5432:5432 timescale/timescaledb:latest-pg17
   ```

3. **Create .env files**:

   ```bash
    DATABASE_URL=postgresql://postgres:mysecretpassword@localhost:5432/postgres
    ```

4. **Run start script**:

   ```bash
    npm run start
    ```

Note: If you have already run `npm run start` once, you initialized the timescale db, now you can directly run - `npx turbo dev`, for all updated changes, no need to run start script again then.

## Entirely Manual Setup

1. **Install dependencies**:

    ```bash
    npm install
    ```

2. **Run PostgreSQL locally or on the cloud** (such as [neon.tech](https://neon.tech) or [Aiven](https://console.aiven.io)):

    ```bash
    docker run -d -e POSTGRES_PASSWORD=mysecretpassword -e POSTGRES_USER=postgres -e POSTGRES_DB=postgres -p 5432:5432 timescale/timescaledb:latest-pg17
    ```

3. **Execute PL/SQL commands for database interaction**:

    ```bash
    docker exec -it <container_name> psql -U postgres -d postgres
    ```

4. **Copy and configure environment files**:
   - Copy `.env.example` files to `.env` files for each service.
   - Note: If running manually, set **bankservice-be’s** `.env` to `localhost`.
   - Update `.env` files with the correct database URL.

5. **Database setup**:
   - Navigate to `packages/db`:

      ```bash
      npx prisma migrate dev
      npx prisma generate
      npm run timeseries_db:setup
      ```

      - This will set up the transactions table as a hypertable, seed initial data, create continuous aggregates, and set a refresh policy.
   - Start **Prisma Studio** (GUI for DB management):

      ```bash
      npx prisma studio
      ```

6. **Start each service manually**:
   - **User App**:

      ```bash
      cd apps/user-app && npm run dev
      ```

   - **Bank Service App**:

      ```bash
      cd apps/bankservice-app && npm run dev
      ```

   - **Bank Service Backend**:

      ```bash
      cd apps/bankservice-be && npm run dev
      ```

   - **Bank Webhook**:

      ```bash
      cd apps/bank-webhook && npm run dev
      ```

Now, your webhook server, net-banking simulation application (for sending bank server’s payment confirmation requests to the webhook server), and user app should all be running. You can test the application by sending requests to simulate the workflow: application -> bank server -> webhook -> database update -> application.

## To-Do List

- Websocket Server to send balance update and "Processing" to "Success" status update for an OnRamp Transaction as soon as webhook updates DB.
- Setting Page design and logic to allow user to change username and also to set certain amount of balance to be locked for money management.

## Contributing

I welcome contributions from everyone! If you are interested in contributing to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Make your changes and commit them with clear and concise messages.
4. Push your branch to your forked repository.
5. Open a pull request to the main branch of this repository with a detailed description of your changes.
