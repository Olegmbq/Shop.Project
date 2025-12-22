import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const [imageUrl, setImageUrl] = useState(""); // URL из базы
  const [newImageFile, setNewImageFile] = useState<File | null>(null); // выбранный файл
  const [localPreview, setLocalPreview] = useState(""); // локальный предпросмотр

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // === 🔄 Загружаем товар по ID ===
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/products/${id}`);
        const data = await res.json();

        setTitle(data.title);
        setPrice(String(data.price));
        setDescription(data.description);
        setCategory(data.category);
        setImageUrl(data.image_url);

        setLoading(false);
      } catch {
        setError("Ошибка загрузки товара");
      }
    };

    loadProduct();
  }, [id]);

  // === 📤 Загрузка нового изображения ===
  const uploadNewImage = async () => {
    if (!newImageFile) {
      setError("Выберите файл");
      return;
    }

    const formData = new FormData();
    formData.append("image", newImageFile);

    try {
      const res = await fetch("http://localhost:3000/api/products/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ошибка загрузки изображения");
        return;
      }

      setImageUrl(data.url);
      setError("");
    } catch {
      setError("Ошибка сервера при загрузке фото");
    }
  };

  // === 💾 Сохранение изменений ===
  const saveProduct = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          price: Number(price),
          description,
          category,
          image_url: imageUrl,
        }),
      });

      if (!res.ok) return alert("Ошибка сохранения");

      alert("Товар обновлён!");
      navigate("/dashboard/products");
    } catch {
      alert("Ошибка сервера");
    }
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "20px", fontWeight: 700 }}>
        Редактировать товар
      </h1>

      {/* Название */}
      <input
        placeholder="Название"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={inputStyle}
      />

      {/* Цена */}
      <input
        placeholder="Цена"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        style={inputStyle}
      />

      {/* Описание */}
      <textarea
        placeholder="Описание"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        style={inputStyle}
      />

      {/* Категория */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={inputStyle}
      >
        <option value="phones">📱 Телефоны</option>
        <option value="laptops">💻 Ноутбуки</option>
        <option value="audio">🎧 Аудио</option>
        <option value="watches">⌚ Часы</option>
      </select>

      <h3>Текущее изображение:</h3>

      {imageUrl && (
        <img
          src={"http://localhost:3000" + imageUrl}
          alt="product"
          style={{
            width: "180px",
            borderRadius: "12px",
            marginBottom: "15px",
            border: "1px solid #ccc",
          }}
        />
      )}

      {/* Выбор нового файла */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          setNewImageFile(file);
          if (file) setLocalPreview(URL.createObjectURL(file));
        }}
      />

      {/* Локальный предпросмотр */}
      {localPreview && (
        <img
          src={localPreview}
          alt="preview"
          style={{
            width: "180px",
            borderRadius: "12px",
            marginTop: "10px",
            marginBottom: "10px",
            border: "1px solid #ccc",
          }}
        />
      )}

      {/* Кнопка загрузить фото */}
      <button style={uploadButton} onClick={uploadNewImage}>
        📤 Загрузить новое фото
      </button>

      {/* Сохранить */}
      <button style={saveButton} onClick={saveProduct}>
        💾 Сохранить изменения
      </button>

      {/* Назад */}
      <button
        onClick={() => navigate("/dashboard/products")}
        style={backButton}
      >
        ← Назад
      </button>
    </div>
  );
}

export default EditProduct;

// === Стили ===
const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  marginBottom: "15px",
};

const uploadButton = {
  background: "#7b5cff",
  color: "white",
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  width: "100%",
  marginBottom: "15px",
  fontWeight: "bold",
  cursor: "pointer",
};

const saveButton = {
  background: "#5439ff",
  color: "white",
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  width: "100%",
  fontWeight: "bold",
  cursor: "pointer",
};

const backButton = {
  marginTop: "15px",
  padding: "10px 14px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  width: "100%",
};
