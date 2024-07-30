"use server";

import db from "@repo/db/client";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export const getUserBalance = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user || !session.user?.id) {
    return {
      message: "Unauthenticated request",
    };
  }

  const balance = await db.balance.findUnique({
    where: {
      userId: Number(session?.user?.id),
    },
    select: {
      amount: true,
      locked: true,
    },
  });

  return {
    totalBalance: balance?.amount,
    lockedBalance: balance?.locked,
  };
};
