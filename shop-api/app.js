import express from "express";
import cors from "cors";
import path from "path";
import { db } from "../shop-server/db.js"; // ✔ верный путь!!!
import productsRoutes from "./routes/products.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Даем доступ к загруженным изображениям
app.use("/uploads", express.static(path.resolve("uploads")));

// Роуты для товаров
app.use("/products", productsRoutes);

/* =====================================================
   РОУТ ДЛЯ ОФОРМЛЕНИЯ ЗАКАЗА
===================================================== */
// 🆕 Маршрут оформления заказа
app.post("/orders", async (req, res) => {
  try {
    const {
      customer_name,
      customer_phone,
      customer_address,
      customer_comment,
      total,
    } = req.body;

    const [result] = await db.query(
      "INSERT INTO orders (customer_name, customer_phone, comment, total_price) VALUES (?, ?, ?, ?)",
      [customer_name, customer_phone, customer_comment || "", total]
    );

    return res.json({
      success: true,
      orderId: result.insertId,
    });
  } catch (error) {
    console.error("Ошибка создания заказа:", error);
    return res.status(500).json({ success: false, message: "Ошибка сервера" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🟢 API запущено: http://localhost:${PORT}`);
});
