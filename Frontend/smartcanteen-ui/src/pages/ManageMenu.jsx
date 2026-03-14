import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { getMenu, addMenu, updateMenu, deleteMenu } from "../services/api";
import AppLayout from "../components/AppLayout";

function ManageMenu() {
  const storedUser = JSON.parse(sessionStorage.getItem("currentUser"));
  const shopId = storedUser?.shopId;

  const [menus, setMenus] = useState([]);

  const [form, setForm] = useState({
    itemName: "",
    price: "",
    category: "",
    availabilityStatus: "AVAILABLE",
  });

  const [editingId, setEditingId] = useState(null);
  const [customCategory, setCustomCategory] = useState("");

  const itemRef = useRef(null);
  const priceRef = useRef(null);
  const categoryRef = useRef(null);
  const customCategoryRef = useRef(null);
  const statusRef = useRef(null);
  const submitRef = useRef(null);

  const fetchMenu = async () => {
    try {
      if (!shopId) return;
      const data = await getMenu(shopId);
      setMenus(data);
    } catch (error) {
      console.error("Failed to fetch menu", error);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [shopId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "category") {
      setForm({ ...form, category: value });
      if (value !== "OTHER") setCustomCategory("");
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const finalCategory =
        form.category === "OTHER" ? customCategory : form.category;

      const payload = {
        ...form,
        category: finalCategory,
        price: Number(form.price),
        shopId,
      };

      if (editingId) {
        await updateMenu({ ...payload, menuId: editingId });
        toast.success("Menu updated");
      } else {
        await addMenu(payload);
        toast.success("Menu item added");
      }

      setForm({
        itemName: "",
        price: "",
        category: "",
        availabilityStatus: "AVAILABLE",
      });

      setCustomCategory("");
      setEditingId(null);

      fetchMenu();
    } catch (error) {
      console.error(error);
      toast.error("Operation failed");
    }
  };

  const handleEdit = (menu) => {
    setForm({
      itemName: menu.itemName,
      price: menu.price,
      category: menu.category,
      availabilityStatus: menu.availabilityStatus,
    });

    setCustomCategory("");
    setEditingId(menu.menuId);
  };

  const toggleStatus = async (menu) => {
    try {
      const newStatus =
        menu.availabilityStatus === "AVAILABLE" ? "UNAVAILABLE" : "AVAILABLE";

      await updateMenu({
        ...menu,
        availabilityStatus: newStatus,
        shopId,
      });

      fetchMenu();
    } catch (error) {
      console.error("Status update failed", error);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Item?",
      text: "This item will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteMenu(id);
      toast.success("Menu item deleted");
      fetchMenu();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete item");
    }
  };

  if (!shopId) {
    return <p>Shop ID not found. Please login again.</p>;
  }

  return (
    <AppLayout>
      <div style={styles.header}>
        <h2 style={styles.title}>Manage Menu</h2>
        <p style={styles.subtitle}>Add and manage food items</p>
      </div>

      {/* FORM CARD */}

      <motion.div
        style={styles.card}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3>{editingId ? "Update Menu Item" : "Add New Item"}</h3>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            ref={itemRef}
            name="itemName"
            placeholder="Item Name"
            value={form.itemName}
            onChange={handleChange}
            required
          />

          <input
            ref={priceRef}
            name="price"
            type="text"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
          />

          <select
            ref={categoryRef}
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
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

          {form.category === "OTHER" && (
            <input
              ref={customCategoryRef}
              type="text"
              placeholder="Enter custom category"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              required
            />
          )}

          <select
            ref={statusRef}
            name="availabilityStatus"
            value={form.availabilityStatus}
            onChange={handleChange}
          >
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="UNAVAILABLE">UNAVAILABLE</option>
          </select>

          <button ref={submitRef} style={styles.primaryBtn} type="submit">
            {editingId ? "Update Item" : "Add Item"}
          </button>
        </form>
      </motion.div>

      {/* TABLE CARD */}

      <div style={styles.card}>
        <h3>Menu Items</h3>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Item</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {menus.map((menu) => (
              <tr key={menu.menuId}>
                <td style={styles.td}>{menu.itemName}</td>
                <td style={styles.td}>₹{menu.price}</td>
                <td style={styles.td}>{menu.category}</td>

                <td style={styles.td}>
                  {menu.availabilityStatus === "AVAILABLE"
                    ? "🟢 Available"
                    : "🔴 Unavailable"}
                </td>

                <td style={{ ...styles.td, ...styles.actionsCell }}>
                  <button
                    style={styles.editBtn}
                    onClick={() => handleEdit(menu)}
                  >
                    Edit
                  </button>

                  <button
                    style={styles.deleteBtn}
                    onClick={() => handleDelete(menu.menuId)}
                  >
                    Delete
                  </button>

                  <button
                    style={styles.toggleBtn}
                    onClick={() => toggleStatus(menu)}
                  >
                    Toggle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}

const styles = {
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },

  title: {
    fontSize: "26px",
    fontWeight: "600",
  },

  subtitle: {
    color: "#64748b",
  },

  card: {
    background: "#f8fafc",
    padding: "30px",
    borderRadius: "20px",
    marginBottom: "25px",
    boxShadow: "0 18px 40px rgba(0,0,0,0.08)",
  },

  form: {
    display: "grid",
    gap: "12px",
    marginTop: "10px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "15px",
  },

  th: {
    textAlign: "left",
    padding: "14px 10px",
    borderBottom: "2px solid #e2e8f0",
  },

  td: {
    padding: "14px 10px",
    borderBottom: "1px solid #e2e8f0",
  },

  actionsCell: {
    whiteSpace: "nowrap",
    width: "220px",
  },

  primaryBtn: {
    padding: "12px",
    background: "linear-gradient(90deg,#4f46e5,#6366f1)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },

  editBtn: {
    marginRight: "6px",
    padding: "8px 12px",
    background: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  deleteBtn: {
    marginRight: "6px",
    padding: "8px 12px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  toggleBtn: {
    padding: "8px 12px",
    background: "#22c55e",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
export default ManageMenu;
