export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Point to the local email login page instead of Manus OAuth
export const getLoginUrl = (_returnPath?: string) => {
  return "/login";
};
