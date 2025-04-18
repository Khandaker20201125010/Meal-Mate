import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import connectDB from "@/src/app/lib/connectDB";
import Users from "@/src/models/Users";

const handler = NextAuth({
  session: {
    strategy: "jwt", // JWT session strategy
    maxAge: 30 * 24 * 60 * 60, // Session expiry time (30 days)
  },
  providers: [
    // Credentials Provider for Email/Password Login
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const { email, password } = credentials;
        if (!email || !password) {
          throw new Error("Email and password are required");
        }
        await connectDB();
        const currentUser = await Users.findOne({ email });
        if (!currentUser) {
          throw new Error("User not found");
        }
        return currentUser;
      },
    }),
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // Facebook OAuth Provider
    FacebookProvider({
      clientId: process.env.FACEBOOK_APPID,
      clientSecret: process.env.FACEBOOK_SECRET,
    }),
  ],
  pages: {
    signIn: "/login", // Custom sign-in page
  },
  callbacks: {
    // JWT Callback to store role and email in JWT token
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role || "customer"; // Default to 'customer' if no role exists
        token.email = user.email;
      } else {
        await connectDB();
        const currentUser = await Users.findOne({ email: token.email });
        if (currentUser) {
          token.role = currentUser.role;
        }
      }
      return token;
    },
    // Session Callback to attach JWT data to the session
    async session({ session, token }) {
      session.user.role = token.role;
      session.user.email = token.email;
      return session;
    },
    // Sign-in Callback for handling OAuth sign-in
    async signIn({ user, account }) {
      if (account.provider === "google" || account.provider === "facebook") {
        const { email } = user;
        try {
          await connectDB();
          const userExists = await Users.findOne({ email });
          if (!userExists) {
            // Create a new user if not already in DB
            await Users.create({
              name: user.name,
              email: user.email,
              image: user.image,
              role: "customer",
              provider: account.provider,
              createdAt: new Date(),
            });
            
          }
          return true; // Successful login
        } catch (err) {
          console.log("Error during sign-in:", err);
          return false; // Failure
        }
      }
      return true; // Allow default sign-in
    },
  },
});

export { handler as GET, handler as POST };
