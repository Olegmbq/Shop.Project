import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/header.css";
import CartButton from "./CartButton";
import logo from "../assets/logo.png"; // ← Наш логотип

const Header: React.FC = () => {
  const navigate = useNavigate();

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const total = cart.reduce(
      (sum: number, item: any) => sum + item.quantity,
      0
    );
    setCartCount(total);
  }, []);

  useEffect(() => {
    const handler = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const total = cart.reduce(
        (sum: number, item: any) => sum + item.quantity,
        0
      );
      setCartCount(total);
    };

    window.addEventListener("cartUpdated", handler);
    return () => window.removeEventListener("cartUpdated", handler);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="header">
      <div className="header-inner">
        {/* 🔥 ЛОГО С КАРТИНКОЙ И ТЕКСТОМ */}
        <div className="brand" onClick={() => navigate("/")}>
          <img src={logo} alt="Brand" className="brand-icon" />
          <span className="brand-title">Oleg & Neuro Shop</span>
        </div>

        <div className="header-controls">
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === "dark" ? "☀️ Светлая" : "🌙 Тёмная"}
          </button>

          {localStorage.getItem("adminAuth") === "true" && (
            <button
              className="back-admin-btn"
              onClick={() => navigate("/admin-panel")}
            >
              ← Админ
            </button>
          )}

          <CartButton count={cartCount} />
        </div>
      </div>
    </header>
  );
};

export default Header;
