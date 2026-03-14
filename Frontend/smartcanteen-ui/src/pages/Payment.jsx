import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

import { paymentSuccess, paymentFail } from "../services/api";
import { clearCart } from "../services/cart";

function Payment() {
  const navigate = useNavigate();
  const location = useLocation();

  const { paymentId, amount } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState("UPI");

  const [upi, setUpi] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const completedRef = useRef(false);
  const mountedRef = useRef(false);

  /* Cancel payment if user leaves page */
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }

    return () => {
      if (!completedRef.current && paymentId) {
        paymentFail(paymentId);
        toast.error("Payment cancelled");
      }
    };
  }, [paymentId]);

  if (!paymentId) {
    navigate("/shops");
    return null;
  }

  const handleSuccess = async () => {
    try {
      setLoading(true);

      await paymentSuccess(paymentId);
      completedRef.current = true;

      clearCart();

      toast.success("Payment Successful!");
      navigate("/my-orders");
    } catch (err) {
      console.error(err);
      toast.error("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFail = async () => {
    try {
      setLoading(true);

      await paymentFail(paymentId);
      completedRef.current = true;

      toast.error("Payment Failed");
      navigate("/cart");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      style={styles.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>Secure Checkout</h2>
          <p style={styles.secure}>
            🔒 Secure payment powered by SmartCanteenPay
          </p>

          <p style={styles.amount}>Amount: ₹{amount}</p>

          {/* Payment Method Tabs */}
          <div style={styles.methodSelector}>
            {["UPI", "CARD", "NETBANKING", "WALLET"].map((m) => (
              <button
                key={m}
                style={method === m ? styles.methodActive : styles.method}
                onClick={() => setMethod(m)}
              >
                {m}
              </button>
            ))}
          </div>

          {/* ================= UPI ================= */}

          {method === "UPI" && (
            <>
              <div style={styles.walletGrid}>
                <button style={styles.upiApp}>GPay</button>
                <button style={styles.upiApp}>PhonePe</button>
                <button style={styles.upiApp}>Paytm</button>
              </div>

              <p style={styles.or}>OR</p>

              <div style={styles.inputGroup}>
                <label>Enter UPI ID</label>
                <input
                  style={styles.input}
                  value={upi}
                  onChange={(e) => setUpi(e.target.value)}
                  placeholder="name@upi"
                />
              </div>

              <div style={styles.qrBox}>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi-payment-${paymentId}`}
                  alt="QR"
                />
                <p style={styles.qrText}>Scan using any UPI app</p>
              </div>
            </>
          )}

          {/* ================= CARD ================= */}

          {method === "CARD" && (
            <>
              <div style={styles.inputGroup}>
                <label>Card Number</label>
                <input
                  style={styles.input}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4242 4242 4242 4242"
                />
                <div style={styles.cardIcons}>
                  <span>💳 Visa</span>
                  <span>💳 Mastercard</span>
                </div>
              </div>

              <div style={styles.row}>
                <input
                  style={styles.input}
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="MM/YY"
                />

                <input
                  style={styles.input}
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="CVV"
                />
              </div>
            </>
          )}

          {/* ================= NET BANKING ================= */}

          {method === "NETBANKING" && (
            <div style={styles.bankGrid}>
              <button style={styles.bank}>SBI</button>
              <button style={styles.bank}>HDFC</button>
              <button style={styles.bank}>ICICI</button>
              <button style={styles.bank}>Axis</button>
            </div>
          )}

          {/* ================= WALLET ================= */}

          {method === "WALLET" && (
            <div style={styles.walletGrid}>
              <button style={styles.wallet}>Paytm</button>
              <button style={styles.wallet}>PhonePe</button>
              <button style={styles.wallet}>Amazon Pay</button>
            </div>
          )}

          {/* Buttons */}

          <motion.button
            whileTap={{ scale: 0.95 }}
            style={styles.payBtn}
            onClick={handleSuccess}
            disabled={loading}
          >
            {loading ? "Processing..." : `Pay ₹${amount}`}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            style={styles.cancelBtn}
            onClick={handleFail}
            disabled={loading}
          >
            Cancel Payment
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f1f5f9",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    width: "100%",
    maxWidth: "500px",
  },

  card: {
    background: "white",
    padding: "35px",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },

  title: {
    marginBottom: "5px",
  },

  secure: {
    fontSize: "13px",
    color: "#64748b",
    marginBottom: "15px",
  },

  amount: {
    fontWeight: "600",
    marginBottom: "20px",
  },

  methodSelector: {
    display: "flex",
    gap: "8px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },

  method: {
    padding: "8px 12px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    background: "white",
    cursor: "pointer",
  },

  methodActive: {
    padding: "8px 12px",
    border: "1px solid #6366f1",
    borderRadius: "6px",
    background: "#eef2ff",
    cursor: "pointer",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "15px",
  },

  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    marginTop: "5px",
  },

  row: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
  },

  walletGrid: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
  },

  wallet: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    background: "white",
    cursor: "pointer",
  },

  upiApp: {
    padding: "10px 14px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    background: "white",
    cursor: "pointer",
  },

  bankGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    marginBottom: "15px",
  },

  bank: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    background: "white",
    cursor: "pointer",
  },

  qrBox: {
    textAlign: "center",
    marginTop: "10px",
  },

  qrText: {
    fontSize: "13px",
    color: "#64748b",
  },

  cardIcons: {
    fontSize: "12px",
    color: "#64748b",
    marginTop: "4px",
  },

  or: {
    textAlign: "center",
    margin: "10px 0",
    color: "#64748b",
  },

  payBtn: {
    width: "100%",
    padding: "12px",
    background: "#22c55e",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    marginTop: "10px",
  },

  cancelBtn: {
    width: "100%",
    padding: "10px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "8px",
    marginTop: "10px",
  },
};

export default Payment;
