package com.github.lucasballonecker.ordermanagement.controller;

import com.github.lucasballonecker.ordermanagement.dto.product.ProductResponse;
import com.github.lucasballonecker.ordermanagement.service.ProductService;
import com.github.lucasballonecker.ordermanagement.shared.exceptions.ResourceNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc
public class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ProductService service;

    private ProductResponse testProductResponse;

    @BeforeEach
    void setUp() {
        testProductResponse = new ProductResponse(
                1L,
                "Mouse",
                "Gamer",
                new BigDecimal("150"),
                true
        );
    }

    private String validProductRequestJson() {
        return """
                {
                  "name": "Mouse",
                  "description": "Gamer",
                  "price": 150
                }
                """;
    }

    private String invalidProductRequestJson() {
        return """
                {
                  "name": "",
                  "price": -10
                }
                """;
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldCreateProductWithAdminRole() throws Exception {
        when(service.create(any())).thenReturn(testProductResponse);

        mockMvc.perform(post("/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validProductRequestJson()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Mouse"))
                .andExpect(jsonPath("$.active").value(true));
    }

    @Test
    @WithMockUser(roles = "USER")
    void shouldForbidCreateProductWithUserRole() throws Exception {
        mockMvc.perform(post("/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validProductRequestJson()))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldReturnUnauthorizedWhenNotAuthenticated() throws Exception {
        mockMvc.perform(post("/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validProductRequestJson()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldReturnBadRequestWhenInvalidBody() throws Exception {
        mockMvc.perform(post("/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidProductRequestJson()))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldReturnNotFoundWhenProductDoesNotExist() throws Exception {
        when(service.findById(99L))
                .thenThrow(new ResourceNotFoundException("Produto não encontrado"));

        mockMvc.perform(get("/products/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldFindProductById() throws Exception {
        ProductResponse keyboardResponse = new ProductResponse(
                1L,
                "Teclado Mecânico",
                "Mecânico RGB",
                new BigDecimal("250"),
                true
        );
        
        when(service.findById(1L)).thenReturn(keyboardResponse);

        mockMvc.perform(get("/products/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Teclado Mecânico"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldListAllProducts() throws Exception {
        mockMvc.perform(get("/products"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldDeactivateProductWithAdminRole() throws Exception {
        mockMvc.perform(delete("/products/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(roles = "USER")
    void shouldForbidDeactivateProductWithUserRole() throws Exception {
        mockMvc.perform(delete("/products/1"))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldReturnUnauthorizedWhenDeactivateNotAuthenticated() throws Exception {
        mockMvc.perform(delete("/products/1"))
                .andExpect(status().isUnauthorized());
    }
}


