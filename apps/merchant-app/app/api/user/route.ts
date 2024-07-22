import { NextResponse } from "next/server";
import db from "@repo/db/client";

export const GET = async () => {
  await db.user.create({
    data: {
      name: "randomperson",
      password: "randompassword",
    },
  });
  return NextResponse.json({
    message: "hi there",
  });
};
