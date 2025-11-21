require("dotenv").config();
const { Pool } = require("pg");

console.log("Current directory:", process.cwd());
console.log("NODE_ENV:", process.env.NODE_ENV);

const url = process.env.DATABASE_URL;
console.log("DATABASE_URL defined:", !!url);

if (url) {
  const masked = url.replace(/(:)([^:@]+)(@)/, "$1****$3");
  console.log("DATABASE_URL (masked):", masked);
} else {
  console.log("WARNING: DATABASE_URL is not defined in process.env");
}

const pool = new Pool({
  connectionString: url || "",
});

console.log("Attempting to connect...");

pool
  .connect()
  .then(async (client) => {
    console.log("✅ Connected successfully!");

    try {
      const res = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'leads';
    `);

      console.log("📋 Columns in leads table:");
      res.rows.forEach((row) => {
        console.log(`   - ${row.column_name} (${row.data_type})`);
      });
    } catch (err) {
      console.error("❌ Error querying columns:", err.message);
    } finally {
      client.release();
      pool.end();
    }
  })
  .catch((err) => {
    console.error("❌ Connection failed:", err.message);
    if (err.message.includes("password")) {
      console.error("   -> This confirms the password issue.");
    }
    pool.end();
  });
