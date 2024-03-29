import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { redirect } from "next/navigation";
import { Account } from "next-auth";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_SECRET || "";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn(params: unknown) {
      try {
        if (
          (params as { account: Account }).account.provider === "google" &&
          !!(params as { account: Account }).account.access_token
        ) {
          redirect("/");
        } else {
          redirect("/auth/error");
        }
      } catch (e) {
        console.error("error", e);
      }
      return true;
    },
    async jwt({ token, account }: { token: any; account: any }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({
      session,
      token,
      user,
    }: {
      session: any;
      token: any;
      user: any;
    }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      return session;
    },
  },
};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
