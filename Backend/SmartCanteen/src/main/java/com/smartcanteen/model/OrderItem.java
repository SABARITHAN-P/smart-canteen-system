package com.smartcanteen.model;

public class OrderItem {
	private int orderItemId;
	private int orderId;
	private int menuId;
	private int quantity;
	private double priceAtOrder;
	private String menuName;
	
	public OrderItem() {
	}

	public int getOrderItemId() {
		return orderItemId;
	}

	public void setOrderItemId(int orderItemId) {
		this.orderItemId = orderItemId;
	}

	public int getOrderId() {
		return orderId;
	}

	public void setOrderId(int orderId) {
		this.orderId = orderId;
	}

	public int getMenuId() {
		return menuId;
	}

	public void setMenuId(int menuId) {
		this.menuId = menuId;
	}

	public int getQuantity() {
		return quantity;
	}

	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}

	public double getPriceAtOrder() {
		return priceAtOrder;
	}

	public void setPriceAtOrder(double d) {
		this.priceAtOrder = d;
	}
	
	public String getMenuName() {
	    return menuName;
	}

	public void setMenuName(String menuName) {
	    this.menuName = menuName;
	}

}
