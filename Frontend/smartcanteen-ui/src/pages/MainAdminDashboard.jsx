import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AppLayout from "../components/AppLayout";

import {
  FaStore,
  FaUserTie,
  FaBoxOpen,
  FaUsers,
  FaUserCircle,
  FaChartBar,
} from "react-icons/fa";

function MainAdminDashboard({ user, setUser }) {
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

  const dashboardItems = [
    {
      icon: <FaStore />,
      title: "Manage Shops",
      path: "/manage-shops",
      color: "linear-gradient(135deg,#6366f1,#8b5cf6)",
    },
    {
      icon: <FaUserTie />,
      title: "Manage Shop Admins",
      path: "/manage-admins",
      color: "linear-gradient(135deg,#34d399,#10b981)",
    },
    {
      icon: <FaBoxOpen />,
      title: "All Orders",
      path: "/all-orders",
      color: "linear-gradient(135deg,#f59e0b,#f97316)",
    },
    {
      icon: <FaUsers />,
      title: "Manage Users",
      path: "/manage-users",
      color: "linear-gradient(135deg,#3b82f6,#2563eb)",
    },
    {
      icon: <FaUserCircle />,
      title: "Profile",
      path: "/profile",
      color: "linear-gradient(135deg,#ec4899,#db2777)",
    },
    {
      icon: <FaChartBar />,
      title: "Reports",
      path: "/reports",
      color: "linear-gradient(135deg,#ef4444,#dc2626)",
    },
  ];

  return (
    <AppLayout>
      {/* HEADER */}

      <div style={styles.header}>
        <h2 style={styles.title}>Welcome {user.name} 👋</h2>
        <p style={styles.subtitle}>SmartCanteen Admin Control Panel</p>
      </div>

      {/* DASHBOARD GRID */}

      <div style={styles.grid}>
        {dashboardItems.map((item) => (
          <motion.div
            key={item.title}
            style={styles.card}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 22px 50px rgba(0,0,0,0.15)",
            }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(item.path)}
          >
            <div
              style={{
                ...styles.iconCircle,
                background: item.color,
              }}
            >
              {item.icon}
            </div>

            <h3 style={styles.cardTitle}>{item.title}</h3>
          </motion.div>
        ))}
      </div>

      {/* LOGOUT */}

      <motion.button
        whileTap={{ scale: 0.95 }}
        style={styles.logoutBtn}
        onClick={handleLogout}
      >
        Logout
      </motion.button>
    </AppLayout>
  );
}

const styles = {
  header: {
    textAlign: "center",
    marginBottom: "35px",
  },

  title: {
    fontSize: "28px",
    fontWeight: "600",
  },

  subtitle: {
    color: "#64748b",
    marginTop: "6px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
    gap: "24px",
  },

  card: {
    background: "#f8fafc",
    padding: "40px 25px",
    borderRadius: "20px",
    cursor: "pointer",
    textAlign: "center",
    boxShadow: "0 18px 40px rgba(0,0,0,0.08)",
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

  cardTitle: {
    fontWeight: "600",
  },

  logoutBtn: {
    marginTop: "40px",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    padding: "12px 28px",
    background: "linear-gradient(90deg,#ef4444,#dc2626)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default MainAdminDashboard;
