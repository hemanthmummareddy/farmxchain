package com.farmxchain.controller;

import com.farmxchain.model.Product;
import com.farmxchain.repository.ProductRepository;
import com.farmxchain.security.JwtUtil;
import com.farmxchain.service.ImageUploadService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ImageUploadService imageUploadService;

    @Autowired
    private JwtUtil jwtUtil;

    // ================= FARMER: ADD PRODUCT =================
    @PostMapping("/add")
    public ResponseEntity<?> addProduct(
            @RequestParam(value = "images", required = false) MultipartFile[] images,
            @RequestParam String name,
            @RequestParam String type,
            @RequestParam String harvestDate,
            @RequestParam int quantity,
            @RequestParam double price,
            @RequestParam double discount,
            @RequestParam String targetRole,
            @RequestHeader("Authorization") String authHeader
    ) throws Exception {

        String token = authHeader.replace("Bearer ", "");
        String farmerUniqueId = jwtUtil.extractUniqueId(token);

        Product product = new Product();
        product.setName(name);
        product.setType(type);
        product.setHarvestDate(LocalDate.parse(harvestDate));
        product.setQuantity(quantity);
        product.setPrice(price);
        product.setDiscount(discount);
        product.setFarmerUniqueId(farmerUniqueId);
        product.setTargetRole(targetRole.toUpperCase());
        product.setStatus("AVAILABLE");

        if (images != null && images.length > 0) {
            product.setImageUrls(imageUploadService.uploadMultiple(images));
        }

        return ResponseEntity.ok(productRepository.save(product));
    }

    // ================= FARMER: UPDATE PRODUCT =================
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @RequestParam double price,
            @RequestParam int quantity,
            @RequestParam String targetRole,
            @RequestHeader("Authorization") String authHeader
    ) {

        String token = authHeader.replace("Bearer ", "");
        String farmerUniqueId = jwtUtil.extractUniqueId(token);

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getFarmerUniqueId().equals(farmerUniqueId)) {
            return ResponseEntity.status(403).body("Unauthorized");
        }

        product.setPrice(price);
        product.setQuantity(quantity);
        product.setTargetRole(targetRole.toUpperCase());

        return ResponseEntity.ok(productRepository.save(product));
    }

    // ================= FARMER: MY CROPS =================
    @GetMapping("/my")
    public List<Product> myCrops(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String farmerUniqueId = jwtUtil.extractUniqueId(token);
        return productRepository.findByFarmerUniqueId(farmerUniqueId);
    }

    // ================= DISTRIBUTOR MARKET =================
    @GetMapping("/distributor")
    public List<Product> distributorMarket() {
        return productRepository.findByTargetRoleAndStatus("DISTRIBUTOR", "AVAILABLE");
    }

    // ================= CUSTOMER MARKET =================
    @GetMapping("/customer")
    public List<Product> customerMarket() {
        return productRepository.findByTargetRoleAndStatus("CUSTOMER", "AVAILABLE");
    }
    // ================= ADMIN: ALL PRODUCTS =================
@GetMapping("/admin/all")
public List<Product> getAllProducts() {
    return productRepository.findAll();
}
@DeleteMapping("/{id}")
public ResponseEntity<?> deleteProduct(
        @PathVariable Long id,
        @RequestHeader("Authorization") String token
) {
    String jwt = token.replace("Bearer ", "");
    String farmerUniqueId = jwtUtil.extractUniqueId(jwt);

    Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found"));

    // 🔒 Ensure farmer can delete only his own crop
    if (!product.getFarmerUniqueId().equals(farmerUniqueId)) {
        return ResponseEntity.status(403).body("Not allowed");
    }

    productRepository.delete(product);

    return ResponseEntity.ok("Crop deleted successfully");
}


}
