# My Project

This is a brief description of my project.

## System Architecture

![OnRamping System Architecture & Workflow](https://github.com/Aditya0257/fintransact/blob/master/onRampTransc_lightmode_img.png)
![Peer to Peer (p2p) Workflow](https://github.com/Aditya0257/fintransact/blob/master/p2pTransferWorkflow.png)

## Installation

- Clone the repo

```jsx
git clone https://github.com/Aditya0257/fintransact.git
```

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
