import { index, sqliteTableCreator } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

const createTable = sqliteTableCreator((name) => name);

export const Post = createTable("post", (d) => ({
  id: d.text().primaryKey().$defaultFn(crypto.randomUUID),
  title: d.text().notNull(),
  content: d.text().notNull(),
  createdAt: d.integer({ mode: "timestamp" }).notNull(),
  updatedAt: d.integer({ mode: "timestamp" }).notNull(),
}));

export const CreatePostSchema = createInsertSchema(Post);
