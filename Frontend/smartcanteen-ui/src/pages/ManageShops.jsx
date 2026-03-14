import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { useEffect, useState} from "react";
import {
  getAllShops,
  createShop,
  updateShop,
  deleteShop,
  createShopAdmin,
} from "../services/api";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";

function ManageShops() {
  const navigate = useNavigate();

  const [shops, setShops] = useState([]);
  const [activeSection, setActiveSection] = useState("");

  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");
  const [ownerMobile, setOwnerMobile] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [shopName, setShopName] = useState("");
  const [shopAdminId, setShopAdminId] = useState("");

  const [newShopName, setNewShopName] = useState("");

  const fetchShops = async () => {
    try {
      const data = await getAllShops();
      setShops(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const loadShops = async () => {
      await fetchShops();
    };
    loadShops();
  }, []);

  /* ---------------- CREATE OWNER ---------------- */

  const handleCreateShopOwner = async () => {
    if (!ownerName || !ownerEmail || !ownerPassword || !ownerMobile) {
      toast.error("Fill all fields");
      return;
    }

    try {
      await createShopAdmin({
        name: ownerName,
        email: ownerEmail,
        password: ownerPassword,
        mobileNumber: ownerMobile,
      });

      toast.success("Shop owner created");

      setOwnerName("");
      setOwnerEmail("");
      setOwnerPassword("");
      setOwnerMobile("");
    } catch (error) {
      console.error(error);
    }
  };

  /* ---------------- CREATE SHOP ---------------- */

  const handleCreateShop = async () => {
    if (!shopName || !shopAdminId) {
      toast.error("Enter shop name and admin ID");
      return;
    }

    try {
      await createShop({
        shopName,
        shopAdminId: parseInt(shopAdminId),
      });

      toast.success("Shop created");

      setShopName("");
      setShopAdminId("");

      fetchShops();
    } catch (error) {
      console.error(error);
    }
  };

  /* ---------------- UPDATE SHOP ---------------- */

  const handleUpdateShop = async (shopId) => {
    if (!newShopName) {
      toast.error("Enter new shop name");
      return;
    }

    try {
      await updateShop({
        shopId,
        shopName: newShopName,
      });

      toast.success("Shop updated");

      setNewShopName("");
      fetchShops();
    } catch (error) {
      console.error(error);
    }
  };

  /* ---------------- DELETE SHOP ---------------- */

  const handleDeleteShop = async (shopId) => {
    const result = await Swal.fire({
      title: "Delete Shop?",
      text: "This will permanently delete the shop",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    const { value: password } = await Swal.fire({
      title: "Admin Authentication",
      input: "password",
      inputLabel: "Enter admin password",
      showCancelButton: true,
    });

    if (!password) return;

    try {
      await deleteShop({
        shopId,
        adminPassword: password,
      });

      toast.success("Shop deleted");
      fetchShops();
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  return (
    <AppLayout>
      {/* HEADER */}

      <div style={styles.header}>
        <h2 style={styles.title}>Manage Shops</h2>
        <p style={styles.subtitle}>Create and manage canteen shops</p>
      </div>

      {/* TABS */}

      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tabBtn,
            background: activeSection === "owner" ? "#4f46e5" : "#94a3b8",
          }}
          onClick={() => setActiveSection("owner")}
        >
          Create Owner
        </button>

        <button
          style={{
            ...styles.tabBtn,
            background: activeSection === "shop" ? "#4f46e5" : "#94a3b8",
          }}
          onClick={() => setActiveSection("shop")}
        >
          Create Shop
        </button>

        <button
          style={{
            ...styles.tabBtn,
            background: activeSection === "list" ? "#4f46e5" : "#94a3b8",
          }}
          onClick={() => setActiveSection("list")}
        >
          Show Shops
        </button>
      </div>

      {/* CREATE OWNER */}

      {activeSection === "owner" && (
        <div style={styles.card}>
          <h3>Create Shop Owner</h3>

          <input
            style={styles.input}
            placeholder="Owner Name"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
          />

          <input
            style={styles.input}
            placeholder="Email"
            value={ownerEmail}
            onChange={(e) => setOwnerEmail(e.target.value)}
          />

          <div style={styles.passwordWrapper}>
            <input
              style={styles.passwordInput}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={ownerPassword}
              onChange={(e) => setOwnerPassword(e.target.value)}
            />

            <span
              style={styles.eye}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <input
            style={styles.input}
            placeholder="Mobile Number"
            value={ownerMobile}
            onChange={(e) => setOwnerMobile(e.target.value.replace(/\D/g, ""))}
          />

          <button style={styles.primaryBtn} onClick={handleCreateShopOwner}>
            Create Owner
          </button>
        </div>
      )}

      {/* CREATE SHOP */}

      {activeSection === "shop" && (
        <div style={styles.card}>
          <h3>Create Shop</h3>

          <input
            style={styles.input}
            placeholder="Shop Name"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
          />

          <input
            style={styles.input}
            placeholder="Shop Admin ID"
            value={shopAdminId}
            onChange={(e) => setShopAdminId(e.target.value)}
          />

          <button style={styles.primaryBtn} onClick={handleCreateShop}>
            Create Shop
          </button>
        </div>
      )}

      {/* SHOP LIST */}

      {activeSection === "list" &&
        shops.map((shop) => (
          <motion.div
            key={shop.shopId}
            style={styles.shopCard}
            whileHover={{ scale: 1.02 }}
          >
            <h3>{shop.shopName}</h3>

            <p>
              <b>ID:</b> {shop.shopId}
            </p>

            <span
              style={{
                ...styles.status,
                background: shop.status === "OPEN" ? "#22c55e" : "#ef4444",
              }}
            >
              {shop.status}
            </span>

            <p>
              <b>Admin ID:</b> {shop.shopAdminId}
            </p>

            <input
              style={styles.input}
              placeholder="New shop name"
              value={newShopName}
              onChange={(e) => setNewShopName(e.target.value)}
            />

            <div style={styles.actions}>
              <button
                style={styles.updateBtn}
                onClick={() => handleUpdateShop(shop.shopId)}
              >
                Update
              </button>

              <button
                style={styles.deleteBtn}
                onClick={() => handleDeleteShop(shop.shopId)}
              >
                Delete
              </button>
            </div>
          </motion.div>
        ))}

      <button
        style={styles.backBtn}
        onClick={() => navigate("/main-admin-dashboard")}
      >
        ← Back
      </button>
    </AppLayout>
  );
}

const styles = {
  header: {
    textAlign: "center",
    marginBottom: "25px",
  },

  title: {
    fontSize: "26px",
    fontWeight: "600",
  },

  subtitle: {
    color: "#64748b",
  },

  tabs: {
    display: "flex",
    gap: "12px",
    marginBottom: "25px",
  },

  tabBtn: {
    padding: "10px 16px",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },

  card: {
    background: "#f8fafc",
    padding: "30px",
    borderRadius: "20px",
    marginBottom: "20px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.08)",
  },

  shopCard: {
    background: "#f8fafc",
    padding: "25px",
    borderRadius: "18px",
    marginBottom: "16px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "10px",
    border: "1px solid #cbd5f5",
  },

  primaryBtn: {
    padding: "12px 18px",
    background: "linear-gradient(90deg,#4f46e5,#6366f1)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },

  updateBtn: {
    background: "#22c55e",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
  },

  deleteBtn: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
  },

  status: {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "8px",
    color: "white",
    fontSize: "12px",
    marginBottom: "10px",
  },

  actions: {
    display: "flex",
    gap: "10px",
  },

  backBtn: {
    marginTop: "20px",
    padding: "12px 18px",
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },

  passwordWrapper: {
    position: "relative",
    marginBottom: "10px",
  },

  passwordInput: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #cbd5f5",
  },

  eye: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
  },
};

export default ManageShops;
