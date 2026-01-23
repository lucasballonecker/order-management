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
import java.util.List;
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

    @Test
    void shouldFindAllActiveProducts() {
        List<Product> activeProducts = List.of(
                new Product(1L, "Notebook", "Dell", new BigDecimal("4500"), true),
                new Product(2L, "Mouse", "Logitech", new BigDecimal("150"), true)
        );

        when(repository.findByActiveTrue()).thenReturn(activeProducts);

        List<ProductResponse> responses = service.findAllActive();

        assertNotNull(responses);
        assertEquals(2, responses.size());
        assertEquals("Notebook", responses.get(0).name());
        assertEquals("Mouse", responses.get(1).name());
        assertTrue(responses.get(0).active());
        assertTrue(responses.get(1).active());
    }

    @Test
    void shouldDeactivateProduct() {
        Product product = new Product(1L, "Notebook", "Dell", new BigDecimal("4500"), true);
        
        when(repository.findById(1L)).thenReturn(Optional.of(product));
        when(repository.save(any(Product.class))).thenReturn(product);

        service.deactivate(1L);

        assertFalse(product.isActive());
    }

    @Test
    void shouldThrowExceptionWhenDeactivatingNonExistentProduct() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> service.deactivate(99L));
    }
}

