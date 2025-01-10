// import NextAuth from "next-auth";
// import Google from "next-auth/providers/google";

// export const {
//   handlers: { GET, POST },
//   auth,
//   signIn,
//   signOut
// } = NextAuth({
//   providers: [
//     Google({
//       clientId: process.env.AUTH_GOOGLE_ID!,
//       clientSecret: process.env.AUTH_GOOGLE_SECRET!,
//     })
//   ],
//   pages: {
//     signIn: '/auth/login',
//   },
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token.id as string;
//       }
//       return session;
//     },
//   },
//   secret: process.env.AUTH_SECRET
// });
