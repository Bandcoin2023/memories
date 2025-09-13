import { hc } from "hono/client";

import type { AppType } from "@acme/hono/src";

export const honoClient = hc<AppType>(
  "https://6pmchmr7hbk3pa67v65zanflre0kaiyo.lambda-url.us-west-2.on.aws/",
);
