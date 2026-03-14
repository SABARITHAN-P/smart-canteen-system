import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getAllOrders } from "../services/api";
import AppLayout from "../components/AppLayout";

function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("TODAY");
  const [customDate, setCustomDate] = useState("");

  const fetchOrders = async () => {
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);

    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.orderTime);
    const today = new Date();

    if (filter === "TODAY") {
      return orderDate.toDateString() === today.toDateString();
    }

    if (filter === "YESTERDAY") {
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      return orderDate.toDateString() === yesterday.toDateString();
    }

    if (filter === "7DAYS") {
      const last7 = new Date();
      last7.setDate(today.getDate() - 7);
      return orderDate >= last7;
    }

    if (filter === "30DAYS") {
      const last30 = new Date();
      last30.setDate(today.getDate() - 30);
      return orderDate >= last30;
    }

    if (filter === "CUSTOM" && customDate) {
      const selected = new Date(customDate);
      return orderDate.toDateString() === selected.toDateString();
    }

    return true;
  });

  const groupedOrders = filteredOrders.reduce((acc, order) => {
    if (!acc[order.shopName]) acc[order.shopName] = [];
    acc[order.shopName].push(order);
    return acc;
  }, {});

  const shopRevenue = Object.entries(groupedOrders).map(
    ([shopName, shopOrders]) => {
      const revenue = shopOrders
        .filter((order) => order.status !== "CANCELLED")
        .reduce((sum, order) => {
          return sum + order.price * order.quantity;
        }, 0);

      const uniqueOrders = new Set(shopOrders.map((o) => o.orderId)).size;

      return {
        shopName,
        revenue,
        totalOrders: uniqueOrders,
      };
    },
  );

  return (
    <AppLayout title="📊 All Orders">
      {/* FILTERS */}

      <div style={styles.filters}>
        {["TODAY", "YESTERDAY", "7DAYS", "30DAYS", "CUSTOM"].map((type) => (
          <button
            key={type}
            style={{
              ...styles.filterBtn,
              background:
                filter === type
                  ? "linear-gradient(90deg,#4f46e5,#6366f1)"
                  : "#94a3b8",
            }}
            onClick={() => setFilter(type)}
          >
            {type === "7DAYS"
              ? "Last 7 Days"
              : type === "30DAYS"
                ? "Last 30 Days"
                : type.charAt(0) + type.slice(1).toLowerCase()}
          </button>
        ))}

        {filter === "CUSTOM" && (
          <input
            style={styles.date}
            type="date"
            value={customDate}
            onChange={(e) => setCustomDate(e.target.value)}
          />
        )}
      </div>

      {/* SALES SUMMARY */}

      <h3 style={styles.sectionTitle}>Sales Summary</h3>

      <div style={styles.summaryGrid}>
        {shopRevenue.length === 0 ? (
          <p>No sales data</p>
        ) : (
          shopRevenue.map((shop) => (
            <motion.div
              key={shop.shopName}
              style={styles.summaryCard}
              whileHover={{ scale: 1.03 }}
            >
              <h4>{shop.shopName}</h4>
              <p>Total Orders: {shop.totalOrders}</p>
              <p style={styles.revenue}>₹{shop.revenue}</p>
            </motion.div>
          ))
        )}
      </div>

      {/* ORDERS */}

      {filteredOrders.length === 0 ? (
        <p style={{ marginTop: "25px" }}>No orders found</p>
      ) : (
        Object.entries(groupedOrders).map(([shopName, shopOrders]) => (
          <div key={shopName} style={{ marginTop: "40px" }}>
            <h3 style={styles.shopTitle}>{shopName}</h3>

            {shopOrders.map((order) => (
              <motion.div
                key={order.orderId + order.itemName}
                style={styles.orderCard}
                whileHover={{ scale: 1.02 }}
              >
                <div style={styles.orderRow}>
                  <span>
                    {order.quantity} × {order.itemName}
                  </span>

                  <span style={styles.price}>
                    ₹{order.price * order.quantity}
                  </span>
                </div>

                <div style={styles.orderRow}>
                  <span style={styles.status}>{order.status}</span>
                  <small>{formatDateTime(order.orderTime)}</small>
                </div>
              </motion.div>
            ))}
          </div>
        ))
      )}
    </AppLayout>
  );
}

const styles = {
  filters: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "25px",
  },

  filterBtn: {
    padding: "10px 16px",
    border: "none",
    borderRadius: "10px",
    color: "white",
    cursor: "pointer",
    fontWeight: "500",
  },

  date: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #cbd5f5",
  },

  sectionTitle: {
    marginTop: "30px",
    marginBottom: "10px",
  },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
    gap: "18px",
  },

  summaryCard: {
    background: "#f8fafc",
    padding: "20px",
    borderRadius: "18px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },

  revenue: {
    fontWeight: "600",
    fontSize: "18px",
    color: "#22c55e",
  },

  shopTitle: {
    marginBottom: "10px",
  },

  orderCard: {
    background: "#f8fafc",
    padding: "16px",
    marginTop: "12px",
    borderRadius: "14px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
  },

  orderRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "5px",
  },

  price: {
    fontWeight: "600",
  },

  status: {
    fontWeight: "500",
    color: "#4f46e5",
  },
};

export default AllOrders;
