package com.farmxchain.dto;

public class OrderResponseDto {

    private Long orderId;
    private String productName;
    private String buyerUniqueId;
    private String farmerUniqueId;
    private int quantity;
    private double totalPrice;
    private String status;

    public OrderResponseDto() {}

    public OrderResponseDto(Long orderId,
                            String productName,
                            String buyerUniqueId,
                            String farmerUniqueId,
                            int quantity,
                            double totalPrice,
                            String status) {
        this.orderId = orderId;
        this.productName = productName;
        this.buyerUniqueId = buyerUniqueId;
        this.farmerUniqueId = farmerUniqueId;
        this.quantity = quantity;
        this.totalPrice = totalPrice;
        this.status = status;
    }

    public Long getOrderId() { return orderId; }
    public String getProductName() { return productName; }
    public String getBuyerUniqueId() { return buyerUniqueId; }
    public String getFarmerUniqueId() { return farmerUniqueId; }
    public int getQuantity() { return quantity; }
    public double getTotalPrice() { return totalPrice; }
    public String getStatus() { return status; }

    public void setOrderId(Long orderId) { this.orderId = orderId; }
    public void setProductName(String productName) { this.productName = productName; }
    public void setBuyerUniqueId(String buyerUniqueId) { this.buyerUniqueId = buyerUniqueId; }
    public void setFarmerUniqueId(String farmerUniqueId) { this.farmerUniqueId = farmerUniqueId; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public void setTotalPrice(double totalPrice) { this.totalPrice = totalPrice; }
    public void setStatus(String status) { this.status = status; }
}
