package com.github.lucasballonecker.ordermanagement.repository;

import com.github.lucasballonecker.ordermanagement.domain.product.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
