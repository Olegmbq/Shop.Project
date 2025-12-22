import React, { useEffect, useState } from "react";
import "../styles/cart.css";

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image_url?: string;
  images?: string[];
}

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Загружаем корзину из localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(saved);
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const changeQuantity = (id: number, delta: number) => {
    const updated = cart.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    );
    saveCart(updated);
  };

  const removeItem = (id: number) => {
    const updated = cart.filter((item) => item.id !== id);
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const total = cart.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);

  const getPreview = (item: CartItem) => {
    const src = item.image_url || item.images?.[0];
    if (!src) return "https://via.placeholder.com/200?text=No+Image";
    return src.startsWith("http") ? src : `http://localhost:4000${src}`;
  };

  return (
    <div className="cart-page">
      <button className="back-btn" onClick={() => (window.location.href = "/")}>
        ← Назад
      </button>

      <h1 className="cart-title">🛒 Моя корзина</h1>

      {cart.length === 0 ? (
        <p className="empty">Корзина пока пуста…</p>
      ) : (
        <>
          {/* Список товаров */}
          {cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <div className="cart-item-image-wrap">
                <img
                  className="cart-item-image"
                  src={getPreview(item)}
                  alt={item.title}
                />
              </div>

              <div className="cart-item-info">
                <h3 className="cart-item-title">{item.title}</h3>

                <p className="cart-item-line">
                  {Number(item.price).toFixed(2)} $ × {item.quantity} ={" "}
                  {(Number(item.price) * item.quantity).toFixed(2)} $
                </p>

                <div className="cart-item-qty">
                  <button onClick={() => changeQuantity(item.id, -1)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => changeQuantity(item.id, 1)}>+</button>
                </div>
              </div>

              <button
                className="cart-delete-btn"
                onClick={() => removeItem(item.id)}
              >
                ✖ Удалить
              </button>
            </div>
          ))}

          {/* Итоги + кнопки как было раньше */}
          <div className="cart-total">
            <h2 className="cart-sum">Итого: {total.toFixed(2)} $</h2>

            <div className="cart-actions">
              <button className="cart-btn purple" onClick={clearCart}>
                🗑 Очистить корзину
              </button>

              <button
                className="cart-btn purple"
                onClick={() => (window.location.href = "/checkout")}
              >
                💳 Оформить заказ
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
