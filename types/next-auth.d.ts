import type { DefaultSession } from "next-auth";
import type { UserTier } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      tier: UserTier;
      trialStart: string | null;
      trialEnd: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    tier: UserTier;
    trialStart: string | null;
    trialEnd: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    tier?: UserTier;
    trialStart?: string | null;
    trialEnd?: string | null;
  }
}
