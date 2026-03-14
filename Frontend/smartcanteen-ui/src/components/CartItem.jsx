import { motion } from "framer-motion";
import { FaTrash } from "react-icons/fa";
import {
  increaseQuantity,
  decreaseQuantity,
  removeItem,
} from "../services/cart";

import "./CartItem.css";

function CartItem({ item, refreshCart }) {
  const handleDecrease = () => {
    decreaseQuantity(item.menuId);
    refreshCart();
  };

  const handleIncrease = () => {
    increaseQuantity(item.menuId);
    refreshCart();
  };

  const handleRemove = () => {
    removeItem(item.menuId);
    refreshCart();
  };

  return (
    <motion.div
      className="cart-item"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="cart-info">
        <h3 className="item-name">{item.itemName}</h3>
        <p className="item-price">₹{item.price}</p>
      </div>

      <div className="quantity-controls">
        <motion.button
          className="qty-btn"
          whileTap={{ scale: 0.85 }}
          onClick={handleDecrease}
        >
          −
        </motion.button>

        <span className="qty-number">{item.quantity}</span>

        <motion.button
          className="qty-btn"
          whileTap={{ scale: 0.85 }}
          onClick={handleIncrease}
        >
          +
        </motion.button>
      </div>

      <motion.button
        className="remove-btn"
        whileTap={{ scale: 0.9 }}
        onClick={handleRemove}
      >
        <FaTrash />
      </motion.button>
    </motion.div>
  );
}

export default CartItem;
