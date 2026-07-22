export const ENV = {
  /**
   * Identifies this application inside session tokens. It was a Manus app id;
   * off Manus there is one application, so it falls back to a fixed name rather
   * than an empty string, which is what silently invalidated every session.
   */
  appId: process.env.VITE_APP_ID || "medpath-uk",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  /** Anthropic API key. The AI features do nothing without it. */
  anthropicApiKey: process.env.ANTHROPIC_API_KEY ?? "",
};
