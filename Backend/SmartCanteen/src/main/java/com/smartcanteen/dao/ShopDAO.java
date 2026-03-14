package com.smartcanteen.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.ArrayList;

import com.smartcanteen.model.Role;
import com.smartcanteen.model.Shop;
import com.smartcanteen.model.ShopStatus;
import com.smartcanteen.model.User;
import com.smartcanteen.util.DBConnection;

public class ShopDAO {

	private Shop mapRowToShop(ResultSet rs) throws SQLException {
		int shopId = rs.getInt("shop_id");
		String shopName = rs.getString("shop_name");
		int shopAdminId = rs.getInt("shop_admin_id");
		ShopStatus status = ShopStatus.valueOf(rs.getString("status"));

		return new Shop(shopId, shopName, shopAdminId, status);
	}

	public List<Shop> getAllOpenShops() {
		List<Shop> shops = new ArrayList<>();

		String sql = "SELECT * FROM shops WHERE status='OPEN'";

		try (Connection con = DBConnection.getConnection();
				PreparedStatement ps = con.prepareStatement(sql);
				ResultSet rs = ps.executeQuery();) {

			while (rs.next()) {
				Shop shop = mapRowToShop(rs);
				shops.add(shop);
			}
		} catch (SQLException e) {
			throw new RuntimeException("Failed to Fetch the shops", e);
		}
		return shops;
	}

	// Get all shops (Main Admin)
	public List<Shop> getAllShops() {
		List<Shop> shops = new ArrayList<>();
		String sql = "SELECT * FROM shops";

		try (Connection con = DBConnection.getConnection();
				PreparedStatement ps = con.prepareStatement(sql);
				ResultSet rs = ps.executeQuery();) {

			while (rs.next()) {
				Shop shop = mapRowToShop(rs);
				shops.add(shop);
			}
		} catch (SQLException e) {
			throw new RuntimeException("Failed to Fetch the shops", e);
		}
		return shops;
	}

	// Get shop by ID
	public Shop getShopById(int shopId) {
		String sql = "SELECT * FROM shops WHERE shop_id=?";
		try (Connection con = DBConnection.getConnection(); PreparedStatement ps = con.prepareStatement(sql);) {
			ps.setInt(1, shopId);
			try (ResultSet rs = ps.executeQuery();) {
				if (rs.next()) {
					return mapRowToShop(rs);
				}
			}
		} catch (SQLException e) {
			throw new RuntimeException("Failed to Fetch the shop", e);
		}
		return null;
	}

	// Get shop by admin ID (Shop Admin dashboard)
	public Shop getShopByAdminId(int adminId) {
		String sql = "SELECT * FROM shops WHERE shop_admin_id=?";
		try (Connection con = DBConnection.getConnection(); PreparedStatement ps = con.prepareStatement(sql);) {
			ps.setInt(1, adminId);
			try (ResultSet rs = ps.executeQuery();) {
				if (rs.next()) {
					return mapRowToShop(rs);
				}
			}
		} catch (SQLException e) {
			throw new RuntimeException("Failed to Fetch the shop by admin ID", e);
		}
		return null;
	}

	// Create new shop (Main Admin)
	public boolean createShop(Shop shop) {
		if (shop == null) {
			return false;
		}
		String sql = "INSERT INTO shops(shop_name, shop_admin_id, status) Values (?,?,?)";
		try (Connection con = DBConnection.getConnection(); PreparedStatement ps = con.prepareStatement(sql);) {
			ps.setString(1, shop.getShopName());
			ps.setInt(2, shop.getShopAdminId());
			ps.setString(3, shop.getStatus().name());

			int row = ps.executeUpdate();
			return row > 0;
		} catch (SQLException e) {
			throw new RuntimeException("Failed to create shop", e);
		}
	}

	// Update shop name
	public boolean updateShopName(int shopId, String shopName) {
		if (shopId <= 0 || shopName == null || shopName.isBlank()) {
			return false;
		}
		String sql = "UPDATE shops SET shop_name=? WHERE shop_id=?";
		try (Connection con = DBConnection.getConnection(); PreparedStatement ps = con.prepareStatement(sql);) {
			ps.setString(1, shopName);
			ps.setInt(2, shopId);

			int row = ps.executeUpdate();
			return row > 0;
		} catch (SQLException e) {
			throw new RuntimeException("Failed to Update shop name", e);
		}
	}

	// Update shop admin
	public boolean updateShopAdmin(int shopId, int adminId) {
		if (shopId <= 0 || adminId <= 0) {
			return false;
		}
		UserDAO userDAO = new UserDAO();
	    User admin = userDAO.getUserById(adminId);

	    if (admin == null) {
	        return false;
	    }

	    // Check role is SHOP_ADMIN
	    if (admin.getRole() != Role.SHOP_ADMIN) {
	        return false;
	    }
		String sql = "UPDATE shops SET shop_admin_id=? WHERE shop_id=?";
		try (Connection con = DBConnection.getConnection(); PreparedStatement ps = con.prepareStatement(sql);) {
			ps.setInt(1, adminId);
			ps.setInt(2, shopId);

			int row = ps.executeUpdate();
			return row > 0;
		} catch (SQLException e) {
			throw new RuntimeException("Failed to Update shop Admin ID", e);
		}
	}

	// Update shop status (OPEN / CLOSED)
	public boolean updateShopStatus(int shopId, ShopStatus status) {
		if (shopId <= 0 || status == null) {
	        return false;
	    }

		String sql = "UPDATE shops SET status=? WHERE shop_id=?";
		try (Connection con = DBConnection.getConnection(); PreparedStatement ps = con.prepareStatement(sql);) {
			ps.setString(1, status.name());
			ps.setInt(2, shopId);

			int row = ps.executeUpdate();
			return row > 0;
		} catch (SQLException e) {
			throw new RuntimeException("Failed to update shop status", e);
		}
	}

	// Delete shop (optional – admin feature)
	public boolean deleteShop(int shopId) {

	    String sql = "DELETE FROM shops WHERE shop_id = ?";

	    try (Connection con = DBConnection.getConnection();
	         PreparedStatement ps = con.prepareStatement(sql)) {

	        ps.setInt(1, shopId);

	        int rows = ps.executeUpdate();

	        return rows > 0;

	    } catch (SQLException e) {
	        throw new RuntimeException("Failed to delete shop", e);
	    }
	}
}