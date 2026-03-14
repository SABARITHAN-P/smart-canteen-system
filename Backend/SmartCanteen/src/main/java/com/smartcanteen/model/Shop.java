package com.smartcanteen.model;

public class Shop {

    private int shopId;
    private String shopName;
    private int shopAdminId;
    private ShopStatus status;

    public Shop() {
    }

    public Shop(int shopId, String shopName, int shopAdminId, ShopStatus status) {
        this.shopId = shopId;
        this.shopName = shopName;
        this.shopAdminId = shopAdminId;
        this.status = status;
    }

    public int getShopId() {
        return shopId;
    }

    public void setShopId(int shopId) {
        this.shopId = shopId;
    }

    public String getShopName() {
        return shopName;
    }

    public void setShopName(String shopName) {
        this.shopName = shopName;
    }

    public int getShopAdminId() {
        return shopAdminId;
    }

    public void setShopAdminId(int shopAdminId) {
        this.shopAdminId = shopAdminId;
    }

    public ShopStatus getStatus() {
        return status;
    }

    public void setStatus(ShopStatus status) {
        this.status = status;
    }
}