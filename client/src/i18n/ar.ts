import { auth } from "./ar/auth";
import { common } from "./ar/common";

/**
 * Arabic. Structure mirrors the English dictionary; anything absent here falls
 * back to English at lookup time.
 */
export const ar = {
  auth,
  common,
} as const;
