import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ReportIssue from "./pages/Profile";

import UserDashboard from "./pages/UserDashboard";
import ShopAdminDashboard from "./pages/ShopAdminDashboard";
import MainAdminDashboard from "./pages/MainAdminDashboard";

import Shops from "./pages/Shops";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import MyOrders from "./pages/MyOrders";

import ManageShops from "./pages/ManageShops";
import ManageAdmins from "./pages/ManageAdmins";
import AllOrders from "./pages/AllOrders";
import ManageUsers from "./pages/ManageUsers";
import Reports from "./pages/Reports";

import ManageMenu from "./pages/ManageMenu";
import ToggleShop from "./pages/ToggleShop";
import ShopProfile from "./pages/ShopProfile";
import ShopOrders from "./pages/ShopOrders";

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem("currentUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const getHomeRoute = () => {
    if (!user) return "/login";

    if (user.role === "USER") return "/user-dashboard";
    if (user.role === "SHOP_ADMIN") return "/shop-admin-dashboard";
    if (user.role === "MAIN_ADMIN") return "/main-admin-dashboard";

    return "/login";
  };

  return (
    <>
      <Toaster position="top-right" />

      <Routes>
        {/* ROOT */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* AUTH */}
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to={getHomeRoute()} replace />
            ) : (
              <Login onLogin={setUser} />
            )
          }
        />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/register"
          element={
            user ? <Navigate to={getHomeRoute()} replace /> : <Register />
          }
        />

        {/* USER ROUTES */}
        <Route
          path="/user-dashboard"
          element={
            user?.role === "USER" ? (
              <UserDashboard user={user} setUser={setUser} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/shops"
          element={
            user?.role === "USER" ? <Shops /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/menu/:shopId"
          element={
            user?.role === "USER" ? <Menu /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/cart"
          element={
            user?.role === "USER" ? <Cart /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/checkout/:shopId"
          element={
            user?.role === "USER" ? (
              <Checkout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/payment"
          element={
            user?.role === "USER" ? (
              <Payment />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/my-orders"
          element={
            user?.role === "USER" ? (
              <MyOrders />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* SHOP ADMIN ROUTES */}
        <Route
          path="/shop-admin-dashboard"
          element={
            user?.role === "SHOP_ADMIN" ? (
              <ShopAdminDashboard user={user} setUser={setUser} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/admin/menu"
          element={
            user?.role === "SHOP_ADMIN" ? (
              <ManageMenu />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/admin/shop-orders"
          element={
            user?.role === "SHOP_ADMIN" ? (
              <ShopOrders />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/admin/toggle-shop"
          element={
            user?.role === "SHOP_ADMIN" ? (
              <ToggleShop />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/admin/shop-profile"
          element={
            user?.role === "SHOP_ADMIN" ? (
              <ShopProfile />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* MAIN ADMIN ROUTES */}
        <Route
          path="/main-admin-dashboard"
          element={
            user?.role === "MAIN_ADMIN" ? (
              <MainAdminDashboard user={user} setUser={setUser} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/manage-shops"
          element={
            user?.role === "MAIN_ADMIN" ? (
              <ManageShops />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/manage-admins"
          element={
            user?.role === "MAIN_ADMIN" ? (
              <ManageAdmins />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/all-orders"
          element={
            user?.role === "MAIN_ADMIN" ? (
              <AllOrders />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/manage-users"
          element={
            user?.role === "MAIN_ADMIN" ? (
              <ManageUsers />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/reports"
          element={
            user?.role === "MAIN_ADMIN" ? (
              <Reports />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* COMMON */}
        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/login" replace />}
        />

        <Route path="/report" element={<ReportIssue />} />
        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
