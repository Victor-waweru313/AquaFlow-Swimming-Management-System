import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { comparePasswords, findDemoUserByEmail } from "@/lib/auth";
import { z } from "zod";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  role: z.enum(["ADMIN", "COACH", "ACCOUNTANT", "SWIMMER"]),
});

export const authConfig: NextAuthConfig = {
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedCredentials = credentialsSchema.safeParse(credentials);

        if (!validatedCredentials.success) {
          return null;
        }

        const normalizedEmail = validatedCredentials.data.email.toLowerCase();
        const demoUser = await findDemoUserByEmail(normalizedEmail);

        let user: any = demoUser
          ? {
              id: demoUser.id,
              email: demoUser.email,
              name: demoUser.name,
              role: demoUser.role,
              passwordHash: demoUser.passwordHash,
              avatarUrl: demoUser.avatarUrl,
            }
          : null;

        if (!user) {
          try {
            user = await db.user.findUnique({
              where: { email: normalizedEmail },
            });
          } catch (error) {
            console.error("Database auth fallback failed:", error);
          }
        }

        if (!user) {
          return null;
        }

        const passwordsMatch = await comparePasswords(
          validatedCredentials.data.password,
          user.passwordHash
        );

        if (!passwordsMatch) {
          return null;
        }

        if (user.role !== validatedCredentials.data.role) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.avatarUrl,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (!url.startsWith(baseUrl)) {
        return url;
      }

      if (url === baseUrl || url === `${baseUrl}/login` || url === `${baseUrl}/api/auth/signin`) {
        return baseUrl;
      }

      return url;
    },
  },
  pages: {
    signIn: "/login",
  },
};
