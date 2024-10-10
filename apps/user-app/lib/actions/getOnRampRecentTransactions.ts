"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import db from "@repo/db/client";

export async function getOnRampRecentTransactions() {
  
  const session = await getServerSession(authOptions);
  if (!session?.user || !session.user?.id) {
    return {
      message: "Unauthenticated request",
    };
  }

  const transactions = await db.onRampTransaction.findMany({
    where: {
      userId: Number(session?.user?.id),
    },
    select: {
      amount: true,
      startTime: true,
      provider: true,
      status: true,
    },
    orderBy: {
      startTime: 'desc', // Order by most recent transactions
    },
    take: 10, // Limit to 10 results
  });

  return {
    transactions,
  };



}
