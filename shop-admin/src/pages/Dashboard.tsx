// shop-admin/src/pages/Dashboard.tsx
import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 24, textAlign: "center" }}>
      <h1>Добро пожаловать, администратор!</h1>
      <p>Вы вошли в защищённую админ-панель магазина.</p>

      <div style={{ marginTop: 32 }}>
        <button
          onClick={() => navigate("/dashboard/products")}
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            border: "none",
            background: "#7b5cff",
            color: "#fff",
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          <button
            onClick={() => navigate("/dashboard/add-product")}
            style={{
              padding: "10px 20px",
              borderRadius: 8,
              border: "none",
              background: "#00c46a",
              color: "#fff",
              fontSize: 16,
              cursor: "pointer",
              marginRight: 12,
            }}
          >
            ➕ Добавить товар
          </button>
          Управление товарами
        </button>
      </div>

      <div style={{ marginTop: 32 }}>
        <LogoutButton />
      </div>
    </div>
  );
}
