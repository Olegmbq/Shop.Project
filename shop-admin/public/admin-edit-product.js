// Получаем ID товара из адресной строки
const id = new URLSearchParams(window.location.search).get("id");

if (!id) {
  alert("❌ ID товара не найден");
  window.location.href = "admin-panel.html";
}

// Элементы формы
const titleInput = document.getElementById("title");
const priceInput = document.getElementById("price");
const descInput = document.getElementById("description");
const categorySelect = document.getElementById("category");
const imageInput = document.getElementById("image");
const previewImg = document.getElementById("preview");
const imageUrlInput = document.getElementById("image_url");
const uploadBtn = document.getElementById("upload-btn");
const form = document.getElementById("edit-form");

// 🔹 API с товарами — ПОРТ 3000
const API_URL = "http://localhost:3000/products";
// 🔹 Картинки — через сервер на 4000
const IMG_BASE = "http://localhost:4000";

// 📌 Подгружаем товар по ID
async function loadProduct() {
  try {
    const res = await fetch(`${API_URL}/${id}`);

    if (!res.ok) {
      throw new Error("Bad response: " + res.status);
    }

    const product = await res.json();

    // Если товара нет
    if (!product || !product.id) {
      alert("❌ Товар не найден в базе");
      window.location.href = "admin-panel.html";
      return;
    }

    // Заполняем поля
    titleInput.value = product.title || "";
    priceInput.value = product.price || "";
    descInput.value = product.description || "";
    categorySelect.value = product.category || "phones";

    // Картинка
    if (product.image_url) {
      // если в БД полный url — используем как есть
      // если относительный путь — добавляем IMG_BASE
      const src = product.image_url.startsWith("http")
        ? product.image_url
        : `${IMG_BASE}${product.image_url}`;

      previewImg.src = src;
      imageUrlInput.value = product.image_url;
    } else {
      previewImg.src = "/brand/default.png";
      imageUrlInput.value = "";
    }
  } catch (e) {
    console.error("Ошибка загрузки товара:", e);
    alert("Ошибка загрузки товара");
  }
}

// 📁 Кнопка «Загрузить новое фото» → открываем input type="file"
uploadBtn.addEventListener("click", () => {
  imageInput.click();
});

// 🖼 Предпросмотр выбранного файла
imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  previewImg.src = url;
});

// 💾 Сохранение изменений
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fd = new FormData();
  fd.append("title", titleInput.value.trim());
  fd.append("price", priceInput.value.trim());
  fd.append("description", descInput.value.trim());
  fd.append("category", categorySelect.value);

  // Если выбрали новый файл — отправляем его
  if (imageInput.files[0]) {
    fd.append("image", imageInput.files[0]);
  } else {
    // Иначе отправляем старый url
    fd.append("image_url", imageUrlInput.value.trim());
  }

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      body: fd,
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Ошибка обновления:", res.status, text);
      throw new Error("Bad response");
    }

    alert("✅ Товар успешно обновлён!");
  } catch (err) {
    console.error("Ошибка при сохранении:", err);
    alert("❌ Ошибка обновления товара");
  }
});

// Старт
loadProduct();
