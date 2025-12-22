import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// ЛОГ ДЛЯ ОТЛАДКИ — ВСЕГДА ПОСЛЕ ОБЪЯВЛЕНИЯ router !!!
router.use((req, res, next) => {
  console.log("👉 clientRoutes получил запрос:", req.url);
  next();
});

// Правильное получение __dirname (для ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Главная
router.get("/", (req, res) => {
  res.send("🏠 Client route is working!");
});

// Каталог
router.get("/catalog", (req, res) => {
  const filePath = path.join(__dirname, "..", "public", "catalog.html");
  console.log("➡️ Отдаём каталог:", filePath);
  res.sendFile(filePath);
});

export default router;
