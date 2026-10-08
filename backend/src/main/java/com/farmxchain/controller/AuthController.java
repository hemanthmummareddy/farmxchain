package com.farmxchain.controller;

import com.farmxchain.model.User;
import com.farmxchain.model.Role;
import com.farmxchain.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        // generate unique ID
        String uniqueId = user.getRole().name() + "-" + UUID.randomUUID();
        user.setUniqueId(uniqueId);

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully");
    }
}
