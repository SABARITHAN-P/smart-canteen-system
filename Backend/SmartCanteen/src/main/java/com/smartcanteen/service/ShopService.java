package com.smartcanteen.service;

import java.util.List;
import com.smartcanteen.dao.ShopDAO;
import com.smartcanteen.dao.UserDAO;
import com.smartcanteen.model.Shop;
import com.smartcanteen.model.ShopStatus;
import com.smartcanteen.model.User;
import com.smartcanteen.util.PasswordUtil;

public class ShopService {
	private ShopDAO shopDAO = new ShopDAO();
	private UserDAO userDAO = new UserDAO();
	public List<Shop> getAvailableShops() {
		return shopDAO.getAllOpenShops();
	}

	// For Main Admin dashboard
	public List<Shop> getAllShops() {
		return shopDAO.getAllShops();
	}

	// Get shop profile
	public Shop getShopById(int shopId) {
		return shopDAO.getShopById(shopId);
	}

	// Shop Admin – get their shop
	public Shop getShopByAdmin(int adminId) {
		return shopDAO.getShopByAdminId(adminId);
	}

	// Main Admin – create shop
	public boolean createShop(Shop shop) {
		if (shop == null) {
			return false;
		}
		if (shop.getShopAdminId() <= 0) {
			return false;
		}
		if (shop.getShopName() == null || shop.getShopName().isBlank()) {
			return false;
		}
		if (shop.getStatus() == null) {
			shop.setStatus(ShopStatus.OPEN);
		}
		return shopDAO.createShop(shop);
	}

	// Update shop name
	public boolean updateShopName(int shopId, String name) {
		return shopDAO.updateShopName(shopId, name);
	}

	// Assign shop admin
	public boolean updateShopAdmin(int shopId, int adminId) {
		return shopDAO.updateShopAdmin(shopId, adminId);
	}

	// Toggle shop status
	public boolean toggleShopStatus(int shopId) {

		Shop shop = shopDAO.getShopById(shopId);
		if (shop == null) {
			return false;
		}
		if (shop.getStatus() == ShopStatus.OPEN) {
			return shopDAO.updateShopStatus(shopId, ShopStatus.CLOSED);
		} else {
			return shopDAO.updateShopStatus(shopId, ShopStatus.OPEN);
		}
	}

	// Delete shop
	public boolean deleteShop(int shopId, String adminPassword) {

	    if (shopId <= 0 || adminPassword == null || adminPassword.isBlank()) {
	        return false;
	    }

	    User admin = userDAO.getMainAdmin(); // example

	    String hashedInput = PasswordUtil.hashPassword(adminPassword);

	    if (!hashedInput.equals(admin.getPassword())) {
	        return false;
	    }

	    return shopDAO.deleteShop(shopId);
	}
}
