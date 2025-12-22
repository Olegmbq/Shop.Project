import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/admin.css";
import logo from "../assets/logo.png";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    document.body.classList.toggle("light", saved === "light");
    document.body.classList.toggle("dark", saved !== "light");
  }, []);

  const toggleTheme = () => {
    const isDark = document.body.classList.contains("dark");
    document.body.classList.toggle("dark", !isDark);
    document.body.classList.toggle("light", isDark);
    localStorage.setItem("theme", isDark ? "light" : "dark");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login === "admin" && password === "123456") {
      localStorage.setItem("admin-auth", "true");
      navigate("/admin-panel");
    } else {
      setError("Неверный логин или пароль");
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-box">
        <button className="theme-btn login-theme-btn" onClick={toggleTheme}>
          🌙 / ☀️
        </button>

        <div className="admin-logo-wrapper" onClick={() => navigate("/")}>
          <img src={logo} className="brand-icon" alt="Brand" />
          <h1 className="brand-text">Neon Admin</h1>
        </div>

        <form onSubmit={handleLogin}>
          <label>Логин</label>
          <input value={login} onChange={(e) => setLogin(e.target.value)} />

          <label>Пароль</label>
          <input
            type="password"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="admin-error">{error}</p>}

          <button className="admin-btn" type="submit">
            Войти в панель
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
