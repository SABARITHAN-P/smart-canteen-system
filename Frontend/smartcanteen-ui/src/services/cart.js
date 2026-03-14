export function getCart() {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
}

export function addToCart(item, shopId) {
  const cart = getCart();

  if (cart.length > 0 && cart[0].shopId !== shopId) {
    alert("You can only order from one shop at a time");
    return;
  }

  const existing = cart.find((i) => i.menuId === item.menuId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      menuId: item.menuId,
      itemName: item.itemName,
      price: item.price,
      quantity: 1,
      shopId: shopId,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
}

export function clearCart() {
  localStorage.removeItem("cart");
}

export function increaseQuantity(menuId) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const item = cart.find((i) => i.menuId === menuId);
  if (item) {
    item.quantity += 1;
  }

  localStorage.setItem("cart", JSON.stringify(cart));
}

export function decreaseQuantity(menuId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const item = cart.find((i) => i.menuId === menuId);

  if (item) {
    item.quantity -= 1;

    if (item.quantity <= 0) {
      cart = cart.filter((i) => i.menuId !== menuId);
    }
  }

  localStorage.setItem("cart", JSON.stringify(cart));
}

export function removeItem(menuId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart = cart.filter((i) => i.menuId !== menuId);

  localStorage.setItem("cart", JSON.stringify(cart));
}
