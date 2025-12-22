// Элемент <input type="file">
const fileInput = document.getElementById("image");

// Кнопка "Загрузить фото"
const uploadBtn = document.getElementById("upload-btn");

// Поле предпросмотра
const preview = document.getElementById("preview");

// Скрытое поле со ссылкой (image_url)
const imageUrlInput = document.getElementById("image_url");

// Обработка загрузки файла
uploadBtn.addEventListener("click", async () => {
  const file = fileInput.files[0];
  if (!file) {
    alert("Родной, выбери файл ❤️");
    return;
  }

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch("/api/products/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (data.url) {
    imageUrlInput.value = data.url;

    // Показываем предпросмотр
    preview.src = data.url;
    preview.style.display = "block";

    alert("Фото загружено!");
  } else {
    alert("Ошибка загрузки!");
  }
});

document.getElementById("create-btn").addEventListener("click", async () => {
  const title = document.getElementById("title").value;
  const price = document.getElementById("price").value;
  const description = document.getElementById("description").value;
  const image_url = document.getElementById("image_url").value;
  const category = document.getElementById("category").value;

  const body = { title, price, description, image_url };

  const res = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  alert("Товар создан!");
});
