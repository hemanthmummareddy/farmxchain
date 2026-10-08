package com.farmxchain.repository;

import com.farmxchain.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByFarmerUniqueId(String farmerUniqueId);

    List<Product> findByTargetRoleAndStatus(String targetRole, String status);

    long countByFarmerUniqueId(String farmerUniqueId);
}
