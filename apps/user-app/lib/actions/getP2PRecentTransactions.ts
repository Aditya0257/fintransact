"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export const getP2PRecentTransactions = async() => {
  const session = await getServerSession(authOptions);

  if (!session?.user || !session.user?.id) {
    return {
      message: "Unauthenticated request",
    };
  }

  const user = session?.user;

  const transactions = await prisma.p2pTransfer.findMany({
    where: {
      OR: [
        {fromUserId: Number(user?.id)},
        {toUserId: Number(user?.id)},
      ],
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
    take: 12, 
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
  

  return {transactions: mappedTransactions};
}