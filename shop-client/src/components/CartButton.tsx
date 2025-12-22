import React from "react";
import "../styles/header.css";

interface Props {
  count: number;
}

const CartButton: React.FC<Props> = ({ count }) => {
  return (
    <div className="cart-btn" onClick={() => (window.location.href = "/cart")}>
      {/* Простая emoji-иконка корзины */}
      <span className="cart-emoji">🛒</span>

      {/* Счётчик */}
      <span className="cart-count">{Number.isFinite(count) ? count : 0}</span>
    </div>
  );
};

export default CartButton;
