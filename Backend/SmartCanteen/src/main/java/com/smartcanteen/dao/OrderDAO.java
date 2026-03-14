package com.smartcanteen.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.smartcanteen.dto.OrderView;
import com.smartcanteen.model.Order;
import com.smartcanteen.model.OrderStatus;
import com.smartcanteen.util.DBConnection;

public class OrderDAO {

	public int getNextTokenNumber(Connection con, int shopId) throws SQLException {

		String sql = "SELECT MAX(token_number) AS max_token FROM orders WHERE shop_id = ? AND order_date = CURRENT_DATE FOR UPDATE";

		try (PreparedStatement ps = con.prepareStatement(sql)) {

			ps.setInt(1, shopId);

			try (ResultSet rs = ps.executeQuery()) {

				if (rs.next()) {

					int maxToken = rs.getInt("max_token");

					if (rs.wasNull()) {
						return 1;
					}

					return maxToken + 1;
				}
			}
		}

		return 1;
	}

	public int createOrder(Connection con, Order order) throws SQLException {

		String sql = "INSERT INTO orders (user_id, shop_id, token_number, status, order_time) VALUES (?, ?, ?, ?, NOW())";

		try (PreparedStatement ps = con.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS)) {

			ps.setInt(1, order.getUserId());
			ps.setInt(2, order.getShopId());
			ps.setInt(3, order.getTokenNumber());
			ps.setString(4, order.getStatus().name());

			int rows = ps.executeUpdate();

			if (rows == 0) {
				throw new SQLException("Creating order failed.");
			}

			try (ResultSet rs = ps.getGeneratedKeys()) {

				if (rs.next()) {
					return rs.getInt(1);
				}
			}
		}

		throw new SQLException("Creating order failed, no ID obtained.");
	}

	public List<OrderView> getUserOrdersDetailed(int userId) {

		String sql = "SELECT o.order_id, s.shop_name, m.item_name, oi.price_at_order, oi.quantity, o.status, o.order_time "
				+ "FROM orders o " + "JOIN order_items oi ON o.order_id = oi.order_id "
				+ "JOIN menu m ON oi.menu_id = m.menu_id " + "JOIN shops s ON o.shop_id = s.shop_id "
				+ "WHERE o.user_id = ? " + "ORDER BY o.order_time DESC";

		List<OrderView> orders = new ArrayList<>();

		try (Connection con = DBConnection.getConnection(); PreparedStatement ps = con.prepareStatement(sql)) {

			ps.setInt(1, userId);

			ResultSet rs = ps.executeQuery();

			while (rs.next()) {

				OrderView order = new OrderView();

				order.setOrderId(rs.getInt("order_id"));
				order.setShopName(rs.getString("shop_name"));
				order.setItemName(rs.getString("item_name"));
				order.setPrice(rs.getDouble("price_at_order"));
				order.setQuantity(rs.getInt("quantity"));
				order.setStatus(rs.getString("status"));
				order.setOrderTime(rs.getString("order_time"));

				orders.add(order);
			}

		} catch (SQLException e) {
			throw new RuntimeException(e);
		}

		return orders;
	}

	public List<OrderView> getAllOrders() {

		String sql = """
				    SELECT
				        o.order_id,
				        s.shop_name,
				        m.item_name,
				        oi.quantity,
				        oi.price_at_order,
				        o.status,
				        o.order_time
				    FROM orders o
				    JOIN order_items oi ON o.order_id = oi.order_id
				    JOIN menu m ON oi.menu_id = m.menu_id
				    JOIN shops s ON o.shop_id = s.shop_id
				    ORDER BY o.order_time DESC
				""";

		List<OrderView> orders = new ArrayList<>();

		try (Connection con = DBConnection.getConnection();
				PreparedStatement ps = con.prepareStatement(sql);
				ResultSet rs = ps.executeQuery()) {

			while (rs.next()) {

				OrderView order = new OrderView();

				order.setOrderId(rs.getInt("order_id"));
				order.setShopName(rs.getString("shop_name"));
				order.setItemName(rs.getString("item_name"));
				order.setQuantity(rs.getInt("quantity"));
				order.setPrice(rs.getDouble("price_at_order"));
				order.setStatus(rs.getString("status"));
				order.setOrderTime(rs.getString("order_time"));

				orders.add(order);
			}

		} catch (SQLException e) {
			throw new RuntimeException("Failed to fetch all orders", e);
		}

		return orders;
	}

	public List<Order> getOrdersByShopId(int shopId) {

		String orderSql = "SELECT order_id, token_number, status, order_time " + "FROM orders " + "WHERE shop_id = ? "
				+ "AND order_date = CURRENT_DATE " + "AND status != 'CANCELLED' " + "ORDER BY token_number";

		List<Order> orders = new ArrayList<>();

		try (Connection con = DBConnection.getConnection(); PreparedStatement ps = con.prepareStatement(orderSql)) {

			ps.setInt(1, shopId);

			ResultSet rs = ps.executeQuery();

			OrderItemDAO itemDAO = new OrderItemDAO();

			while (rs.next()) {

				Order order = new Order();

				int orderId = rs.getInt("order_id");

				order.setOrderId(orderId);
				order.setTokenNumber(rs.getInt("token_number"));
				order.setStatus(OrderStatus.valueOf(rs.getString("status")));
				order.setOrderTime(rs.getTimestamp("order_time").toString());

				// fetch items for this order
				order.setItems(itemDAO.getItemsByOrderId(con, orderId));

				orders.add(order);
			}

		} catch (SQLException e) {
			throw new RuntimeException("Failed to fetch shop orders", e);
		}

		return orders;
	}

	public Order getOrderById(int orderId) {

		String sql = "SELECT * FROM orders WHERE order_id = ?";

		try (Connection con = DBConnection.getConnection(); PreparedStatement ps = con.prepareStatement(sql)) {

			ps.setInt(1, orderId);

			try (ResultSet rs = ps.executeQuery()) {

				if (rs.next()) {

					Order order = new Order();

					order.setOrderId(rs.getInt("order_id"));
					order.setUserId(rs.getInt("user_id"));
					order.setShopId(rs.getInt("shop_id"));
					order.setTokenNumber(rs.getInt("token_number"));
					order.setStatus(OrderStatus.valueOf(rs.getString("status")));
					order.setOrderTime(rs.getTimestamp("order_time").toString());

					return order;
				}
			}

		} catch (SQLException e) {
			throw new RuntimeException("Failed to fetch order", e);
		}

		return null;
	}

	public boolean updateOrderStatus(int orderId, OrderStatus status) {

		String sql = "UPDATE orders SET status = ? WHERE order_id = ?";

		try (Connection con = DBConnection.getConnection(); PreparedStatement ps = con.prepareStatement(sql)) {

			ps.setString(1, status.name());
			ps.setInt(2, orderId);

			return ps.executeUpdate() > 0;

		} catch (SQLException e) {
			throw new RuntimeException("Failed to update order status", e);
		}
	}

	public boolean cancelOrder(int orderId) {

		String sql = "UPDATE orders SET status = 'CANCELLED' WHERE order_id = ? AND status = 'PENDING'";

		try (Connection con = DBConnection.getConnection(); PreparedStatement ps = con.prepareStatement(sql)) {

			ps.setInt(1, orderId);

			return ps.executeUpdate() > 0;

		} catch (SQLException e) {
			throw new RuntimeException("Failed to cancel order", e);
		}
	}
}