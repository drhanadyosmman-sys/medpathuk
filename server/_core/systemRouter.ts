import { z } from "zod";
import { publicProcedure, router } from "./trpc";

// A `notifyOwner` procedure used to live here, delivering owner alerts through
// the Manus Notification Service. It could not work off that platform and
// nothing in the app called it. If owner notifications are wanted again, send
// them by email rather than reintroducing a platform-specific service.
export const systemRouter = router({
  health: publicProcedure
    .input(
      z.object({
        timestamp: z.number().min(0, "timestamp cannot be negative"),
      })
    )
    .query(() => ({
      ok: true,
    })),
});
