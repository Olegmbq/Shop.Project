import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Загружаем .env по абсолютному пути
// Загружаем .env ИМЕННО ИЗ shop-api

dotenv.config({ path: "C:/Users/marti/Desktop/Shop.Project/shop-api/.env" }); // ← ВАЖНО

console.log("📌 ENV FROM API:", {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  name: process.env.DB_NAME,
});

export const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 3306,
});

console.log("Loaded DB_USER:", process.env.DB_USER);

try {
  await db.connect();
  console.log("✅ MySQL connected successfully");
} catch (err) {
  console.error("❌ MySQL connection error:", err.message);
}
