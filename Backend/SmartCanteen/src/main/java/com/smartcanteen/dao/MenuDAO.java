package com.smartcanteen.dao;

import java.util.List;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

import com.smartcanteen.model.Menu;
import com.smartcanteen.model.MenuAvailabilityStatus;
import com.smartcanteen.util.DBConnection;

public class MenuDAO {

	public List<Menu> getMenuByShopId(int shopId) {

		List<Menu> menuItems = new ArrayList<>();

		if (shopId <= 0) {
			return menuItems;
		}

		String sql = "SELECT * FROM menu WHERE shop_id=? ORDER BY availability_status ASC";
		try (Connection con = DBConnection.getConnection(); PreparedStatement ps = con.prepareStatement(sql)) {
			ps.setInt(1, shopId);
			try (ResultSet rs = ps.executeQuery()) {
				while (rs.next()) {
					int menuId = rs.getInt("menu_id");
					int chosenShopId = rs.getInt("shop_id");
					String itemName = rs.getString("item_name");
					double price = rs.getDouble("price");
					String category = rs.getString("category");

					MenuAvailabilityStatus availabilityStatus = MenuAvailabilityStatus
							.valueOf(rs.getString("availability_status"));

					Menu menu = new Menu(menuId, chosenShopId, itemName, price, category, availabilityStatus);
					menuItems.add(menu);
				}
			}

		} catch (SQLException e) {
			throw new RuntimeException("Failed to Fetch the menu", e);
		}
		return menuItems;
	}

	public boolean addMenuItem(Menu menu) {

		if (menu == null) {
			return false;
		}

		String sql = "INSERT INTO menu (shop_id, item_name, price, category,availability_status) VALUES (?, ?, ?, ?,?)";

		try (Connection con = DBConnection.getConnection(); PreparedStatement ps = con.prepareStatement(sql)) {

			ps.setInt(1, menu.getShopId());
			ps.setString(2, menu.getItemName());
			ps.setDouble(3, menu.getPrice());
			ps.setString(4, menu.getCategory());
			ps.setString(5, menu.getAvailabilityStatus().name());

			int rows = ps.executeUpdate();

			return rows > 0;

		} catch (SQLException e) {
			throw new RuntimeException("Failed to Add menu item", e);
		}
	}

	public boolean updateMenuItem(Menu menu) {

		if (menu == null || menu.getMenuId() <= 0) {
			return false;
		}

		String sql = "UPDATE menu SET item_name=?, price=?, category=?, availability_status=? WHERE menu_id=?";

		try (Connection con = DBConnection.getConnection(); PreparedStatement ps = con.prepareStatement(sql)) {

			ps.setString(1, menu.getItemName());
			ps.setDouble(2, menu.getPrice());
			ps.setString(3, menu.getCategory());
			ps.setString(4, menu.getAvailabilityStatus().name()); // important
			ps.setInt(5, menu.getMenuId());

			int rows = ps.executeUpdate();
			return rows > 0;

		} catch (SQLException e) {
			throw new RuntimeException("Failed to update menu item", e);
		}
	}

	public boolean deleteMenuItem(int menuId) {
		if (menuId <= 0) {
			return false;
		}
		String sql = "DELETE FROM menu WHERE menu_id = ?";
		try (Connection con = DBConnection.getConnection(); PreparedStatement ps = con.prepareStatement(sql)) {
			ps.setInt(1, menuId);
			int rows = ps.executeUpdate();

			return rows > 0;

		} catch (SQLException e) {
			throw new RuntimeException("Failed to Delete menu Item", e);
		}
	}

	public boolean toggleAvailability(int menuId, MenuAvailabilityStatus status) {
		if (menuId <= 0) {
			return false;
		}
		String sql = "UPDATE menu SET availability_status = CASE WHEN availability_status = 'AVAILABLE' THEN 'UNAVAILABLE' ELSE 'AVAILABLE' END WHERE menu_id = ?";
		try (Connection con = DBConnection.getConnection(); PreparedStatement ps = con.prepareStatement(sql)) {
			ps.setInt(1, menuId);
			int rows = ps.executeUpdate();

			return rows > 0;

		} catch (SQLException e) {
			throw new RuntimeException("Failed to Toggle menu Availability", e);
		}
	}

	public double getMenuPrice(Connection con, int menuId) throws SQLException {
		String sql = "SELECT price FROM menu WHERE menu_id = ?";
		try (PreparedStatement ps = con.prepareStatement(sql)) {
			ps.setInt(1, menuId);
			try (ResultSet rs = ps.executeQuery()) {
				if (rs.next()) {
					return rs.getDouble("price");
				}
			}
		}
		throw new SQLException("Menu item not found");
	}

}
