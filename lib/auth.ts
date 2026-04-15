import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import type { Provider } from "next-auth/providers";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcrypt";
import { z } from "zod";
import { TRIAL_DURATION_DAYS } from "@/constants/plans";
import { addDays } from "@/lib/billing";
import { prisma } from "@/lib/prisma";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const providers: Provider[] = [
  Credentials({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    authorize: async (credentials) => {
      const parsed = credentialsSchema.safeParse(credentials);
      if (!parsed.success) return null;

      const user = await prisma.user.findUnique({
        where: { email: parsed.data.email.toLowerCase() },
      });

      if (!user || !user.password) return null;
      const isValid = await bcrypt.compare(parsed.data.password, user.password);
      if (!isValid) return null;

      return {
        id: user.id,
        email: user.email,
        name: user.name ?? undefined,
        tier: user.tier,
        trialStart: user.trialStart ? user.trialStart.toISOString() : null,
        trialEnd: user.trialEnd ? user.trialEnd.toISOString() : null,
      };
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  );
}

const loadUserBillingById = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      tier: true,
      trialStart: true,
      trialEnd: true,
    },
  });
};

const authSecret =
  process.env.AUTH_SECRET ??
  (process.env.NODE_ENV === "production" ? undefined : "dev-only-auth-secret-change-me");

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  secret: authSecret,
  session: {
    strategy: "jwt",
  },
  providers,
  events: {
    createUser: async ({ user }: { user: { id?: string | null } }) => {
      if (!user?.id) return;
      const trialStart = new Date();
      const trialEnd = addDays(trialStart, TRIAL_DURATION_DAYS);

      try {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            trialStart,
            trialEnd,
          },
        });
      } catch (error) {
        console.error("[auth] failed to initialize trial window:", error);
      }
    },
  },
  callbacks: {
    jwt: async ({ token, user }: { token: any; user?: any }) => {
      if (user) {
        token.tier = user.tier;
        token.trialStart = user.trialStart;
        token.trialEnd = user.trialEnd;
      }
      return token;
    },
    session: async ({ session, token }: { session: any; token: any }) => {
      if (token) {
        session.user.id = token.sub!;
        session.user.tier = token.tier as any;
        session.user.trialStart = token.trialStart as string | null;
        session.user.trialEnd = token.trialEnd as string | null;
      }
      return session;
    },
  },
} as const;

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);