import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: "./.env" }); // читаем переменные из shop-server/.env

export const db = await mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "12345",
  database: process.env.DB_NAME || "shop_db",
  connectionLimit: 10,
});

console.log("🟢 DB Connected!");
