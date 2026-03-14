import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { getProfile, updateProfile, changePassword } from "../services/api";
import AppLayout from "../components/AppLayout";

function Profile() {
  const [user, setUser] = useState(null);

  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showProfile, setShowProfile] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [loading, setLoading] = useState(true);

  const isMainAdmin = user?.role === "MAIN_ADMIN";

  const fetchProfile = async () => {
    try {
      const data = await getProfile();

      setUser(data);
      setName(data.name);
      setMobileNumber(data.mobileNumber);

      setShowProfile(true);
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    if (!name && !mobileNumber) {
      toast.error("Nothing to update");
      return;
    }

    if (mobileNumber && !/^\d{10}$/.test(mobileNumber)) {
      toast.error("Mobile number must contain exactly 10 digits");
      return;
    }

    try {
      await updateProfile({ name, mobileNumber });
      toast.success("Profile updated successfully");
      fetchProfile();
    } catch (error) {
      console.error(error);
      toast.error("Profile update failed");
    }
  };

  const handlePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all password fields");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      await changePassword({ oldPassword, newPassword });

      toast.success("Password updated successfully");

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(error);
      toast.error("Old password incorrect or server error");
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading profile...</div>;
  }

  return (
    <AppLayout title="👤 My Profile">
      {/* ACTION BUTTONS */}

      <div style={styles.buttonRow}>
        <button
          style={styles.primaryBtn}
          onClick={() => {
            setShowProfile(true);
            setShowUpdate(false);
          }}
        >
          Show Profile
        </button>

        {!isMainAdmin && (
          <button
            style={styles.secondaryBtn}
            onClick={() => {
              setShowUpdate(true);
              setShowProfile(false);
            }}
          >
            Update Profile
          </button>
        )}

        {isMainAdmin && (
          <button
            style={styles.secondaryBtn}
            onClick={() => {
              setShowUpdate(true);
              setShowProfile(false);
            }}
          >
            Change Password
          </button>
        )}
      </div>

      {/* PROFILE VIEW */}

      {showProfile && user && (
        <motion.div style={styles.card} whileHover={{ scale: 1.01 }}>
          <div style={styles.row}>
            <span>Name</span>
            <b>{user.name}</b>
          </div>

          <div style={styles.row}>
            <span>Email</span>
            <b>{user.email}</b>
          </div>

          <div style={styles.row}>
            <span>Mobile</span>
            <b>{user.mobileNumber}</b>
          </div>

          <div style={styles.row}>
            <span>Role</span>
            <b>{user.role}</b>
          </div>

          <div style={styles.row}>
            <span>Status</span>

            <span
              style={{
                ...styles.status,
                background:
                  user.status === "ACTIVE"
                    ? "linear-gradient(90deg,#22c55e,#16a34a)"
                    : "#ef4444",
              }}
            >
              {user.status}
            </span>
          </div>
        </motion.div>
      )}

      {/* UPDATE SECTION */}

      {showUpdate && (
        <motion.div
          style={styles.card}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {!isMainAdmin && (
            <>
              <h3>Edit Profile</h3>

              <label>Name</label>
              <input
                style={styles.input}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <label>Mobile</label>
              <input
                style={styles.input}
                type="text"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
              />

              <button style={styles.primaryBtn} onClick={handleUpdate}>
                Save Changes
              </button>

              <hr style={{ margin: "25px 0" }} />
            </>
          )}

          <h3>Change Password</h3>

          <input
            style={styles.input}
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />

          <input
            style={styles.input}
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button style={styles.secondaryBtn} onClick={handlePassword}>
            Update Password
          </button>
        </motion.div>
      )}
    </AppLayout>
  );
}

const styles = {
  buttonRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },

  card: {
    background: "#f8fafc",
    padding: "28px",
    borderRadius: "18px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "14px",
  },

  status: {
    padding: "4px 12px",
    borderRadius: "8px",
    color: "white",
    fontSize: "12px",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginTop: "6px",
    marginBottom: "16px",
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
    fontWeight: "600",
  },

  secondaryBtn: {
    padding: "12px 18px",
    background: "linear-gradient(90deg,#22c55e,#16a34a)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },

  loading: {
    textAlign: "center",
    marginTop: "100px",
    fontSize: "18px",
  },
};

export default Profile;
