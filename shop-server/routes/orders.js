// shop-server/routes/orders.js
import express from "express";
import { db } from "../utils/db-server.js";

const router = express.Router();

// 📌 Получить все заказы + товары по каждому
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT 
        o.id,
        o.customer_name,
        o.customer_phone,
        o.total_price,
        o.status,
        o.created_at,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'product_id', oi.product_id,
            'quantity', oi.quantity,
            'price', oi.price,
            'title', p.title
          )
        ) AS items
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.id
      LEFT JOIN products p ON p.id = oi.product_id
      GROUP BY o.id
      ORDER BY o.id DESC
      `
    );

    const result = rows.map((row) => ({
      ...row,
      items: row.items ? JSON.parse(row.items) : [],
    }));

    res.json(result);
  } catch (err) {
    console.error("Ошибка при получении заказов:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// 📌 Получить один заказ по ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      `
      SELECT 
        o.id,
        o.customer_name,
        o.customer_phone,
        o.total_price,
        o.status,
        o.created_at,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'product_id', oi.product_id,
            'quantity', oi.quantity,
            'price', oi.price,
            'title', p.title
          )
        ) AS items
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.id
      LEFT JOIN products p ON p.id = oi.product_id
      WHERE o.id = ?
      GROUP BY o.id
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Заказ не найден" });
    }

    const row = rows[0];
    row.items = row.items ? JSON.parse(row.items) : [];

    res.json(row);
  } catch (err) {
    console.error("Ошибка при получении заказа:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// 📌 Создать заказ
router.post("/", async (req, res) => {
  const { customer_name, customer_phone, items, total_price } = req.body;

  if (!customer_name || !customer_phone || !items || !items.length) {
    return res
      .status(400)
      .json({ error: "Заполните все поля и добавьте товары" });
  }

  try {
    // 1) создаём заказ
    const [orderRes] = await db.execute(
      "INSERT INTO orders (customer_name, customer_phone, total_price) VALUES (?, ?, ?)",
      [customer_name, customer_phone, total_price]
    );

    const orderId = orderRes.insertId;

    // 2) сохраняем товары заказа
    for (const item of items) {
      await db.execute(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, item.product_id, item.quantity, item.price]
      );
    }

    res.json({ id: orderId, message: "Заказ создан" });
  } catch (err) {
    console.error("Ошибка при создании заказа:", err);
    res.status(500).json({ error: "Ошибка при создании заказа" });
  }
});

// 📌 Обновить статус заказа
router.put("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowed = ["new", "processing", "shipped", "completed"];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: "Некорректный статус" });
  }

  try {
    const [result] = await db.execute("UPDATE orders SET status=? WHERE id=?", [
      status,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Заказ не найден" });
    }

    res.json({ message: "Статус обновлён" });
  } catch (err) {
    console.error("Ошибка при обновлении статуса:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// 📌 Удалить заказ
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.execute("DELETE FROM orders WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Заказ не найден" });
    }

    // order_items удалятся автоматически из-за ON DELETE CASCADE
    res.json({ message: "Заказ удалён" });
  } catch (err) {
    console.error("Ошибка при удалении заказа:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

export default router;
