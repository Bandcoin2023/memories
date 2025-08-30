import { authRouter } from "./router/auth";
import { memoryRouter } from "./router/memory";
import { postRouter } from "./router/post";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  post: postRouter,
  memory: memoryRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
