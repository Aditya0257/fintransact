"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export const getPageP2PTransactions = async (
  page: number,
  transactionsPerPage: number
) => {
  const session = await getServerSession(authOptions);

  if (!session?.user || !session.user?.id) {
    return {
      message: "Unauthenticated request",
    };
  }

  const user = session?.user;

  const transactions = await prisma.p2pTransfer.findMany({
    where: {
      OR: [{ fromUserId: Number(user?.id) }, { toUserId: Number(user?.id) }],
    },
    include: {
      fromUser: {
        select: {
          name: true,
          number: true,
        },
      },
      toUser: {
        select: {
          name: true,
          number: true,
        },
      },
    },
    orderBy: {
      timestamp: "desc",
    },
  });

  const mappedTransactions = transactions.map((transaction) => ({
    amount: transaction.amount,
    timestamp: transaction.timestamp,
    fromUserId: transaction.fromUserId,
    fromUserName: transaction.fromUser?.name, 
    fromUserContactNo: transaction.fromUser?.number,
    toUserId: transaction.toUserId,
    toUserName: transaction.toUser?.name, 
    toUserContactNo: transaction.toUser?.number,
  }));

  return { transactions: mappedTransactions };
};

// export async function getPageP2P__DummyTransactions(
//   page: number,
//   transactionsPerPage: number,
// ) {
//   return {
//     transactions: [
//       {
//         startTime: new Date("2024-07-25T08:45:00"),
//         amount: 1000.5,
//         provider: "HDFC",
//         status: RampStatus.Success,
//       },

//       {
//         startTime: new Date("2024-07-25T08:45:00"),
//         amount: 1000.5,
//         provider: "HDFC",
//         status: RampStatus.Success,
//       },
//       {
//         startTime: new Date("2024-07-25T10:30:00"),
//         amount: 2500.0,
//         provider: "ICICI",
//         status: RampStatus.Processing,
//       },
//       {
//         startTime: new Date("2024-07-26T14:15:00"),
//         amount: 1500.75,
//         provider: "Axis",
//         status: RampStatus.Failure,
//       },
//     ],
//   };
// }
