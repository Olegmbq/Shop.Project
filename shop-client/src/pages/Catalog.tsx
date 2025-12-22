// shop-client/src/pages/Catalog.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/products.css";
import ProductCard, { Product } from "../components/ProductCard"; // ⬅️ импортим и компонент, и тип

const Catalog: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Все");

  const [page, setPage] = useState(1);
  const perPage = 4;

  const categoryMap: Record<string, string | null> = {
    Все: null,
    Телефоны: "phones",
    Ноутбуки: "laptops",
    Консоли: "consoles",
    Аксессуары: "audio",
    Часы: "watches",
  };

  const categories = [
    { name: "Все", emoji: "📦" },
    { name: "Телефоны", emoji: "📱" },
    { name: "Ноутбуки", emoji: "💻" },
    { name: "Консоли", emoji: "🎮" },
    { name: "Аксессуары", emoji: "🔌" },
    { name: "Часы", emoji: "⌚" },
  ];

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get<Product[]>(
          "http://localhost:4000/api/products"
        );
        setProducts(res.data);
      } catch (e) {
        console.error("Ошибка загрузки товаров:", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, activeCategory]);

  const filteredProducts = products
    .filter((p) =>
      activeCategory === "Все"
        ? true
        : p.category === categoryMap[activeCategory]
    )
    .filter(
      (p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
    );

  const totalPages = Math.ceil(filteredProducts.length / perPage);

  const pageProducts = filteredProducts.slice(
    (page - 1) * perPage,
    page * perPage
  );

  const buildPreview = (p: Product): string => {
    let img: string | undefined;

    if (Array.isArray(p.images) && p.images.length > 0) {
      img = p.images[0];
    } else if (typeof p.images === "string") {
      img = p.images;
    } else {
      img = p.image_url;
    }

    if (!img) return "";
    return img.startsWith("http") ? img : `http://localhost:4000${img}`;
  };

  const addToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existing = cart.find((i: any) => i.id === product.id);

    const preview = buildPreview(product);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        price: Number(product.price),
        quantity: 1,
        image_url: preview || product.image_url,
        images: product.images,
        category: product.category,
        description: product.description,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  if (loading) return <div className="loader">Загружаем товары…</div>;

  return (
    <div className="products-page">
      <h1 className="title">📦 Каталог товаров</h1>

      <div className="search-box">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Введите название товара..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="categories">
        {categories.map((cat) => (
          <button
            key={cat.name}
            className={
              activeCategory === cat.name ? "cat-btn active" : "cat-btn"
            }
            onClick={() => setActiveCategory(cat.name)}
          >
            <span className="cat-emoji">{cat.emoji}</span>
            {cat.name}
          </button>
        ))}
      </div>

      <div className="products-grid">
        {pageProducts.map((p) => (
          <ProductCard key={p.id} product={p} addToCart={addToCart} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pg-btn"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            ◀
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={page === i + 1 ? "pg-number active" : "pg-number"}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="pg-btn"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            ▶
          </button>
        </div>
      )}
    </div>
  );
};

export default Catalog;
