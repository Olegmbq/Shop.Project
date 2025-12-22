import React, { useEffect, useState } from "react";
import axios from "axios";

interface Product {
  id: number;
  title: string;
  description: string;
  price: string;
  image: string;
}

const ProductsList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Ошибка загрузки товаров:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return <div className="loader">🔄 Загрузка товаров...</div>;
  }

  return (
    <div className="products-page">
      <h1 className="title">📱 Каталог телефонов</h1>
      <div className="products-grid">
        {products.map((p) => (
          <div key={p.id} className="product-card">
            <img
              src={
                p.image || "https://via.placeholder.com/200x200?text=No+Image"
              }
              alt={p.title}
              className="product-img"
            />
            <h3>{p.title}</h3>
            <p className="price">{p.price} $</p>
            <p className="desc">{p.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsList;
