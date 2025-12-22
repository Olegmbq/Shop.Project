import express from "express";
import { db } from "../utils/db.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// 🔐 POST /api/auth/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // ищем админа в БД
    const [rows] = await db.execute(
      "SELECT * FROM admin_users WHERE username = ? AND password = ?",
      [username, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = rows[0];

    // создаём токен
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      "super-secret-key",
      { expiresIn: "2h" }
    );

    res.json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
