import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// Проверка загрузки
console.log("🔥 adminRoutes loaded");

// Получаем корректный __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Тестовый маршрут
router.get("/test", (req, res) => {
  res.send("ADMIN WORKS");
});

// Страница добавления товара
router.get("/add-product", (req, res) => {
  const filePath = path.join(
    __dirname,
    "..",
    "public",
    "admin",
    "add-product.html"
  );
  console.log("🔥 sending file:", filePath);
  res.sendFile(filePath);
});
// 🔐 ЛОГИН АДМИНА
router.post("/login", (req, res) => {
  const { login, password } = req.body;

  const ADMIN_LOGIN = "admin";
  const ADMIN_PASSWORD = "12345";

  if (login === ADMIN_LOGIN && password === ADMIN_PASSWORD) {
    return res.json({ success: true, message: "Добро пожаловать!" });
  }

  res
    .status(401)
    .json({ success: false, message: "Неверный логин или пароль" });
});

export default router;
