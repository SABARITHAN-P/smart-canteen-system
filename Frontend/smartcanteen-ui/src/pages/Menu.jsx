import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getMenu } from "../services/api";
import { getCart } from "../services/cart";
import FoodCard from "../components/FoodCard";
import AppLayout from "../components/AppLayout";

function Menu() {
  const { shopId } = useParams();
  const navigate = useNavigate();

  const [menuItems, setMenuItems] = useState([]);
  const [category, setCategory] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  const updateCart = () => {
    const cart = getCart();

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0,
    );

    setCartCount(totalItems);
    setCartTotal(totalPrice);
  };

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await getMenu(shopId);

        const normalized = data.map((item) => ({
          ...item,
          category: item.category?.toUpperCase(),
        }));

        const sorted = normalized.sort((a, b) => {
          if (a.category === b.category) {
            return a.price - b.price;
          }
          return a.category.localeCompare(b.category);
        });

        setMenuItems(sorted);
      } catch (error) {
        console.error("Error fetching menu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [shopId]);

  useEffect(() => {
    updateCart();
  }, []);

  if (loading) {
    return <p style={styles.loading}>Loading menu...</p>;
  }

  const validCategories = [
    "BEVERAGE",
    "JUICE",
    "SNACKS",
    "STARTERS",
    "VEG",
    "NON_VEG",
    "CHINESE",
    "DESSERT",
  ];

  const groupedMenu = menuItems.reduce((groups, item) => {
    const cat = validCategories.includes(item.category)
      ? item.category
      : "OTHER";

    if (!groups[cat]) groups[cat] = [];

    groups[cat].push(item);
    return groups;
  }, {});

  const categoryOrder = [
    "BEVERAGE",
    "JUICE",
    "SNACKS",
    "STARTERS",
    "VEG",
    "NON_VEG",
    "CHINESE",
    "DESSERT",
    "OTHER",
  ];

  return (
    <AppLayout title="🍽 Menu">
      {/* CATEGORY FILTER */}

      <div style={styles.filterBox}>
        <label style={styles.label}>Category</label>

        <select
          style={styles.select}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="ALL">All</option>
          <option value="BEVERAGE">Beverage</option>
          <option value="VEG">Veg</option>
          <option value="NON_VEG">Non-Veg</option>
          <option value="CHINESE">Chinese</option>
          <option value="STARTERS">Starters</option>
          <option value="JUICE">Juice</option>
          <option value="DESSERT">Dessert</option>
          <option value="SNACKS">Snacks</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      {/* MENU */}

      {category === "ALL" ? (
        categoryOrder.map((cat) =>
          groupedMenu[cat] ? (
            <motion.div
              key={cat}
              style={styles.categorySection}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h3 style={styles.categoryTitle}>{cat.replace("_", " ")}</h3>

              <div style={styles.menuGrid}>
                {groupedMenu[cat].map((item) => (
                  <FoodCard
                    key={item.menuId}
                    item={item}
                    shopId={shopId}
                    updateCartCount={updateCart}
                  />
                ))}
              </div>
            </motion.div>
          ) : null,
        )
      ) : (
        <div style={styles.menuGrid}>
          {(category === "OTHER"
            ? groupedMenu["OTHER"] || []
            : menuItems.filter((item) => item.category === category)
          ).map((item) => (
            <FoodCard
              key={item.menuId}
              item={item}
              shopId={shopId}
              updateCartCount={updateCart}
            />
          ))}
        </div>
      )}

      {/* BACK BUTTON */}

      <div style={styles.bottomButtons}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          style={styles.backBtn}
          onClick={() => navigate("/shops")}
        >
          ← Back
        </motion.button>
      </div>

      {/* FLOATING CART BAR */}

      {cartCount > 0 && (
        <motion.div
          style={styles.cartBar}
          initial={{ y: 100 }}
          animate={{ y: 0 }}
        >
          <div>
            {cartCount} items • ₹{cartTotal}
          </div>

          <button style={styles.cartBtn} onClick={() => navigate("/cart")}>
            View Cart 🛒
          </button>
        </motion.div>
      )}
    </AppLayout>
  );
}

const styles = {
  loading: {
    padding: "40px",
    textAlign: "center",
    fontSize: "18px",
  },

  filterBox: {
    marginBottom: "30px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  label: {
    fontWeight: "600",
  },

  select: {
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid #cbd5f5",
    cursor: "pointer",
  },

  categorySection: {
    marginBottom: "35px",
  },

  categoryTitle: {
    borderBottom: "3px solid #6366f1",
    paddingBottom: "6px",
    marginBottom: "15px",
    color: "#334155",
  },

  menuGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  bottomButtons: {
    marginTop: "40px",
  },

  backBtn: {
    background: "#e2e8f0",
    border: "none",
    padding: "12px 22px",
    borderRadius: "10px",
    cursor: "pointer",
  },

  cartBar: {
    position: "fixed",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#111827",
    color: "white",
    padding: "14px 22px",
    borderRadius: "14px",
    display: "flex",
    gap: "18px",
    alignItems: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
    zIndex: 1000,
  },

  cartBtn: {
    background: "#22c55e",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default Menu;
