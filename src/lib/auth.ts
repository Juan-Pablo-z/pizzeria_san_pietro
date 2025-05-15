import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { loginEmail } from "@/actions/auth-action";

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials: any) {
        if (!credentials) return null;
        try {
          const user: any = await loginEmail(credentials);
          return user;
        } catch (error) {
          throw new Error(error as string);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token = user;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user = token;
      }
      return session;
    },
  },
});
