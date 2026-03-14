package com.smartcanteen.model;

import java.util.List;

public class Order {

	private int orderId;
	private int userId;
	private int shopId;
	private int tokenNumber;
	private OrderStatus status;
	private String orderTime;
	private List<OrderItem> items;

	public Order() {
	}

	public Order(int orderId, int userId, int shopId, int tokenNumber, OrderStatus status) {
		this.orderId = orderId;
		this.userId = userId;
		this.shopId = shopId;
		this.tokenNumber = tokenNumber;
		this.status = status;
	}

	public int getOrderId() {
		return orderId;
	}

	public void setOrderId(int orderId) {
		this.orderId = orderId;
	}

	public int getUserId() {
		return userId;
	}

	public void setUserId(int userId) {
		this.userId = userId;
	}

	public int getShopId() {
		return shopId;
	}

	public void setShopId(int shopId) {
		this.shopId = shopId;
	}

	public int getTokenNumber() {
		return tokenNumber;
	}

	public void setTokenNumber(int tokenNumber) {
		this.tokenNumber = tokenNumber;
	}

	public OrderStatus getStatus() {
		return status;
	}

	public void setStatus(OrderStatus status) {
		this.status = status;
	}

	public String getOrderTime() {
		return orderTime;
	}

	public void setOrderTime(String orderTime) {
		this.orderTime = orderTime;
	}

	public List<OrderItem> getItems() {
		return items;
	}

	public void setItems(List<OrderItem> items) {
		this.items = items;
	}
}