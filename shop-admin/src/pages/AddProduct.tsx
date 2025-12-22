import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddProduct() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("phones");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(""); // локальный предпросмотр
  const [imageUrl, setImageUrl] = useState(""); // URL с сервера

  const [error, setError] = useState("");

  // === 📸 Выбор файла — делаем предпросмотр ===
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);

    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // === 📤 Загрузка фото на сервер ===
  const uploadImage = async () => {
    if (!imageFile) {
      setError("Выберите файл изображения");
      return;
    }

    const token = localStorage.getItem("admin_token");
    if (!token) return setError("Нет авторизации");

    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const res = await fetch("http://localhost:3000/api/products/upload", {
        method: "POST",
        headers: {
          Authorization: token,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ошибка загрузки фото");
        return;
      }

      setImageUrl(data.url); // URL фото с сервера
      setError("");
    } catch {
      setError("Ошибка сервера");
    }
  };

  // === ➕ Создание товара ===
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("admin_token");
    if (!token) return setError("Нет авторизации");

    if (!imageUrl) return setError("Сначала загрузите фото");

    try {
      const res = await fetch("http://localhost:3000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          title,
          price,
          description,
          category,
          image_url: imageUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ошибка создания товара");
        return;
      }

      navigate("/dashboard/products");
    } catch {
      setError("Сервер недоступен");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "20px", fontWeight: 700 }}>
        Добавить товар
      </h1>

      {error && (
        <p style={{ color: "red", marginBottom: "15px" }}>❌ {error}</p>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        {/* Категория */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            padding: "12px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        >
          <option value="phones">📱 Телефоны</option>
          <option value="laptops">💻 Ноутбуки</option>
          <option value="audio">🎧 Аудио</option>
          <option value="watches">⌚ Часы</option>
        </select>

        {/* Название */}
        <input
          type="text"
          placeholder="Название"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* Цена */}
        <input
          type="number"
          placeholder="Цена"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        {/* Описание */}
        <textarea
          placeholder="Описание"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Файл */}
        <input type="file" accept="image/*" onChange={handleFileChange} />

        {/* Предпросмотр локального файла */}
        {imagePreview && (
          <img
            src={imagePreview}
            alt="preview"
            style={{
              width: "150px",
              borderRadius: "10px",
              border: "1px solid #ddd",
            }}
          />
        )}

        {/* Предпросмотр с сервера */}
        {imageUrl && (
          <img
            src={"http://localhost:3000" + imageUrl}
            alt="uploaded"
            style={{
              width: "150px",
              borderRadius: "10px",
              border: "1px solid #ddd",
            }}
          />
        )}

        {/* Кнопка загрузки */}
        <button
          type="button"
          onClick={uploadImage}
          style={{
            padding: "12px",
            background: "#7b5cff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: 600,
          }}
        >
          📤 Загрузить фото
        </button>

        {/* Кнопка отправить */}
        <button
          type="submit"
          style={{
            padding: "14px",
            background: "#5439ff",
            color: "white",
            borderRadius: "8px",
            fontWeight: 600,
          }}
        >
          ➕ Создать товар
        </button>
      </form>

      {/* Назад */}
      <button onClick={() => navigate(-1)} style={{ marginTop: "20px" }}>
        ← Назад
      </button>
    </div>
  );
}

export default AddProduct;
