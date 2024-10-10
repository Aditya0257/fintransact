import { PrismaClient, RampStatus } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const usersData = [
    { number: "1111111111", password: "alice", name: "Alice", initialBalance: 20000 },
    { number: "2222222222", password: "bob", name: "Bob", initialBalance: 2000 },
    { number: "3333333333", password: "charlie", name: "Charlie", initialBalance: 15000 },
    { number: "4444444444", password: "dave", name: "Dave", initialBalance: 8000 },
    { number: "5555555555", password: "eve", name: "Eve", initialBalance: 5000 },
    { number: "6666666666", password: "frank", name: "Frank", initialBalance: 12000 },
    { number: "7777777777", password: "grace", name: "Grace", initialBalance: 25000 },
    { number: "8888888888", password: "hank", name: "Hank", initialBalance: 7000 },
    { number: "9999999999", password: "ivy", name: "Ivy", initialBalance: 9000 },
    { number: "0000000000", password: "jack", name: "Jack", initialBalance: 30000 },
  ];

  // Create users
  for (const userData of usersData) {
    await prisma.user.upsert({
      where: { number: userData.number },
      update: {},
      create: {
        number: userData.number,
        password: await bcrypt.hash(userData.password, 10),
        name: userData.name,
        Balance: {
          create: {
            amount: userData.initialBalance * 100,
            locked: 0,
          },
        },
      },
    });
  }

  // Create transactions for users
  const transactionsData = [
    { userNumber: "1111111111", status: RampStatus.Success, amount: 20000, token: "token__1", provider: "HDFC Bank" },
    { userNumber: "2222222222", status: RampStatus.Failure, amount: 2000, token: "token__2", provider: "HDFC Bank" },
    { userNumber: "3333333333", status: RampStatus.Success, amount: 15000, token: "token__3", provider: "ICICI Bank" },
    { userNumber: "4444444444", status: RampStatus.Success, amount: 8000, token: "token__4", provider: "Axis Bank" },
    { userNumber: "5555555555", status: RampStatus.Failure, amount: 5000, token: "token__5", provider: "SBI" },
    { userNumber: "6666666666", status: RampStatus.Success, amount: 12000, token: "token__6", provider: "HDFC Bank" },
  ];

  for (const transactionData of transactionsData) {
    const user = await prisma.user.findUnique({
      where: { number: transactionData.userNumber },
    });

    if (user) {
      await prisma.onRampTransaction.create({
        data: {
          amount: transactionData.amount * 100,
          userId: user.id,
          status: transactionData.status,
          token: transactionData.token,
          provider: transactionData.provider,
        },
      });
    }
  }

  // Create p2p transfers
  const transfersData = [
    { fromUserNumber: "1111111111", toUserNumber: "2222222222", amount: 5000 },
    { fromUserNumber: "2222222222", toUserNumber: "3333333333", amount: 1000 },
    { fromUserNumber: "3333333333", toUserNumber: "4444444444", amount: 3000 },
    { fromUserNumber: "4444444444", toUserNumber: "5555555555", amount: 2000 },
    { fromUserNumber: "5555555555", toUserNumber: "6666666666", amount: 2500 },
    { fromUserNumber: "6666666666", toUserNumber: "7777777777", amount: 4000 },
    { fromUserNumber: "7777777777", toUserNumber: "8888888888", amount: 1500 },
  ];

  for (const transferData of transfersData) {
    const fromUser = await prisma.user.findUnique({
      where: { number: transferData.fromUserNumber },
    });
    const toUser = await prisma.user.findUnique({
      where: { number: transferData.toUserNumber },
    });

    if (fromUser && toUser) {
      await prisma.p2pTransfer.create({
        data: {
          amount: transferData.amount * 100,
          fromUserId: fromUser.id,
          toUserId: toUser.id,
        },
      });
    }
  }

  console.log("Seeding completed!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
