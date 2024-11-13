// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();

import prisma from '../index';

async function setDailyRefreshPolicy() {
    await prisma.$queryRawUnsafe(`
        SELECT add_continuous_aggregate_policy(
            'daily_transaction_summary',
            start_offset => INTERVAL '3 days',
            end_offset => NULL,
            schedule_interval => INTERVAL '1 min'
        );
    `);
    console.log("Daily refresh policy set for 'daily_transaction_summary'");
}

async function setWeeklyRefreshPolicy() {
    await prisma.$queryRawUnsafe(`
        SELECT add_continuous_aggregate_policy(
            'weekly_transaction_summary',
            start_offset => INTERVAL '3 weeks',
            end_offset => NULL,
            schedule_interval => INTERVAL '6 hours'
        );
    `);
    console.log("Weekly refresh policy set for 'weekly_transaction_summary'");
}

async function setMonthlyRefreshPolicy() {
    await prisma.$queryRawUnsafe(`
        SELECT add_continuous_aggregate_policy(
            'monthly_transaction_summary',
            start_offset => INTERVAL '3 months',
            end_offset => NULL,
            schedule_interval => INTERVAL '1 day'
        );
    `);
    console.log("Monthly refresh policy set for 'monthly_transaction_summary'");
}

async function setYearlyRefreshPolicy() {
    await prisma.$queryRawUnsafe(`
        SELECT add_continuous_aggregate_policy(
            'yearly_transaction_summary',
            start_offset => INTERVAL '3 years',
            end_offset => NULL,
            schedule_interval => INTERVAL '1 month'
        );
    `);
    console.log("Yearly refresh policy set for 'yearly_transaction_summary'");
}

async function setAllPolicies() {
    try {
        await setDailyRefreshPolicy();
        await setWeeklyRefreshPolicy();
        await setMonthlyRefreshPolicy();
        await setYearlyRefreshPolicy();
    } catch (error) {
        console.error("Error setting refresh policies:", error);
    } finally {
        await prisma.$disconnect();
    }
}

setAllPolicies();
