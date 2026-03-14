import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../services/api";
import AuthLayout from "../components/AuthLayout";
import AuthCard from "../components/AuthCard";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const validate = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email format");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const result = await forgotPassword({
        email: email.trim(),
      });

      setMessage(result.message);

      if (result.success) {
        navigate("/reset-password", {
          state: { email: email.trim() },
        });
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard width="360px">
        <h2 style={styles.logo}>🍔 QuickBite</h2>
        <h3 style={styles.title}>Forgot your password?</h3>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label>Email</label>

          <input
            style={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />

          {error && <p style={styles.error}>{error}</p>}

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

        {message && <p style={styles.message}>{message}</p>}

        <p style={styles.backLink} onClick={() => navigate("/login")}>
          Back to Login
        </p>
      </AuthCard>
    </AuthLayout>
  );
}

const styles = {
  logo: {
    marginBottom: "5px",
    fontSize: "26px",
  },

  title: {
    marginBottom: "20px",
    color: "#64748b",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    textAlign: "left",
  },

  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #cbd5f5",
  },

  button: {
    marginTop: "10px",
    padding: "11px",
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  error: {
    color: "red",
    fontSize: "13px",
  },

  message: {
    marginTop: "15px",
    color: "green",
  },

  backLink: {
    marginTop: "15px",
    color: "#2563eb",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default ForgotPassword;
