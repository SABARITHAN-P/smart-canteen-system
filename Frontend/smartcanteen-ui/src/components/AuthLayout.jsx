import bg from "../assets/login-bg.png";

function AuthLayout({ children }) {
  return (
    <div className="auth-container">
      {/* Background floating blobs */}
      <div style={styles.blob1}></div>
      <div style={styles.blob2}></div>

      <div className="auth-left">
        <img src={bg} alt="canteen" style={styles.image} />

        <h1 style={styles.heading}>QuickBite</h1>

        <p style={styles.tagline}>
          Order food faster, manage shops easily, and make campus dining
          smarter.
        </p>
      </div>

      <div className="auth-right">{children}</div>
    </div>
  );
}

const styles = {
  /* Floating gradient blobs */

  blob1: {
    position: "absolute",
    width: "clamp(200px, 40vw, 420px)",
    height: "clamp(200px, 40vw, 420px)",
    background: "linear-gradient(135deg,#6366f1,#22c55e)",
    borderRadius: "50%",
    filter: "blur(100px)",
    top: "-100px",
    left: "-100px",
    opacity: 0.35,
    animation: "float 12s ease-in-out infinite",
  },

  blob2: {
    position: "absolute",
    width: "clamp(200px, 40vw, 420px)",
    height: "clamp(200px, 40vw, 420px)",
    background: "linear-gradient(135deg,#6366f1,#60a5fa)",
    borderRadius: "50%",
    filter: "blur(100px)",
    bottom: "-100px",
    right: "-100px",
    opacity: 0.35,
    animation: "float 14s ease-in-out infinite",
  },

  image: {
    width: "85%",
    maxWidth: "560px",
    marginBottom: "20px",
  },

  heading: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "10px",
  },

  tagline: {
    fontSize: "16px",
    color: "#64748b",
    maxWidth: "420px",
    lineHeight: "1.6",
  },
};

export default AuthLayout;
