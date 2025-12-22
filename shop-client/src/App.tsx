import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Catalog from "./pages/Catalog";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ThanksPage from "./pages/ThanksPage";

import Header from "./components/Header";

import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";
import AdminEditProduct from "./pages/AdminEditProduct";
import AdminGuard from "./components/AdminGuard";
import AdminAddProduct from "./pages/AdminAddProduct";
import AdminOrders from "./pages/AdminOrders";

function AppContent() {
  const location = useLocation();

  // 🔥 ЭТО ГЛАВНОЕ: скрываем Header только в админке
  const hideHeader =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/admin-login") ||
    location.pathname.startsWith("/admin-panel") ||
    location.pathname.startsWith("/admin-edit");

  return (
    <>
      {!hideHeader && <Header />}

      <Routes>
        <Route path="/" element={<Catalog />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/thanks" element={<ThanksPage />} />

        {/* --- ADMIN --- */}
        <Route path="/admin-login" element={<AdminLogin />} />

        <Route
          path="/admin-panel"
          element={
            <AdminGuard>
              <AdminPanel />
            </AdminGuard>
          }
        />

        <Route
          path="/admin-edit/:id"
          element={
            <AdminGuard>
              <AdminEditProduct />
            </AdminGuard>
          }
        />

        <Route
          path="/admin-add"
          element={
            <AdminGuard>
              <AdminAddProduct />
            </AdminGuard>
          }
        />

        <Route
          path="/admin-orders"
          element={
            <AdminGuard>
              <AdminOrders />
            </AdminGuard>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
