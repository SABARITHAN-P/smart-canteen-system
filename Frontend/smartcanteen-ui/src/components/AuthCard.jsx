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
    padding: "35px",
    background: "white",
    borderRadius: "16px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
    textAlign: "center",
  },
};

export default AuthCard;
