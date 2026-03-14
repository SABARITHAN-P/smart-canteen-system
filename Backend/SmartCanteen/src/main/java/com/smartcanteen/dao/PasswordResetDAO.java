package com.smartcanteen.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;

import com.smartcanteen.model.PasswordReset;
import com.smartcanteen.util.DBConnection;

public class PasswordResetDAO {
	public boolean saveOtp(int userId, String otp, LocalDateTime expiryTime) {
		if (userId <= 0) {
			return false;
		}
		if (otp == null || otp.isBlank()) {
			return false;
		}
		if (expiryTime == null) {
			return false;
		}
		String sql = "INSERT INTO password_resets (user_id, otp_code, expiry_time, is_used) VALUES (?, ?, ?, ?)";
		try (Connection con = DBConnection.getConnection(); PreparedStatement ps = con.prepareStatement(sql);) {
			ps.setInt(1, userId);
			ps.setString(2, otp);
			ps.setTimestamp(3, Timestamp.valueOf(expiryTime));
			ps.setBoolean(4, false);

			int rows = ps.executeUpdate();
			return rows > 0;
		} catch (SQLException e) {
			throw new RuntimeException("Failed to Insert otp data", e);
		}

	}

	public PasswordReset getLatestValidOtp(int userId) {

		if (userId <= 0) {
			return null;
		}
		String sql = "SELECT * FROM password_resets WHERE user_id = ? AND is_used = false AND expiry_time > CURRENT_TIMESTAMP ORDER BY created_at DESC LIMIT 1";
		try (Connection con = DBConnection.getConnection(); PreparedStatement ps = con.prepareStatement(sql);) {
			ps.setInt(1, userId);
			try (ResultSet rs = ps.executeQuery();) {
				if (rs.next()) {
					int id = rs.getInt("id");
					int userIdFromDb = rs.getInt("user_id");
					String otpCode = rs.getString("otp_code");
					LocalDateTime expiryTime = rs.getTimestamp("expiry_time").toLocalDateTime();
					boolean isUsed = rs.getBoolean("is_used");
					Timestamp createdTs = rs.getTimestamp("created_at");
					LocalDateTime createdAt = (createdTs != null) ? createdTs.toLocalDateTime() : null;
					return new PasswordReset(id, userIdFromDb, otpCode, expiryTime, isUsed, createdAt);
				}
			}
			return null;
		} catch (SQLException e) {
			throw new RuntimeException("Failed to Fetch Latest valid otp", e);
		}
	}

	public boolean markOtpAsUsed(int resetId) {
		if (resetId <= 0) {
			return false;
		}
		String sql = "UPDATE password_resets SET is_used = true WHERE id = ? AND is_used = false";
		try (Connection con = DBConnection.getConnection(); PreparedStatement ps = con.prepareStatement(sql);) {
			ps.setInt(1, resetId);
			int row = ps.executeUpdate();
			return row > 0;
		} catch (SQLException e) {
			throw new RuntimeException("Failed to Mark OTP as used", e);
		}
	}
}
