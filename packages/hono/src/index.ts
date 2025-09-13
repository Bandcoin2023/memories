import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import z from "zod";

import trxRouter from "./routes/trx";

const app = new Hono();

// CORS is handled by the AWS Lambda Function URL configuration in sst.config.ts

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

const route = app
  .post(
    "/posts",
    zValidator(
      "form",
      z.object({
        title: z.string(),
        body: z.string(),
      }),
    ),
    (c) => {
      // ...
      return c.json(
        {
          ok: true,
          message: "Created!",
        },
        201,
      );
    },
  )
  .post("/trxs", zValidator("form", z.object({})), (c) => {
    // ...
    return c.json(
      {
        ok: true,
        message: "Created!",
      },
      201,
    );
  });

// Mount the transaction router
const appRouter = app.route("/trx", trxRouter);

export const handler = handle(app);
export type AppType = typeof route;
