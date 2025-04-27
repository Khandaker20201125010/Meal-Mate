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
        token.role = user.role || "customer";
        token.status = user.status || "regular"; // Ensure status is set
        token.email = user.email;
        token.id = user.id;
      } else {
        await connectDB();
        const currentUser = await Users.findOne({ email: token.email });
        if (currentUser) {
          token.role = currentUser.role;
          token.status = currentUser.status; // Ensure status is included
          token.id = currentUser._id.toString();
        }
      }
      return token;
    },
    // Session Callback to attach JWT data to the session
    async session({ session, token }) {
      session.user.role = token.role;
      session.user.status = token.status; // Ensure status is included
      session.user.email = token.email;
      session.user.id = token.id;
      return session;
    }, 
    // Sign-in Callback for handling OAuth sign-in
    async signIn({ user, account }) {
      if (account.provider === "google" || account.provider === "facebook") {
        const { email } = user;
        try {
          await connectDB();
    
          // Try to find existing user
          let currentUser = await Users.findOne({ email });
    
          if (!currentUser) {
            // Create new user with all required fields
            currentUser = await Users.create({
              name: user.name,
              email: user.email,
              image: user.image,
              role: "customer",
              status: "regular", // Explicitly set status
              provider: account.provider,
            });
          } else {
            // Ensure status exists for existing users
            if (!currentUser.status) {
              currentUser.status = "regular";
              await currentUser.save();
            }
          }
    
          // Attach all required fields to the user object
          user.role = currentUser.role;
          user.status = currentUser.status; // Make sure status is included
          user.email = currentUser.email;
          user.id = currentUser._id.toString();
    
          return true;
        } catch (err) {
          console.error("Error during OAuth sign-in:", err);
          return false;
        }
      }
      return true;
    }

  },
});

export { handler as GET, handler as POST };
