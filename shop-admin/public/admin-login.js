// Всегда сбрасываем авторизацию при входе на логин
localStorage.removeItem("adminAuth");

// Очищаем поля при загрузке (на всякий случай)
document.getElementById("login").value = "";
document.getElementById("password").value = "";

// admin-login.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const loginInput = document.getElementById("login");
  const passwordInput = document.getElementById("password");
  const errorBlock = document.getElementById("login-error");

  // 🔐 Доступ только для нас
  const ADMIN_LOGIN = "admin";
  const ADMIN_PASSWORD = "123456";

  // Если уже залогинен — сразу в панель
  if (localStorage.getItem("adminAuth") === "true") {
    window.location.href = "admin-panel.html";
    return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const login = loginInput.value.trim();
    const pass = passwordInput.value.trim();

    if (login === ADMIN_LOGIN && pass === ADMIN_PASSWORD) {
      localStorage.setItem("adminAuth", "true");
      errorBlock.textContent = "";

      // 🧹 Очищаем поля перед переходом
      loginInput.value = "";
      passwordInput.value = "";

      window.location.href = "admin-panel.html";
    } else {
      errorBlock.textContent = "❌ Неверный логин или пароль";
    }
  });
});
