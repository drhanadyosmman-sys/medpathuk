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

export async function runMigrations(): Promise<void> {
  const url = process.env.DATABASE_URL;

  if (!url) {
    console.warn(
      "[Migrations] DATABASE_URL is not set — skipping. Anything that reads or writes data will fail."
    );
    return;
  }

  const db = drizzle(url);

  try {
    await migrate(db, { migrationsFolder: MIGRATIONS_FOLDER });
    console.log("[Migrations] Database schema is up to date");
  } catch (error) {
    // Starting with a half-built schema produces confusing failures later —
    // every query against a missing table looks like a separate bug. Fail here
    // instead, where the cause is legible.
    console.error("[Migrations] Failed to apply migrations:", error);
    throw error;
  } finally {
    // The migrator opens its own pool; leaving it open holds the process alive.
    try {
      await db.$client.end();
    } catch {
      /* already closed, or never opened */
    }
  }
}
