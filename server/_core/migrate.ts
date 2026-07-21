import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";

// Applies any pending migrations at startup, so deploying the app and bringing
// its schema up to date are the same action. Drizzle records what it has run in
// its own table, so this is a no-op once the database is current.
//
// This runs from the server rather than a separate `drizzle-kit migrate` step
// because drizzle-kit is a dev dependency and may not be installed in a
// production image, whereas drizzle-orm always is.

const MIGRATIONS_FOLDER = "./drizzle";

/**
 * A database is often still starting when the app is. Retry a few times before
 * giving up, so a slow neighbour does not take the site down — but do give up,
 * rather than restart-looping forever against a genuinely wrong configuration.
 */
const MAX_ATTEMPTS = 5;
const RETRY_DELAY_MS = 3000;

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function attemptMigration(url: string): Promise<void> {
  const db = drizzle(url);
  try {
    await migrate(db, { migrationsFolder: MIGRATIONS_FOLDER });
  } finally {
    // The migrator opens its own pool; leaving it open holds the process alive.
    try {
      await db.$client.end();
    } catch {
      /* already closed, or never opened */
    }
  }
}

export async function runMigrations(): Promise<void> {
  const url = process.env.DATABASE_URL;

  if (!url) {
    console.warn(
      "[Migrations] DATABASE_URL is not set — skipping. Anything that reads or writes data will fail."
    );
    return;
  }

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      await attemptMigration(url);
      console.log("[Migrations] Database schema is up to date");
      return;
    } catch (error) {
      const lastAttempt = attempt === MAX_ATTEMPTS;
      console.error(
        `[Migrations] Attempt ${attempt}/${MAX_ATTEMPTS} failed:`,
        error instanceof Error ? error.message : error
      );

      // Serving on a half-built schema produces confusing failures later —
      // every query against a missing table looks like a separate bug. Stop
      // here, where the cause is legible.
      if (lastAttempt) throw error;
      await wait(RETRY_DELAY_MS);
    }
  }
}
