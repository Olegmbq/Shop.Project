import React, { useEffect, useState } from "react";
import "../styles/checkout.css";

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image_url?: string;
  images?: string[];
  category?: string;
}

const CheckoutPage: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(saved);
  }, []);

  const total = cart.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);

  const submitOrder = async () => {
    if (!name || !phone) {
      alert("Пожалуйста, заполните имя и телефон!");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: name,
          customer_phone: phone,
          comment: comment,
          items: cart,
          total: total,
        }),
      });

      const data = await res.json();

      if (!data.orderId) {
        alert("Ошибка оформления заказа 💔");
        return;
      }

      alert(`🎉 Спасибо за заказ! Ваш номер: ${data.orderId}`);

      // Очищаем корзину
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated"));

      window.location.href = "/thanks";
    } catch (err) {
      console.error("Ошибка при оформлении заказа:", err);
      alert("Ошибка сети, попробуйте позже 😢");
    }
  };

  return (
    <div className="checkout-page">
      <button
        className="back-btn"
        onClick={() => (window.location.href = "/cart")}
      >
        ← Назад
      </button>

      <h1 className="checkout-title">🧾 Оформление заказа</h1>

      <div className="checkout-content">
        <div className="checkout-form">
          <label>
            Имя*
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>

          <label>
            Телефон*
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+7..."
            />
          </label>

          <label>
            Адрес доставки*
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </label>

          <label>
            Комментарий
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </label>

          <button className="checkout-btn" onClick={submitOrder}>
            💳 Подтвердить заказ
          </button>
        </div>

        <div className="checkout-summary">
          <h2>Ваш заказ</h2>
          <div className="order-items">
            {cart.map((item: any) => (
              <div key={item.id} className="order-item">
                <img
                  src={item.images?.[0] || item.image_url}
                  alt={item.title}
                  className="checkout-img"
                />

                <div className="order-info">
                  <p className="order-title">{item.title}</p>
                  <p className="order-quantity">
                    Количество: {item.quantity} × {item.price} $
                  </p>
                  <p className="order-total">
                    Сумма: {item.quantity * item.price} $
                  </p>
                </div>
              </div>
            ))}
          </div>

          <h3 className="summary-total">Итого: {total.toFixed(2)} $</h3>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
