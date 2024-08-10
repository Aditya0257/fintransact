# FinTransact

This project aims to create a comprehensive financial transaction platform that facilitates various types of transactions, including on-ramping, peer to peer transaction with customized settings to lock certain amount of money for improved money management.

## Tech Stack

- Turborepo (Build system orchestrator) with npm workspace as Monorepo
- next.js(FinTransact app - both BE & FE)
- Express(Webhook server)
- React + Vite(netbanking simulation FE)
- Postgres DB with Prisma ORM
- Recoil (Client side state management)

### Completed:
CI/CD pipeline for automatic integration on commit by running build tests whenever we have pull request on master branch


### To be implemented:

- CI-CD pipeline for automatic integration on commit by running build tests and deployment to EC2 Server as a docker image
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

### Docker Setup (Preferred)

- Run Docker Compose to build and start the services:

```jsx
docker compose build --no-cache
docker compose up
```

- The application should now be up and running. You can access the services on the appropriate ports configured in the docker-compose.yml file.

### Manual Setup

- npm install
- Run postgres either locally or on the cloud (neon.tech or console.aiven.io/)

```jsx
docker run  -e POSTGRES_PASSWORD=mysecretpassword -d -p 5432:5432 postgres
```

- Copy over all .env.example files to .env
- Update .env files everywhere with the right db url
- Go to `packages/db`
  - npx prisma migrate dev
  - npx prisma generate
  - npx prisma db seed (to seed/put some data in database to run queries and check the working)
  - npx prisma studio (prisma GUI for db)
- Go to `apps/user-app` , run `npm run dev`
- Go to `apps/bankservice-app` , run `npm run dev`
- Go to `apps/bank-webhook` , run `npm run dev`

Now, your webhook server, netbanking simulating appln. ( + for sending bank server's payment confirmation request to webhook server) and user-app have been started.
You can send requests and try to simulate the appln -> bank server -> webhook -> DB update -> appln. architecture

## To-Do List

- P2P Integration, both FE & BE.
- Dashboard using react libraries for graphs like chart.js
- Websocket Server to send balance update and "Processing" to "Success" status update for an OnRamp Transaction as soon as webhook updates DB.
- Setting Page design and logic to allow user to change username and also to set certain amount of balance to be locked for money management.
- Transactions Page filter option - based on StartDate and EndDate.

## Contributing

I welcome contributions from everyone! If you are interested in contributing to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Make your changes and commit them with clear and concise messages.
4. Push your branch to your forked repository.
5. Open a pull request to the main branch of this repository with a detailed description of your changes.
