package com.farmxchain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.farmxchain.model.User;
import com.farmxchain.model.Role;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUniqueId(String uniqueId);

    Optional<User> findByEmail(String email);

    long countByRole(Role role);
    void deleteByUniqueId(String uniqueId); 
}
