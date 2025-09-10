import "server-only";

import { cache } from "react";
import { headers } from "next/headers";

import { createAuth } from "@acme/auth";
import { db } from "@acme/db/client";

import { env } from "~/env";

const baseUrl =
  env.VERCEL_ENV === "production"
    ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`
    : env.VERCEL_ENV === "preview"
      ? `https://${env.VERCEL_URL}`
      : "http://localhost:3000";

// export const auth = initAuth({
//   baseUrl,
//   productionUrl: `https://${env.VERCEL_PROJECT_PRODUCTION_URL ?? "turbo.t3.gg"}`,
//   secret: process.env.AUTH_SECRET,
// });

export const auth = createAuth({
  db,
});

export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() }),
);
