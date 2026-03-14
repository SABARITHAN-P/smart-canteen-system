import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import AuthLayout from "../components/AuthLayout";
import AuthCard from "../components/AuthCard";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [errors, setErrors] = useState({});

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const mobileRef = useRef(null);
  const submitRef = useRef(null);

  const validate = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = "Name is required";

    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Invalid email format";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (!mobileNumber) newErrors.mobileNumber = "Mobile number is required";
    else if (!/^[0-9]{10}$/.test(mobileNumber))
      newErrors.mobileNumber = "Mobile number must be 10 digits";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const result = await registerUser({
        name,
        email,
        password,
        mobileNumber,
      });

      if (result.success) {
        toast.success("Account created successfully");
        navigate("/login");
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
      <AuthCard width="380px">
        <h2 style={styles.logo}>🍔 QuickBite</h2>
        <h3 style={styles.title}>Create your account</h3>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label>Name</label>
          <input
            style={styles.input}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                emailRef.current.focus();
              }
            }}
          />
          {errors.name && <p style={styles.error}>{errors.name}</p>}

          <label>Email</label>
          <input
            ref={emailRef}
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
          />
          {errors.email && <p style={styles.error}>{errors.email}</p>}

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
          {errors.password && <p style={styles.error}>{errors.password}</p>}

          <label>Mobile Number</label>
          <input
            ref={mobileRef}
            style={styles.input}
            type="tel"
            maxLength="10"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submitRef.current.click();
              }
            }}
          />
          {errors.mobileNumber && (
            <p style={styles.error}>{errors.mobileNumber}</p>
          )}

          <button ref={submitRef} style={styles.registerBtn} type="submit">
            Register
          </button>
        </form>

        <p style={{ marginTop: "15px" }}>
          Already have an account?
          <span style={styles.loginLink} onClick={() => navigate("/login")}>
            Login
          </span>
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
    gap: "8px",
    textAlign: "left",
  },

  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #cbd5f5",
  },

  registerBtn: {
    marginTop: "12px",
    padding: "11px",
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  loginLink: {
    color: "#2563eb",
    cursor: "pointer",
    marginLeft: "5px",
    fontWeight: "600",
  },

  error: {
    color: "red",
    fontSize: "13px",
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
};

export default Register;
