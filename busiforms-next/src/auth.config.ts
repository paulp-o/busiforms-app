import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import axios from "axios";

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    Google,
    //  Naver,
    //  Kakao,
  ],
  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
    async jwt({ token, user, session, account, profile, trigger }) {
      console.log("== JWT Callbacks ==");
      console.log("TOKEN", token);
      console.log("USER", user);
      console.log("SESSION", session);
      console.log("ACCOUNT", account);
      console.log("PROFILE", profile);
      console.log("TRIGGER", trigger);
      if (user) {
        // User is available during sign-in
        console.log("User is available during JWT generation:", user);
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      console.log("== Session Callbacks ==");
      console.log("SESSION", session);
      console.log("TOKEN", token);
      session.user.id = token.id as string;
      return session;
    },
    async signIn({ user, account, profile, credentials, email }) {
      console.log("== Sign In Callbacks ==");
      console.log("USER", user);
      console.log("ACCOUNT", account);
      console.log("PROFILE", profile);
      console.log("CREDENTIALS", credentials); // dont work
      console.log("EMAIL", email); // dont work
      try {
        await axios.post("http://localhost:3001/api/users/signIn", {
          email: user.email,
          userId: user.id,
          name: user.name,
          accountProvider: account?.provider,
          role: "user",
        });
        return true;
      } catch (error) {
        console.error("Error signing in", error);
        return false;
      }
    },
  },
} satisfies NextAuthConfig;
