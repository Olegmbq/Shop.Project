import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({ path: "../shop-server/.env" });

export const db = await mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "12345",
  database: process.env.DB_NAME || "shop_db",
});

console.log("🟢 MySQL connected →", process.env.DB_NAME || "shop_db");
