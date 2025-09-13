import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import * as z from "zod";

const app = new Hono();

// Transaction schema for validation
const transactionSchema = z.object({
  amount: z.number().positive(),
  description: z.string().min(1),
  category: z.string().optional(),
  type: z.enum(["income", "expense"]),
});

const updateTransactionSchema = transactionSchema.partial();

// GET /trx - Get all transactions
const getAllTransactions = app.get("/", (c) => {
  // Mock data - replace with actual database logic
  const transactions = [
    {
      id: "1",
      amount: 100,
      description: "Grocery shopping",
      category: "food",
      type: "expense",
      createdAt: new Date().toISOString(),
    },
  ];

  return c.json({ transactions });
});

// GET /trx/:id - Get transaction by ID
const getTransaction = app.get("/:id", (c) => {
  const id = c.req.param("id");

  // Mock data - replace with actual database logic
  const transaction = {
    id,
    amount: 100,
    description: "Grocery shopping",
    category: "food",
    type: "expense",
    createdAt: new Date().toISOString(),
  };

  return c.json({ transaction });
});

export default app;
export type TrxRoutes = typeof app;
