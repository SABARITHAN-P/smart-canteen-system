package com.smartcanteen.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.smartcanteen.model.Role;
import com.smartcanteen.model.Status;
import com.smartcanteen.model.User;
import com.smartcanteen.util.DBConnection;

public class UserDAO {

	/*
	 * ======================= REGISTRATION & LOGIN =======================
	 */

	// Check if email already exists
	public boolean emailExists(String email) {
		String sql = "SELECT 1 FROM users WHERE email = ?";
		try (Connection con = DBConnection.getConnection(); PreparedStatement ps = con.prepareStatement(sql)) {
			ps.setString(1, email);
			try (ResultSet rs = ps.executeQuery()) {
				return rs.next();
			}
		} catch (SQLException e) {
			throw new RuntimeException("Failed to check if email exists", e);
		}
	}

	// Register new user (hashed password)
	public boolean registerUser(User user) {
		if (emailExists(user.getEmail()))
			return false;

		String sql = "INSERT into users(name,email,password,mobile_no,role,status) VALUES (?,?,?,?,?,?)";

		try (Connection con = DBConnection.getConnection(); PreparedStatement ps = con.prepareStatement(sql)) {

			ps.setString(1, user.getName());
			ps.setString(2, user.getEmail());
			ps.setString(3, user.getPassword());
			ps.setString(4, user.getMobileNumber());
			ps.setString(5, user.getRole().name());
			ps.setString(6, user.getStatus().name());

			int rows = ps.executeUpdate();
			return rows > 0;

		} catch (SQLException e) {
			throw new RuntimeException("Failed to Register user", e);
		}
	}

	// Fetch user by email (used for login)
	public User getUserByEmail(String email) {
		String sql = "SELECT * FROM users WHERE email = ?";
		try (Connection con = DBConnection.getConnection(); PreparedStatement ps = con.prepareStatement(sql)) {
			ps.setString(1, email);
			try (ResultSet rs = ps.executeQuery()) {
				if (rs.next()) {
					int userId = rs.getInt("user_id");
					String name = rs.getString("name");
					String userEmail = rs.getString("email");
					String password = rs.getString("password");
					String mobileNumber = rs.getString("mobile_no");
					Role role = Role.valueOf(rs.getString("role"));
					Status status = Status.valueOf(rs.getString("status"));
					Timestamp createdTs = rs.getTimestamp("created_at");
					LocalDateTime createdAt = (createdTs != null) ? createdTs.toLocalDateTime() : null;
					return new User(userId, name, userEmail, password, mobileNumber, role, status, createdAt);
				}
			}
		} catch (SQLException e) {
			throw new RuntimeException("Failed to Get user", e);
		}
		return null;
	}

	// Fetch user by userID
	public User getUserById(int userId) {
		String sql = "SELECT * FROM users WHERE user_id = ?";
		try (Connection con = DBConnection.getConnection(); PreparedStatement ps = con.prepareStatement(sql)) {
			ps.setInt(1, userId);
			try (ResultSet rs = ps.executeQuery()) {
				if (rs.next()) {
					int userID = rs.getInt("user_id");
					String name = rs.getString("name");
					String email = rs.getString("email");
					String password = rs.getString("password");
					String mobileNumber = rs.getString("mobile_no");
					Role role = Role.valueOf(rs.getString("role"));
					Status status = Status.valueOf(rs.getString("status"));
					Timestamp createdTs = rs.getTimestamp("created_at");
					LocalDateTime createdAt = (createdTs != null) ? createdTs.toLocalDateTime() : null;
					return new User(userID, name, email, password, mobileNumber, role, status, createdAt);
				}
			}
		} catch (SQLException e) {
			throw new RuntimeException("Failed to Get user", e);
		}
		return null;
	}

	

	/*
	 * ======================= PROFILE MANAGEMENT =======================
	 */

	// Update user profile details
	public boolean updateUser(User user) {
		String sql = "UPDATE users SET name = ?, mobile_no = ? WHERE user_id = ?";
		
		try (Connection con = DBConnection.getConnection(); PreparedStatement ps = con.prepareStatement(sql)) {

			ps.setString(1, user.getName());
			ps.setString(2, user.getMobileNumber());
			ps.setInt(3, user.getUserId());

			int rows = ps.executeUpdate();
			return rows > 0;

		} catch (SQLException e) {
			throw new RuntimeException("Failed to Update user details", e);
		}
	}

	// Change user password (hashed)
	public boolean updatePassword(int userId, String newHashedPassword) {
		String sql = "UPDATE users SET password = ? WHERE user_id = ?";

		try (Connection con = DBConnection.getConnection(); PreparedStatement ps = con.prepareStatement(sql)) {

			ps.setString(1, newHashedPassword);
			ps.setInt(2, userId);

			int rows = ps.executeUpdate();
			return rows > 0;

		} catch (SQLException e) {
			throw new RuntimeException("Failed to Update password for userId: " + userId, e);
		}
	}

	/*
	 * ======================= ACCOUNT STATUS CONTROL =======================
	 */

	// Block a user account
	public boolean blockUser(int userId) {
		String sql = "UPDATE users SET status = ? WHERE user_id = ?";

		try (Connection con = DBConnection.getConnection(); PreparedStatement ps = con.prepareStatement(sql)) {

			ps.setString(1, Status.BLOCKED.name());
			ps.setInt(2, userId);
			int rows = ps.executeUpdate();
			return rows > 0;

		} catch (SQLException e) {
			throw new RuntimeException("Failed to Block user", e);
		}
	}

	// Unblock a user account
	public boolean unblockUser(int userId) {
		String sql = "UPDATE users SET status = ? WHERE user_id = ?";

		try (Connection con = DBConnection.getConnection(); PreparedStatement ps = con.prepareStatement(sql)) {

			ps.setString(1, Status.ACTIVE.name());
			ps.setInt(2, userId);
			int rows = ps.executeUpdate();
			return rows > 0;

		} catch (SQLException e) {
			throw new RuntimeException("Failed to Unblock user", e);
		}
	}

	/*
	 * ======================= ADMIN OPERATIONS =======================
	 */

	// Fetch users by role (optional admin feature)
	public List<User> getUsersByRole(Role role) {
		List<User> users = new ArrayList<>();
		String sql = "SELECT * from users WHERE role=?";
		try (Connection con = DBConnection.getConnection(); PreparedStatement ps = con.prepareStatement(sql);) {
			ps.setString(1, role.name());
			try (ResultSet rs = ps.executeQuery();) {
				while (rs.next()) {
					int userId = rs.getInt("user_id");
					String name = rs.getString("name");
					String email = rs.getString("email");
					String password = rs.getString("password");
					String mobileNumber = rs.getString("mobile_no");
					Role userRole = Role.valueOf(rs.getString("role"));
					Status userStatus = Status.valueOf(rs.getString("status"));
					LocalDateTime createdAt = rs.getTimestamp("created_at").toLocalDateTime();

					User user = new User(userId, name, email, password, mobileNumber, userRole, userStatus, createdAt);
					users.add(user);
				}
			}
		} catch (SQLException e) {
			throw new RuntimeException("Failed to fetch the users", e);
		}
		return users;
	}

	public User getMainAdmin() {

		String sql = "SELECT * FROM users WHERE role = 'MAIN_ADMIN' LIMIT 1";

		try (Connection con = DBConnection.getConnection();
				PreparedStatement ps = con.prepareStatement(sql);
				ResultSet rs = ps.executeQuery()) {

			if (rs.next()) {

				int userId = rs.getInt("user_id");
				String name = rs.getString("name");
				String email = rs.getString("email");
				String password = rs.getString("password");
				String mobileNumber = rs.getString("mobile_no");

				Role role = Role.valueOf(rs.getString("role"));
				Status status = Status.valueOf(rs.getString("status"));

				Timestamp createdTs = rs.getTimestamp("created_at");
				LocalDateTime createdAt = createdTs != null ? createdTs.toLocalDateTime() : null;

				return new User(userId, name, email, password, mobileNumber, role, status, createdAt);
			}

		} catch (SQLException e) {
			throw new RuntimeException("Failed to fetch MAIN_ADMIN", e);
		}

		return null;
	}

	public List<User> unblockUser(Role shopAdmin) {
		List<User> users = new ArrayList<>();
		String sql = "SELECT * from users WHERE role=?";
		try (Connection con = DBConnection.getConnection(); PreparedStatement ps = con.prepareStatement(sql);) {
			ps.setString(1, shopAdmin.name());
			try (ResultSet rs = ps.executeQuery();) {
				while (rs.next()) {
					int userId = rs.getInt("user_id");
					String name = rs.getString("name");
					String email = rs.getString("email");
					String password = rs.getString("password");
					String mobileNumber = rs.getString("mobile_no");
					Role userRole = Role.valueOf(rs.getString("role"));
					Status userStatus = Status.valueOf(rs.getString("status"));
					LocalDateTime createdAt = rs.getTimestamp("created_at").toLocalDateTime();

					User user = new User(userId, name, email, password, mobileNumber, userRole, userStatus, createdAt);
					users.add(user);
				}
			}
		} catch (SQLException e) {
			throw new RuntimeException("Failed to fetch the users", e);
		}
		return users;
	}
}