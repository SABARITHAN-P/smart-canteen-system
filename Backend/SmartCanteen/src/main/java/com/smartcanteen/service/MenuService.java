package com.smartcanteen.service;

import java.util.Collections;
import java.util.List;

import com.smartcanteen.dao.MenuDAO;
import com.smartcanteen.model.Menu;
import com.smartcanteen.model.MenuAvailabilityStatus;


public class MenuService {
	private MenuDAO menuDao = new MenuDAO();

	public List<Menu> getMenuByShop(int shopId) {
		if (shopId <= 0)
			return Collections.emptyList();
		return menuDao.getMenuByShopId(shopId);
	}

	public boolean addMenuItem(Menu menu) {
		if (menu == null) {
			return false;
		}
		int shopId = menu.getShopId();
		String itemName = menu.getItemName();
		double price = menu.getPrice();
		String category = menu.getCategory();
		MenuAvailabilityStatus availabilityStatus = menu.getAvailabilityStatus();
		if (shopId <= 0) {
			return false;
		}
		if (itemName == null || itemName.isBlank()) {
			return false;
		}
		if (price <= 0.0) {
			return false;
		}
		if (category == null || category.isBlank()) {
			return false;
		}
		if (availabilityStatus == null) {
			menu.setAvailabilityStatus(MenuAvailabilityStatus.AVAILABLE);
		}
		return menuDao.addMenuItem(menu);
	}

	public boolean updateMenuItem(Menu menu) {
		if (menu == null || menu.getMenuId() <= 0) {
	        return false;
	    }
		return menuDao.updateMenuItem(menu);
	}

	public boolean deleteMenuItem(int menuId) {
		if(menuId<=0) {
			return false;
		}
		return menuDao.deleteMenuItem(menuId);
	}
	
	public boolean toggleAvailability(int menuId, MenuAvailabilityStatus status) {
		if(menuId<=0) {
			return false;
		}
		return menuDao.toggleAvailability(menuId, status);
	}
}