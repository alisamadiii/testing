import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";

import { user, account, session, verification } from "../db/schema";
import { db } from "../db";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }) => {
      await fetch(`${process.env.BETTER_AUTH_URL}/api/send`, {
        method: "POST",
        body: JSON.stringify({
          type: "reset-password",
          email: user.email,
          name: user.name,
          resetPasswordLink: `${url}?token=${token}`,
        }),
      });
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["github", "google"],
    },
  },
  user: {
    deleteUser: {
      enabled: true,
    },
    additionalFields: {
      seats: {
        type: "number",
      },
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user,
      account,
      session,
      verification,
    },
  }),
  plugins: [nextCookies(), admin()],
});
