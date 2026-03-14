import bg from "../assets/login-bg.png";

function AuthLayout({ children }) {
  return (
    <div style={styles.page}>
      {/* Background floating blobs */}
      <div style={styles.blob1}></div>
      <div style={styles.blob2}></div>

      <div style={styles.left}>
        <img src={bg} alt="canteen" style={styles.image} />

        <h1 style={styles.heading}>QuickBite</h1>

        <p style={styles.tagline}>
          Order food faster, manage shops easily, and make campus dining
          smarter.
        </p>
      </div>

      <div style={styles.right}>{children}</div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    width: "100%",
    display: "flex",
    background: "linear-gradient(135deg,#eef2ff,#f8fafc)",
    position: "relative",
    overflow: "hidden",
  },

  /* Floating gradient blobs */

  blob1: {
    position: "absolute",
    width: "420px",
    height: "420px",
    background: "linear-gradient(135deg,#6366f1,#22c55e)",
    borderRadius: "50%",
    filter: "blur(140px)",
    top: "-120px",
    left: "-120px",
    opacity: 0.35,
    animation: "float 12s ease-in-out infinite",
  },

  blob2: {
    position: "absolute",
    width: "420px",
    height: "420px",
    background: "linear-gradient(135deg,#6366f1,#60a5fa)",
    borderRadius: "50%",
    filter: "blur(140px)",
    bottom: "-120px",
    right: "-120px",
    opacity: 0.35,
    animation: "float 14s ease-in-out infinite",
  },

  left: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
    textAlign: "center",
    zIndex: 2,
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

  right: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
};

export default AuthLayout;
