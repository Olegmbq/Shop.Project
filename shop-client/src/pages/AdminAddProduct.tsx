import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/admin.css";

const AdminAddProduct = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [preview, setPreview] = useState("");
  const [image, setImage] = useState<File | null>(null);

  // 📤 Выбор фото
  const handleFile = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // 💾 Создание товара
  const save = async () => {
    if (!title || !price || !category || !description) {
      alert("⚠ Заполните все поля!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("description", description);
    if (image) formData.append("image", image);

    await axios.post("http://localhost:3000/api/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    navigate("/admin-panel");
  };

  return (
    <div className="admin-edit-page">
      <button className="back-btn" onClick={() => navigate("/admin-panel")}>
        ← Назад
      </button>

      <h1 className="neon-title">➕ Добавление нового товара</h1>

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

      <label>Фото товара</label>

      {preview ? (
        <img src={preview} className="edit-preview" />
      ) : (
        <p style={{ opacity: 0.7 }}>Фото не выбрано</p>
      )}

      <input type="file" accept="image/*" onChange={handleFile} />

      <button className="admin-btn-big" onClick={save}>
        📦 Создать товар
      </button>
    </div>
  );
};

export default AdminAddProduct;
