// 🔐 Защита админки от доступа без пароля
if (localStorage.getItem("adminAuth") !== "true") {
  window.location.href = "admin-login.html";
}

const API_URL = "http://localhost:3000/products";

const fileInput = document.getElementById("image_file");
const preview = document.getElementById("preview");
const dropZone = document.getElementById("drop-zone");
const form = document.getElementById("edit-form");
const backBtn = document.getElementById("back-btn");

const productId = new URLSearchParams(window.location.search).get("id");

// === Проверка ID ===
if (!productId) {
  alert("Ошибка: ID товара не найден");
  location.href = "admin-panel.html";
}

// === Загрузить товар ===
async function loadProduct() {
  const res = await fetch(`${API_URL}/${productId}`);
  const data = await res.json();

  document.getElementById("title").value = data.title;
  document.getElementById("price").value = data.price;
  document.getElementById("category").value = data.category;
  document.getElementById("description").value = data.description;
  document.getElementById("image_url").value = data.image_url;

  preview.src = data.image_url || "/uploads/default.png";
}

loadProduct();

// ========================================================
// 📁  DRAG & DROP Загрузка фото
// ========================================================

// 1) Клик по зоне → открыть выбор файла
dropZone.addEventListener("click", () => fileInput.click());

// 2) Перетаскивание
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("dragover");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragover");

  const file = e.dataTransfer.files[0];
  if (file) uploadPhoto(file);
});

// 3) Обычная загрузка файла
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (file) uploadPhoto(file);
});

// === Загрузка фото на backend ===
async function uploadPhoto(file) {
  // Локальное превью
  preview.src = URL.createObjectURL(file);

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch("http://localhost:4000/api/products/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  document.getElementById("image_url").value = data.url;

  // Красивое уведомление
  alert("Фото загружено 💜");
}

// === Сохранение изменений ===
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const updated = {
    title: document.getElementById("title").value,
    price: document.getElementById("price").value,
    category: document.getElementById("category").value,
    description: document.getElementById("description").value,
    image_url: document.getElementById("image_url").value,
  };

  await fetch(`${API_URL}/${productId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updated),
  });

  alert("✨ Родной, товар обновлён!");
  location.href = "admin-panel.html";
});

// === Назад ===
backBtn.onclick = () => (location.href = "admin-panel.html");
