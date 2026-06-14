// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

function AuthCard({ children, width = "380px" }) {
  return (
    <motion.div
      style={{ ...styles.card, width }}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}

const styles = {
  card: {
    padding: "clamp(18px, 5vw, 35px)",
    background: "white",
    borderRadius: "16px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
    textAlign: "center",
    maxWidth: "calc(100% - 24px)",
    boxSizing: "border-box",
  },
};

export default AuthCard;
