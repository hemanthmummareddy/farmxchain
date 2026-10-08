package com.farmxchain.controller;

import com.farmxchain.model.User;
import com.farmxchain.model.Role;
import com.farmxchain.repository.UserRepository;
import com.farmxchain.security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ===================== TEST =====================
    @GetMapping("/test")
    public String testApi() {
        return "FarmXChain User API is running";
    }

    // ===================== REGISTER =====================
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {

<<<<<<< HEAD
        if (user.getEmail() == null || user.getEmail().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email is required"));
        }

        if (user.getPassword() == null || user.getPassword().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Password is required"));
        }

=======
>>>>>>> a388ef0ce6e7515e6af06fbce909ca27416d71cf
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email already exists"));
        }

<<<<<<< HEAD
        // Build a safe base name even if the frontend doesn't send "name"
        String baseName;
        if (user.getName() != null && !user.getName().isBlank()) {
            baseName = user.getName();
        } else if (user.getEmail().contains("@")) {
            baseName = user.getEmail().split("@")[0];
        } else {
            baseName = "user";
        }

        if (user.getName() == null || user.getName().isBlank()) {
            user.setName(baseName);
        }

        if (user.getUsername() == null || user.getUsername().isBlank()) {
            user.setUsername(
                    baseName.toLowerCase().replaceAll("\\s+", "")
=======
        if (user.getUsername() == null || user.getUsername().isBlank()) {
            user.setUsername(
                    user.getName().toLowerCase().replaceAll("\\s+", "")
>>>>>>> a388ef0ce6e7515e6af06fbce909ca27416d71cf
                            + System.currentTimeMillis()
            );
        }

<<<<<<< HEAD
        // Never allow self-registration as ADMIN
=======
>>>>>>> a388ef0ce6e7515e6af06fbce909ca27416d71cf
        if (user.getRole() == null || user.getRole() == Role.ADMIN) {
            user.setRole(Role.CUSTOMER);
        }

        String uniqueId = user.getRole().name() + "-" + UUID.randomUUID();
        user.setUniqueId(uniqueId);

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);

        return ResponseEntity.ok(
                Map.of(
                        "message", "User registered successfully",
                        "uniqueId", user.getUniqueId(),
                        "role", user.getRole()
                )
        );
    }

    // ===================== LOGIN =====================
    @PostMapping("/login")
<<<<<<< HEAD
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginData) {

        String email = loginData.get("email");
        String password = loginData.get("password");

        if (email == null || password == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid credentials"));
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid credentials"));
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid credentials"));
        }

        // SAFETY CHECK
        if (user.getUniqueId() == null || user.getUniqueId().isBlank()) {
            user.setUniqueId(user.getRole().name() + "-" + UUID.randomUUID());
            userRepository.save(user);
        }

        String token = jwtUtil.generateToken(
                user.getUniqueId(),
                user.getRole().name()
        );

        return ResponseEntity.ok(
                Map.of(
                        "token", token,
                        "uniqueId", user.getUniqueId(),
                        "username", user.getUsername(),
                        "email", user.getEmail(),
                        "role", user.getRole()
                )
        );
    }

    // ===================== CURRENT USER =====================
    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile(
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Missing token"));
        }

        String token = authHeader.substring(7);

        if (!jwtUtil.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid token"));
        }

        String uniqueId = jwtUtil.extractUniqueId(token);

        Optional<User> userOpt = userRepository.findByUniqueId(uniqueId);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "User not found"));
        }

        return ResponseEntity.ok(userOpt.get());
    }
}
=======
public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginData) {

    String email = loginData.get("email");
    String password = loginData.get("password");

    Optional<User> userOpt = userRepository.findByEmail(email);
    if (userOpt.isEmpty()) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Invalid credentials"));
    }

    User user = userOpt.get();

    if (!passwordEncoder.matches(password, user.getPassword())) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Invalid credentials"));
    }

    // 🔥 SAFETY CHECK
    if (user.getUniqueId() == null || user.getUniqueId().isBlank()) {
        user.setUniqueId(user.getRole().name() + "-" + UUID.randomUUID());
        userRepository.save(user);
    }

    String token = jwtUtil.generateToken(
            user.getUniqueId(),
            user.getRole().name()
    );

    return ResponseEntity.ok(
            Map.of(
                    "token", token,
                    "uniqueId", user.getUniqueId(),
                    "username", user.getUsername(),
                    "email", user.getEmail(),
                    "role", user.getRole()
            )
    );
}


 @GetMapping("/me")
public ResponseEntity<?> getMyProfile(
        @RequestHeader(value = "Authorization", required = false) String authHeader
) {
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Missing token"));
    }

    String token = authHeader.substring(7);

    if (!jwtUtil.validateToken(token)) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Invalid token"));
    }

    String uniqueId = jwtUtil.extractUniqueId(token);

    Optional<User> userOpt = userRepository.findByUniqueId(uniqueId);

    if (userOpt.isEmpty()) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "User not found"));
    }

    return ResponseEntity.ok(userOpt.get());
}
}
>>>>>>> a388ef0ce6e7515e6af06fbce909ca27416d71cf
