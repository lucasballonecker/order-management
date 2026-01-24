package com.github.lucasballonecker.ordermanagement.service;

import com.github.lucasballonecker.ordermanagement.domain.product.Product;
import com.github.lucasballonecker.ordermanagement.dto.product.ProductRequest;
import com.github.lucasballonecker.ordermanagement.dto.product.ProductResponse;
import com.github.lucasballonecker.ordermanagement.repository.ProductRepository;
import com.github.lucasballonecker.ordermanagement.shared.exceptions.ResourceNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ProductServiceTest {

    @Mock
    private ProductRepository repository;

    @InjectMocks
    private ProductService service;

    private Product testProduct;
    private Product testProduct2;
    private ProductRequest testProductRequest;

    @BeforeEach
    public void setUp() {
        testProduct = new Product(1L, "Notebook", "Dell", new BigDecimal("4500"), true);
        testProduct2 = new Product(2L, "Mouse", "Logitech", new BigDecimal("150"), true);
        testProductRequest = new ProductRequest("Notebook", "Dell", new BigDecimal("4500"));
    }

    @Test
    public void shouldCreateProduct() {
        when(repository.save(any(Product.class))).thenReturn(testProduct);

        ProductResponse response = service.create(testProductRequest);

        assertNotNull(response);
        assertEquals("Notebook", response.name());
        assertTrue(response.active());
    }

    @Test
    public void shouldThrowExceptionWhenProductNotFound() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> service.findById(99L));
    }

    @Test
    public void shouldFindAllActiveProducts() {
        List<Product> activeProducts = List.of(testProduct, testProduct2);

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
    public void shouldDeactivateProduct() {
        when(repository.findById(1L)).thenReturn(Optional.of(testProduct));
        when(repository.save(any(Product.class))).thenReturn(testProduct);

        service.deactivate(1L);

        assertFalse(testProduct.isActive());
    }

    @Test
    public void shouldThrowExceptionWhenDeactivatingNonExistentProduct() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> service.deactivate(99L));
    }
}

