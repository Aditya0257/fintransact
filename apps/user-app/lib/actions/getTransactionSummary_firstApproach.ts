// "use server";

// import { getServerSession } from "next-auth";
// import { authOptions } from "../auth";
// import prisma from "@repo/db/client";

// enum Timeframe {
//   DAILY = "DAILY",
//   WEEKLY = "WEEKLY",
//   MONTHLY = "MONTHLY",
//   YEARLY = "YEARLY",
// }

// type RefreshTimestamp = {
//   last_refresh: Date | string;
// }

// const getWeekOfTheYear = (date: Date): number => {
//   const start = new Date(date.getFullYear(), 0, 1); // January 1st of the given year
//   const diff = date.getTime() - start.getTime(); // Difference in milliseconds
//   const oneDay = 1000 * 60 * 60 * 24; // Number of milliseconds in a day
//   const dayOfYear = Math.floor(diff / oneDay); // Day of the year
//   return Math.ceil((dayOfYear + 1) / 7); // Return the week of the year
// };

// async function getLastRefreshTimestamp(viewName: string): Promise<any> {
//   const result: any = await prisma.$queryRawUnsafe(`
//       SELECT last_refresh FROM refresh_timestamps WHERE view_name = ${viewName};
//   `);
//   return result.length > 0 ? result[0].last_refresh : null;
// }

// async function getRealTimeData(
//   userId: number,
//   category: string,
//   interval: string
// ) {
//   const viewName = `${interval}_transaction_summary`;
//   const lastRefresh = await getLastRefreshTimestamp(viewName);
//   if (!lastRefresh) {
//     // no refresh time -> first 1 hr of db initialization.
//     console.log("First refresh hasn't happened yet!");
//   }

//   const realTimeData: any = await prisma.$queryRaw`
//       SELECT COALESCE(SUM(amount), 0) AS real_time_amount
//       FROM transactions
//       WHERE user_id = ${userId} AND category = ${category}
//       ${lastRefresh ? `AND timestamp > ${lastRefresh}` : ""};
//   `;
//   return realTimeData[0].real_time_amount;
// }

// async function getCombinedData(
//   userId: number,
//   category: string,
//   interval: string
// ) {
//   const viewName = `${interval}_transaction_summary`;
  // let periodField = "day";
  // switch (interval) {
  //   case "daily":
  //     periodField = "day";
  //     break;
  //   case "weekly":
  //     periodField = "week";
  //     break;
  //   case "monthly":
  //     periodField = "month";
  //     break;
  //   case "yearly":
  //     periodField = "year";
  //     break;
  // }

  // periodField type: 'day' | 'week' | 'month' | 'year'

  // NOTE: if it is first hour, db isn't refreshed, historical Data will be empty, since it was created before, then we started inserting
  // data, or seeded data, so, the data went to transactions table, from which, main MVs got data after first refresh, till then
  // only real time data function returns, all the data (obviously within that hour only).

//   const historicalData: any[] = await prisma.$queryRawUnsafe(`
//         SELECT ${periodField}, COALESCE(total_amount, 0) AS total_amount
//         FROM ${viewName}
//         WHERE user_id = ${userId} AND category = ${category}
//         ORDER BY ${periodField} ASC;;
//   `);

  // Get real-time data from the last refresh timestamp
//   const realTimeAmount = await getRealTimeData(userId, category, interval);

//   const lastRefresh = await getLastRefreshTimestamp(viewName); // Example: 2024-11-12T00:05:00.000Z

//   let refreshDate;
//   if (lastRefresh) {
//     refreshDate = new Date(lastRefresh);
//   } else {
    // not refreshed even once yet, first 1 hr of db
//     refreshDate = new Date();
//   }

//   const refreshYear = refreshDate.getFullYear();
//   const refreshMonth = refreshDate.getMonth() + 1;
//   const refreshDay = refreshDate.getDate();
//   const refreshWeek = getWeekOfTheYear(refreshDate);

//   // Check if we need to update or create a new entry - for merging realtime data with historical data

//   if (historicalData.length > 0) {
//     const latestEntry = historicalData[historicalData.length - 1]; // this is the whole row data: periodField, total_amount
//     // eg: 'some date', 'some amount' ; 'some week', 'some amount'; ... so it varies depending on periodField / interval.
//     const latestPeriod = latestEntry[periodField]; // latestEntry['week'] or latestEntry['month'] , ...

//     switch (interval) {
//       case "daily":
//         // check if it is same day
//         if (refreshDay === latestPeriod) {
//           latestEntry.total_amount += realTimeAmount; // Same day
//         } else {
//           // Create a new entry for the new day
//           historicalData.push({
//             [periodField]: refreshDay,
//             total_amount: realTimeAmount,
//           });
//         }
//         break;
//       case "weekly":
//         // check if it is same week
//         if (refreshWeek === latestPeriod) {
//           latestEntry.total_amount += realTimeAmount; // Same week
//         } else {
//           // Create a new entry for the new week
//           historicalData.push({
//             [periodField]: refreshWeek, // Start of the new week
//             total_amount: realTimeAmount,
//           });
//         }
//         break;
//       case "monthly":
//         if (refreshMonth === latestPeriod) {
//           latestEntry.total_amount += realTimeAmount; // Same month
//         } else {
//           // Create a new entry for the new month
//           historicalData.push({
//             [periodField]: refreshMonth, // Start of the new month
//             total_amount: realTimeAmount,
//           });
//         }
//         break;
//       case "yearly":
//         if (refreshYear === latestPeriod) {
//           latestEntry.total_amount += realTimeAmount; // Same year
//         } else {
//           // Create a new entry for the new year
//           historicalData.push({
//             [periodField]: refreshYear, // Start of the new year
//             total_amount: realTimeAmount,
//           });
//         }
//         break;
//     }
//   } else {
//     // If there is no historical data, create a new entry for the first period

//     let periodValue;

//     switch (periodField) {
//       case "day":
//         periodValue = refreshDate;
//         break;
//       case "week":
//         periodValue = refreshWeek;
//         break;
//       case "month":
//         periodValue = refreshMonth;
//         break;
//       case "year":
//         periodValue = refreshYear;
//         break;
//       default:
//         throw new Error("Invalid time period field");
//     }

//     historicalData.push({
//       [periodField]: periodValue,
//       total_amount: realTimeAmount,
//     });
//   }

//   return historicalData;
// }

// export async function getTransactionSummary(category: string, interval: string) {
//   const session = await getServerSession(authOptions);
//   if (!session?.user || !session.user?.id) {
//     return {
//       message: "Unauthenticated request",
//     };
//   }

//   let userId = parseInt(session?.user?.id, 10);
//   if (isNaN(userId)) {
//     return {
//       message: "Invalid user ID",
//     };
//   }

//   const tnxsummary: any[] = await getCombinedData(userId, category, interval);

//   return {transactionSummary: tnxsummary};
// }
