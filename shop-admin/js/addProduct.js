document.getElementById("uploadBtn").addEventListener("click", async () => {
  const fileInput = document.getElementById("image");
  const file = fileInput.files[0];

  if (!file) {
    alert("Выберите файл!");
    return;
  }

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch("http://localhost:4000/api/products/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (data.url) {
    document.getElementById("image_url").value = data.url;
    alert("Фото загружено!");
  } else {
    alert("Ошибка загрузки фото");
  }
});
