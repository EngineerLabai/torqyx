import type { DefaultSession } from "next-auth";
import type { UserTier } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      tier: UserTier;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    tier: UserTier;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    tier?: UserTier;
  }
}
