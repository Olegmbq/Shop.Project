import express from "express";
import multer from "multer";
import path from "path";
import { db } from "../../shop-server/db.js";

const router = express.Router();

// 📂 Куда сохраняем файлы
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.resolve("uploads")),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, unique + ext);
  },
});

const upload = multer({ storage });

// 📌 Получить все товары
router.get("/", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM products");
  res.json(rows);
});

// 📌 Получить один товар
router.get("/:id", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [
    req.params.id,
  ]);
  res.json(rows[0] || {});
});

// 📌 Добавление товара
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, price, description, category } = req.body;

    if (!title || !price)
      return res.status(400).json({ message: "Название и цена обязательны" });

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const [result] = await db.query(
      "INSERT INTO products (title, price, description, category, image_url) VALUES (?, ?, ?, ?, ?)",
      [title, price, description, category, imageUrl]
    );

    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).send("Ошибка сервера");
  }
});

// 📌 Обновление товара
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, price, description, category } = req.body;
    const imageUrl = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.image_url;

    await db.query(
      "UPDATE products SET title=?, price=?, description=?, category=?, image_url=? WHERE id=?",
      [title, price, description, category, imageUrl, req.params.id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send("Ошибка обновления");
  }
});

// 📌 Удалить товар
router.delete("/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    const [result] = await db.query("DELETE FROM products WHERE id = ?", [
      productId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Товар не найден" });
    }

    res.json({ message: "Товар удалён" });
  } catch (err) {
    console.error("Ошибка удаления:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

export default router;
