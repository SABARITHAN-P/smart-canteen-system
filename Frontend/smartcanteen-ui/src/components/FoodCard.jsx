import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";
import { addToCart } from "../services/cart";
import "./FoodCard.css";

function FoodCard({ item, shopId, updateCartCount }) {
  const handleAdd = () => {
    addToCart(item, shopId);
    updateCartCount();
  };

  return (
    <motion.div
      className="food-card"
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
    >
      <div className="food-left">
        <h3 className="food-name">{item.itemName}</h3>

        <p className="food-category">{item.category}</p>

        <p className="food-price">₹{item.price}</p>
      </div>

      <motion.button
        className="add-btn"
        whileTap={{ scale: 0.9 }}
        onClick={handleAdd}
      >
        <FaPlus /> Add
      </motion.button>
    </motion.div>
  );
}

export default FoodCard;
