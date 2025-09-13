import type { TRPCRouterRecord } from "@trpc/server";

import { createToken } from "../lib/stellar/create-token";
import { protectedProcedure, publicProcedure } from "../trpc";

export const trxRouter = {
  getXdr: protectedProcedure.mutation(async ({ ctx }) => {
    const userPublicKey = ctx.session.user.stellarPublicKey;
    if (!userPublicKey)
      throw new Error("User does not have a Stellar public key");
    const xdr = await createToken({ userPublicKey });
    return xdr;
  }),
} satisfies TRPCRouterRecord;
