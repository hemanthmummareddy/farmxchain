package com.farmxchain.service;

import com.farmxchain.dto.OrderResponseDto;
import com.farmxchain.model.Order;
import com.farmxchain.model.Product;
import com.farmxchain.repository.OrderRepository;
import com.farmxchain.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository,
                        ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public Order createOrder(Order order) {
        Product product = productRepository.findById(order.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getQuantity() < order.getQuantity()) {
            throw new RuntimeException("Insufficient stock");
        }

        product.setQuantity(product.getQuantity() - order.getQuantity());
        productRepository.save(product);

        order.setStatus("PENDING");
        return orderRepository.save(order);
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    @Transactional
    public Order updateStatus(Long orderId, String newStatus) {
        Order order = getOrderById(orderId);

        if ("DELIVERED".equals(order.getStatus())) {
            throw new RuntimeException("Order already closed");
        }

        order.setStatus(newStatus);
        return orderRepository.save(order);
    }

    public List<Order> getOrdersByFarmer(String farmerUniqueId) {
        return orderRepository.findByFarmerUniqueId(farmerUniqueId);
    }

    public List<Order> getOrdersByCustomer(String customerUniqueId) {
        return orderRepository.findByBuyerUniqueId(customerUniqueId);
    }

    // ✅ REQUIRED FOR DISTRIBUTOR
    public List<Order> getOrdersByBuyer(String buyerUniqueId) {
        return orderRepository.findByBuyerUniqueId(buyerUniqueId);
    }
    public List<OrderResponseDto> getAllOrders() {
    return orderRepository.findAll()
            .stream()
            .map(order -> new OrderResponseDto(
                    order.getId(),   // ✅ FIXED
                    order.getProductName(),
                    order.getBuyerUniqueId(),
                    order.getFarmerUniqueId(),
                    order.getQuantity(),
                    order.getTotalPrice(),
                    order.getStatus()
            ))
            .collect(Collectors.toList());
}




}
