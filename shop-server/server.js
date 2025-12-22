// shop-server/server.js

import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
dotenv.config();

// ==== PATH FIX ====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 4000;
const app = express();

console.log("📌 SERVER DIR:", __dirname);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== STATIC FOLDERS =====
const ADMIN_PUBLIC = path.join(__dirname, "../shop-admin/public");
const CLIENT_PUBLIC = path.join(__dirname, "../shop-client/public");
const UPLOADS_DIR = path.join(__dirname, "../uploads");

console.log("📁 ADMIN STATIC:", ADMIN_PUBLIC);
console.log("📁 CLIENT STATIC:", CLIENT_PUBLIC);
console.log("📁 UPLOADS:", UPLOADS_DIR);

// Раздача загруженных изображений
app.use("/uploads", express.static(UPLOADS_DIR));

/* ======================================================
   API ROUTES
===================================================== */
import apiRoutes from "./routes/apiRoutes.js";
import newProductsRoute from "./routes/products-upload.js"; // ← НАШ НОВЫЙ РОУТ

// API
app.use("/api", apiRoutes);

// === НОВЫЙ РОУТ ДЛЯ ДОБАВЛЕНИЯ ТОВАРА С ФОТО ===
app.use("/", newProductsRoute);

// 🔐 Защита старой админки
app.use("/admin", (req, res, next) => {
  const token = req.headers["x-admin-auth"];
  if (token === "secret123") {
    next();
  } else {
    res.status(401).send("⛔ Доступ запрещён — требуется вход в админку");
  }
});

/* ======================================================
   ADMIN ROUTES (ТОЧНЫЕ)
===================================================== */
// Раздаём только логин-страницу новой админки
app.use("/admin-login.html", express.static(ADMIN_PUBLIC));

// 🚫 Старые админ-страницы → новый вход
app.get("/admin/admin.html", (req, res) => {
  res.redirect("http://localhost:5174/admin-login.html");
});

app.get("/admin/admin-orders.html", (req, res) => {
  res.redirect("http://localhost:5174/admin-login.html");
});

app.get("/admin/admin-add.html", (req, res) => {
  res.redirect("http://localhost:5174/admin-login.html");
});

app.get("/admin/admin-edit-product.html", (req, res) => {
  res.redirect("http://localhost:5174/admin-login.html");
});

/* ======================================================
   CLIENT SPA
===================================================== */
app.use("/", express.static(CLIENT_PUBLIC));

// Express 5: универсальный маршрут для всех клиентов
app.use((req, res) => {
  res.sendFile(path.join(CLIENT_PUBLIC, "index.html"));
});

/* ======================================================
   START SERVER
===================================================== */
app.listen(PORT, () => {
  console.log(`🔥 Server running at http://localhost:${PORT}`);
});
