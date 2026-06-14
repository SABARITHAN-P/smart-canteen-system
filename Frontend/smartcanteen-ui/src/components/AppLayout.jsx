import Navbar from "./Navbar";

function AppLayout({ children, user, setUser }) {
  return (
    <div style={styles.page}>
      {/* Top Navigation */}
      <Navbar user={user} setUser={setUser} />

      {/* Page Content */}
      <div style={styles.contentWrapper}>
        <div style={styles.container}>{children}</div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#c7d2fe,#e0e7ff)",
  },

  contentWrapper: {
    paddingTop: "90px", // prevents navbar overlap
    paddingBottom: "clamp(20px, 5vw, 40px)",
    paddingLeft: "clamp(10px, 3vw, 20px)",
    paddingRight: "clamp(10px, 3vw, 20px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  container: {
    width: "100%",
    maxWidth: "1100px",
    margin: "auto",
    background: "white",
    padding: "clamp(15px, 5vw, 40px)",
    borderRadius: "20px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
    boxSizing: "border-box",
  },
};

export default AppLayout;
