import React from "react";
import "../styles/checkout.css";

const ThanksPage: React.FC = () => {
  return (
    <div className="thanks-page">
      <h1>🎉 Спасибо за заказ!</h1>
      <p>Мы скоро свяжемся с вами 😊</p>

      <button onClick={() => (window.location.href = "/")}>
        ← Вернуться в магазин
      </button>
    </div>
  );
};

export default ThanksPage;
