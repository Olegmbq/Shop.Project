import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/productPage.css";
import ProductCard from "../components/ProductCard";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  image_url: string;
  images?: string[];
  specs?: Record<string, string>;
  category: string;
}

const ProductPage: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [similar, setSimilar] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    const load = async () => {
      const res = await axios.get(`http://localhost:4000/api/products/${id}`);
      const item = res.data;

      // 🧩 Нормализуем картинки под все варианты из БД
      let images: string[] = [];

      // 1. Если в БД уже есть поле images
      if (item.images) {
        if (typeof item.images === "string") {
          // может прийти строкой JSON
          try {
            const parsed = JSON.parse(item.images);
            if (Array.isArray(parsed)) {
              images = parsed;
            }
          } catch {
            // если вдруг не JSON — игнорируем
          }
        } else if (Array.isArray(item.images)) {
          images = item.images;
        }
      }

      // 2. Добавляем image_url (старые товары)
      if (item.image_url) {
        images.push(item.image_url);
      }

      // 3. Фильтруем мусор и делаем абсолютный URL
      images = images
        .filter((u) => typeof u === "string" && u.trim() !== "")
        .map((u) =>
          u.startsWith("/uploads") ? `http://localhost:4000${u}` : u
        );

      // 4. Если вообще ничего не получилось — хотя бы одно фото
      if (images.length === 0 && item.image_url) {
        const u = item.image_url.startsWith("/uploads")
          ? `http://localhost:4000${item.image_url}`
          : item.image_url;

        images = [u];
      }

      // кладём обратно в товар
      item.images = images;

      // Сохранить товар в стейт
      setProduct(item);

      // выбираем первую картинку
      setSelectedImage(images[0] || "");

      // подгрузим похожие товары
      const sim = await axios.get(
        `http://localhost:4000/api/products?category=${item.category}`
      );
      setSimilar(sim.data.filter((p: Product) => p.id !== item.id).slice(0, 4));
    };

    load();
  }, [id]);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((i: any) => i.id === product?.id);

    if (existing) existing.quantity += 1;
    else cart.push({ ...product, quantity: 1 });

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  if (!product) return <div className="loader">Загрузка…</div>;

  return (
    <div className="product-page">
      {/* Галерея */}
      <div className="gallery">
        <div className="thumbs">
          {product.images!.map((img, i) => (
            <img
              key={i}
              src={img}
              className={selectedImage === img ? "thumb active" : "thumb"}
              onClick={() => setSelectedImage(img)}
            />
          ))}
        </div>

        <div
          className={zoom ? "main-image zoomed" : "main-image"}
          onClick={() => setZoom(!zoom)}
          style={{ backgroundImage: `url(${selectedImage})` }}
        ></div>
      </div>

      {/* Информация */}
      <div className="info">
        <h1 className="title">{product.title}</h1>
        <p className="price">{product.price} $</p>

        <button className="buy-btn" onClick={addToCart}>
          🛒 Добавить в корзину
        </button>

        <p className="desc">{product.description}</p>

        {/* Характеристики */}
        {product.specs && (
          <>
            <h3 className="block-title">Характеристики</h3>
            <table className="spec-table">
              <tbody>
                {Object.entries(product.specs).map(([k, v]) => (
                  <tr key={k}>
                    <td>{k}</td>
                    <td>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      {/* Похожие товары */}
      <div className="similar-block">
        <h2 className="block-title">Похожие товары</h2>
        <div className="similar-grid">
          {similar.map((p) => (
            <ProductCard key={p.id} product={p} addToCart={() => {}} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
