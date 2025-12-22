import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/admin.css";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  image_url: string;
  category: string;
}

const AdminPanel: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  // ============================
  // 📌 Загрузка товаров
  // ============================
  const loadProducts = async () => {
    const res = await axios.get("http://localhost:4000/api/products");
    setProducts(res.data);
  };

  useEffect(() => {
    loadProducts();

    // Загружаем тему при входе

    const saved = localStorage.getItem("site-theme");
    if (saved === "dark") document.body.classList.add("dark");
    else document.body.classList.remove("dark");
  }, []);

  // ============================
  // 🔒 Выйти
  // ============================
  const logout = () => {
    localStorage.removeItem("admin-auth");
    navigate("/admin-login");
  };

  // ============================
  // 🌙 Переключение темы
  // ============================
  const toggleTheme = () => {
    document.body.classList.toggle("dark");

    localStorage.setItem(
      "site-theme",
      document.body.classList.contains("dark") ? "dark" : "light"
    );
  };

  // ============================
  // 🗑 Удаление товара
  // ============================
  const removeProduct = async (id: number) => {
    if (!window.confirm("Удалить товар?")) return;

    await axios.delete(`http://localhost:4000/api/products/${id}`);

    // обновляем список
    loadProducts();
  };

  return (
    <div className="admin-page">
      {/* ====== Шапка ====== */}

      <div className="admin-topbar">
        <div className="admin-title logo-title" onClick={() => navigate("/")}>
          <img src={logo} alt="Logo" className="brand-icon-admin" />
          Панель администратора
        </div>

        <div className="admin-top-right">
          <button className="theme-btn" onClick={toggleTheme}>
            🌙 / ☀️
          </button>

          <button className="admin-home" onClick={() => navigate("/")}>
            🏠 На сайт
          </button>

          <button className="admin-logout" onClick={logout}>
            Выйти
          </button>
        </div>
      </div>

      <button className="admin-home" onClick={() => navigate("/admin-orders")}>
        📦 Заказы
      </button>

      {/* ====== Добавить товар ====== */}
      <button className="admin-add-btn" onClick={() => navigate("/admin-add")}>
        ➕ Добавить товар
      </button>

      {/* ====== Сетка товаров ====== */}
      <div className="admin-grid">
        {products.map((p) => (
          <div className="admin-card" key={p.id}>
            {/* ✔ Фото с правильным URL */}
            <img
              src={
                p.image_url.startsWith("http")
                  ? p.image_url
                  : `http://localhost:4000${p.image_url}`
              }
              className="admin-img"
              alt={p.title}
            />

            <h3>{p.title}</h3>
            <p className="ap-cat">{p.category}</p>
            <p className="ap-price">{p.price} $</p>

            <div className="ap-buttons">
              <button
                className="ap-edit"
                onClick={() => navigate(`/admin-edit/${p.id}`)}
              >
                ✏ Редактировать
              </button>

              <button
                className="ap-delete"
                onClick={async () => {
                  if (!window.confirm("Удалить товар?")) return;

                  await axios.delete(
                    `http://localhost:4000/api/products/${p.id}`
                  );
                  loadProducts(); // ← обновляем список
                }}
              >
                🗑 Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
