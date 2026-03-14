package com.smartcanteen.model;

public class Menu {
	private int menuId;
	private int shopId;
	private String itemName;
	private double price;
	private String category;
	private MenuAvailabilityStatus availabilityStatus;
	
	public Menu() {
		
	}
	
	public Menu(int menuId,int shopId,String itemName,double price,String category,MenuAvailabilityStatus availabilityStatus) {
		this.menuId=menuId;
		this.shopId=shopId;
		this.itemName=itemName;
		this.price=price;
		this.category=category;
		this.availabilityStatus=availabilityStatus;
	}

	public int getMenuId() {
		return menuId;
	}

	public void setMenuId(int menuId) {
		this.menuId = menuId;
	}

	public int getShopId() {
		return shopId;
	}

	public void setShopId(int shopId) {
		this.shopId = shopId;
	}

	public String getItemName() {
		return itemName;
	}

	public void setItemName(String itemName) {
		this.itemName = itemName;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public MenuAvailabilityStatus getAvailabilityStatus() {
		return availabilityStatus;
	}

	public void setAvailabilityStatus(MenuAvailabilityStatus availabilityStatus) {
		this.availabilityStatus = availabilityStatus;
	}
	
}
