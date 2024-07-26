"use server";

import db from "@repo/db/client";
import { RampStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

import jwt from "jsonwebtoken";

function generateUniqueToken(length = 32) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    token += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return token;
}

export interface jwtPayloadProp {
  userId: string;
  name: string;
  amount: number;
  onRampToken: string;
}

async function getJwtSignedToken(
  payload: jwtPayloadProp,
): Promise<string | null> {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.warn("JWT_SECRET is not defined. JWT token cannot be created.");
    return null;
  }

  try {
    const token: string = jwt.sign(payload, secret);
    return token;
  } catch (e) {
    console.error("Error signing JWT:", e);
    return null;
  }
}

export async function startOnRampTransaction(provider: string, amount: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !session.user?.id) {
    return {
      message: "Unauthenticated request",
    };
  }

  // go to DB and create onRampTransaction entry using onRampToken
  const onRampToken = generateUniqueToken();

  await db.onRampTransaction.create({
    data: {
      provider,
      token: onRampToken,
      status: RampStatus.Processing,
      startTime: new Date(),
      amount: amount * 100,
      userId: Number(session?.user?.id),
    },
  });

  let user = await db.user.findUnique({
    where: {
      id: Number(session?.user?.id),
    },
    select: {
      name: true,
    },
  });
  let name: string;
  if (!user || !user.name) name = "Anonymous";
  else name = user.name;

  // go to bank server with {userId, name, amount, (also some secret cookie/ jwt preferable for bank to know your verified application)}
  // bank server will return batoken (BankApiToken), usually that contains payload with userId, amount, onRampToken to pass to
  // netbanking.bankservice.com, but here, we will pass {userId, amount, onRampToken} in body + batoken in headers from FE to netbanking service

  // assuming bank server takes 0.5 second to respond with batoken
  // BANK SERVER PROCESSING TIME
  await new Promise((resolve) => setTimeout(resolve, 500));

  const payload: jwtPayloadProp = {
    userId: session?.user?.id,
    amount,
    name: name,
    onRampToken,
  };

  // bank server returns batoken
  const batoken: string | null = await getJwtSignedToken(payload);
  if (!batoken) {
    throw new Error("Failed to generate batoken");
  }

  // TODO: return back {userId, amount, onRampToken} payload inside batoken (jwt token),
  // TODO: to FE, then redirect to bank.netbanking.service url.
  // WHY jwt? so that it can carry a payload and can be decoded to get it on the netbanking service FE
  // const data = jwt.verify(batoken, process.env.JWT_SECRET ?? "");
  // or jwt.decode(batoken);
  // console.log(data);

  return { batoken };
}
