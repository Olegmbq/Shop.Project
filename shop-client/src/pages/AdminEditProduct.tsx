import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/admin.css";

const AdminEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Основные поля
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  // Фото
  const [images, setImages] = useState<string[]>([]);
  const [mainImage, setMainImage] = useState("");
  const [newFiles, setNewFiles] = useState<File[]>([]);

  // ==========================
  // 📌 Загружаем товар
  // ==========================
  useEffect(() => {
    axios.get(`http://localhost:4000/api/products/${id}`).then((res) => {
      const p = res.data;

      setTitle(p.title);
      setPrice(String(p.price));
      setCategory(p.category);
      setDescription(p.description);

      // если фото один — делаем массив
      const imgs = p.images ? JSON.parse(p.images) : [];

      setImages(imgs);
      setMainImage(p.image_url);
    });
  }, [id]);

  // ==========================
  // 📤 Загрузка новых фото
  // ==========================
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length > 0) {
      setNewFiles((prev) => [...prev, ...files]);
      const localUrls = files.map((f) => URL.createObjectURL(f));
      setImages((prev) => [...prev, ...localUrls]);
    }
  };

  // ==========================
  // 💾 Сохранение
  // ==========================
  const save = async () => {
    console.log("🔥 SEND DATA:", {
      title,
      price,
      category,
      description,
      mainImage,
      images,
      newFiles,
    });

    const formData = new FormData();

    formData.append("title", title);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("description", description);

    // Главное фото
    formData.append("image_url", mainImage);

    // Список оставшихся фото

    // отправляем только старые уже сохранённые фото
    const serverImages = images.filter((img) => img.startsWith("/uploads/"));
    formData.append("images", JSON.stringify(serverImages));

    // Новые фото

    if (newFiles.length > 0) {
      newFiles.forEach((file) => formData.append("newImages", file));
    }

    await axios.put(`http://localhost:3000/api/products/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    navigate("/admin-panel");
  };

  return (
    <div className="admin-edit-page">
      <button className="back-btn" onClick={() => navigate("/admin-panel")}>
        ← Назад
      </button>

      <h1 className="neon-title">✏ Редактирование товара</h1>

      <label>Название</label>
      <input
        className="neon-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label>Цена ($)</label>
      <input
        className="neon-input"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <label>Категория</label>
      <input
        className="neon-input"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <label>Описание</label>
      <textarea
        className="neon-input"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* === Галерея фото === */}
      <label>Фотографии товара</label>

      <div className="edit-gallery">
        {images.map((img, index) => {
          const realUrl = img.startsWith("blob:")
            ? img
            : `http://localhost:4000${img}`;

          return (
            <div
              className={`img-box ${img === mainImage ? "main" : ""}`}
              key={index}
            >
              <img src={realUrl} alt="" />

              {img === mainImage ? (
                <span className="star-main">⭐ Главное</span>
              ) : (
                <button
                  className="make-main-btn"
                  onClick={() => setMainImage(img)}
                >
                  ⭐
                </button>
              )}

              {/* Удаление фото */}
              <button
                className="remove-btn"
                onClick={() => {
                  setImages(images.filter((x) => x !== img));
                }}
              >
                ❌
              </button>
            </div>
          );
        })}

        {/* Добавить фото */}
        <div className="upload-box">
          <label className="upload-label">
            ➕ Добавить фото
            <input type="file" multiple onChange={handleFileSelect} />
          </label>
        </div>
      </div>

      <button className="admin-btn-big" onClick={save}>
        💾 Сохранить изменения
      </button>
    </div>
  );
};

export default AdminEditProduct;
