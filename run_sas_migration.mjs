import { createConnection } from "mysql2/promise";
import { readFileSync } from "fs";

const sql = readFileSync("./drizzle/0003_sas_results.sql", "utf8");

const conn = await createConnection(process.env.DATABASE_URL);
try {
  for (const stmt of sql.split(";").map(s => s.trim()).filter(Boolean)) {
    console.log("Executing:", stmt.slice(0, 60) + "...");
    await conn.execute(stmt);
    console.log("✓ Done");
  }
  console.log("✅ Migration complete");
} catch (e) {
  if (e.code === "ER_TABLE_EXISTS_ERROR" || e.message?.includes("already exists")) {
    console.log("⚠️  Table already exists, skipping");
  } else {
    console.error("❌ Error:", e.message);
  }
} finally {
  await conn.end();
}
