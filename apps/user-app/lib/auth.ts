import bcrypt from "bcrypt";
import db from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials";

// export const NEXT_AUTH_CONFIG = {
//   providers: [],
//   secret: process.env.NEXTAUTH_SECRET,
//   callbacks: {
//     jwt: async () => {},
//     session: () => {},
//   },
//   pages: {
//     signIn: "/signin",
//   },
// };
//

export const authOptions = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Phone number",
      credentials: {
        name: {
          label: "Name",
          type: "text",
          placeholder: "Name",
          required: true,
        },
        phone: {
          label: "Phone number",
          type: "text",
          placeholder: "1231231231",
          required: true,
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
          required: true,
        },
      },
      async authorize(credentials: any) {
        // Do zod validation, OTP validation here

        const hashedPassword = await bcrypt.hash(credentials.password, 10);
        const existingUser = await db.user.findFirst({
          where: {
            number: credentials.phone,
          },
        });

        if (existingUser) {
          const passwordValidation = await bcrypt.compare(
            credentials.password,
            existingUser.password,
          ); // in compare fn => plaintext password, hashed password

          if (passwordValidation) {
            return {
              id: existingUser.id.toString(),
              name: existingUser.name,
              number: existingUser.number,
            };
          }

          return null;
        }

        // new user with a new balance -> initially amount -> 0 => user needs to onRamp from bank

        try {
          const { user, balance } = await db.$transaction(async (tx) => {
            const user = await tx.user.create({
              data: {
                name: credentials.name,
                number: credentials.phone,
                password: hashedPassword,
              },
            });

            const balance = await tx.balance.create({
              data: {
                amount: 0,
                locked: 0,
                userId: Number(user.id.toString()),
              },
            });

            return { user, balance };
          });

          return {
            id: user.id.toString(),
            name: user.name,
            number: user.number,
          };
        } catch (e) {
          alert(`error occured while creating user: ${e}`);

          console.error(e);
        }

        return null;
      },
    }),
  ],
  secret: process.env.JWT_SECRET || "secret",
  callbacks: {
    jwt: async ({ user, token }: any) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session: ({ session, token }: any) => {
      if (session.user) {
        session.user.id = token.id;
      }
      // console.log(session);
      return session;
    },
  },
  // pages: {
  //   signIn: "/signin", // for custom signin page
  // },
};
