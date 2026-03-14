package com.smartcanteen.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import com.smartcanteen.model.OrderItem;
import com.smartcanteen.util.DBConnection;

public class OrderItemDAO {

	public void addOrderItem(Connection con, OrderItem item) throws SQLException {

		String sql = "INSERT INTO order_items (order_id, menu_id, quantity, price_at_order) VALUES (?, ?, ?, ?)";
		try (PreparedStatement ps = con.prepareStatement(sql)) {
			ps.setInt(1, item.getOrderId());
			ps.setInt(2, item.getMenuId());
			ps.setInt(3, item.getQuantity());
			ps.setDouble(4, item.getPriceAtOrder());
			ps.executeUpdate();
		}
	}

	public void addOrderItems(Connection con, List<OrderItem> items) throws SQLException {

		String sql = "INSERT INTO order_items (order_id, menu_id, quantity, price_at_order) VALUES (?, ?, ?, ?)";

		try (PreparedStatement ps = con.prepareStatement(sql)) {

			for (OrderItem item : items) {
				ps.setInt(1, item.getOrderId());
				ps.setInt(2, item.getMenuId());
				ps.setInt(3, item.getQuantity());
				ps.setDouble(4, item.getPriceAtOrder());
				ps.addBatch();
			}

			ps.executeBatch();
		}
	}

	public List<OrderItem> getItemsByOrderId(Connection con, int orderId) throws SQLException {

	    String sql = "SELECT oi.*, m.item_name FROM order_items oi " +
	                 "JOIN menu m ON oi.menu_id = m.menu_id " +
	                 "WHERE oi.order_id = ?";

	    List<OrderItem> items = new ArrayList<>();

	    try (PreparedStatement ps = con.prepareStatement(sql)) {

	        ps.setInt(1, orderId);

	        try (ResultSet rs = ps.executeQuery()) {

	            while (rs.next()) {

	                OrderItem item = new OrderItem();

	                item.setOrderItemId(rs.getInt("order_item_id"));
	                item.setOrderId(rs.getInt("order_id"));
	                item.setMenuId(rs.getInt("menu_id"));
	                item.setQuantity(rs.getInt("quantity"));
	                item.setPriceAtOrder(rs.getDouble("price_at_order"));

	                // IMPORTANT FIX
	                item.setMenuName(rs.getString("item_name"));

	                items.add(item);
	            }
	        }
	    }

	    return items;
	}

	public double getOrderTotal(int orderId) {

		String sql = "SELECT SUM(price_at_order * quantity) AS total FROM order_items WHERE order_id = ?";
		try (Connection con = DBConnection.getConnection(); PreparedStatement ps = con.prepareStatement(sql)) {
			ps.setInt(1, orderId);

			try (ResultSet rs = ps.executeQuery()) {
				if (rs.next()) {
					return rs.getDouble("total");
				}
			}
		} catch (SQLException e) {
			throw new RuntimeException("Failed to calculate order total", e);
		}
		return 0;
	}
}