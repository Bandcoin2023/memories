import type { TRPCRouterRecord } from "@trpc/server";

import { createToken } from "../lib/stellar/create-token";
import { protectedProcedure, publicProcedure } from "../trpc";

export const trxRouter = {
  getXdr: publicProcedure.mutation(async () => {
    const xdr = await createToken();
    return xdr;
  }),
} satisfies TRPCRouterRecord;
