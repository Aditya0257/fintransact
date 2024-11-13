// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();

import prisma from "../index";
import { Client } from "pg";

async function createHypertable() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  await client.connect();

  // Create composite unique index for TimescaleDB
  await client.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS transactions_id_timestamp_idx ON transactions (id, timestamp);
    `);

  // Creating hypertable using TimescaleDB
  await client.query(`
    SELECT create_hypertable('transactions', 'timestamp', if_not_exists => TRUE);
  `);

  console.log("Transactions table converted to hypertable (if it wasn't already a hypertable).")

  await client.end();
}

createHypertable()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
