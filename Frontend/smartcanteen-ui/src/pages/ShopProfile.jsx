import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getShop, updateShop } from "../services/api";
import AppLayout from "../components/AppLayout";

function ShopProfile() {
  const storedUser = JSON.parse(sessionStorage.getItem("currentUser") || "{}");
  const adminId = storedUser.userId;

  const [shop, setShop] = useState(null);
  const [shopName, setShopName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchShop = async () => {
    try {
      if (!adminId) return;

      const data = await getShop(adminId);

      setShop(data);
      setShopName(data.shopName);
    } catch (error) {
      console.error("Failed to fetch shop", error);
    }
  };

  useEffect(() => {
    fetchShop();
  }, [adminId]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!shopName.trim()) {
      setMessage("Shop name cannot be empty");
      return;
    }

    try {
      setLoading(true);

      await updateShop({
        shopId: shop.shopId,
        shopName: shopName,
      });

      setMessage("Shop name updated successfully");

      fetchShop();
    } catch (error) {
      console.error("Update failed", error);
      setMessage("Failed to update shop");
    } finally {
      setLoading(false);
    }
  };

  if (!shop) {
    return <div style={styles.loading}>Loading shop profile...</div>;
  }

  return (
    <AppLayout>
      {/* HEADER */}

      <div style={styles.header}>
        <h2 style={styles.title}>Shop Profile</h2>
        <p style={styles.subtitle}>{shop.shopName}</p>
      </div>

      {/* PROFILE CARD */}

      <motion.div
        style={styles.card}
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={styles.row}>
          <span>Shop ID</span>
          <b>{shop.shopId}</b>
        </div>

        <div style={styles.row}>
          <span>Status</span>

          <span
            style={{
              ...styles.status,
              background:
                shop.status === "OPEN"
                  ? "linear-gradient(90deg,#22c55e,#16a34a)"
                  : "linear-gradient(90deg,#ef4444,#dc2626)",
            }}
          >
            {shop.status}
          </span>
        </div>

        <hr style={{ margin: "22px 0" }} />

        {/* EDIT FORM */}

        <h3 style={{ marginBottom: "10px" }}>Edit Shop Name</h3>

        <form onSubmit={handleUpdate} style={styles.form}>
          <input
            style={styles.input}
            type="text"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            style={styles.updateBtn}
            type="submit"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </motion.button>
        </form>

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
    padding: "35px",
    borderRadius: "20px",
    boxShadow: "0 18px 40px rgba(0,0,0,0.08)",
    maxWidth: "420px",
    margin: "auto",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "14px",
    fontSize: "15px",
  },

  status: {
    padding: "6px 14px",
    borderRadius: "10px",
    color: "white",
    fontSize: "13px",
    fontWeight: "600",
  },

  form: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },

  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #cbd5f5",
  },

  updateBtn: {
    padding: "12px 20px",
    background: "linear-gradient(90deg,#4f46e5,#6366f1)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },

  message: {
    marginTop: "18px",
    color: "#475569",
  },

  loading: {
    textAlign: "center",
    marginTop: "120px",
    fontSize: "18px",
  },
};

export default ShopProfile;
