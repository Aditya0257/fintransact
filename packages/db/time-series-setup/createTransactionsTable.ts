// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();

import prisma from '../index';


async function createTransactionsTable() {

    // Ensure necessary extensions are available
    await prisma.$queryRawUnsafe(`CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;`);
    await prisma.$queryRawUnsafe(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    const queryString = `
    CREATE TABLE IF NOT EXISTS transactions (
      id UUID DEFAULT uuid_generate_v4() NOT NULL,
      userId INT NOT NULL,
      category VARCHAR(255) NOT NULL,
      amount BIGINT NOT NULL,
      timestamp TIMESTAMPTZ NOT NULL
    );
  `;
    await prisma.$queryRawUnsafe(queryString);
    console.log("Transactions table created.");

}

/*
transactions example row data =>
    id: 1
    userId: 6
    category: onramp
    amount: 7500
    timestamp: NOW()
*/


createTransactionsTable().catch(e => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});