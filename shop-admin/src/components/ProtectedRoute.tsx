import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // просто читаем токен напрямую
  const token = localStorage.getItem("admin_token");

  // если токена нет → на логин
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // если токен есть → пускаем
  return <>{children}</>;
}
