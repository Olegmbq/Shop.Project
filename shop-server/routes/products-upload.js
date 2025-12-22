import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { db } from "../utils/db-server.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === НАСТРОЙКА ХРАНЕНИЯ ФАЙЛОВ ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    // Удаляем пробелы из имени файла
    let cleanName = file.originalname.replace(/\s+/g, "_");

    // Уникальное имя
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);

    const ext = path.extname(cleanName);

    cb(null, `${unique}${ext}`);
  },
});

const upload = multer({ storage });

// ✏️ Обновить товар + изменить фото (если загружено новое)
// === СОЗДАТЬ ТОВАР С НЕСКОЛЬКИМИ ФОТО ===
router.post("/products", upload.array("images", 6), async (req, res) => {
  try {
    const { title, price, description, category } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "Фото не загружено" });
    }

    const imageUrls = req.files.map(
      (file) => `http://localhost:4000/uploads/${file.filename}`
    );

    const mainImage = imageUrls[0]; // главное фото
    const imagesJson = JSON.stringify(imageUrls);

    const [result] = await db.execute(
      "INSERT INTO products (title, price, description, image_url, images, category) VALUES (?, ?, ?, ?, ?, ?)",
      [title, price, description, mainImage, imagesJson, category]
    );

    res.json({
      message: "Товар успешно создан",
      id: result.insertId,
      images: imageUrls,
    });
  } catch (err) {
    console.error("Ошибка при создании товара:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

export default router;
