import { router } from "../trpc";
import { exampleRouter } from "./example";
import { pemKeysRouter } from "./key";

export const appRouter = router({
  example: exampleRouter,
  rsa: pemKeysRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
