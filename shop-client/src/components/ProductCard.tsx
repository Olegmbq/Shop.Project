import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/products.css";

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  image_url?: string;
  images?: string[] | string;
  category: string;
}

interface Props {
  product: Product;
  addToCart: (p: Product) => void;
}

const ProductCard: React.FC<Props> = ({ product, addToCart }) => {
  const navigate = useNavigate();

  function getPreview(): string {
    if (Array.isArray(product.images) && product.images.length > 0) {
      const img = product.images[0];
      return img.startsWith("http") ? img : `http://localhost:4000${img}`;
    }

    if (typeof product.images === "string") {
      return product.images.startsWith("http")
        ? product.images
        : `http://localhost:4000${product.images}`;
    }

    if (product.image_url) {
      return product.image_url.startsWith("http")
        ? product.image_url
        : `http://localhost:4000${product.image_url}`;
    }

    return "/brand/default.png";
  }

  return (
    <div className="product-card neon-card">
      <img
        className="product-img"
        src={getPreview()}
        alt={product.title}
        onClick={() => navigate(`/product/${product.id}`)}
      />

      <h3 className="product-title">{product.title}</h3>
      <p className="price">{product.price} $</p>

      <button className="btn-add neon-btn" onClick={() => addToCart(product)}>
        ➕ В корзину
      </button>

      <button
        className="btn-details"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        Подробнее →
      </button>
    </div>
  );
};

export default ProductCard;
