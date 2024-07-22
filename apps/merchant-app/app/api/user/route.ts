import { NextResponse } from "next/server";
import db from "@repo/db/client";

export const GET = async () => {
  await db.user.create({
    data: {
      number: "1231231231",
      password: "randompassword",
    }
  })
  return NextResponse.json({
    message: "hi there",
  });
};
