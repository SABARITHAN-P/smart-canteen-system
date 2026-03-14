import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { resetPassword, forgotPassword } from "../services/api";
import AuthLayout from "../components/AuthLayout";
import AuthCard from "../components/AuthCard";

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const [otpArray, setOtpArray] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  useEffect(() => {
    const firstInput = document.getElementById("otp-0");
    if (firstInput) firstInput.focus();
  }, []);

  if (!email) {
    return (
      <AuthLayout>
        <AuthCard>
          <p>Invalid access. Please restart password recovery.</p>
          <button
            style={styles.button}
            onClick={() => navigate("/forgot-password")}
          >
            Go Back
          </button>
        </AuthCard>
      </AuthLayout>
    );
  }

  function maskEmail(value) {
    const [name, domain] = value.split("@");
    return name[0] + "****@" + domain;
  }

  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otpArray];
    newOtp[index] = value;
    setOtpArray(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otpArray];

      if (newOtp[index] === "" && index > 0) {
        document.getElementById(`otp-${index - 1}`).focus();
      } else {
        newOtp[index] = "";
        setOtpArray(newOtp);
      }
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").trim();

    if (!/^\d{6}$/.test(paste)) return;

    const digits = paste.split("");
    setOtpArray(digits);

    digits.forEach((digit, i) => {
      const input = document.getElementById(`otp-${i}`);
      if (input) input.value = digit;
    });
  };

  const otp = otpArray.join("");

  const handleResendOtp = async () => {
    try {
      await forgotPassword({ email });

      setMessage("OTP resent successfully");
      setTimer(30);
      setCanResend(false);
    } catch (error) {
      console.error(error);
      setMessage("Failed to resend OTP");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setMessage("Enter valid 6 digit OTP");
      return;
    }

    if (!newPassword || !confirmPassword) {
      setMessage("All fields are required");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const result = await resetPassword({
        email,
        otp,
        newPassword,
      });

      setMessage(result.message);

      if (result.success) {
        setTimeout(() => navigate("/login"), 1500);
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
      <AuthCard width="420px">
        <h2 style={styles.logo}>🍔 </h2>
        <h3 style={styles.title}>Reset Password</h3>

        <p style={styles.info}>
          OTP sent to <b>{maskEmail(email)}</b>
        </p>

        <form onSubmit={handleSubmit}>
          <div style={styles.otpContainer}>
            {otpArray.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                style={styles.otpInput}
              />
            ))}
          </div>

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
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          {message && <p style={styles.message}>{message}</p>}
        </form>

        <div style={{ marginTop: "15px" }}>
          {canResend ? (
            <button style={styles.resendBtn} onClick={handleResendOtp}>
              Resend OTP
            </button>
          ) : (
            <p style={styles.timer}>Resend OTP in {timer}s</p>
          )}
        </div>
      </AuthCard>
    </AuthLayout>
  );
}

const styles = {
  logo: { marginBottom: "5px", fontSize: "26px" },

  title: { marginBottom: "10px", color: "#64748b" },

  info: { marginBottom: "20px", color: "#555" },

  otpContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    marginBottom: "25px",
  },

  otpInput: {
    width: "50px",
    height: "55px",
    textAlign: "center",
    fontSize: "20px",
    fontWeight: "600",
    border: "2px solid #e2e8f0",
    borderRadius: "10px",
  },

  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
    border: "1px solid #cbd5f5",
  },

  button: {
    width: "100%",
    padding: "11px",
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  resendBtn: {
    background: "transparent",
    border: "none",
    color: "#2563eb",
    cursor: "pointer",
    fontWeight: "600",
  },

  timer: { color: "#777" },

  message: {
    marginTop: "10px",
    color: "green",
  },
};

export default ResetPassword;
