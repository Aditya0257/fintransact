// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();

import prisma from '../index'


async function createContinuousAggregates() {
    await prisma.$queryRawUnsafe(`
        CREATE MATERIALIZED VIEW IF NOT EXISTS daily_transaction_summary
        WITH (timescaledb.continuous) AS
        SELECT
            userId,
            category,
            time_bucket('1 day', timestamp) AS day,
            SUM(amount) AS total_amount
        FROM transactions
        GROUP BY userId, category, day;
    `);

    
    await prisma.$queryRawUnsafe(`
        CREATE MATERIALIZED VIEW IF NOT EXISTS weekly_transaction_summary
        WITH (timescaledb.continuous) AS
        SELECT
            userId,
            category,
            time_bucket('1 week', timestamp) AS week,
            SUM(amount) AS total_amount
        FROM transactions
        GROUP BY userId, category, week;
        `);

    await prisma.$queryRawUnsafe(`
        CREATE MATERIALIZED VIEW IF NOT EXISTS monthly_transaction_summary
        WITH (timescaledb.continuous) AS
        SELECT
            userId,
            category,
            time_bucket('1 month', timestamp) AS month,
            SUM(amount) AS total_amount
        FROM transactions
        GROUP BY userId, category, month;
    `);


    await prisma.$queryRawUnsafe(`
        CREATE MATERIALIZED VIEW IF NOT EXISTS yearly_transaction_summary
        WITH (timescaledb.continuous) AS
        SELECT
            userId,
            category,
            time_bucket('1 year', timestamp) AS year,
            SUM(amount) AS total_amount
        FROM transactions
        GROUP BY userId, category, year;
    `);




    console.log("Continuous aggregate views created.");
}

createContinuousAggregates().catch(e => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});