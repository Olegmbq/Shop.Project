import React, { useEffect, useState } from "react";
import "../styles/theme.css";

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button className="theme-btn" onClick={toggle}>
      {theme === "dark" ? "🌞 Светлая" : "🌙 Тёмная"}
    </button>
  );
};

export default ThemeToggle;
