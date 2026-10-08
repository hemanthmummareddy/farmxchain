package com.farmxchain.controller;

import com.farmxchain.dto.AdminUserResponseDto;
import com.farmxchain.dto.OrderResponseDto;
import com.farmxchain.model.User;
import com.farmxchain.security.JwtUtil;
import com.farmxchain.security.RoleValidator;
import com.farmxchain.service.AdminService;
import com.farmxchain.service.AdminHistoryService;
import com.farmxchain.service.OrderService;
import com.farmxchain.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final AdminHistoryService adminHistoryService;
    private final OrderService orderService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public AdminController(
            AdminService adminService,
            AdminHistoryService adminHistoryService,
            OrderService orderService,
            JwtUtil jwtUtil,
            UserRepository userRepository
    ) {
        this.adminService = adminService;
        this.adminHistoryService = adminHistoryService;
        this.orderService = orderService;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    // ================= USERS =================

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserResponseDto>> getAllUsers(
            @RequestHeader("Authorization") String token
    ) {
        User adminUser = validateAdmin(token);
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/users/{id}/history")
    public ResponseEntity<?> getUserHistory(
            @PathVariable Long id,
            @RequestHeader("Authorization") String token
    ) {
        User adminUser = validateAdmin(token);
        return ResponseEntity.ok(adminHistoryService.getUserHistory(id));
    }

    @DeleteMapping("/users/{uniqueId}")
    public ResponseEntity<?> deleteUser(
            @PathVariable String uniqueId,
            @RequestHeader("Authorization") String token
    ) {
        User adminUser = validateAdmin(token);

        User targetUser = userRepository.findByUniqueId(uniqueId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (targetUser.getRole().name().equals("ADMIN")) {
            return ResponseEntity.badRequest().body("Cannot delete another admin");
        }

        userRepository.delete(targetUser);

        return ResponseEntity.ok("User deleted successfully");
    }

    // ================= ORDERS =================

    @GetMapping("/orders/all")
    public ResponseEntity<List<OrderResponseDto>> getAllOrders(
            @RequestHeader("Authorization") String token
    ) {
        User adminUser = validateAdmin(token);
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // ================= COMMON ADMIN VALIDATION =================

    private User validateAdmin(String token) {
        String jwt = token.replace("Bearer ", "");
        String uniqueId = jwtUtil.extractUniqueId(jwt);

        User adminUser = userRepository.findByUniqueId(uniqueId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        RoleValidator.requireAdmin(adminUser);

        return adminUser;
    }
}
