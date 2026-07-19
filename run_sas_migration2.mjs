import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const sqls = [
  // Add specialtyName column if it doesn't exist
  `ALTER TABLE sas_results ADD COLUMN IF NOT EXISTS specialtyName VARCHAR(128) AFTER specialty`,
];

for (const sql of sqls) {
  try {
    await conn.execute(sql);
    console.log("✅ Executed:", sql.substring(0, 80));
  } catch (e) {
    if (e.code === "ER_DUP_FIELDNAME" || e.message.includes("Duplicate column")) {
      console.log("⏭️  Column already exists, skipping:", sql.substring(0, 80));
    } else {
      console.error("❌ Error:", e.message);
    }
  }
}

await conn.end();
console.log("✅ Migration complete");
