package com.smartcanteen.dao;

import com.smartcanteen.util.DBConnection;
import java.sql.*;
import java.util.HashMap;
import java.util.Map;

public class AdminDashboardDAO {

	public Map<String, Object> getStats(int shopId) {

		Map<String, Object> stats = new HashMap<>();

		try (Connection con = DBConnection.getConnection()) {

			// Orders Today
			String ordersSql = "SELECT COUNT(*) FROM orders " + "WHERE shop_id=? "
					+ "AND DATE(order_time) = CURRENT_DATE " + "AND status != 'CANCELLED'";

			PreparedStatement ps1 = con.prepareStatement(ordersSql);
			ps1.setInt(1, shopId);

			ResultSet rs1 = ps1.executeQuery();
			rs1.next();
			stats.put("ordersToday", rs1.getInt(1));

			// Revenue Today
			String revenueSql = "SELECT IFNULL(SUM(oi.price_at_order * oi.quantity),0) " + "FROM orders o "
					+ "JOIN order_items oi ON o.order_id = oi.order_id " + "WHERE o.shop_id=? "
					+ "AND DATE(o.order_time) = CURRENT_DATE " + "AND o.status != 'CANCELLED'";

			PreparedStatement ps2 = con.prepareStatement(revenueSql);
			ps2.setInt(1, shopId);

			ResultSet rs2 = ps2.executeQuery();
			rs2.next();
			stats.put("revenueToday", rs2.getDouble(1));

			// Active Orders
			String activeSql = "SELECT COUNT(*) FROM orders " + "WHERE shop_id=? "
					+ "AND DATE(order_time) = CURRENT_DATE " + "AND status IN ('PENDING','PREPARING')";

			PreparedStatement ps3 = con.prepareStatement(activeSql);
			ps3.setInt(1, shopId);

			ResultSet rs3 = ps3.executeQuery();
			rs3.next();
			stats.put("activeOrders", rs3.getInt(1));

		} catch (Exception e) {
			e.printStackTrace();
		}

		return stats;
	}
}