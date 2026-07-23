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
import { questionnaire } from "./ar/questionnaire";
import { resources } from "./ar/resources";
import { roadmap } from "./ar/roadmap";
import { sas } from "./ar/sas";
import { sasHistory } from "./ar/sasHistory";

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
  questionnaire,
  resources,
  roadmap,
  sas,
  sasHistory,
} as const;
