import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getShop, toggleShop } from "../services/api";
import AppLayout from "../components/AppLayout";

function ToggleShop() {
  const storedUser = JSON.parse(sessionStorage.getItem("currentUser") || "{}");
  const adminId = storedUser.userId;

  const [shop, setShop] = useState(null);
  const [message, setMessage] = useState("");

  const fetchShop = async () => {
    try {
      const data = await getShop(adminId);
      setShop(data);
    } catch (error) {
      console.error("Failed to fetch Shop", error);
    }
  };
  useEffect(() => {
    const loadShop = async () => {
      await fetchShop();
    };
    loadShop();
  }, [adminId]);

  const handleToggle = async () => {
    try {
      const result = await toggleShop(shop.shopId);

      if (result) {
        setMessage("Shop status updated successfully");
        fetchShop();
      }
    } catch (error) {
      console.error("Toggle failed", error);
      setMessage("Failed to update shop status");
    }
  };

  if (!shop) {
    return <div style={styles.loading}>Loading shop details...</div>;
  }

  return (
    <AppLayout>
      {/* HEADER */}

      <div style={styles.header}>
        <h2 style={styles.title}>Toggle Shop Status</h2>
        <p style={styles.subtitle}>{shop.shopName}</p>
      </div>

      {/* CARD */}

      <motion.div
        style={styles.card}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={styles.statusRow}>
          <span>Current Status</span>

          <span
            style={{
              ...styles.status,
              background: shop.status === "OPEN" ? "#22c55e" : "#ef4444",
            }}
          >
            {shop.status}
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          style={shop.status === "OPEN" ? styles.closeBtn : styles.openBtn}
          onClick={handleToggle}
        >
          {shop.status === "OPEN" ? "Close Shop" : "Open Shop"}
        </motion.button>

        {message && <p style={styles.message}>{message}</p>}
      </motion.div>
    </AppLayout>
  );
}

const styles = {
  header: {
    textAlign: "center",
    marginBottom: "35px",
  },

  title: {
    fontSize: "26px",
    fontWeight: "600",
  },

  subtitle: {
    color: "#64748b",
    marginTop: "6px",
  },

  card: {
    background: "#f8fafc",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 18px 40px rgba(0,0,0,0.08)",
    textAlign: "center",
    maxWidth: "420px",
    margin: "auto",
  },

  statusRow: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    alignItems: "center",
    marginBottom: "20px",
    fontSize: "16px",
  },

  status: {
    padding: "6px 14px",
    borderRadius: "10px",
    color: "white",
    fontSize: "13px",
    fontWeight: "600",
  },

  openBtn: {
    background: "linear-gradient(90deg,#22c55e,#16a34a)",
    color: "white",
    border: "none",
    padding: "12px 22px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
  },

  closeBtn: {
    background: "linear-gradient(90deg,#ef4444,#dc2626)",
    color: "white",
    border: "none",
    padding: "12px 22px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
  },

  message: {
    marginTop: "18px",
    color: "#475569",
  },

  loading: {
    textAlign: "center",
    marginTop: "100px",
    fontSize: "18px",
  },
};

export default ToggleShop;
