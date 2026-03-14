import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { displayShops } from "../services/api";
import AppLayout from "../components/AppLayout";

function Shops() {
  const [shops, setShops] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const data = await displayShops();
        setShops(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchShops();
  }, []);

  return (
    <AppLayout title="Choose Your Restaurant 🍽">
      {shops.length === 0 ? (
        <p style={styles.empty}>No shops available</p>
      ) : (
        <div style={styles.grid}>
          {shops.map((shop) => (
            <motion.div
              key={shop.shopId}
              style={styles.card}
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate(`/menu/${shop.shopId}`)}
            >
              <div style={styles.icon}>🍔</div>

              <h3 style={styles.shopName}>{shop.shopName}</h3>

              <span style={styles.openBadge}>Open</span>

              <p style={styles.subtitle}>Tap to view menu</p>
            </motion.div>
          ))}
        </div>
      )}

      <button
        style={styles.backBtn}
        onClick={() => navigate("/user-dashboard")}
      >
        ← Back to Dashboard
      </button>
    </AppLayout>
  );
}

const styles = {
  empty: {
    textAlign: "center",
    color: "#64748b",
    marginBottom: "30px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
    gap: "25px",
  },

  card: {
    background: "#f8fafc",
    borderRadius: "18px",
    padding: "30px",
    cursor: "pointer",
    textAlign: "center",
    boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
    transition: "0.3s",
  },

  icon: {
    fontSize: "40px",
    marginBottom: "12px",
  },

  shopName: {
    marginBottom: "8px",
  },

  subtitle: {
    fontSize: "14px",
    color: "#64748b",
    marginTop: "6px",
  },

  openBadge: {
    background: "#22c55e",
    color: "white",
    padding: "4px 10px",
    borderRadius: "8px",
    fontSize: "12px",
    display: "inline-block",
    marginTop: "6px",
  },

  backBtn: {
    marginTop: "40px",
    padding: "12px 28px",
    background: "linear-gradient(90deg,#4f46e5,#6366f1)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default Shops;
