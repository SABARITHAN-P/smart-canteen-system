const BASE_URL = "http://localhost:8080/SmartCanteen/api";

/* =========================
   COMMON FETCH FUNCTION
   ========================= */

async function apiFetch(url, options = {}) {
  const response = await fetch(url, {
    credentials: "include", // IMPORTANT for session
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

/* =========================
   USER AUTHENTICATION
   ========================= */

export async function registerUser(data) {
  return apiFetch(`${BASE_URL}/register`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function loginUser(data) {
  return apiFetch(`${BASE_URL}/login`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/* =========================
   PASSWORD RESET APIs
   ========================= */

export async function forgotPassword(data) {
  return apiFetch(`${BASE_URL}/forgot-password`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function resetPassword(data) {
  return apiFetch(`${BASE_URL}/reset-password`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
/* =========================
   USER PROFILE APIs
   ========================= */

export async function getProfile() {
  return apiFetch(`${BASE_URL}/profile`);
}

export async function updateProfile(data) {
  return apiFetch(`${BASE_URL}/profile`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function changePassword(data) {
  return apiFetch(`${BASE_URL}/profile/password`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
/* =========================
   SHOP APIs
   ========================= */

export async function displayShops() {
  return apiFetch(`${BASE_URL}/shops`);
}

export async function createShopAdmin(data) {
  return apiFetch(`${BASE_URL}/admin/create-shop-admin`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getAllShops() {
  return apiFetch(`${BASE_URL}/admin/shops`);
}

export async function createShop(data) {
  return apiFetch(`${BASE_URL}/admin/shops`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateShop(data) {
  return apiFetch(`${BASE_URL}/admin/shops`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteShop(data) {
  return apiFetch(`${BASE_URL}/admin/shops`, {
    method: "DELETE",
    body: JSON.stringify(data),
  });
}

/* =========================
   MENU APIs
   ========================= */

export async function getMenu(shopId) {
  return apiFetch(`${BASE_URL}/menu?shopId=${shopId}`);
}

export async function addMenu(data) {
  return apiFetch(`${BASE_URL}/menu`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateMenu(data) {
  return apiFetch(`${BASE_URL}/menu`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteMenu(menuId) {
  return apiFetch(`${BASE_URL}/menu?id=${menuId}`, {
    method: "DELETE",
  });
}

/* =========================
   SHOP ADMIN APIs
   ========================= */

export async function getShop(adminId) {
  return apiFetch(`${BASE_URL}/shop-admin?adminId=${adminId}`);
}

export async function toggleShop(shopId) {
  return apiFetch(`${BASE_URL}/shop-admin?shopId=${shopId}`, {
    method: "PUT",
  });
}

/* =========================
   ADMIN USER MANAGEMENT
   ========================= */

export async function getShopAdmins() {
  return apiFetch(`${BASE_URL}/admin/shop-admins`);
}

export async function blockUser(userId) {
  return apiFetch(`${BASE_URL}/admin/shop-admins`, {
    method: "PUT",
    body: JSON.stringify({
      userId,
      status: "BLOCKED",
    }),
  });
}

export async function unblockUser(userId) {
  return apiFetch(`${BASE_URL}/admin/shop-admins`, {
    method: "PUT",
    body: JSON.stringify({
      userId,
      status: "ACTIVE",
    }),
  });
}

export async function getAllUsers() {
  return apiFetch(`${BASE_URL}/admin/users`);
}

export async function changeShopOwner(data) {
  return apiFetch(`${BASE_URL}/admin/shops`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
/* =========================
   ORDER APIs
   ========================= */

export async function placeOrder(data) {
  return apiFetch(`${BASE_URL}/orders`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getOrdersByUser(userId) {
  return apiFetch(`${BASE_URL}/orders/user/${userId}`);
}

export async function getOrdersByShop(shopId) {
  return apiFetch(`${BASE_URL}/orders/shop/${shopId}`);
}

export async function updateOrderStatus(orderId, status) {
  return apiFetch(`${BASE_URL}/orders`, {
    method: "PUT",
    body: JSON.stringify({
      orderId,
      status,
    }),
  });
}

export async function getAllOrders() {
  return apiFetch(`${BASE_URL}/orders/all`);
}

export async function cancelOrder(orderId) {
  return apiFetch(`${BASE_URL}/orders/${orderId}`, {
    method: "DELETE",
  });
}
/* =========================
   DASHBOARD APIs
   ========================= */

export async function getDashboardStats(shopId) {
  return apiFetch(`${BASE_URL}/admin/dashboard?shopId=${shopId}`);
}

/* =========================
   PAYMENT APIs
   ========================= */

export async function paymentSuccess(paymentId) {
  return apiFetch(`${BASE_URL}/payment/success`, {
    method: "POST",
    body: JSON.stringify({
      paymentId,
    }),
  });
}

export async function paymentFail(paymentId) {
  return apiFetch(`${BASE_URL}/payment/fail`, {
    method: "POST",
    body: JSON.stringify({
      paymentId,
    }),
  });
}
/* =========================
   REPORT / FEEDBACK APIs
   ========================= */

export async function submitReport(data) {
  return apiFetch(`${BASE_URL}/report-issue`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getMyReports() {
  return apiFetch(`${BASE_URL}/reports/my`);
}

export async function getAllReports() {
  return apiFetch(`${BASE_URL}/admin/reports`);
}

export async function updateReportStatus(reportId, status) {
  return apiFetch(`${BASE_URL}/admin/reports`, {
    method: "PUT",

    body: JSON.stringify({
      reportId,
      status,
    }),
  });
}