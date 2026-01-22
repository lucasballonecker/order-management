package com.github.lucasballonecker.ordermanagement.service;

import com.github.lucasballonecker.ordermanagement.domain.product.Product;
import com.github.lucasballonecker.ordermanagement.dto.product.ProductRequest;
import com.github.lucasballonecker.ordermanagement.dto.product.ProductResponse;
import com.github.lucasballonecker.ordermanagement.repository.ProductRepository;
import com.github.lucasballonecker.ordermanagement.shared.exceptions.ResourceNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ActiveProfiles("test")
@ExtendWith(MockitoExtension.class)
public class ProductServiceTest {

    @Mock
    private ProductRepository repository;

    @InjectMocks
    private ProductService service;

    @Test
    void shouldCreateProduct() {
        ProductRequest request = new ProductRequest(
                "Notebook",
                "Dell",
                new BigDecimal("4500")
        );

        Product savedProduct = new Product(
                1L,
                "Notebook",
                "Dell",
                new BigDecimal("4500"),
                true
        );

        when(repository.save(any(Product.class))).thenReturn(savedProduct);

        ProductResponse response = service.create(request);

        assertNotNull(response);
        assertEquals("Notebook", response.name());
        assertTrue(response.active());
    }

    @Test
    void shouldThrowExceptionWhenProductNotFound() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> service.findById(99L));
    }
}

