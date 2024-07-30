"use server";

import { RampStatus } from "@prisma/client";

export async function getPageP2PTransactions(
  page: number,
  transactionsPerPage: number,
) {
  return {
    transactions: [
      {
        startTime: new Date("2024-07-25T08:45:00"),
        amount: 1000.5,
        provider: "HDFC",
        status: RampStatus.Success,
      },

      {
        startTime: new Date("2024-07-25T08:45:00"),
        amount: 1000.5,
        provider: "HDFC",
        status: RampStatus.Success,
      },
      {
        startTime: new Date("2024-07-25T10:30:00"),
        amount: 2500.0,
        provider: "ICICI",
        status: RampStatus.Processing,
      },
      {
        startTime: new Date("2024-07-26T14:15:00"),
        amount: 1500.75,
        provider: "Axis",
        status: RampStatus.Failure,
      },
    ],
  };
}
