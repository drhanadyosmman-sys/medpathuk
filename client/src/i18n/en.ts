import { activate } from "./en/activate";
import { admin } from "./en/admin";
import { auth } from "./en/auth";
import { chat } from "./en/chat";
import { common } from "./en/common";
import { dashboard } from "./en/dashboard";
import { home } from "./en/home";
import { links } from "./en/links";
import { notFound } from "./en/notFound";
import { pricing } from "./en/pricing";
import { questionnaire } from "./en/questionnaire";
import { resources } from "./en/resources";
import { roadmap } from "./en/roadmap";
import { sas } from "./en/sas";
import { sasHistory } from "./en/sasHistory";

/**
 * English is the fallback dictionary. Every key that exists anywhere must exist
 * here, so a missing Arabic translation degrades to a real sentence rather than
 * to a dotted key on screen.
 *
 * One module per area, so translation work on different pages never lands in
 * the same file.
 */
export const en = {
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

export type Dictionary = typeof en;
