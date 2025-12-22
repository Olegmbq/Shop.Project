async function login() {
  const login = document.getElementById("login").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!login || !password) {
    alert("Введите логин и пароль");
    return;
  }

  try {
    const res = await fetch("/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ login, password }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Добро пожаловать!");
      window.location.href = "/admin/panel.html";
    } else {
      alert(data.message || "Ошибка входа");
    }
  } catch (err) {
    console.error("Ошибка:", err);
    alert("Сервер недоступен");
  }
}

function logout() {
  window.location.href = "/admin/index.html";
}

