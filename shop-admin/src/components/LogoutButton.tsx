import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("admin_token"); // удаляем токен
    navigate("/"); // отправляем на логин
  };

  return (
    <button
      onClick={logout}
      style={{
        background: "#ff4d4d",
        color: "white",
        border: "none",
        padding: "10px 20px",
        borderRadius: "8px",
        cursor: "pointer",
        marginTop: "20px",
        fontSize: "16px",
      }}
    >
      Выйти
    </button>
  );
}
