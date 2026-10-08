package com.farmxchain.controller;

import com.farmxchain.model.Order;
import com.farmxchain.model.Product;
import com.farmxchain.repository.OrderRepository;
import com.farmxchain.repository.ProductRepository;
import com.farmxchain.security.JwtUtil;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/farmer/dashboard")
@CrossOrigin(origins = "http://localhost:3000")
public class FarmerDashboardController {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final JwtUtil jwtUtil;

    public FarmerDashboardController(
            OrderRepository orderRepository,
            ProductRepository productRepository,
            JwtUtil jwtUtil
    ) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public Map<String, Object> getDashboard(
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.replace("Bearer ", "");
        String farmerUniqueId = jwtUtil.extractUniqueId(token);

        List<Order> orders = orderRepository.findByFarmerUniqueId(farmerUniqueId);
        List<Product> crops = productRepository.findByFarmerUniqueId(farmerUniqueId);

        double totalSales = orders.stream()
                .filter(o -> !"CANCELLED".equals(o.getStatus()))
                .mapToDouble(Order::getTotalPrice)
                .sum();

        long ordersToday = orders.stream()
                .filter(o -> o.getCreatedAt().toLocalDate().equals(LocalDate.now()))
                .count();

        long activeCrops = crops.stream()
                .filter(c -> "AVAILABLE".equals(c.getStatus()))
                .count();

        long lowStock = crops.stream()
                .filter(c -> c.getQuantity() < 10)
                .count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalSales", totalSales);
        stats.put("ordersToday", ordersToday);
        stats.put("activeCrops", activeCrops);
        stats.put("lowStock", lowStock);

        return stats;
    }
}
