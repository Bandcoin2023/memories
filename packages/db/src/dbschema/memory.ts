import { relations } from "drizzle-orm";
import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

import { createTable, user } from "./auth-schema";

export const memories = createTable("memories", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  type: text("type", { enum: ["photobook", "audiobook", "memory"] }).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const media = createTable("media", {
  id: text("id").primaryKey(),
  memoryId: text("memory_id")
    .notNull()
    .references(() => memories.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  type: text("type", { enum: ["image", "video", "audio"] }).notNull(),
  order: integer("order").notNull().default(0),
});

export const comments = createTable("comments", {
  id: text("id").primaryKey(),
  memoryId: text("memory_id")
    .notNull()
    .references(() => memories.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  text: text("text").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const likes = createTable(
  "likes",
  (t) => ({
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    memoryId: text("memory_id")
      .notNull()
      .references(() => memories.id, { onDelete: "cascade" }),
  }),
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.memoryId] }),
  }),
);

export const tags = createTable("tags", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const memoriesToTags = createTable(
  "memories_to_tags",
  (t) => ({
    memoryId: text("memory_id")
      .notNull()
      .references(() => memories.id, { onDelete: "cascade" }),
    tagId: text("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  }),
  (t) => ({
    pk: primaryKey({ columns: [t.memoryId, t.tagId] }),
  }),
);

export const nfts = createTable("nfts", {
  id: text("id").primaryKey(),
  memoryId: text("memory_id")
    .notNull()
    .references(() => memories.id, { onDelete: "cascade" }),
  ownerId: text("owner_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  price: integer("price").notNull(),
  royalty: integer("royalty").notNull(),
  mintDate: integer("mint_date", { mode: "timestamp" }).notNull(),
  tokenId: text("token_id").notNull(),
  contractAddress: text("contract_address").notNull(),
  blockchain: text("blockchain").notNull(),
});

export const audiobookChapters = createTable("audiobook_chapters", {
  id: text("id").primaryKey(),
  memoryId: text("memory_id")
    .notNull()
    .references(() => memories.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  start: integer("start").notNull(),
  duration: integer("duration").notNull(),
});

export const transactionHistory = createTable("transaction_history", {
  id: text("id").primaryKey(),
  nftId: text("nft_id")
    .notNull()
    .references(() => nfts.id, { onDelete: "cascade" }),
  type: text("type", { enum: ["mint", "sale"] }).notNull(),
  fromUserId: text("from_user_id").references(() => user.id, {
    onDelete: "set null",
  }),
  toUserId: text("to_user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  price: integer("price").notNull(),
  date: integer("date", { mode: "timestamp" }).notNull(),
  txHash: text("tx_hash").notNull(),
});

// Zod schemas for validation
export const CreateMemorySchema = createInsertSchema(memories, {
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const CreateMediaSchema = createInsertSchema(media);
export const CreateNFTSchema = createInsertSchema(nfts, {
  mintDate: z.date().optional(),
});

export const SelectMemorySchema = createSelectSchema(memories);
export const SelectMediaSchema = createSelectSchema(media);
export const SelectNFTSchema = createSelectSchema(nfts);

// Memory relations
export const memoriesRelations = relations(memories, ({ one, many }) => ({
  user: one(user, {
    fields: [memories.userId],
    references: [user.id],
  }),
  media: many(media),
  comments: many(comments),
  likes: many(likes),
  nft: one(nfts),
  tags: many(memoriesToTags),
}));

export const mediaRelations = relations(media, ({ one }) => ({
  memory: one(memories, {
    fields: [media.memoryId],
    references: [memories.id],
  }),
}));

export const nftsRelations = relations(nfts, ({ one, many }) => ({
  memory: one(memories, {
    fields: [nfts.memoryId],
    references: [memories.id],
  }),
  owner: one(user, {
    fields: [nfts.ownerId],
    references: [user.id],
  }),
  transactions: many(transactionHistory),
}));
