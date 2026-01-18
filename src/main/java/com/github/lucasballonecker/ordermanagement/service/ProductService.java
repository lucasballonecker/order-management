package com.github.lucasballonecker.ordermanagement.service;

import com.github.lucasballonecker.ordermanagement.domain.product.Product;
import com.github.lucasballonecker.ordermanagement.dto.product.ProductRequest;
import com.github.lucasballonecker.ordermanagement.dto.product.ProductResponse;
import com.github.lucasballonecker.ordermanagement.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository repository;

    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    public ProductResponse create(ProductRequest request) {
        Product product = new Product();
        product.setName(request.name());
        product.setDescription(request.description());
        product.setPrice(request.price());

        Product saved = repository.save(product);
        return toResponse(saved);
    }

    public List<ProductResponse> findAllActive() {
        return repository.findAll().stream()
                .filter(Product::isActive)
                .map(this::toResponse)
                .toList();
    }

    public ProductResponse findById(Long id) {
        Product product = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        return toResponse(product);
    }

    public void deactivate(Long id) {
        Product product = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setActive(false);
        repository.save(product);
    }

    private ProductResponse toResponse(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.isActive()
        );
    }
}


