import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Тип товара
interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
}

function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");

  // Загружаем товары
  const loadProducts = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/products");
      const data = await res.json();
      setProducts(data);
    } catch {
      setError("Ошибка загрузки товаров");
    }
  };

  // вызываем загрузку товаров
  useEffect(() => {
    const fetchData = async () => {
      await loadProducts();
    };
    fetchData();
  }, []);

  // Удаление
  const deleteProduct = async (id: number) => {
    if (!window.confirm("Удалить этот товар?")) return;

    try {
      const res = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        return alert("Ошибка удаления товара");
      }

      // убираем товар из списка
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Ошибка сервера");
    }
  };

  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "20px" }}>Управление товарами</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {products.map((p) => (
        <div
          key={p.id}
          style={{
            padding: "12px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            marginBottom: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <b>{p.title}</b> — {p.price} ₽
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => navigate(`/dashboard/products/${p.id}/edit`)}
              style={{
                background: "#7b5cff",
                border: "none",
                padding: "8px 16px",
                color: "white",
                fontWeight: "bold",
                borderRadius: "6px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              ✏️ Редактировать
            </button>

            <button
              onClick={() => deleteProduct(p.id)}
              style={{
                background: "#ff5252",
                border: "none",
                padding: "8px 16px",
                color: "white",
                fontWeight: "bold",
                borderRadius: "6px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              ❌ Удалить
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Products;
