import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AppLayout from "../components/AppLayout";

import {
  FaStore,
  FaBoxOpen,
  FaUserCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

function UserDashboard({ user, setUser }) {
  const navigate = useNavigate();

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
    <AppLayout user={user} setUser={setUser}>
      <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
        Welcome, {user?.name} 👋
      </h2>

      <p style={styles.subtitle}>What would you like to do today?</p>

      <div style={styles.grid}>
        {/* Browse Shops */}
        <motion.div
          style={styles.card}
          whileHover={{
            scale: 1.07,
            boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
          }}
          onClick={() => navigate("/shops")}
        >
          <div
            style={{
              ...styles.iconCircle,
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            }}
          >
            <FaStore />
          </div>
          <h3>Browse Shops</h3>
          <p style={styles.desc}>Explore available restaurants</p>
        </motion.div>

        {/* Orders */}
        <motion.div
          style={styles.card}
          whileHover={{
            scale: 1.07,
            boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
          }}
          onClick={() => navigate("/my-orders")}
        >
          <div
            style={{
              ...styles.iconCircle,
              background: "linear-gradient(135deg,#34d399,#10b981)",
            }}
          >
            <FaBoxOpen />
          </div>
          <h3>My Orders</h3>
          <p style={styles.desc}>Track your past orders</p>
        </motion.div>

        {/* Profile */}
        <motion.div
          style={styles.card}
          whileHover={{
            scale: 1.07,
            boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
          }}
          onClick={() => navigate("/profile")}
        >
          <div
            style={{
              ...styles.iconCircle,
              background: "linear-gradient(135deg,#3b82f6,#2563eb)",
            }}
          >
            <FaUserCircle />
          </div>
          <h3>Profile</h3>
          <p style={styles.desc}>Update profile or password</p>
        </motion.div>

        {/* Report Issue */}
        <motion.div
          style={styles.card}
          whileHover={{
            scale: 1.07,
            boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
          }}
          onClick={() => navigate("/report")}
        >
          <div
            style={{
              ...styles.iconCircle,
              background: "linear-gradient(135deg,#f87171,#ef4444)",
            }}
          >
            <FaExclamationTriangle />
          </div>
          <h3>Report Issue</h3>
          <p style={styles.desc}>Send feedback or report a problem</p>
        </motion.div>
      </div>

      <button style={styles.logoutBtn} onClick={handleLogout}>
        Logout
      </button>
    </AppLayout>
  );
}

const styles = {
  subtitle: {
    color: "#64748b",
    marginBottom: "35px",
    textAlign: "center",
    fontSize: "16px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
    gap: "25px",
  },

  card: {
    background: "#f8fafc",
    padding: "35px",
    borderRadius: "18px",
    cursor: "pointer",
    textAlign: "center",
    boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
    transition: "0.3s",
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

  desc: {
    fontSize: "14px",
    color: "#64748b",
    marginTop: "6px",
  },

  logoutBtn: {
    marginTop: "40px",
    padding: "12px 28px",
    background: "linear-gradient(90deg,#ef4444,#dc2626)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default UserDashboard;
