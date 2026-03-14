import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import "./Navbar.css";

function Navbar() {
  const user = JSON.parse(sessionStorage.getItem("currentUser") || "{}");
  const location = useLocation();

  const getHomeRoute = () => {
    if (user.role === "USER") return "/user-dashboard";
    if (user.role === "SHOP_ADMIN") return "/shop-admin-dashboard";
    if (user.role === "MAIN_ADMIN") return "/main-admin-dashboard";
    return "/login";
  };

  const isActive = (path) => location.pathname === path;

  const navItem = (to, label) => (
    <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
      <Link to={to} className={`nav-link ${isActive(to) ? "active" : ""}`}>
        {label}
      </Link>
    </motion.div>
  );

  return (
    <motion.div
      className="navbar"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.h2 className="logo" whileHover={{ scale: 1.05 }}>
        🍔 QuickBite
      </motion.h2>

      <div className="links">
        {navItem(getHomeRoute(), "Home")}

        {user.role === "USER" && (
          <>
            {navItem("/shops", "Shops")}
            {navItem("/cart", "Cart")}
            {navItem("/my-orders", "Orders")}
            {navItem("/profile", "Profile")}
          </>
        )}

        {user.role === "SHOP_ADMIN" && (
          <>
            {navItem("/admin/menu", "Menu")}
            {navItem("/admin/shop-orders", "Orders")}
            {navItem("/admin/shop-profile", "Shop Profile")}
            {navItem("/profile", "Profile")}
          </>
        )}

        {user.role === "MAIN_ADMIN" && (
          <>
            {navItem("/manage-shops", "Shops")}
            {navItem("/manage-admins", "Admins")}
            {navItem("/manage-users", "Users")}
            {navItem("/all-orders", "Orders")}
            {navItem("/profile", "Profile")}
          </>
        )}
      </div>
    </motion.div>
  );
}

export default Navbar;
