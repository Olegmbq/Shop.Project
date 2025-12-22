import express from "express";
import { db } from "../utils/db-server.js";

const router = express.Router();

// === 📦 Получить все товары ===
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("❌ Ошибка при получении товаров:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// === 📌 Получить товар по ID ===
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Товар не найден" });
    }

    res.json(rows[0]); // Возвращаем один объект товара
  } catch (err) {
    console.error("❌ Ошибка при получении товара:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

export default router;
