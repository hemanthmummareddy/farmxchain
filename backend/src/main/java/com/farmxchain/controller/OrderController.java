package com.farmxchain.controller;

import com.farmxchain.dto.OrderResponseDto;
import com.farmxchain.model.Order;
import com.farmxchain.model.Product;
import com.farmxchain.model.User;
import com.farmxchain.model.Role;
import com.farmxchain.repository.ProductRepository;
import com.farmxchain.repository.UserRepository;
import com.farmxchain.security.JwtUtil;
import com.farmxchain.service.OrderService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import static com.farmxchain.security.RoleValidator.requireCustomer;
import static com.farmxchain.security.RoleValidator.requireFarmer;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public OrderController(
            OrderService orderService,
            ProductRepository productRepository,
            UserRepository userRepository,
            JwtUtil jwtUtil
    ) {
        this.orderService = orderService;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    // ================= CREATE ORDER
    @PostMapping("/create")
    public ResponseEntity<?> createOrder(
            @RequestBody Map<String, Object> payload,
            @RequestHeader("Authorization") String authHeader
    ) {
        User user = extractUser(authHeader);
        String role = user.getRole().name();

        if (!role.equals("CUSTOMER") && !role.equals("DISTRIBUTOR")) {
            return ResponseEntity.status(403)
                    .body("Only customers or distributors can place orders");
        }

        Long productId = Long.valueOf(payload.get("productId").toString());
        int quantity = Integer.parseInt(payload.get("quantity").toString());

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (role.equals("CUSTOMER") &&
                !product.getTargetRole().equalsIgnoreCase("CUSTOMER")) {
            return ResponseEntity.badRequest().body("Customers cannot buy distributor products");
        }

        if (role.equals("DISTRIBUTOR") &&
                !product.getTargetRole().equalsIgnoreCase("DISTRIBUTOR")) {
            return ResponseEntity.badRequest().body("Distributors can only buy distributor products");
        }

        if (quantity > product.getQuantity()) {
            return ResponseEntity.badRequest().body("Insufficient stock");
        }

        Order order = new Order();
        order.setProductId(product.getId());
        order.setProductName(product.getName());
        order.setFarmerUniqueId(product.getFarmerUniqueId());
        order.setBuyerUniqueId(user.getUniqueId());
        order.setBuyerRole(role);
        order.setQuantity(quantity);
        order.setPrice(product.getPrice());
        order.setTotalPrice(quantity * product.getPrice());
        order.setStatus("PENDING");

        return ResponseEntity.ok(orderService.createOrder(order));
    }

    // ================= FARMER ORDERS
    @GetMapping("/farmer")
    public ResponseEntity<List<OrderResponseDto>> getFarmerOrders(
            @RequestHeader("Authorization") String authHeader
    ) {
        User farmer = extractUser(authHeader);
        requireFarmer(farmer);

        return ResponseEntity.ok(
                orderService.getOrdersByFarmer(farmer.getUniqueId())
                        .stream()
                        .map(this::toDto)
                        .toList()
        );
    }

    // ================= CUSTOMER ORDERS
    @GetMapping("/customer")
    public ResponseEntity<List<OrderResponseDto>> getCustomerOrders(
            @RequestHeader("Authorization") String authHeader
    ) {
        User customer = extractUser(authHeader);
        requireCustomer(customer);

        return ResponseEntity.ok(
                orderService.getOrdersByCustomer(customer.getUniqueId())
                        .stream()
                        .map(this::toDto)
                        .toList()
        );
    }

    // ================= DISTRIBUTOR ORDERS ✅ FIX
    @GetMapping("/distributor")
    public ResponseEntity<List<OrderResponseDto>> getDistributorOrders(
            @RequestHeader("Authorization") String authHeader
    ) {
        User distributor = extractUser(authHeader);

        if (distributor.getRole() != Role.DISTRIBUTOR) {
            return ResponseEntity.status(403).body(List.of());
        }

        return ResponseEntity.ok(
                orderService.getOrdersByBuyer(distributor.getUniqueId())
                        .stream()
                        .map(this::toDto)
                        .toList()
        );
    }

    // ================= UPDATE STATUS
    @PutMapping("/{orderId}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long orderId,
            @RequestBody Map<String, String> payload,
            @RequestHeader("Authorization") String authHeader
    ) {
        User farmer = extractUser(authHeader);
        requireFarmer(farmer);

        Order updated = orderService.updateStatus(orderId, payload.get("status"));
        return ResponseEntity.ok(toDto(updated));
    }

    // ================= HELPERS
    private User extractUser(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String uniqueId = jwtUtil.extractUniqueId(token);

        return userRepository.findByUniqueId(uniqueId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

   private OrderResponseDto toDto(Order order) {
    return new OrderResponseDto(
            order.getId(),
            order.getProductName(),
            order.getBuyerUniqueId(),
            order.getFarmerUniqueId(),
            order.getQuantity(),
            order.getTotalPrice(),
            order.getStatus()
    );
}

    @GetMapping("/admin/all")
public List<OrderResponseDto> getAllOrdersForAdmin() {
    return orderService.getAllOrders();
}

}
