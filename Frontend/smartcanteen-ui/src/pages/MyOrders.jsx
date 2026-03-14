import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getOrdersByUser, cancelOrder } from "../services/api";
import AppLayout from "../components/AppLayout";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem("currentUser") || "{}");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrdersByUser(user.userId);
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    if (user.userId) {
      fetchOrders();
    }
  }, [user.userId]);

  const getStatusColor = (status) => {
    if (status === "PENDING") return "#6366f1";
    if (status === "PREPARING") return "#f59e0b";
    if (status === "READY") return "#22c55e";
    if (status === "COMPLETED") return "#16a34a";
    if (status === "CANCELLED") return "#ef4444";
    return "#64748b";
  };

  const handleCancel = async (orderId) => {
    const result = await Swal.fire({
      title: "Cancel Order?",
      text: "Are you sure you want to cancel this order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await cancelOrder(orderId);

      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === orderId ? { ...o, status: "CANCELLED" } : o,
        ),
      );

      Swal.fire("Cancelled!", "Your order was cancelled.", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to cancel order", "error");
    }
  };

  return (
    <AppLayout title="📦 My Orders">
      {orders.length === 0 ? (
        <p style={styles.empty}>No orders found</p>
      ) : (
        orders.map((order) => {
          const date = new Date(order.orderTime);

          const formattedDateTime = date.toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });

          return (
            <motion.div
              key={order.orderId}
              style={styles.card}
              whileHover={{ scale: 1.02 }}
            >
              <div style={styles.topRow}>
                <div>
                  <h3 style={styles.shop}>{order.shopName}</h3>
                  <small style={styles.orderId}>
                    Order ID: #{order.orderId}
                  </small>
                </div>

                <span
                  style={{
                    ...styles.statusBadge,
                    background: getStatusColor(order.status),
                  }}
                >
                  {order.status}
                </span>
              </div>

              <p style={styles.item}>
                {order.quantity} × {order.itemName}
              </p>

              <p style={styles.price}>₹{order.price * order.quantity}</p>

              {order.status === "CANCELLED" && (
                <p style={styles.cancelledText}>Order Cancelled</p>
              )}
              {order.status === "PENDING" && (
                <button
                  style={styles.cancelBtn}
                  onClick={() => handleCancel(order.orderId)}
                >
                  Cancel Order
                </button>
              )}
              <small style={styles.date}>{formattedDateTime}</small>
            </motion.div>
          );
        })
      )}

      <button
        style={styles.backBtn}
        onClick={() => navigate("/user-dashboard")}
      >
        ← Back
      </button>
    </AppLayout>
  );
}

const styles = {
  empty: {
    color: "#64748b",
    marginBottom: "20px",
  },

  card: {
    background: "#f8fafc",
    padding: "20px",
    borderRadius: "16px",
    marginBottom: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },

  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },

  shop: {
    margin: 0,
  },

  orderId: {
    color: "#64748b",
    fontSize: "12px",
  },

  item: {
    color: "#475569",
  },

  price: {
    fontWeight: "600",
    marginTop: "6px",
  },

  cancelledText: {
    color: "#ef4444",
    fontWeight: "600",
    marginTop: "8px",
  },

  cancelBtn: {
    marginTop: "10px",
    padding: "6px 14px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
  },

  statusBadge: {
    padding: "5px 12px",
    borderRadius: "10px",
    color: "white",
    fontSize: "12px",
    fontWeight: "500",
  },

  date: {
    color: "#64748b",
    display: "block",
    marginTop: "8px",
  },

  backBtn: {
    marginTop: "25px",
    padding: "12px 20px",
    background: "linear-gradient(90deg,#4f46e5,#6366f1)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default MyOrders;
