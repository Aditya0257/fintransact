"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";


async function fetchHistoricalData(
  interval: string,
  userId: number,
  category: string
): Promise<any[]> {
  let query = "";
  let period_field = "";

  switch (interval) {
    case "yearly":
      // -- Up until the start of this year
      period_field = "year";
      
      query = `
                SELECT ${period_field} as year_start, CAST(EXTRACT(YEAR FROM ${period_field}) AS INT) AS year,
                COALESCE(CAST(total_amount AS BIGINT), 0) AS total_amount
                FROM yearly_transaction_summary
                WHERE userId = ${userId}
                  AND category = '${category}'
                  AND ${period_field} < DATE_TRUNC('year', CURRENT_DATE)  
                ORDER BY ${period_field} ASC;
            `;
      break;
    case "monthly":
      // -- Up until the start of this month
      period_field = "month";
      query = `
                SELECT ${period_field} as month_start, CAST(EXTRACT(MONTH FROM ${period_field}) AS INT) AS month,
                COALESCE(CAST(total_amount AS BIGINT), 0) AS total_amount
                FROM monthly_transaction_summary
                WHERE userId = ${userId}
                  AND category = '${category}'
                  AND ${period_field} < DATE_TRUNC('month', CURRENT_DATE)  
                ORDER BY ${period_field} ASC;
            `;
      break;
    case "weekly":
      // -- Up until the start of this week

      period_field = "week";
      query = `
                SELECT ${period_field} as week_start, CAST(EXTRACT(WEEK FROM ${period_field}) AS INT) AS week, 
                COALESCE(CAST(total_amount AS BIGINT), 0) AS total_amount
                FROM weekly_transaction_summary
                WHERE userId = ${userId}
                  AND category = '${category}'
                  AND ${period_field} < DATE_TRUNC('week', CURRENT_DATE)  
                ORDER BY ${period_field} ASC;
            `;
      break;
    case "daily":
      // -- Up until yesterday
      period_field = "day";
      query = `
                SELECT ${period_field} as day_start, CAST(EXTRACT(DAY FROM ${period_field}) AS INT) AS day,
                COALESCE(CAST(total_amount AS BIGINT), 0) AS total_amount
                FROM daily_transaction_summary
                WHERE userId = ${userId}
                  AND category = '${category}'
                  AND ${period_field} < CURRENT_DATE  
                ORDER BY ${period_field} ASC;
            `;
      break;
    default:
      throw new Error(`Invalid interval: ${interval}`);
  }

  return prisma.$queryRawUnsafe(query);
}

// Helper function to fetch the real-time data for the given period (current period)
async function fetchRealTimeData(
  interval: string,
  userId: number,
  category: string
): Promise<any[]> {
  let query = "";

  switch (interval) {
    case "yearly":
      query = `
                SELECT DATE_TRUNC('year', CURRENT_DATE) AS year_start, CAST(EXTRACT(YEAR FROM timestamp) AS INT) AS year, 
                COALESCE(CAST(SUM(amount) AS BIGINT), 0) AS total_amount
                FROM transactions
                WHERE userId = ${userId}
                  AND category = '${category}'
                  AND EXTRACT(YEAR FROM timestamp) = EXTRACT(YEAR FROM CURRENT_DATE)
                GROUP BY year;
            `;
      break;
    case "monthly":
      query = `
                SELECT DATE_TRUNC('month', CURRENT_DATE) AS month_start, CAST(EXTRACT(MONTH FROM timestamp) AS INT) AS month, 
                COALESCE(CAST(SUM(amount) AS BIGINT), 0) AS total_amount
                FROM transactions
                WHERE userId = ${userId}
                  AND category = '${category}'
                  AND EXTRACT(YEAR FROM timestamp) = EXTRACT(YEAR FROM CURRENT_DATE)
                  AND EXTRACT(MONTH FROM timestamp) = EXTRACT(MONTH FROM CURRENT_DATE)
                GROUP BY month;
            `;
      break;
    case "weekly":
      query = `
                SELECT DATE_TRUNC('week', CURRENT_DATE) AS week_start, CAST(EXTRACT(WEEK FROM timestamp) AS INT) AS week, 
                COALESCE(CAST(SUM(amount) AS BIGINT), 0) AS total_amount
                FROM transactions
                WHERE userId = ${userId}
                  AND category = '${category}'
                  AND EXTRACT(YEAR FROM timestamp) = EXTRACT(YEAR FROM CURRENT_DATE)
                  AND EXTRACT(WEEK FROM timestamp) = EXTRACT(WEEK FROM CURRENT_DATE)
                GROUP BY week;
            `;
      break;
    case "daily":
      query = `
                SELECT CURRENT_DATE AS day_start, CAST(EXTRACT(DAY FROM timestamp) AS INT) AS day, 
                COALESCE(CAST(SUM(amount) AS BIGINT), 0) AS total_amount
                FROM transactions
                WHERE userId = ${userId}
                  AND category = '${category}'
                  AND timestamp >= CURRENT_DATE
                  AND timestamp < CURRENT_DATE + INTERVAL '1 day'
                GROUP BY day;
            `;
      break;
    default:
      throw new Error(`Invalid interval: ${interval}`);
  }

  return prisma.$queryRawUnsafe(query);
}

// Main function to combine historical and real-time data for the specified interval
async function getAggregatedData(
  interval: string,
  userId: number,
  category: string
) {
  try {
    // Fetch historical data (up until the start of the current period)
    const historicalData: any[] = await fetchHistoricalData(
      interval,
      userId,
      category
    );

    // console.log("historical data: ");
    // console.log(historicalData);

    // Fetch real-time data (for the current period)
    const realTimeData: any[] = await fetchRealTimeData(
      interval,
      userId,
      category
    );

    // console.log("realTime data: ");
    // console.log(realTimeData);

    console.log(
      "fetched historical and real time data -> going to combine them."
    );

    // Combine historical and real-time data (real-time data is appended at the end)
    const combinedData = [...historicalData, ...realTimeData];

    return combinedData;
  } catch (error) {
    console.error("Error while fetching and combining data:", error);
    throw error;
  }
}

export async function getTransactionSummary(
  category: string,
  interval: string
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !session.user?.id) {
    return {
      message: "Unauthenticated request",
    };
  }

  let userId = parseInt(session?.user?.id, 10);
  if (isNaN(userId)) {
    return {
      message: "Invalid user ID",
    };
  }

  const tnxsummary: any[] = await getAggregatedData(interval, userId, category);

  // console.log(tnxsummary);

  return { transactionSummary: tnxsummary };
}
