import { PrismaClient, RampStatus } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const usersData = [
    {
      number: "1111111111",
      password: "alice",
      name: "Alice",
      initialBalance: 20000,
    },
    {
      number: "2222222222",
      password: "bob",
      name: "Bob",
      initialBalance: 2000,
    },
    {
      number: "3333333333",
      password: "charlie",
      name: "Charlie",
      initialBalance: 15000,
    },
    {
      number: "4444444444",
      password: "dave",
      name: "Dave",
      initialBalance: 8000,
    },
    {
      number: "5555555555",
      password: "eve",
      name: "Eve",
      initialBalance: 5000,
    },
    {
      number: "6666666666",
      password: "frank",
      name: "Frank",
      initialBalance: 12000,
    },
    {
      number: "7777777777",
      password: "grace",
      name: "Grace",
      initialBalance: 25000,
    },
    {
      number: "8888888888",
      password: "hank",
      name: "Hank",
      initialBalance: 7000,
    },
    {
      number: "9999999999",
      password: "ivy",
      name: "Ivy",
      initialBalance: 9000,
    },
    {
      number: "0000000000",
      password: "jack",
      name: "Jack",
      initialBalance: 30000,
    },
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
    // Yearly Transactions for Alice
    {
      userNumber: "1111111111",
      status: RampStatus.Success,
      amount: 100000,
      token: "token_yr1_Alice",
      provider: "HDFC Bank",
      createdAt: "2023-01-01",
    },
    {
      userNumber: "1111111111",
      status: RampStatus.Success,
      amount: 200000,
      token: "token_yr2_Alice",
      provider: "HDFC Bank",
      createdAt: "2022-01-01",
    },

    // Monthly Transactions for Alice
    {
      userNumber: "1111111111",
      status: RampStatus.Success,
      amount: 5000,
      token: "token_m1_Alice",
      provider: "ICICI Bank",
      createdAt: "2023-06-01",
    },
    {
      userNumber: "1111111111",
      status: RampStatus.Failure,
      amount: 8000,
      token: "token_m2_Alice",
      provider: "SBI",
      createdAt: "2023-07-01",
    },

    // Weekly Transactions for Alice
    {
      userNumber: "1111111111",
      status: RampStatus.Success,
      amount: 1200,
      token: "token_w1_Alice",
      provider: "Axis Bank",
      createdAt: "2023-07-08",
    },
    {
      userNumber: "1111111111",
      status: RampStatus.Failure,
      amount: 1500,
      token: "token_w2_Alice",
      provider: "SBI",
      createdAt: "2023-07-15",
    },

    // Daily Transactions for Alice
    {
      userNumber: "1111111111",
      status: RampStatus.Success,
      amount: 250,
      token: "token_d1_Alice",
      provider: "ICICI Bank",
      createdAt: "2023-07-20",
    },
    {
      userNumber: "1111111111",
      status: RampStatus.Failure,
      amount: 300,
      token: "token_d2_Alice",
      provider: "HDFC Bank",
      createdAt: "2023-07-21",
    },

    // Yearly Transactions for Bob
    {
      userNumber: "2222222222",
      status: RampStatus.Success,
      amount: 70000,
      token: "token_yr1_Bob",
      provider: "HDFC Bank",
      createdAt: "2023-01-01",
    },
    {
      userNumber: "2222222222",
      status: RampStatus.Failure,
      amount: 60000,
      token: "token_yr2_Bob",
      provider: "ICICI Bank",
      createdAt: "2022-01-01",
    },

    // Monthly Transactions for Bob
    {
      userNumber: "2222222222",
      status: RampStatus.Success,
      amount: 4500,
      token: "token_m1_Bob",
      provider: "Axis Bank",
      createdAt: "2023-06-01",
    },
    {
      userNumber: "2222222222",
      status: RampStatus.Failure,
      amount: 5000,
      token: "token_m2_Bob",
      provider: "SBI",
      createdAt: "2023-07-01",
    },

    // Weekly Transactions for Bob
    {
      userNumber: "2222222222",
      status: RampStatus.Success,
      amount: 1200,
      token: "token_w1_Bob",
      provider: "ICICI Bank",
      createdAt: "2023-07-08",
    },
    {
      userNumber: "2222222222",
      status: RampStatus.Failure,
      amount: 1300,
      token: "token_w2_Bob",
      provider: "Axis Bank",
      createdAt: "2023-07-15",
    },

    // Daily Transactions for Bob
    {
      userNumber: "2222222222",
      status: RampStatus.Success,
      amount: 250,
      token: "token_d1_Bob",
      provider: "HDFC Bank",
      createdAt: "2023-07-20",
    },
    {
      userNumber: "2222222222",
      status: RampStatus.Failure,
      amount: 200,
      token: "token_d2_Bob",
      provider: "SBI",
      createdAt: "2023-07-21",
    },

    // Yearly Transactions for Charlie
    {
      userNumber: "3333333333",
      status: RampStatus.Success,
      amount: 150000,
      token: "token_yr3_Charlie",
      provider: "HDFC Bank",
      createdAt: "2023-01-01",
    },
    {
      userNumber: "3333333333",
      status: RampStatus.Failure,
      amount: 120000,
      token: "token_yr4_Charlie",
      provider: "Axis Bank",
      createdAt: "2022-01-01",
    },

    // Monthly Transactions for Charlie
    {
      userNumber: "3333333333",
      status: RampStatus.Success,
      amount: 10000,
      token: "token_m3_Charlie",
      provider: "ICICI Bank",
      createdAt: "2023-06-01",
    },
    {
      userNumber: "3333333333",
      status: RampStatus.Failure,
      amount: 15000,
      token: "token_m4_Charlie",
      provider: "SBI",
      createdAt: "2023-07-01",
    },

    // Weekly Transactions for Charlie
    {
      userNumber: "3333333333",
      status: RampStatus.Success,
      amount: 1800,
      token: "token_w3_Charlie",
      provider: "Axis Bank",
      createdAt: "2023-07-08",
    },
    {
      userNumber: "3333333333",
      status: RampStatus.Failure,
      amount: 2500,
      token: "token_w4_Charlie",
      provider: "SBI",
      createdAt: "2023-07-15",
    },

    // Daily Transactions for Charlie
    {
      userNumber: "3333333333",
      status: RampStatus.Success,
      amount: 300,
      token: "token_d3_Charlie",
      provider: "ICICI Bank",
      createdAt: "2023-07-20",
    },
    {
      userNumber: "3333333333",
      status: RampStatus.Failure,
      amount: 350,
      token: "token_d4_Charlie",
      provider: "HDFC Bank",
      createdAt: "2023-07-21",
    },

    // Yearly Transactions for David
    {
      userNumber: "4444444444",
      status: RampStatus.Success,
      amount: 100000,
      token: "token_yr5_David",
      provider: "ICICI Bank",
      createdAt: "2023-01-01",
    },
    {
      userNumber: "4444444444",
      status: RampStatus.Failure,
      amount: 110000,
      token: "token_yr6_David",
      provider: "Axis Bank",
      createdAt: "2022-01-01",
    },

    // Monthly Transactions for David
    {
      userNumber: "4444444444",
      status: RampStatus.Success,
      amount: 9500,
      token: "token_m5_David",
      provider: "SBI",
      createdAt: "2023-06-01",
    },
    {
      userNumber: "4444444444",
      status: RampStatus.Failure,
      amount: 10000,
      token: "token_m6_David",
      provider: "HDFC Bank",
      createdAt: "2023-07-01",
    },

    // Weekly Transactions for David
    {
      userNumber: "4444444444",
      status: RampStatus.Success,
      amount: 2000,
      token: "token_w5_David",
      provider: "Axis Bank",
      createdAt: "2023-07-08",
    },
    {
      userNumber: "4444444444",
      status: RampStatus.Failure,
      amount: 1800,
      token: "token_w6_David",
      provider: "ICICI Bank",
      createdAt: "2023-07-15",
    },

    // Daily Transactions for David
    {
      userNumber: "4444444444",
      status: RampStatus.Success,
      amount: 400,
      token: "token_d5_David",
      provider: "SBI",
      createdAt: "2023-07-20",
    },
    {
      userNumber: "4444444444",
      status: RampStatus.Failure,
      amount: 500,
      token: "token_d6_David",
      provider: "HDFC Bank",
      createdAt: "2023-07-21",
    },

    // Yearly Transactions for Eva
    {
      userNumber: "5555555555",
      status: RampStatus.Success,
      amount: 200000,
      token: "token_yr7_Eva",
      provider: "HDFC Bank",
      createdAt: "2023-01-01",
    },
    {
      userNumber: "5555555555",
      status: RampStatus.Failure,
      amount: 150000,
      token: "token_yr8_Eva",
      provider: "Axis Bank",
      createdAt: "2022-01-01",
    },

    // Monthly Transactions for Eva
    {
      userNumber: "5555555555",
      status: RampStatus.Success,
      amount: 12000,
      token: "token_m7_Eva",
      provider: "ICICI Bank",
      createdAt: "2023-06-01",
    },
    {
      userNumber: "5555555555",
      status: RampStatus.Failure,
      amount: 14000,
      token: "token_m8_Eva",
      provider: "SBI",
      createdAt: "2023-07-01",
    },

    // Weekly Transactions for Eva
    {
      userNumber: "5555555555",
      status: RampStatus.Success,
      amount: 1500,
      token: "token_w7_Eva",
      provider: "Axis Bank",
      createdAt: "2023-07-08",
    },
    {
      userNumber: "5555555555",
      status: RampStatus.Failure,
      amount: 1800,
      token: "token_w8_Eva",
      provider: "SBI",
      createdAt: "2023-07-15",
    },

    // Daily Transactions for Eva
    {
      userNumber: "5555555555",
      status: RampStatus.Success,
      amount: 500,
      token: "token_d7_Eva",
      provider: "ICICI Bank",
      createdAt: "2023-07-20",
    },
    {
      userNumber: "5555555555",
      status: RampStatus.Failure,
      amount: 450,
      token: "token_d8_Eva",
      provider: "HDFC Bank",
      createdAt: "2023-07-21",
    },
  ];

  for (const transactionData of transactionsData) {
    const user = await prisma.user.findUnique({
      where: { number: transactionData.userNumber },
    });

    if (user) {
      await prisma.$transaction(async (tx) => {
        await tx.onRampTransaction.create({
          data: {
            amount: transactionData.amount * 100,
            userId: user.id,
            status: transactionData.status,
            token: transactionData.token,
            provider: transactionData.provider,
            startTime: new Date(transactionData.createdAt),
          },
        });

        await tx.$executeRawUnsafe(`
          INSERT INTO transactions(userId, category, amount, timestamp) 
          VALUES (${Number(user.id)}, 'onRamp', ${Number(transactionData.amount) * 100}, '${new Date(transactionData.createdAt).toISOString()}');
          
        `);
      });
    }
  }

  // Create p2p transfers
  const transfersData = [
    // Existing Yearly, Monthly, Weekly, and Daily P2P Transfers for Alice, Bob, and other users
    {
      fromUserNumber: "1111111111",
      toUserNumber: "2222222222",
      amount: 20000,
      createdAt: "2023-01-01",
    },
    {
      fromUserNumber: "1111111111",
      toUserNumber: "2222222222",
      amount: 30000,
      createdAt: "2022-01-01",
    },
    {
      fromUserNumber: "1111111111",
      toUserNumber: "3333333333",
      amount: 2500,
      createdAt: "2023-06-01",
    },
    {
      fromUserNumber: "2222222222",
      toUserNumber: "3333333333",
      amount: 4000,
      createdAt: "2023-06-15",
    },
    {
      fromUserNumber: "1111111111",
      toUserNumber: "4444444444",
      amount: 1200,
      createdAt: "2023-07-08",
    },
    {
      fromUserNumber: "2222222222",
      toUserNumber: "5555555555",
      amount: 1500,
      createdAt: "2023-07-15",
    },
    {
      fromUserNumber: "1111111111",
      toUserNumber: "6666666666",
      amount: 200,
      createdAt: "2023-07-20",
    },
    {
      fromUserNumber: "2222222222",
      toUserNumber: "7777777777",
      amount: 300,
      createdAt: "2023-07-21",
    },
    {
      fromUserNumber: "3333333333",
      toUserNumber: "4444444444",
      amount: 5000,
      createdAt: "2023-01-01",
    },
    {
      fromUserNumber: "4444444444",
      toUserNumber: "5555555555",
      amount: 7000,
      createdAt: "2023-03-01",
    },

    // Additional Transfers (to total 25 more)
    {
      fromUserNumber: "1111111111",
      toUserNumber: "5555555555",
      amount: 3500,
      createdAt: "2023-02-10",
    },
    {
      fromUserNumber: "2222222222",
      toUserNumber: "6666666666",
      amount: 4500,
      createdAt: "2023-03-05",
    },
    {
      fromUserNumber: "3333333333",
      toUserNumber: "2222222222",
      amount: 1200,
      createdAt: "2023-03-12",
    },
    {
      fromUserNumber: "4444444444",
      toUserNumber: "1111111111",
      amount: 5600,
      createdAt: "2023-03-25",
    },
    {
      fromUserNumber: "5555555555",
      toUserNumber: "3333333333",
      amount: 6200,
      createdAt: "2023-04-15",
    },
    {
      fromUserNumber: "6666666666",
      toUserNumber: "1111111111",
      amount: 7800,
      createdAt: "2023-05-20",
    },
    {
      fromUserNumber: "1111111111",
      toUserNumber: "7777777777",
      amount: 2500,
      createdAt: "2023-05-29",
    },
    {
      fromUserNumber: "2222222222",
      toUserNumber: "8888888888",
      amount: 1100,
      createdAt: "2023-06-10",
    },
    {
      fromUserNumber: "3333333333",
      toUserNumber: "4444444444",
      amount: 4000,
      createdAt: "2023-06-12",
    },
    {
      fromUserNumber: "4444444444",
      toUserNumber: "5555555555",
      amount: 1700,
      createdAt: "2023-07-05",
    },
    {
      fromUserNumber: "1111111111",
      toUserNumber: "3333333333",
      amount: 1300,
      createdAt: "2023-07-14",
    },
    {
      fromUserNumber: "5555555555",
      toUserNumber: "6666666666",
      amount: 2900,
      createdAt: "2023-07-18",
    },
    {
      fromUserNumber: "6666666666",
      toUserNumber: "1111111111",
      amount: 650,
      createdAt: "2023-07-23",
    },
    {
      fromUserNumber: "1111111111",
      toUserNumber: "2222222222",
      amount: 800,
      createdAt: "2023-08-01",
    },
    {
      fromUserNumber: "2222222222",
      toUserNumber: "7777777777",
      amount: 3700,
      createdAt: "2023-08-05",
    },
    {
      fromUserNumber: "3333333333",
      toUserNumber: "6666666666",
      amount: 2200,
      createdAt: "2023-08-15",
    },
    {
      fromUserNumber: "4444444444",
      toUserNumber: "1111111111",
      amount: 4900,
      createdAt: "2023-08-20",
    },
    {
      fromUserNumber: "5555555555",
      toUserNumber: "8888888888",
      amount: 2600,
      createdAt: "2023-08-25",
    },
    {
      fromUserNumber: "6666666666",
      toUserNumber: "3333333333",
      amount: 3100,
      createdAt: "2023-08-28",
    },
    {
      fromUserNumber: "7777777777",
      toUserNumber: "1111111111",
      amount: 2300,
      createdAt: "2023-09-05",
    },
    {
      fromUserNumber: "8888888888",
      toUserNumber: "2222222222",
      amount: 5400,
      createdAt: "2023-09-10",
    },
    {
      fromUserNumber: "1111111111",
      toUserNumber: "4444444444",
      amount: 1600,
      createdAt: "2023-09-15",
    },
    {
      fromUserNumber: "2222222222",
      toUserNumber: "5555555555",
      amount: 900,
      createdAt: "2023-09-20",
    },
    {
      fromUserNumber: "3333333333",
      toUserNumber: "7777777777",
      amount: 2100,
      createdAt: "2023-09-25",
    },
    {
      fromUserNumber: "4444444444",
      toUserNumber: "8888888888",
      amount: 1200,
      createdAt: "2023-10-01",
    },
    {
      fromUserNumber: "5555555555",
      toUserNumber: "2222222222",
      amount: 4300,
      createdAt: "2023-10-07",
    },
    {
      fromUserNumber: "6666666666",
      toUserNumber: "7777777777",
      amount: 3300,
      createdAt: "2023-10-15",
    },
    {
      fromUserNumber: "7777777777",
      toUserNumber: "3333333333",
      amount: 5200,
      createdAt: "2023-10-20",
    },
    {
      fromUserNumber: "8888888888",
      toUserNumber: "1111111111",
      amount: 4100,
      createdAt: "2023-10-25",
    },
  ];

  for (const transferData of transfersData) {
    await prisma.$transaction(async (tx) => {
      const fromUser = await tx.user.findUnique({
        where: { number: transferData.fromUserNumber },
      });
      const toUser = await tx.user.findUnique({
        where: { number: transferData.toUserNumber },
      });

      // fromUser transaction
      await tx.$queryRawUnsafe(`
        INSERT INTO transactions (userId, category, amount, timestamp) 
        VALUES (${Number(fromUser?.id)}, 'fromUser', ${Number(transferData.amount) * 100}, '${new Date(transferData.createdAt).toISOString()}');
      `);

      // toUser transaction
      await tx.$queryRawUnsafe(`
        INSERT INTO transactions (userId, category, amount, timestamp) 
        VALUES (${Number(toUser?.id)}, 'toUser', ${Number(transferData.amount) * 100}, '${new Date(transferData.createdAt).toISOString()}');
      `);

      if (fromUser && toUser) {
        await tx.p2pTransfer.create({
          data: {
            amount: transferData.amount * 100,
            fromUserId: fromUser.id,
            toUserId: toUser.id,
            timestamp: new Date(transferData.createdAt),
          },
        });
      }
    });
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
