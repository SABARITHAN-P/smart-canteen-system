import { useState } from "react";
import { motion } from "framer-motion";
import { getCart, clearCart } from "../services/cart";
import { useNavigate } from "react-router-dom";
import CartItem from "../components/CartItem";
import AppLayout from "../components/AppLayout";

function Cart() {
  const [cart, setCart] = useState(() => getCart());
  const navigate = useNavigate();

  const refreshCart = () => {
    setCart(getCart());
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AppLayout title="🛒 Your Cart">
      {cart.length === 0 ? (
        <div style={styles.emptyBox}>
          <p style={styles.emptyText}>Your cart is empty</p>

          <motion.button
            whileTap={{ scale: 0.9 }}
            style={styles.shopBtn}
            onClick={() => navigate("/shops")}
          >
            Browse Shops
          </motion.button>
        </div>
      ) : (
        <div style={styles.container}>
          {/* CART ITEMS */}

          <div style={styles.cartList}>
            {cart.map((item) => (
              <CartItem
                key={item.menuId}
                item={item}
                refreshCart={refreshCart}
              />
            ))}
          </div>

          {/* TOTAL SECTION */}

          <motion.div
            style={styles.summary}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 style={styles.total}>Total: ₹{total}</h3>

            <div style={styles.buttons}>
              <motion.button
                whileTap={{ scale: 0.9 }}
                style={styles.orderBtn}
                onClick={() => navigate(`/checkout/${cart[0].shopId}`)}
              >
                Place Order
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                style={styles.clearBtn}
                onClick={() => {
                  clearCart();
                  setCart([]);
                }}
              >
                Clear Cart
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AppLayout>
  );
}

const styles = {
  container: {
    maxWidth: "850px",
    margin: "0 auto",
  },

  cartList: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  emptyBox: {
    marginTop: "40px",
    textAlign: "center",
    background: "#f8fafc",
    padding: "45px",
    borderRadius: "18px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    maxWidth: "600px",
    marginInline: "auto",
  },

  emptyText: {
    fontSize: "18px",
    marginBottom: "18px",
    color: "#475569",
  },

  shopBtn: {
    background: "linear-gradient(90deg,#4f46e5,#6366f1)",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },

  summary: {
    marginTop: "35px",
    padding: "30px",
    background: "#f8fafc",
    borderRadius: "18px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },

  total: {
    fontSize: "22px",
    marginBottom: "18px",
    color: "#0f172a",
  },

  buttons: {
    display: "flex",
    gap: "14px",
  },

  orderBtn: {
    background: "linear-gradient(90deg,#22c55e,#16a34a)",
    color: "white",
    border: "none",
    padding: "12px 22px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },

  clearBtn: {
    background: "linear-gradient(90deg,#ef4444,#dc2626)",
    color: "white",
    border: "none",
    padding: "12px 22px",
    borderRadius: "10px",
    cursor: "pointer",
  },
};

export default Cart;
