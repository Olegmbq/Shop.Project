import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Загружаем .env по абсолютному пути
dotenv.config({ path: "C:/Users/marti/Desktop/Shop.Project/shop-server/.env" });

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
