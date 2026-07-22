import { auth } from "./en/auth";
import { common } from "./en/common";

/**
 * English is the fallback dictionary. Every key that exists anywhere must exist
 * here, so a missing Arabic translation degrades to a real sentence rather than
 * to a dotted key on screen.
 *
 * One module per area, so translation work on different pages never lands in
 * the same file.
 */
export const en = {
  auth,
  common,
} as const;

export type Dictionary = typeof en;
