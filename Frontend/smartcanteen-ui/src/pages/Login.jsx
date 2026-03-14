import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import AuthLayout from "../components/AuthLayout";
import AuthCard from "../components/AuthCard";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const passwordRef = useRef(null);
  const navigate = useNavigate();

  const validate = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setMessage("Please enter a valid email");
      return false;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const result = await loginUser({ email, password });

      if (result.success) {
        toast.success("Login successful");

        const user = {
          userId: result.userId,
          name: result.name,
          email: result.email,
          role: result.role,
          shopName: result.shopName || null,
          shopId: result.shopId || null,
        };

        onLogin(user);
        sessionStorage.setItem("currentUser", JSON.stringify(user));

        if (result.role === "USER")
          navigate("/user-dashboard", { replace: true });
        else if (result.role === "SHOP_ADMIN")
          navigate("/shop-admin-dashboard", { replace: true });
        else if (result.role === "MAIN_ADMIN")
          navigate("/main-admin-dashboard", { replace: true });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <h2 style={styles.logo}>🍔 QuickBite</h2>
        <h3 style={styles.title}>Login to your account</h3>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label>Email</label>

          <input
            style={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                passwordRef.current.focus();
              }
            }}
            required
          />

          <label>Password</label>

          <div style={styles.passwordWrapper}>
            <input
              ref={passwordRef}
              style={styles.passwordInput}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <span
              style={styles.eye}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button style={styles.loginBtn} type="submit">
            Login
          </button>
        </form>

        <p style={styles.link} onClick={() => navigate("/forgot-password")}>
          Forgot Password?
        </p>

        <p style={{ marginTop: "15px" }}>
          Don't have an account?
          <span
            style={styles.registerLink}
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>

        {message && <p style={styles.message}>{message}</p>}
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

  passwordWrapper: {
    position: "relative",
  },

  passwordInput: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #cbd5f5",
  },

  eye: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
  },

  loginBtn: {
    marginTop: "10px",
    padding: "11px",
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  link: {
    marginTop: "16px",
    color: "#2563eb",
    cursor: "pointer",
  },

  registerLink: {
    marginLeft: "6px",
    color: "#2563eb",
    cursor: "pointer",
  },

  message: {
    marginTop: "15px",
    color: "red",
  },
};

export default Login;
