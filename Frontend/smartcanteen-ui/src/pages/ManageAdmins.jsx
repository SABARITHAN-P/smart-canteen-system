import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  getShopAdmins,
  blockUser,
  unblockUser,
  changeShopOwner,
} from "../services/api";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";

function ManageAdmins() {
  const navigate = useNavigate();

  const [admins, setAdmins] = useState([]);
  const [activeSection, setActiveSection] = useState("view");

  const [shopId, setShopId] = useState("");
  const [newAdminId, setNewAdminId] = useState("");

  const fetchAdmins = async () => {
    try {
      const data = await getShopAdmins();
      setAdmins(data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    const loadAdmins = async () => {
      await fetchAdmins();
    };
    loadAdmins();
  }, []);

  const handleBlock = async (userId) => {
    const result = await Swal.fire({
      title: "Block Admin?",
      text: "This admin will no longer access the system.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Block",
    });

    if (!result.isConfirmed) return;

    try {
      await blockUser(userId);
      toast.success("Admin blocked");
      fetchAdmins();
    } catch (error) {
      console.error(error);
      toast.error("Failed to block admin");
    }
  };

  const handleUnblock = async (userId) => {
    const result = await Swal.fire({
      title: "Unblock Admin?",
      text: "Admin will regain access.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      confirmButtonText: "Unblock",
    });

    if (!result.isConfirmed) return;

    try {
      await unblockUser(userId);
      toast.success("Admin unblocked");
      fetchAdmins();
    } catch (error) {
      console.error(error);
      toast.error("Failed to unblock admin");
    }
  };

  const handleChangeOwner = async () => {
    if (!shopId || !newAdminId) {
      toast.error("Enter shop ID and new admin ID");
      return;
    }

    try {
      const result = await changeShopOwner({
        shopId: parseInt(shopId),
        shopAdminId: parseInt(newAdminId),
      });

      if (result.success) {
        toast.success("Shop owner changed");
        setShopId("");
        setNewAdminId("");
      } else {
        toast.error("Failed to change owner");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error");
    }
  };

  return (
    <AppLayout>
      {/* HEADER */}

      <div style={styles.header}>
        <h2 style={styles.title}>Manage Shop Admins</h2>
        <p style={styles.subtitle}>View and control shop administrators</p>
      </div>

      {/* TABS */}

      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tabBtn,
            background: activeSection === "view" ? "#4f46e5" : "#94a3b8",
          }}
          onClick={() => setActiveSection("view")}
        >
          View Admins
        </button>

        <button
          style={{
            ...styles.tabBtn,
            background: activeSection === "block" ? "#4f46e5" : "#94a3b8",
          }}
          onClick={() => setActiveSection("block")}
        >
          Block / Unblock
        </button>

        <button
          style={{
            ...styles.tabBtn,
            background: activeSection === "changeOwner" ? "#4f46e5" : "#94a3b8",
          }}
          onClick={() => setActiveSection("changeOwner")}
        >
          Change Owner
        </button>
      </div>

      {/* VIEW ADMINS */}

      {activeSection === "view" &&
        admins.map((admin) => (
          <motion.div
            key={admin.userId}
            style={styles.card}
            whileHover={{ scale: 1.02 }}
          >
            <div>
              <p>
                <b>ID:</b> {admin.userId}
              </p>
              <p>
                <b>Name:</b> {admin.name}
              </p>
              <p>
                <b>Email:</b> {admin.email}
              </p>
            </div>

            <span
              style={{
                ...styles.status,
                background:
                  admin.status === "ACTIVE"
                    ? "linear-gradient(90deg,#22c55e,#16a34a)"
                    : "linear-gradient(90deg,#ef4444,#dc2626)",
              }}
            >
              {admin.status}
            </span>
          </motion.div>
        ))}

      {/* BLOCK / UNBLOCK */}

      {activeSection === "block" &&
        admins.map((admin) => (
          <motion.div
            key={admin.userId}
            style={styles.card}
            whileHover={{ scale: 1.02 }}
          >
            <div>
              <p>
                <b>ID:</b> {admin.userId}
              </p>
              <p>
                <b>Name:</b> {admin.name}
              </p>
            </div>

            <span
              style={{
                ...styles.status,
                background: admin.status === "ACTIVE" ? "#22c55e" : "#ef4444",
              }}
            >
              {admin.status}
            </span>

            {admin.status === "ACTIVE" ? (
              <button
                style={styles.blockBtn}
                onClick={() => handleBlock(admin.userId)}
              >
                Block
              </button>
            ) : (
              <button
                style={styles.unblockBtn}
                onClick={() => handleUnblock(admin.userId)}
              >
                Unblock
              </button>
            )}
          </motion.div>
        ))}

      {/* CHANGE OWNER */}

      {activeSection === "changeOwner" && (
        <div style={styles.card}>
          <h3 style={{ marginBottom: "15px" }}>Change Shop Owner</h3>

          <input
            style={styles.input}
            type="number"
            placeholder="Shop ID"
            value={shopId}
            onChange={(e) => setShopId(e.target.value)}
          />

          <input
            style={styles.input}
            type="number"
            placeholder="New Admin ID"
            value={newAdminId}
            onChange={(e) => setNewAdminId(e.target.value)}
          />

          <button style={styles.primaryBtn} onClick={handleChangeOwner}>
            Change Owner
          </button>
        </div>
      )}

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
    padding: "22px",
    borderRadius: "18px",
    marginBottom: "14px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
  },

  status: {
    display: "inline-block",
    padding: "5px 12px",
    borderRadius: "8px",
    color: "white",
    fontSize: "12px",
    marginTop: "8px",
  },

  blockBtn: {
    marginTop: "10px",
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  unblockBtn: {
    marginTop: "10px",
    background: "#22c55e",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "10px",
    border: "1px solid #cbd5f5",
  },

  primaryBtn: {
    padding: "12px 16px",
    background: "linear-gradient(90deg,#4f46e5,#6366f1)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },

  backBtn: {
    marginTop: "25px",
    padding: "12px 18px",
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },
};

export default ManageAdmins;
