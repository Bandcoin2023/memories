import { hc } from "hono/client";

import type { AppType } from "@acme/hono/src";

const client = hc<AppType>(
  "https://6pmchmr7hbk3pa67v65zanflre0kaiyo.lambda-url.us-west-2.on.aws/",
);

const res = await client.posts.$post({
  form: { title: "Hello", body: "World" },
});
const data = await res.json();
