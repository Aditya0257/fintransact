import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import db from "@repo/db/client";
import { AuthType } from "@prisma/client";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }: any) {
      console.log("in signin callback in merchant app \n");
      console.log(user);
      console.log(account);

      if (!user || !user.email) {
        return false;
      }

      const result = await db.merchant.upsert({
        select: {
          id: true, // Only return the id field of the Merchant record
        },
        where: {
          email: user.email, // Look for a merchant with this email
        },
        create: {
          email: user.email, // If no merchant is found, create a new one with this email
          name: user.name,
          auth_type:
            account.provider === "google" ? AuthType.Google : AuthType.Github,
        },
        update: {
          name: user.name, // If a merchant is found, update the name and auth type
          auth_type:
            account.provider === "google" ? AuthType.Google : AuthType.Github,
        },
      });

      (user as { id?: string }).id = result.id.toString();
      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "secret",
};
