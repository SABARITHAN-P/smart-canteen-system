import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import { getDashboardStats } from "../services/api";

import {
  FaUtensils,
  FaClipboardList,
  FaSyncAlt,
  FaStore,
  FaShoppingCart,
  FaMoneyBillWave,
  FaFire,
} from "react-icons/fa";

function ShopAdminDashboard({ user, setUser }) {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    ordersToday: 0,
    revenueToday: 0,
    activeOrders: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.shopId) return;

    const loadStats = async () => {
      try {
        const data = await getDashboardStats(user.shopId);
        setStats(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user]);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#6366f1",
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    sessionStorage.removeItem("currentUser");
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <AppLayout>
      {/* HEADER */}
      <div style={styles.header}>
        <h2 style={styles.welcome}>Welcome, {user?.name} 👋</h2>
        <p style={styles.shopName}>Managing: {user?.shopName}</p>
      </div>

      {/* STATS */}

      <div style={styles.statsGrid}>
        <motion.div style={styles.statCard} whileHover={{ scale: 1.05 }}>
          <div
            style={{
              ...styles.statIcon,
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            }}
          >
            <FaShoppingCart />
          </div>
          <h3>Orders Today</h3>
          <p style={styles.statValue}>{loading ? "..." : stats.ordersToday}</p>
        </motion.div>

        <motion.div style={styles.statCard} whileHover={{ scale: 1.05 }}>
          <div
            style={{
              ...styles.statIcon,
              background: "linear-gradient(135deg,#34d399,#10b981)",
            }}
          >
            <FaMoneyBillWave />
          </div>
          <h3>Revenue Today</h3>
          <p style={styles.statValue}>
            {loading ? "..." : `₹${stats.revenueToday}`}
          </p>
        </motion.div>

        <motion.div style={styles.statCard} whileHover={{ scale: 1.05 }}>
          <div
            style={{
              ...styles.statIcon,
              background: "linear-gradient(135deg,#f97316,#ef4444)",
            }}
          >
            <FaFire />
          </div>
          <h3>Active Orders</h3>
          <p style={styles.statValue}>{loading ? "..." : stats.activeOrders}</p>
        </motion.div>
      </div>

      {/* ACTION CARDS */}

      <div style={styles.grid}>
        <motion.div
          style={styles.card}
          whileHover={{ y: -8 }}
          onClick={() =>
            navigate("/admin/menu", { state: { shopId: user.shopId } })
          }
        >
          <div
            style={{
              ...styles.iconCircle,
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            }}
          >
            <FaUtensils />
          </div>
          <h3>Manage Menu</h3>
          <p>Add, update or remove food items</p>
        </motion.div>

        <motion.div
          style={styles.card}
          whileHover={{ y: -8 }}
          onClick={() => navigate("/admin/shop-orders")}
        >
          <div
            style={{
              ...styles.iconCircle,
              background: "linear-gradient(135deg,#34d399,#10b981)",
            }}
          >
            <FaClipboardList />
          </div>
          <h3>View Orders</h3>
          <p>Track customer orders</p>
        </motion.div>

        <motion.div
          style={styles.card}
          whileHover={{ y: -8 }}
          onClick={() =>
            navigate("/admin/toggle-shop", { state: { shopId: user.shopId } })
          }
        >
          <div
            style={{
              ...styles.iconCircle,
              background: "linear-gradient(135deg,#f59e0b,#f97316)",
            }}
          >
            <FaSyncAlt />
          </div>
          <h3>Toggle Shop</h3>
          <p>Open or close the shop</p>
        </motion.div>

        <motion.div
          style={styles.card}
          whileHover={{ y: -8 }}
          onClick={() =>
            navigate("/admin/shop-profile", { state: { adminId: user.id } })
          }
        >
          <div
            style={{
              ...styles.iconCircle,
              background: "linear-gradient(135deg,#3b82f6,#2563eb)",
            }}
          >
            <FaStore />
          </div>
          <h3>Shop Profile</h3>
          <p>Edit shop information</p>
        </motion.div>
      </div>

      {/* LOGOUT */}

      <button style={styles.logoutBtn} onClick={handleLogout}>
        Logout
      </button>
    </AppLayout>
  );
}

const styles = {
  header: {
    textAlign: "center",
    marginBottom: "40px",
  },

  welcome: {
    fontSize: "28px",
    fontWeight: "600",
    marginBottom: "6px",
  },

  shopName: {
    fontSize: "16px",
    color: "#64748b",
    fontWeight: "500",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
    gap: "24px",
    marginBottom: "40px",
  },

  statCard: {
    background: "#f8fafc",
    padding: "28px",
    borderRadius: "18px",
    textAlign: "center",
    boxShadow: "0 12px 28px rgba(0,0,0,0.08)",
  },

  statIcon: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "22px",
    margin: "0 auto 12px",
  },

  statValue: {
    fontSize: "28px",
    fontWeight: "700",
    marginTop: "10px",
    color: "#4f46e5",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
    gap: "28px",
  },

  card: {
    background: "#f8fafc",
    padding: "40px 30px",
    borderRadius: "20px",
    textAlign: "center",
    cursor: "pointer",
    boxShadow: "0 18px 40px rgba(0,0,0,0.08)",
  },

  iconCircle: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "26px",
    color: "white",
    margin: "0 auto 15px",
  },

  logoutBtn: {
    marginTop: "45px",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    padding: "12px 30px",
    background: "linear-gradient(90deg,#ef4444,#dc2626)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default ShopAdminDashboard;
