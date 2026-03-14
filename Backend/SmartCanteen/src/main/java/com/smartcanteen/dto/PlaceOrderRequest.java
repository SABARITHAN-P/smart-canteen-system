package com.smartcanteen.dto;

import java.util.List;
import com.smartcanteen.model.OrderItem;

public class PlaceOrderRequest {

	private int userId;
	private int shopId;
	private List<OrderItem> items;

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

	public List<OrderItem> getItems() {
		return items;
	}

	public void setItems(List<OrderItem> items) {
		this.items = items;
	}
}