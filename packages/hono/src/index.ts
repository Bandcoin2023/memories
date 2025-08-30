import { Hono } from "hono";
import { handle } from "hono/aws-lambda";

const app = new Hono();

// CORS is handled by the AWS Lambda Function URL configuration in sst.config.ts

app.get("/", (c) => {
  return c.text("Hello Hono!" + JSON.stringify(process.env));
});

export const handler = handle(app);
