import { activate } from "./ar/activate";
import { admin } from "./ar/admin";
import { auth } from "./ar/auth";
import { chat } from "./ar/chat";
import { common } from "./ar/common";
import { dashboard } from "./ar/dashboard";
import { home } from "./ar/home";
import { links } from "./ar/links";
import { notFound } from "./ar/notFound";
import { pricing } from "./ar/pricing";
import { resources } from "./ar/resources";

/**
 * Arabic. Structure mirrors the English dictionary; anything absent here falls
 * back to English at lookup time.
 */
export const ar = {
  activate,
  admin,
  auth,
  chat,
  common,
  dashboard,
  home,
  links,
  notFound,
  pricing,
  resources,
} as const;
