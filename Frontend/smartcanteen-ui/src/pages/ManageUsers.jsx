import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getAllUsers, blockUser, unblockUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";

function ManageUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [activeSection, setActiveSection] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const loadUsers = async () => {
      await fetchUsers();
    };
    loadUsers();
  }, []);

  const handleBlock = async (userId) => {
    const result = await Swal.fire({
      title: "Block User?",
      text: "The user will not be able to access the system.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Block",
    });

    if (!result.isConfirmed) return;

    try {
      await blockUser(userId);
      toast.success("User blocked successfully");
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error("Failed to block user");
    }
  };

  const handleUnblock = async (userId) => {
    const result = await Swal.fire({
      title: "Unblock User?",
      text: "The user will regain access.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      confirmButtonText: "Unblock",
    });

    if (!result.isConfirmed) return;

    try {
      await unblockUser(userId);
      toast.success("User unblocked successfully");
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error("Failed to unblock user");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <AppLayout>
      {/* HEADER */}

      <div style={styles.header}>
        <h2 style={styles.title}>Manage Users</h2>
        <p style={styles.subtitle}>View and control system users</p>
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
          View Users
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
      </div>

      {/* VIEW USERS */}

      {activeSection === "view" && (
        <div>
          <input
            style={styles.search}
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {filteredUsers.length === 0 ? (
            <p style={styles.empty}>No users found</p>
          ) : (
            filteredUsers.map((user) => (
              <motion.div
                key={user.userId}
                style={styles.card}
                whileHover={{ scale: 1.02 }}
              >
                <div>
                  <p>
                    <b>ID:</b> {user.userId}
                  </p>
                  <p>
                    <b>Name:</b> {user.name}
                  </p>
                  <p>
                    <b>Email:</b> {user.email}
                  </p>
                  <p>
                    <b>Mobile:</b> {user.mobileNumber}
                  </p>
                </div>

                <span
                  style={{
                    ...styles.status,
                    background:
                      user.status === "ACTIVE"
                        ? "linear-gradient(90deg,#22c55e,#16a34a)"
                        : "linear-gradient(90deg,#ef4444,#dc2626)",
                  }}
                >
                  {user.status}
                </span>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* BLOCK USERS */}

      {activeSection === "block" && (
        <div>
          {users.length === 0 ? (
            <p style={styles.empty}>No users found</p>
          ) : (
            users.map((user) => (
              <motion.div
                key={user.userId}
                style={styles.card}
                whileHover={{ scale: 1.02 }}
              >
                <div>
                  <p>
                    <b>ID:</b> {user.userId}
                  </p>
                  <p>
                    <b>Name:</b> {user.name}
                  </p>
                  <p>
                    <b>Email:</b> {user.email}
                  </p>
                </div>

                <span
                  style={{
                    ...styles.status,
                    background:
                      user.status === "ACTIVE" ? "#22c55e" : "#ef4444",
                  }}
                >
                  {user.status}
                </span>

                {user.status === "ACTIVE" ? (
                  <button
                    style={styles.blockBtn}
                    onClick={() => handleBlock(user.userId)}
                  >
                    Block
                  </button>
                ) : (
                  <button
                    style={styles.unblockBtn}
                    onClick={() => handleUnblock(user.userId)}
                  >
                    Unblock
                  </button>
                )}
              </motion.div>
            ))
          )}
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

  search: {
    width: "100%",
    padding: "12px",
    marginBottom: "20px",
    borderRadius: "10px",
    border: "1px solid #cbd5f5",
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

  empty: {
    color: "#64748b",
  },

  backBtn: {
    marginTop: "30px",
    padding: "12px 18px",
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },
};

export default ManageUsers;
