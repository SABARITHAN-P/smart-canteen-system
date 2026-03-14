package com.smartcanteen.service;

import java.sql.Connection;
import java.util.ArrayList;
import java.util.List;

import com.smartcanteen.dao.MenuDAO;
import com.smartcanteen.dao.OrderDAO;
import com.smartcanteen.dao.OrderItemDAO;
import com.smartcanteen.dto.OrderView;
import com.smartcanteen.model.Order;
import com.smartcanteen.model.OrderItem;
import com.smartcanteen.model.OrderStatus;
import com.smartcanteen.util.DBConnection;

public class OrderService {

	private MenuDAO menuDAO = new MenuDAO();
	private OrderDAO orderDAO = new OrderDAO();
	private OrderItemDAO orderItemDAO = new OrderItemDAO();

	public int placeOrder(Order order, List<OrderItem> items) {

		if (order == null || items == null || items.isEmpty()) {
			throw new IllegalArgumentException("Invalid order request");
		}

		Connection con = null;

		try {

			con = DBConnection.getConnection();

			// Start transaction
			con.setAutoCommit(false);

			// Generate next token safely
			int token = orderDAO.getNextTokenNumber(con, order.getShopId());
			order.setTokenNumber(token);
			order.setStatus(OrderStatus.PAYMENT_PENDING);

			// Create order
			int orderId = orderDAO.createOrder(con, order);

			// Prepare order items
			for (OrderItem item : items) {

				double price = menuDAO.getMenuPrice(con, item.getMenuId());

				item.setPriceAtOrder(price);
				item.setOrderId(orderId);
			}

			// Insert items
			orderItemDAO.addOrderItems(con, items);

			// Commit transaction
			con.commit();

			return orderId;

		} catch (Exception e) {

			try {
				if (con != null) {
					con.rollback();
				}
			} catch (Exception rollbackEx) {
				rollbackEx.printStackTrace();
			}

			throw new RuntimeException("Failed to place order", e);

		} finally {

			try {
				if (con != null) {
					con.close();
				}
			} catch (Exception closeEx) {
				closeEx.printStackTrace();
			}
		}
	}

	public boolean cancelOrder(int orderId) {

		if (orderId <= 0) {
			return false;
		}

		boolean cancelled = orderDAO.cancelOrder(orderId);

		if (cancelled) {
			PaymentService paymentService = new PaymentService();
			paymentService.refundPayment(orderId);
		}

		return cancelled;
	}

	public boolean updateOrderStatus(int orderId, OrderStatus status) {

		if (orderId <= 0 || status == null) {
			return false;
		}

		return orderDAO.updateOrderStatus(orderId, status);
	}

	public List<Order> getOrdersByShop(int shopId) {

		if (shopId <= 0) {
			return new ArrayList<>();
		}

		return orderDAO.getOrdersByShopId(shopId);
	}

	public double getOrderTotal(int orderId) {

		if (orderId <= 0) {
			return 0;
		}

		return orderItemDAO.getOrderTotal(orderId);
	}

	public List<OrderView> getOrdersByUser(int userId) {
		return orderDAO.getUserOrdersDetailed(userId);
	}

	public List<OrderView> getAllOrders() {
		return orderDAO.getAllOrders();
	}
}
