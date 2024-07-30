"use server";

import { RampStatus } from "@prisma/client";

export async function getOnRampRecentTransactions() {
  return {
    transactions: [
      {
        time: new Date("2024-07-25T08:45:00"),
        amount: 1000.5,
        provider: "HDFC",
        status: RampStatus.Success,
      },

      {
        time: new Date("2024-07-25T08:45:00"),
        amount: 1000.5,
        provider: "HDFC",
        status: RampStatus.Success,
      },
      {
        time: new Date("2024-07-25T10:30:00"),
        amount: 2500.0,
        provider: "ICICI",
        status: RampStatus.Processing,
      },
      {
        time: new Date("2024-07-26T14:15:00"),
        amount: 1500.75,
        provider: "Axis",
        status: RampStatus.Failure,
      },
      {
        time: new Date("2024-07-26T16:00:00"),
        amount: 3000.0,
        provider: "Kotak",
        status: RampStatus.Success,
      },
      {
        time: new Date("2024-07-27T09:00:00"),
        amount: 500.25,
        provider: "HDFC",
        status: RampStatus.Processing,
      },
      {
        time: new Date("2024-07-27T11:45:00"),
        amount: 750.5,
        provider: "ICICI",
        status: RampStatus.Success,
      },

      {
        time: new Date("2024-07-25T10:30:00"),
        amount: 2500.0,
        provider: "ICICI",
        status: RampStatus.Processing,
      },
      {
        time: new Date("2024-07-26T14:15:00"),
        amount: 1500.75,
        provider: "Axis",
        status: RampStatus.Failure,
      },
      {
        time: new Date("2024-07-26T16:00:00"),
        amount: 3000.0,
        provider: "Kotak",
        status: RampStatus.Success,
      },
      {
        time: new Date("2024-07-27T09:00:00"),
        amount: 500.25,
        provider: "HDFC",
        status: RampStatus.Processing,
      },
      {
        time: new Date("2024-07-27T11:45:00"),
        amount: 750.5,
        provider: "ICICI",
        status: RampStatus.Success,
      },
      {
        time: new Date("2024-07-28T08:30:00"),
        amount: 1000.0,
        provider: "Axis",
        status: RampStatus.Failure,
      },
      {
        time: new Date("2024-07-28T10:00:00"),
        amount: 2500.75,
        provider: "Kotak",
        status: RampStatus.Success,
      },
      {
        time: new Date("2024-07-29T12:15:00"),
        amount: 3000.5,
        provider: "HDFC",
        status: RampStatus.Processing,
      },
      {
        time: new Date("2024-07-29T14:45:00"),
        amount: 1500.0,
        provider: "ICICI",
        status: RampStatus.Success,
      },
    ],
  };
}
