package com.smartcanteen.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import com.smartcanteen.util.DBConnection;

public class PaymentDAO {

	public int getOrderIdByPayment(int paymentId) {

		String sql = "SELECT order_id FROM payments WHERE payment_id = ?";

		try (Connection con = DBConnection.getConnection(); PreparedStatement ps = con.prepareStatement(sql)) {

			ps.setInt(1, paymentId);

			ResultSet rs = ps.executeQuery();

			if (rs.next()) {
				return rs.getInt("order_id");
			}

		} catch (Exception e) {
			throw new RuntimeException(e);
		}

		return -1;
	}

	public int createPayment(int orderId, double amount) {

		String sql = """
				    INSERT INTO payments
				    (order_id, amount, payment_method, payment_gateway, transaction_id, payment_status)
				    VALUES (?, ?, ?, ?, ?, ?)
				""";

		try (Connection con = DBConnection.getConnection();
				PreparedStatement ps = con.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS)) {

			ps.setInt(1, orderId);
			ps.setDouble(2, amount);
			ps.setString(3, "ONLINE");
			ps.setString(4, "FAKE_GATEWAY");
			ps.setString(5, java.util.UUID.randomUUID().toString());
			ps.setString(6, "PENDING");

			ps.executeUpdate();

			ResultSet rs = ps.getGeneratedKeys();
			if (rs.next()) {
				return rs.getInt(1);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return -1;
	}

	public boolean updatePaymentStatus(int paymentId, String status) {

		String sql = "UPDATE payments SET payment_status = ? WHERE payment_id = ? AND payment_status = 'PENDING'";

		try (Connection con = DBConnection.getConnection(); PreparedStatement ps = con.prepareStatement(sql)) {

			ps.setString(1, status);
			ps.setInt(2, paymentId);

			return ps.executeUpdate() > 0;

		} catch (Exception e) {
			e.printStackTrace();
		}

		return false;
	}

	public boolean refundPaymentByOrderId(int orderId) {

		String sql = "UPDATE payments SET payment_status = 'REFUNDED' WHERE order_id = ? AND payment_status = 'SUCCESS'";

		try (Connection con = DBConnection.getConnection(); PreparedStatement ps = con.prepareStatement(sql)) {

			ps.setInt(1, orderId);

			return ps.executeUpdate() > 0;

		} catch (Exception e) {
			throw new RuntimeException("Failed to refund payment", e);
		}
	}

}