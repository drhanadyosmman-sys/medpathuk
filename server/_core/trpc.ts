import { NOT_ADMIN_ERR_MSG, UNAUTHED_ERR_MSG } from '@shared/const';
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";

/**
 * Errors thrown below the router — a failed query, a dead connection — carry
 * details that should not leave the server. Drizzle puts the full SQL in the
 * message, so an unhandled query error hands any anonymous caller the table and
 * column names it touched. Replace those with something the user can act on,
 * and keep the original in the server log.
 *
 * Errors we raise deliberately (TRPCError) are written for the user already and
 * pass through unchanged.
 */
const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    const isDeliberate = error.cause instanceof TRPCError || error.code !== "INTERNAL_SERVER_ERROR";
    if (isDeliberate) return shape;

    console.error("[tRPC] Unhandled error:", error.cause ?? error);

    return {
      ...shape,
      message: "Something went wrong on our side. Please try again.",
      data: { ...shape.data, stack: undefined },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

const requireUser = t.middleware(async opts => {
  const { ctx, next } = opts;

  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(requireUser);

export const adminProcedure = t.procedure.use(
  t.middleware(async opts => {
    const { ctx, next } = opts;

    if (!ctx.user || ctx.user.role !== 'admin') {
      throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }

    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
      },
    });
  }),
);
