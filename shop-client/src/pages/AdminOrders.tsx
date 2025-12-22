import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/admin.css";
import { useNavigate } from "react-router-dom";

interface OrderItem {
  product_id: number;
  title: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  customer_name: string;
  customer_phone: string;
  total_price: number;
  status: string;
  created_at: string;
  items: OrderItem[];
}

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

  const loadOrders = async () => {
    const res = await axios.get("http://localhost:4000/api/orders");
    setOrders(res.data);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    await axios.put(`http://localhost:4000/api/orders/${id}/status`, {
      status,
    });
    loadOrders();
  };

  const removeOrder = async (id: number) => {
    if (!window.confirm("Удалить заказ?")) return;
    await axios.delete(`http://localhost:4000/api/orders/${id}`);
    loadOrders();
  };

  return (
    <div className="admin-page">
      <div className="admin-topbar">
        <h1 className="admin-title">📦 Заказы</h1>

        <div className="admin-top-right">
          <button
            className="admin-home"
            onClick={() => navigate("/admin-panel")}
          >
            ← В панель
          </button>
          <button className="admin-home" onClick={() => navigate("/")}>
            🏠 На сайт
          </button>
        </div>
      </div>

      <div className="orders-list">
        {orders.map((o) => (
          <div className="order-card" key={o.id}>
            <div className="order-header">
              <h3>Заказ #{o.id}</h3>
              <span className={`order-status status-${o.status}`}>
                {o.status === "new" && "🟡 Новый"}
                {o.status === "processing" && "🟠 В работе"}
                {o.status === "shipped" && "📦 Отправлен"}
                {o.status === "completed" && "✅ Завершён"}
              </span>
            </div>

            <p>
              <b>Клиент:</b> {o.customer_name}
            </p>
            <p>
              <b>Телефон:</b> {o.customer_phone}
            </p>
            <p>
              <b>Сумма:</b> {o.total_price.toFixed(2)} $
            </p>
            <p>
              <b>Дата:</b> {new Date(o.created_at).toLocaleString()}
            </p>

            <div className="order-items">
              <b>Товары:</b>
              {o.items && o.items.length > 0 ? (
                o.items.map((it, idx) => (
                  <div className="order-item-line" key={idx}>
                    {it.title} — {it.quantity} шт × {it.price} $
                  </div>
                ))
              ) : (
                <div className="order-item-line empty">
                  Нет данных по товарам
                </div>
              )}
            </div>

            <div className="order-actions">
              <button onClick={() => updateStatus(o.id, "new")}>Новый</button>
              <button onClick={() => updateStatus(o.id, "processing")}>
                В работе
              </button>
              <button onClick={() => updateStatus(o.id, "shipped")}>
                Отправлен
              </button>
              <button onClick={() => updateStatus(o.id, "completed")}>
                Завершён
              </button>

              <button
                className="order-delete"
                onClick={() => removeOrder(o.id)}
              >
                🗑 Удалить
              </button>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <p style={{ marginTop: 30 }}>Пока нет заказов 😔</p>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
