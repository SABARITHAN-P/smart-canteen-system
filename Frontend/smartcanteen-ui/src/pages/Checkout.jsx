import toast from "react-hot-toast";
import { motion } from "framer-motion";

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCart } from "../services/cart";
import { placeOrder } from "../services/api";

function Checkout() {
  const [cart] = useState(() => getCart());
  const navigate = useNavigate();
  const { shopId } = useParams();

  const user = JSON.parse(sessionStorage.getItem("currentUser") || "{}");

  const handleOrder = async () => {
    if (!user.userId) {
      toast.error("User not logged in");
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    try {
      const request = {
        userId: user.userId,
        shopId: parseInt(shopId),
        items: cart.map((item) => ({
          menuId: item.menuId,
          quantity: item.quantity,
        })),
      };

      const response = await placeOrder(request);

      toast.success("Proceed to payment");

      navigate("/payment", {
        state: {
          paymentId: response.paymentId,
          amount: response.amount,
          cart: cart, // send cart for restore if needed
        },
      });
    } catch (error) {
      console.error(error);
      toast.error("Order failed");
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <motion.div
      style={styles.container}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 style={styles.heading}>Checkout</h2>

      <div style={styles.card}>
        <h3 style={styles.subHeading}>Order Summary</h3>

        {cart.map((item) => (
          <div key={item.menuId} style={styles.itemRow}>
            <div>
              <p style={styles.itemName}>{item.itemName}</p>
              <p style={styles.qty}>Qty: {item.quantity}</p>
            </div>

            <p style={styles.price}>₹{item.price * item.quantity}</p>
          </div>
        ))}

        <hr style={{ margin: "18px 0" }} />

        <div style={styles.totalRow}>
          <h3>Total</h3>
          <h3 style={styles.total}>₹{total}</h3>
        </div>
      </div>

      <div style={styles.buttons}>
        <motion.button
          whileTap={{ scale: 0.95 }}
          style={styles.confirmBtn}
          onClick={handleOrder}
        >
          Confirm Order
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          style={styles.backBtn}
          onClick={() => navigate("/cart")}
        >
          Back to Cart
        </motion.button>
      </div>
    </motion.div>
  );
}

const styles = {
  container: {
    padding: "40px",
    maxWidth: "750px",
    margin: "auto",
  },

  heading: {
    marginBottom: "20px",
  },

  card: {
    background: "white",
    padding: "22px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
  },

  subHeading: {
    marginBottom: "18px",
  },

  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid #eee",
  },

  itemName: {
    fontWeight: "500",
  },

  qty: {
    fontSize: "14px",
    color: "#666",
  },

  price: {
    fontWeight: "500",
  },

  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },

  total: {
    color: "#22c55e",
  },

  buttons: {
    marginTop: "28px",
    display: "flex",
    gap: "12px",
  },

  confirmBtn: {
    background: "#22c55e",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  backBtn: {
    background: "#e5e7eb",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default Checkout;
