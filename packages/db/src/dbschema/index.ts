import { sqliteTableCreator } from "drizzle-orm/sqlite-core";

export const createTable = sqliteTableCreator((name) => name);

export * from "./auth-schema";
export * from "./post";
export * from "./memory";
