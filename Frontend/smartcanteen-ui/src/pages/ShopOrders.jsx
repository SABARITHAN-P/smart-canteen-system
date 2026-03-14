import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getOrdersByShop, updateOrderStatus } from "../services/api";
import AppLayout from "../components/AppLayout";

function ShopOrders() {
  const [orders, setOrders] = useState([]);

  const user = JSON.parse(sessionStorage.getItem("currentUser") || "{}");
  const shopId = user.shopId;

  const fetchOrders = async () => {
    if (!shopId) return;

    try {
      const data = await getOrdersByShop(shopId);
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  };

  useEffect(() => {
    fetchOrders();

    const interval = setInterval(() => {
      fetchOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, [shopId]);

  const changeStatus = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      fetchOrders();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "#f59e0b";
      case "PREPARING":
        return "#ef4444";
      case "READY":
        return "#22c55e";
      case "COMPLETED":
        return "#64748b";
      default:
        return "#333";
    }
  };

  const activeOrders = orders.filter((order) => order.status !== "COMPLETED");

  return (
    <AppLayout>
      {" "}
      <div style={styles.header}>
        {" "}
        <h2 style={styles.title}>Active Orders</h2>{" "}
        <p style={styles.subtitle}>Live order management</p>{" "}
      </div>
      {activeOrders.length === 0 ? (
        <p style={styles.empty}>No active orders</p>
      ) : (
        activeOrders.map((order) => (
          <motion.div
            key={`${order.orderId}-${order.tokenNumber}`}
            style={styles.card}
            whileHover={{ scale: 1.02 }}
          >
            <div style={styles.left}>
              <h2 style={styles.token}>Token #{order.tokenNumber}</h2>

              {/* ORDER ITEMS */}
              <div style={styles.items}>
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, index) => (
                    <div key={`${item.menuId}-${index}`} style={styles.item}>
                      {item.menuName} x{item.quantity}
                    </div>
                  ))
                ) : (
                  <div style={styles.item}>No items</div>
                )}
              </div>

              <span
                style={{
                  ...styles.status,
                  background: getStatusColor(order.status),
                }}
              >
                {order.status}
              </span>
            </div>

            <div style={styles.buttons}>
              <button
                style={styles.prepareBtn}
                onClick={() => changeStatus(order.orderId, "PREPARING")}
                disabled={order.status !== "PENDING"}
              >
                Preparing
              </button>

              <button
                style={styles.readyBtn}
                onClick={() => changeStatus(order.orderId, "READY")}
                disabled={order.status !== "PREPARING"}
              >
                Ready
              </button>

              <button
                style={styles.completeBtn}
                onClick={() => changeStatus(order.orderId, "COMPLETED")}
                disabled={order.status !== "READY"}
              >
                Completed
              </button>
            </div>
          </motion.div>
        ))
      )}
    </AppLayout>
  );
}

const styles = {
  header: {
    textAlign: "center",
    marginBottom: "35px",
  },

  title: {
    fontSize: "26px",
    fontWeight: "600",
  },

  subtitle: {
    color: "#64748b",
    marginTop: "6px",
  },

  empty: {
    textAlign: "center",
    color: "#64748b",
  },

  card: {
    background: "#f8fafc",
    padding: "22px",
    borderRadius: "18px",
    marginBottom: "16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 15px 35px rgba(0,0,0,0.08)",
  },

  left: {
    display: "flex",
    flexDirection: "column",
  },

  token: {
    margin: 0,
    fontSize: "26px",
    fontWeight: "600",
  },

  items: {
    marginTop: "8px",
    marginBottom: "6px",
  },

  item: {
    fontSize: "14px",
    color: "#475569",
  },

  status: {
    marginTop: "6px",
    padding: "6px 14px",
    borderRadius: "10px",
    color: "white",
    fontSize: "13px",
    fontWeight: "600",
    width: "fit-content",
  },

  buttons: {
    display: "flex",
    gap: "10px",
  },

  prepareBtn: {
    background: "#f59e0b",
    border: "none",
    color: "white",
    padding: "10px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  readyBtn: {
    background: "#22c55e",
    border: "none",
    color: "white",
    padding: "10px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  completeBtn: {
    background: "#6366f1",
    border: "none",
    color: "white",
    padding: "10px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default ShopOrders;
