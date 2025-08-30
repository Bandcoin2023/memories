import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { and, desc, eq } from "@acme/db";
import {
  CreateMediaSchema,
  CreateMemorySchema,
  CreateNFTSchema,
  media,
  memories,
  nfts,
} from "@acme/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";

export const memoryRouter = {
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.memories.findMany({
      orderBy: desc(memories.createdAt),
      limit: 20,
      with: {
        media: true,
        user: {
          columns: {
            id: true,
            name: true,
            image: true,
          },
        },
        nft: true,
      },
    });
  }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.memories.findFirst({
        where: eq(memories.id, input.id),
        with: {
          media: true,
          user: {
            columns: {
              id: true,
              name: true,
              image: true,
            },
          },
          nft: true,
          comments: {
            with: {
              user: {
                columns: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
          likes: true,
        },
      });
    }),

  byUserId: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.memories.findMany({
        where: eq(memories.userId, input.userId),
        orderBy: desc(memories.createdAt),
        with: {
          media: true,
          nft: true,
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        memory: CreateMemorySchema.omit({
          id: true,
          userId: true,
          createdAt: true,
          updatedAt: true,
        }),
        mediaItems: z.array(
          CreateMediaSchema.omit({
            id: true,
            memoryId: true,
          }),
        ),
        nft: CreateNFTSchema.omit({
          id: true,
          memoryId: true,
          ownerId: true,
          mintDate: true,
          tokenId: true,
          contractAddress: true,
        }).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const memoryId = crypto.randomUUID();
      const now = new Date();

      // Insert memory
      await ctx.db.insert(memories).values({
        id: memoryId,
        userId: ctx.session.user.id,
        ...input.memory,
        createdAt: now,
        updatedAt: now,
      });

      // Insert media items
      if (input.mediaItems.length > 0) {
        await ctx.db.insert(media).values(
          input.mediaItems.map((item, index) => ({
            id: crypto.randomUUID(),
            memoryId,
            ...item,
            order: index,
          })),
        );
      }

      // Insert NFT if provided
      if (input.nft) {
        await ctx.db.insert(nfts).values({
          id: crypto.randomUUID(),
          memoryId,
          ownerId: ctx.session.user.id,
          ...input.nft,
          mintDate: now,
          tokenId: `TOKEN_${memoryId}`, // Generate a token ID
          contractAddress: "0x1234567890123456789012345678901234567890", // Placeholder
          blockchain: "bandchain", // Default blockchain
        });
      }

      return { id: memoryId };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify ownership
      const memory = await ctx.db.query.memories.findFirst({
        where: eq(memories.id, input.id),
      });

      if (!memory || memory.userId !== ctx.session.user.id) {
        throw new Error("Memory not found or unauthorized");
      }

      return ctx.db.delete(memories).where(eq(memories.id, input.id));
    }),

  toggleLike: protectedProcedure
    .input(z.object({ memoryId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // This would need the likes table implementation
      // For now, just return success
      return { success: true };
    }),
} satisfies TRPCRouterRecord;
