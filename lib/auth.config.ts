import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { comparePasswords, findDemoUserByEmail } from "@/lib/auth";
import { z } from "zod";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  role: z.enum(["ADMIN", "COACH", "ACCOUNTANT", "SWIMMER"]),
});

const shouldUsePrismaAdapter = Boolean(
  process.env.DATABASE_URL &&
    !process.env.DATABASE_URL.includes("localhost") &&
    !process.env.DATABASE_URL.includes("127.0.0.1") &&
    !process.env.DATABASE_URL.includes("[user")
);

export const authConfig: NextAuthConfig = {
  ...(shouldUsePrismaAdapter ? { adapter: PrismaAdapter(db) as any } : {}),
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedCredentials = credentialsSchema.safeParse(credentials);

        if (!validatedCredentials.success) {
          return null;
        }

        const demoUser = await findDemoUserByEmail(validatedCredentials.data.email);

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
              where: { email: validatedCredentials.data.email },
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
  },
  pages: {
    signIn: "/login",
  },
};
