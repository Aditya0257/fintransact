"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";



export const startP2PTransfer = async (to: string, amount: number) => {
  const session = await getServerSession(authOptions);
  if (!session?.user || !session.user?.id) {
    return {
      message: "Unauthenticated request",
    };
  }

  const from = session?.user?.id;

  // find the toUser from DB
  const toUser = await prisma.user.findFirst({
    where: {
      number: to,
    },
  });
  if (!toUser) {
    return {
      message: "toUser not found!",
    };
  }

  // use trnx -> steps =>
  // 1) lock the balance row of fromUser
  // 2) decrement amount in fromUser balance
  // 3) increment amount in toUser balance
  // 4) create a new p2p transfer row in its table for this p2p transaction

  // console.log("AMOUNT________ : ", Number(amount));

  await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(from)} FOR UPDATE`; // lock the Balances table

    const fromBalance = await tx.balance.findFirst({
      where: {
        userId: Number(from),
      },
    });

    if (!fromBalance || fromBalance?.amount < amount) {
      return { message: "Insufficient funds" };
    }

    await tx.balance.update({
      where: {
        userId: Number(from),
      },
      data: {
        amount: {
          decrement: Number(amount) * 100,
        },
      },
    });

    await tx.balance.update({
      where: {
        userId: Number(toUser.id),
      },
      data: {
        amount: {
          increment: Number(amount) * 100,
        },
      },
    });

    await tx.p2pTransfer.create({
      data: {
        fromUserId: Number(from),
        toUserId: Number(toUser.id),
        timestamp: new Date(),
        amount: Number(amount) * 100,
      },
    });

    // fromUser transaction
    await tx.$queryRawUnsafe(`
      INSERT INTO transactions (userId, category, amount, timestamp) 
      VALUES (${Number(from)}, 'fromUser', ${Number(amount) * 100}, NOW());
    `);

    // toUser transaction
    await tx.$queryRawUnsafe(`
      INSERT INTO transactions (userId, category, amount, timestamp) 
      VALUES (${Number(toUser.id)}, 'toUser', ${Number(amount) * 100}, NOW());
    `);
    

    return {
      message: "p2p Transaction completed.",
    };
  });
};
